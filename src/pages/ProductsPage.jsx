import React, { useState, useMemo } from "react";
import { Search, Sparkles, Layers, LayoutGrid, Truck, RefreshCw, Palette } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "../data/products";
import { COLLECTIONS } from "../data/collections";
import ProductCard from "../components/common/ProductCard";
import { FEATURE_FLAGS } from "../config/featureFlags";

export default function ProductsPage({ onTryOn, onRotate360, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: PRODUCTS.length, express24h: PRODUCTS.filter(p => p.isExpress24h).length };
    CATEGORIES.forEach((cat) => {
      if (cat.id !== "all" && cat.id !== "express24h") {
        counts[cat.id] = PRODUCTS.filter((p) => p.category === cat.id).length;
      }
    });
    return counts;
  }, []);

  // Calculate collection counts
  const collectionCounts = useMemo(() => {
    const counts = { all: PRODUCTS.length };
    COLLECTIONS.forEach((col) => {
      counts[col.id] = PRODUCTS.filter((p) => p.collection === col.id).length;
    });
    return counts;
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory =
        selectedCategory === "all"
          ? true
          : selectedCategory === "express24h"
          ? p.isExpress24h
          : p.category === selectedCategory;

      const matchesCollection =
        selectedCollection === "all" || p.collection === selectedCollection;

      const matchesSearch =
        !searchTerm.trim() ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.fabric.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesCollection && matchesSearch;
    }).sort((a, b) => {
      if (sortOption === "price-low") return a.price - b.price;
      if (sortOption === "price-high") return b.price - a.price;
      if (sortOption === "rating") return b.rating - a.rating;
      return b.isNew ? 1 : -1;
    });
  }, [selectedCategory, selectedCollection, searchTerm, sortOption]);

  return (
    <div className="pt-24 pb-20 bg-[#FBF9F5] min-h-screen">
      {/* 1. Hero Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#18392B] via-[#1d4232] to-[#0f241c] text-white py-14 px-4 sm:px-6 lg:px-8 mb-10 shadow-xl border-b border-[#D4A373]/30">
        <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none">
          <img
            src="/anh/746927465_122119237899355470_7558522641041819280_n.jpg"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C85A32]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container-page relative z-10 text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-[0.25em] text-[#D4A373]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bộ Sưu Tập · {PRODUCTS.length} Thiết Kế</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Áo Dài <span className="font-heading italic font-normal text-[#D4A373]">Cao Cấp</span>
          </h1>

          <p className="text-gray-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-light">
            Từ truyền thống đến cách tân — mỗi tà áo là một tác phẩm nghệ thuật được may bằng tình yêu nghề và trí tuệ nhân tạo.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs sm:text-sm font-medium text-gray-200">
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-white/15">
              <Truck className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Giao hàng toàn quốc</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-white/15">
              <RefreshCw className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Đổi trả 30 ngày</span>
            </span>
            {FEATURE_FLAGS.ENABLE_AI_TRY_ON && (
              <button
                onClick={() => onNavigate && onNavigate("try-on")}
                className="flex items-center gap-1.5 bg-[#C85A32] hover:bg-[#C85A32]/90 text-white px-4 py-1.5 rounded-full transition-all shadow-md cursor-pointer border-none"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Thử đồ AI miễn phí</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid (Sidebar + Products) */}
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR: BỘ LỌC */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-28">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-md space-y-6 max-h-[calc(100vh-130px)] overflow-y-auto pr-2">
              
              {/* Sidebar Title Header */}
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-heading text-2xl font-bold text-gray-900">
                  Bộ lọc
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Tinh chỉnh kết quả
                </p>
              </div>

              {/* SECTION 1: BỘ SƯU TẬP */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#EAE8E2] flex items-center justify-center text-gray-700 shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-gray-800">
                    BỘ SƯU TẬP
                  </span>
                </div>

                {/* Collection Filter Cards List */}
                <div className="space-y-3">
                  {/* Item 0: Tất cả BST */}
                  <button
                    onClick={() => setSelectedCollection("all")}
                    className={`w-full p-3.5 rounded-2xl transition-all text-left flex items-center gap-3.5 cursor-pointer border ${
                      selectedCollection === "all"
                        ? "border-[#18392B] bg-[#FBF9F5] shadow-xs"
                        : "border-gray-200/80 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="w-11 h-11 rounded-2xl bg-[#F5F2EB] flex items-center justify-center text-[#18392B] shrink-0">
                      <Sparkles className="w-5 h-5 text-[#8B6B43]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-gray-900 leading-tight">
                        Tất cả BST
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {PRODUCTS.length} sản phẩm
                      </div>
                    </div>
                  </button>

                  {/* Items 1..N: COLLECTIONS */}
                  {COLLECTIONS.map((col) => {
                    const isSelected = selectedCollection === col.id;
                    const count = collectionCounts[col.id] || 0;

                    return (
                      <button
                        key={col.id}
                        onClick={() => setSelectedCollection(col.id)}
                        className={`w-full p-3.5 rounded-2xl transition-all text-left flex items-center gap-3.5 cursor-pointer border ${
                          isSelected
                            ? "border-[#18392B] bg-[#FBF9F5] shadow-xs"
                            : "border-gray-200/80 bg-white hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={col.fallbackImage}
                          alt={col.name}
                          className="w-11 h-11 rounded-full object-cover object-top shrink-0 border border-gray-100 shadow-xs"
                        />
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="font-bold text-sm text-gray-900 leading-tight">
                            {col.name}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                            {col.subtitle}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 font-semibold shrink-0">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: DANH MỤC */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#EAE8E2] flex items-center justify-center text-gray-700 shrink-0">
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-gray-800">
                    DANH MỤC
                  </span>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const count = categoryCounts[cat.id] || 0;

                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border-none outline-none ${
                          isSelected
                            ? "bg-[#18392B] text-white shadow-sm"
                            : "bg-[#F5F2EB] text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {cat.name} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reset Filter Button (if filtered) */}
              {(selectedCategory !== "all" || selectedCollection !== "all" || searchTerm) && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedCollection("all");
                      setSearchTerm("");
                    }}
                    className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl text-xs font-bold transition-all cursor-pointer border-none"
                  >
                    ✕ Xóa tất cả bộ lọc
                  </button>
                </div>
              )}

            </div>
          </aside>

          {/* RIGHT COLUMN: PRODUCTS & CONTROLS */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-6">
            
            {/* Controls Bar: Search & Sort */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Search Box */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tên áo, chất liệu gấm lụa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FBF9F5] border border-gray-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-[#18392B] transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort Options */}
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                <span className="text-xs text-gray-500 font-medium">
                  Hiển thị <strong className="text-gray-900 font-bold">{filteredProducts.length}</strong> sản phẩm
                </span>

                <div className="flex items-center gap-1 bg-[#FBF9F5] p-1 rounded-2xl border border-gray-200">
                  <button
                    onClick={() => setSortOption("newest")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border-none ${
                      sortOption === "newest" ? "bg-[#18392B] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    ✦ Mới Nhất
                  </button>
                  <button
                    onClick={() => setSortOption("price-low")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border-none ${
                      sortOption === "price-low" ? "bg-[#18392B] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    ↑ Giá Thấp
                  </button>
                  <button
                    onClick={() => setSortOption("price-high")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border-none ${
                      sortOption === "price-high" ? "bg-[#18392B] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    ↓ Giá Cao
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto text-2xl">
                  🔍
                </div>
                <h3 className="font-heading font-bold text-xl text-gray-800">Không tìm thấy sản phẩm nào</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Không có thiết kế áo dài nào phù hợp với các tiêu chí tìm kiếm hiện tại của bạn.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSelectedCollection("all");
                  }}
                  className="px-6 py-2.5 bg-[#18392B] text-white rounded-full text-xs font-bold hover:bg-[#18392B]/90 transition-all shadow-md cursor-pointer border-none"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onTryOn={onTryOn}
                    onRotate360={onRotate360}
                    isExpressContext={false}
                  />
                ))}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
