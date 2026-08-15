const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "";
  if (!uri || uri.includes("<username>") || uri.includes("xxxxx")) {
    console.warn("⚠️  MongoDB chưa được cấu hình. Sử dụng bộ nhớ tạm cho Auth.");
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000, // Timeout sau 3 giây nếu ko thấy MongoDB
    });
    console.log(`✅ MongoDB kết nối thành công: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Lỗi kết nối MongoDB (${error.message}). Hệ thống chạy chế độ bộ nhớ tạm cho Auth.`);
  }
};

module.exports = connectDB;
