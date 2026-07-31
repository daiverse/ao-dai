import React, { useState } from "react";
import { Eye, Sparkles, ArrowRight, Palette } from "lucide-react";

export default function LookbookPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);

  const lookbookItems = [
    {
      id: 1,
      title: "Gấm Sen Thêu Tay Mộng Liên",
      category: "mong-lien",
      tag: "BST Mộng Liên",
      image: "/anh/746927465_122119237899355470_7558522641041819280_n.jpg",
      description: "Thanh khiết và dịu dàng trong từng thớ lụa dệt hoa sen thủ công."
    },
    {
      id: 2,
      title: "Họa Tiết Sen Hồng Cao Cấp",
      category: "mong-lien",
      tag: "BST Mộng Liên",
      image: "/anh/746947278_122119072383355470_6400495368402003300_n.jpg",
      description: "Đóa sen nở rộ trên nền lụa tơ tằm thanh tú tôn vinh nét đẹp Việt."
    },
    {
      id: 3,
      title: "Gấm Hoàng Gia Xích Nguyệt",
      category: "huong-co-do",
      tag: "BST Hương Cố Đô",
      image: "/anh/747178293_122119072509355470_7986902361393680700_n.jpg",
      description: "Sắc đỏ son kiêu hãnh của di sản quý phái hoàng cung Huế."
    },
    {
      id: 4,
      title: "Thêu Tay Chim Phụng Quý Phái",
      category: "huong-co-do",
      tag: "BST Hương Cố Đô",
      image: "/anh/748552016_122119237911355470_8898990539200168318_n.jpg",
      description: "Đường kim mũi chỉ thủ công 18 giờ tỉ mỉ sắc nét."
    },
    {
      id: 5,
      title: "Ánh Trăng Ôm Thớ Lụa",
      category: "trang-trong-lua",
      tag: "BST Trăng Trong Lụa",
      image: "/anh/748811734_122119072365355470_5191248946269688850_n.jpg",
      description: "Tà áo xanh ngọc mềm mại tựa dòng sông thu dạt dào cảm xúc."
    },
    {
      id: 6,
      title: "Nét Đẹp Thanh Tĩnh Cổ Điển",
      category: "trang-trong-lua",
      tag: "BST Trăng Trong Lụa",
      image: "/anh/748931198_122119072389355470_4323049577285984388_n.jpg",
      description: "Phom dáng truyền thống chuẩn mực kết hợp tay lỡ thanh thoát."
    },
    {
      id: 7,
      title: "Cách Tân Tay Phồng Hiện Đại",
      category: "mong-lien",
      tag: "Áo Dài Cách Tân",
      image: "/anh/748948738_122119559763355470_8315866031234642956_n.jpg",
      description: "Sự kết hợp giữa phom dáng hiện đại và hoa văn di sản tinh tế."
    },
    {
      id: 8,
      title: "Dáng Áo Dài Thắt Eo Tinh Tế",
      category: "trang-trong-lua",
      tag: "BST Trăng Trong Lụa",
      image: "/anh/748978674_122119238085355470_3727930377974231420_n.jpg",
      description: "Tôn vinh đường cong tự nhiên với chất liệu lụa rủ êm ái."
    },
    {
      id: 9,
      title: "Cử Tấm Dệt Kim Tuyến",
      category: "huong-co-do",
      tag: "BST Hương Cố Đô",
      image: "/anh/749239603_122119072485355470_980697849173578283_n.jpg",
      description: "Sợi kim tuyến phản chiếu ánh sáng kiêu sa phong cách Cử Tấm."
    },
    {
      id: 10,
      title: "Thêu Nổi Hoa Cúc Sang Trọng",
      category: "huong-co-do",
      tag: "BST Hương Cố Đô",
      image: "/anh/749315083_122119238007355470_8087645459800718314_n.jpg",
      description: "Phong cách quý tộc di sản thượng hạng tinh xảo."
    },
    {
      id: 11,
      title: "Áo Dài Cưới Song Hỷ",
      category: "huong-co-do",
      tag: "Áo Dài Cưới",
      image: "/anh/750277229_122119559757355470_6275700024698490744_n.jpg",
      description: "Trang phục trọng đại gửi gắm trọn vẹn hạnh phúc lứa đôi."
    },
    {
      id: 12,
      title: "Lụa Tơ Tằm Thêu Đá Pha Lê",
      category: "huong-co-do",
      tag: "Áo Dài Cưới",
      image: "/anh/752347459_122120858961355470_5997594624170821473_n.jpg",
      description: "Kết tinh từ lụa Ý cao cấp và đá pha lê sáng lấp lánh rạng rỡ."
    }
  ];

  const filteredItems = activeFilter === "all"
    ? lookbookItems
    : lookbookItems.filter(item => item.category === activeFilter);

  const group1 = filteredItems.slice(0, 3);
  const group2 = filteredItems.slice(3, 6);
  const group3 = filteredItems.slice(6, 9);
  const group4 = filteredItems.slice(9, 12);

  const renderCard = (item) => (
    <div
      key={item.id}
      onClick={() => setSelectedImage(item)}
      className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl aspect-[3/4] cursor-pointer bg-gray-100 border border-gray-100 transition-all duration-500"
    >
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Eye className="w-4 h-4" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7 text-white">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4A373] font-semibold bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-xs inline-block mb-2">
          {item.tag}
        </span>
        <h3 className="font-heading text-2xl sm:text-3xl font-bold leading-tight group-hover:text-[#F4E8E1] transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-white/80 mt-2 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );

  return (
    <div className="pt-28 pb-20 bg-[#FBF9F5] min-h-screen">
      <div className="container-page">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.32em] text-[#C85A32] font-bold mb-3">
            Bộ Sưu Tập Ảnh Nghệ Thuật · 2026
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Lookbook High-Fashion DaiVerse
          </h1>
          <p className="text-gray-600 mt-4 text-base sm:text-lg leading-relaxed">
            Hình ảnh trình diễn thực tế và bộ sưu tập áo dài cao cấp may đo thủ công kết hợp công nghệ AI Studio.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-16">
          {[
            { id: "all", label: "Tất Cả Mẫu" },
            { id: "mong-lien", label: "BST Mộng Liên" },
            { id: "trang-trong-lua", label: "BST Trăng Trong Lụa" },
            { id: "huong-co-do", label: "BST Hương Cố Đô" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer border-none outline-none ${
                activeFilter === tab.id
                  ? "bg-[#18392B] text-white shadow-lg shadow-[#18392B]/20 scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SECTION 1: Group 1 Cards */}
        {group1.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {group1.map(renderCard)}
          </div>
        )}

        {/* INTERSPERSED BANNER 1: Feature Editorial Banner */}
        {activeFilter === "all" && (
          <div className="my-16 rounded-3xl overflow-hidden shadow-2xl relative bg-[#18392B] text-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-6 h-[280px] sm:h-[350px] lg:h-[380px] relative overflow-hidden">
                <img
                  src="/anh/753471319_122120858943355470_7991801264771199577_n.jpg"
                  alt="Feature Editorial 1"
                  className="w-full h-full object-cover object-[15%_top]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#18392B]/40 to-[#18392B] hidden lg:block"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#18392B] to-transparent lg:hidden"></div>
              </div>

              <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 space-y-3 sm:space-y-4">
                <span className="text-xs uppercase tracking-[0.3em] text-[#D4A373] font-bold block">
                  Tuyệt Tác May Đo Di Sản
                </span>
                <h3 className="font-heading text-3xl sm:text-4xl font-bold leading-tight">
                  Nghệ Thuật Thêu Tay Hoàng Thành Huế
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Mỗi đường kim mũi chỉ là sự lắng đọng di sản 20 năm của các nghệ nhân cố đô. Chất liệu gấm dệt kim tuyến phản chiếu ánh sáng lộng lẫy trong từng nhịp bước.
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4A373] bg-white/10 px-4 py-2 rounded-full border border-white/20">
                    <Sparkles className="w-4 h-4" />
                    <span>Bộ Sưu Tập Giới Hạn 2026</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: Group 2 Cards */}
        {group2.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {group2.map(renderCard)}
          </div>
        )}

        {/* INTERSPERSED BANNER 2: AI Try-On Banner */}
        {activeFilter === "all" && (
          <div className="my-16 rounded-3xl overflow-hidden shadow-2xl relative bg-[#C85A32] text-white p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Trải Nghiệm Công Nghệ AI Studio</span>
                </div>
                <h3 className="font-heading text-3xl sm:text-4xl font-bold leading-tight">
                  Tự Tay Thiết Kế & Thử Áo Dài Trực Tiếp Trên Ảnh Cá Nhân
                </h3>
                <p className="text-sm text-white/90 leading-relaxed max-w-2xl">
                  Chỉ cần tải ảnh cá nhân của bạn lên hệ thống AI Studio, mô hình trí tuệ nhân tạo sẽ giả lập mặc thử áo dài vừa vặn từng tỉ lệ cơ thể trước khi đặt may.
                </p>
              </div>
              <div className="lg:col-span-4 flex lg:justify-end">
                <button
                  onClick={() => window.location.href = "#try-on"}
                  className="px-8 py-4 bg-white text-[#C85A32] rounded-full font-bold shadow-xl hover:bg-gray-100 transition-all flex items-center gap-2 text-sm cursor-pointer border-none"
                >
                  <Palette className="w-4 h-4" />
                  <span>Trải Nghiệm AI Ngay</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: Group 3 Cards */}
        {group3.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {group3.map(renderCard)}
          </div>
        )}

        {/* INTERSPERSED BANNER 3: Lotus Silk Feature Banner */}
        {activeFilter === "all" && (
          <div className="my-16 rounded-3xl overflow-hidden shadow-2xl relative bg-white border border-gray-200/80">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 space-y-3 sm:space-y-4 lg:order-1 order-2">
                <span className="text-xs uppercase tracking-[0.3em] text-[#C85A32] font-bold block">
                  BST Mộng Liên · Sen Hồng
                </span>
                <h3 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                  Hương Sen Thanh Khiết Trong Từng Thớ Lụa
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Được dệt từ chất liệu lụa Bảo Lộc 100% tự nhiên, kết hợp họa tiết thêu đóa sen hồng mềm mại mang đến cảm giác thoáng mát, rạng rỡ và kiêu hãnh.
                </p>
              </div>

              <div className="lg:col-span-7 h-[280px] sm:h-[350px] lg:h-[380px] relative lg:order-2 order-1 overflow-hidden">
                <img
                  src="/anh/755736353_122121324117355470_11826430014490496_n.jpg"
                  alt="Feature Editorial 2"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-white hidden lg:block"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent lg:hidden"></div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: Group 4 Cards */}
        {group4.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {group4.map(renderCard)}
          </div>
        )}
      </div>

      {/* Image Modal Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full md:w-1/2 h-[45vh] md:h-auto relative bg-gray-900">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-between bg-[#FBF9F5]">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C85A32] font-bold">
                  {selectedImage.tag}
                </span>
                <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2 mb-4">
                  {selectedImage.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {selectedImage.description}
                </p>
                <div className="p-4 rounded-2xl bg-white border border-gray-200/80 mb-4">
                  <p className="text-xs font-semibold text-[#18392B] uppercase tracking-wider mb-1">Chất Liệu & Chế Tác</p>
                  <p className="text-xs text-gray-600">Gấm lụa tơ tằm dệt thủ công 100%, thêu tay tỉ mỉ bởi nghệ nhân di sản.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="flex-1 py-3 bg-[#18392B] text-white rounded-full font-medium text-sm hover:bg-[#18392B]/90 transition-colors cursor-pointer border-none"
                >
                  Đóng Cửa Sổ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
