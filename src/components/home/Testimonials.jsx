import React from "react";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      quote: "“Áo dài may đo cực kỳ phom dáng, vừa vặn như được đo trực tiếp tại xưởng. Trải nghiệm xem 360° giúp tôi nhìn rõ từng nếp gấp và hoa văn gấm trước khi chốt đơn.”",
      name: "Phạm Hà Linh",
      location: "Hà Nội",
      initials: "HL"
    },
    {
      id: 2,
      quote: "“Tôi đã đặt áo dài thêu thủ công cho ngày trọng đại và hoàn toàn bị thuyết phục. Đường kim mũi chỉ vô cùng sắc nét, dịch vụ tư vấn tận tâm và chu đáo.”",
      name: "Nguyễn Khánh Vân",
      location: "TP. Hồ Chí Minh",
      initials: "KV"
    },
    {
      id: 3,
      quote: "“Chất liệu lụa tơ tằm mềm mại, mặc lên tôn dáng và nhẹ nhàng. Tính năng studio AI độc đáo giúp tôi tạo nên tà áo mang dấu ấn phong cách riêng không đụng hàng.”",
      name: "Đặng Thùy Dương",
      location: "Đà Nẵng",
      initials: "TD"
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#FDF6C0]">
      <div className="container-page">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.35em] text-[#C8920A] font-bold mb-3">
            PHẢN HỒI
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Khách Hàng Nói Gì
          </h2>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-3 my-4">
            <div className="w-12 h-px bg-gray-300"></div>
            <div className="w-2 h-2 rotate-45 bg-[#FFDF00]"></div>
            <div className="w-12 h-px bg-gray-300"></div>
          </div>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-4">
            Niềm vui của khách hàng là thước đo lớn nhất cho sự tận tâm của chúng tôi.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div>
                {/* Rating Stars + Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#FFDF00]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-[#FFDF00]" />
                    ))}
                  </div>

                  <span className="text-4xl font-serif text-gray-300 leading-none select-none">
                    99
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-sm sm:text-base text-gray-700 italic leading-relaxed mt-6">
                  {item.quote}
                </p>
              </div>

              {/* User Info Footer */}
              <div className="pt-6 border-t border-gray-100/80 flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-[#EAE7DF] text-gray-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {item.initials}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-gray-900">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
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
