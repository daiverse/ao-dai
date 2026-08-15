const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  size: { type: String, required: true },
  color: { type: String },
  quantity: { type: Number, required: true, default: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    orderCode: { type: String, required: true, unique: true },
    orderItems: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, default: "Hà Nội" },
      note: { type: String, default: "" },
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "BANK"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Processing", "Confirmed", "Shipping", "Completed", "Cancelled"],
      default: "Processing",
    },
    itemsPrice: { type: Number, required: true, default: 0 },
    shippingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
