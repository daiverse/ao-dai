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
    <div className="pt-28 sm:pt-32 pb-24 bg-[#FDF6C0] min-h-screen">
      <div className="container-page max-w-6xl mx-auto">
        {/* Breadcrumb & back */}
        <div className="flex items-center justify-between gap-4 mb-8 pt-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-800 text-xs font-bold hover:bg-[#FFDF00] hover:text-white transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay Lại Câu Chuyện
          </button>
          <div className="text-xs text-gray-500 font-medium hidden sm:block">
            <span>Câu Chuyện</span>
            <span className="mx-1.5">/</span>
            <span className="text-[#C8920A] font-semibold">{product.name}</span>
          </div>
        </div>

        {/* Two-column hero layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-16">

          {/* LEFT: Image Gallery */}
          <div className="space-y-4 sticky top-28">
            {/* Main image */}
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100 shadow-2xl border border-gray-100 group">
              <img
                src={product.images[activeImg]}
                alt={`${product.name} - ảnh ${activeImg + 1}`}
                className="w-full h-full object-cover object-top transition-opacity duration-500"
              />
              {/* Collection badge */}
              <div className="absolute top-4 left-4">
                <span className="text-[11px] font-bold uppercase tracking-widest bg-[#FFDF00]/90 backdrop-blur-md text-[#E8C55A] px-3.5 py-1.5 rounded-full border border-white/10">
                  {product.collection === "moc-lan" ? "BST Mộc Lan" : "BST Phong Sắc"}
                </span>
              </div>
              {/* Nav arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer border-none"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-800" />
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer border-none"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-800" />
                  </button>
                </>
              )}
              {/* Image counter */}
              <div className="absolute bottom-4 right-4 text-xs bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full font-medium">
                {activeImg + 1} / {product.images.length}
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="grid grid-cols-4 gap-2.5">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className={`aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all cursor-pointer p-0 ${
                    activeImg === idx
                      ? "border-[#FFDF00] shadow-lg scale-105"
                      : "border-gray-200/80 hover:border-gray-400 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`thumb ${idx + 1}`} className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Story Content */}
          <div className="space-y-8">
            {/* Category & fabric badge */}
            <div className="flex flex-wrap gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#C8920A] bg-[#C8920A]/10 border border-[#C8920A]/20 px-4 py-1.5 rounded-full">
                {product.fabric}
              </span>
              {product.isExpress24h && (
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full">
                  ⚡ Giao Hỏa Tốc 24h
                </span>
              )}
            </div>

            {/* Story headline */}
            <div className="space-y-3">
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.15]">
                {product.storyTitle}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wider">
                {product.name}
              </p>
            </div>

            {/* Decorative divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-[#C8920A]/30"></div>
              <span className="text-[#C8920A] text-lg">✦</span>
              <div className="h-px flex-1 bg-[#C8920A]/30"></div>
            </div>

            {/* Story content */}
            <div className="text-base sm:text-lg text-gray-700 leading-[1.9] font-light">
              {product.storyContent}
            </div>

            {/* Detail specs */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="font-heading font-bold text-[#FFDF00] text-sm uppercase tracking-wider">
                Chi Tiết Thiết Kế
              </h3>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-[#C8920A] font-bold text-xs uppercase tracking-wide w-20 shrink-0 pt-0.5">Chất liệu</span>
                  <span className="text-gray-700 font-medium">{product.fabric}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#C8920A] font-bold text-xs uppercase tracking-wide w-20 shrink-0 pt-0.5">Sizes</span>
                  <span className="text-gray-700">{product.sizes?.join(" · ")}</span>
                </div>
                {product.description && (
                  <div className="flex items-start gap-3">
                    <span className="text-[#C8920A] font-bold text-xs uppercase tracking-wide w-20 shrink-0 pt-0.5">Mô tả</span>
                    <span className="text-gray-600 font-light leading-relaxed">{product.description}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price & CTA */}
            <div className="bg-[#FFDF00] rounded-2xl p-6 text-white space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[#E8C55A] text-xs uppercase tracking-wider font-bold block mb-1">Giá tham khảo</span>
                  <div className="flex items-baseline gap-3">
                    <span className="font-heading text-3xl font-bold text-white">{product.formattedPrice}</span>
                    {product.formattedOriginalPrice && (
                      <span className="text-white/40 line-through text-sm">{product.formattedOriginalPrice}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-white/60 text-xs block">⭐ {product.rating}</span>
                  <span className="text-white/60 text-xs">({product.reviewsCount} đánh giá)</span>
                </div>
              </div>
              <button className="w-full py-3.5 bg-[#C8920A] hover:bg-[#C8920A]/90 text-white font-bold text-sm rounded-xl transition-all cursor-pointer border-none flex items-center justify-center gap-2">
                <span>Đặt May Ngay</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Full-width photo story strip */}
        {product.images.length > 2 && (
          <section className="mb-16">
            <div className="text-center mb-8">
              <span className="text-xs uppercase tracking-[0.3em] text-[#C8920A] font-bold">Bộ Sưu Tập Ảnh</span>
              <h2 className="font-heading text-3xl font-bold text-gray-900 mt-1">
                Hành Trình Của {product.storyTitle.split('|')[0].trim()}
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className={`aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border-2 ${activeImg === idx ? "border-[#C8920A]" : "border-transparent"}`}
                >
                  <img src={img} alt={`${product.name} lookbook ${idx + 1}`} className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Back button bottom */}
        <div className="flex justify-center pt-8 border-t border-gray-200">
          <button
            onClick={onBack}
            className="px-8 py-4 bg-[#FFDF00] text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#FFDF00]/90 shadow-xl transition-all flex items-center gap-2 cursor-pointer border-none"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay Lại Danh Sách Câu Chuyện
          </button>
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

  // Render Story Detail if a product is selected
  if (selectedProduct) {
    return <StoryDetail product={selectedProduct} onBack={handleBack} />;
  }

  const stats = [
    { number: "02", label: "Bộ Sưu Tập Biểu Tượng" },
    { number: "05", label: "Thiết Kế Độc Bản" },
    { number: "100%", label: "Lụa Gấm & Tơ Cao Cấp" },
    { number: "AI 3D", label: "Thử Đồ Cá Nhân Hóa" }
  ];

  const coreValues = [
    {
      step: "01",
      title: "Tinh Hoa Chất Liệu",
      desc: "Tuyển chọn các chất liệu thượng hạng từ Lụa gấm trúc, Gấm tơ mềm, Tơ tằm ánh kim 4 tà cho đến Tafta giãn ngang cao cấp."
    },
    {
      step: "02",
      title: "Giao Thoa Đương Đại",
      desc: "Sự kết hợp hoàn hảo giữa nét đẹp truyền thống thanh lịch và hơi thở hiện đại trong từng nếp áo, đường cắt cúp."
    },
    {
      step: "03",
      title: "Cá Nhân Hóa Trí Tuệ AI",
      desc: "Ứng dụng AI Design Studio & Virtual Try-on giúp xem trước phom dáng 3D và thử áo dài trực tiếp trên ảnh cá nhân."
    }
  ];

  const commitments = [
    { icon: <ShieldCheck className="w-6 h-6 text-[#C8920A]" />, title: "Chất Liệu Thượng Hạng", desc: "Cam kết lụa gấm trúc, gấm tơ mềm & tơ tằm ánh kim 100% chuẩn di sản." },
    { icon: <Clock className="w-6 h-6 text-[#C8920A]" />, title: "May Sẵn & Giao 24h", desc: "Đội ngũ sẵn size S, M, L giao hỏa tốc 24h và hỗ trợ may đo cá nhân." },
    { icon: <Scissors className="w-6 h-6 text-[#C8920A]" />, title: "Phom Dáng Vừa Vặn", desc: "Tỉ lệ đường may tôn vinh đường cong thanh thoát tự nhiên của phụ nữ Việt." },
    { icon: <Award className="w-6 h-6 text-[#C8920A]" />, title: "Trải Nghiệm AI Trực Quan", desc: "Xem trước sản phẩm trên ảnh cá nhân trước khi quyết định may sở hữu." }
  ];

  // Group products by collection
  const mocLanProducts = PRODUCTS.filter(p => p.collection === "moc-lan");
  const phongSacProducts = PRODUCTS.filter(p => p.collection === "phong-sac");

  return (
    <div className="pt-32 sm:pt-36 lg:pt-32 pb-24 bg-[#FDF6C0] min-h-screen text-gray-900">
      {/* 1. Hero Header Section */}
      <section className="container-page mb-16 lg:mb-20">
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-[0.35em] text-[#C8920A] font-bold px-4 py-1.5 rounded-full bg-[#C8920A]/10 border border-[#C8920A]/20 inline-block">
            Câu Chuyện Thương Hiệu · DaiVerse 2026
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.18]">
            DaiVerse — Giải Pháp Cá Nhân Hóa Áo Dài Việt<br />
            <span className="text-[#FFDF00] italic font-heading font-semibold">Giao Thoa Di Sản Truyền Thống & AI Đương Đại</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mt-4 leading-relaxed max-w-3xl mx-auto font-light">
            DaiVerse được xây dựng với mong muốn mang đến một trải nghiệm mua sắm áo dài hiện đại, trực quan và cá nhân hóa. Thông qua ứng dụng công nghệ AI, mô phỏng 3D và thử đồ ảo (Virtual Try-on), DaiVerse giúp khách hàng dễ dàng lựa chọn kiểu dáng, xem trước tà áo dài trên vóc dáng cá nhân và đặt may sản phẩm phù hợp nhất.
          </p>
        </div>

        {/* Hero Showcase Image */}
        <div className="mt-12 relative rounded-3xl overflow-hidden shadow-2xl h-[380px] sm:h-[480px] lg:h-[540px] bg-gray-900 border border-gray-100">
          <img
            src="/anh/bach-lan/1.jpg"
            alt="DaiVerse Heritage Showcase"
            className="w-full h-full object-cover"
            style={{ objectPosition: "50% 10%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"></div>

          <div className="absolute top-6 left-6 z-10 hidden sm:block">
            <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest border border-white/20">
              Bộ Sưu Tập Mộc Lan & Phong Sắc
            </div>
          </div>

          {/* Stats Bar Floating Bottom */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 bg-white/15 backdrop-blur-md p-3.5 sm:p-5 rounded-2xl border border-white/20 text-white text-center z-10">
            {stats.map((st, idx) => (
              <div key={idx} className="space-y-0.5 sm:space-y-1">
                <p className="font-heading text-xl sm:text-3xl font-bold text-[#FDF3CC]">{st.number}</p>
                <p className="text-[11px] sm:text-xs text-white/80 font-medium">{st.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Core Pillars Section */}
      <section className="py-20 bg-white border-y border-gray-200/80 mb-20">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C8920A] font-bold block mb-2">Triết Lý Thiết Kế</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900">Nét Đẹp Tối Giản & Thanh Tao</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((pillar, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-[#FDF6C0] border border-gray-100 space-y-4 hover:shadow-xl transition-all">
                <span className="text-3xl font-heading font-bold text-[#C8920A] block">{pillar.step}</span>
                <h3 className="font-heading text-2xl font-bold text-[#FFDF00]">{pillar.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-light">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Collections with CLICKABLE Design Cards */}
      <section className="container-page space-y-24 mb-24">

        {/* BST 1: Mộc Lan */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xl space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-gray-100 pb-8">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs uppercase tracking-[0.3em] text-[#C8920A] font-bold block">Bộ Sưu Tập 01</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#FFDF00]">
                BST Mộc Lan — Khởi Đầu Của Sự Thuần Khiết & Bình Yên
              </h2>
              <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
                BST Mộc Lan gồm 4 thiết kế áo dài độc đáo: <strong>Bạch Lan</strong>, <strong>Sương Mai</strong>, <strong>Mộc An</strong>, và <strong>Hồng Nguyệt</strong>. Mang sự giao thoa giữa nét đẹp truyền thống và hơi thở đương đại quý phái.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <div className="px-5 py-2.5 bg-[#FFDF00]/10 text-[#FFDF00] rounded-full text-xs font-bold uppercase tracking-wider">
                ✦ 4 Thiết Kế Độc Bản
              </div>
            </div>
          </div>

          {/* Clickable product cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mocLanProducts.map(product => (
              <article
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className="group space-y-3 bg-[#FDF6C0] p-5 rounded-2xl border border-gray-100 hover:border-[#C8920A]/40 hover:shadow-xl transition-all duration-400 cursor-pointer hover:-translate-y-1"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-200">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400 translate-y-2 group-hover:translate-y-0">
                    <span className="text-xs font-bold text-white bg-[#C8920A] px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      Xem Câu Chuyện
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-[#C8920A] font-bold uppercase tracking-wider block">{product.fabric}</span>
                <h3 className="font-heading text-lg font-bold text-gray-900 group-hover:text-[#C8920A] transition-colors">
                  {product.storyTitle.split('|')[0].trim()}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-3 font-light leading-relaxed">
                  {product.storyContent.substring(0, 100)}...
                </p>
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="font-bold text-[#FFDF00]">{product.formattedPrice}</span>
                  <span className="text-[#C8920A] font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Đọc thêm <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* BST 2: Phong Sắc */}
        <div className="bg-gradient-to-br from-[#FFDF00] to-[#C8A800] text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-white/10 pb-8">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs uppercase tracking-[0.3em] text-[#E8C55A] font-bold block">Bộ Sưu Tập 02</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
                BST Phong Sắc — Thanh Thoát Trong Từng Nhịp Gió
              </h2>
              <p className="text-sm sm:text-base text-gray-200 font-light leading-relaxed">
                Thiết kế dáng suông Tafta 3 món cao cấp (Áo, Quần & Áo khoác choàng tay cánh dơi). Gam màu xanh dịu và đỏ thanh lịch tôn vinh sự tự do, kiêu hãnh của người phụ nữ hiện đại.
              </p>
              <div className="flex items-center gap-3 text-xs text-[#E8C55A] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#E8C55A]" />
                <span>Chất liệu Tafta giãn ngang nhẹ cao cấp</span>
              </div>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <div className="px-5 py-2.5 bg-white/10 text-[#E8C55A] rounded-full text-xs font-bold uppercase tracking-wider border border-white/10">
                ✦ 1 Thiết Kế Độc Bản
              </div>
            </div>
          </div>

          {/* Phong Sac clickable cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {phongSacProducts.map(product => (
              <article
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 hover:border-[#E8C55A]/50 hover:shadow-2xl transition-all duration-400 cursor-pointer hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <span className="text-xs font-bold text-white bg-[#C8920A] px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      Xem Câu Chuyện
                    </span>
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-[11px] text-[#E8C55A] font-bold uppercase tracking-wider block">{product.fabric}</span>
                  <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#E8C55A] transition-colors">
                    {product.storyTitle.split('|')[0].trim()}
                  </h3>
                  <p className="text-xs text-white/70 line-clamp-2 font-light leading-relaxed">
                    {product.storyContent.substring(0, 90)}...
                  </p>
                  <div className="flex items-center justify-between pt-2 text-xs">
                    <span className="font-bold text-[#E8C55A]">{product.formattedPrice}</span>
                    <span className="text-[#E8C55A] font-bold flex items-center gap-1">
                      Đọc thêm <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Brand Commitments Grid */}
      <section className="container-page mb-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C8920A] font-bold block mb-2">Cam Kết Chất Lượng</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900">An Tâm Trong Từng Tà Áo</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {commitments.map((cm, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-white border border-gray-100 shadow-lg space-y-3">
              <div className="p-3 w-fit rounded-2xl bg-[#C8920A]/10">{cm.icon}</div>
              <h4 className="font-heading font-bold text-lg text-gray-900">{cm.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-light">{cm.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
