import React from "react";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      quote: "“Áo dài từ DaiVerse thực sự tuyệt vời! Chất lụa tơ tằm mềm mại, đường may tinh tế. Tính năng thử đồ AI giúp tôi chọn được mẫu ưng ý ngay lần đầu.”",
      name: "Nguyễn Thị Minh Anh",
      location: "Hà Nội",
      initials: "MA"
    },
    {
      id: 2,
      quote: "“Tôi đã đặt áo dài cưới tại đây và hoàn toàn hài lòng. Gấm dệt kim tuyến lộng lẫy, phom dáng chuẩn. Dịch vụ tư vấn rất chuyên nghiệp.”",
      name: "Trần Phương Linh",
      location: "TP. Hồ Chí Minh",
      initials: "PL"
    },
    {
      id: 3,
      quote: "“Công nghệ AI thử đồ rất tiện lợi, giúp tôi hình dung được mình mặc áo dài như thế nào trước khi mua. Chất lượng sản phẩm xứng đáng với giá tiền.”",
      name: "Lê Hoàng Yến Nhi",
      location: "Đà Nẵng",
      initials: "YN"
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#FBF9F5]">
      <div className="container-page">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.35em] text-[#C85A32] font-bold mb-3">
            PHẢN HỒI
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Khách Hàng Nói Gì
          </h2>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-3 my-4">
            <div className="w-12 h-px bg-gray-300"></div>
            <div className="w-2 h-2 rotate-45 bg-[#18392B]"></div>
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
                  <div className="flex items-center gap-1 text-[#18392B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-[#18392B]" />
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
