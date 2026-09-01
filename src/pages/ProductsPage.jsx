import React, { useState, useMemo } from "react";
import { Search, Sparkles, Layers, LayoutGrid } from "lucide-react";
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
    <div className="pt-32 sm:pt-36 pb-20 bg-[#FAF6F0] min-h-screen">

      {/* 1. Hero Header Banner */}
      <section className="relative overflow-hidden bg-[#111111] text-white py-14 px-4 sm:px-6 lg:px-8 mb-8 border-b-2 border-[#C5A059]">
        <img 
          src="/anh/bach-lan/banner.png" 
          alt="Áo Dài DaiVerse Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/70 to-transparent"></div>
        <div className="container-page relative z-10 text-center max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059] text-white text-[10px] font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DAIVERSE · {PRODUCTS.length} THIẾT KẾ ÁO DÀI</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-wide text-white uppercase">
            ÁO DÀI DAIVERSE
          </h1>

          <p className="text-neutral-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-normal">
            DaiVerse - nơi tinh hoa Việt hòa quyện cùng công nghệ AI, kiến tạo những tà áo độc bản mang dấu ấn riêng của bạn.
          </p>

          {FEATURE_FLAGS.ENABLE_AI_TRY_ON && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-semibold">
              <button
                onClick={() => onNavigate && onNavigate("try-on")}
                className="flex items-center gap-1.5 bg-[#C5A059] hover:bg-[#A4813D] text-white px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-none"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>THỬ ĐỒ AI MIỄN PHÍ</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 2. Main Content Grid (Sidebar + Products) */}
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR: BỘ LỌC */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-28">
            <div className="bg-neutral-50 p-5 border border-neutral-300 space-y-6 max-h-[calc(100vh-130px)] overflow-y-auto">
              
              {/* Sidebar Title Header */}
              <div className="border-b border-neutral-300 pb-3">
                <h3 className="font-heading text-lg font-black text-[#111111] uppercase tracking-wide">
                  BỘ LỌC SẢN PHẨM
                </h3>
              </div>

              {/* SECTION 1: BỘ SƯU TẬP */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#C5A059]" />
                  <span className="text-xs uppercase tracking-wider font-extrabold text-[#111111]">
                    BỘ SƯU TẬP
                  </span>
                </div>

                {/* Collection Filter Cards List */}
                <div className="space-y-2">
                  {/* Item 0: Tất cả BST */}
                  <button
                    onClick={() => setSelectedCollection("all")}
                    className={`w-full p-2.5 transition-all text-left flex items-center justify-between cursor-pointer border ${
                      selectedCollection === "all"
                        ? "border-[#111111] bg-white font-bold"
                        : "border-neutral-200 bg-neutral-100 hover:border-neutral-400"
                    }`}
                  >
                    <span className="text-xs text-[#111111] uppercase font-bold">Tất cả BST</span>
                    <span className="text-[11px] text-neutral-500 font-semibold">{PRODUCTS.length}</span>
                  </button>

                  {/* Items 1..N: COLLECTIONS */}
                  {COLLECTIONS.map((col) => {
                    const isSelected = selectedCollection === col.id;
                    const count = collectionCounts[col.id] || 0;

                    return (
                      <button
                        key={col.id}
                        onClick={() => setSelectedCollection(col.id)}
                        className={`w-full p-2.5 transition-all text-left flex items-center justify-between cursor-pointer border ${
                          isSelected
                            ? "border-[#111111] bg-white font-bold"
                            : "border-neutral-200 bg-neutral-100 hover:border-neutral-400"
                        }`}
                      >
                        <span className="text-xs text-[#111111] font-bold">{col.name}</span>
                        <span className="text-[11px] text-neutral-500 font-semibold">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: DANH MỤC */}
              <div className="space-y-3 pt-3 border-t border-neutral-300">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-[#C5A059]" />
                  <span className="text-xs uppercase tracking-wider font-extrabold text-[#111111]">
                    DANH MỤC
                  </span>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-col gap-1.5">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const count = categoryCounts[cat.id] || 0;

                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-2 text-left text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-[#111111] text-white border-[#111111]"
                            : "bg-white text-neutral-800 border-neutral-300 hover:border-neutral-500"
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
                <div className="pt-2 border-t border-neutral-300">
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedCollection("all");
                      setSearchTerm("");
                    }}
                    className="w-full py-2 bg-[#C5A059] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-none"
                  >
                    ✕ XÓA BỘ LỌC
                  </button>
                </div>
              )}

            </div>
          </aside>

          {/* RIGHT COLUMN: PRODUCTS & CONTROLS */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-6">
            
            {/* Controls Bar: Search & Sort */}
            <div className="bg-neutral-50 p-4 border border-neutral-300 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Search Box */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Tìm sản phẩm, chất liệu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-300 text-xs focus:outline-none focus:border-[#111111]"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-black border-none bg-transparent cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort Options */}
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                <span className="text-xs text-neutral-500 font-bold">
                  {filteredProducts.length} sản phẩm
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSortOption("newest")}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                      sortOption === "newest" ? "bg-[#111111] text-white border-[#111111]" : "bg-white text-neutral-700 border-neutral-300"
                    }`}
                  >
                    Mới Nhất
                  </button>
                  <button
                    onClick={() => setSortOption("price-low")}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                      sortOption === "price-low" ? "bg-[#111111] text-white border-[#111111]" : "bg-white text-neutral-700 border-neutral-300"
                    }`}
                  >
                    Giá Thấp
                  </button>
                  <button
                    onClick={() => setSortOption("price-high")}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                      sortOption === "price-high" ? "bg-[#111111] text-white border-[#111111]" : "bg-white text-neutral-700 border-neutral-300"
                    }`}
                  >
                    Giá Cao
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-neutral-50 border border-neutral-300 space-y-3">
                <h3 className="font-heading font-black text-lg text-[#111111] uppercase">Không tìm thấy sản phẩm nào</h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  Vui lòng thử điều chỉnh lại từ khóa hoặc xóa bộ lọc tìm kiếm.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSelectedCollection("all");
                  }}
                  className="px-5 py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059] transition-all cursor-pointer border-none"
                >
                  XÓA BỘ LỌC
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

