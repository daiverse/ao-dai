import React from "react";
import { ArrowRight, Palette, Sparkles } from "lucide-react";
import { FEATURE_FLAGS } from "../../config/featureFlags";

export default function HeroBanner({ onNavigate }) {
  return (
    <section className="relative min-h-screen flex flex-col lg:block overflow-hidden bg-white pb-16 lg:pb-20 pt-32 sm:pt-40 lg:pt-36">
      {/* Background Banner Visual */}
      <div className="relative lg:absolute lg:right-0 lg:top-0 w-full lg:w-[62%] h-auto min-h-[55vh] sm:min-h-[65vh] aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:min-h-0 lg:h-full flex-shrink-0">
        <div className="relative w-full h-full bg-[#f5ebe0]/60 overflow-hidden">
          <div className="absolute inset-0 origin-top">
            <img
              src="/anh/746927465_122119237899355470_7558522641041819280_n.jpg"
              alt="DaiVerse — Bộ sưu tập cao cấp 2026"
              className="w-full h-full object-cover object-top"
            />
          </div>
          {/* Gradient overlays matching serene-ao-dai */}
          <div className="absolute inset-y-0 left-0 w-1/3 sm:w-[28%] bg-gradient-to-r from-white via-white/70 to-transparent pointer-events-none"></div>
          <div className="absolute inset-x-0 top-0 h-24 sm:h-32 lg:h-44 bg-gradient-to-b from-white via-white/60 to-transparent pointer-events-none z-[2]"></div>
          <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 lg:h-48 bg-gradient-to-t from-white via-white/80 via-35% to-transparent pointer-events-none z-[2]"></div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-white from-[32%] via-white/70 via-[44%] to-transparent z-[1] pointer-events-none hidden lg:block"></div>

      {/* Decorative Floating Dots */}
      <div className="absolute top-36 left-[10%] lg:left-[12%] w-2.5 h-2.5 bg-[#C8920A] rounded-full hidden sm:block z-[2] animate-pulse"></div>
      <div className="absolute top-52 left-[13%] lg:left-[15%] w-1.5 h-1.5 bg-[#C8920A]/60 rounded-full hidden sm:block z-[2]"></div>
      <div className="absolute bottom-36 left-[8%] lg:left-[10%] w-3 h-3 border-2 border-[#C8920A]/40 rounded-full hidden lg:block z-[2]"></div>

      {/* Hero Content Container */}
      <div className="container-page relative z-[2] flex-1 lg:flex lg:items-start lg:min-h-[calc(100vh-8rem)] pt-2 lg:pt-6">
        <div className="max-w-2xl pt-2 lg:pt-4">

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold text-gray-900 mb-5 lg:mb-6 leading-[1.15]">
            Áo dài<br />
            <span className="text-[#FFDF00] italic font-heading font-semibold">thanh nhã</span> cho<br />
            phong cách riêng
          </h1>

          <p className="text-base sm:text-lg text-gray-600 mb-8 lg:mb-10 max-w-md leading-[1.7]">
            DaiVerse kết hợp tinh hoa áo dài Việt với AI, 3D và Virtual Try-On, mang đến trải nghiệm thời trang thông minh và phong cách dành riêng cho bạn.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate("products")}
              className="group inline-flex items-center gap-3 px-7 sm:px-8 py-3.5 sm:py-4 bg-[#FFDF00] text-white font-medium rounded-full hover:bg-[#FFDF00]/90 transition-all shadow-xl shadow-[#FFDF00]/20 cursor-pointer"
            >
              <span>Khám phá ngay</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate("design-studio")}
              className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 border-2 border-[#C8920A]/60 text-[#FFDF00] font-semibold rounded-full hover:bg-[#C8920A] hover:text-white hover:border-[#C8920A] transition-all cursor-pointer bg-white/80 backdrop-blur-xs"
            >
              <Palette className="w-4 h-4 text-[#C8920A] group-hover:text-white" />
              <span>Thiết kế với AI</span>
            </button>

            {FEATURE_FLAGS.ENABLE_AI_TRY_ON && (
              <button
                onClick={() => onNavigate("try-on")}
                className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 border-2 border-[#FFDF00] text-[#FFDF00] font-semibold rounded-full hover:bg-[#FFDF00] hover:text-white transition-all cursor-pointer bg-white/80 backdrop-blur-xs"
              >
                <Sparkles className="w-4 h-4 text-[#E8C55A]" />
                <span>Thử đồ với AI</span>
              </button>
            )}
          </div>

          {/* Stats Bar */}
          <div className="mt-12 lg:mt-16 flex gap-8 sm:gap-12 border-t border-gray-100 pt-8">
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1 font-heading text-[#FFDF00]">5+</div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium">Mẫu áo dài</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1 font-heading text-[#FFDF00]">100+</div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium">Hàng trăm khách hàng</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1 font-heading text-[#C8920A]">4.9 ★</div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium">Đánh giá hài lòng</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
