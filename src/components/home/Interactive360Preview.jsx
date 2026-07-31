import React, { useState } from "react";
import { RotateCcw, Info, Sparkles, MoveHorizontal } from "lucide-react";
import { PRODUCTS } from "../../data/products";

export default function Interactive360Preview({ onNavigateTo360 }) {
  const selectedProduct = PRODUCTS.find((p) => p.has360View) || PRODUCTS[0];
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState(null);

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
    <section className="py-20 bg-[#18392B] text-white relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C85A32]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container-page relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C85A32]/20 border border-[#C85A32]/40 text-[#D4A373] text-xs font-semibold uppercase tracking-wider">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Trải Nghiệm 3D 360°</span>
            </div>

            <h2 className="font-heading text-4xl sm:text-5xl font-bold leading-tight">
              Chi tiết từng <span className="text-[#D4A373] italic">thớ lụa & đường thêu</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Xoay và tương tác góc nhìn 360° thực tế để cảm nhận độ rủ của tà áo, đường may giấu chỉ và họa tiết dệt gấm nổi tinh xảo.
            </p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-[#D4A373] font-semibold text-sm">
                <MoveHorizontal className="w-4 h-4" />
                <span>Hướng dẫn: Kéo chuột trái hoặc chạm vuốt màn hình để xoay</span>
              </div>
              <p className="text-xs text-gray-400">
                Nhấp vào các điểm đánh dấu (hotspot) để xem cận cảnh nghệ thuật may đo thủ công.
              </p>
            </div>

            <button
              onClick={() => onNavigateTo360 && onNavigateTo360()}
              className="px-8 py-4 bg-[#C85A32] text-white rounded-full font-bold hover:bg-[#C85A32]/90 shadow-xl shadow-[#C85A32]/30 flex items-center gap-2 transition-all cursor-pointer text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Khám Phá Phòng 360° Đầy Đủ</span>
            </button>
          </div>

          {/* Right 360 Canvas Viewer */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div 
              className="relative w-full max-w-md aspect-[3/4] bg-white/5 rounded-3xl border border-white/15 overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
            >
              {/* Product Image with rotation transform simulation */}
              <img
                src={selectedProduct.images[0]}
                alt="360 view Áo Dài"
                className="w-full h-full object-cover pointer-events-none transition-transform duration-75"
                style={{
                  transform: `scale(1.05) rotateY(${rotationAngle * 0.15}deg)`,
                  filter: `brightness(${1 + Math.sin((rotationAngle * Math.PI) / 180) * 0.05})`
                }}
              />

              {/* Angle indicator badge */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-mono text-white/80 border border-white/20">
                Góc: {Math.round(rotationAngle)}°
              </div>

              {/* Hotspots */}
              {selectedProduct.hotspots && selectedProduct.hotspots.map((hs, idx) => (
                <div
                  key={idx}
                  className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: hs.x, top: hs.y }}
                >
                  <button
                    onClick={() => setActiveHotspot(activeHotspot === idx ? null : idx)}
                    className="relative w-7 h-7 rounded-full bg-[#C85A32] text-white flex items-center justify-center shadow-lg hover:scale-125 transition-transform animate-bounce"
                  >
                    <Info className="w-4 h-4" />
                    <span className="absolute inset-0 rounded-full bg-[#C85A32] animate-ping opacity-75"></span>
                  </button>

                  {/* Hotspot Popup */}
                  {activeHotspot === idx && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-100 z-30 text-xs animate-fade-in">
                      <h4 className="font-bold text-[#18392B] font-heading">{hs.title}</h4>
                      <p className="text-gray-600 mt-1 leading-snug">{hs.description}</p>
                    </div>
                  )}
                </div>
              ))}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-xs text-white/90 flex items-center gap-2 border border-white/20">
                <MoveHorizontal className="w-4 h-4 text-[#D4A373] animate-pulse" />
                <span>Kéo để xoay 360°</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
