const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const slugify = require("slugify");
const seedData = require("../data/seedData.json");

// @desc    Lấy danh sách sản phẩm (filter, sort, phân trang)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  // Nếu MongoDB đang kết nối
  if (mongoose.connection.readyState === 1) {
    const filter = { isActive: true };
    if (req.query.category && req.query.category !== "all") {
      filter.category = req.query.category;
    }
    if (req.query.collection) {
      filter.collection = req.query.collection;
    }
    if (req.query.isExpress24h === "true") {
      filter.isExpress24h = true;
    }
    if (req.query.isBestSeller === "true") {
      filter.isBestSeller = true;
    }
    if (req.query.isNew === "true") {
      filter.isNew = true;
    }
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseInt(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseInt(req.query.maxPrice);
    }
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
        { fabric: { $regex: req.query.search, $options: "i" } },
      ];
    }

    let sort = { createdAt: -1 };
    if (req.query.sort === "price_asc") sort = { price: 1 };
    if (req.query.sort === "price_desc") sort = { price: -1 };
    if (req.query.sort === "rating") sort = { rating: -1 };
    if (req.query.sort === "bestseller") sort = { reviewsCount: -1 };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort(sort).skip(skip).limit(limit);

    return res.json({
      success: true,
      data: products,
      pagination: { total, page, pages: Math.ceil(total / limit), limit },
    });
  }

  // Fallback sang seedData local khi không có DB connection
  let items = seedData.products.filter((p) => p.isActive);

  if (req.query.category && req.query.category !== "all") {
    items = items.filter((p) => p.category === req.query.category);
  }
  if (req.query.collection) {
    items = items.filter((p) => p.collection === req.query.collection);
  }
  if (req.query.isExpress24h === "true") {
    items = items.filter((p) => p.isExpress24h);
  }
  if (req.query.isBestSeller === "true") {
    items = items.filter((p) => p.isBestSeller);
  }
  if (req.query.isNew === "true") {
    items = items.filter((p) => p.isNew);
  }
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q)
    );
  }

  const total = items.length;
  const paginated = items.slice(skip, skip + limit);

  res.json({
    success: true,
    data: paginated,
    pagination: { total, page, pages: Math.ceil(total / limit), limit },
  });
});

// @desc    Chi tiết sản phẩm theo ID hoặc slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const product = await Product.findOne({
      $or: [
        { _id: req.params.id.match(/^[a-f\d]{24}$/i) ? req.params.id : null },
        { slug: req.params.id },
      ],
      isActive: true,
    });

    if (product) {
      return res.json({ success: true, data: product });
    }
  }

  const product = seedData.products.find(
    (p) => p.id === req.params.id || p.slug === req.params.id
  );

  if (!product) {
    res.status(404);
    throw new Error("Không tìm thấy sản phẩm.");
  }

  res.json({ success: true, data: product });
});

// @desc    Tạo sản phẩm mới [Admin]
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const productData = req.body;
  if (!productData.slug && productData.name) {
    productData.slug =
      slugify(productData.name, { lower: true, locale: "vi" }) +
      "-" +
      Date.now();
  }

  if (mongoose.connection.readyState === 1) {
    const product = await Product.create(productData);
    return res.status(201).json({
      success: true,
      message: "Tạo sản phẩm thành công!",
      data: product,
    });
  }

  seedData.products.push({ ...productData, id: `ad-${Date.now()}`, isActive: true });
  res.status(201).json({
    success: true,
    message: "Tạo sản phẩm thành công (chế độ độc lập)!",
    data: productData,
  });
});

// @desc    Cập nhật sản phẩm [Admin]
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Không tìm thấy sản phẩm.");
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.json({ success: true, message: "Cập nhật sản phẩm thành công!", data: updated });
  }

  res.json({ success: true, message: "Cập nhật sản phẩm thành công!" });
});

// @desc    Xóa sản phẩm (soft delete) [Admin]
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Không tìm thấy sản phẩm.");
    }

    product.isActive = false;
    await product.save();

    return res.json({ success: true, message: "Đã xóa sản phẩm." });
  }

  res.json({ success: true, message: "Đã xóa sản phẩm." });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
