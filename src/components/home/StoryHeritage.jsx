import React from "react";

export default function StoryHeritage({ onNavigate }) {

  return (
    <section className="py-24 bg-white">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image composition left */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/anh/754058094_122120859087355470_3079712870670515575_n.jpg"
                alt="Hành trình di sản Áo Dài"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-2/3 aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white hidden sm:block">
              <img
                src="/anh/746927465_122119237899355470_7558522641041819280_n.jpg"
                alt="Thêu tay truyền thống"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Badge overlay */}
            <div className="absolute top-8 left-8 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 max-w-[200px]">
              <p className="font-heading font-bold text-2xl text-[#EFB11D]">20+ Năm</p>
              <p className="text-xs text-gray-600 mt-1">Gìn giữ & phát triển nghệ thuật Áo Dài Việt</p>
            </div>
          </div>

          {/* Story text right */}
          <div className="space-y-8 lg:pl-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#E43D12] font-bold mb-3">
                Hành Trình Di Sản
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Giải Pháp Cá Nhân Hóa Áo Dài <span className="text-[#EFB11D] italic">Với Công Nghệ AI & Thử Mặc 3D</span>
              </h2>
              <p className="text-base text-gray-600 mt-4 leading-relaxed">
                DaiVerse được xây dựng với mong muốn mang đến một trải nghiệm mua sắm áo dài hiện đại, trực quan và cá nhân hóa hơn. Thông qua việc ứng dụng công nghệ AI, mô phỏng 3D và thử đồ ảo, DaiVerse giúp khách hàng dễ dàng lựa chọn kiểu dáng, tùy chỉnh thiết kế, xem trước áo dài trên mô hình ảo và đặt may sản phẩm phù hợp với vóc dáng, phong cách cũng như dịp sử dụng của mình.
              </p>
            </div>



            <div className="pt-4">
              <button
                onClick={() => onNavigate && onNavigate("about")}
                className="px-8 py-3.5 bg-[#EFB11D] text-white rounded-full font-semibold hover:bg-[#EFB11D]/90 shadow-lg shadow-[#EFB11D]/20 transition-all cursor-pointer text-sm"
              >
                Đọc Thêm Câu Chuyện Thương Hiệu →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
