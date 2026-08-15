const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
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
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "aodai_secret_key_development_2024"
    );

    // Nếu DB đang kết nối
    if (mongoose.connection.readyState === 1) {
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user || !req.user.isActive) {
        res.status(401);
        throw new Error("Tài khoản không tồn tại hoặc đã bị khóa.");
      }
    } else {
      // Lazy import authController to get inMemoryUsers map without circular dependency
      const { inMemoryUsers } = require("../controllers/authController");
      const cleanEmail = (decoded.email || "").toLowerCase().trim();
      const memUser = inMemoryUsers ? inMemoryUsers.get(cleanEmail) : null;

      req.user = memUser || {
        _id: decoded.id,
        name: decoded.name || (cleanEmail ? cleanEmail.split("@")[0] : "Khách hàng"),
        email: cleanEmail,
        role: "customer",
        isActive: true,
      };
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Token không hợp lệ hoặc đã hết hạn.");
  }
});

module.exports = { protect };
