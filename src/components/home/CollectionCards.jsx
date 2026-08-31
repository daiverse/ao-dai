import React from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { COLLECTIONS } from "../../data/collections";

export default function CollectionCards({ onSelectCollection }) {
  const collectionDetails = (COLLECTIONS || []).map((col, index) => ({
    ...col,
    secondaryImage: col.secondaryImage || "/anh/746947278_122119072383355470_6400495368402003300_n.jpg",
    tagline: col.subtitle || "Vẻ đẹp thuần khiết & tự nhiên",
    details: col.details || [
      "Bạch Lan — Lụa gấm trúc cao cấp",
      "Thanh Phong — Set 3 món tafta dáng suông",
      "Sương Mai, Mộc An & Hồng Nguyệt — Tơ tằm & ánh kim"
    ]
  }));

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container-page">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-24 max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.35em] text-[#E43D12] font-bold px-4 py-1.5 rounded-full bg-[#E43D12]/10 border border-[#E43D12]/20 inline-block mb-4">
            Bộ Sưu Tập Di Sản · 2026
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.15]">
            Mộc Lan Collection,{" "}
            <em className="text-[#D6536D] font-heading italic font-normal">vẻ đẹp thuần khiết Việt</em>
          </h2>
          <p className="text-base lg:text-lg text-gray-600 mt-5 leading-relaxed">
            Bộ sưu tập Mộc Lan là sự hòa quyện tuyệt vời giữa chất liệu lụa gấm di sản và công nghệ cá nhân hóa AI Studio hiện đại.
          </p>
        </div>

        {/* Alternating Editorial Banners */}
        <div className="space-y-20 lg:space-y-32">
          {collectionDetails.map((col, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={col.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
              >
                {/* Visual Banner Column */}
                <div
                  className={`lg:col-span-7 ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div 
                    onClick={() => onSelectCollection && onSelectCollection(col.id)}
                    className="group relative cursor-pointer rounded-3xl overflow-hidden shadow-2xl bg-gray-100 aspect-[4/3] sm:aspect-[16/10] border border-gray-100"
                  >
                    <img
                      src={col.image || col.fallbackImage || "/anh/746927465_122119237899355470_7558522641041819280_n.jpg"}
                      alt={col.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-1000"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Floating Secondary Mini Image Overlay */}
                    <div className="absolute bottom-6 right-6 w-28 sm:w-36 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/80 shadow-2xl hidden sm:block group-hover:scale-110 transition-transform duration-500">
                      <img
                        src={col.secondaryImage}
                        alt={`${col.name} cận cảnh`}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    {/* Badge Top Left */}
                    <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#EFB11D] font-bold text-xs shadow-md border border-white/50">
                      {col.badge}
                    </div>

                    {/* Quick Link Badge Top Right */}
                    <div className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:bg-white transition-all duration-300">
                      <ArrowUpRight className="w-5 h-5 text-white group-hover:text-[#EFB11D] transition-colors" />
                    </div>

                    {/* Image Caption Bottom Left */}
                    <div className="absolute bottom-6 left-6 text-white max-w-[70%]">
                      <p className="text-[11px] uppercase tracking-widest text-[#EFB11D] font-semibold">
                        {col.tagline}
                      </p>
                      <h4 className="font-heading text-2xl font-bold mt-0.5">
                        {col.name}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Content Editorial Column */}
                <div
                  className={`lg:col-span-5 space-y-6 ${
                    isEven ? "lg:order-2 lg:pl-4" : "lg:order-1 lg:pr-4"
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#E43D12]">
                      {col.subtitle}
                    </span>
                    <h3 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4 leading-tight">
                      Bộ Sưu Tập <span className="text-[#EFB11D] italic">{col.name}</span>
                    </h3>
                    <p className="text-base text-gray-600 leading-relaxed">
                      {col.description}
                    </p>
                  </div>

                  {/* Highlights List */}
                  <div className="space-y-3 pt-2">
                    {col.details.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                        <div className="w-2 h-2 rounded-full bg-[#E43D12]"></div>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price & Action */}
                  <div className="pt-4 flex items-center gap-6 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-400 block font-medium">Giá sản phẩm từ</span>
                      <span className="text-2xl font-bold font-heading text-[#EFB11D]">
                        {col.priceFrom}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectCollection && onSelectCollection(col.id)}
                      className="group inline-flex items-center gap-2.5 px-6 py-3 bg-[#EFB11D] text-white rounded-full font-medium text-sm hover:bg-[#EFB11D]/90 transition-all cursor-pointer shadow-lg shadow-[#EFB11D]/20"
                    >
                      <span>Khám phá ngay</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
