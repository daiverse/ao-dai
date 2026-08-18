const asyncHandler = require("express-async-handler");
const payOS = require("../config/payos");
const Order = require("../models/Order");

// Helper loại bỏ dấu tiếng Việt để đảm bảo mô tả chuyển khoản tương thích PayOS & Ngân Hàng
const sanitizeDescription = (str) => {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim();
};

// @desc    Tạo link thanh toán PayOS + QR Code VietQR
// @route   POST /api/payos/create-payment-link
// @access  Public / Private
const createPaymentLink = asyncHandler(async (req, res) => {
  const { amount, description, items, orderCode: providedOrderCode, returnUrl, cancelUrl } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("Số tiền thanh toán phải lớn hơn 0.");
  }

  // PayOS yêu cầu orderCode dạng số nguyên độc bản (Numeric Integer)
  const numericOrderCode = providedOrderCode
    ? Number(String(providedOrderCode).replace(/\D/g, "")) || Math.floor(100000 + Math.random() * 900000)
    : Math.floor(100000 + Math.random() * 900000);

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  // Sanitize description max 25 ky tự theo chuẩn PayOS
  const cleanDescription = sanitizeDescription(description || `DV${numericOrderCode}`).slice(0, 25);

  const paymentData = {
    orderCode: numericOrderCode,
    amount: Math.round(amount),
    description: cleanDescription || `DV${numericOrderCode}`,
    items: items && items.length > 0 ? items.map(i => ({
      name: sanitizeDescription(i.name || "Ao Dai Thiet Ke").slice(0, 50),
      quantity: Number(i.quantity) || 1,
      price: Math.round(Number(i.price) || amount)
    })) : [
      {
        name: "Ao Dai Thiet Ke Cao Cap",
        quantity: 1,
        price: Math.round(amount)
      }
    ],
    returnUrl: returnUrl || `${clientUrl}/?payment=success&orderCode=${numericOrderCode}`,
    cancelUrl: cancelUrl || `${clientUrl}/?payment=cancel&orderCode=${numericOrderCode}`,
  };

  try {
    const paymentLinkRes = await payOS.createPaymentLink(paymentData);

    console.log(`\n💳 [PAYOS LINK CREATED SUCCESS] Mã đơn: ${numericOrderCode} | Số tiền: ${amount.toLocaleString()} VNĐ | Ngân hàng: ${paymentLinkRes.accountName} (${paymentLinkRes.accountNumber})\n`);

    res.json({
      success: true,
      message: "Tạo liên kết thanh toán PayOS thành công!",
      data: {
        orderCode: numericOrderCode,
        checkoutUrl: paymentLinkRes.checkoutUrl,
        qrCode: paymentLinkRes.qrCode,
        accountNumber: paymentLinkRes.accountNumber,
        accountName: paymentLinkRes.accountName,
        bin: paymentLinkRes.bin,
        amount: paymentLinkRes.amount,
        description: paymentLinkRes.description,
        status: paymentLinkRes.status,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi gọi PayOS SDK API:", error.message || error);

    // Fallback VietQR trực tiếp nếu gọi PayOS bị gián đoạn
    const fallbackQrUrl = `https://img.vietqr.io/image/mb-0394961557-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
      `DV${numericOrderCode}`
    )}&accountName=DAIVERSE%20AO%20DAI`;

    res.json({
      success: true,
      message: "Khởi tạo mã VietQR thanh toán dự phòng thành công!",
      data: {
        orderCode: numericOrderCode,
        checkoutUrl: fallbackQrUrl,
        qrCode: fallbackQrUrl,
        accountNumber: "0394961557",
        accountName: "DAIVERSE AO DAI",
        bin: "970422",
        amount: amount,
        description: `DV${numericOrderCode}`,
        status: "PENDING",
      },
    });
  }
});

// @desc    Kiểm tra trạng thái thanh toán đơn hàng PayOS
// @route   GET /api/payos/order-status/:orderCode
// @access  Public
const getPaymentStatus = asyncHandler(async (req, res) => {
  const { orderCode } = req.params;

  try {
    const numericCode = Number(String(orderCode).replace(/\D/g, ""));
    const paymentInfo = await payOS.getPaymentLinkInformation(numericCode);
    
    // Nếu trạng thái thành công -> Cập nhật DB orderStatus nếu có
    if (paymentInfo && (paymentInfo.status === "PAID" || paymentInfo.amountPaid >= paymentInfo.amount)) {
      try {
        await Order.findOneAndUpdate(
          { $or: [{ orderCode: `DV-2026-${orderCode}` }, { orderCode: orderCode }] },
          { paymentStatus: "Paid", orderStatus: "Confirmed" }
        );
      } catch (e) {}
    }

    res.json({
      success: true,
      status: paymentInfo.status || "PENDING",
      data: paymentInfo,
    });
  } catch (error) {
    console.warn(`[PayOS Status Check Warning] OrderCode: ${orderCode} - ${error.message}`);
    res.json({
      success: true,
      status: "PENDING",
      message: "Đang chờ chuyển khoản...",
    });
  }
});

// @desc    Nhận thông báo Webhook tự động từ PayOS
// @route   POST /api/payos/webhook
// @access  Public
const handlePayOSWebhook = asyncHandler(async (req, res) => {
  try {
    const webhookData = payOS.verifyPaymentWebhookData(req.body);

    if (webhookData) {
      console.log(`\n🎉 [PAYOS WEBHOOK NOTIFICATION] Đơn hàng ${webhookData.orderCode} đã thanh toán ${webhookData.amount?.toLocaleString()} VNĐ!\n`);

      if (webhookData.code === "00" || webhookData.success === true) {
        await Order.findOneAndUpdate(
          { $or: [{ orderCode: `DV-2026-${webhookData.orderCode}` }, { orderCode: String(webhookData.orderCode) }] },
          { paymentStatus: "Paid", orderStatus: "Confirmed" }
        );
      }
    }

    res.json({ success: true, message: "Webhook PayOS xử lý thành công!" });
  } catch (err) {
    console.error("Lỗi Webhook PayOS:", err.message);
    res.json({ success: true, message: "Đã nhận webhook." });
  }
});

module.exports = { createPaymentLink, getPaymentStatus, handlePayOSWebhook };
