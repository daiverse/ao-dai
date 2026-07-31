import React from "react";
import { ArrowUpRight } from "lucide-react";
import { COLLECTIONS } from "../../data/collections";

export default function CollectionCards({ onSelectCollection }) {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-[#FBF9F5] to-white">
      <div className="container-page">
        {/* Section Header */}
        <div className="text-center mb-14 lg:mb-20 max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.32em] text-[#C85A32] font-bold mb-3">
            Ba Bộ Sưu Tập · 2026
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.15]">
            Ba câu chuyện,{" "}
            <em className="text-[#8B0000] font-heading italic font-normal">ba nguồn cảm hứng</em>
          </h2>
          <p className="text-base lg:text-lg text-gray-600 mt-5 leading-relaxed">
            Mỗi bộ sưu tập là một hành trình khám phá vẻ đẹp Việt — từ hoa sen thanh khiết, ánh trăng trên lụa, đến hương sắc cố đô Huế.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COLLECTIONS.map((col) => (
            <div
              key={col.id}
              onClick={() => onSelectCollection && onSelectCollection(col.id)}
              className="group relative cursor-pointer"
            >
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100">
                <img
                  src={col.fallbackImage}
                  alt={col.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

                {/* Arrow Badge Top Right */}
                <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-[#8B0000] transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5 text-white group-hover:text-[#8B0000] transition-colors" />
                </div>

                {/* Content Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-7 lg:p-8 text-white">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-[#D4A373] mb-2 font-semibold">
                    {col.subtitle}
                  </p>
                  <h3 className="font-heading text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                    {col.name}
                  </h3>
                  <p className="text-sm text-white/80 leading-relaxed line-clamp-2">
                    {col.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between text-xs text-white/90 font-medium">
                    <span>Giá từ: {col.priceFrom}</span>
                    <span className="underline group-hover:text-[#D4A373] transition-colors">Xem BST →</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
