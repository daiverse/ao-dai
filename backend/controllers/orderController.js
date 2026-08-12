const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, isExpress24h, deliveryNote, measurements } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("Giỏ hàng trống. Vui lòng thêm sản phẩm.");
  }

  // Tính giá từ DB để tránh gian lận giá
  let itemsPrice = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Sản phẩm ${item.product} không tồn tại.`);
    }
    itemsPrice += product.price * item.quantity;
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0] || "",
      price: product.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      isTailored: item.size === "Tailored" || item.size === "Tailored (May theo số đo)",
    });
  }

  const shippingFee = isExpress24h ? 50000 : (itemsPrice >= 2000000 ? 0 : 30000);
  const totalPrice = itemsPrice + shippingFee;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || "cod",
    itemsPrice,
    shippingFee,
    totalPrice,
    isExpress24h: isExpress24h || false,
    deliveryNote: deliveryNote || "",
    measurements: measurements || {},
  });

  // Xóa giỏ hàng sau khi đặt hàng
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(201).json({
    success: true,
    message: `Đặt hàng thành công! Mã đơn: ${order.orderNumber}`,
    data: order,
  });
});

// @desc    Lịch sử đơn hàng của tôi
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate("items.product", "name images");

  res.json({ success: true, data: orders });
});

// @desc    Chi tiết đơn hàng
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.product", "name images fabric");

  if (!order) { res.status(404); throw new Error("Không tìm thấy đơn hàng."); }

  // Chỉ cho xem đơn của chính mình hoặc admin
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Không có quyền xem đơn hàng này.");
  }

  res.json({ success: true, data: order });
});

// @desc    Hủy đơn hàng
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) { res.status(404); throw new Error("Không tìm thấy đơn hàng."); }
  if (order.user.toString() !== req.user._id.toString()) { res.status(403); throw new Error("Không có quyền hủy đơn này."); }
  if (!["pending", "confirmed"].includes(order.status)) {
    res.status(400);
    throw new Error("Không thể hủy đơn hàng đang xử lý hoặc đã giao.");
  }

  order.status = "cancelled";
  order.cancelReason = req.body.reason || "Khách hàng yêu cầu hủy";
  await order.save();

  res.json({ success: true, message: "Đã hủy đơn hàng thành công.", data: order });
});

// @desc    Lấy tất cả đơn hàng [Admin]
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.isExpress24h === "true") filter.isExpress24h = true;

  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("user", "name email phone");

  res.json({
    success: true,
    data: orders,
    pagination: { total, page, pages: Math.ceil(total / limit) },
  });
});

// @desc    Cập nhật trạng thái đơn hàng [Admin]
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error("Không tìm thấy đơn hàng."); }

  order.status = req.body.status;
  if (req.body.status === "delivered") order.deliveredAt = new Date();

  await order.save();
  res.json({ success: true, message: "Cập nhật trạng thái đơn hàng thành công!", data: order });
});

module.exports = { createOrder, getMyOrders, getOrderById, cancelOrder, getAllOrders, updateOrderStatus };
