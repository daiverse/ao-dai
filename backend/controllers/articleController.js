const asyncHandler = require("express-async-handler");
const Article = require("../models/Article");
const slugify = require("slugify");

// @desc    Lấy danh sách bài viết
// @route   GET /api/articles
// @access  Public
const getArticles = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const skip = (page - 1) * limit;

  const filter = { isPublished: true };
  if (req.query.category) filter.category = req.query.category;

  const total = await Article.countDocuments(filter);
  const articles = await Article.find(filter)
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("-content"); // Không trả content trong danh sách

  res.json({
    success: true,
    data: articles,
    pagination: { total, page, pages: Math.ceil(total / limit) },
  });
});

// @desc    Chi tiết bài viết
// @route   GET /api/articles/:slug
// @access  Public
const getArticleBySlug = asyncHandler(async (req, res) => {
  const article = await Article.findOneAndUpdate(
    { slug: req.params.slug, isPublished: true },
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!article) { res.status(404); throw new Error("Không tìm thấy bài viết."); }
  res.json({ success: true, data: article });
});

// @desc    Tạo bài viết [Admin]
// @route   POST /api/articles
// @access  Private/Admin
const createArticle = asyncHandler(async (req, res) => {
  const articleData = req.body;
  if (!articleData.slug && articleData.title) {
    articleData.slug = slugify(articleData.title, { lower: true, locale: "vi" }) + "-" + Date.now();
  }
  const article = await Article.create(articleData);
  res.status(201).json({ success: true, message: "Tạo bài viết thành công!", data: article });
});

// @desc    Cập nhật bài viết [Admin]
// @route   PUT /api/articles/:id
// @access  Private/Admin
const updateArticle = asyncHandler(async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!article) { res.status(404); throw new Error("Không tìm thấy bài viết."); }
  res.json({ success: true, message: "Cập nhật bài viết thành công!", data: article });
});

// @desc    Xóa bài viết [Admin]
// @route   DELETE /api/articles/:id
// @access  Private/Admin
const deleteArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) { res.status(404); throw new Error("Không tìm thấy bài viết."); }
  article.isPublished = false;
  await article.save();
  res.json({ success: true, message: "Đã xóa bài viết." });
});

module.exports = { getArticles, getArticleBySlug, createArticle, updateArticle, deleteArticle };
