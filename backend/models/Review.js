const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Vui lòng chọn số sao đánh giá"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Vui lòng nhập nội dung đánh giá"],
      trim: true,
    },
    images: [{ type: String }], // Ảnh khách chụp thực tế
    size: String,               // Size đã mua
    color: String,              // Màu đã mua
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Mỗi user chỉ review 1 lần / sản phẩm
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Sau khi lưu review → cập nhật rating trung bình của sản phẩm
reviewSchema.statics.updateProductRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewsCount: stats[0].count,
    });
  } else {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      rating: 0,
      reviewsCount: 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.updateProductRating(this.product);
});

reviewSchema.post("deleteOne", { document: true }, function () {
  this.constructor.updateProductRating(this.product);
});

module.exports = mongoose.model("Review", reviewSchema);
