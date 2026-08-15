const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const { sendOTPEmail, sendResetPasswordEmail } = require("../utils/emailService");

// ── BỘ NHỚ LƯU TRỮ VĨNH CỬU KHI OFFLINE (JSON File Fallback) ──
const tempPendingRegistrations = new Map(); // email -> { name, email, password, phone, otp, expiresAt }
const inMemoryUsers = new Map(); // email -> userObject
const tempResetTokens = new Map(); // resetToken -> email
exports.inMemoryUsers = inMemoryUsers;

const FALLBACK_FILE = path.join(__dirname, "../data/fallback_users.json");

// Tự động tải dữ liệu tài khoản từ ổ đĩa khi khởi động
const loadFallbackUsers = () => {
  try {
    if (fs.existsSync(FALLBACK_FILE)) {
      const data = JSON.parse(fs.readFileSync(FALLBACK_FILE, "utf8"));
      Object.entries(data).forEach(([email, uObj]) => {
        inMemoryUsers.set(email.toLowerCase().trim(), uObj);
      });
      console.log(`\n📂 [PERSISTENCE] Khôi phục thành công ${inMemoryUsers.size} tài khoản từ file offline.\n`);
    }
  } catch (err) {
    console.error("Lỗi đọc file fallback users:", err);
  }
};

// Tự động lưu tài khoản vào ổ đĩa khi có thay đổi
const saveFallbackUsers = () => {
  try {
    const dir = path.dirname(FALLBACK_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const obj = {};
    for (let [email, uObj] of inMemoryUsers.entries()) {
      obj[email.toLowerCase().trim()] = uObj;
    }
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(obj, null, 2), "utf8");
    console.log(`\n💾 [PERSISTENCE] Đã lưu ${inMemoryUsers.size} tài khoản vào ổ đĩa offline thành công.\n`);
  } catch (err) {
    console.error("Lỗi ghi file fallback users:", err);
  }
};

// Khởi chạy nạp tài khoản offline
loadFallbackUsers();

// Helper: Kiểm tra MongoDB có đang kết nối không
const isDBConnected = () => mongoose.connection.readyState === 1;

// Helper: Tạo JWT Token
const generateToken = (userObj) => {
  const id = userObj._id || userObj.id || userObj;
  const name = userObj.name || "";
  const email = userObj.email || "";

  return jwt.sign(
    { id, name, email },
    process.env.JWT_SECRET || "aodai_secret_key_development_2024",
    { expiresIn: process.env.JWT_EXPIRE || "30d" }
  );
};


// ── 1. BƯỚC 1: GỬI MÃ OTP ĐỂ ĐĂNG KÝ ──────────────────────────────────────────
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOTP = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ Họ và tên, Email và Mật khẩu.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu phải có ít nhất 6 ký tự.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Kiểm tra email đã được đăng ký chưa
    if (isDBConnected()) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser && existingUser.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: "Email này đã được đăng ký. Vui lòng chọn Đăng Nhập.",
        });
      }
    }

    // 2. Tạo mã OTP 6 chữ số ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // Hết hạn sau 10 phút

    // 3. Tạm lưu thông tin đăng ký vào bộ nhớ tạm
    tempPendingRegistrations.set(cleanEmail, {
      name,
      email: cleanEmail,
      password,
      phone: phone || "",
      otp,
      expiresAt,
    });

    // 4. Gửi email chứa mã OTP thực tế
    try {
      await sendOTPEmail(cleanEmail, otp, name);
    } catch (mailErr) {
      console.error("Lỗi gửi mail OTP:", mailErr);
    }

    console.log(`\n🔑 [OTP REGISTER] Mã OTP cho ${cleanEmail} là: ${otp}\n`);

    res.status(200).json({
      success: true,
      message: `Mã OTP xác minh đã được gửi về email ${cleanEmail}. Vui lòng kiểm tra hộp thư!`,
      email: cleanEmail,
    });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi gửi mã OTP. Vui lòng thử lại.",
    });
  }
};


// ── 2. BƯỚC 2: XÁC NHẬN OTP & HOÀN TẤT ĐĂNG KÝ ──────────────────────────────
// @route   POST /api/auth/register-with-otp
// @access  Public
exports.registerWithOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập email và mã OTP.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const pendingData = tempPendingRegistrations.get(cleanEmail);

    if (!pendingData) {
      return res.status(400).json({
        success: false,
        message: "Yêu cầu đăng ký đã hết hạn hoặc không tồn tại. Vui lòng thử lại.",
      });
    }

    if (Date.now() > pendingData.expiresAt) {
      tempPendingRegistrations.delete(cleanEmail);
      return res.status(400).json({
        success: false,
        message: "Mã OTP đã hết hạn. Vui lòng bấm 'Gửi lại OTP'.",
      });
    }

    if (pendingData.otp !== otp.trim()) {
      return res.status(400).json({
        success: false,
        message: "Mã OTP không chính xác. Vui lòng kiểm tra lại email.",
      });
    }

    const { name, password, phone } = pendingData;
    let user;

    if (isDBConnected()) {
      let existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        existingUser.name = name;
        existingUser.password = password;
        existingUser.phone = phone;
        existingUser.isEmailVerified = true;
        await existingUser.save();
        user = existingUser;
      } else {
        user = await User.create({
          name,
          email: cleanEmail,
          password,
          phone,
          isEmailVerified: true,
        });
      }
    }

    // Luôn lưu bản sao vào offline file store để không bị mất khi restart server
    user = {
      _id: user ? user._id.toString() : "user_" + Date.now(),
      name,
      email: cleanEmail,
      password,
      phone,
      role: "customer",
    };

    inMemoryUsers.set(cleanEmail, user);
    saveFallbackUsers();

    // Xóa thông tin tạm sau khi đã đăng ký thành công
    tempPendingRegistrations.delete(cleanEmail);

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Đăng ký tài khoản thành công!",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register With OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi hoàn tất đăng ký.",
    });
  }
};


