import React, { useState, useEffect } from "react";
import { RotateCcw, Info, Sparkles, MoveHorizontal, Play, Pause, Compass } from "lucide-react";
import { PRODUCTS } from "../../data/products";

export default function Interactive360Preview({ onNavigateTo360 }) {
  const selectedProduct = PRODUCTS.find((p) => p.images360) || PRODUCTS[0];
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [autoRotate, setAutoRotate] = useState(false);

  // Auto-rotate 360 loop
  useEffect(() => {
    let animationFrame;
    if (autoRotate && !isDragging) {
      const rotate = () => {
        setRotationAngle((prev) => (prev + 0.8) % 360);
        animationFrame = requestAnimationFrame(rotate);
      };
      animationFrame = requestAnimationFrame(rotate);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [autoRotate, isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX || (e.touches && e.touches[0].clientX));
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX);
    const deltaX = currentX - startX;
    setRotationAngle((prev) => (prev + deltaX * 0.75 + 360) % 360);
    setStartX(currentX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Helper tính toán ảnh tương ứng theo góc xoay (0, 90, 180, 270)
  const getCurrentFrame = (product, angle) => {
    if (!product.images360 || product.images360.length === 0) {
      return { url: product.images[0], label: "Góc Tiêu Chuẩn", angle: 0 };
    }

    const norm = ((angle % 360) + 360) % 360;

    if (norm >= 45 && norm < 135) {
      return product.images360[1] || { url: product.images[0], label: "Sườn Phải (90°)", angle: 90 };
    } else if (norm >= 135 && norm < 225) {
      return product.images360[2] || { url: product.images[0], label: "Mặt Sau (180°)", angle: 180 };
    } else if (norm >= 225 && norm < 315) {
      return product.images360[3] || { url: product.images[0], label: "Sườn Trái (270°)", angle: 270 };
    }
    return product.images360[0] || { url: product.images[0], label: "Mặt Trước (0°)", angle: 0 };
  };

  const currentFrame = getCurrentFrame(selectedProduct, rotationAngle);

  return (
    <section className="py-20 bg-[#13110C] text-white relative overflow-hidden select-none">
      {/* Decorative background glow circles */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E43D12]/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#EFB11D]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container-page relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E43D12]/20 border border-[#E43D12]/50 text-[#EFB11D] text-xs font-semibold uppercase tracking-wider">
              <RotateCcw className="w-3.5 h-3.5 animate-spin text-[#EFB11D]" style={{ animationDuration: "12s" }} />
              <span>Trải Nghiệm 3D 360° Thực Tế</span>
            </div>

            <h2 className="font-heading text-4xl sm:text-5xl font-bold leading-tight text-white">
              Chi tiết từng <span className="text-[#EFB11D] italic font-heading">thớ lụa & đường thêu</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Xoay và tương tác 4 góc chụp 360° thực tế (Mặt trước, sườn phải, mặt lưng và sườn trái) để cảm nhận độ rủ của tà áo, đường may giấu chỉ và họa tiết dệt gấm trúc nổi tinh xảo.
            </p>

            {/* Quick Angle Buttons */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#EFB11D]">
                <span>Chuyển Góc Chụp 360:</span>
                <span className="text-amber-200/90 font-mono">{Math.round(rotationAngle)}°</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { angle: 0, label: "Mặt Trước" },
                  { angle: 90, label: "Sườn Phải" },
                  { angle: 180, label: "Mặt Sau" },
                  { angle: 270, label: "Sườn Trái" },
                ].map((btn) => (
                  <button
                    key={btn.angle}
                    type="button"
                    onClick={() => {
                      setRotationAngle(btn.angle);
                      setAutoRotate(false);
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer text-center border ${
                      currentFrame.angle === btn.angle
                        ? "bg-[#E43D12] text-white border-[#E43D12] shadow-lg shadow-[#E43D12]/40 scale-[1.02]"
                        : "bg-white/10 text-white/90 border-white/15 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigateTo360 && onNavigateTo360()}
                className="px-7 py-3.5 bg-[#E43D12] text-white rounded-full font-bold hover:bg-[#E43D12]/90 shadow-xl shadow-[#E43D12]/30 flex items-center gap-2 transition-all cursor-pointer text-xs border-none"
              >
                <Sparkles className="w-4 h-4" />
                <span>Khám Phá Phòng 360° Đầy Đủ</span>
              </button>

              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-5 py-3.5 rounded-full font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border ${
                  autoRotate
                    ? "bg-[#EFB11D] text-gray-950 border-[#EFB11D] shadow-lg shadow-[#EFB11D]/30"
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30 backdrop-blur-sm"
                }`}
              >
                {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{autoRotate ? "Dừng xoay" : "Tự xoay 360°"}</span>
              </button>
            </div>
          </div>

          {/* Right 360 Canvas Viewer */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div
              className="relative w-full max-w-md aspect-[3/4] bg-gradient-to-b from-[#EFB11D] to-[#0D1F17] rounded-3xl border border-white/15 overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing group"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
            >
              {/* 360 Angle Image */}
              <img
                src={currentFrame.url}
                alt="360 view Áo Dài"
                className="w-full h-full object-cover pointer-events-none transition-all duration-300"
              />

              {/* Angle Indicator Badge */}
              <div className="absolute top-4 left-4 px-3.5 py-1.5 bg-black/60 backdrop-blur-md rounded-2xl text-xs font-semibold text-white/90 border border-white/20 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#EFB11D]" />
                <span>{currentFrame.label}</span>
              </div>

              <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-mono text-[#EFB11D] border border-white/20 font-bold">
                {Math.round(rotationAngle)}°
              </div>

              {/* Hotspots */}
              {selectedProduct.hotspots &&
                selectedProduct.hotspots.map((hs, idx) => (
                  <div
                    key={idx}
                    className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: hs.x, top: hs.y }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspot(activeHotspot === idx ? null : idx);
                      }}
                      className="relative w-7 h-7 rounded-full bg-[#E43D12] text-white flex items-center justify-center shadow-lg hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Info className="w-4 h-4" />
                      <span className="absolute inset-0 rounded-full bg-[#E43D12] animate-ping opacity-75"></span>
                    </button>

                    {/* Hotspot Popup */}
                    {activeHotspot === idx && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-100 z-30 text-xs animate-fadeIn">
                        <h4 className="font-bold text-[#E43D12] font-heading">{hs.title}</h4>
                        <p className="text-gray-600 mt-1 leading-snug">{hs.description}</p>
                      </div>
                    )}
                  </div>
                ))}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-xs text-white/90 flex items-center gap-2 border border-white/20 pointer-events-none">
                <MoveHorizontal className="w-4 h-4 text-[#EFB11D] animate-pulse" />
                <span>Kéo rê chuột để xoay 360°</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
