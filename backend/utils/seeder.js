const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("../models/Product");
const Collection = require("../models/Collection");
const Article = require("../models/Article");
const connectDB = require("../config/db");

const collections = [
  {
    id: "moc-lan",
    name: "Mộc Lan",
    subtitle: "Khởi đầu của một vẻ đẹp thuần khiết & bình yên.",
    description: "BST Mộc Lan gồm 4 thiết kế áo dài độc đáo: Bạch Lan, Sương Mai, Mộc An, và Hồng Nguyệt, mang sự giao thoa giữa nét đẹp truyền thống và hơi thở đương đại.",
    image: "/anh/bach-lan/1.jpg",
    priceFrom: "1.499.000đ",
    itemCount: 4,
    badge: "BST Mới Ra Mắt",
    accentColor: "#D4A373",
  },
  {
    id: "phong-sac",
    name: "Phong Sắc",
    subtitle: "Thanh thoát trong từng nhịp gió.",
    description: "BST Phong Sắc gồm thiết kế Thanh Phong nổi bật với áo khoác choàng tafta sang trọng, hiện đại và thanh lịch.",
    image: "/anh/thanh-phong/1.jpg",
    priceFrom: "1.799.000đ",
    itemCount: 1,
    badge: "BST Mới Ra Mắt",
    accentColor: "#2563EB",
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
    storyTitle: "BẠCH LAN | KHỞI ĐẦU CỦA MỘT VẺ ĐẸP THUẦN KHIẾT",
    storyContent: "Có những vẻ đẹp không cần quá rực rỡ để trở nên nổi bật. Bạch Lan không chỉ là một tà áo dài. Đó là sự giao thoa giữa nét đẹp truyền thống và hơi thở đương đại. Là món quà dành cho những cô gái yêu sự tối giản nhưng vẫn muốn mình thật nổi bật.",
    fabric: "Lụa gấm trúc cao cấp",
    colors: [
      { name: "Đỏ Đô", code: "#8B0000" },
      { name: "Xanh Biển", code: "#1E3A8A" },
      { name: "Xanh Ngọc", code: "#0D9488" },
      { name: "Hồng Đỗ", code: "#DB2777" },
      { name: "Trắng Ngọc", code: "#F8F5EE" }
    ],
    sizes: ["S", "M", "L", "XL", "Tailored (May theo số đo)"],
    images: [
      "/anh/bach-lan/1.jpg",
      "/anh/bach-lan/2.jpg",
      "/anh/bach-lan/3.jpg",
      "/anh/bach-lan/4.jpg",
      "/anh/bach-lan/5.jpg"
    ],
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
    description: "Chất liệu: Gấm tơ mềm cao cấp: mềm, mịn, mát, co dãn tốt, phong cách trẻ trung, thanh lịch, giản dị phù hợp với mọi lứa tuổi.",
    storyTitle: "SƯƠNG MAI | Khi bình yên được khoác lên thành tà áo",
    storyContent: "Một thiết kế mang gam xanh ngọc dịu nhẹ, gợi nhớ đến vẻ đẹp thuần khiết của buổi sớm. Không phô trương, không cầu kỳ, chỉ lặng lẽ tôn lên nét thanh tao của người mặc.",
    fabric: "Gấm tơ mềm cao cấp",
    colors: [
      { name: "Xanh Ngọc Dịu", code: "#14B8A6" },
      { name: "Trắng Kem", code: "#FDFBF7" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/anh/suong-mai/1.jpg",
      "/anh/suong-mai/2.jpg",
      "/anh/suong-mai/3.jpg",
      "/anh/suong-mai/4.jpg",
      "/anh/suong-mai/5.jpg"
    ],
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
    isExpress24h: true,
    expressTag: "Sẵn size S, M, L - Giao hỏa tốc 24h",
    description: "Áo dài cách tân chất tơ mềm mại. Sắc hồng phấn dịu dàng kết hợp điểm nhấn xanh non nơi tà quần như bức tranh mùa xuân.",
    storyTitle: "MỘC AN | Bình yên trong từng nếp áo",
    storyContent: "Sắc hồng phấn dịu dàng kết hợp cùng điểm nhấn xanh non nơi tà quần như một bức tranh mùa xuân, mang theo hơi thở của cây cỏ và những ngày nắng nhẹ.",
    fabric: "Tơ mềm cao cấp",
    colors: [
      { name: "Hồng Phấn", code: "#F472B6" },
      { name: "Vàng Nắng", code: "#FBBF24" },
      { name: "Xanh Cốm", code: "#84CC16" },
      { name: "Xanh Dương", code: "#3B82F6" }
    ],
    sizes: ["S", "M", "L"],
    images: [
      "/anh/moc-an/1.jpg",
      "/anh/moc-an/2.jpg",
      "/anh/moc-an/3.jpg",
      "/anh/moc-an/4.png",
      "/anh/moc-an/5.png"
    ],
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
    storyTitle: "HỒNG NGUYỆT | Dịu dàng như ánh trăng, rạng rỡ theo cách riêng",
    storyContent: "Sắc hồng mềm mại ôm lấy từng đường nét, kết hợp cùng họa tiết dệt tinh xảo, tôn lên vẻ đẹp dịu dàng mà không kém phần cuốn hút.",
    fabric: "Tơ tằm ánh kim 4 tà cao cấp",
    colors: [
      { name: "Hồng Ánh Kim", code: "#EC4899" },
      { name: "Vàng Ánh Kim", code: "#F59E0B" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/anh/hong-nguyet/1.jpg",
      "/anh/hong-nguyet/2.jpg",
      "/anh/hong-nguyet/3.jpg",
      "/anh/hong-nguyet/4.jpg"
    ],
    has360View: true,
    hasAiTryOn: true,
  },
  {
    name: "Áo Dài Tafta Dáng Suông Thanh Phong",
    slug: "ao-dai-tafta-dang-suong-thanh-phong",
    collection: "phong-sac",
    category: "cach-tan",
    price: 1799000,
    originalPrice: 2100000,
    rating: 4.9,
    reviewsCount: 52,
    isNew: true,
    isBestSeller: true,
    isExpress24h: true,
    expressTag: "Set 3 món cao cấp (Áo, Quần & Áo khoác choàng)",
    description: "Sản phẩm gồm: 1 áo, 1 quần, 1 áo khoác choàng tay cánh dơi chun gấu sau, chun cổ tay, dáng gile, cổ thuyền dây trang trí ngực khóa sau.",
    storyTitle: "THANH PHONG | Thanh thoát trong từng nhịp gió",
    storyContent: "Thanh Phong mang gam màu xanh dịu cùng họa tiết tinh tế, tạo nên tổng thể mềm mại nhưng vẫn đầy cuốn hút.",
    fabric: "Tafta cao cấp (giãn ngang nhẹ)",
    colors: [
      { name: "Xanh Dịu", code: "#2563EB" },
      { name: "Đỏ Thanh Phong", code: "#DC2626" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/anh/thanh-phong/1.jpg",
      "/anh/thanh-phong/2.jpg",
      "/anh/thanh-phong/3.jpg",
      "/anh/thanh-phong/4.png"
    ],
    has360View: true,
    hasAiTryOn: true,
  },
];

const articles = [
  {
    title: "Nghệ Thuật Thêu Sen Trong Tà Áo Dài Việt Nam",
    slug: "nghe-thuat-theu-sen-trong-ta-ao-dai-viet-nam-" + Date.now(),
    category: "Di Sản & Văn Hóa",
    content: "Khám phá câu chuyện đằng sau những đường thêu hoa sen tỉ mỉ của nghệ nhân làng nghề truyền thống...",
    excerpt: "Khám phá câu chuyện đằng sau những đường thêu hoa sen tỉ mỉ của nghệ nhân làng nghề truyền thống...",
    image: "/anh/suong-mai/3.jpg",
    author: "Mai Anh - Serene Journal",
    readTime: "5 phút đọc",
  },
  {
    title: "Bí Quyết Chọn Áo Dài Cưới Chuẩn Dáng Theo Phong Thủy",
    slug: "bi-quyet-chon-ao-dai-cuoi-chuan-dang-theo-phong-thuy-" + Date.now(),
    category: "Bí Quyết Thời Trang",
    content: "Lựa chọn gam màu đỏ son, hồng đào hay hoàng gia cho ngày trọng đại...",
    excerpt: "Lựa chọn gam màu đỏ son, hồng đào hay hoàng gia cho ngày trọng đại...",
    image: "/anh/hong-nguyet/4.jpg",
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

    console.log("🌱 Đang import dữ liệu mới vào DB...");
    await Collection.insertMany(collections);
    await Product.insertMany(products);
    await Article.insertMany(articles);

    console.log("✅ Seed dữ liệu Áo Dài mới thành công!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi seed:", error.message);
    process.exit(1);
  }
};

seedData();
