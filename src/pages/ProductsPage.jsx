import React, { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Sparkles, Check, ArrowUpDown, Star, RotateCcw, Eye, ShoppingBag, Truck, RefreshCw, Palette } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "../data/products";
import { COLLECTIONS } from "../data/collections";
import ProductCard from "../components/common/ProductCard";

export default function ProductsPage({ onTryOn, onRotate360, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Category thumbnail mappings matching user image collection
  const categoryThumbnails = {
    all: "/anh/746927465_122119237899355470_7558522641041819280_n.jpg",
    express24h: "/anh/749239603_122119072485355470_980697849173578283_n.jpg",
    "truyen-thong": "/anh/748811734_122119072365355470_5191248946269688850_n.jpg",
    "cach-tan": "/anh/748948738_122119559763355470_8315866031234642956_n.jpg",
    cuoi: "/anh/747178293_122119072509355470_7986902361393680700_n.jpg",
    "theu-tay": "/anh/746927465_122119237899355470_7558522641041819280_n.jpg"
  };

  // Calculate counts
  const categoryCounts = useMemo(() => {
    const counts = { all: PRODUCTS.length, express24h: PRODUCTS.filter(p => p.isExpress24h).length };
    CATEGORIES.forEach((cat) => {
      if (cat.id !== "all" && cat.id !== "express24h") {
        counts[cat.id] = PRODUCTS.filter((p) => p.category === cat.id).length;
      }
    });
    return counts;
  }, []);

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
      // Default: newest first
      return b.isNew ? 1 : -1;
    });
  }, [selectedCategory, selectedCollection, searchTerm, sortOption]);

  return (
    <div className="pt-24 pb-20 bg-[#FBF9F5] min-h-screen">
      {/* 1. Hero Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#18392B] via-[#1d4232] to-[#0f241c] text-white py-16 px-4 sm:px-6 lg:px-8 mb-10 shadow-xl border-b border-[#D4A373]/30">
        {/* Subtle Overlay Pattern & Watermark Image */}
        <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none">
          <img
            src="/anh/746927465_122119237899355470_7558522641041819280_n.jpg"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C85A32]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container-page relative z-10 text-center max-w-4xl mx-auto space-y-5">
          {/* Collection Counter Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-[0.25em] text-[#D4A373]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bộ Sưu Tập · {PRODUCTS.length} Thiết Kế</span>
          </div>

          {/* Main Title */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            Áo Dài <span className="font-heading italic font-normal text-[#D4A373]">Cao Cấp</span>
          </h1>

          {/* Description */}
          <p className="text-gray-200 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Từ truyền thống đến cách tân — mỗi tà áo là một tác phẩm nghệ thuật được may bằng tình yêu nghề và trí tuệ nhân tạo.
          </p>

          {/* Feature Badges Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs sm:text-sm font-medium text-gray-200">
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-white/15">
              <Truck className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Giao hàng toàn quốc</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-white/15">
              <RefreshCw className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Đổi trả 30 ngày</span>
            </span>
            <button
              onClick={() => onNavigate && onNavigate("design-studio")}
              className="flex items-center gap-1.5 bg-[#C85A32] hover:bg-[#C85A32]/90 text-white px-4 py-1.5 rounded-full transition-all shadow-md cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Thiết kế với AI</span>
            </button>
            <button
              onClick={() => onNavigate && onNavigate("try-on")}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 rounded-full transition-all cursor-pointer backdrop-blur-xs border border-white/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Thử đồ AI miễn phí</span>
            </button>
          </div>
        </div>
      </section>

      <div className="container-page space-y-8">
        {/* 2. Collection (BST) Horizontal Filter Row */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs space-y-3">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-widest text-[#18392B] shrink-0 pr-2 border-r border-gray-200">
              BST
            </span>

            {/* Mọi BST */}
            <button
              onClick={() => setSelectedCollection("all")}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                selectedCollection === "all"
                  ? "bg-[#18392B] text-white shadow-md"
                  : "bg-[#FBF9F5] text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>Mọi BST</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                selectedCollection === "all" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                {collectionCounts.all}
              </span>
            </button>

            {/* Collection Items */}
            {COLLECTIONS.map((col) => (
              <button
                key={col.id}
                onClick={() => setSelectedCollection(col.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  selectedCollection === col.id
                    ? "bg-[#18392B] text-white shadow-md"
                    : "bg-[#FBF9F5] text-gray-700 hover:bg-gray-200"
                }`}
              >
                <img
                  src={col.fallbackImage}
                  alt={col.name}
                  className="w-4 h-4 rounded-full object-cover shrink-0"
                />
                <span>{col.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  selectedCollection === col.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                }`}>
                  {collectionCounts[col.id] || 0}
                </span>
              </button>
            ))}
          </div>

          {/* 3. Category Filter Pills Row (with Thumbnails) */}
          <div className="flex items-center gap-3 overflow-x-auto pt-2 border-t border-gray-100 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;
              const thumb = categoryThumbnails[cat.id] || categoryThumbnails.all;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-3 shrink-0 cursor-pointer border ${
                    isSelected
                      ? "bg-white border-[#18392B] text-[#18392B] shadow-md ring-2 ring-[#18392B]/10"
                      : "bg-[#FBF9F5] border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300"
                  }`}
                >
                  <img
                    src={thumb}
                    alt={cat.name}
                    className="w-7 h-7 rounded-full object-cover shadow-xs shrink-0"
                  />
                  <div className="text-left">
                    <div className="font-bold">{cat.name}</div>
                    <div className="text-[10px] font-medium text-gray-400">{count} sản phẩm</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Controls Bar: Search, Sort & Results Count */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tên áo, chất liệu gấm lụa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FBF9F5] border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#18392B] transition-colors"
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

          {/* Sort Buttons / Dropdown */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            <div className="text-xs text-gray-500 font-medium">
              Hiển thị <span className="font-bold text-gray-900">{filteredProducts.length}</span> sản phẩm
            </div>

            <div className="flex items-center gap-1.5 bg-[#FBF9F5] p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setSortOption("newest")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  sortOption === "newest" ? "bg-[#18392B] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                ✦ Mới Nhất
              </button>
              <button
                onClick={() => setSortOption("price-low")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  sortOption === "price-low" ? "bg-[#18392B] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                ↑ Giá Thấp
              </button>
              <button
                onClick={() => setSortOption("price-high")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  sortOption === "price-high" ? "bg-[#18392B] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                ↓ Giá Cao
              </button>
              <button
                onClick={() => setSortOption("rating")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  sortOption === "rating" ? "bg-[#18392B] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                ★ Đánh Giá
              </button>
            </div>
          </div>
        </div>

        {/* 5. Product Grid */}
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
              className="px-6 py-2.5 bg-[#18392B] text-white rounded-full text-xs font-bold hover:bg-[#18392B]/90 transition-all shadow-md"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onTryOn={onTryOn}
                onRotate360={onRotate360}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
