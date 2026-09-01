import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";

export default function HeroBanner({ onNavigate }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      bgClass: "bg-[#F3EFE6]",
      titleTop: "SƯƠNG",
      titleSub: "BST MỘC LAN 2026",
      titleBottom: "MAI",
      tagline: "DaiVerse kết hợp tinh hoa áo dài Việt với AI, 3D và Virtual Try-On, mang đến trải nghiệm thời trang thông minh và phong cách dành riêng cho bạn.",
      image: "/anh/suong-mai/banner.png",
      fallbackImage: "/anh/746927465_122119237899355470_7558522641041819280_n.jpg",
      linkCategory: "products"
    },
    {
      id: 2,
      bgClass: "bg-[#F5EBE0]",
      titleTop: "BẠCH",
      titleSub: "BST MỘC LAN 2026",
      titleBottom: "LAN",
      tagline: "DaiVerse kết hợp tinh hoa áo dài Việt với AI, 3D và Virtual Try-On, mang đến trải nghiệm thời trang thông minh và phong cách dành riêng cho bạn.",
      image: "/anh/bach-lan/banner.png",
      fallbackImage: "/anh/746947278_122119072383355470_6400495368402003300_n.jpg",
      linkCategory: "products"
    },
    {
      id: 3,
      bgClass: "bg-[#F3EFE6]",
      titleTop: "THANH",
      titleSub: "BST PHONG SẮC 2026",
      titleBottom: "PHONG",
      tagline: "DaiVerse kết hợp tinh hoa áo dài Việt với AI, 3D và Virtual Try-On, mang đến trải nghiệm thời trang thông minh và phong cách dành riêng cho bạn.",
      image: "/anh/thanh-phong/banner.png",
      fallbackImage: "/anh/747178293_122119072509355470_7986902361393680700_n.jpg",
      linkCategory: "products"
    },
    {
      id: 4,
      bgClass: "bg-[#F5EBE0]",
      titleTop: "HỒNG",
      titleSub: "BST MỘC LAN 2026",
      titleBottom: "NGUYỆT",
      tagline: "DaiVerse kết hợp tinh hoa áo dài Việt với AI, 3D và Virtual Try-On, mang đến trải nghiệm thời trang thông minh và phong cách dành riêng cho bạn.",
      image: "/anh/hong-nguyet/banner.png",
      fallbackImage: "/anh/748552016_122119237911355470_8898990539200168318_n.jpg",
      linkCategory: "products"
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="w-full pt-20 sm:pt-24 lg:pt-20 bg-[#FAF6F0]">
      {/* ─── 1. MAIN HERO SLIDER SECTION (Background Màu Be Sang Trọng) ──────────────── */}
      <section className="relative w-full overflow-hidden bg-[#F3EFE6] border-b border-[#E5DECE] min-h-[440px] sm:min-h-[540px] lg:min-h-[600px] flex items-center transition-colors duration-500">
        
        {/* Soft Luxury Pattern Background Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(197, 160, 89, 0.15) 0%, rgba(0, 0, 0, 0.05) 100%)`,
            backgroundSize: "cover"
          }}
        ></div>

        {/* Slide Content Grid */}
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-8">
            
            {/* LEFT COLUMN: NEM Calligraphic Editorial Typography */}
            <div className="lg:col-span-6 space-y-3 text-center lg:text-left select-none pt-4 lg:pt-0">
              <div className="inline-block relative">
                
                {/* Word 1: THỜI / SƯƠNG / BẠCH / THANH / HỒNG */}
                <h1 className="font-heading font-black text-[65px] sm:text-[95px] lg:text-[120px] leading-[0.9] text-[#C5A059] tracking-wide uppercase drop-shadow-xs">
                  {slide.titleTop}
                </h1>

                {/* Word 2: MAI / LAN / PHONG / NGUYỆT */}
                <h2 className="font-heading font-black text-[65px] sm:text-[95px] lg:text-[120px] leading-[0.9] text-[#C5A059] tracking-wide uppercase drop-shadow-xs lg:ml-16">
                  {slide.titleBottom}
                </h2>
              </div>

              {/* Bottom Tagline */}
              <div className="pt-3 lg:pt-4 max-w-xl mx-auto lg:mx-0">
                <p className="font-sans font-medium text-xs sm:text-sm text-neutral-800 leading-relaxed">
                  {slide.tagline}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={() => onNavigate && onNavigate("products")}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#111111] hover:bg-[#C5A059] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-xl cursor-pointer border-none group"
                >
                  <span>XEM BỘ SƯU TẬP</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Real Store Áo Dài Showcase Photo */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[440px] aspect-[3/4] overflow-hidden rounded-none shadow-2xl bg-neutral-900 border-2 border-[#C5A059]/40 group">
                <img
                  src={slide.image}
                  onError={(e) => { e.target.src = slide.fallbackImage; }}
                  alt="Ảnh thực tế Áo Dài DaiVerse"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Floating Real Photo Badge */}
                <div className="absolute top-4 left-4 bg-[#111111]/90 text-white border border-[#C5A059]/50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>ẢNH THỰC TẾ SẢN PHẨM</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Navigation Controls: Arrow Left */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12 bg-[#111111]/90 hover:bg-[#C5A059] text-white flex items-center justify-center transition-all z-20 cursor-pointer border-none shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Navigation Controls: Arrow Right */}
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12 bg-[#111111]/90 hover:bg-[#C5A059] text-white flex items-center justify-center transition-all z-20 cursor-pointer border-none shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Slide Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all cursor-pointer border p-0 ${
                currentSlide === idx
                  ? "bg-[#C5A059] border-[#C5A059] scale-110"
                  : "bg-neutral-300 border-neutral-400 hover:bg-[#C5A059]/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ─── 2. TWO-COLUMN SUB-HERO BANNER GRID (Ảnh Thật Sản Phẩm Cửa Hàng) ─────────── */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 pt-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* BANNER LEFT: SẢN PHẨM THẬT 1 - SƯƠNG MAI */}
          <div 
            onClick={() => onNavigate && onNavigate("products")}
            className="group cursor-pointer bg-[#F4F5F7] border border-neutral-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl"
          >
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-neutral-200">
              <img
                src="/anh/suong-mai/banner.png"
                alt="Áo Dài Gấm Tơ Mềm Sương Mai"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 bg-[#111111]/80 text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                BST MỘC LAN
              </div>
            </div>
            <div className="bg-[#FAF6F0] px-4 py-3 flex items-center justify-between border-t border-neutral-200">
              <span className="font-sans text-xs sm:text-sm font-black uppercase tracking-wider text-[#111111]">
                ÁO DÀI GẤM TƠ SƯƠNG MAI
              </span>
              <span className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#111111] group-hover:text-[#C5A059] transition-colors flex items-center gap-1">
                SHOP NOW <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* BANNER RIGHT: SẢN PHẨM THẬT 2 - HỒNG NGUYỆT */}
          <div 
            onClick={() => onNavigate && onNavigate("products")}
            className="group cursor-pointer bg-[#F4F5F7] border border-neutral-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl"
          >
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-neutral-200">
              <img
                src="/anh/hong-nguyet/banner.png"
                alt="Áo Dài Tơ Tằm Ánh Kim Hồng Nguyệt"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 bg-[#111111]/80 text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                BST MỘC LAN
              </div>
            </div>
            <div className="bg-[#FAF6F0] px-4 py-3 flex items-center justify-between border-t border-neutral-200">
              <span className="font-sans text-xs sm:text-sm font-black uppercase tracking-wider text-[#111111]">
                ÁO DÀI TƠ TẰM HỒNG NGUYỆT
              </span>
              <span className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#111111] group-hover:text-[#C5A059] transition-colors flex items-center gap-1">
                SHOP NOW <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}




