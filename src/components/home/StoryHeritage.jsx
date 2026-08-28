import React from "react";
import { Sparkles, Scissors, Feather, Award } from "lucide-react";

export default function StoryHeritage({ onNavigate }) {
  const highlights = [
    {
      icon: <Scissors className="w-6 h-6 text-[#C8920A]" />,
      title: "May Đo Thủ Công Tỉ Mỉ",
      desc: "Hơn 30 bước định phom tôn dáng chuẩn tỉ lệ vàng của phụ nữ Việt."
    },
    {
      icon: <Feather className="w-6 h-6 text-[#C8920A]" />,
      title: "Lụa Tơ Tằm Bảo Lộc",
      desc: "Chất liệu lụa tự nhiên 100% thoáng mát, óng ả và êm ái khi tiếp xúc làn da."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#C8920A]" />,
      title: "Cá Nhân Hóa Trí Tuệ AI",
      desc: "Mô phỏng 3D AI Design Studio giúp chọn màu sắc & cổ áo chuẩn xác."
    },
    {
      icon: <Award className="w-6 h-6 text-[#C8920A]" />,
      title: "Bảo Hành Tà Áo Trọn Đời",
      desc: "Hỗ trợ chỉnh sửa phom dáng & chăm sóc sợi lụa chuẩn quy trình nghệ nhân."
    }
  ];

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
              <p className="font-heading font-bold text-2xl text-[#FFDF00]">20+ Năm</p>
              <p className="text-xs text-gray-600 mt-1">Gìn giữ & phát triển nghệ thuật Áo Dài Việt</p>
            </div>
          </div>

          {/* Story text right */}
          <div className="space-y-8 lg:pl-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#C8920A] font-bold mb-3">
                Hành Trình Di Sản
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Giải Pháp Cá Nhân Hóa Áo Dài <span className="text-[#FFDF00] italic">Với Công Nghệ AI & Thử Mặc 3D</span>
              </h2>
              <p className="text-base text-gray-600 mt-4 leading-relaxed">
                DaiVerse được xây dựng với mong muốn mang đến một trải nghiệm mua sắm áo dài hiện đại, trực quan và cá nhân hóa hơn. Thông qua việc ứng dụng công nghệ AI, mô phỏng 3D và thử đồ ảo, DaiVerse giúp khách hàng dễ dàng lựa chọn kiểu dáng, tùy chỉnh thiết kế, xem trước áo dài trên mô hình ảo và đặt may sản phẩm phù hợp với vóc dáng, phong cách cũng như dịp sử dụng của mình.
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {highlights.map((item, index) => (
                <div key={index} className="p-4 rounded-2xl bg-[#FDF6C0] border border-gray-100 space-y-2">
                  <div className="p-2.5 w-fit rounded-xl bg-white shadow-xs">
                    {item.icon}
                  </div>
                  <h4 className="font-heading font-semibold text-base text-gray-900">{item.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => onNavigate && onNavigate("about")}
                className="px-8 py-3.5 bg-[#FFDF00] text-white rounded-full font-semibold hover:bg-[#FFDF00]/90 shadow-lg shadow-[#FFDF00]/20 transition-all cursor-pointer text-sm"
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
