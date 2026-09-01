import React, { useState } from "react";
import { Sparkles, Eye, ShoppingBag, Star, RotateCcw } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { FEATURE_FLAGS } from "../../config/featureFlags";

export default function ProductCard({ product, onTryOn, onRotate360, isExpressContext = false }) {
  const { addToCart, setQuickViewProduct } = useCart();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const selectedColor = product.colors ? product.colors[selectedColorIndex] : null;

  const handleAddToCart = () => {
    const itemData = {
      ...product,
      isExpress24h: isExpressContext,
      fromExpress24h: isExpressContext,
    };
    addToCart(itemData, "M", selectedColor?.name);
  };

  // Tính phần trăm giảm giá nếu có originalPrice
  const discountPercent = product.originalPrice && product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 30;

  return (
    <div 
      className="group relative bg-[#FAF6F0] rounded-none border border-[#E5DECE] hover:border-[#C5A059] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div 
        onClick={() => setQuickViewProduct(product)}
        className="relative aspect-[3/4] bg-[#F3EFE6] overflow-hidden cursor-pointer"
      >
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />

        {/* NEM Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="px-2.5 py-1 bg-[#C5A059] text-white text-[11px] font-extrabold tracking-wider uppercase rounded-none shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.isExpress24h && (
            <span className="px-2 py-0.5 bg-[#111111] text-white text-[10px] font-bold tracking-wider uppercase rounded-none">
              Giao 24h
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-0.5 bg-neutral-800 text-white text-[10px] font-bold tracking-wider uppercase rounded-none">
              MỚI 2026
            </span>
          )}
        </div>

        {/* Action Overlay Buttons (NEM Style) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
          <button
            onClick={() => setQuickViewProduct(product)}
            className="p-2.5 bg-[#FAF6F0] text-[#111111] hover:bg-[#111111] hover:text-white border border-[#E5DECE] shadow-md transition-all cursor-pointer"
            title="Xem nhanh"
          >
            <Eye className="w-4 h-4" />
          </button>

          {FEATURE_FLAGS.ENABLE_AI_TRY_ON && product.hasAiTryOn && (
            <button
              onClick={() => onTryOn && onTryOn(product)}
              className="px-3 py-2 bg-[#C5A059] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#A4813D] shadow-md flex items-center gap-1 transition-all cursor-pointer border-none"
              title="Thử đồ với AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Thử AI</span>
            </button>
          )}

          {product.has360View && (
            <button
              onClick={() => onRotate360 && onRotate360(product)}
              className="p-2.5 bg-[#FAF6F0] text-[#111111] hover:bg-[#111111] hover:text-white border border-[#E5DECE] shadow-md transition-all cursor-pointer"
              title="Xem 360°"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Fabric & Rating */}
          <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
            <span className="uppercase tracking-widest font-semibold text-neutral-600">
              {product.fabric || "ÁO DÀI DAIVERSE"}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => setQuickViewProduct(product)}
            className="font-heading font-bold text-sm text-[#111111] group-hover:text-[#C5A059] transition-colors line-clamp-1 cursor-pointer uppercase tracking-wide"
          >
            {product.name}
          </h3>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E5DECE]">
          <div>
            <span className="font-heading font-bold text-base text-[#C5A059]">
              {product.formattedPrice}
            </span>
            {product.formattedOriginalPrice && (
              <span className="text-xs text-neutral-400 line-through ml-2">
                {product.formattedOriginalPrice}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2 bg-[#111111] text-white hover:bg-[#C5A059] transition-all cursor-pointer border-none"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

