const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");

// Helper: kiểm tra MongoDB có kết nối không
const isDBConnected = () => mongoose.connection.readyState === 1;

// Lấy inMemoryUsers từ authController (fallback khi MongoDB offline)
const getInMemoryUsers = () => {
  try {
    return require("../controllers/authController").inMemoryUsers;
  } catch (e) {
    return new Map();
  }
};

// Luôn đăng ký Google Strategy (sử dụng giá trị mặc định nếu chưa cấu hình trong .env)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "placeholder_google_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder_google_client_secret",
      callbackURL: `${process.env.SERVER_URL || "http://localhost:5000"}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("Không lấy được email từ Google"), null);

        // ── TRƯỜNG HỢP 1: MongoDB đang kết nối → dùng database ──
        if (isDBConnected()) {
          let user = await User.findOne({
            $or: [{ googleId: profile.id }, { email }],
          });

          if (user) {
            if (!user.googleId) {
              user.googleId = profile.id;
              user.isEmailVerified = true;
              if (!user.avatar) user.avatar = profile.photos?.[0]?.value || "";
              await user.save();
            }
            return done(null, user);
          }

          user = await User.create({
            name: profile.displayName || email.split("@")[0],
            email,
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value || "",
            isEmailVerified: true,
            isActive: true,
          });

          return done(null, user);
        }

        // ── TRƯỜNG HỢP 2: MongoDB offline → dùng bộ nhớ tạm ──
        console.log("⚠️  [GOOGLE AUTH] MongoDB offline → dùng in-memory fallback cho:", email);
        const inMemoryUsers = getInMemoryUsers();
        const cleanEmail = email.toLowerCase().trim();

        // Tìm trong bộ nhớ tạm
        let memUser = inMemoryUsers.get(cleanEmail);

        if (memUser) {
          // Cập nhật googleId nếu chưa có
          if (!memUser.googleId) {
            memUser.googleId = profile.id;
            memUser.isEmailVerified = true;
            if (!memUser.avatar) memUser.avatar = profile.photos?.[0]?.value || "";
            inMemoryUsers.set(cleanEmail, memUser);
          }
          return done(null, memUser);
        }

        // Tạo user mới trong bộ nhớ tạm
        const newMemUser = {
          _id: `google_${profile.id}`,
          name: profile.displayName || email.split("@")[0],
          email: cleanEmail,
          googleId: profile.id,
          avatar: profile.photos?.[0]?.value || "",
          role: "customer",
          isEmailVerified: true,
          isActive: true,
        };

        inMemoryUsers.set(cleanEmail, newMemUser);
        console.log("✅ [GOOGLE AUTH] Tạo tài khoản Google mới trong bộ nhớ tạm:", cleanEmail);
        return done(null, newMemUser);

      } catch (err) {
        console.error("❌ [GOOGLE AUTH] Lỗi xác thực Google:", err.message);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id || user.id));
passport.deserializeUser(async (id, done) => {
  try {
    if (isDBConnected()) {
      const user = await User.findById(id);
      return done(null, user);
    }
    // Tìm trong bộ nhớ tạm khi MongoDB offline
    const inMemoryUsers = getInMemoryUsers();
    for (const [, u] of inMemoryUsers.entries()) {
      if (u._id === id || u.id === id) return done(null, u);
    }
    done(null, null);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
