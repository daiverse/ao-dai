const asyncHandler = require("express-async-handler");
const Review = require("../models/Review");
const Order = require("../models/Order");

// @desc    Lấy đánh giá của 1 sản phẩm
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Review.countDocuments({
    product: req.params.productId,
    isApproved: true,
  });

  const reviews = await Review.find({
    product: req.params.productId,
    isApproved: true,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("user", "name avatar");

  res.json({
    success: true,
    data: reviews,
    pagination: { total, page, pages: Math.ceil(total / limit) },
  });
});

// @desc    Tạo đánh giá
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment, images, size, color } = req.body;

  // Kiểm tra đã mua hàng chưa
  const hasPurchased = await Order.findOne({
    user: req.user._id,
    "items.product": productId,
    status: "delivered",
  });

  // Kiểm tra đã review chưa
  const existingReview = await Review.findOne({
    user: req.user._id,
    product: productId,
  });

  if (existingReview) {
    res.status(400);
    throw new Error("Bạn đã đánh giá sản phẩm này rồi.");
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    comment,
    images: images || [],
    size,
    color,
    isVerifiedPurchase: !!hasPurchased,
  });

  await review.populate("user", "name avatar");

  res.status(201).json({
    success: true,
    message: "Cảm ơn bạn đã đánh giá!",
    data: review,
  });
});

// @desc    Xóa đánh giá [Admin hoặc chủ review]
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) { res.status(404); throw new Error("Không tìm thấy đánh giá."); }

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Không có quyền xóa đánh giá này.");
  }

  await review.deleteOne();
  res.json({ success: true, message: "Đã xóa đánh giá." });
});

module.exports = { getProductReviews, createReview, deleteReview };
