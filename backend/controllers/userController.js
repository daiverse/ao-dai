const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc    Xem profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist", "name price images rating");
  res.json({ success: true, data: user });
});

// @desc    Cập nhật profile & số đo
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy người dùng.");
  }

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  user.avatar = req.body.avatar || user.avatar;

  if (req.body.measurements) {
    user.measurements = { ...user.measurements?.toObject(), ...req.body.measurements };
  }

  if (req.body.addresses) {
    user.addresses = req.body.addresses;
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    message: "Cập nhật thông tin thành công!",
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      avatar: updatedUser.avatar,
      measurements: updatedUser.measurements,
      addresses: updatedUser.addresses,
    },
  });
});

// @desc    Đổi mật khẩu
// @route   PUT /api/users/password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.matchPassword(currentPassword))) {
    res.status(400);
    throw new Error("Mật khẩu hiện tại không đúng.");
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: "Đổi mật khẩu thành công!" });
});

// @desc    Thêm / xóa khỏi wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;

  const index = user.wishlist.indexOf(productId);
  let message;

  if (index === -1) {
    user.wishlist.push(productId);
    message = "Đã thêm vào danh sách yêu thích!";
  } else {
    user.wishlist.splice(index, 1);
    message = "Đã xóa khỏi danh sách yêu thích.";
  }

  await user.save();
  res.json({ success: true, message, wishlist: user.wishlist });
});

// @desc    Lấy danh sách tất cả users [Admin]
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const total = await User.countDocuments();
  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    data: users,
    pagination: { total, page, pages: Math.ceil(total / limit) },
  });
});

// @desc    Khóa/mở khóa user [Admin]
// @route   PUT /api/users/:id/toggle-active
// @access  Private/Admin
const toggleUserActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy người dùng.");
  }

  user.isActive = !user.isActive;
  await user.save();

  res.json({
    success: true,
    message: user.isActive ? "Đã mở khóa tài khoản." : "Đã khóa tài khoản.",
    isActive: user.isActive,
  });
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  toggleWishlist,
  getAllUsers,
  toggleUserActive,
};
