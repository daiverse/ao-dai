const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// In-memory fallback cart store (dùng khi chưa kết nối MongoDB)
const inMemoryCarts = new Map(); // userId -> { items: [], totalPrice, totalItems }

const isDBConnected = () => mongoose.connection.readyState === 1;

// @desc    Xem giỏ hàng của user
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();

  if (isDBConnected()) {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name images price isActive stock"
    );
    if (!cart) {
      cart = { items: [], totalItems: 0, totalPrice: 0 };
    }
    return res.json({ success: true, data: cart });
  }

  // Fallback in-memory
  const userCart = inMemoryCarts.get(userId) || { items: [] };
  const totalPrice = userCart.items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);
  const totalItems = userCart.items.reduce((sum, i) => sum + i.quantity, 0);

  res.json({
    success: true,
    data: { items: userCart.items, totalItems, totalPrice },
  });
});

// @desc    Thêm sản phẩm vào giỏ hàng
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();
  const { productId, name, image, price, size, color, quantity = 1 } = req.body;

  if (isDBConnected()) {
    let product = await Product.findById(productId);
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) =>
        item.product && item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        name: name || product?.name || "Sản phẩm Áo Dài",
        image: image || product?.images?.[0] || "",
        price: price || product?.price || 0,
        size,
        color,
        quantity,
      });
    }

    await cart.save();
    return res.json({
      success: true,
      message: `Đã thêm vào giỏ hàng của tài khoản!`,
      data: cart,
    });
  }

  // Fallback In-memory
  let userCart = inMemoryCarts.get(userId) || { items: [] };
  const existingIndex = userCart.items.findIndex(
    (item) =>
      (item.productId === productId || item.name === name) &&
      item.size === size &&
      item.color === color
  );

  if (existingIndex > -1) {
    userCart.items[existingIndex].quantity += quantity;
  } else {
    userCart.items.push({
      _id: "item_" + Date.now(),
      productId,
      name,
      image,
      price,
      size,
      color,
      quantity,
    });
  }

  inMemoryCarts.set(userId, userCart);

  const totalPrice = userCart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = userCart.items.reduce((sum, i) => sum + i.quantity, 0);

  res.json({
    success: true,
    message: `Đã lưu vào giỏ hàng của tài khoản thành công!`,
    data: { items: userCart.items, totalItems, totalPrice },
  });
});

// @desc    Cập nhật số lượng
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();
  const { quantity } = req.body;

  if (isDBConnected()) {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) { res.status(404); throw new Error("Giỏ hàng không tồn tại."); }

    const item = cart.items.id(req.params.itemId);
    if (item) {
      if (quantity <= 0) item.deleteOne();
      else item.quantity = quantity;
      await cart.save();
    }
    return res.json({ success: true, message: "Đã cập nhật giỏ hàng.", data: cart });
  }

  // Fallback in-memory
  const userCart = inMemoryCarts.get(userId) || { items: [] };
  if (quantity <= 0) {
    userCart.items = userCart.items.filter((i) => i._id !== req.params.itemId);
  } else {
    const item = userCart.items.find((i) => i._id === req.params.itemId);
    if (item) item.quantity = quantity;
  }

  inMemoryCarts.set(userId, userCart);
  res.json({ success: true, message: "Đã cập nhật giỏ hàng.", data: userCart });
});

// @desc    Xóa 1 sản phẩm khỏi giỏ
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();

  if (isDBConnected()) {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
      await cart.save();
    }
    return res.json({ success: true, message: "Đã xóa sản phẩm khỏi giỏ hàng." });
  }

  // Fallback in-memory
  const userCart = inMemoryCarts.get(userId) || { items: [] };
  userCart.items = userCart.items.filter((i) => i._id !== req.params.itemId);
  inMemoryCarts.set(userId, userCart);

  res.json({ success: true, message: "Đã xóa sản phẩm khỏi giỏ hàng." });
});

// @desc    Xóa toàn bộ giỏ hàng
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();

  if (isDBConnected()) {
    await Cart.findOneAndDelete({ user: req.user._id });
  }
  inMemoryCarts.delete(userId);

  res.json({ success: true, message: "Đã xóa toàn bộ giỏ hàng." });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
