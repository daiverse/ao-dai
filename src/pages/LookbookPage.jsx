import React, { useState } from "react";
import { Eye, Sparkles, ArrowRight, Palette, Layers, Heart, RotateCcw } from "lucide-react";
import { PRODUCTS } from "../data/products";
import { COLLECTIONS } from "../data/collections";
import { useCart } from "../context/CartContext";

export default function LookbookPage() {
  const { setQuickViewProduct } = useCart();
  const [activeFilter, setActiveFilter] = useState("all");

  const lookbookItems = React.useMemo(() => {
    return PRODUCTS.map((product) => {
      const collection = COLLECTIONS.find((c) => c.id === product.collection) || COLLECTIONS[0];
      return {
        id: product.id,
        title: product.name,
        collectionName: collection.name,
        collectionId: product.collection,
        image: product.images[0],
        totalImages: product.images.length,
        fabric: product.fabric,
        formattedPrice: product.formattedPrice,
        description: product.description,
        storyContent: product.storyContent,
        product: product,
      };
    });
  }, []);

  const filteredItems = activeFilter === "all"
    ? lookbookItems
    : lookbookItems.filter((item) => item.collectionId === activeFilter);

  const group1 = filteredItems.slice(0, 3);
  const group2 = filteredItems.slice(3, 6);

  const renderCard = (item) => (
    <div
      key={item.id}
      onClick={() => setQuickViewProduct(item.product)}
      className="group relative rounded-3xl overflow-hidden bg-white border border-gray-200/70 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer"
    >
      {/* Top Image Stage - Pinned to top so head is 100% visible */}
      <div className="relative w-full aspect-[3/4] bg-[#F7F4EE] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
        />

        {/* Hover backdrop overlay */}
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Floating Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#EFB11D] font-bold bg-[#EFB11D]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-md">
            BST {item.collectionName}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full font-medium shadow-sm">
              {item.totalImages} ảnh
            </span>
            <div className="p-2 rounded-full bg-white text-gray-900 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Eye className="w-4 h-4 text-[#EFB11D]" />
            </div>
          </div>
        </div>

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
          <span className="px-5 py-2.5 bg-white/90 backdrop-blur-md text-[#EFB11D] text-xs font-bold rounded-full shadow-xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <Eye className="w-4 h-4 text-[#E43D12]" />
            <span>Xem Bộ Ảnh Chi Tiết</span>
          </span>
        </div>
      </div>

      {/* Bottom Information Card */}
      <div className="p-6 sm:p-7 bg-white flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider text-[#E43D12] font-semibold block">
            {item.fabric}
          </span>
          <h3 className="font-heading text-2xl font-bold text-gray-900 leading-snug group-hover:text-[#E43D12] transition-colors">
            {item.title}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed font-light">
            {item.storyContent ? item.storyContent : item.description}
          </p>
        </div>

        <div className="pt-3 flex items-center justify-between border-t border-gray-100 text-xs">
          <span className="font-bold text-[#EFB11D] text-base">{item.formattedPrice}</span>
          <span className="text-[#E43D12] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
            <span>Xem Chi Tiết</span>
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-28 pb-20 bg-[#EBE9E1] min-h-screen">
      <div className="container-page">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFB11D]/10 text-[#EFB11D] text-xs font-bold uppercase tracking-[0.25em]">
            <Layers className="w-3.5 h-3.5 text-[#E43D12]" />
            <span>Bộ Sưu Tập Áo Dài DaiVerse 2026</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Lookbook High-Fashion <span className="font-heading italic text-[#E43D12]">DaiVerse</span>
          </h1>

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-light max-w-2xl mx-auto">
            Khám phá các thiết kế áo dài cao cấp mang sự giao thoa giữa nét đẹp truyền thống và hơi thở đương đại.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-14">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-none outline-none ${
              activeFilter === "all"
                ? "bg-[#EFB11D] text-white shadow-xl shadow-[#EFB11D]/20 scale-105"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-200"
            }`}
          >
            ✦ Tất Cả Thiết Kế ({lookbookItems.length})
          </button>

          {COLLECTIONS.map((col) => (
            <button
              key={col.id}
              onClick={() => setActiveFilter(col.id)}
              className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-none outline-none ${
                activeFilter === col.id
                  ? "bg-[#EFB11D] text-white shadow-xl shadow-[#EFB11D]/20 scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-200"
              }`}
            >
              BST {col.name} ({COLLECTIONS.find(c => c.id === col.id)?.itemCount || 0} Thiết kế)
            </button>
          ))}
        </div>

        {/* SECTION 1: Group 1 Cards */}
        {group1.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {group1.map(renderCard)}
          </div>
        )}

        {/* INTERSPERSED BANNER 1: BST Mộc Lan Feature Banner */}
        {activeFilter === "all" && (
          <div className="my-16 rounded-3xl overflow-hidden shadow-2xl relative bg-[#EFB11D] text-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-6 h-[320px] sm:h-[380px] lg:h-[420px] relative overflow-hidden">
                <img
                  src="/anh/bach-lan/1.jpg"
                  alt="BST Mộc Lan Editorial"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#EFB11D]/30 to-[#EFB11D] hidden lg:block"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#EFB11D] to-transparent lg:hidden"></div>
              </div>

              <div className="lg:col-span-6 p-8 sm:p-10 lg:p-12 space-y-4">
                <span className="text-xs uppercase tracking-[0.3em] text-[#EFB11D] font-bold block">
                  BST Mộc Lan · 4 Thiết Kế Độc Bản
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold leading-tight">
                  Khởi Đầu Của Một Vẻ Đẹp Thuần Khiết & Bình Yên
                </h2>
                <p className="text-sm text-gray-200 leading-relaxed font-light">
                  BST Mộc Lan gồm 4 thiết kế áo dài độc đáo: <strong>Bạch Lan</strong>, <strong>Sương Mai</strong>, <strong>Mộc An</strong>, và <strong>Hồng Nguyệt</strong>. Mang sự giao thoa giữa nét đẹp truyền thống Việt Nam và hơi thở đương đại quý phái.
                </p>
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveFilter("moc-lan")}
                    className="px-6 py-3 bg-[#E43D12] text-white rounded-full text-xs font-bold hover:bg-[#E43D12]/90 shadow-md cursor-pointer border-none"
                  >
                    Khám Phá BST Mộc Lan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: Group 2 Cards */}
        {group2.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {group2.map(renderCard)}
          </div>
        )}

        {/* INTERSPERSED BANNER 2: BST Phong Sắc Feature Banner */}
        {activeFilter === "all" && (
          <div className="my-16 rounded-3xl overflow-hidden shadow-2xl relative bg-[#E43D12] text-white p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>Bộ Sưu Tập Mới · Phong Sắc</span>
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold leading-tight">
                  Thanh Phong — Thanh Thoát Trong Từng Nhịp Gió
                </h2>
                <p className="text-sm text-white/90 leading-relaxed max-w-2xl font-light">
                  Thiết kế dáng suông Tafta 3 món cao cấp (Áo, Quần & Áo khoác choàng tay cánh dơi). Gam màu xanh dịu và đỏ thanh lịch tôn vinh sự tự do, kiêu hãnh của người phụ nữ hiện đại.
                </p>
              </div>
              <div className="lg:col-span-4 flex lg:justify-end">
                <button
                  onClick={() => setActiveFilter("phong-sac")}
                  className="px-8 py-4 bg-white text-[#E43D12] rounded-full font-bold shadow-xl hover:bg-gray-100 transition-all flex items-center gap-2 text-sm cursor-pointer border-none"
                >
                  <Eye className="w-4 h-4" />
                  <span>Xem BST Phong Sắc</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
