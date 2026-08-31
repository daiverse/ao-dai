const nodemailer = require("nodemailer");

// ── Transporter A: admin@daiverse.com.vn → dùng cho Mail thông báo Admin ─────
const createTransporter = () => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === "465",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
};

// ── Transporter B: admin@daiverse.com.vn → dùng cho Mail Cảm Ơn Khách Hàng ───
const createAdminTransporter = () => {
  if (!process.env.ADMIN_EMAIL_HOST || !process.env.ADMIN_EMAIL_PASS) {
    return null;
  }
  const port = parseInt(process.env.ADMIN_EMAIL_PORT) || 465;
  const secure = port === 465; // Port 465 dùng SSL, port 587 dùng STARTTLS

  return nodemailer.createTransport({
    host: process.env.ADMIN_EMAIL_HOST,
    port,
    secure,
    auth: {
      user: process.env.ADMIN_EMAIL || "admin@daiverse.com.vn",
      pass: process.env.ADMIN_EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
};

// ── Helper gửi mail qua Transporter A (DaiVerse Admin Mail) ─────────────────
const sendMail = async ({ from, replyTo, to, subject, html }) => {
  const transporter = createTransporter();
  const supportAddress = process.env.EMAIL_USER || "admin@daiverse.com.vn";
  const adminAddress = process.env.ADMIN_EMAIL || "admin@daiverse.com.vn";
  const mailFrom = from || `"DaiVerse Support" <${supportAddress}>`;
  const mailReplyTo = replyTo || adminAddress;

  if (!transporter) {
    console.log("\n📧 [DEV LOG - Support Mail] From:", mailFrom, "→ To:", to, "| Subject:", subject);
    return;
  }

  try {
    const info = await transporter.sendMail({ from: mailFrom, replyTo: mailReplyTo, to, subject, html });
    console.log(`✅ [SUPPORT MAIL SENT] ID: ${info.messageId} | ${mailFrom} ➜ ${to}`);
    return info;
  } catch (err) {
    console.error("❌ [SUPPORT MAIL ERROR]:", err.message);
    throw err;
  }
};

// ── Helper gửi mail qua Transporter B (Admin Mail daiverse.com.vn) ────────────
const sendAdminMail = async ({ to, subject, html }) => {
  const adminAddress = process.env.ADMIN_EMAIL || "admin@daiverse.com.vn";
  const transporter = createAdminTransporter();
  const mailFrom = `"DaiVerse" <${adminAddress}>`;

  // Fallback: nếu chưa cấu hình SMTP admin thì dùng Support Gmail thay thế (với From giả lập)
  if (!transporter || process.env.ADMIN_EMAIL_PASS === "your_admin_email_password_here") {
    console.log(`\n📧 [DEV LOG - Admin Mail] From: ${mailFrom} → To: ${to} | Subject: ${subject}`);
    console.log("⚠️  Chưa cấu hình ADMIN_EMAIL_PASS trong backend/.env — vui lòng điền mật khẩu admin@daiverse.com.vn");
    // Dev fallback: gửi qua Support Gmail với Reply-To là admin
    const supportTransporter = createTransporter();
    if (supportTransporter) {
      try {
        const info = await supportTransporter.sendMail({
          from: `"DaiVerse" <${process.env.EMAIL_USER}>`,
          replyTo: adminAddress,
          to, subject, html,
        });
        console.log(`✅ [ADMIN MAIL - FALLBACK via Gmail] ID: ${info.messageId} | (Reply-To: ${adminAddress}) ➜ ${to}`);
      } catch (err) {
        console.error("❌ [ADMIN MAIL FALLBACK ERROR]:", err.message);
      }
    }
    return;
  }

  try {
    const info = await transporter.sendMail({ from: mailFrom, replyTo: adminAddress, to, subject, html });
    console.log(`✅ [ADMIN MAIL SENT] ID: ${info.messageId} | ${mailFrom} ➜ ${to}`);
  } catch (err) {
    console.error("❌ [ADMIN MAIL ERROR]:", err.message);
  }
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
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #F4F1EA; color: #1F2937; }
    .wrapper { max-width: 620px; margin: 24px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #E5E7EB; }
    .header { background: linear-gradient(135deg, #18392B 0%, #0F241B 100%); padding: 32px 36px; text-align: center; }
    .logo { color: #D4A373; font-size: 26px; font-weight: 800; letter-spacing: 2px; }
    .logo span { color: #ffffff; }
    .body { padding: 32px; }
    .footer { background: #FBF9F5; padding: 20px 36px; text-align: center; color: #6B7280; font-size: 12px; border-top: 1px solid #E5E7EB; }
    h2 { color: #18392B; font-size: 20px; margin-bottom: 12px; font-weight: 700; }
    p { color: #4B5563; font-size: 14px; line-height: 1.6; margin-bottom: 14px; }
    .form-table { w-full; width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 24px; }
    .form-table th { background: #F8F6F0; text-align: left; padding: 10px 14px; font-size: 12px; color: #18392B; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #E5E7EB; }
    .form-table td { padding: 12px 14px; font-size: 13px; border-bottom: 1px solid #F0EDE6; color: #111827; }
    .form-table td.label { font-weight: 700; color: #4B5563; width: 35%; background: #FAF8F5; }
    .badge-24h { background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); color: #ffffff; padding: 14px 20px; border-radius: 12px; font-weight: 800; font-size: 15px; text-transform: uppercase; letter-spacing: 1px; text-align: center; margin-bottom: 24px; box-shadow: 0 4px 14px rgba(220, 38, 38, 0.35); border: 2px solid #FCA5A5; }
    .badge-standard { background: #E0E7FF; color: #3730A3; padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 12px; text-transform: uppercase; display: inline-block; }
    .item-row { border-bottom: 1px solid #F3F4F6; }
    .total-box { background: #FBF9F5; padding: 16px; border-radius: 12px; border: 1px solid #E5E7EB; margin-top: 16px; font-size: 13px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">Dai<span>Verse</span></div>
      <p style="color:#D4A373;font-size:12px;margin-top:4px;font-weight:600;">HỆ THỐNG THÔNG BÁO ĐƠN HÀNG MỚI</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>Email này được tự động gửi từ hệ thống <strong>DaiVerse</strong> tới Quản trị viên <strong>admin@daiverse.com.vn</strong></p>
      <p style="margin-top:4px;color:#9CA3AF;">© 2026 DaiVerse Fashion Studio. Tất cả quyền được bảo lưu.</p>
    </div>
  </div>
</body>
</html>
`;

// ── Gửi Form thông tin đơn hàng từ Mail A (support) đến Mail B (admin) ─────────
const sendNewOrderNotificationToAdmin = async (order) => {
  const mailA = process.env.EMAIL_USER || "admin@daiverse.com.vn";
  const mailB = process.env.ADMIN_EMAIL || "admin@daiverse.com.vn";

  const shipping = order.shippingAddress || {};
  const city = shipping.city || "";
  const note = shipping.note || "";
  const deliveryOption = shipping.deliveryOption || "";

  // CHỈ gắn nhãn "Giao 24h" khi khách hàng chọn sản phẩm trong mục "Đặt 24h"
  const is24hShipping =
    (order.orderItems &&
      order.orderItems.some(
        (item) => item.isExpress24h === true || item.fromExpress24h === true
      )) ||
    order.isExpress24h === true;

  const orderCode = order.orderCode || `DV-${Date.now()}`;
  const formattedTotal = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.totalAmount || 0);

  // Subject Mail
  const subject = is24hShipping
    ? `⚡ [GẮN NHÃN 24H] Đơn hàng hỏa tốc mới: ${orderCode} - Khách: ${shipping.fullName || "Khách hàng"}`
    : `📋 [FORM ĐƠN HÀNG MỚI] ${orderCode} - Khách: ${shipping.fullName || "Khách hàng"}`;

  // Form HTML
  const itemsHtml = (order.orderItems || [])
    .map(
      (item) => `
      <tr class="item-row">
        <td style="padding:10px;font-weight:600;">${item.name || "Áo Dài Thiết Kế"}</td>
        <td style="padding:10px;text-align:center;">${item.size || "M"} / ${item.color || "Tiêu chuẩn"}</td>
        <td style="padding:10px;text-align:center;font-weight:700;">x${item.quantity || 1}</td>
        <td style="padding:10px;text-align:right;font-weight:700;color:#C85A32;">
          ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((item.price || 0) * (item.quantity || 1))}
        </td>
      </tr>
    `
    )
    .join("");

  const html = baseTemplate(`
    ${is24hShipping
      ? `<div class="badge-24h">⚡ GẮN NHÃN GIAO 24H (HỎA TỐC HÀ NỘI)</div>`
      : `<div style="margin-bottom:16px;"><span class="badge-standard">📦 Giao hàng tiêu chuẩn</span></div>`
    }

    <h2>📋 FORM THÔNG TIN KHÁCH HÀNG ĐẶT HÀNG</h2>
    <p>Hệ thống vừa ghi nhận một đơn hàng mới. Thông tin chi tiết khách hàng và đơn hàng như sau:</p>

    <table class="form-table">
      <thead>
        <tr>
          <th colspan="2">👤 THÔNG TIN KHÁCH HÀNG</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="label">Họ và tên:</td>
          <td><strong>${shipping.fullName || "Chưa cung cấp"}</strong></td>
        </tr>
        <tr>
          <td class="label">Số điện thoại:</td>
          <td><a href="tel:${shipping.phone}" style="color:#C85A32;font-weight:700;text-decoration:none;">${shipping.phone || "N/A"}</a></td>
        </tr>
        <tr>
          <td class="label">Địa chỉ giao hàng:</td>
          <td>${shipping.address || "N/A"}</td>
        </tr>
        <tr>
          <td class="label">Tỉnh / Thành phố:</td>
          <td><strong>${shipping.city || "Hà Nội"}</strong></td>
        </tr>
        <tr>
          <td class="label">Ghi chú cho xưởng / shipper:</td>
          <td style="color:#D97706;font-weight:600;">${shipping.note || "Không có ghi chú"}</td>
        </tr>
        <tr>
          <td class="label">Nhãn giao hàng:</td>
          <td>
            ${is24hShipping
      ? `<span style="background:#FEE2E2;color:#DC2626;padding:4px 10px;border-radius:6px;font-weight:800;font-size:12px;">⚡ GẮN NHÃN 24H (GIAO GẤP 2H - 24H)</span>`
      : `<span style="background:#E5E7EB;color:#374151;padding:4px 10px;border-radius:6px;font-weight:600;font-size:12px;">Tiêu chuẩn</span>`
    }
          </td>
        </tr>
      </tbody>
    </table>

    <table class="form-table">
      <thead>
        <tr>
          <th colspan="4">🛍️ CHI TIẾT ĐƠN HÀNG (${orderCode})</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background:#FAF8F5;font-weight:700;font-size:12px;">
          <td style="padding:8px 10px;">Sản phẩm</td>
          <td style="padding:8px 10px;text-align:center;">Phân loại</td>
          <td style="padding:8px 10px;text-align:center;">SL</td>
          <td style="padding:8px 10px;text-align:right;">Thành tiền</td>
        </tr>
        ${itemsHtml}
      </tbody>
    </table>

    <div class="total-box">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
        <span style="color:#6B7280;">Phương thức thanh toán:</span>
        <strong style="color:#005baa;text-transform:uppercase;">${order.paymentMethod || "COD"} (${order.paymentStatus === "Paid" ? "Đã Thanh Toán" : "Chờ Thanh Toán"})</strong>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
        <span style="color:#6B7280;">Phí vận chuyển:</span>
        <strong>${order.shippingFee === 0 ? "Miễn phí (Freeship)" : "30.000 đ"}</strong>
      </div>
      <div style="display:flex;justify-content:space-between;padding-top:10px;border-top:1px dashed #D1D5DB;font-size:15px;font-weight:800;">
        <span style="color:#18392B;">TỔNG GIÁ TRỊ ĐƠN HÀNG:</span>
        <span style="color:#C85A32;">${formattedTotal}</span>
      </div>
    </div>
  `);

  await sendMail({
    from: `"DaiVerse Support System (Mail A)" <${mailA}>`,
    to: mailB,
    subject,
    html,
  });
};

// ── Gửi OTP xác thực email ────────────────────────────────────────────────────
const sendOTPEmail = async (to, otp, name = "bạn") => {
  const subject = `[DaiVerse] Mã xác thực đăng ký tài khoản`;
  const html = baseTemplate(`
    <h2>Xin chào, ${name}! 🌸</h2>
    <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>DaiVerse</strong>. Vui lòng nhập mã OTP dưới đây để xác thực email của bạn:</p>
    <div style="background:#FBF9F5;border:2px dashed #C85A32;border-radius:16px;text-align:center;padding:24px;margin:20px 0;">
      <div style="font-size:40px;font-weight:900;letter-spacing:10px;color:#18392B;font-family:monospace;">${otp}</div>
      <p style="color:#9CA3AF;font-size:12px;margin-top:6px;">Mã có hiệu lực trong <strong>10 phút</strong></p>
    </div>
    <p>Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.</p>
  `);

  await sendMail({ to, subject, html });
};

// ── Gửi link reset mật khẩu ───────────────────────────────────────────────────
const sendResetPasswordEmail = async (to, resetUrl, name = "bạn") => {
  const subject = `[DaiVerse] Yêu cầu đặt lại mật khẩu`;
  const html = baseTemplate(`
    <h2>Đặt lại mật khẩu</h2>
    <p>Xin chào <strong>${name}</strong>, chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${resetUrl}" style="background:#C85A32;color:#fff;text-decoration:none;padding:14px 32px;border-radius:50px;font-weight:700;font-size:14px;display:inline-block;">🔑 Đặt lại mật khẩu</a>
    </div>
  `);

  await sendMail({ to, subject, html });
};

// ── Gửi Email Cảm Ơn Khách Hàng từ admin@daiverse.com.vn đến Khách Hàng ──────
const sendCustomerThankYouEmail = async (order) => {
  const adminMail = process.env.ADMIN_EMAIL || "admin@daiverse.com.vn";
  const customerEmail = order.userEmail || order.shippingAddress?.email || "customer@gmail.com";
  const customerName = order.userName || order.shippingAddress?.fullName || "Quý khách";

  const orderCode = order.orderCode || `DV-${Date.now()}`;
  const shipping = order.shippingAddress || {};
  const formattedTotal = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.totalAmount || 0);

  const subject = `🌸 [DaiVerse] Cảm ơn ${customerName} đã đặt hàng (Mã đơn: ${orderCode})`;

  const itemsHtml = (order.orderItems || [])
    .map(
      (item) => `
      <tr class="item-row">
        <td style="padding:10px;font-weight:600;">${item.name || "Áo Dài Thiết Kế"}</td>
        <td style="padding:10px;text-align:center;">${item.size || "M"} / ${item.color || "Tiêu chuẩn"}</td>
        <td style="padding:10px;text-align:center;font-weight:700;">x${item.quantity || 1}</td>
        <td style="padding:10px;text-align:right;font-weight:700;color:#C85A32;">
          ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((item.price || 0) * (item.quantity || 1))}
        </td>
      </tr>
    `
    )
    .join("");

  const html = baseTemplate(`
    <div style="text-align:center;margin-bottom:20px;">
      <div style="font-size:40px;margin-bottom:8px;">🌸</div>
      <h2 style="color:#18392B;font-size:22px;">CẢM ƠN BẠN ĐÃ LỰA CHỌN DAIVERSE!</h2>
      <p style="color:#6B7280;font-size:13px;">Đơn hàng của bạn đã được hệ thống tiếp nhận và chuyển tới xưởng may thủ công.</p>
    </div>

    <div style="background:#FBF9F5;border-left:4px solid #C85A32;padding:16px;border-radius:12px;margin-bottom:24px;">
      <p style="margin-bottom:6px;font-weight:700;color:#18392B;">Kính gửi chị/anh ${customerName},</p>
      <p style="margin-bottom:0;color:#4B5563;font-size:13px;line-height:1.6;">
        DaiVerse Studio xin chân thành cảm ơn chị/anh đã tin tưởng lựa chọn tà áo dài của chúng tôi. Đội ngũ nghệ nhân đang tiến hành chăm chút từng đường chỉ may để mang đến trang phục hoàn hảo nhất dành cho bạn.
      </p>
    </div>

    <table class="form-table">
      <thead>
        <tr>
          <th colspan="2">📍 THÔNG TIN NHẬN HÀNG — ĐƠN HÀNG #${orderCode}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="label">Họ và tên người nhận:</td>
          <td><strong>${shipping.fullName || customerName}</strong></td>
        </tr>
        <tr>
          <td class="label">Số điện thoại liên hệ:</td>
          <td><strong>${shipping.phone || "N/A"}</strong></td>
        </tr>
        <tr>
          <td class="label">Địa chỉ giao hàng:</td>
          <td>${shipping.address || "N/A"}, ${shipping.city || "Hà Nội"}</td>
        </tr>
        <tr>
          <td class="label">Ghi chú cho xưởng / shipper:</td>
          <td>${shipping.note || "Không có ghi chú"}</td>
        </tr>
      </tbody>
    </table>

    <table class="form-table">
      <thead>
        <tr>
          <th colspan="4">🛍️ DANH SÁCH SẢN PHẨM ĐÃ ĐẶT</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background:#FAF8F5;font-weight:700;font-size:12px;">
          <td style="padding:8px 10px;">Sản phẩm</td>
          <td style="padding:8px 10px;text-align:center;">Phân loại</td>
          <td style="padding:8px 10px;text-align:center;">SL</td>
          <td style="padding:8px 10px;text-align:right;">Thành tiền</td>
        </tr>
        ${itemsHtml}
      </tbody>
    </table>

    <div class="total-box">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
        <span style="color:#6B7280;">Phương thức thanh toán:</span>
        <strong style="color:#005baa;text-transform:uppercase;">${order.paymentMethod || "COD"}</strong>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
        <span style="color:#6B7280;">Phí vận chuyển:</span>
        <strong>${order.shippingFee === 0 ? "Miễn phí (Freeship)" : "30.000 đ"}</strong>
      </div>
      <div style="display:flex;justify-content:space-between;padding-top:10px;border-top:1px dashed #D1D5DB;font-size:15px;font-weight:800;">
        <span style="color:#18392B;">TỔNG GIÁ TRỊ ĐƠN HÀNG:</span>
        <span style="color:#C85A32;">${formattedTotal}</span>
      </div>
    </div>

    <div style="text-align:center;margin-top:28px;padding-top:20px;border-top:1px solid #E5E7EB;color:#6B7280;font-size:12px;">
      <p>Mọi thắc mắc về đơn hàng, quý khách vui lòng liên hệ trực tiếp CSKH DaiVerse Studio:</p>
      <p style="margin-top:4px;">📞 Hotline 24/7: <strong>(+84) 394961557</strong> | ✉️ Email: <strong>${adminMail}</strong></p>
    </div>
  `);

  await sendMail({
    from: `"DaiVerse" <${process.env.EMAIL_USER || "admin@daiverse.com.vn"}>`,  
    replyTo: process.env.ADMIN_EMAIL || "admin@daiverse.com.vn",
    to: customerEmail,
    subject,
    html,
  });
};

// ── Gửi thông báo đặt hàng thiết kế AI đến Admin (kèm ảnh AI & hình thức giao hàng) ──
const sendAiDesignOrderToAdmin = async ({ name, phone, email, size, deliveryOption, address, note, designName, designImage, price }) => {
  const adminMail = process.env.ADMIN_EMAIL || "admin@daiverse.com.vn";
  const orderCode = `AI-${Date.now()}`;
  const is24h = deliveryOption === "express24h";

  const subject = is24h
    ? `⚡ [GẮN NHÃN 24H - ĐẶT HÀNG THIẾT KẾ AI] ${orderCode} — Khách: ${name}`
    : `🎨 [ĐẶT HÀNG THIẾT KẾ AI] ${orderCode} — Khách: ${name}`;

  const imageTag = designImage
    ? `<img src="${designImage}" alt="Thiết kế AI" style="width:100%;max-width:360px;border-radius:12px;border:2px solid #EFB11D;display:block;margin:0 auto;" />`
    : `<p style="color:#9CA3AF;text-align:center;">(Không có ảnh thiết kế)</p>`;

  const html = baseTemplate(`
    ${is24h
      ? `<div class="badge-24h">⚡ GẮN NHÃN GIAO 24H (HỎA TỐC HÀ NỘI - GIAO GẤP 2H - 24H)</div>`
      : `<div style="margin-bottom:16px;"><span class="badge-standard">📦 Giao hàng tiêu chuẩn toàn quốc (Freeship)</span></div>`
    }

    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:36px;margin-bottom:6px;">🎨</div>
      <h2 style="color:#18392B;font-size:20px;">ĐƠN ĐẶT HÀNG THIẾT KẾ AI MỚI</h2>
      <p style="color:#6B7280;font-size:13px;">Khách hàng đã tạo thiết kế AI và xác nhận đặt mua tại DaiVerse Studio</p>
    </div>

    <table class="form-table">
      <thead>
        <tr><th colspan="2">👤 THÔNG TIN KHÁCH HÀNG</th></tr>
      </thead>
      <tbody>
        <tr><td class="label">Mã đơn AI:</td><td><strong style="color:#E43D12;">${orderCode}</strong></td></tr>
        <tr><td class="label">Họ và tên:</td><td><strong>${name}</strong></td></tr>
        <tr><td class="label">Số điện thoại:</td><td><a href="tel:${phone}" style="color:#C85A32;font-weight:700;text-decoration:none;">${phone}</a></td></tr>
        <tr><td class="label">Email khách:</td><td><strong>${email || "Chưa cung cấp email"}</strong></td></tr>
        <tr><td class="label">Hình thức giao hàng:</td><td>
          ${is24h
            ? `<span style="background:#FEE2E2;color:#DC2626;padding:4px 10px;border-radius:6px;font-weight:800;font-size:12px;">⚡ GẮN NHÃN 24H (GIAO GẤP 2H - 24H HÀ NỘI)</span>`
            : `<span style="background:#E5E7EB;color:#374151;padding:4px 10px;border-radius:6px;font-weight:600;font-size:12px;">📦 Giao hàng tiêu chuẩn toàn quốc</span>`
          }
        </td></tr>
        <tr><td class="label">Địa chỉ giao hàng:</td><td>${address || "Chưa nhập địa chỉ cụ thể"}</td></tr>
        <tr><td class="label">Size áo:</td><td><strong>${size}</strong></td></tr>
        <tr><td class="label">Ghi chú:</td><td style="color:#D97706;">${note || "Không có ghi chú"}</td></tr>
      </tbody>
    </table>

    <table class="form-table">
      <thead>
        <tr><th colspan="2">🪡 THÔNG TIN THIẾT KẾ AI</th></tr>
      </thead>
      <tbody>
        <tr><td class="label">Tên thiết kế:</td><td><strong>${designName || "Thiết kế AI DaiVerse"}</strong></td></tr>
        <tr><td class="label">Giá thiết kế:</td><td><strong style="color:#C85A32;font-size:15px;">${price || "2.150.000đ"}</strong></td></tr>
      </tbody>
    </table>

    <div style="margin:24px 0;">
      <p style="font-weight:700;color:#18392B;margin-bottom:12px;font-size:14px;">🖼️ HÌNH ẢNH THIẾT KẾ AI KHÁCH CHỌN:</p>
      <div style="background:#FBF9F5;border:1px solid #E5E7EB;border-radius:16px;padding:16px;text-align:center;">
        ${imageTag}
      </div>
    </div>

    <div style="background:#FEF3C7;border:1px solid #F59E0B;border-radius:12px;padding:14px;margin-top:16px;">
      <p style="font-weight:700;color:#92400E;margin-bottom:4px;">📌 Hành động cần thực hiện:</p>
      <p style="color:#78350F;font-size:13px;margin:0;">Liên hệ khách hàng qua SĐT <strong>${phone}</strong> ${email ? `hoặc Email <strong>${email}</strong>` : ""} để xác nhận đơn hàng và trao đổi chi tiết may đo.</p>
    </div>
  `);

  await sendMail({
    from: `"DaiVerse AI Studio" <${process.env.EMAIL_USER || "admin@daiverse.com.vn"}>`,
    to: adminMail,
    subject,
    html,
  });
};

// ── Gửi Email Cảm Ơn Khách Hàng sau khi đặt Thiết Kế AI ─────────────────────
const sendAiDesignThankYouEmailToCustomer = async ({ email, name, phone, size, deliveryOption, address, note, designName, designImage, price }) => {
  if (!email) return;

  const adminMail = process.env.ADMIN_EMAIL || "admin@daiverse.com.vn";
  const orderCode = `AI-${Date.now()}`;
  const is24h = deliveryOption === "express24h";

  const subject = `🌸 [DaiVerse] Cảm ơn ${name} đã đặt may thiết kế AI (Mã đơn: ${orderCode})`;

  const imageTag = designImage
    ? `<img src="${designImage}" alt="Thiết kế AI" style="width:100%;max-width:360px;border-radius:12px;border:2px solid #EFB11D;display:block;margin:0 auto;" />`
    : `<p style="color:#9CA3AF;text-align:center;">(Mẫu thiết kế áo dài AI của bạn)</p>`;

  const html = baseTemplate(`
    <div style="text-align:center;margin-bottom:20px;">
      <div style="font-size:40px;margin-bottom:8px;">🌸</div>
      <h2 style="color:#18392B;font-size:22px;">CẢM ƠN BẠN ĐÃ ĐẶT MAY THIẾT KẾ AI TẠI DAIVERSE!</h2>
      <p style="color:#6B7280;font-size:13px;">Đơn đặt thiết kế độc bản của bạn đã được chuyển tới các nghệ nhân xưởng may thủ công.</p>
    </div>

    <div style="background:#FBF9F5;border-left:4px solid #C85A32;padding:16px;border-radius:12px;margin-bottom:24px;">
      <p style="margin-bottom:6px;font-weight:700;color:#18392B;">Kính gửi chị/anh ${name},</p>
      <p style="margin-bottom:0;color:#4B5563;font-size:13px;line-height:1.6;">
        DaiVerse Studio xin gửi lời cảm ơn chân thành tới chị/anh đã sáng tạo và lựa chọn thiết kế áo dài độc bản từ AI Studio. Đội ngũ nghệ nhân sẽ sớm liên hệ qua SĐT <strong>${phone}</strong> để xác nhận số đo và hoàn thiện trang phục dành riêng cho bạn.
      </p>
    </div>

    <table class="form-table">
      <thead>
        <tr><th colspan="2">📍 THÔNG TIN ĐƠN ĐẶT HÀNG THIẾT KẾ AI #${orderCode}</th></tr>
      </thead>
      <tbody>
        <tr><td class="label">Họ và tên người nhận:</td><td><strong>${name}</strong></td></tr>
        <tr><td class="label">Số điện thoại liên hệ:</td><td><strong style="color:#C85A32;">${phone}</strong></td></tr>
        <tr><td class="label">Hình thức giao hàng:</td><td>
          ${is24h
            ? `<span style="background:#FEE2E2;color:#DC2626;padding:4px 10px;border-radius:6px;font-weight:800;font-size:12px;">⚡ GIAO HÀNG HỎA TỐC 24H (HÀ NỘI)</span>`
            : `<span style="background:#E5E7EB;color:#374151;padding:4px 10px;border-radius:6px;font-weight:600;font-size:12px;">📦 Giao hàng tiêu chuẩn toàn quốc (Freeship)</span>`
          }
        </td></tr>
        <tr><td class="label">Địa chỉ giao hàng:</td><td>${address || "Sẽ xác nhận qua điện thoại"}</td></tr>
        <tr><td class="label">Size chọn:</td><td><strong>Size ${size}</strong></td></tr>
        <tr><td class="label">Ghi chú may đo:</td><td>${note || "Không có ghi chú"}</td></tr>
      </tbody>
    </table>

    <table class="form-table">
      <thead>
        <tr><th colspan="2">🪡 SẢN PHẨM THIẾT KẾ AI</th></tr>
      </thead>
      <tbody>
        <tr><td class="label">Tên tác phẩm AI:</td><td><strong>${designName || "Áo Dài Thiết Kế AI"}</strong></td></tr>
        <tr><td class="label">Giá sản phẩm:</td><td><strong style="color:#C85A32;font-size:15px;">${price || "2.150.000đ"}</strong></td></tr>
      </tbody>
    </table>

    <div style="margin:24px 0;">
      <p style="font-weight:700;color:#18392B;margin-bottom:12px;font-size:14px;text-align:center;">🖼️ HÌNH ẢNH MẪU THIẾT KẾ AI BẠN ĐÃ TẠO:</p>
      <div style="background:#FBF9F5;border:1px solid #E5E7EB;border-radius:16px;padding:16px;text-align:center;">
        ${imageTag}
      </div>
    </div>

    <div style="text-align:center;margin-top:28px;padding-top:20px;border-top:1px solid #E5E7EB;color:#6B7280;font-size:12px;">
      <p>Mọi thắc mắc về đơn hàng, quý khách vui lòng liên hệ CSKH DaiVerse Studio:</p>
      <p style="margin-top:4px;">📞 Hotline 24/7: <strong>(+84) 394961557</strong> | ✉️ Email: <strong>${adminMail}</strong></p>
    </div>
  `);

  await sendMail({
    from: `"DaiVerse Studio" <${process.env.EMAIL_USER || "admin@daiverse.com.vn"}>`,
    replyTo: adminMail,
    to: email,
    subject,
    html,
  });
};

module.exports = { sendOTPEmail, sendResetPasswordEmail, sendNewOrderNotificationToAdmin, sendCustomerThankYouEmail, sendAiDesignOrderToAdmin, sendAiDesignThankYouEmailToCustomer };
