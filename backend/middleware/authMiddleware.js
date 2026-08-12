const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Không được phép truy cập. Vui lòng đăng nhập.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user || !req.user.isActive) {
      res.status(401);
      throw new Error("Tài khoản không tồn tại hoặc đã bị khóa.");
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Token không hợp lệ hoặc đã hết hạn.");
  }
});

module.exports = { protect };
