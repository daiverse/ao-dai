import React, { useState } from "react";
import { Sparkles, Scissors, Feather, Award, ShieldCheck, Clock, CheckCircle2, Heart, Layers, Eye, ArrowLeft, ChevronLeft, ChevronRight, X, ArrowUpRight } from "lucide-react";
import { COLLECTIONS } from "../data/collections";
import { PRODUCTS } from "../data/products";

// ─── STORY DETAIL PAGE ───────────────────────────────────────────────────────
function StoryDetail({ product, onBack }) {
  const [activeImg, setActiveImg] = useState(0);

  const goNext = () => setActiveImg(i => (i + 1) % product.images.length);
  const goPrev = () => setActiveImg(i => (i - 1 + product.images.length) % product.images.length);

  return (
    <div className="pt-32 sm:pt-36 pb-20 bg-white min-h-screen">
      <div className="container-page max-w-6xl mx-auto">
        {/* Breadcrumb & back */}
        <div className="flex items-center justify-between gap-4 mb-8 pt-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059] transition-all cursor-pointer border-none"
          >
            <ArrowLeft className="w-4 h-4" />
            QUAY LẠI CÂU CHUYỆN
          </button>
          <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider hidden sm:block">
            <span>CÂU CHUYỆN</span>
            <span className="mx-1.5">/</span>
            <span className="text-[#C5A059]">{product.name}</span>
          </div>
        </div>

        {/* Two-column hero layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-16">

          {/* LEFT: Image Gallery */}
          <div className="space-y-4 sticky top-28">
            <div className="relative aspect-[3/4] bg-neutral-100 border border-neutral-300 shadow-xl overflow-hidden group">
              <img
                src={product.images[activeImg]}
                alt={`${product.name} - ảnh ${activeImg + 1}`}
                className="w-full h-full object-cover object-top transition-opacity duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-[#111111] text-white px-3 py-1">
                  {product.collection === "moc-lan" ? "BST MỘC LAN" : "BST PHONG SẮC"}
                </span>
              </div>
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 text-[#111111] shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer border-none"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 text-[#111111] shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer border-none"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className={`aspect-[3/4] overflow-hidden border-2 transition-all cursor-pointer p-0 ${
                    activeImg === idx
                      ? "border-[#111111]"
                      : "border-neutral-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`thumb ${idx + 1}`} className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Story Content */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059] bg-red-50 border border-red-200 px-3 py-1">
                {product.fabric}
              </span>
              {product.isExpress24h && (
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1">
                  ⚡ GIAO HỎA TỐC 24H
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#111111] uppercase tracking-wide">
                {product.storyTitle}
              </h1>
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">
                {product.name}
              </p>
            </div>

            <div className="h-0.5 bg-[#111111] w-20"></div>

            <div className="text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
              {product.storyContent}
            </div>

            <div className="bg-neutral-50 border border-neutral-300 p-5 space-y-3">
              <h3 className="font-heading font-black text-[#111111] text-xs uppercase tracking-widest">
                THÔNG SỐ THIẾT KẾ
              </h3>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-start gap-3">
                  <span className="text-[#C5A059] font-extrabold text-[11px] uppercase tracking-wider w-20 shrink-0">Chất liệu</span>
                  <span className="text-neutral-800 font-semibold">{product.fabric}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#C5A059] font-extrabold text-[11px] uppercase tracking-wider w-20 shrink-0">Bảng Size</span>
                  <span className="text-neutral-800 font-semibold">{product.sizes?.join(" · ")}</span>
                </div>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="bg-[#111111] text-white p-6 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-widest block mb-1">Giá bán niêm yết</span>
                  <span className="font-heading text-2xl font-black text-[#C5A059]">{product.formattedPrice}</span>
                </div>
              </div>
              <button className="w-full py-3.5 bg-[#C5A059] hover:bg-[#A4813D] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border-none flex items-center justify-center gap-2">
                <span>ĐẶT MUA NGAY</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Back button bottom */}
        <div className="flex justify-center pt-8 border-t border-neutral-200">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-[#111111] hover:bg-[#C5A059] text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer border-none"
          >
            <ArrowLeft className="w-4 h-4" />
            QUAY LẠI DANH SÁCH CÂU CHUYỆN
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── HERO BANNER SHOWCASE COMPONENT ──────────────────────────────────────────
function HeroBannerShowcase({ stats }) {
  const slides = [
    {
      id: "bach-lan",
      titleTop: "BẠCH",
      titleBottom: "LAN",
      subTitle: "BST MỘC LAN 2026",
      tagline: "DaiVerse kết hợp tinh hoa áo dài Việt với công nghệ AI 3D và Virtual Try-On, tôn vinh vẻ đẹp truyền thống và phong cách riêng biệt của người phụ nữ Việt.",
      image: "/anh/bach-lan/banner.png"
    },
    {
      id: "suong-mai",
      titleTop: "SƯƠNG",
      titleBottom: "MAI",
      subTitle: "BST MỘC LAN 2026",
      tagline: "Gấm tơ mềm óng ả hòa quyện cùng hoa sen thêu tay thủ công di sản, mang lại cảm xúc thanh tao và sang trọng tuyệt đối.",
      image: "/anh/suong-mai/banner.png"
    },
    {
      id: "thanh-phong",
      titleTop: "THANH",
      titleBottom: "PHONG",
      subTitle: "BST PHONG SẮC 2026",
      tagline: "Dáng suông Tafta giãn ngang 3 món phá cách đương đại, kiến tạo hình ảnh người phụ nữ tự tin, kiêu hãnh và hiện đại.",
      image: "/anh/thanh-phong/banner.png"
    }
  ];

  const [activeIdx, setActiveIdx] = useState(0);

  const nextSlide = () => setActiveIdx((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setActiveIdx((prev) => (prev - 1 + slides.length) % slides.length);

  const active = slides[activeIdx];

  return (
    <div className="mt-10 relative overflow-hidden bg-[#FAF6F0] border border-[#E5DECE] shadow-2xl transition-all duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
        
        {/* Left Editorial Content Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] text-white text-[10px] font-extrabold uppercase tracking-widest border border-[#C5A059]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{active.subTitle}</span>
          </div>

          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#C5A059] block mb-1">
              DAIVERSE HAUTE COUTURE EDITORIAL · 2026
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-[#111111] uppercase tracking-widest leading-none">
              {active.titleTop} <span className="text-[#C5A059]">{active.titleBottom}</span>
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal max-w-xl">
            {active.tagline}
          </p>

          {/* Quick Tab Switcher & Navigation Controls */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200">
            <div className="flex items-center gap-2">
              {slides.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                    activeIdx === idx
                      ? "bg-[#111111] text-white border-[#111111]"
                      : "bg-white text-neutral-700 border-neutral-300 hover:border-[#111111]"
                  }`}
                >
                  {item.titleTop} {item.titleBottom}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="w-9 h-9 bg-white border border-neutral-300 hover:border-[#111111] flex items-center justify-center text-[#111111] font-bold transition-all cursor-pointer"
              >
                ‹
              </button>
              <button
                onClick={nextSlide}
                className="w-9 h-9 bg-white border border-neutral-300 hover:border-[#111111] flex items-center justify-center text-[#111111] font-bold transition-all cursor-pointer"
              >
                ›
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-neutral-200">
            {stats.map((st, idx) => (
              <div key={idx} className="bg-white p-2.5 border border-neutral-300 text-center">
                <p className="font-heading text-lg sm:text-xl font-black text-[#C5A059]">{st.number}</p>
                <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-wider">{st.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Visual Image Stage Column */}
        <div className="lg:col-span-6">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-neutral-900 border border-neutral-300 shadow-xl group">
            <img
              src={active.image}
              alt={active.titleTop + " " + active.titleBottom}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059]">
                GIAO THOA DI SẢN & CÔNG NGHỆ AI
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-[#111111]/80 px-2.5 py-1 backdrop-blur-xs">
                SLIDE {activeIdx + 1} / {slides.length}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── ABOUT PAGE (Story Index) ─────────────────────────────────────────────────
export default function AboutPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (selectedProduct) {
    return <StoryDetail product={selectedProduct} onBack={handleBack} />;
  }

  const stats = [
    { number: "02", label: "BỘ SƯU TẬP MỚI" },
    { number: "05", label: "THIẾT KẾ ĐỘC BẢN" },
    { number: "100%", label: "LỤA GẤM CAO CẤP" },
    { number: "AI 3D", label: "THỬ ĐỒ THỜI TRANG" }
  ];

  const coreValues = [
    {
      step: "01",
      title: "TINH HOA CHẤT LIỆU",
      desc: "Tuyển chọn các chất liệu thượng hạng từ Lụa gấm trúc, Gấm tơ mềm, Tơ tằm ánh kim 4 tà cho đến Tafta cao cấp."
    },
    {
      step: "02",
      title: "GIAO THOA ĐƯƠNG ĐẠI",
      desc: "Sự kết hợp hoàn hảo giữa nét đẹp truyền thống thanh lịch và phong cách hiện đại Áo Dài DaiVerse trong từng nếp áo."
    },
    {
      step: "03",
      title: "CÁ NHÂN HÓA CÔNG NGHỆ",
      desc: "Ứng dụng DaiVerse AI Design Studio & Virtual Try-on giúp xem trước phom dáng 3D và thử trang phục trực tiếp."
    }
  ];

  const commitments = [
    { icon: <ShieldCheck className="w-5 h-5 text-[#C5A059]" />, title: "CHẤT LIỆU THƯỢNG HẠNG", desc: "Cam kết lụa gấm trúc, gấm tơ mềm chuẩn chất lượng thời trang DaiVerse." },
    { icon: <Clock className="w-5 h-5 text-[#C5A059]" />, title: "GIAO HÀNG 24H", desc: "Đội ngũ sẵn size S, M, L giao hỏa tốc 24h và hỗ trợ chỉnh sửa phom dáng." },
    { icon: <Scissors className="w-5 h-5 text-[#C5A059]" />, title: "PHOM DÁNG CHUẨN MỰC", desc: "Tỉ lệ đường may tôn vinh đường cong thanh thoát của phụ nữ Việt." },
    { icon: <Award className="w-5 h-5 text-[#C5A059]" />, title: "TRẢI NGHIỆM DAIVERSE VIP", desc: "Xem trước sản phẩm với công nghệ thử đồ ảo trực quan." }
  ];

  const mocLanProducts = PRODUCTS.filter(p => p.collection === "moc-lan");
  const phongSacProducts = PRODUCTS.filter(p => p.collection === "phong-sac");

  return (
    <div className="pt-32 sm:pt-36 pb-20 bg-white min-h-screen text-[#111111]">
      {/* 1. Hero Header Section */}
      <section className="container-page mb-16">
        <div className="text-center max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#111111] text-white text-[11px] font-extrabold uppercase tracking-widest border border-[#C5A059]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>CÂU CHUYỆN THƯƠNG HIỆU · DAIVERSE 2026</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] uppercase tracking-wide leading-tight">
            ÁO DÀI DAIVERSE — THIẾT KẾ ÁO DÀI CAO CẤP <br />
            <span className="text-[#C5A059]">GIAO THOA DI SẢN & ĐƯƠNG ĐẠI</span>
          </h1>

          <p className="text-neutral-600 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto font-normal leading-relaxed">
            Mang đến trải nghiệm mua sắm Áo Dài thời trang hiện đại, cá nhân hóa bằng công nghệ AI Virtual Try-on giúp phái đẹp tỏa sáng rạng ngời.
          </p>
        </div>

        {/* Hero Interactive Showcase Image Banner */}
        <HeroBannerShowcase stats={stats} />
      </section>

      {/* 2. Core Pillars Section */}
      <section className="py-16 bg-neutral-50 border-y border-neutral-200 mb-16">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-extrabold block mb-1">TRIẾT LÝ THIẾT KẾ</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#111111] uppercase">NÉT ĐẸP QUÝ PHÁI & SANG TRỌNG</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreValues.map((pillar, idx) => (
              <div key={idx} className="p-6 bg-white border border-neutral-300 space-y-3">
                <span className="text-2xl font-heading font-black text-[#C5A059] block">{pillar.step}</span>
                <h3 className="font-heading font-black text-base text-[#111111] uppercase">{pillar.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-normal">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Collections with CLICKABLE Design Cards */}
      <section className="container-page space-y-16 mb-20">

        {/* BST 1: Mộc Lan */}
        <div className="bg-white border border-neutral-300 p-6 sm:p-10 space-y-8">
          <div className="border-b border-neutral-200 pb-6">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059] block mb-1">BỘ SƯU TẬP 01</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#111111] uppercase">
              BST MỘC LAN — THUẦN KHẢO & BÌNH YÊN
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mocLanProducts.map(product => (
              <article
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className="group space-y-2 bg-neutral-50 p-4 border border-neutral-300 cursor-pointer hover:border-[#111111] transition-all"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-200">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-wider block">{product.fabric}</span>
                <h3 className="font-heading font-black text-sm text-[#111111] uppercase truncate">
                  {product.storyTitle.split('|')[0].trim()}
                </h3>
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="font-bold text-[#C5A059]">{product.formattedPrice}</span>
                  <span className="text-[#111111] font-bold uppercase text-[10px] flex items-center gap-1">
                    ĐỌC THÊM <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* BST 02: Phong Sắc */}
        <div className="bg-white border border-neutral-300 p-6 sm:p-10 space-y-8">
          <div className="border-b border-neutral-200 pb-6">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059] block mb-1">BỘ SƯU TẬP 02</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#111111] uppercase">
              BST PHONG SẮC — THANH THOÁT & THỜI THƯỢNG
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {phongSacProducts.map(product => (
              <article
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className="group space-y-2 bg-neutral-50 p-4 border border-neutral-300 cursor-pointer hover:border-[#111111] transition-all"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-200">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-wider block">{product.fabric}</span>
                <h3 className="font-heading font-black text-sm text-[#111111] uppercase truncate">
                  {product.storyTitle ? product.storyTitle.split('|')[0].trim() : product.name}
                </h3>
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="font-bold text-[#C5A059]">{product.formattedPrice}</span>
                  <span className="text-[#111111] font-bold uppercase text-[10px] flex items-center gap-1">
                    ĐỌC THÊM <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Brand Commitments Grid */}
      <section className="container-page mb-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-extrabold block mb-1">CAM KẾT CHẤT LƯỢNG</span>
          <h2 className="font-heading text-2xl font-black text-[#111111] uppercase">THỜI TRANG ÁO DÀI DAIVERSE VIP</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {commitments.map((cm, idx) => (
            <div key={idx} className="p-5 bg-neutral-50 border border-neutral-300 space-y-2">
              <div className="p-2 w-fit bg-white border border-neutral-300">{cm.icon}</div>
              <h4 className="font-heading font-black text-xs uppercase text-[#111111]">{cm.title}</h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-normal">{cm.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

