export const CATEGORIES = [
  { id: "all", name: "Tất Cả" },
  { id: "express24h", name: "⚡ Đặt Hàng 24h" },
  { id: "cuoi", name: "Áo Dài Cưới" },
  { id: "truyen-thong", name: "Áo Dài Truyền Thống" },
  { id: "cach-tan", name: "Áo Dài Cách Tân" },
  { id: "theu-tay", name: "Áo Dài Thêu Tay" }
];

export const PRODUCTS = [
  {
    id: "ad-01",
    name: "Áo Dài Gấm Sen Thêu Tay Mộng Liên",
    collection: "mong-lien",
    category: "theu-tay",
    price: 1850000,
    originalPrice: 2200000,
    formattedPrice: "1.850.000đ",
    formattedOriginalPrice: "2.200.000đ",
    rating: 4.9,
    reviewsCount: 48,
    isNew: true,
    isBestSeller: true,
    isExpress24h: true,
    expressTag: "Sẵn size S, M, L - Giao hỏa tốc 24h",
    description: "Áo dài chất liệu gấm tơ cao cấp phối họa tiết thêu sen hồng nổi bật. Cổ cao 3cm truyền thống tôn dáng thanh thoát.",
    fabric: "Gấm Lụa Tơ Tằm",
    colors: [
      { name: "Hồng Mộng Liên", code: "#E8A5A5" },
      { name: "Trắng Ngọc", code: "#F8F5EE" },
      { name: "Xanh Thủy Tinh", code: "#9BBEC8" }
    ],
    sizes: ["S", "M", "L", "XL", "Tailored (May theo số đo)"],
    images: [
      "/anh/746927465_122119237899355470_7558522641041819280_n.jpg",
      "/anh/746947278_122119072383355470_6400495368402003300_n.jpg"
    ],
    has360View: true,
    hasAiTryOn: true,
    hotspots: [
      { x: "45%", y: "30%", title: "Thêu Tay Hoa Sen", description: "Mỗi đóa sen thêu thủ công hơn 18 giờ tỉ mỉ." },
      { x: "50%", y: "15%", title: "Cổ Áo 3cm Classic", description: "Đường viền lụa ôm sát tinh tế tôn dáng cổ." }
    ]
  },
  {
    id: "ad-02",
    name: "Áo Dài Cưới Gấm Hoàng Gia Xích Nguyệt",
    collection: "huong-co-do",
    category: "cuoi",
    price: 2450000,
    originalPrice: 2800000,
    formattedPrice: "2.450.000đ",
    formattedOriginalPrice: "2.800.000đ",
    rating: 5.0,
    reviewsCount: 62,
    isNew: false,
    isBestSeller: true,
    isExpress24h: true,
    expressTag: "Nhận nhanh trong 24h kèm khăn đóng",
    description: "Thiết kế áo dài cưới đỏ thắm gấm dệt hoa văn hoàng gia. Mang ý nghĩa hạnh phúc viên mãn và phú quý cho ngày trọng đại.",
    fabric: "Gấm Thượng Hải Cao Cấp",
    colors: [
      { name: "Đỏ Son Hoàng Gia", code: "#9B1C1C" },
      { name: "Vàng Kim", code: "#D4AF37" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/anh/747178293_122119072509355470_7986902361393680700_n.jpg",
      "/anh/748552016_122119237911355470_8898990539200168318_n.jpg"
    ],
    has360View: true,
    hasAiTryOn: true,
    hotspots: [
      { x: "50%", y: "40%", title: "Họa Tiết Chim Phụng", description: "Dệt nổi sợi kim tuyến phản chiếu ánh sáng lộng lẫy." }
    ]
  },
  {
    id: "ad-03",
    name: "Áo Dài Lụa Tơ Tằm Trăng Trong Lụa",
    collection: "trang-trong-lua",
    category: "truyen-thong",
    price: 1499000,
    originalPrice: 1750000,
    formattedPrice: "1.499.000đ",
    formattedOriginalPrice: "1.750.000đ",
    rating: 4.8,
    reviewsCount: 35,
    isNew: true,
    isBestSeller: false,
    isExpress24h: true,
    expressTag: "Giao 24h - Miễn phí bóp eo theo dáng",
    description: "Sự kết hợp giữa chất liệu lụa Bảo Lộc mềm mại như nước và phom dáng áo dài thanh lịch. Cảm giác nhẹ nhàng êm ái.",
    fabric: "Lụa Bảo Lộc 100%",
    colors: [
      { name: "Xanh Ngọc Lục", code: "#18392B" },
      { name: "Trắng Kem", code: "#FDFBF7" },
      { name: "Hồng Phấn", code: "#F4C2C2" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/anh/748811734_122119072365355470_5191248946269688850_n.jpg",
      "/anh/748931198_122119072389355470_4323049577285984388_n.jpg"
    ],
    has360View: true,
    hasAiTryOn: true
  },
  {
    id: "ad-04",
    name: "Áo Dài Cách Tân Tay Phồng Thanh Hà",
    collection: "mong-lien",
    category: "cach-tan",
    price: 1350000,
    originalPrice: 1600000,
    formattedPrice: "1.350.000đ",
    formattedOriginalPrice: "1.600.000đ",
    rating: 4.7,
    reviewsCount: 29,
    isNew: false,
    isBestSeller: false,
    isExpress24h: false,
    description: "Phom dáng cách tân trẻ trung với thiết kế tay phồng nhẹ và chân váy đính kèm. Thích hợp cho các buổi tiệc và dạo phố.",
    fabric: "Lụa Organza Phối Tơ",
    colors: [
      { name: "Vàng Nắng", code: "#E9C46A" },
      { name: "Xanh Pastel", code: "#A8DADC" }
    ],
    sizes: ["S", "M", "L"],
    images: [
      "/anh/748948738_122119559763355470_8315866031234642956_n.jpg",
      "/anh/748978674_122119238085355470_3727930377974231420_n.jpg"
    ],
    has360View: false,
    hasAiTryOn: true
  },
  {
    id: "ad-05",
    name: "Áo Dài Cử Tấm Dệt Kim Tuyến",
    collection: "huong-co-do",
    category: "theu-tay",
    price: 1800000,
    originalPrice: 2100000,
    formattedPrice: "1.800.000đ",
    formattedOriginalPrice: "2.100.000đ",
    rating: 4.9,
    reviewsCount: 53,
    isNew: true,
    isBestSeller: true,
    isExpress24h: true,
    expressTag: "Đặt nhận trong ngày tại TP.HCM & HN",
    description: "Áo dài phong cách Cử Tấm quý phái. Thắt eo tôn dáng chuẩn, tà áo xòe rủ tự nhiên với các đường nét thêu nổi hoa cúc.",
    fabric: "Gấm Thêu Nổi",
    colors: [
      { name: "Đỏ Rượu", code: "#6B1D2F" },
      { name: "Xanh Rêu Hoàng Gia", code: "#2D5A27" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/anh/749239603_122119072485355470_980697849173578283_n.jpg",
      "/anh/749315083_122119238007355470_8087645459800718314_n.jpg"
    ],
    has360View: true,
    hasAiTryOn: true
  },
  {
    id: "ad-06",
    name: "Áo Dài Cưới Lụa Thêu Song Hỷ",
    collection: "huong-co-do",
    category: "cuoi",
    price: 2950000,
    originalPrice: 3400000,
    formattedPrice: "2.950.000đ",
    formattedOriginalPrice: "3.400.000đ",
    rating: 5.0,
    reviewsCount: 88,
    isNew: false,
    isBestSeller: true,
    isExpress24h: false,
    description: "Áo dài cưới thêu tay Song Hỷ kết hợp đính đá pha sáng cao cấp. Đi kèm khăn đóng dệt đồng điệu cho cô dâu rạng rỡ.",
    fabric: "Lụa Tơ Tằm Ý & Pha Lê Swarovsky",
    colors: [
      { name: "Đỏ Son", code: "#A71930" },
      { name: "Trắng Tinh Khôi", code: "#FFFFFF" }
    ],
    sizes: ["S", "M", "L", "XL", "Tailored"],
    images: [
      "/anh/750277229_122119559757355470_6275700024698490744_n.jpg",
      "/anh/752347459_122120858961355470_5997594624170821473_n.jpg"
    ],
    has360View: true,
    hasAiTryOn: true
  },
  {
    id: "ad-07",
    name: "Áo Dài Gấm Dệt Hoa Văn Cổ Di Sản",
    collection: "huong-co-do",
    category: "truyen-thong",
    price: 1950000,
    originalPrice: 2300000,
    formattedPrice: "1.950.000đ",
    formattedOriginalPrice: "2.300.000đ",
    rating: 4.9,
    reviewsCount: 41,
    isNew: true,
    isBestSeller: true,
    isExpress24h: true,
    expressTag: "Sẵn size S, M, L - Giao hỏa tốc 24h",
    description: "Hoa văn di sản hoàng cung Huế thêu tay lộng lẫy trên nền gấm thượng hạng.",
    fabric: "Gấm Di Sản Thượng Hải",
    colors: [
      { name: "Xanh Ngọc Lục", code: "#18392B" },
      { name: "Vàng Hổ Phách", code: "#D4AF37" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/anh/753471319_122120858943355470_7991801264771199577_n.jpg",
      "/anh/753652294_122120859075355470_523410657087258177_n.jpg"
    ],
    has360View: true,
    hasAiTryOn: true
  },
  {
    id: "ad-08",
    name: "Áo Dài Lụa Tơ Tằm Hoàng Cúc Cách Tân",
    collection: "trang-trong-lua",
    category: "cach-tan",
    price: 1680000,
    originalPrice: 1950000,
    formattedPrice: "1.680.000đ",
    formattedOriginalPrice: "1.950.000đ",
    rating: 4.8,
    reviewsCount: 37,
    isNew: true,
    isBestSeller: false,
    isExpress24h: true,
    expressTag: "Giao 24h - Hỗ trợ chỉnh eo",
    description: "Sắc vàng hoàng cúc nổi bật phối cùng phom dáng tà xòe cách tân quyến rũ.",
    fabric: "Lụa Tơ Tằm Hà Đông",
    colors: [
      { name: "Vàng Hoàng Cúc", code: "#E9C46A" },
      { name: "Hồng Đào", code: "#E8A5A5" }
    ],
    sizes: ["S", "M", "L"],
    images: [
      "/anh/754058094_122120859087355470_3079712870670515575_n.jpg",
      "/anh/754189695_122121323961355470_4835644296669048277_n.jpg"
    ],
    has360View: true,
    hasAiTryOn: true
  },
  {
    id: "ad-09",
    name: "Áo Dài Thêu Tay Đóa Sen Ngọc",
    collection: "mong-lien",
    category: "theu-tay",
    price: 2200000,
    originalPrice: 2600000,
    formattedPrice: "2.200.000đ",
    formattedOriginalPrice: "2.600.000đ",
    rating: 5.0,
    reviewsCount: 56,
    isNew: true,
    isBestSeller: true,
    isExpress24h: true,
    expressTag: "Nhận nhanh trong 24h",
    description: "Đóa sen trắng ngọc được nghệ nhân đính kết tỉ mỉ trên chất liệu gấm tơ mềm mịn.",
    fabric: "Gấm Lụa Sen Thượng Hạng",
    colors: [
      { name: "Trắng Ngọc Khôi", code: "#F8F5EE" },
      { name: "Xanh Ngọc", code: "#18392B" }
    ],
    sizes: ["S", "M", "L", "XL", "Tailored"],
    images: [
      "/anh/754462727_122121325533355470_5308022674007869796_n.jpg",
      "/anh/754463095_122121323955355470_8016593937347573814_n.jpg"
    ],
    has360View: true,
    hasAiTryOn: true
  },
  {
    id: "ad-10",
    name: "Áo Dài Cưới Gấm Phụng Hoàng Sơn",
    collection: "huong-co-do",
    category: "cuoi",
    price: 3100000,
    originalPrice: 3600000,
    formattedPrice: "3.100.000đ",
    formattedOriginalPrice: "3.600.000đ",
    rating: 5.0,
    reviewsCount: 74,
    isNew: true,
    isBestSeller: true,
    isExpress24h: true,
    expressTag: "Ưu tiên giao hỏa tốc ngày cưới",
    description: "Bộ áo dài cưới đỏ thắm quyền quý đính đá pha lê Swarovski phản chiếu hào quang sang trọng.",
    fabric: "Gấm Thượng Hải & Pha Lê",
    colors: [
      { name: "Đỏ Son Quyền Quý", code: "#9B1C1C" }
    ],
    sizes: ["S", "M", "L", "XL", "Tailored"],
    images: [
      "/anh/755736353_122121324117355470_11826430014490496_n.jpg",
      "/anh/756873041_122121325557355470_9187559362789881870_n.jpg"
    ],
    has360View: true,
    hasAiTryOn: true
  }
];
