const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Xem giỏ hàng
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "name images price isActive stock"
  );

  if (!cart) {
    cart = { items: [], totalItems: 0, totalPrice: 0 };
  }

  res.json({ success: true, data: cart });
});

// @desc    Thêm sản phẩm vào giỏ hàng
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, size, color, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    res.status(404);
    throw new Error("Sản phẩm không tồn tại hoặc đã ngừng bán.");
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      item.size === size &&
      item.color === color
  );

  if (existingIndex > -1) {
    cart.items[existingIndex].quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      name: product.name,
      image: product.images[0] || "",
      price: product.price,
      size,
      color,
      quantity,
    });
  }

  await cart.save();
  await cart.populate("items.product", "name images price");

  res.json({ success: true, message: `Đã thêm "${product.name}" vào giỏ hàng!`, data: cart });
});

// @desc    Cập nhật số lượng
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) { res.status(404); throw new Error("Giỏ hàng không tồn tại."); }

  const item = cart.items.id(req.params.itemId);
  if (!item) { res.status(404); throw new Error("Sản phẩm không có trong giỏ hàng."); }

  if (quantity <= 0) {
    item.deleteOne();
  } else {
    item.quantity = quantity;
  }

  await cart.save();
  res.json({ success: true, message: "Đã cập nhật giỏ hàng.", data: cart });
});

// @desc    Xóa 1 sản phẩm khỏi giỏ
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error("Giỏ hàng không tồn tại."); }

  cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
  await cart.save();

  res.json({ success: true, message: "Đã xóa sản phẩm khỏi giỏ hàng.", data: cart });
});

// @desc    Xóa toàn bộ giỏ hàng
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.json({ success: true, message: "Đã xóa toàn bộ giỏ hàng." });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
