const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mongoose = require("mongoose");
const User = require("../models/User");
const { sendOTPEmail, sendResetPasswordEmail } = require("../utils/emailService");

// ── BỘ NHỚ TẠM (In-memory store cho OTP đăng ký & Fallback khi chưa có DB) ──
const tempPendingRegistrations = new Map(); // email -> { name, email, password, phone, otp, expiresAt }
const inMemoryUsers = new Map(); // email -> userObject (Fallback nếu MongoDB ko kết nối)
exports.inMemoryUsers = inMemoryUsers;

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
    } else {
      const existingMemUser = inMemoryUsers.get(cleanEmail);
      if (existingMemUser) {
        return res.status(400).json({
          success: false,
          message: "Email này đã được đăng ký. Vui lòng chọn Đăng Nhập.",
        });
      }
    }

    // 2. Tạo mã OTP 6 chữ số (hạn 10 phút)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    // 3. Lưu thông tin đăng ký tạm thời
    tempPendingRegistrations.set(cleanEmail, {
      name,
      email: cleanEmail,
      password,
      phone: phone || "",
      otp,
      expiresAt,
    });

    // 4. Gửi email chứa mã OTP
    try {
      await sendOTPEmail(cleanEmail, otp, name);
    } catch (mailErr) {
      console.error("Lỗi khi gửi email OTP:", mailErr);
    }

    console.log(`\n🔑 [OTP REGISTER] Mã OTP cho ${cleanEmail} là: ${otp}\n`);

    res.status(200).json({
      success: true,
      message: `Mã OTP đã được gửi về email ${cleanEmail}. Vui lòng nhập OTP để hoàn tất đăng ký!`,
      email: cleanEmail,
      requireOTP: true,
    });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi máy chủ khi gửi mã OTP",
    });
  }
};

// ── 2. BƯỚC 2: NHẬP OTP XÁC NHẬN -> HOÀN TẤT ĐĂNG KÝ ─────────────────────────
// @route   POST /api/auth/register-with-otp
// @access  Public
exports.registerWithOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập Email và Mã OTP 6 chữ số.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const pendingData = tempPendingRegistrations.get(cleanEmail);

    if (!pendingData) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy yêu cầu đăng ký cho email này hoặc mã đã hết hạn. Vui lòng bấm gửi lại mã.",
      });
    }

    if (Date.now() > pendingData.expiresAt) {
      tempPendingRegistrations.delete(cleanEmail);
      return res.status(400).json({
        success: false,
        message: "Mã OTP đã hết hạn. Vui lòng bấm gửi lại OTP mới.",
      });
    }

    if (pendingData.otp !== otp.trim()) {
      return res.status(400).json({
        success: false,
        message: "Mã OTP không đúng. Vui lòng kiểm tra lại email.",
      });
    }

    // OTP chính xác! -> Tạo tài khoản chính thức trong DB
    let user;

    if (isDBConnected()) {
      user = await User.findOne({ email: cleanEmail });
      if (!user) {
        user = new User({
          name: pendingData.name,
          email: cleanEmail,
          password: pendingData.password,
          phone: pendingData.phone,
          isEmailVerified: true,
        });
      } else {
        user.name = pendingData.name;
        user.password = pendingData.password;
        user.phone = pendingData.phone;
        user.isEmailVerified = true;
      }
      await user.save();
    } else {
      // Fallback lưu bộ nhớ tạm nếu MongoDB không chạy
      user = {
        _id: "mem_" + Date.now(),
        name: pendingData.name,
        email: cleanEmail,
        password: pendingData.password,
        phone: pendingData.phone,
        role: "customer",
        avatar: "",
        isEmailVerified: true,
      };
      inMemoryUsers.set(cleanEmail, user);
    }

    // Xóa dữ liệu chờ sau khi hoàn tất đăng ký
    tempPendingRegistrations.delete(cleanEmail);

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "🎉 Đăng ký tài khoản thành công!",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "customer",
        avatar: user.avatar || "",
        phone: user.phone || "",
        isEmailVerified: true,
      },
    });
  } catch (error) {
    console.error("Register With OTP Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi máy chủ khi hoàn tất đăng ký",
    });
  }
};

// ── 3. GỬI LẠI MÃ OTP ─────────────────────────────────────────────────────────
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập email." });
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
      if (!user) {
        return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không đúng." });
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không đúng." });
      }
    } else {
      // In-memory fallback
      user = inMemoryUsers.get(cleanEmail);
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
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "customer",
        avatar: user.avatar || "",
        phone: user.phone || "",
        isEmailVerified: true,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ khi đăng nhập" });
  }
};

// ── 5. QUÊN MẬT KHẨU ─────────────────────────────────────────────────────────
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

    if (isDBConnected()) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản với email này." });
      }
      user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();
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
    if (isDBConnected()) {
      const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
      user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ success: false, message: "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn." });
      }

      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
    }

    const jwtToken = generateToken(user ? user._id : "mem_user");

    res.status(200).json({
      success: true,
      message: "Đặt lại mật khẩu thành công!",
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
    // Return standard fallback user if memory
    res.status(200).json({
      success: true,
      user: req.user || { name: "Khách hàng DaiVerse", email: "user@daiverse.com.vn", role: "customer" },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

// ── 8. GOOGLE CALLBACK ───────────────────────────────────────────────────────
exports.googleCallback = (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/?auth_error=google_failed`);
    }
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/?auth_token=${token}`);
  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/?auth_error=server_error`);
  }
};
