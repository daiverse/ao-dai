import React from "react";
import { COLLECTIONS } from "../data/collections";

export default function LookbookPage() {
  const lookbookImages = [
    { title: "Sen Trắng Mộng Liên", tag: "BST Mộng Liên", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80" },
    { title: "Ánh Trăng Trên Thớ Lụa", tag: "BST Trăng Trong Lụa", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80" },
    { title: "Hoàng Thành Cố Đô", tag: "BST Hương Cố Đô", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80" },
    { title: "Kiêu Hãnh Sắc Đỏ Son", tag: "Áo Dài Cưới", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80" },
    { title: "Thắt Eo Cử Tấm", tag: "Dệt Kim Tuyến", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=80" },
    { title: "Dáng Xuân Thanh Tú", tag: "Cách Tân 2026", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80" }
  ];

  return (
    <div className="pt-28 pb-20 bg-[#FBF9F5] min-h-screen">
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C85A32] font-bold mb-2">
            Bộ Sưu Tập Ảnh Nghệ Thuật
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900">
            Lookbook High-Fashion 2026
          </h1>
          <p className="text-gray-600 mt-3 text-sm sm:text-base">
            Hình ảnh trình diễn thực tế từ các tuần lễ thời trang áo dài di sản Việt Nam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lookbookImages.map((lb, index) => (
            <div key={index} className="group relative rounded-3xl overflow-hidden shadow-xl aspect-[3/4] cursor-pointer">
              <img src={lb.image} alt={lb.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="text-[11px] uppercase tracking-wider text-[#D4A373] font-semibold">{lb.tag}</span>
                <h3 className="font-heading text-2xl font-bold mt-1">{lb.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
