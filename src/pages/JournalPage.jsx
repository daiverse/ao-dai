import React, { useState } from "react";
import { ARTICLES } from "../data/articles";
import { Clock, User, Calendar, ArrowUpRight } from "lucide-react";

export default function JournalPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const allArticles = [
    ...ARTICLES,
    {
      id: "art-04",
      title: "Lụa Bảo Lộc: Tinh Hoa Dệt Thủ Công Hơn 300 Năm",
      category: "Di Sản & Văn Hóa",
      date: "05 Tháng 7, 2026",
      readTime: "6 phút đọc",
      excerpt: "Hành trình từ nương dâu xanh mướt đến những cuộn lụa tơ tằm óng ả — câu chuyện của người thợ dệt Bảo Lộc tận tâm qua nhiều thế hệ.",
      image: "/anh/754189695_122121323961355470_4835644296669048277_n.jpg",
      author: "Mai Anh - Serene Journal"
    },
    {
      id: "art-05",
      title: "5 Cách Phối Áo Dài Cách Tân Cho Ngày Thường",
      category: "Bí Quyết Thời Trang",
      date: "01 Tháng 7, 2026",
      readTime: "4 phút đọc",
      excerpt: "Không chỉ dành cho dịp lễ, áo dài cách tân có thể mix-match tự tin đến công sở, dạo phố hay hẹn hò cuối tuần.",
      image: "/anh/754463095_122121323955355470_8016593937347573814_n.jpg",
      author: "Thanh Trúc"
    },
    {
      id: "art-06",
      title: "Hướng Dẫn Bảo Quản Áo Dài Lụa Đúng Cách",
      category: "Bí Quyết Thời Trang",
      date: "28 Tháng 6, 2026",
      readTime: "3 phút đọc",
      excerpt: "Cách giặt, phơi, ủi và cất giữ tà áo dài lụa tơ tằm để giữ nguyên độ bóng mượt và hương thơm tự nhiên suốt nhiều năm.",
      image: "/anh/756873041_122121325557355470_9187559362789881870_n.jpg",
      author: "Serene Care"
    }
  ];

  const categories = [
    { id: "all", label: "Tất cả" },
    { id: "Di Sản & Văn Hóa", label: "Di Sản & Văn Hóa" },
    { id: "Bí Quyết Thời Trang", label: "Bí Quyết Thời Trang" },
    { id: "Công Nghệ & Xu Hướng", label: "Công Nghệ & Xu Hướng" }
  ];

  const featuredArticle = allArticles[0];
  const gridArticles = activeFilter === "all"
    ? allArticles.slice(1)
    : allArticles.filter(a => a.category === activeFilter);

  return (
    <div className="bg-[#FBF9F5] min-h-screen">
      {/* 1. HERO BANNER with 3-column image mosaic background */}
      <section className="relative min-h-[55vh] lg:min-h-[62vh] overflow-hidden flex items-end">
        {/* 3-column Image Background */}
        <div className="absolute inset-0 grid grid-cols-3">
          <div className="relative overflow-hidden">
            <img
              src="/anh/746947278_122119072383355470_6400495368402003300_n.jpg"
              alt="Mộng Liên"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="relative overflow-hidden">
            <img
              src="/anh/748931198_122119072389355470_4323049577285984388_n.jpg"
              alt="Trăng Trong Lụa"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="relative overflow-hidden">
            <img
              src="/anh/749239603_122119072485355470_980697849173578283_n.jpg"
              alt="Hương Cố Đô"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#18392B] via-[#18392B]/75 to-[#18392B]/40"></div>

        {/* Hero Text */}
        <div className="relative container-page w-full pb-12 lg:pb-16 pt-32 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#D4A373] font-semibold mb-4">
            Tạp Chí DaiVerse
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05]">
            Câu chuyện <em className="text-[#D4A373] font-heading italic">tà áo</em>
          </h1>
          <p className="text-base lg:text-lg text-white/75 mt-5 max-w-2xl mx-auto leading-relaxed">
            Nghề may, lịch sử, phong cách và những câu chuyện đằng sau ba bộ sưu tập lookbook.
          </p>
        </div>
      </section>

      {/* 2. FEATURED ARTICLE — Large editorial card */}
      <section className="container-page py-12 lg:py-16 -mt-8 relative z-10">
        <article className="relative grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-0 rounded-3xl overflow-hidden shadow-2xl border border-gray-200/30 bg-white">
          {/* Featured Image */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[480px] overflow-hidden">
            <img
              src={featuredArticle.image}
              alt={featuredArticle.title}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/10 lg:to-white/0"></div>
            <span className="absolute top-5 left-5 bg-[#C85A32] text-white text-[10px] uppercase tracking-[0.24em] font-semibold px-4 py-2 rounded-full shadow-lg">
              Bài Nổi Bật
            </span>
            <span className="absolute bottom-5 left-5 text-[10px] uppercase tracking-[0.2em] font-semibold bg-black/50 backdrop-blur text-white px-3 py-1.5 rounded-full">
              {featuredArticle.category}
            </span>
          </div>

          {/* Featured Content */}
          <div className="flex flex-col justify-center p-8 lg:p-12 xl:p-14">
            <p className="text-xs uppercase tracking-[0.28em] text-[#18392B] font-semibold mb-3">
              {featuredArticle.category}
            </p>
            <h2 className="font-heading text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-[1.12] mb-5">
              {featuredArticle.title}
            </h2>
            <p className="text-base text-gray-600 leading-[1.85] mb-8 line-clamp-4">
              {featuredArticle.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 mb-8">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#18392B]" />
                {featuredArticle.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#18392B]" />
                {featuredArticle.readTime}
              </span>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#18392B] hover:gap-3 transition-all w-fit cursor-pointer">
              Đọc bài viết đầy đủ
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </article>
      </section>

      {/* 3. ARTICLES GRID with filter tabs */}
      <section className="container-page pb-16 lg:pb-24">
        {/* Section Header + Filter Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#C85A32] font-semibold mb-2">
              Bài Viết Mới Nhất
            </p>
            <h3 className="font-heading text-3xl lg:text-4xl font-bold text-gray-900">
              Khám phá theo chủ đề
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border cursor-pointer outline-none ${
                  activeFilter === cat.id
                    ? "bg-[#C85A32] text-white border-[#C85A32] shadow-md shadow-[#C85A32]/20"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#C85A32]/40 hover:text-gray-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {gridArticles.map((art) => (
            <article
              key={art.id}
              className="group flex flex-col rounded-3xl overflow-hidden border border-gray-200/40 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
            >
              {/* Card Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.2em] font-semibold bg-[#18392B] text-white px-3 py-1.5 rounded-full">
                  {art.category}
                </span>
              </div>

              {/* Card Content */}
              <div className="flex-1 flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {art.date}
                    </span>
                    <span>• {art.readTime}</span>
                  </div>
                  <h4 className="font-heading font-bold text-lg text-gray-900 group-hover:text-[#C85A32] transition-colors leading-snug mb-2">
                    {art.title}
                  </h4>
                  <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <User className="w-3.5 h-3.5 text-[#C85A32]" />
                    {art.author}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-[#18392B] font-semibold group-hover:gap-2 transition-all cursor-pointer">
                    Đọc bài
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
