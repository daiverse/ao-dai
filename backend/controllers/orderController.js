const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const inMemoryOrders = [];
const isDBConnected = () => mongoose.connection.readyState === 1;

// @desc    Tạo đơn hàng mới (Checkout)
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingFee = 0,
    totalAmount,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("Giỏ hàng không có sản phẩm.");
  }

  // Tạo mã đơn hàng độc bản DV-2026-XXXX
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderCode = `DV-2026-${randomSuffix}`;

  const userEmail = req.user.email || "user@daiverse.com.vn";
  const userName = req.user.name || shippingAddress.fullName;

  let order;

  if (isDBConnected()) {
    order = new Order({
      user: req.user._id,
      userEmail,
      userName,
      orderCode,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Pending",
      orderStatus: "Processing",
      itemsPrice,
      shippingFee,
      totalAmount,
    });

    await order.save();
    // Xóa giỏ hàng sau khi đặt thành công
    await Cart.findOneAndDelete({ user: req.user._id });
  } else {
    // Fallback in-memory
    order = {
      _id: "order_" + Date.now(),
      userEmail,
      userName,
      orderCode,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: "Pending",
      orderStatus: "Processing",
      itemsPrice,
      shippingFee,
      totalAmount,
      createdAt: new Date().toISOString(),
    };
    inMemoryOrders.unshift(order);
  }

  console.log(`\n🛍️ [ĐƠN HÀNG MỚI KHỞI TẠO] Mã: ${orderCode} | Tổng: ${totalAmount.toLocaleString()} VNĐ | PT: ${paymentMethod}\n`);

  res.status(201).json({
    success: true,
    message: "Đặt hàng thành công! DaiVerse đã tiếp nhận đơn hàng của bạn.",
    order,
  });
});

// @desc    Xem danh sách đơn hàng của tôi
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  if (isDBConnected()) {
    const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
    return res.json({ success: true, count: orders.length, orders });
  }

  const userEmail = req.user.email || "";
  const userOrders = inMemoryOrders.filter((o) => o.userEmail === userEmail);
  res.json({ success: true, count: userOrders.length, orders: userOrders });
});

// @desc    Xem chi tiết 1 đơn hàng theo mã orderCode hoặc ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const param = req.params.id;

  if (isDBConnected()) {
    const order = await Order.findOne({
      $or: [{ _id: mongoose.Types.ObjectId.isValid(param) ? param : null }, { orderCode: param }],
    });
    if (!order) {
      res.status(404);
      throw new Error("Không tìm thấy đơn hàng.");
    }
    return res.json({ success: true, order });
  }

  const order = inMemoryOrders.find((o) => o._id === param || o.orderCode === param);
  if (!order) {
    res.status(404);
    throw new Error("Không tìm thấy đơn hàng.");
  }
  res.json({ success: true, order });
});

module.exports = { createOrder, getMyOrders, getOrderById };
