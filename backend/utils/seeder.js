const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("../models/Product");
const Collection = require("../models/Collection");
const Article = require("../models/Article");
const connectDB = require("../config/db");

// Dữ liệu mẫu từ frontend
const collections = [
  {
    id: "moc-lan",
    name: "Mộc Lan",
    subtitle: "Khởi đầu của một vẻ đẹp thuần khiết & bình yên.",
    description: "BST Mộc Lan gồm 5 thiết kế áo dài độc đáo: Bạch Lan, Thanh Phong, Sương Mai, Mộc An, và Hồng Nguyệt, mang sự giao thoa giữa nét đẹp truyền thống và hơi thở đương đại.",
    image: "/anh/746927465_122119237899355470_7558522641041819280_n.jpg",
    priceFrom: "1.499.000đ",
    itemCount: 5,
    badge: "BST Mới Ra Mắt",
    accentColor: "#D4A373",
  },
];

const products = [
  {
    name: "Áo Dài Lụa Gấm Trúc Bạch Lan",
    slug: "ao-dai-lua-gam-truc-bach-lan",
    collection: "moc-lan",
    category: "truyen-thong",
    price: 1599000,
    originalPrice: 1890000,
    rating: 5.0,
    reviewsCount: 68,
    isNew: true,
    isBestSeller: true,
    isExpress24h: true,
    expressTag: "Sẵn size S, M, L - Giao hỏa tốc 24h",
    description: "Bộ sản phẩm áo kèm quần chất liệu lụa gấm trúc CAO CẤP. Mang sự giao thoa giữa nét đẹp truyền thống và hơi thở đương đại.",
    fabric: "Lụa gấm trúc cao cấp",
    colors: [
      { name: "Trắng Ngọc", code: "#F8F5EE" },
      { name: "Đỏ Đô", code: "#8B0000" },
      { name: "Xanh Biển", code: "#1E3A8A" },
      { name: "Xanh Ngọc", code: "#0D9488" },
      { name: "Hồng Đỗ", code: "#DB2777" }
    ],
    sizes: ["S", "M", "L", "XL", "Tailored (May theo số đo)"],
    images: ["/anh/746927465_122119237899355470_7558522641041819280_n.jpg", "/anh/746947278_122119072383355470_6400495368402003300_n.jpg"],
    has360View: true,
    hasAiTryOn: true,
  },
  {
    name: "Áo Dài Tafta Dáng Suông Thanh Phong",
    slug: "ao-dai-tafta-dang-suong-thanh-phong",
    collection: "moc-lan",
    category: "cach-tan",
    price: 1799000,
    originalPrice: 2100000,
    rating: 4.9,
    reviewsCount: 52,
    isNew: true,
    isBestSeller: true,
    isExpress24h: true,
    expressTag: "Set 3 món cao cấp (Áo, Quần & Áo khoác choàng)",
    description: "Thiết kế dáng suông tafta 2 lớp (áo ngoài 1 lớp). Áo choàng ngoài tay cánh dơi chun gấu sau, chun cổ tay, dáng gile, cổ thuyền dây trang trí ngực khóa sau.",
    fabric: "Tafta cao cấp (giãn ngang nhẹ)",
    colors: [
      { name: "Xanh Dịu", code: "#2563EB" },
      { name: "Đỏ Thanh Phong", code: "#DC2626" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: ["/anh/748811734_122119072365355470_5191248946269688850_n.jpg", "/anh/748931198_122119072389355470_4323049577285984388_n.jpg"],
    has360View: true,
    hasAiTryOn: true,
  },
  {
    name: "Áo Dài Gấm Tơ Mềm Sương Mai",
    slug: "ao-dai-gam-to-mem-suong-mai",
    collection: "moc-lan",
    category: "truyen-thong",
    price: 1499000,
    originalPrice: 1750000,
    rating: 4.9,
    reviewsCount: 43,
    isNew: true,
    isBestSeller: false,
    isExpress24h: true,
    expressTag: "Giao 24h - Miễn phí may đo",
    description: "Chất liệu gấm tơ mềm cao cấp: mềm, mịn, mát, co dãn tốt. Phong cách trẻ trung, thanh lịch, giản dị phù hợp mọi lứa tuổi.",
    fabric: "Gấm tơ mềm cao cấp",
    colors: [
      { name: "Xanh Ngọc Dịu", code: "#14B8A6" },
      { name: "Trắng Kem", code: "#FDFBF7" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: ["/anh/747178293_122119072509355470_7986902361393680700_n.jpg", "/anh/748552016_122119237911355470_8898990539200168318_n.jpg"],
    has360View: true,
    hasAiTryOn: true,
  },
  {
    name: "Áo Dài Cách Tân Chất Tơ Mộc An",
    slug: "ao-dai-cach-tan-chat-to-moc-an",
    collection: "moc-lan",
    category: "cach-tan",
    price: 1599000,
    originalPrice: 1850000,
    rating: 4.8,
    reviewsCount: 39,
    isNew: true,
    isBestSeller: true,
    isExpress24h: false,
    description: "Áo dài cách tân chất tơ mềm mại. Sắc hồng phấn dịu dàng kết hợp điểm nhấn xanh non nơi tà quần như bức tranh mùa xuân.",
    fabric: "Tơ mềm cao cấp",
    colors: [
      { name: "Hồng Phấn", code: "#F472B6" },
      { name: "Vàng Nắng", code: "#FBBF24" },
      { name: "Xanh Cốm", code: "#84CC16" },
      { name: "Xanh Dương", code: "#3B82F6" }
    ],
    sizes: ["S", "M", "L"],
    images: ["/anh/748948738_122119559763355470_8315866031234642956_n.jpg", "/anh/748978674_122119238085355470_3727930377974231420_n.jpg"],
    has360View: true,
    hasAiTryOn: true,
  },
  {
    name: "Áo Dài Tơ Tằm Ánh Kim 4 Tà Hồng Nguyệt",
    slug: "ao-dai-to-tam-anh-kim-4-ta-hong-nguyet",
    collection: "moc-lan",
    category: "truyen-thong",
    price: 1499000,
    originalPrice: 1790000,
    rating: 5.0,
    reviewsCount: 58,
    isNew: true,
    isBestSeller: true,
    isExpress24h: true,
    expressTag: "Sẵn size S, M, L - Giao nhanh 24h",
    description: "Áo tơ tằm ánh kim 4 tà hồng và vàng cao cấp. Thiết kế ôm đường nét, kết hợp họa tiết dệt tinh xảo đằm thắm.",
    fabric: "Tơ tằm ánh kim 4 tà cao cấp",
    colors: [
      { name: "Hồng Ánh Kim", code: "#EC4899" },
      { name: "Vàng Ánh Kim", code: "#F59E0B" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: ["/anh/749239603_122119072485355470_980697849173578283_n.jpg", "/anh/749315083_122119238007355470_8087645459800718314_n.jpg"],
    has360View: true,
    hasAiTryOn: true,
  },
];

const articles = [
  {
    title: "Nghệ Thuật Thêu Sen Trong Tà Áo Dài Việt Nam",
    slug: "nghe-thuat-theu-sen-trong-ta-ao-dai-viet-nam-" + Date.now(),
    category: "Di Sản & Văn Hóa",
    content: "Khám phá câu chuyện đằng sau những đường thêu hoa sen tỉ mỉ của nghệ nhân làng nghề truyền thống, từ bản vẽ đến từng thớ lụa. Nội dung chi tiết về nghệ thuật thêu tay truyền thống Việt Nam...",
    excerpt: "Khám phá câu chuyện đằng sau những đường thêu hoa sen tỉ mỉ của nghệ nhân làng nghề truyền thống, từ bản vẽ đến từng thớ lụa.",
    image: "/anh/753471319_122120858943355470_7991801264771199577_n.jpg",
    author: "Mai Anh - Serene Journal",
    readTime: "5 phút đọc",
  },
  {
    title: "Bí Quyết Chọn Áo Dài Cưới Chuẩn Dáng Theo Phong Thủy",
    slug: "bi-quyet-chon-ao-dai-cuoi-chuan-dang-theo-phong-thuy-" + Date.now(),
    category: "Bí Quyết Thời Trang",
    content: "Lựa chọn gam màu đỏ son, hồng đào hay hoàng gia cho ngày trọng đại. Tỷ lệ may đo chuẩn phong thủy mang lại may mắn viên mãn. Nội dung chi tiết...",
    excerpt: "Lựa chọn gam màu đỏ son, hồng đào hay hoàng gia cho ngày trọng đại. Tỷ lệ may đo chuẩn phong thủy mang lại may mắn viên mãn.",
    image: "/anh/755736353_122121324117355470_11826430014490496_n.jpg",
    author: "Thanh Trúc",
    readTime: "7 phút đọc",
  },
];

const seedData = async () => {
  await connectDB();
  try {
    console.log("🗑️  Xóa dữ liệu cũ...");
    await Product.deleteMany();
    await Collection.deleteMany();
    await Article.deleteMany();

    console.log("🌱 Đang import dữ liệu mẫu...");
    await Collection.insertMany(collections);
    await Product.insertMany(products);
    await Article.insertMany(articles);

    console.log("✅ Seed dữ liệu thành công!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi seed:", error.message);
    process.exit(1);
  }
};

seedData();
