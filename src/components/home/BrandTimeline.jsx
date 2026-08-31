import React from "react";

export default function BrandTimeline() {
  const timelineData = [
    {
      year: "2024",
      title: "Khởi nguồn",
      paragraphs: [
        "DaiVerse khởi nguồn từ một câu hỏi rất giản dị: Làm thế nào để áo dài vẫn gần gũi với vẻ đẹp truyền thống mà vẫn thích ứng được với thế hệ hôm nay bằng một cách tinh tế hơn?",
        "Giữa nhịp sống hiện đại, áo dài không chỉ là trang phục dành cho những dịp đặc biệt. Đó còn là ký ức, là niềm tự hào và là nét đẹp vốn hoà đã đồng hành cùng bao thế hệ người Việt.",
        "Từ suy nghĩ đó, DaiVerse dần hình thành như một dự án kết nối truyền thống với công nghệ, để mỗi người đều có thể tìm thấy chiếc áo dài dành riêng cho mình."
      ],
      image: "/anh/753652294_122120859075355470_523410657087258177_n.jpg",
      imageAlt: "Khởi nguồn DaiVerse",
      layout: "text-left"
    },
    {
      year: "2025",
      title: "Kiến tạo trải nghiệm",
      paragraphs: [
        "Chúng tôi tin rằng mỗi người phụ nữ đều mang một vẻ đẹp rất riêng. Bởi vậy, thay vì chỉ xây dựng một website bán áo dài, DaiVerse lựa chọn tạo nên một không gian nơi mỗi người phụ nữ khám phá chính mình.",
        "Thông qua việc phân tích vóc dáng, phong cách, màu sắc yêu thích và mục đích sử dụng, hệ thống AI đưa ra những gợi ý phù hợp, giúp việc lựa chọn áo dài trở nên tự nhiên, cá nhân hóa và đầy cảm hứng.",
        "Đồng thời, ba bộ sưu tập Mộng Liên, Trăng Trong Lụa và Hương Cố Đô được phát triển như ba câu chuyện khác nhau, cùng tôn vinh vẻ đẹp của người phụ nữ Việt qua những góc nhìn đa dạng."
      ],
      image: "/anh/754189695_122121323961355470_4835644296669048277_n.jpg",
      imageAlt: "Kiến tạo trải nghiệm",
      layout: "text-right"
    },
    {
      year: "2025",
      title: "Hoàn thiện",
      paragraphs: [
        "DaiVerse không chỉ là một website thương mại điện tử. Đó là nơi những giá trị truyền thống được kể lại bằng ngôn ngữ của thời đại số.",
        "Mỗi thiết kế bắt đầu mang trong mình một câu chuyện, mỗi bộ sưu tập chứa đựng một cảm hứng, và mỗi trải nghiệm đều được tạo ra để giúp khách hàng cảm nhận rằng chiếc áo dài không chỉ đẹp, mà còn thuộc về mình."
      ],
      image: "/anh/748552016_122119237911355470_8898990539200168318_n.jpg",
      imageAlt: "Hoàn thiện",
      layout: "text-left"
    },
    {
      year: "TẦM NHÌN",
      title: "Hướng đến tương lai",
      paragraphs: [
        "DaiVerse tin rằng công nghệ không thay thế mà sẽ nâng đỡ giá trị truyền thống. Công nghệ chỉ là cầu nối để những gì đã có từ lâu, được nhìn nhận toàn diện hơn.",
        "Trong tương lai, DaiVerse mong muốn tiếp tục phát triển những trải nghiệm mới với AI, mở rộng các bộ sưu tập và góp phần đưa áo dài trở thành biểu tượng gần gũi hơn với bạn bè quốc tế."
      ],
      image: null,
      imageAlt: "",
      layout: "text-left"
    }
  ];

  return (
    <section className="py-24 lg:py-32 bg-[#EBE9E1] relative overflow-hidden">
      <div className="container-page">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <p className="text-xs uppercase tracking-[0.35em] text-[#E43D12] font-bold mb-4">
            Hành Trình
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#EFB11D] leading-[1.1]">
            Mỗi tà áo đều bắt đầu <em className="italic font-heading text-[#E43D12] font-semibold">từ một câu chuyện</em>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Center vertical line (desktop) */}
          <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-[#E43D12]/30 via-[#E43D12]/15 to-transparent"></div>

          {/* Left vertical line (mobile) */}
          <div className="lg:hidden absolute top-0 bottom-0 left-4 w-px bg-gradient-to-b from-[#E43D12]/30 via-[#E43D12]/15 to-transparent"></div>

          <div className="space-y-16 lg:space-y-24">
            {timelineData.map((item, index) => {
              const isLeft = item.layout === "text-left";

              return (
                <div key={index} className="relative">
                  {/* Year Marker Dot */}
                  <div className="absolute left-4 lg:left-1/2 -translate-x-1/2 -top-2 z-10">
                    <div className="flex flex-col items-center">
                      <span className="px-3 py-1 bg-[#EFB11D] text-white text-[10px] uppercase tracking-[0.2em] font-bold rounded-full shadow-lg">
                        {item.year}
                      </span>
                      <div className="w-px h-4 bg-[#EFB11D]/30 mt-1"></div>
                    </div>
                  </div>

                  {/* Content Row */}
                  <div className="pt-10 lg:pt-8">
                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start pl-12 lg:pl-0`}>
                      {/* Text Column */}
                      <div
                        className={`space-y-4 ${
                          isLeft ? "lg:order-1 lg:pr-12 lg:text-right" : "lg:order-2 lg:pl-12"
                        }`}
                      >
                        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#EFB11D]">
                          {item.title}
                        </h3>
                        {item.paragraphs.map((para, pIdx) => (
                          <p key={pIdx} className="text-sm text-gray-600 leading-[1.85]">
                            {para}
                          </p>
                        ))}
                      </div>

                      {/* Image Column */}
                      <div
                        className={`${
                          isLeft ? "lg:order-2 lg:pl-12" : "lg:order-1 lg:pr-12"
                        }`}
                      >
                        {item.image ? (
                          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 aspect-[4/5]">
                            <img
                              src={item.image}
                              alt={item.imageAlt}
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                        ) : (
                          <div className="rounded-2xl bg-[#EFB11D]/5 border border-[#EFB11D]/10 p-8 flex items-center justify-center aspect-[4/3]">
                            <div className="text-center space-y-3">
                              <span className="text-5xl">🌸</span>
                              <p className="text-sm text-[#EFB11D]/60 font-medium italic">
                                Hành trình vẫn đang tiếp tục...
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
