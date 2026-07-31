import React, { useState } from "react";
import { X, Star, Sparkles, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function ProductQuickView({ onNavigateToTryOn }) {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const selectedColor = product.colors ? product.colors[selectedColorIdx] : null;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor?.name);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setQuickViewProduct(null)}
      ></div>

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in border border-gray-100 my-8">
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery Left */}
            <div className="bg-[#FBF9F5] p-6 flex flex-col items-center justify-center relative">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full max-h-[480px] object-cover rounded-2xl shadow-md"
              />
              {product.hasAiTryOn && (
                <button
                  onClick={() => {
                    setQuickViewProduct(null);
                    if (onNavigateToTryOn) onNavigateToTryOn(product);
                  }}
                  className="mt-4 px-6 py-2.5 bg-[#18392B] text-white rounded-full text-xs font-semibold flex items-center gap-2 hover:bg-[#18392B]/90 shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-[#D4A373]" />
                  <span>Xem Trên Người Mẫu AI (Virtual Try-on)</span>
                </button>
              )}
            </div>

            {/* Details Right */}
            <div className="p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs uppercase tracking-widest text-[#C85A32] font-semibold">
                      {product.fabric}
                    </span>
                    {product.isExpress24h && (
                      <span className="px-2.5 py-0.5 bg-amber-100 text-[#C85A32] font-bold text-[10px] rounded-full border border-amber-300 flex items-center gap-1">
                        <span>⚡ May Sẵn & Giao 24H</span>
                      </span>
                    )}
                  </div>
                  <h2 className="font-heading font-bold text-2xl text-gray-900 mt-1">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <div className="flex items-center text-amber-500 font-bold">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1">{product.rating}</span>
                    </div>
                    <span className="text-gray-400">• {product.reviewsCount} Đánh giá từ khách hàng</span>
                  </div>
                </div>

                <div className="text-2xl font-bold font-heading text-[#18392B] flex items-baseline gap-3">
                  <span>{product.formattedPrice}</span>
                  {product.formattedOriginalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {product.formattedOriginalPrice}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Color selection */}
                {product.colors && (
                  <div>
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block mb-2">
                      Màu sắc: <span className="text-[#C85A32]">{selectedColor?.name}</span>
                    </label>
                    <div className="flex gap-2">
                      {product.colors.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedColorIdx(i)}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedColorIdx === i ? "border-[#18392B] scale-110 shadow-md" : "border-gray-200"
                          }`}
                          style={{ backgroundColor: c.code }}
                        >
                          {selectedColorIdx === i && <Check className="w-4 h-4 text-white drop-shadow-xs" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size selection */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Kích thước (Size):
                    </label>
                    <span className="text-xs text-[#C85A32] underline cursor-pointer">Bảng quy đổi size</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                          selectedSize === sz
                            ? "border-[#18392B] bg-[#18392B] text-white shadow-md"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 text-[11px] text-gray-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#18392B]" />
                  <span>100% Chính Hãng</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#18392B]" />
                  <span>Giao Toàn Quốc</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-[#18392B]" />
                  <span>Đổi Size 30 Ngày</span>
                </div>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-[#18392B] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#18392B]/90 shadow-xl shadow-[#18392B]/20 transition-all cursor-pointer text-sm"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Thêm Vào Giỏ Hàng — {product.formattedPrice}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
