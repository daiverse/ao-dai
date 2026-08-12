const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true }, // hex color
});

const hotspotSchema = new mongoose.Schema({
  x: String,
  y: String,
  title: String,
  description: String,
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng nhập tên sản phẩm"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    collection: {
      type: String,
      required: true,
      enum: ["mong-lien", "trang-trong-lua", "huong-co-do"],
    },
    category: {
      type: String,
      required: true,
      enum: ["cuoi", "truyen-thong", "cach-tan", "theu-tay", "express24h"],
    },
    price: {
      type: Number,
      required: [true, "Vui lòng nhập giá"],
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 100,
      min: 0,
    },
    fabric: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Vui lòng nhập mô tả sản phẩm"],
    },
    colors: [colorSchema],
    sizes: {
      type: [String],
      enum: ["XS", "S", "M", "L", "XL", "XXL", "Tailored (May theo số đo)", "Tailored"],
      default: ["S", "M", "L"],
    },
    images: [{ type: String }],
    isNew: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isExpress24h: { type: Boolean, default: false },
    expressTag: { type: String, default: "" },
    has360View: { type: Boolean, default: false },
    hasAiTryOn: { type: Boolean, default: false },
    hotspots: [hotspotSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Tự động tạo slug từ name
productSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    const slugify = require("slugify");
    this.slug = slugify(this.name, { lower: true, locale: "vi" });
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
