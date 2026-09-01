import React, { useState } from "react";
import { Sparkles, Award, ArrowRight, ShieldCheck, Wand2, Scissors, CheckCircle2 } from "lucide-react";

export default function StoryHeritage({ onNavigate }) {
  const [activeImg, setActiveImg] = useState("/anh/suong-mai/1.jpg");
  const [secondaryImg, setSecondaryImg] = useState("/anh/bach-lan/1.jpg");

  const handleSwapImages = () => {
    setActiveImg(prev => (prev === "/anh/suong-mai/1.jpg" ? "/anh/bach-lan/1.jpg" : "/anh/suong-mai/1.jpg"));
    setSecondaryImg(prev => (prev === "/anh/bach-lan/1.jpg" ? "/anh/suong-mai/1.jpg" : "/anh/bach-lan/1.jpg"));
  };

  const pillars = [
    {
      icon: Wand2,
      title: "Công Nghệ AI & 3D Studio",
      desc: "Ứng dụng Virtual Try-On giúp thử Áo Dài 3D và ghép dáng trực tiếp trên ảnh."
    },
    {
      icon: ShieldCheck,
      title: "May Đo Cá Nhân Hóa",
      desc: "Cam kết chuẩn phom dáng tôn vinh đường cong dịu dàng của phụ nữ Việt."
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#FAF6F0] relative overflow-hidden border-b border-neutral-200">
      
      {/* Soft Luxury Glowing Background Ambient Orbs */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: `radial-gradient(circle at 10% 20%, rgba(197, 160, 89, 0.12) 0%, transparent 60%), radial-gradient(circle at 90% 80%, rgba(164, 129, 61, 0.1) 0%, transparent 60%)`
        }}
      ></div>

      <div className="container-page relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: High-Fashion Dual Editorial Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative p-2.5 bg-white border border-[#E5DECE] shadow-2xl">
              
              {/* Main Image Stage */}
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900 group">
                <img
                  src={activeImg}
                  alt="Hành trình di sản Áo Dài DaiVerse"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />

                {/* Subtle Luxury Gradient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>



                {/* Image Caption Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-[10px] uppercase font-extrabold tracking-widest text-[#C5A059]">
                    DAIVERSE HERITAGE & INNOVATION
                  </p>
                  <h3 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-wide mt-0.5">
                    TÌNH HOA ÁO DÀI ĐƯƠNG ĐẠI
                  </h3>
                </div>
              </div>

            </div>

            {/* Overlapping Interactive Secondary Image Card */}
            <div 
              onClick={handleSwapImages}
              className="absolute -bottom-6 -right-4 sm:-right-8 w-2/5 aspect-[3/4] p-1.5 bg-white border-2 border-[#C5A059] shadow-2xl hidden sm:block group/inset cursor-pointer hover:scale-105 transition-all duration-300 z-20"
            >
              <div className="relative w-full h-full overflow-hidden bg-neutral-900">
                <img
                  src={secondaryImg}
                  alt="Cận cảnh thêu dệt"
                  className="w-full h-full object-cover object-top group-hover/inset:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover/inset:bg-transparent transition-colors"></div>
                <div className="absolute bottom-2 inset-x-2 bg-[#111111]/90 text-white text-[9px] font-bold p-1 text-center uppercase tracking-wider border border-[#C5A059]/40">
                  ⚡ ĐỔI GÓC NHÌN
                </div>
              </div>
            </div>

            {/* Floating Luxury Stats Pill */}
            <div className="absolute -top-4 -left-4 px-4 py-2 bg-[#111111] text-white border-b-2 border-[#C5A059] shadow-2xl hidden sm:flex items-center gap-3 z-20">
              <Sparkles className="w-4 h-4 text-[#C5A059] animate-pulse" />
              <div>
                <p className="text-xs font-black text-[#C5A059] font-heading leading-none">100% GẤM LỤA</p>
                <p className="text-[9px] text-neutral-300 font-bold uppercase tracking-wider mt-0.5">MAY ĐO CHUẨN PHOM</p>
              </div>
            </div>

          </div>

          {/* Right Column: High Fashion Editorial Text & Innovations Grid */}
          <div className="lg:col-span-6 space-y-6 lg:pl-4">
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059] text-white text-[10px] font-extrabold uppercase tracking-widest mb-3 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>HÀNH TRÌNH DI SẢN & ĐỔI MỚI</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111111] leading-tight uppercase tracking-wide">
                THỜI TRANG ÁO DÀI DAIVERSE <br />
                <span className="text-[#C5A059]">CÔNG NGHỆ AI & 3D STUDIO</span>
              </h2>

              <p className="text-xs sm:text-sm lg:text-base text-neutral-600 mt-4 leading-relaxed font-normal">
                DaiVerse kết hợp nét tinh hoa tôn vinh trang phục Áo Dài truyền thống cùng giải pháp thử đồ 3D Virtual Try-On tiên tiến. Mang đến trải nghiệm mua sắm thông minh, chính xác chuẩn phom dáng cho quý khách hàng.
              </p>
            </div>

            {/* Innovations & Values Grid */}
            <div className="space-y-3 pt-2 border-t border-neutral-200">
              {pillars.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div 
                    key={idx} 
                    className="flex items-start gap-3.5 p-3.5 bg-white border border-[#E5DECE] hover:border-[#C5A059] shadow-xs hover:shadow-md transition-all group"
                  >
                    <div className="w-9 h-9 rounded-none bg-[#111111] text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                      <IconComp className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-xs sm:text-sm text-[#111111] uppercase tracking-wide">
                        {item.title}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-0.5 leading-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action CTAs Group */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate && onNavigate("about")}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#111111] hover:bg-[#C5A059] text-white text-xs font-bold uppercase tracking-widest transition-all cursor-pointer border-none shadow-md hover:shadow-xl"
              >
                <span>CÂU CHUYỆN THƯƠNG HIỆU</span>
                <ArrowRight className="w-4 h-4 text-[#C5A059] group-hover:text-white group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate && onNavigate("design-studio")}
                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-neutral-100 text-[#111111] text-xs font-bold uppercase tracking-widest border border-[#C5A059] transition-all cursor-pointer"
              >
                <Wand2 className="w-4 h-4 text-[#C5A059]" />
                <span>TRẢI NGHIỆM CUSTOM ÁO DÀI</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
