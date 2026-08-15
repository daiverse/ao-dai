const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

// Chỉ đăng ký Google Strategy khi có GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_URL || "http://localhost:5000"}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error("Không lấy được email từ Google"), null);

          // Tìm user hiện có bằng googleId hoặc email
          let user = await User.findOne({
            $or: [{ googleId: profile.id }, { email }],
          });

          if (user) {
            // Cập nhật googleId nếu chưa có
            if (!user.googleId) {
              user.googleId = profile.id;
              user.isEmailVerified = true;
              if (!user.avatar) user.avatar = profile.photos?.[0]?.value || "";
              await user.save();
            }
            return done(null, user);
          }

          // Tạo user mới từ Google
          user = await User.create({
            name: profile.displayName || email.split("@")[0],
            email,
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value || "",
            isEmailVerified: true,
            isActive: true,
          });

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
} else {
  console.log("ℹ️  Google OAuth chưa được cấu hình credentials trong backend/.env");
}

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
