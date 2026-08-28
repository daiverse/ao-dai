import React, { useState } from "react";
import { CATEGORIES, PRODUCTS } from "../../data/products";
import ProductCard from "../common/ProductCard";

export default function FeaturedProducts({ onTryOn, onRotate360 }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts = activeCategory === "all" 
    ? PRODUCTS 
    : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <section className="py-24 lg:py-32 bg-[#FDF6C0]">
      <div className="container-page">
        {/* Section Title */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C8920A] font-bold mb-2">
            Tuyệt Tác May Đo
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFDF00]">
            Bộ Sưu Tập Nổi Bật
          </h2>
          <div className="w-12 h-0.5 bg-[#C8920A] mx-auto mt-4"></div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#FFDF00] text-white shadow-lg shadow-[#FFDF00]/20"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
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
      </div>
    </section>
  );
}
