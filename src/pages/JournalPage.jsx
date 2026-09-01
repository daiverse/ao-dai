import React, { useState } from "react";
import { ARTICLES } from "../data/articles";
import { Clock, User, Calendar, ArrowUpRight, ExternalLink, BookOpen, ArrowLeft, Globe, Sparkles } from "lucide-react";

export default function JournalPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const categories = [
    { id: "all", label: "Tất cả bài viết" },
    { id: "Di Sản & Văn Hóa", label: "Di Sản & Văn Hóa" },
    { id: "Bí Quyết Thời Trang", label: "Bí Quyết Thời Trang" },
    { id: "Công Nghệ & Xu Hướng", label: "Công Nghệ & Xu Hướng" }
  ];

  const featuredArticle = ARTICLES[0];
  const gridArticles = activeFilter === "all"
    ? ARTICLES
    : ARTICLES.filter(a => a.category === activeFilter);

  const handleSelectArticle = (art) => {
    setSelectedArticle(art);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // IF AN ARTICLE IS SELECTED
  if (selectedArticle) {
    const relatedArticles = ARTICLES.filter(a => a.id !== selectedArticle.id).slice(0, 3);

    return (
      <div className="pt-32 sm:pt-36 pb-20 bg-white min-h-screen text-[#111111]">
        <div className="container-page max-w-5xl mx-auto">
          {/* Top Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pt-4">
            <button
              onClick={() => {
                setSelectedArticle(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059] transition-all cursor-pointer border-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>QUAY LẠI TẠP CHÍ</span>
            </button>

            <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
              <span>TẠP CHÍ DaiVerse</span> <span className="mx-1">/</span> <span className="text-[#C5A059]">{selectedArticle.category}</span>
            </div>
          </div>

          {/* Article Editorial Header */}
          <header className="space-y-4 mb-10 text-center max-w-4xl mx-auto">
            <span className="text-[10px] uppercase tracking-widest text-white bg-[#C5A059] font-extrabold px-3 py-1 inline-block">
              {selectedArticle.category}
            </span>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] uppercase tracking-wide leading-tight">
              {selectedArticle.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-600 border-y border-neutral-200 py-3 uppercase tracking-wider font-bold">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#C5A059]" />
                {selectedArticle.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                {selectedArticle.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#C5A059]" />
                {selectedArticle.readTime}
              </span>
            </div>
          </header>

          {/* Featured Hero Image */}
          <div className="mb-10 aspect-[16/9] bg-neutral-900 border border-neutral-300 overflow-hidden">
            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Main Article Body Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
            <main className="lg:col-span-8 space-y-6 bg-neutral-50 p-6 sm:p-10 border border-neutral-300">
              <div className="text-base sm:text-lg font-heading text-[#111111] font-bold leading-relaxed border-l-4 border-[#C5A059] pl-4 italic">
                "{selectedArticle.excerpt}"
              </div>

              <div className="space-y-6 text-neutral-800 leading-relaxed text-sm sm:text-base font-normal">
                {selectedArticle.sections ? (
                  selectedArticle.sections.map((sec, idx) => (
                    <div key={idx} className="space-y-3 pt-4 border-t border-neutral-200 first:border-none first:pt-0">
                      <h2 className="font-heading text-xl sm:text-2xl font-black text-[#111111] uppercase">
                        {sec.heading}
                      </h2>
                      <div className="text-neutral-700 leading-relaxed font-normal whitespace-pre-line">
                        {sec.text}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-neutral-700 leading-relaxed font-normal whitespace-pre-line">
                    {selectedArticle.content}
                  </div>
                )}
              </div>
            </main>

            {/* Right Editorial Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="p-5 bg-neutral-50 border border-neutral-300 space-y-2">
                <span className="text-[10px] font-extrabold text-[#C5A059] uppercase tracking-wider block">TÁC GIẢ BÀI VIẾT</span>
                <h3 className="font-heading font-black text-base text-[#111111] uppercase">{selectedArticle.author}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Chuyên mục thời trang & di sản Áo dài thuộc DaiVerse Fashion Journal.
                </p>
              </div>

              {/* Related Articles List */}
              <div className="p-5 bg-neutral-50 border border-neutral-300 space-y-4">
                <h3 className="font-heading font-black text-sm text-[#111111] uppercase border-b border-neutral-200 pb-2">
                  BÀI VIẾT KHÁC CÙNG CHỦ ĐỀ
                </h3>
                <div className="space-y-3">
                  {relatedArticles.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => handleSelectArticle(rel)}
                      className="group cursor-pointer flex gap-3 items-center hover:bg-white p-2 border border-transparent hover:border-neutral-300 transition-colors"
                    >
                      <div className="w-14 h-14 overflow-hidden shrink-0 bg-neutral-200">
                        <img src={rel.image} alt={rel.title} className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-[#C5A059] font-bold uppercase">{rel.category}</span>
                        <h4 className="font-heading text-xs font-black text-[#111111] uppercase group-hover:text-[#C5A059] transition-colors line-clamp-2">
                          {rel.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  const renderArticleCard = (art) => (
    <article
      key={art.id}
      onClick={() => handleSelectArticle(art)}
      className="group flex flex-col bg-white border border-neutral-200 hover:border-[#111111] hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <img
          src={art.image}
          alt={art.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 text-[10px] uppercase font-bold bg-[#111111] text-white px-2.5 py-1 tracking-widest">
          {art.category}
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-between p-5 space-y-3">
        <div className="space-y-1.5">
          <span className="text-[10px] text-neutral-500 font-bold uppercase block">{art.date} • {art.readTime}</span>
          <h4 className="font-heading font-black text-base text-[#111111] uppercase group-hover:text-[#C5A059] transition-colors leading-snug line-clamp-2">
            {art.title}
          </h4>
          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed font-normal">
            {art.excerpt}
          </p>
        </div>

        <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs font-bold text-[#111111] uppercase tracking-wider">
          <span>XEM BÀI VIẾT</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A059]" />
        </div>
      </div>
    </article>
  );

  // DEFAULT VIEW
  return (
    <div className="bg-white min-h-screen pb-20 pt-32 sm:pt-36">
      <div className="container-page">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059] text-white text-[10px] font-extrabold uppercase tracking-widest">
            <BookOpen className="w-3.5 h-3.5" />
            <span>DaiVerse FASHION JOURNAL</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#111111] uppercase tracking-wide">
            TẠP CHÍ THỜI TRANG <span className="text-[#C5A059]">& DI SẢN</span>
          </h1>

          <p className="text-neutral-600 text-xs sm:text-sm max-w-xl mx-auto font-normal">
            Tổng hợp thông tin xu hướng thời trang Áo Dài, văn hóa di sản và bí quyết phối đồ sang trọng.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-10 border-b border-neutral-200 pb-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                activeFilter === cat.id
                  ? "bg-[#111111] text-white border-[#111111]"
                  : "bg-white text-neutral-700 border-neutral-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid Cards - First Row (Top 3 Articles) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridArticles.slice(0, 3).map(renderArticleCard)}
        </div>

        {/* MID-PAGE JOURNAL EDITORIAL HERO BANNER (Similar to Home Main Banner) */}
        {activeFilter === "all" && (
          <JournalEditorialBanner />
        )}

        {/* Grid Cards - Second Row (Remaining Articles) */}
        {gridArticles.length > 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridArticles.slice(3).map(renderArticleCard)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MID-PAGE JOURNAL EDITORIAL HERO BANNER COMPONENT ──────────────────────
function JournalEditorialBanner() {
  const slides = [
    {
      id: 1,
      titleTop: "SƯƠNG",
      titleSub: "BST MỘC LAN 2026",
      titleBottom: "MAI",
      tagline: "DaiVerse kết hợp tinh hoa áo dài Việt với AI, 3D và Virtual Try-On, mang đến trải nghiệm thời trang thông minh và phong cách dành riêng cho bạn.",
      image: "/anh/suong-mai/banner.png"
    },
    {
      id: 2,
      titleTop: "THANH",
      titleSub: "BST PHONG SẮC 2026",
      titleBottom: "PHONG",
      tagline: "DaiVerse kết hợp tinh hoa áo dài Việt với AI, 3D và Virtual Try-On, mang đến trải nghiệm thời trang thông minh và phong cách dành riêng cho bạn.",
      image: "/anh/thanh-phong/banner.png"
    },
    {
      id: 3,
      titleTop: "BẠCH",
      titleSub: "BST MỘC LAN 2026",
      titleBottom: "LAN",
      tagline: "DaiVerse kết hợp tinh hoa áo dài Việt với AI, 3D và Virtual Try-On, mang đến trải nghiệm thời trang thông minh và phong cách dành riêng cho bạn.",
      image: "/anh/bach-lan/banner.png"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const active = slides[currentSlide];

  return (
    <div className="my-12 relative overflow-hidden bg-[#FAF6F0] border border-[#E5DECE] shadow-2xl transition-all duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
        
        {/* Left Editorial Text Column */}
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] text-white text-[10px] font-extrabold uppercase tracking-widest border border-[#C5A059]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{active.titleSub}</span>
          </div>

          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-[#111111] uppercase tracking-widest leading-none">
            {active.titleTop} <span className="text-[#C5A059]">{active.titleBottom}</span>
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal max-w-xl">
            {active.tagline}
          </p>

          <div className="pt-2 flex items-center justify-between gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-6 py-3.5 bg-[#111111] hover:bg-[#C5A059] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border-none shadow-md flex items-center gap-2"
            >
              <span>XEM CHI TIẾT TẠP CHÍ</span>
              <ArrowUpRight className="w-4 h-4 text-[#C5A059]" />
            </button>

            {/* Slider Navigation Controls */}
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
        </div>

        {/* Right Visual Image Stage Column */}
        <div className="lg:col-span-6">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-neutral-900 border border-neutral-300 shadow-xl group">
            <img
              src={active.image}
              alt={active.titleTop + ' ' + active.titleBottom}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059]">
                DAIVERSE HAUTE COUTURE
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-[#111111]/80 px-2.5 py-1 backdrop-blur-xs">
                SLIDE {currentSlide + 1} / {slides.length}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

