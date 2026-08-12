const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Đăng ký tài khoản
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("Email đã được sử dụng.");
  }

  const user = await User.create({ name, email, password, phone });

  res.status(201).json({
    success: true,
    message: "Đăng ký thành công!",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    },
  });
});

// @desc    Đăng nhập
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Email hoặc mật khẩu không đúng.");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.");
  }

  res.json({
    success: true,
    message: "Đăng nhập thành công!",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id),
    },
  });
});

// @desc    Lấy thông tin user hiện tại
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist", "name price images");

  res.json({
    success: true,
    data: user,
  });
});

module.exports = { register, login, getMe };
