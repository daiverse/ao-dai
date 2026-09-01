import React from "react";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      quote: "“Áo dài DaiVerse may đo cực kỳ phom dáng, vừa vặn như được đo trực tiếp. Trải nghiệm xem 360° giúp tôi nhìn rõ từng chi tiết thêu gấm trước khi đặt hàng.”",
      name: "Phạm Hà Linh",
      location: "Hà Nội",
      initials: "HL"
    },
    {
      id: 2,
      quote: "“Tôi đã chọn bộ Áo Dài thêu thủ công DaiVerse cho ngày trọng đại và hoàn toàn hài lòng. Đường kim mũi chỉ vô cùng sắc nét, đóng gói quà vô cùng sang trọng.”",
      name: "Nguyễn Khánh Vân",
      location: "TP. Hồ Chí Minh",
      initials: "KV"
    },
    {
      id: 3,
      quote: "“Chất liệu gấm lụa cao cấp mềm mại, mặc lên tôn dáng và lịch thiệp. Công nghệ thử đồ AI giúp tôi lựa chọn màu sắc Áo Dài chuẩn phong cách cá nhân.”",
      name: "Đặng Thùy Dương",
      location: "Đà Nẵng",
      initials: "TD"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-neutral-200">
      <div className="container-page">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-extrabold mb-2">
            ĐÁNH GIÁ KHÁCH HÀNG
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-[#111111] uppercase tracking-wide">
            CẢM NHẬN VỀ DaiVerse FASHION
          </h2>
          <div className="w-12 h-0.5 bg-[#C5A059] mx-auto mt-3"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-neutral-50 p-6 border border-neutral-300 flex flex-col justify-between space-y-6"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-[#C5A059] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-[#C5A059]" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm text-neutral-700 italic leading-relaxed">
                  {item.quote}
                </p>
              </div>

              {/* User Info Footer */}
              <div className="pt-4 border-t border-neutral-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#111111] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {item.initials}
                </div>
                <div>
                  <h4 className="font-heading font-black text-xs text-[#111111] uppercase">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500 font-semibold">
                    {item.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

