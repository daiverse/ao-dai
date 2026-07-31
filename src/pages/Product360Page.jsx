import React, { useState } from "react";
import { RotateCcw, Sparkles, MoveHorizontal, Info } from "lucide-react";
import { PRODUCTS } from "../data/products";

export default function Product360Page({ onTryOn }) {
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX || (e.touches && e.touches[0].clientX));
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX);
    const deltaX = currentX - startX;
    setRotationAngle((prev) => (prev + deltaX * 0.5 + 360) % 360);
    setStartX(currentX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="pt-28 pb-20 bg-[#18392B] min-h-screen text-white">
      <div className="container-page">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C85A32]/20 border border-[#C85A32]/40 text-[#D4A373] text-xs font-semibold uppercase tracking-wider mb-3">
            <RotateCcw className="w-4 h-4" />
            <span>Phòng Trải Nghiệm 360° Studio</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight">
            Xoay & Ngắm Chi Tiết <span className="text-[#D4A373] italic">Áo Dài 3D</span>
          </h1>
          <p className="text-gray-300 mt-3 text-sm sm:text-base">
            Quan sát toàn bộ góc nhìn 360 độ từ tà trước, tà sau đến chi tiết cổ áo & chất liệu gấm dệt.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main 360 Canvas */}
          <div className="lg:col-span-8 flex flex-col items-center">
            <div
              className="relative w-full max-w-lg aspect-[3/4] bg-white/5 rounded-3xl border border-white/20 overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
            >
              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.name}
                className="w-full h-full object-cover pointer-events-none transition-transform duration-75"
                style={{
                  transform: `scale(1.05) rotateY(${rotationAngle * 0.15}deg)`,
                  filter: `brightness(${1 + Math.sin((rotationAngle * Math.PI) / 180) * 0.05})`
                }}
              />

              <div className="absolute top-4 left-4 px-4 py-2 bg-black/60 backdrop-blur-md rounded-2xl border border-white/20 text-xs">
                <p className="font-bold text-[#D4A373]">{selectedProduct.name}</p>
                <p className="text-gray-300">{selectedProduct.fabric}</p>
              </div>

              <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-mono text-white/80 border border-white/20">
                {Math.round(rotationAngle)}°
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-black/60 backdrop-blur-md rounded-full text-xs text-white flex items-center gap-2 border border-white/20">
                <MoveHorizontal className="w-4 h-4 text-[#D4A373] animate-pulse" />
                <span>Nhấn giữ & Rê chuột để xoay 360°</span>
              </div>
            </div>
          </div>

          {/* Model Selector List Right */}
          <div className="lg:col-span-4 bg-white/5 border border-white/15 p-6 rounded-3xl space-y-4">
            <h3 className="font-heading font-bold text-xl text-[#D4A373]">
              Chọn Mẫu Khác Để Xem 360°
            </h3>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {PRODUCTS.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => { setSelectedProduct(prod); setRotationAngle(0); }}
                  className={`w-full p-3 rounded-2xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
                    selectedProduct.id === prod.id
                      ? "border-[#C85A32] bg-[#C85A32]/20"
                      : "border-white/10 hover:bg-white/10"
                  }`}
                >
                  <img src={prod.images[0]} alt={prod.name} className="w-12 h-16 object-cover rounded-xl shrink-0" />
                  <div>
                    <p className="font-semibold text-xs text-white line-clamp-1">{prod.name}</p>
                    <p className="text-[11px] text-gray-300 mt-0.5">{prod.fabric}</p>
                    <p className="text-xs font-bold text-[#D4A373] mt-1">{prod.formattedPrice}</p>
                  </div>
                </button>
              ))}
            </div>

            {selectedProduct.hasAiTryOn && (
              <button
                onClick={() => onTryOn && onTryOn(selectedProduct)}
                className="w-full py-3.5 bg-[#C85A32] text-white rounded-xl font-bold hover:bg-[#C85A32]/90 flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer text-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>Thử Mẫu Này Trong Phòng Xem Đồ AI</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
