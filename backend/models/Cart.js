const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: false,
  },
  name: String,
  image: String,
  price: Number,
  size: { type: String, required: true },
  color: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  isCustomAi: { type: Boolean, default: false },
  customOptions: { type: Object, default: {} },
  customPrompt: { type: String, default: "" },
  baseAoDaiName: { type: String, default: "" },
  aiGeneratedImage: { type: String, default: "" },
  tryOnImage: { type: String, default: "" },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

// Tính tổng tiền
cartSchema.virtual("totalPrice").get(function () {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

// Tổng số lượng
cartSchema.virtual("totalItems").get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

module.exports = mongoose.model("Cart", cartSchema);
