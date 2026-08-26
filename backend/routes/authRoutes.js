const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  sendOTP,
  registerWithOTP,
  resendOTP,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  googleCallback,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Local Auth Routes
router.post("/send-otp", sendOTP);
router.post("/register-with-otp", registerWithOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", protect, getMe);

// Helper kiểm tra cấu hình Google OAuth
const isGoogleConfigured = () => {
  return (
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    !process.env.GOOGLE_CLIENT_ID.includes("placeholder") &&
    !process.env.GOOGLE_CLIENT_ID.includes("YOUR_")
  );
};

// Route Đăng nhập với Google (hỗ trợ cả Real OAuth & Dev Simulation)
router.get("/google", (req, res, next) => {
  if (!isGoogleConfigured()) {
    console.log("ℹ️  [DEV GOOGLE LOGIN] GOOGLE_CLIENT_ID chưa được điền. Đang đăng nhập tài khoản Google mẫu...");
    return res.redirect("/api/auth/google/dev-mock");
  }
  passport.authenticate("google", { scope: ["profile", "email"], session: false })(req, res, next);
});

// Route Đăng nhập Google mô phỏng cho môi trường Dev / Test
router.get("/google/dev-mock", (req, res) => {
  const { inMemoryUsers } = require("../controllers/authController");
  const jwt = require("jsonwebtoken");

  const mockUser = {
    _id: "google_dev_user_1001",
    name: "Google Demo User",
    email: "google.demo@daiverse.com.vn",
    role: "customer",
  };

  inMemoryUsers.set(mockUser.email, mockUser);

  const token = jwt.sign(
    { id: mockUser._id, name: mockUser.name, email: mockUser.email },
    process.env.JWT_SECRET || "aodai_secret_key_development_2024",
    { expiresIn: "30d" }
  );

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  res.redirect(`${clientUrl}/?auth_token=${token}`);
});

router.get("/google/callback", (req, res, next) => {
  if (!isGoogleConfigured()) {
    return res.redirect("/api/auth/google/dev-mock");
  }
  passport.authenticate("google", { session: false, failureRedirect: "/?auth_error=google_failed" })(
    req,
    res,
    next
  );
}, googleCallback);

module.exports = router;
