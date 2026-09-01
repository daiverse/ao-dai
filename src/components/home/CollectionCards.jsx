import React, { useState } from "react";
import { ArrowRight, Sparkles, ShieldCheck, Scissors, Eye, ChevronRight, CheckCircle2 } from "lucide-react";
import { COLLECTIONS } from "../../data/collections";
import { PRODUCTS } from "../../data/products";

export default function CollectionCards({ onSelectCollection }) {
  const [activeTab, setActiveTab] = useState("all");

  // Map enriched collection data with interactive photo gallery thumbnails
  const collectionList = [
    {
      id: "moc-lan",
      name: "Mộc Lan",
      subtitle: "KHỞI ĐẦU CỦA MỘT VẺ ĐẸP THUẦN KHẢO & BÌNH YÊN",
      description: "BST Mộc Lan mang sự giao thoa tinh tế giữa di sản may mặc Áo Dài truyền thống và hơi thở công nghệ AI thời trang. Bộ sưu tập quy tụ 4 tuyệt tác thiết kế: Bạch Lan, Sương Mai, Mộc An và Hồng Nguyệt.",
      priceFrom: "1.499.000đ",
      originalPrice: "1.750.000đ",
      badge: "BST MỚI RA MẮT 2026",
      mainImage: "/anh/suong-mai/1.jpg",
      gallery: [
        { id: "suong-mai", name: "Sương Mai", img: "/anh/suong-mai/1.jpg", desc: "Gấm tơ mềm dịu mát" },
        { id: "bach-lan", name: "Bạch Lan", img: "/anh/bach-lan/1.jpg", desc: "Lụa gấm trúc thêu hoa" },
        { id: "moc-an", name: "Mộc An", img: "/anh/moc-an/1.jpg", desc: "Tơ mềm hồng phấn" },
        { id: "hong-nguyet", name: "Hồng Nguyệt", img: "/anh/hong-nguyet/1.jpg", desc: "Tơ tằm ánh kim 4 tà" }
      ],
      highlights: [
        { title: "Chất Liệu Thượng Hạng", desc: "Tuyển chọn Lụa gấm trúc, Gấm tơ mềm & Tơ tằm ánh kim cao cấp" },
        { title: "Phom Dáng Chuẩn Mực", desc: "Tôn vinh đường cong dịu dàng, dịu mát và tôn vóc dáng phụ nữ Việt" },
        { title: "Trải Nghiệm AI & 3D", desc: "Xem chi tiết góc xoay 360° và thử trang phục trực tuyến bằng AI" }
      ]
    },
    {
      id: "phong-sac",
      name: "Phong Sắc",
      subtitle: "THANH THOÁT TRONG TỪNG NHỊP GIÓ ĐƯƠNG ĐẠI",
      description: "BST Phong Sắc là tiếng nói thời trang hiện đại dành cho quý cô yêu sự phá cách nhưng vẫn vẹn nguyên nét thanh lịch Áo Dài. Thiết kế Thanh Phong với áo khoác choàng tafta tạo lớp ứng biến độc đáo.",
      priceFrom: "1.799.000đ",
      originalPrice: "2.100.000đ",
      badge: "THIẾT KẾ VIP 2026",
      mainImage: "/anh/thanh-phong/1.jpg",
      gallery: [
        { id: "thanh-phong-1", name: "Thanh Phong", img: "/anh/thanh-phong/1.jpg", desc: "Tafta dáng suông cao cấp" },
        { id: "thanh-phong-2", name: "Áo Choàng Giles", img: "/anh/thanh-phong/2.jpg", desc: "Khoác ngoài cánh dơi sang trọng" },
        { id: "thanh-phong-3", name: "Cận Cảnh Dệt", img: "/anh/thanh-phong/3.png", desc: "Họa tiết ánh kim tinh tế" }
      ],
      highlights: [
        { title: "Set 3 Món Đa Năng", desc: "Bao gồm Áo dài, Quần lụa & Áo choàng tay cánh dơi thời thượng" },
        { title: "Chất Liệu Tafta Cao Cấp", desc: "Độ giãn nhẹ, giữ phom dáng suông đứng tạo sự quý phái" },
        { title: "May Đo Cá Nhân Hóa", desc: "Hỗ trợ may chuẩn theo thông số số đo riêng của khách hàng" }
      ]
    }
  ];

  const filteredCollections = activeTab === "all" 
    ? collectionList 
    : collectionList.filter(c => c.id === activeTab);

  return (
    <section className="py-20 lg:py-28 bg-[#FAF6F0] relative overflow-hidden border-b border-neutral-200">
      
      {/* Background Luxury Ambient Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(197, 160, 89, 0.08) 0%, transparent 70%), radial-gradient(circle at 80% 70%, rgba(164, 129, 61, 0.08) 0%, transparent 70%)`
        }}
      ></div>

      <div className="container-page relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#111111] text-white text-[11px] font-extrabold uppercase tracking-widest border border-[#C5A059] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>HAUTE COUTURE COLLECTION · 2026</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111111] uppercase tracking-wide">
            BỘ SƯU TẬP <span className="text-[#C5A059]">DAIVERSE</span>
          </h2>

          <p className="text-xs sm:text-sm lg:text-base text-neutral-600 max-w-xl mx-auto font-normal leading-relaxed">
            Sự kết hợp tinh tế giữa nghệ thuật may mặc Áo Dài truyền thống và công nghệ thời trang số DaiVerse AI Studio.
          </p>

          {/* Interactive Collection Filter Tabs */}
          <div className="flex items-center justify-center gap-2 pt-4 flex-wrap">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                activeTab === "all"
                  ? "bg-[#111111] text-white border-[#111111] shadow-md"
                  : "bg-white text-neutral-700 border-neutral-300 hover:border-[#C5A059]"
              }`}
            >
              TẤT CẢ BST ({collectionList.length})
            </button>
            {collectionList.map((col) => (
              <button
                key={col.id}
                onClick={() => setActiveTab(col.id)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  activeTab === col.id
                    ? "bg-[#111111] text-white border-[#111111] shadow-md"
                    : "bg-white text-neutral-700 border-neutral-300 hover:border-[#C5A059]"
                }`}
              >
                BST {col.name}
              </button>
            ))}
          </div>
        </div>

        {/* Collection Showcase Cards List */}
        <div className="space-y-16 lg:space-y-24">
          {filteredCollections.map((col, index) => (
            <CollectionCardItem 
              key={col.id} 
              col={col} 
              isEven={index % 2 === 0} 
              onSelectCollection={onSelectCollection}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

// Subcomponent: Individual Collection Card with Interactive Multi-Photo Gallery State
function CollectionCardItem({ col, isEven, onSelectCollection }) {
  const [selectedImg, setSelectedImg] = useState(col.mainImage);
  const [activeThumbId, setActiveThumbId] = useState(col.gallery[0]?.id || "");

  const handleThumbClick = (item) => {
    setSelectedImg(item.img);
    setActiveThumbId(item.id);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md border border-[#E5DECE] shadow-xl hover:shadow-2xl transition-all duration-500 p-6 sm:p-8 lg:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Visual Gallery Showcase */}
        <div className={`lg:col-span-7 space-y-4 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
          
          {/* Main Display Stage */}
          <div 
            onClick={() => onSelectCollection && onSelectCollection(col.id)}
            className="group relative cursor-pointer overflow-hidden bg-neutral-900 aspect-[4/3] sm:aspect-[16/10] border border-neutral-300 shadow-inner"
          >
            <img
              src={selectedImg}
              alt={col.name}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />

            {/* Subtle Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20"></div>

            {/* Top Left Badge */}
            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 bg-[#111111] text-white text-[10px] font-extrabold uppercase tracking-widest border border-[#C5A059]">
              <Sparkles className="w-3 h-3 text-[#C5A059]" />
              <span>{col.badge}</span>
            </div>

            {/* Floating Action Overlay on Hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[2px]">
              <span className="px-5 py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-widest border border-[#C5A059] flex items-center gap-2 shadow-2xl">
                <Eye className="w-4 h-4 text-[#C5A059]" />
                <span>XEM CHI TIẾT BỘ SƯU TẬP</span>
              </span>
            </div>

            {/* Bottom Left Title Caption */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059]">
                THIẾT KẾ ÁO DÀI DAIVERSE
              </p>
              <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wide mt-0.5 drop-shadow-md">
                {col.name}
              </h3>
            </div>
          </div>

          {/* Interactive Thumbnails Carousel Strip */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 pt-1">
            {col.gallery.map((thumb) => {
              const isActive = activeThumbId === thumb.id;
              return (
                <button
                  key={thumb.id}
                  onClick={() => handleThumbClick(thumb)}
                  className={`group/thumb relative aspect-[4/3] overflow-hidden border-2 transition-all cursor-pointer p-0 bg-neutral-100 ${
                    isActive ? "border-[#C5A059] ring-2 ring-[#C5A059]/30" : "border-neutral-200 hover:border-neutral-400 opacity-80 hover:opacity-100"
                  }`}
                >
                  <img
                    src={thumb.img}
                    alt={thumb.name}
                    className="w-full h-full object-cover object-top group-hover/thumb:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/80 text-white text-[9px] font-bold p-1 text-center truncate">
                    {thumb.name}
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Right Column: High Fashion Editorial Specs & CTA */}
        <div className={`lg:col-span-5 space-y-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
          
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#C5A059] block mb-1">
              {col.subtitle}
            </span>
            <h3 className="font-heading text-3xl sm:text-4xl font-black text-[#111111] uppercase tracking-wide">
              BỘ SƯU TẬP <span className="text-[#C5A059]">{col.name}</span>
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mt-3 font-normal">
              {col.description}
            </p>
          </div>

          {/* Highlights Features Grid */}
          <div className="space-y-3 pt-2 border-t border-neutral-200">
            {col.highlights.map((hl, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-neutral-50/80 border border-neutral-200/80 hover:border-[#C5A059] transition-colors">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading font-black text-xs uppercase text-[#111111]">{hl.title}</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5 leading-normal">{hl.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Price & Action CTA */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-neutral-200">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-extrabold block">GIÁ ƯU ĐÃI CHỈ TỪ</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-heading text-[#C5A059]">
                  {col.priceFrom}
                </span>
                {col.originalPrice && (
                  <span className="text-xs text-neutral-400 line-through">
                    {col.originalPrice}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => onSelectCollection && onSelectCollection(col.id)}
              className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#111111] hover:bg-[#C5A059] text-white text-xs font-bold uppercase tracking-widest transition-all cursor-pointer border-none shadow-md hover:shadow-xl"
            >
              <span>KHÁM PHÁ NGAY</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#C5A059] group-hover:text-white" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
