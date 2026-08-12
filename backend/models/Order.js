const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String, required: true },
  color: { type: String, required: true },
  isTailored: { type: Boolean, default: false },
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  province: { type: String, required: true },
  district: { type: String, required: true },
  ward: { type: String, required: true },
  street: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderNumber: {
      type: String,
      unique: true,
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      enum: ["cod", "banking", "momo", "vnpay"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    status: {
      type: String,
      enum: [
        "pending",      // Chờ xác nhận
        "confirmed",    // Đã xác nhận
        "processing",   // Đang xử lý / may đo
        "shipping",     // Đang giao hàng
        "delivered",    // Đã giao
        "cancelled",    // Đã hủy
      ],
      default: "pending",
    },
    itemsPrice: { type: Number, required: true, default: 0 },
    shippingFee: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    isExpress24h: { type: Boolean, default: false },
    deliveryNote: { type: String, default: "" },
    measurements: {
      bust: Number,
      waist: Number,
      hips: Number,
      height: Number,
      shoulderWidth: Number,
      armLength: Number,
      dressLength: Number,
    },
    cancelReason: { type: String },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

// Tự tạo orderNumber trước khi lưu
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    this.orderNumber = `AD-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
