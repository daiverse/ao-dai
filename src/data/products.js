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
    id: "ad-moclan-01",
    name: "Áo Dài Lụa Gấm Trúc Bạch Lan",
    collection: "moc-lan",
    category: "truyen-thong",
    price: 1599000,
    originalPrice: 1890000,
    formattedPrice: "1.599.000đ",
    formattedOriginalPrice: "1.890.000đ",
    rating: 5.0,
    reviewsCount: 68,
    isNew: true,
    isBestSeller: true,
    isExpress24h: true,
    expressTag: "Sẵn size S, M, L - Giao hỏa tốc 24h",
    description: "Bộ sản phẩm áo kèm quần chất liệu lụa gấm trúc CAO CẤP. Mang sự giao thoa giữa nét đẹp truyền thống và hơi thở đương đại.",
    storyTitle: "BẠCH LAN | KHỞI ĐẦU CỦA MỘT VẺ ĐẸP THUẦN KHIẾT",
    storyContent: "Có những vẻ đẹp không cần quá rực rỡ để trở nên nổi bật. Bạch Lan không chỉ là một tà áo dài. Đó là sự giao thoa giữa nét đẹp truyền thống và hơi thở đương đại. Là món quà dành cho những cô gái yêu sự tối giản nhưng vẫn muốn mình thật nổi bật. Từng chi tiết được hoàn thiện với mong muốn khi khoác lên mình Bạch Lan, bạn không chỉ mặc một chiếc áo dài mà còn khoác lên sự tự tin, sự dịu dàng và niềm tự hào về vẻ đẹp Việt.",
    fabric: "Lụa gấm trúc cao cấp",
    colors: [
      { name: "Trắng Ngọc", code: "#F8F5EE" },
      { name: "Đỏ Đô", code: "#8B0000" },
      { name: "Xanh Biển", code: "#1E3A8A" },
      { name: "Xanh Ngọc", code: "#0D9488" },
      { name: "Hồng Đỗ", code: "#DB2777" }
    ],
    sizes: ["S", "M", "L", "XL", "Tailored (May theo số đo)"],
    images: [
      "/anh/746927465_122119237899355470_7558522641041819280_n.jpg",
      "/anh/746947278_122119072383355470_6400495368402003300_n.jpg"
    ],
    has360View: true,
    hasAiTryOn: true,
    hotspots: [
      { x: "45%", y: "30%", title: "Lụa Gấm Trúc", description: "Họa tiết dệt gấm trúc tinh xảo mềm mại." },
      { x: "50%", y: "15%", title: "Cổ Áo Tối Giản", description: "Tôn vinh vẻ đẹp thuần khiết và thanh thoát." }
    ]
  },
  {
    id: "ad-moclan-02",
    name: "Áo Dài Tafta Dáng Suông Thanh Phong",
    collection: "moc-lan",
    category: "cach-tan",
    price: 1799000,
    originalPrice: 2100000,
    formattedPrice: "1.799.000đ",
    formattedOriginalPrice: "2.100.000đ",
    rating: 4.9,
    reviewsCount: 52,
    isNew: true,
    isBestSeller: true,
    isExpress24h: true,
    expressTag: "Set 3 món cao cấp (Áo, Quần & Áo khoác choàng)",
    description: "Thiết kế dáng suông tafta 2 lớp (áo ngoài 1 lớp). Áo choàng ngoài tay cánh dơi chun gấu sau, chun cổ tay, dáng gile, cổ thuyền dây trang trí ngực khóa sau.",
    storyTitle: "THANH PHONG | Thanh thoát trong từng nhịp gió",
    storyContent: "Có những vẻ đẹp không cần quá rực rỡ để trở nên nổi bật. Đó là sự nhẹ nhàng đủ để khiến người khác lưu luyến, là nét thanh lịch được thể hiện qua từng đường cắt may và từng chuyển động của tà áo. Lấy cảm hứng từ làn gió mát mang theo sự bình yên và tự do, Thanh Phong mang gam màu xanh dịu cùng họa tiết tinh tế, tạo nên tổng thể mềm mại nhưng vẫn đầy cuốn hút. Thiết kế hướng đến người phụ nữ yêu sự tối giản, thanh lịch và luôn tự tin thể hiện bản sắc riêng.",
    fabric: "Tafta cao cấp (giãn ngang nhẹ)",
    colors: [
      { name: "Xanh Dịu", code: "#2563EB" },
      { name: "Đỏ Thanh Phong", code: "#DC2626" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/anh/748811734_122119072365355470_5191248946269688850_n.jpg",
      "/anh/748931198_122119072389355470_4323049577285984388_n.jpg"
    ],
    has360View: true,
    hasAiTryOn: true,
    hotspots: [
      { x: "50%", y: "40%", title: "Áo Choàng Tay Cánh Dơi", description: "Thiết kế gile cổ thuyền khóa sau sang trọng." }
    ]
  },
  {
    id: "ad-moclan-03",
    name: "Áo Dài Gấm Tơ Mềm Sương Mai",
    collection: "moc-lan",
    category: "truyen-thong",
    price: 1499000,
    originalPrice: 1750000,
    formattedPrice: "1.499.000đ",
    formattedOriginalPrice: "1.750.000đ",
    rating: 4.9,
    reviewsCount: 43,
    isNew: true,
    isBestSeller: false,
    isExpress24h: true,
    expressTag: "Giao 24h - Miễn phí may đo",
    description: "Chất liệu gấm tơ mềm cao cấp: mềm, mịn, mát, co dãn tốt. Phong cách trẻ trung, thanh lịch, giản dị phù hợp mọi lứa tuổi.",
    storyTitle: "SƯƠNG MAI | Khi bình yên được khoác lên thành tà áo",
    storyContent: "Có những buổi sáng khiến người ta chẳng muốn vội. Là khi ánh nắng vừa chạm khẽ lên hiên nhà, khi làn gió mang theo hương cỏ non và những giọt sương còn đọng trên cánh lá. Đó cũng chính là nguồn cảm hứng để Daiverse tạo nên Sương Mai. Một thiết kế mang gam xanh ngọc dịu nhẹ, gợi nhớ đến vẻ đẹp thuần khiết của buổi sớm. Không phô trương, không cầu kỳ, chỉ lặng lẽ tôn lên nét thanh tao của người mặc.",
    fabric: "Gấm tơ mềm cao cấp",
    colors: [
      { name: "Xanh Ngọc Dịu", code: "#14B8A6" },
      { name: "Trắng Kem", code: "#FDFBF7" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/anh/747178293_122119072509355470_7986902361393680700_n.jpg",
      "/anh/748552016_122119237911355470_8898990539200168318_n.jpg"
    ],
    has360View: true,
    hasAiTryOn: true
  },
  {
    id: "ad-moclan-04",
    name: "Áo Dài Cách Tân Chất Tơ Mộc An",
    collection: "moc-lan",
    category: "cach-tan",
    price: 1599000,
    originalPrice: 1850000,
    formattedPrice: "1.599.000đ",
    formattedOriginalPrice: "1.850.000đ",
    rating: 4.8,
    reviewsCount: 39,
    isNew: true,
    isBestSeller: true,
    isExpress24h: false,
    description: "Áo dài cách tân chất tơ mềm mại. Sắc hồng phấn dịu dàng kết hợp điểm nhấn xanh non nơi tà quần như bức tranh mùa xuân.",
    storyTitle: "MỘC AN | Bình yên trong từng nếp áo",
    storyContent: "Có những vẻ đẹp không đến từ sự nổi bật, mà từ cảm giác bình yên khi ngắm nhìn. Mộc An được lấy cảm hứng từ thiên nhiên – nơi mọi thứ đều nhẹ nhàng, chậm rãi nhưng luôn mang một sức sống bền bỉ. Đó là vẻ đẹp của sự an nhiên, của những tâm hồn biết trân trọng những điều giản dị. Mộc An – dành cho những cô gái yêu sự tinh tế, sống chậm để cảm nhận và luôn mang trong mình một vẻ đẹp dịu dàng rất riêng.",
    fabric: "Tơ mềm cao cấp",
    colors: [
      { name: "Hồng Phấn", code: "#F472B6" },
      { name: "Vàng Nắng", code: "#FBBF24" },
      { name: "Xanh Cốm", code: "#84CC16" },
      { name: "Xanh Dương", code: "#3B82F6" }
    ],
    sizes: ["S", "M", "L"],
    images: [
      "/anh/748948738_122119559763355470_8315866031234642956_n.jpg",
      "/anh/748978674_122119238085355470_3727930377974231420_n.jpg"
    ],
    has360View: true,
    hasAiTryOn: true
  },
  {
    id: "ad-moclan-05",
    name: "Áo Dài Tơ Tằm Ánh Kim 4 Tà Hồng Nguyệt",
    collection: "moc-lan",
    category: "truyen-thong",
    price: 1499000,
    originalPrice: 1790000,
    formattedPrice: "1.499.000đ",
    formattedOriginalPrice: "1.790.000đ",
    rating: 5.0,
    reviewsCount: 58,
    isNew: true,
    isBestSeller: true,
    isExpress24h: true,
    expressTag: "Sẵn size S, M, L - Giao nhanh 24h",
    description: "Áo tơ tằm ánh kim 4 tà hồng và vàng cao cấp. Thiết kế ôm đường nét, kết hợp họa tiết dệt tinh xảo đằm thắm.",
    storyTitle: "HỒNG NGUYỆT | Dịu dàng như ánh trăng, rạng rỡ theo cách riêng",
    storyContent: "Cũng như ánh trăng mang sắc hồng dịu nhẹ giữa bầu trời chiều, Hồng Nguyệt lan tỏa một sức hút rất riêng – nhẹ nhàng, đằm thắm nhưng đủ để lưu lại trong lòng người đối diện. Lấy cảm hứng từ vẻ đẹp ấy, Daiverse tạo nên một thiết kế dành cho những cô gái yêu sự nữ tính và thanh lịch. Hồng Nguyệt – dành cho những tâm hồn yêu sự dịu dàng, trân trọng nét đẹp truyền thống và luôn tự tin viết nên câu chuyện của riêng mình.",
    fabric: "Tơ tằm ánh kim 4 tà cao cấp",
    colors: [
      { name: "Hồng Ánh Kim", code: "#EC4899" },
      { name: "Vàng Ánh Kim", code: "#F59E0B" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/anh/749239603_122119072485355470_980697849173578283_n.jpg",
      "/anh/749315083_122119238007355470_8087645459800718314_n.jpg"
    ],
    has360View: true,
    hasAiTryOn: true
  }
];
