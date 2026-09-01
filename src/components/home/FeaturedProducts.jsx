import React, { useState } from "react";
import { CATEGORIES, PRODUCTS } from "../../data/products";
import ProductCard from "../common/ProductCard";

export default function FeaturedProducts({ onTryOn, onRotate360 }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts = activeCategory === "all" 
    ? PRODUCTS 
    : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <section className="py-16 lg:py-24 bg-[#FAF6F0] border-b border-neutral-200">
      <div className="container-page">
        {/* Section Title */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-extrabold mb-2">
            ÁO DÀI DAIVERSE SELECTION
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111] uppercase tracking-wide">
            SẢN PHẨM NỔI BẬT
          </h2>
          <div className="w-12 h-0.5 bg-[#C5A059] mx-auto mt-3"></div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap mb-12 border-b border-neutral-200 pb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-xs sm:text-sm font-bold uppercase tracking-widest transition-all cursor-pointer border-none bg-transparent pb-1 relative ${
                activeCategory === cat.id
                  ? "text-[#C5A059]"
                  : "text-neutral-500 hover:text-[#111111]"
              }`}
            >
              {cat.name}
              {activeCategory === cat.id && (
                <span className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-[#C5A059]"></span>
              )}
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

