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
    slug: "ao-dai-lua-gam-truc-bach-lan",
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
    hotspots: [
      { x: "45%", y: "30%", title: "Lụa Gấm Trúc", description: "Họa tiết dệt gấm trúc tinh xảo mềm mại." },
      { x: "50%", y: "15%", title: "Cổ Áo Tối Giản", description: "Tôn vinh vẻ đẹp thuần khiết và thanh thoát." }
    ]
  },
  {
    id: "ad-moclan-02",
    name: "Áo Dài Gấm Tơ Mềm Sương Mai",
    slug: "ao-dai-gam-to-mem-suong-mai",
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
    description: "Chất liệu: Gấm tơ mềm cao cấp: mềm, mịn, mát, co dãn tốt, phong cách trẻ trung, thanh lịch, giản dị phù hợp với mọi lứa tuổi.",
    storyTitle: "SƯƠNG MAI | Khi bình yên được khoác lên thành tà áo",
    storyContent: "Có những buổi sáng khiến người ta chẳng muốn vội. Là khi ánh nắng vừa chạm khẽ lên hiên nhà, khi làn gió mang theo hương cỏ non và những giọt sương còn đọng trên cánh lá. Đó cũng chính là nguồn cảm hứng để Daiverse tạo nên Sương Mai. Một thiết kế mang gam xanh ngọc dịu nhẹ, gợi nhớ đến vẻ đẹp thuần khiết của buổi sớm. Không phô trương, không cầu kỳ, chỉ lặng lẽ tôn lên nét thanh tao của người mặc qua từng đường dệt, từng nếp vải và từng chuyển động của tà áo.",
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
      "/anh/suong-mai/4.jpg"
    ],
    has360View: true,
    hasAiTryOn: true
  },
  {
    id: "ad-moclan-03",
    name: "Áo Dài Cách Tân Chất Tơ Mộc An",
    slug: "ao-dai-cach-tan-chat-to-moc-an",
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
    storyContent: "Có những vẻ đẹp không đến từ sự nổi bật, mà từ cảm giác bình yên khi ngắm nhìn. Mộc An được lấy cảm hứng từ thiên nhiên – nơi mọi thứ đều nhẹ nhàng, chậm rãi nhưng luôn mang một sức sống bền bỉ. Đó là vẻ đẹp của sự an nhiên, của những tâm hồn biết trân trọng những điều giản dị. Sắc hồng phấn dịu dàng kết hợp cùng điểm nhấn xanh non nơi tà quần như một bức tranh mùa xuân, mang theo hơi thở của cây cỏ và những ngày nắng nhẹ.",
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
      "/anh/moc-an/3.png",
      "/anh/moc-an/4.png"
    ],
    has360View: true,
    hasAiTryOn: true
  },
  {
    id: "ad-moclan-04",
    name: "Áo Dài Tơ Tằm Ánh Kim 4 Tà Hồng Nguyệt",
    slug: "ao-dai-to-tam-anh-kim-4-ta-hong-nguyet",
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
    storyContent: "Cũng như ánh trăng mang sắc hồng dịu nhẹ giữa bầu trời chiều, Hồng Nguyệt lan tỏa một sức hút rất riêng – nhẹ nhàng, đằm thắm nhưng đủ để lưu lại trong lòng người đối diện. Lấy cảm hứng từ vẻ đẹp ấy, Daiverse tạo nên một thiết kế dành cho những cô gái yêu sự nữ tính và thanh lịch. Sắc hồng mềm mại ôm lấy từng đường nét, kết hợp cùng họa tiết dệt tinh xảo, tôn lên vẻ đẹp dịu dàng mà không kém phần cuốn hút.",
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
    hasAiTryOn: true
  },
  {
    id: "ad-phongsac-01",
    name: "Áo Dài Tafta Dáng Suông Thanh Phong",
    slug: "ao-dai-tafta-dang-suong-thanh-phong",
    collection: "phong-sac",
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
    description: "Sản phẩm gồm: 1 áo, 1 quần, 1 áo khoác choàng tay cánh dơi chun gấu sau, chun cổ tay, dáng gile, cổ thuyền dây trang trí ngực khóa sau.",
    storyTitle: "THANH PHONG | Thanh thoát trong từng nhịp gió",
    storyContent: "Có những vẻ đẹp không cần quá rực rỡ để trở nên nổi bật. Đó là sự nhẹ nhàng đủ để khiến người khác lưu luyến, là nét thanh lịch được thể hiện qua từng đường cắt may và từng chuyển động của tà áo. Lấy cảm hứng từ làn gió mát mang theo sự bình yên và tự do, Thanh Phong mang gam màu xanh dịu cùng họa tiết tinh tế, tạo nên tổng thể mềm mại nhưng vẫn đầy cuốn hút.",
    fabric: "Tafta cao cấp (giãn ngang nhẹ)",
    colors: [
      { name: "Xanh Dịu", code: "#2563EB" },
      { name: "Đỏ Thanh Phong", code: "#DC2626" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/anh/thanh-phong/1.jpg",
      "/anh/thanh-phong/2.jpg",
      "/anh/thanh-phong/3.png"
    ],
    has360View: true,
    hasAiTryOn: true,
    hotspots: [
      { x: "50%", y: "40%", title: "Áo Choàng Tay Cánh Dơi", description: "Thiết kế gile cổ thuyền khóa sau sang trọng." }
    ]
  }
];
