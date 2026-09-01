import React, { useState } from "react";
import { Eye, Sparkles, ArrowRight, Layers } from "lucide-react";
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
      className="group relative bg-white border border-neutral-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Top Image Stage - 3:4 portrait */}
      <div className="relative w-full aspect-[3/4] bg-neutral-100 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
        />

        {/* Hover backdrop overlay */}
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Floating Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="text-[10px] uppercase font-bold bg-[#111111] text-white px-2.5 py-1 tracking-widest">
            BST {item.collectionName}
          </span>
          <div className="p-1.5 bg-white text-[#111111] shadow-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
          </div>
        </div>

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
          <span className="px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-widest shadow-lg flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#C5A059]" />
            <span>XEM BỘ ẢNH</span>
          </span>
        </div>
      </div>

      {/* Bottom Information Card */}
      <div className="p-5 bg-white flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider block">
            {item.fabric}
          </span>
          <h3 className="font-heading font-black text-lg text-[#111111] uppercase tracking-wide group-hover:text-[#C5A059] transition-colors truncate">
            {item.title}
          </h3>
          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed font-normal">
            {item.storyContent ? item.storyContent : item.description}
          </p>
        </div>

        <div className="pt-3 flex items-center justify-between border-t border-neutral-200 text-xs">
          <span className="font-bold text-[#C5A059] text-sm">{item.formattedPrice}</span>
          <span className="text-[#111111] font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform flex items-center gap-1">
            <span>XEM CHI TIẾT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-32 sm:pt-36 pb-20 bg-white min-h-screen">

      <div className="container-page">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059] text-white text-[10px] font-extrabold uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5" />
            <span>DaiVerse LOOKBOOK 2026</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#111111] uppercase tracking-wide">
            EDITORIAL <span className="text-[#C5A059]">LOOKBOOK</span>
          </h1>

          <p className="text-neutral-600 text-xs sm:text-sm max-w-xl mx-auto font-normal">
            Khám phá các bộ ảnh thời trang Áo Dài cao cấp được sáng tạo bởi thương hiệu DaiVerse.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-10 border-b border-neutral-200 pb-4">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              activeFilter === "all"
                ? "bg-[#111111] text-white border-[#111111]"
                : "bg-white text-neutral-700 border-neutral-300"
            }`}
          >
            TẤT CẢ THIẾT KẾ ({lookbookItems.length})
          </button>

          {COLLECTIONS.map((col) => (
            <button
              key={col.id}
              onClick={() => setActiveFilter(col.id)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                activeFilter === col.id
                  ? "bg-[#111111] text-white border-[#111111]"
                  : "bg-white text-neutral-700 border-neutral-300"
              }`}
            >
              BST {col.name} ({COLLECTIONS.find(c => c.id === col.id)?.itemCount || 0})
            </button>
          ))}
        </div>

        {/* SECTION 1: Group 1 Cards */}
        {group1.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {group1.map(renderCard)}
          </div>
        )}

        {/* INTERSPERSED BANNER 1 */}
        {activeFilter === "all" && (
          <div className="my-12 overflow-hidden border border-neutral-300 bg-[#111111] text-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-6 h-[300px] sm:h-[350px] relative overflow-hidden">
                <img
                  src="/anh/bach-lan/banner.png"
                  alt="BST Mộc Lan Editorial"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="lg:col-span-6 p-8 space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block">
                  BST MỘC LAN · DAIVERSE
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wide text-white">
                  VẺ ĐẸP THUẦN KHẢO & TRANG NHÃ
                </h2>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                  BST Mộc Lan gồm các thiết kế Áo Dài gấm lụa cao cấp, kết hợp công nghệ thời trang số cá nhân hóa.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveFilter("moc-lan")}
                    className="px-6 py-3 bg-[#C5A059] hover:bg-[#A4813D] text-white text-xs font-bold uppercase tracking-widest transition-all border-none cursor-pointer"
                  >
                    KHÁM PHÁ BỘ SƯU TẬP
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: Group 2 Cards */}
        {group2.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {group2.map(renderCard)}
          </div>
        )}
      </div>
    </div>
  );
}

