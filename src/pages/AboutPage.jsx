import React from "react";
import { Sparkles, Scissors, Feather, Award, ShieldCheck, Clock, CheckCircle2, Heart } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { number: "20+", label: "Năm Gìn Giữ Di Sản" },
    { number: "50K+", label: "Tà Áo Dài Đã May" },
    { number: "100%", label: "Lụa Tơ Tằm Bảo Lộc" },
    { number: "4.9 ★", label: "Đánh Giá Hài Lòng" }
  ];

  const pillars = [
    {
      step: "01",
      title: "Tôn Vinh Tỉ Lệ Vàng",
      desc: "Phom dáng ôm nhẹ tinh tế, đường cắt may chuẩn tỉ lệ cơ thể phụ nữ Việt tôn lên nét thanh thoát tự nhiên."
    },
    {
      step: "02",
      title: "Lụa Tơ Tằm Bảo Lộc",
      desc: "Tuyển chọn 100% sợi tơ tự nhiên thượng hạng — thoáng mát, óng ả và dịu nhẹ êm ái khi tiếp xúc làn da."
    },
    {
      step: "03",
      title: "Cá Nhân Hóa Trí Tuệ AI",
      desc: "Tích hợp công nghệ AI Studio cho phép thử đồ 3D và tự thiết kế màu sắc, cổ áo chuẩn xác trước khi may."
    }
  ];

  const milestones = [
    { year: "2006", title: "Khởi Đầu Di Sản", desc: "Xưởng dệt lụa tơ tằm thủ công đầu tiên được thành lập tại Bảo Lộc." },
    { year: "2016", title: "Mở Rộng Thêu Tay", desc: "Hợp tác cùng các nghệ nhân thêu tay di sản Hoàng Thành Cố Đô Huế." },
    { year: "2026", title: "Tiên Phong AI Studio", desc: "Ra mắt thương hiệu DaiVerse kết hợp AI Design Studio & Virtual Try-on." }
  ];

  const commitments = [
    { icon: <ShieldCheck className="w-6 h-6 text-[#C85A32]" />, title: "Lụa Tự Nhiên 100%", desc: "Cam kết sử dụng lụa tơ tằm và gấm dệt di sản thượng hạng." },
    { icon: <Clock className="w-6 h-6 text-[#C85A32]" />, title: "Giao Hàng Hỏa Tốc 24h", desc: "Hỗ trợ may sẵn và chỉnh sửa eo nhanh chóng nhận trong ngày." },
    { icon: <Scissors className="w-6 h-6 text-[#C85A32]" />, title: "May Đo Theo Số Đo", desc: "Tùy chỉnh chi tiết phom dáng theo số đo riêng của từng khách hàng." },
    { icon: <Award className="w-6 h-6 text-[#C85A32]" />, title: "Bảo Hành Trọn Đời", desc: "Chăm sóc sợi lụa và bóp chỉnh eo miễn phí suốt quá trình sử dụng." }
  ];

  return (
    <div className="pt-36 sm:pt-40 lg:pt-36 pb-24 bg-[#FBF9F5] min-h-screen text-gray-900">
      {/* 1. Hero Header Section */}
      <section className="container-page mb-16 lg:mb-24">
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-[0.35em] text-[#C85A32] font-bold px-4 py-1.5 rounded-full bg-[#C85A32]/10 border border-[#C85A32]/20 inline-block">
            Câu Chuyện Thương Hiệu · Di Sản & Đổi Mới
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.15]">
            DaiVerse – Giải Pháp Cá Nhân Hóa Áo Dài Việt<br />
            <span className="text-[#18392B] italic font-heading font-semibold">Với Công Nghệ AI & Thử Mặc 3D</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mt-4 leading-relaxed max-w-2xl mx-auto">
            DaiVerse được xây dựng với mong muốn mang đến một trải nghiệm mua sắm áo dài hiện đại, trực quan và cá nhân hóa hơn. Thông qua việc ứng dụng công nghệ AI, mô phỏng 3D và thử đồ ảo, DaiVerse giúp khách hàng dễ dàng lựa chọn kiểu dáng, tùy chỉnh thiết kế, xem trước áo dài trên mô hình ảo và đặt may sản phẩm phù hợp với vóc dáng, phong cách cũng như dịp sử dụng của mình.
          </p>
        </div>

        {/* Hero Showcase Image */}
        <div className="mt-12 relative rounded-3xl overflow-hidden shadow-2xl h-[420px] sm:h-[520px] lg:h-[600px] bg-gray-900 border border-gray-100">
          <img
            src="/anh/754058094_122120859087355470_3079712870670515575_n.jpg"
            alt="DaiVerse Heritage Showcase"
            className="w-full h-full object-cover object-[center_15%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Stats Bar Floating Bottom */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 bg-white/15 backdrop-blur-md p-3.5 sm:p-5 rounded-2xl border border-white/20 text-white text-center">
            {stats.map((st, idx) => (
              <div key={idx} className="space-y-0.5 sm:space-y-1">
                <p className="font-heading text-xl sm:text-3xl font-bold text-[#F4E8E1]">{st.number}</p>
                <p className="text-[11px] sm:text-xs text-white/80 font-medium">{st.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Core Pillars Section */}
      <section className="py-20 bg-white border-y border-gray-200/80 mb-20">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C85A32] font-bold block mb-2">Triết Lý Thiết Kế</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900">Tôn Vinh Vẻ Đẹp Thuần Khiết</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-[#FBF9F5] border border-gray-100 space-y-4 hover:shadow-xl transition-all">
                <span className="text-3xl font-heading font-bold text-[#C85A32] block">{pillar.step}</span>
                <h3 className="font-heading text-2xl font-bold text-[#18392B]">{pillar.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Craftsmanship Editorial Story (Alternating Rows) */}
      <section className="container-page space-y-24 mb-24">
        {/* Story Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 relative">
            <img
              src="/anh/746927465_122119237899355470_7558522641041819280_n.jpg"
              alt="Artisan Embroidery"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="lg:col-span-6 space-y-6 lg:pl-4">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C85A32] font-bold block">Thêu Tay Nghệ Nhân</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Bàn Tay Vàng Lắng Đọng <span className="text-[#18392B] italic">Hơn 18 Giờ Tỉ Mỉ</span>
            </h2>
            <p className="text-base text-gray-600 leading-relaxed">
              Mỗi đóa sen hồng hay họa tiết chim phụng di sản trên áo dài DaiVerse không chỉ là nét vẽ trên vải, mà được các nghệ nhân kinh nghiệm trên 15 năm thêu tay thủ công từng đường kim mũi chỉ.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#C85A32]" />
                <span>Sợi chỉ tơ nhuộm màu tự nhiên không phai</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#C85A32]" />
                <span>Kỹ thuật thêu nổi 3D tinh xảo sống động</span>
              </div>
            </div>
          </div>
        </div>

        {/* Story Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 lg:order-1 order-2 lg:pr-4">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C85A32] font-bold block">Kỷ Nguyên AI Studio</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Công Nghệ Vị Nhân Sinh <span className="text-[#18392B] italic">Xem Đồ 3D Vừa Vặn</span>
            </h2>
            <p className="text-base text-gray-600 leading-relaxed">
              Chúng tôi đưa trí tuệ nhân tạo vào quy trình thời trang truyền thống — giúp quý khách hàng chọn lựa kiểu dáng, phối màu sắc và mặc thử 3D trực tiếp trên ảnh cá nhân trước khi quyết định đặt may.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#C85A32]" />
                <span>Mô phỏng phom dáng chuẩn 99% theo số đo</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#C85A32]" />
                <span>Tùy chỉnh cổ áo, tà áo & phụ kiện đính kèm</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 relative lg:order-2 order-1">
            <img
              src="/anh/748811734_122119072365355470_5191248946269688850_n.jpg"
              alt="AI Technology & Silk"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </section>

      {/* 4. Timeline Milestones */}
      <section className="py-20 bg-[#18392B] text-white mb-24 relative overflow-hidden">
        <div className="container-page relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#D4A373] font-bold block mb-2">Hành Trình Phát Triển</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">Cột Mốc Di Sản DaiVerse</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {milestones.map((ms, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-3 relative">
                <span className="text-4xl font-heading font-bold text-[#D4A373] block">{ms.year}</span>
                <h3 className="font-heading text-xl font-bold text-white">{ms.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{ms.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Brand Commitments Grid */}
      <section className="container-page mb-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C85A32] font-bold block mb-2">Cam Kết Chất Lượng</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900">An Tâm Trong Từng Tà Áo</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {commitments.map((cm, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-white border border-gray-100 shadow-lg space-y-3">
              <div className="p-3 w-fit rounded-2xl bg-[#C85A32]/10">
                {cm.icon}
              </div>
              <h4 className="font-heading font-bold text-lg text-gray-900">{cm.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{cm.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
