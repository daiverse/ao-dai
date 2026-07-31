import React from "react";
import { ARTICLES } from "../data/articles";
import { Clock, User } from "lucide-react";

export default function JournalPage() {
  return (
    <div className="pt-28 pb-20 bg-[#FBF9F5] min-h-screen">
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C85A32] font-bold mb-2">
            Góc Nhìn Thời Trang
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900">
            Tạp Chí Serene Áo Dài
          </h1>
          <p className="text-gray-600 mt-3 text-sm sm:text-base">
            Cập nhật xu hướng thời trang áo dài, bí quyết chăm sóc vải lụa và di sản văn hóa Việt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((art) => (
            <div key={art.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-lg flex flex-col justify-between group">
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#18392B] text-white text-[11px] font-semibold rounded-full">
                  {art.category}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{art.date}</span>
                    <span>• {art.readTime}</span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-gray-900 group-hover:text-[#C85A32] transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-[#18392B] font-semibold">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-[#C85A32]" />{art.author}</span>
                  <span className="group-hover:translate-x-1 transition-transform">Đọc bài →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
