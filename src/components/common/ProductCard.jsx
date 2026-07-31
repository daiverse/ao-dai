import React, { useState } from "react";
import { Sparkles, Eye, ShoppingBag, Star, RotateCcw } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product, onTryOn, onRotate360 }) {
  const { addToCart, setQuickViewProduct } = useCart();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const selectedColor = product.colors ? product.colors[selectedColorIndex] : null;

  return (
    <div 
      className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-[#FBF9F5] overflow-hidden">
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          {product.isExpress24h && (
            <span className="px-3 py-1 bg-gradient-to-r from-[#C85A32] to-amber-600 text-white text-[11px] font-bold tracking-wider uppercase rounded-full shadow-md flex items-center gap-1 animate-pulse">
              <span>⚡ Giao 24h</span>
            </span>
          )}
          {product.isNew && (
            <span className="px-3 py-1 bg-[#C85A32] text-white text-[11px] font-semibold tracking-wider uppercase rounded-full shadow-md">
              Mới 2026
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-3 py-1 bg-[#18392B] text-[#D4A373] text-[11px] font-semibold tracking-wider uppercase rounded-full shadow-md">
              Bán Chạy
            </span>
          )}
        </div>

        {/* Action Overlay Buttons */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
          <button
            onClick={() => setQuickViewProduct(product)}
            className="p-3 bg-white/90 backdrop-blur-md text-gray-800 rounded-full hover:bg-white hover:text-[#C85A32] shadow-lg transition-all cursor-pointer"
            title="Xem nhanh"
          >
            <Eye className="w-4 h-4" />
          </button>

          {product.hasAiTryOn && (
            <button
              onClick={() => onTryOn && onTryOn(product)}
              className="px-4 py-2.5 bg-[#18392B] backdrop-blur-md text-white text-xs font-semibold rounded-full hover:bg-[#18392B]/90 shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
              title="Thử đồ với AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Thử AI</span>
            </button>
          )}

          {product.has360View && (
            <button
              onClick={() => onRotate360 && onRotate360(product)}
              className="p-3 bg-white/90 backdrop-blur-md text-gray-800 rounded-full hover:bg-white hover:text-[#18392B] shadow-lg transition-all cursor-pointer"
              title="Xem 360°"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating & Category */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="uppercase tracking-wider font-medium text-[#C85A32]">
              {product.fabric}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating}</span>
              <span className="text-gray-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => setQuickViewProduct(product)}
            className="font-heading font-semibold text-base text-gray-900 group-hover:text-[#C85A32] transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>
        </div>

        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            {product.colors.map((color, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedColorIndex(idx)}
                className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                  selectedColorIndex === idx 
                    ? "scale-125 border-[#18392B] ring-2 ring-[#C85A32]/40" 
                    : "border-gray-300 hover:scale-110"
                }`}
                style={{ backgroundColor: color.code }}
                title={color.name}
              />
            ))}
            <span className="text-[11px] text-gray-400 ml-1">
              {product.colors[selectedColorIndex]?.name}
            </span>
          </div>
        )}

        {/* Price & Add to Cart Action */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <span className="font-heading font-bold text-base text-[#18392B]">
              {product.formattedPrice}
            </span>
            {product.formattedOriginalPrice && (
              <span className="text-xs text-gray-400 line-through ml-2">
                {product.formattedOriginalPrice}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, "M", selectedColor?.name)}
            className="p-2.5 bg-[#FBF9F5] text-gray-800 hover:bg-[#18392B] hover:text-white rounded-xl transition-all shadow-xs cursor-pointer"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
