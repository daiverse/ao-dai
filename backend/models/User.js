const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  province: { type: String, required: true },
  district: { type: String, required: true },
  ward: { type: String, required: true },
  street: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const measurementsSchema = new mongoose.Schema({
  height: Number,
  weight: Number,
  bust: Number,
  waist: Number,
  hips: Number,
  shoulderWidth: Number,
  armLength: Number,
  dressLength: Number,
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng nhập họ tên"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Vui lòng nhập email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"],
    },
    password: {
      type: String,
      minlength: [6, "Mật khẩu tối thiểu 6 ký tự"],
      select: false,
    },
    phone: { type: String, trim: true },
    avatar: { type: String, default: "" },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    // Google OAuth
    googleId: { type: String, default: null },

    // Email Verification
    isEmailVerified: { type: Boolean, default: false },
    emailOTP: { type: String, select: false },
    emailOTPExpires: { type: Date, select: false },

    // Reset Password
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },

    // Profile
    addresses: [addressSchema],
    measurements: measurementsSchema,
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash password trước khi lưu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// So sánh password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Tạo OTP 6 số
userSchema.methods.generateEmailOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.emailOTP = otp;
  this.emailOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 phút
  return otp;
};

// Tạo reset password token
userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 giờ
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
