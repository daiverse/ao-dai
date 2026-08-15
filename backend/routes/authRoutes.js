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

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/?auth_error=google_failed" }),
  googleCallback
);

module.exports = router;