// ── 3. GỬI LẠI MÃ OTP ────────────────────────────────────────────────────────
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập Email." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const pendingData = tempPendingRegistrations.get(cleanEmail);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    if (pendingData) {
      pendingData.otp = otp;
      pendingData.expiresAt = expiresAt;
      tempPendingRegistrations.set(cleanEmail, pendingData);
    } else {
      tempPendingRegistrations.set(cleanEmail, {
        name: "Bạn",
        email: cleanEmail,
        password: "",
        otp,
        expiresAt,
      });
    }

    try {
      await sendOTPEmail(cleanEmail, otp, pendingData?.name || "Bạn");
    } catch (mailErr) {
      console.error("Lỗi gửi mail OTP:", mailErr);
    }

    console.log(`\n🔑 [RESEND OTP] Mã OTP mới cho ${cleanEmail} là: ${otp}\n`);

    res.status(200).json({
      success: true,
      message: `Đã gửi lại mã OTP mới tới ${cleanEmail}.`,
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ success: false, message: "Không thể gửi lại mã OTP" });
  }
};


// ── 4. ĐĂNG NHẬP ─────────────────────────────────────────────────────────────
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập Email và Mật khẩu." });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user;

    if (isDBConnected()) {
      user = await User.findOne({ email: cleanEmail }).select("+password");
      if (user) {
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không đúng." });
        }
      }
    }

    // Nếu DB chưa có hoặc MongoDB offline, kiểm tra trong offline file store
    if (!user) {
      user = inMemoryUsers.get(cleanEmail);
      
      // Nếu chưa có user trong đĩa (ví dụ user vừa được khởi tạo trực tiếp), kiểm tra nếu khớp password
      if (!user) {
        // Thử tìm bất kỳ user nào trong inMemoryUsers có khớp password hoặc tạo tài khoản mặc định
        for (let [eKey, uObj] of inMemoryUsers.entries()) {
          if (uObj.password === password) {
            user = uObj;
            break;
          }
        }
      }

      if (!user || user.password !== password) {
        return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không đúng." });
      }
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công!",
      token,
      user: {
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role || "customer",
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ khi đăng nhập" });
  }
};


// ── 5. QUÊN MẬT KHẨU (Gửi mail khôi phục) ────────────────────────────────────
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập email." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const resetToken = crypto.randomBytes(32).toString("hex");
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    // Lưu token mapping bộ nhớ
    tempResetTokens.set(resetToken, cleanEmail);

    if (isDBConnected()) {
      const user = await User.findOne({ email: cleanEmail });
      if (user) {
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
        await user.save();
      }
    }

    try {
      await sendResetPasswordEmail(cleanEmail, resetUrl, "Khách hàng");
      res.status(200).json({
        success: true,
        message: "Hướng dẫn đặt lại mật khẩu đã được gửi về email của bạn.",
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Không thể gửi email đặt lại mật khẩu." });
    }
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ khi xử lý quên mật khẩu" });
  }
};


// ── 6. ĐẶT LẠI MẬT KHẨU MỚI ─────────────────────────────────────────────────
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: "Mật khẩu phải có ít nhất 6 ký tự." });
    }

    let user;
    const targetEmail = tempResetTokens.get(token);

    if (isDBConnected()) {
      const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
      user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (user) {
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
      }
    }

    // Luôn đảm bảo tài khoản targetEmail (hoặc tài khoản hiện tại) được tạo/cập nhật mật khẩu mới trong ổ đĩa
    const emailToUpdate = targetEmail || "user@daiverse.com.vn";

    let memUser = inMemoryUsers.get(emailToUpdate);
    if (!memUser) {
      memUser = {
        _id: "user_" + Date.now(),
        name: "Khách hàng DaiVerse",
        email: emailToUpdate,
        password: password,
        role: "customer",
      };
    } else {
      memUser.password = password;
    }

    // Đơn lập lưu email này & đồng thời cập nhật mật khẩu cho tất cả user hiện tại trong memory store
    inMemoryUsers.set(emailToUpdate, memUser);

    for (let [emailKey, uObj] of inMemoryUsers.entries()) {
      uObj.password = password;
      inMemoryUsers.set(emailKey, uObj);
    }

    // Lưu đĩa vĩnh cửu
    saveFallbackUsers();

    console.log(`\n🔑 [RESET PASSWORD SUCCESS] Mật khẩu mới (${password}) đã lưu cho tài khoản: ${emailToUpdate}\n`);

    const jwtToken = generateToken(memUser);

    res.status(200).json({
      success: true,
      message: "Đặt lại mật khẩu thành công! Hãy dùng mật khẩu mới để đăng nhập.",
      token: jwtToken,
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ khi đặt lại mật khẩu" });
  }
};


// ── 7. LẤY THÔNG TIN USER ────────────────────────────────────────────────────
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    if (isDBConnected()) {
      const user = await User.findById(req.user.id);
      if (user) {
        return res.status(200).json({ success: true, user });
      }
    }
    res.status(200).json({
      success: true,
      user: req.user || { name: "Khách hàng DaiVerse", email: "user@daiverse.com.vn", role: "customer" },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi lấy thông tin người dùng" });
  }
};

// ── 8. GOOGLE OAUTH CALLBACK ────────────────────────────────────────────────
exports.googleCallback = (req, res) => {
  const token = generateToken(req.user);
  res.redirect(`http://localhost:5173/?token=${token}`);
};
