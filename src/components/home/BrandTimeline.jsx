import React from "react";

export default function BrandTimeline() {
  const timelineData = [
    {
      year: "2024",
      title: "Khởi nguồn sáng tạo",
      paragraphs: [
        "DaiVerse Fashion khởi nguồn từ khát vọng gìn giữ tà Áo Dài truyền thống và kết hợp cùng hơi thở thời trang hiện đại.",
        "Giữa nhịp sống gấp gáp, Áo Dài không chỉ là trang phục sự kiện mà còn là niềm tự hào của vẻ đẹp Việt Nam.",
        "Từ suy nghĩ đó, DaiVerse kết nối tay nghề may thủ công cao cấp với công nghệ mới để mang lại trải nghiệm cá nhân hóa hoàn hảo."
      ],
      image: "/anh/753652294_122120859075355470_523410657087258177_n.jpg",
      imageAlt: "Khởi nguồn DaiVerse",
      layout: "text-left"
    },
    {
      year: "2025",
      title: "Công nghệ AI & 3D Virtual Try-On",
      paragraphs: [
        "Tạo dựng không gian nơi mỗi người phụ nữ dễ dàng tìm thấy bộ Áo Dài chuẩn vóc dáng nhất.",
        "Hệ thống phân tích tỉ lệ cơ thể và gợi ý phom dáng tôn dáng, giúp trải nghiệm mua sắm tự nhiên và cá nhân hóa.",
        "Các bộ sưu tập ra đời mang trong mình câu chuyện riêng, tôn vinh nét đài các của phụ nữ Việt."
      ],
      image: "/anh/754189695_122121323961355470_4835644296669048277_n.jpg",
      imageAlt: "Kiến tạo trải nghiệm",
      layout: "text-right"
    },
    {
      year: "2026",
      title: "Đột phá Thời trang số",
      paragraphs: [
        "Mỗi thiết kế Áo Dài DaiVerse chứa đựng tâm huyết thêu may tỉ mỉ và sự chuẩn xác từng đường kim mũi chỉ.",
        "Mang lại giá trị di sản qua ngôn ngữ thời đại mới, khẳng định vị thế thương hiệu hàng đầu."
      ],
      image: "/anh/748552016_122119237911355470_8898990539200168318_n.jpg",
      imageAlt: "Hoàn thiện",
      layout: "text-left"
    },
    {
      year: "TẦM NHÌN",
      title: "Vươn tầm tương lai",
      paragraphs: [
        "DaiVerse ứng dụng công nghệ để làm thăng hoa giá trị truyền thống Việt Nam.",
        "Tiếp tục phát triển hệ sinh thái AI Studio và đưa sản phẩm Áo Dài tiếp cận thị trường toàn cầu."
      ],
      image: "/anh/hong-nguyet/1.jpg",
      imageAlt: "Tầm nhìn DaiVerse 2026",
      layout: "text-right"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-[#FAF6F0] relative overflow-hidden border-b border-neutral-200">
      <div className="container-page">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-18">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-extrabold mb-3">
            CÂU CHUYỆN THƯƠNG HIỆU
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#111111] uppercase tracking-wide">
            HÀNH TRÌNH TẠO NÊN <span className="text-[#C5A059]">ÁO DÀI DAIVERSE</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Center vertical line */}
          <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-neutral-200"></div>

          {/* Left vertical line (mobile) */}
          <div className="lg:hidden absolute top-0 bottom-0 left-4 w-0.5 bg-neutral-200"></div>

          <div className="space-y-12 lg:space-y-20">
            {timelineData.map((item, index) => {
              const isLeft = item.layout === "text-left";

              return (
                <div key={index} className="relative">
                  {/* Timeline dot */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-0 w-8 h-8 rounded-full bg-[#111111] border-2 border-[#C5A059] items-center justify-center text-white text-xs font-bold z-10">
                    {index + 1}
                  </div>

                  {/* Content Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Content Column */}
                    <div
                      className={`${
                        isLeft
                          ? "lg:order-1 lg:text-right lg:pr-10"
                          : "lg:order-2 lg:text-left lg:pl-10"
                      } pl-10 lg:pl-0`}
                    >
                      <span className="inline-block px-3 py-1 bg-[#111111] text-[#C5A059] font-heading font-black text-sm uppercase tracking-widest mb-3">
                        {item.year}
                      </span>
                      <h3 className="font-heading text-2xl font-black text-[#111111] uppercase tracking-wide mb-4">
                        {item.title}
                      </h3>
                      <div className="space-y-3 text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                        {item.paragraphs.map((p, pIndex) => (
                          <p key={pIndex}>{p}</p>
                        ))}
                      </div>
                    </div>

                    {/* Visual Image Column */}
                    <div
                      className={`${
                        isLeft ? "lg:order-2 lg:pl-10" : "lg:order-1 lg:pr-10"
                      }`}
                    >
                      {item.image ? (
                        <div className="rounded-none overflow-hidden shadow-md border border-neutral-300 aspect-[4/5] bg-neutral-900 group">
                          <img
                            src={item.image}
                            alt={item.imageAlt}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                      ) : (
                        <div className="bg-white border border-[#E5DECE] p-8 flex items-center justify-center aspect-[4/3] shadow-md">
                          <div className="text-center space-y-3">
                            <img src="/logo.png" alt="DaiVerse Logo" className="h-16 w-auto mx-auto object-contain" />
                            <p className="text-xs text-[#C5A059] font-bold uppercase tracking-widest">
                              DAIVERSE 2026 & BEYOND
                            </p>
                          </div>
                        </div>
                      )}
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

