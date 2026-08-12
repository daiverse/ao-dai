const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Vui lòng nhập tiêu đề bài viết"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Di Sản & Văn Hóa",
        "Bí Quyết Thời Trang",
        "Công Nghệ & Xu Hướng",
        "Chăm Sóc Trang Phục",
        "Câu Chuyện Khách Hàng",
      ],
    },
    content: {
      type: String,
      required: [true, "Vui lòng nhập nội dung bài viết"],
    },
    excerpt: {
      type: String,
      required: [true, "Vui lòng nhập tóm tắt bài viết"],
    },
    image: {
      type: String,
    },
    author: {
      type: String,
      required: true,
      default: "Serene Journal",
    },
    readTime: {
      type: String, // e.g. "5 phút đọc"
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Tự tạo slug từ title
articleSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    const slugify = require("slugify");
    this.slug = slugify(this.title, { lower: true, locale: "vi" }) + "-" + Date.now();
  }
  next();
});

module.exports = mongoose.model("Article", articleSchema);
