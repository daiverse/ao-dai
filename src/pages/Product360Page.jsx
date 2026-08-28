import React, { useState, useEffect, useRef } from "react";
import {
  RotateCcw,
  Sparkles,
  MoveHorizontal,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  Compass,
  Eye,
  Info,
} from "lucide-react";
import { PRODUCTS } from "../data/products";
import { FEATURE_FLAGS } from "../config/featureFlags";

export default function Product360Page({ onTryOn }) {
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeHotspot, setActiveHotspot] = useState(null);

  const containerRef = useRef(null);

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

  // Handle Drag / Touch rotation
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

  // Jump trực tiếp đến góc chỉ định
  const handleJumpToAngle = (targetAngle) => {
    setRotationAngle(targetAngle);
    setAutoRotate(false);
  };

  return (
    <div className="pt-28 pb-20 bg-[#C8A800] min-h-screen text-white relative overflow-hidden select-none">
      {/* Dynamic Lighting Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#C8920A]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#E8C55A]/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="container-page relative z-10">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8920A]/20 border border-[#C8920A]/40 text-[#E8C55A] text-xs font-bold uppercase tracking-wider mb-3">
            <RotateCcw className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
            <span>DaiVerse 360° Experience</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold leading-tight">
            Trải Nghiệm Áo Dài 360° <span className="text-[#E8C55A] italic">Cùng DaiVerse</span>
          </h1>
          <p className="text-gray-300 mt-2 text-xs sm:text-sm max-w-xl mx-auto">
            Xoay và khám phá từng chi tiết thiết kế với góc nhìn 360°, mang đến trải nghiệm chân thực trước khi lựa chọn chiếc áo dài phù hợp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main 360 Interactive Viewer Canvas */}
          <div className="lg:col-span-8 flex flex-col items-center">
            <div
              ref={containerRef}
              className="relative w-full max-w-lg aspect-[3/4] bg-gradient-to-b from-[#FFDF00] to-[#0D1F17] rounded-3xl border border-white/20 overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing group"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
            >
              {/* Product 360 Frame Image */}
              <img
                src={currentFrame.url}
                alt={selectedProduct.name}
                className="w-full h-full object-cover pointer-events-none transition-all duration-300"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "center center",
                }}
              />

              {/* Angle Tag Badge Overlay */}
              <div className="absolute top-4 left-4 px-4 py-2 bg-black/70 backdrop-blur-md rounded-2xl border border-white/20 text-xs">
                <p className="font-bold text-[#E8C55A] flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#C8920A]" />
                  <span>{selectedProduct.name}</span>
                </p>
                <p className="text-[#E8C55A] font-semibold text-[11px] mt-0.5">
                  Góc chụp: <span className="text-white font-bold">{currentFrame.label}</span>
                </p>
              </div>

              {/* Digital Compass Degree Indicator */}
              <div className="absolute top-4 right-4 px-3.5 py-1.5 bg-black/70 backdrop-blur-md rounded-full text-xs font-mono font-bold text-[#E8C55A] border border-white/20 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                <span>{Math.round(rotationAngle)}°</span>
              </div>

              {/* Interactive Detail Hotspots */}
              {selectedProduct.hotspots &&
                selectedProduct.hotspots.map((hs, idx) => (
                  <div
                    key={idx}
                    className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                    style={{ left: hs.x, top: hs.y }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspot(activeHotspot === idx ? null : idx);
                      }}
                      className="relative w-8 h-8 rounded-full bg-[#C8920A] text-white flex items-center justify-center shadow-xl hover:scale-125 transition-all cursor-pointer"
                    >
                      <Info className="w-4 h-4" />
                      <span className="absolute inset-0 rounded-full bg-[#C8920A] animate-ping opacity-60"></span>
                    </button>

                    {/* Hotspot Card Popup */}
                    {activeHotspot === idx && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-60 p-3.5 bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-200 z-30 text-xs animate-fadeIn">
                        <h4 className="font-bold text-[#FFDF00] font-heading text-sm flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-[#C8920A]" />
                          <span>{hs.title}</span>
                        </h4>
                        <p className="text-gray-600 mt-1 leading-relaxed text-[11px]">{hs.description}</p>
                      </div>
                    )}
                  </div>
                ))}

              {/* Bottom Drag Instruction Pill */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 backdrop-blur-md rounded-full text-xs text-white flex items-center gap-2 border border-white/20 pointer-events-none">
                <MoveHorizontal className="w-4 h-4 text-[#E8C55A] animate-pulse" />
                <span>Kéo trái / phải để xoay xoay 360°</span>
              </div>
            </div>

            {/* Action Toolbar: Auto Rotate & Zoom */}
            <div className="w-full max-w-lg mt-5 bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    autoRotate
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-white/10 text-gray-200 hover:bg-white/20"
                  }`}
                >
                  {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{autoRotate ? "Tạm Dừng Tự Xoay" : "Tự Động Xoay 360°"}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(1, z - 0.2))}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all cursor-pointer"
                    title="Thu nhỏ"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono font-bold px-2">{Math.round(zoomLevel * 100)}%</span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(2, z + 0.2))}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all cursor-pointer"
                    title="Phóng to soi vải"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          {/* Right Product Selector List */}
          <div className="lg:col-span-4 bg-white/5 border border-white/15 p-6 rounded-3xl space-y-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C8920A] font-bold block mb-1">
                Bộ Sưu Tập Áo Dài 3D
              </span>
              <h3 className="font-heading font-bold text-xl text-[#E8C55A]">
                Chọn Mẫu Trải Nghiệm 360°
              </h3>
            </div>

            <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
              {PRODUCTS.map((prod) => {
                const isSelected = selectedProduct.id === prod.id;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => {
                      setSelectedProduct(prod);
                      setRotationAngle(0);
                      setZoomLevel(1);
                    }}
                    className={`w-full p-3 rounded-2xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#C8920A] bg-[#C8920A]/20 ring-1 ring-[#C8920A]"
                        : "border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <img
                      src={prod.images360?.[0]?.url || prod.images[0]}
                      alt={prod.name}
                      className="w-12 h-16 object-cover rounded-xl shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-xs text-white truncate">{prod.name}</p>
                        {prod.images360 && (
                          <span className="bg-[#C8920A] text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                            3D Studio
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-300 mt-0.5 truncate">{prod.fabric}</p>
                      <p className="text-xs font-bold text-[#E8C55A] mt-1">{prod.formattedPrice}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {FEATURE_FLAGS.ENABLE_AI_TRY_ON && selectedProduct.hasAiTryOn && (
              <button
                type="button"
                onClick={() => onTryOn && onTryOn(selectedProduct)}
                className="w-full py-3.5 bg-[#C8920A] hover:bg-[#C8920A]/90 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer text-xs border-none mt-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Thử Mẫu Này Trong AI Fitting Room</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
