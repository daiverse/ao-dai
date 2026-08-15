import React, { useState } from "react";
import { ARTICLES } from "../data/articles";
import { Clock, User, Calendar, ArrowUpRight, ExternalLink, BookOpen, ArrowLeft, Globe, Share2, Sparkles } from "lucide-react";

export default function JournalPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const categories = [
    { id: "all", label: "Tất cả bài viết" },
    { id: "Di Sản & Văn Hóa", label: "Di Sản & Văn Hóa" },
    { id: "Bí Quyết Thời Trang", label: "Bí Quyết Thời Trang" },
    { id: "Công Nghệ & Xu Hướng", label: "Công Nghệ & Xu Hướng" }
  ];

  const featuredArticle = ARTICLES[0];
  const gridArticles = activeFilter === "all"
    ? ARTICLES
    : ARTICLES.filter(a => a.category === activeFilter);

  const handleSelectArticle = (art) => {
    setSelectedArticle(art);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // IF AN ARTICLE IS SELECTED: Render Dedicated Full-Page Article Detail Site
  if (selectedArticle) {
    const relatedArticles = ARTICLES.filter(a => a.id !== selectedArticle.id).slice(0, 3);

    return (
      <div className="pt-28 sm:pt-32 pb-24 bg-[#FBF9F5] min-h-screen text-gray-900">
        <div className="container-page max-w-5xl mx-auto">
          {/* Top Navigation & Breadcrumbs */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pt-4">
            <button
              onClick={() => {
                setSelectedArticle(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-800 text-xs font-bold hover:bg-[#18392B] hover:text-white transition-all shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay Lại Trang Tạp Chí</span>
            </button>

            <div className="text-xs text-gray-500 font-medium">
              <span>Tạp Chí</span> <span className="mx-1">/</span> <span className="text-[#C85A32] font-semibold">{selectedArticle.category}</span>
            </div>
          </div>

          {/* Article Editorial Header */}
          <header className="space-y-6 mb-10 text-center max-w-4xl mx-auto">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C85A32] font-bold px-4 py-1.5 rounded-full bg-[#C85A32]/10 border border-[#C85A32]/20 inline-block">
              {selectedArticle.category}
            </span>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.2]">
              {selectedArticle.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-gray-600 border-y border-gray-200/80 py-4">
              <span className="flex items-center gap-2 font-medium">
                <User className="w-4 h-4 text-[#C85A32]" />
                {selectedArticle.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C85A32]" />
                {selectedArticle.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C85A32]" />
                {selectedArticle.readTime}
              </span>
            </div>

            {/* Citation Banner Header */}
            <div className="bg-[#18392B]/5 border border-[#18392B]/15 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-left max-w-3xl mx-auto">
              <div className="flex items-center gap-2.5 text-gray-800 font-medium">
                <Globe className="w-4 h-4 text-[#18392B] shrink-0" />
                <span><strong>Nguồn trích dẫn uy tín:</strong> {selectedArticle.sourceName}</span>
              </div>
              {selectedArticle.sourceUrl && (
                <a
                  href={selectedArticle.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#C85A32] font-bold hover:underline shrink-0"
                >
                  <span>Truy cập trang nguồn</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </header>

          {/* Featured Hero Image Stage */}
          <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl aspect-[16/9] sm:aspect-[21/9] bg-gray-900 border border-gray-100">
            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Main Article Body Layout (Content + Sidebar) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            {/* Main Text Content */}
            <main className="lg:col-span-8 space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-md">
              <div className="text-lg sm:text-xl font-heading text-[#18392B] font-semibold leading-relaxed border-l-4 border-[#C85A32] pl-5 italic">
                "{selectedArticle.excerpt}"
              </div>

              <div className="space-y-8 text-gray-800 font-light leading-[1.85] text-base sm:text-lg">
                {selectedArticle.sections ? (
                  selectedArticle.sections.map((sec, idx) => (
                    <div key={idx} className="space-y-4 pt-4 border-t border-gray-100 first:border-none first:pt-0">
                      <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#18392B] leading-snug">
                        {sec.heading}
                      </h2>
                      <div className="text-gray-700 leading-[1.9] font-light whitespace-pre-line">
                        {sec.text}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-700 leading-[1.9] font-light whitespace-pre-line">
                    {selectedArticle.content}
                  </div>
                )}
              </div>

              {/* Bottom Original Source Link Card */}
              <div className="mt-12 p-5 sm:p-6 bg-gradient-to-r from-[#18392B] to-[#0F241B] text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl border border-white/10">
                <div className="space-y-1">
                  <span className="text-[11px] text-[#D4A373] uppercase tracking-widest font-bold block">
                    🔗 Nguồn bài viết gốc
                  </span>
                  <p className="text-sm font-semibold text-white/90">
                    {selectedArticle.sourceName}
                  </p>
                </div>
                {selectedArticle.sourceUrl && (
                  <a
                    href={selectedArticle.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-[#C85A32] hover:bg-[#C85A32]/90 text-white text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg border-none no-underline cursor-pointer whitespace-nowrap"
                  >
                    <span>Đọc bài gốc</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </main>

            {/* Right Editorial Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Author Box */}
              <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-3">
                <span className="text-[11px] font-bold text-[#C85A32] uppercase tracking-wider block">Tác Giả & Biên Tập</span>
                <h3 className="font-heading font-bold text-lg text-gray-900">{selectedArticle.author}</h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  Chuyên san nghiên cứu văn hóa may mặc Áo dài Việt Nam thuộc DaiVerse Journal.
                </p>
              </div>

              {/* Related Articles List */}
              <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-5">
                <h3 className="font-heading font-bold text-lg text-gray-900 border-b border-gray-100 pb-3">
                  Bài Viết Khác Cùng Chủ Đề
                </h3>
                <div className="space-y-4">
                  {relatedArticles.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => handleSelectArticle(rel)}
                      className="group cursor-pointer flex gap-3 items-center hover:bg-[#FBF9F5] p-2 rounded-2xl transition-colors"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                        <img src={rel.image} alt={rel.title} className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#C85A32] font-bold uppercase">{rel.category}</span>
                        <h4 className="font-heading text-xs font-bold text-gray-900 group-hover:text-[#C85A32] transition-colors line-clamp-2 leading-snug">
                          {rel.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {/* Bottom Back Button Bar */}
          <div className="pt-8 border-t border-gray-200 flex justify-center">
            <button
              onClick={() => {
                setSelectedArticle(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-8 py-4 bg-[#18392B] text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#18392B]/90 shadow-xl transition-all flex items-center gap-2 cursor-pointer border-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay Lại Danh Sách Tạp Chí</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT VIEW: Journal Index Page
  return (
    <div className="bg-[#FBF9F5] min-h-screen pb-24">
      {/* 1. HERO BANNER */}
      <section className="relative min-h-[50vh] lg:min-h-[55vh] overflow-hidden flex items-end">
        <div className="absolute inset-0 grid grid-cols-3">
          <div className="relative overflow-hidden">
            <img
              src="/images/journal/history.png"
              alt="Áo Dài Di Sản"
              className="w-full h-full object-cover object-top opacity-90"
            />
          </div>
          <div className="relative overflow-hidden">
            <img
              src="/images/journal/silk_care.png"
              alt="Lụa Tơ Tằm"
              className="w-full h-full object-cover object-top opacity-90"
            />
          </div>
          <div className="relative overflow-hidden">
            <img
              src="/images/journal/lotus.png"
              alt="Áo Dài Đương Đại"
              className="w-full h-full object-cover object-top opacity-90"
            />
          </div>
        </div>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#18392B] via-[#18392B]/80 to-[#18392B]/50"></div>

        {/* Hero Text */}
        <div className="relative container-page w-full pb-12 lg:pb-16 pt-36 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#D4A373] text-xs font-bold uppercase tracking-[0.25em] mb-4 border border-white/10">
            <BookOpen className="w-4 h-4" />
            <span>Tạp Chí Áo Dài DaiVerse Journal</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Tri Thức Di Sản & <em className="text-[#D4A373] font-heading italic font-normal">Nghệ Thuật Áo Dài</em>
          </h1>
          <p className="text-base lg:text-lg text-white/80 mt-4 max-w-2xl mx-auto leading-relaxed font-light">
            Tổng hợp lịch sử may mặc, giá trị di sản văn hóa, bí quyết bảo quản lụa tơ tằm và xu hướng thời trang áo dài đương đại (Nguồn trích dẫn uy tín).
          </p>
        </div>
      </section>

      {/* 2. FEATURED ARTICLE — Large editorial card */}
      <section className="container-page py-12 lg:py-16 -mt-8 relative z-10">
        <article
          onClick={() => handleSelectArticle(featuredArticle)}
          className="relative grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-0 rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50 bg-white cursor-pointer group"
        >
          {/* Featured Image */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[460px] overflow-hidden bg-gray-900">
            <img
              src={featuredArticle.image}
              alt={featuredArticle.title}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden"></div>
            <span className="absolute top-5 left-5 bg-[#C85A32] text-white text-[10px] uppercase tracking-[0.24em] font-bold px-4 py-2 rounded-full shadow-lg">
              Bài Nổi Bật
            </span>
          </div>

          {/* Featured Content */}
          <div className="flex flex-col justify-between p-8 lg:p-12 xl:p-14">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.28em] text-[#C85A32] font-bold block">
                {featuredArticle.category}
              </span>
              <h2 className="font-heading text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 leading-[1.2] group-hover:text-[#C85A32] transition-colors">
                {featuredArticle.title}
              </h2>
              <p className="text-sm text-gray-600 leading-[1.8] font-light">
                {featuredArticle.excerpt}
              </p>
            </div>

            <div className="pt-6 space-y-4 border-t border-gray-100 mt-6">
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-[#FBF9F5] p-3 rounded-xl border border-gray-200/70">
                <Globe className="w-4 h-4 text-[#18392B] shrink-0" />
                <span className="truncate"><strong>Nguồn trích dẫn:</strong> {featuredArticle.sourceName}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#18392B]" />{featuredArticle.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#18392B]" />{featuredArticle.readTime}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#18392B] group-hover:text-[#C85A32] transition-colors">
                  <span>Đọc Trang Bài Viết</span>
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* 3. ARTICLES GRID with Filter Tabs */}
      <section className="container-page pb-16 lg:pb-24">
        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12 border-b border-gray-200/80 pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.28em] text-[#C85A32] font-bold block mb-1">
              Thư Viện Tri Thức
            </span>
            <h3 className="font-heading text-3xl font-bold text-gray-900">
              Bài Viết & Nghiên Cứu Tổng Hợp ({gridArticles.length})
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border cursor-pointer outline-none ${
                  activeFilter === cat.id
                    ? "bg-[#18392B] text-white border-[#18392B] shadow-md shadow-[#18392B]/20 scale-105"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridArticles.map((art) => (
            <article
              key={art.id}
              onClick={() => handleSelectArticle(art)}
              className="group flex flex-col rounded-3xl overflow-hidden border border-gray-200/80 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.2em] font-bold bg-[#18392B]/90 backdrop-blur-md text-[#D4A373] px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
                  {art.category}
                </span>
              </div>

              {/* Content Box */}
              <div className="flex-1 flex flex-col justify-between p-6 sm:p-7 space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C85A32]" />
                      {art.date}
                    </span>
                    <span>• {art.readTime}</span>
                  </div>

                  <h4 className="font-heading font-bold text-xl text-gray-900 group-hover:text-[#C85A32] transition-colors leading-snug line-clamp-2">
                    {art.title}
                  </h4>

                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed font-light">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-3">
                  {/* Source tag */}
                  <div className="text-[11px] text-gray-500 bg-[#FBF9F5] p-2.5 rounded-xl border border-gray-200/60 flex items-center gap-1.5 truncate">
                    <Globe className="w-3.5 h-3.5 text-[#18392B] shrink-0" />
                    <span className="truncate">Nguồn: {art.sourceName}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="flex items-center gap-1 text-gray-500 font-medium">
                      <User className="w-3.5 h-3.5 text-[#C85A32]" />
                      {art.author}
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-[#18392B] group-hover:text-[#C85A32] transition-colors">
                      <span>Xem trang bài viết</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
