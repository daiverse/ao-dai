const { PayOS } = require("@payos/node");
require("dotenv").config();

let payOSInstance = null;

try {
  const clientId = process.env.PAYOS_CLIENT_ID;
  const apiKey = process.env.PAYOS_API_KEY;
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

  if (clientId && apiKey && checksumKey) {
    payOSInstance = new PayOS({
      clientId,
      apiKey,
      checksumKey,
    });

    console.log("✅ Cổng thanh toán PayOS đã khởi tạo thành công với Client ID:", clientId);
  } else {
    console.warn("⚠️  Cảnh báo khởi tạo PayOS: Thiếu cấu hình PAYOS_CLIENT_ID / PAYOS_API_KEY trong backend/.env");
  }
} catch (err) {
  console.warn("⚠️  Cảnh báo khởi tạo PayOS:", err.message);
}

// Interface Wrapper cho SDK v2.0+
const payOS = {
  instance: payOSInstance,
  createPaymentLink: async (paymentData) => {
    if (!payOSInstance) throw new Error("PayOS SDK chưa được khởi tạo thành công");
    return await payOSInstance.paymentRequests.create(paymentData);
  },
  getPaymentLinkInformation: async (orderCode) => {
    if (!payOSInstance) throw new Error("PayOS SDK chưa được khởi tạo thành công");
    return await payOSInstance.paymentRequests.get(orderCode);
  },
  cancelPaymentLink: async (orderCode, reason) => {
    if (!payOSInstance) throw new Error("PayOS SDK chưa được khởi tạo thành công");
    return await payOSInstance.paymentRequests.cancel(orderCode, reason);
  },
  verifyPaymentWebhookData: (webhookBody) => {
    if (!payOSInstance) return null;
    return payOSInstance.webhooks.verify(webhookBody);
  },
  confirmWebhook: async (webhookUrl) => {
    if (!payOSInstance) return null;
    return await payOSInstance.webhooks.confirm(webhookUrl);
  },
};

module.exports = payOS;
