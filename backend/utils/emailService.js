const nodemailer = require("nodemailer");

// ── Tạo transporter ───────────────────────────────────────────────────────────
const createTransporter = () => {
  // Nếu chưa có SMTP config → log ra console (dev mode)
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === "465",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
};

// ── Helper gửi mail ───────────────────────────────────────────────────────────
const sendMail = async ({ to, subject, html }) => {
  const transporter = createTransporter();

  if (!transporter) {
    // DEV MODE: log ra console
    console.log("\n📧 ========== EMAIL (DEV MODE) ==========");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log("=========================================\n");
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `DaiVerse <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

// ── Template base ─────────────────────────────────────────────────────────────
const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #FBF9F5; }
    .wrapper { max-width: 560px; margin: 32px auto; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #18392B 0%, #0F241B 100%); padding: 36px 40px; text-align: center; }
    .logo { color: #D4A373; font-size: 28px; font-weight: 800; letter-spacing: 2px; }
    .logo span { color: #fff; }
    .body { padding: 40px; }
    .footer { background: #FBF9F5; padding: 24px 40px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #f0ede8; }
    h2 { color: #18392B; font-size: 22px; margin-bottom: 12px; }
    p { color: #6b7280; font-size: 15px; line-height: 1.7; margin-bottom: 16px; }
    .otp-box { background: #FBF9F5; border: 2px dashed #C85A32; border-radius: 16px; text-align: center; padding: 28px; margin: 24px 0; }
    .otp-code { font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #18392B; font-family: monospace; }
    .otp-note { color: #9ca3af; font-size: 13px; margin-top: 8px; }
    .btn { display: inline-block; background: #C85A32; color: #fff !important; text-decoration: none; padding: 14px 36px; border-radius: 50px; font-weight: 700; font-size: 15px; margin: 20px 0; }
    .warn { background: #FFF8F0; border-left: 4px solid #C85A32; padding: 12px 16px; border-radius: 8px; color: #92400e; font-size: 13px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">Dai<span>Verse</span></div>
      <p style="color:#D4A373;font-size:13px;margin-top:6px;">Áo Dài Việt Nam — Di Sản & Đương Đại</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© 2026 DaiVerse. Hà Nội, Việt Nam</p>
      <p style="margin-top:4px;">admin@daiverse.com.vn · (+84) 394961557</p>
    </div>
  </div>
</body>
</html>
`;

// ── Gửi OTP xác thực email ────────────────────────────────────────────────────
const sendOTPEmail = async (to, otp, name = "bạn") => {
  const subject = `[DaiVerse] Mã xác thực đăng ký tài khoản`;
  const html = baseTemplate(`
    <h2>Xin chào, ${name}! 🌸</h2>
    <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>DaiVerse</strong>. Vui lòng nhập mã OTP dưới đây để xác thực email của bạn:</p>
    <div class="otp-box">
      <div class="otp-code">${otp}</div>
      <p class="otp-note">Mã có hiệu lực trong <strong>10 phút</strong></p>
    </div>
    <p>Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.</p>
    <div class="warn">⚠️ Không chia sẻ mã OTP này với bất kỳ ai, kể cả nhân viên DaiVerse.</div>
  `);

  if (!createTransporter()) {
    console.log(`📧 OTP cho ${to}: ${otp}`);
  }
  await sendMail({ to, subject, html });
};

// ── Gửi link reset mật khẩu ───────────────────────────────────────────────────
const sendResetPasswordEmail = async (to, resetUrl, name = "bạn") => {
  const subject = `[DaiVerse] Yêu cầu đặt lại mật khẩu`;
  const html = baseTemplate(`
    <h2>Đặt lại mật khẩu</h2>
    <p>Xin chào <strong>${name}</strong>, chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
    <p>Nhấn vào nút bên dưới để tạo mật khẩu mới:</p>
    <div style="text-align:center;">
      <a href="${resetUrl}" class="btn">🔑 Đặt lại mật khẩu</a>
    </div>
    <p style="font-size:13px;color:#9ca3af;">Hoặc copy link: <a href="${resetUrl}" style="color:#C85A32;">${resetUrl}</a></p>
    <div class="warn">⚠️ Link này có hiệu lực trong <strong>1 giờ</strong>. Nếu bạn không yêu cầu, hãy bỏ qua email này.</div>
  `);

  await sendMail({ to, subject, html });
};

module.exports = { sendOTPEmail, sendResetPasswordEmail };
