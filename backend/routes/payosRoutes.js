const express = require("express");
const router = express.Router();
const {
  createPaymentLink,
  getPaymentStatus,
  handlePayOSWebhook,
} = require("../controllers/payosController");

router.post("/create-payment-link", createPaymentLink);
router.get("/order-status/:orderCode", getPaymentStatus);
router.post("/webhook", handlePayOSWebhook);

module.exports = router;
