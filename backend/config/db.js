const mongoose = require("mongoose");

const connectDB = async () => {
  // Nếu chưa có MONGO_URI thật, bỏ qua và tiếp tục (AI routes không cần DB)
  const uri = process.env.MONGO_URI || "";
  if (!uri || uri.includes("<username>") || uri.includes("xxxxx")) {
    console.warn("⚠️  MongoDB chưa được cấu hình. Các tính năng AI vẫn hoạt động.");
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Atlas kết nối thành công: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Lỗi kết nối MongoDB: ${error.message}`);
    console.warn("⚠️  Server tiếp tục chạy nhưng các tính năng cần DB sẽ không hoạt động.");
  }
};

module.exports = connectDB;
