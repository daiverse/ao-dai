import React, { useState, useEffect } from "react";
import { RotateCcw, Info, Sparkles, MoveHorizontal, Play, Pause, Compass, Eye, Layers, ChevronRight, X } from "lucide-react";
import { PRODUCTS } from "../../data/products";

export default function Interactive360Preview({ onNavigateTo360 }) {
  // Lấy các sản phẩm có ảnh 360 hoặc danh sách sản phẩm nổi bật
  const productsWith360 = PRODUCTS.filter((p) => p.images360 && p.images360.length > 0);
  const availableProducts = productsWith360.length > 0 ? productsWith360 : PRODUCTS.slice(0, 4);
  
  const [selectedProduct, setSelectedProduct] = useState(availableProducts[0]);
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
    <section className="py-20 lg:py-28 bg-[#0D0C0A] text-white relative overflow-hidden select-none border-b border-[#C5A059]/20">
      {/* Background Luxury Glowing Orbs & Ambient Noise Grid */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#A4813D]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container-page relative z-10">
        
        {/* Section Top Tagline & Product Switcher */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#C5A059] text-[11px] font-extrabold uppercase tracking-widest backdrop-blur-md shadow-sm">
              <RotateCcw className="w-3.5 h-3.5 animate-spin text-[#C5A059]" style={{ animationDuration: "10s" }} />
              <span>ÁO DÀI DAIVERSE 360° LUXURY EXPERIENCE</span>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white uppercase tracking-wide">
                CHI TIẾT 360° <br />
                <span className="bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#E6C687] bg-clip-text text-transparent">
                  GẤM LỤA THỦ CÔNG
                </span>
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[#C5A059] to-transparent rounded-full mt-3"></div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
              Xoay và tương tác 4 góc chụp 360° thực tế (Mặt trước, sườn phải, mặt lưng và sườn trái) để cảm nhận độ rủ của tà áo, đường may giấu chỉ và họa tiết dệt gấm trúc nổi tinh xảo.
            </p>

            {/* Interactive Product Selector Pills */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#C5A059] block">
                CHỌN MẪU ÁO DÀI XEM 360°:
              </span>
              <div className="flex flex-wrap gap-2">
                {availableProducts.map((prod) => {
                  const isSelected = selectedProduct.id === prod.id;
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => {
                        setSelectedProduct(prod);
                        setRotationAngle(0);
                        setActiveHotspot(null);
                      }}
                      className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-none border ${
                        isSelected
                          ? "bg-[#C5A059] text-white border-[#C5A059] shadow-lg shadow-[#C5A059]/20"
                          : "bg-[#1A1815] text-neutral-300 border-[#C5A059]/30 hover:border-[#C5A059] hover:text-white"
                      }`}
                    >
                      {prod.name.replace("Áo Dài Gấm Tơ ", "").replace("Áo Dài ", "")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Angle Controls Box */}
            <div className="p-5 bg-[#161412] border border-[#C5A059]/25 shadow-xl space-y-4 relative backdrop-blur-md">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-200 uppercase tracking-wider border-b border-[#C5A059]/20 pb-2.5">
                <span className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#C5A059]" />
                  GÓC QUAN SÁT HIỆN TẠI:
                </span>
                <span className="text-[#C5A059] font-mono font-bold text-base px-2.5 py-0.5 bg-[#C5A059]/10 border border-[#C5A059]/30">
                  {Math.round(rotationAngle)}°
                </span>
              </div>

              {/* 4 Directional Preset Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { angle: 0, label: "Mặt Trước" },
                  { angle: 90, label: "Sườn Phải" },
                  { angle: 180, label: "Mặt Sau" },
                  { angle: 270, label: "Sườn Trái" },
                ].map((btn) => {
                  const isActive = currentFrame.angle === btn.angle;
                  return (
                    <button
                      key={btn.angle}
                      type="button"
                      onClick={() => {
                        setRotationAngle(btn.angle);
                        setAutoRotate(false);
                      }}
                      className={`py-2.5 px-1 text-[11px] font-extrabold uppercase transition-all cursor-pointer text-center border ${
                        isActive
                          ? "bg-[#C5A059] text-white border-[#C5A059] shadow-md"
                          : "bg-[#221F1B] text-neutral-300 border-[#C5A059]/20 hover:border-[#C5A059]/50 hover:bg-[#2A2722]"
                      }`}
                    >
                      {btn.label}
                    </button>
                  );
                })}
              </div>

              {/* Angle Slider Bar */}
              <div className="pt-1">
                <input
                  type="range"
                  min="0"
                  max="359"
                  value={Math.round(rotationAngle)}
                  onChange={(e) => {
                    setRotationAngle(Number(e.target.value));
                    setAutoRotate(false);
                  }}
                  className="w-full h-1.5 bg-[#2A2722] rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
                />
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigateTo360 && onNavigateTo360()}
                className="flex-1 min-w-[200px] py-4 bg-[#C5A059] hover:bg-[#A4813D] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer border-none shadow-xl shadow-[#C5A059]/20 hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4" />
                <span>VÀO PHÒNG 360° CHI TIẾT</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                className={`py-4 px-6 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer border ${
                  autoRotate
                    ? "bg-white text-[#111111] border-white shadow-lg"
                    : "bg-[#1A1815] text-white border-[#C5A059]/40 hover:border-[#C5A059] hover:bg-[#25221E]"
                }`}
              >
                {autoRotate ? <Pause className="w-4 h-4 text-[#111111]" /> : <Play className="w-4 h-4 text-[#C5A059]" />}
                <span>{autoRotate ? "DỪNG XOAY" : "TỰ XOAY 360°"}</span>
              </button>
            </div>
          </div>

          {/* Right 360 Interactive Canvas Showcase Stage */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div
              className="relative w-full max-w-lg aspect-[3/4] bg-[#161412] border-2 border-[#C5A059]/40 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-grab active:cursor-grabbing group transition-all duration-300"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
            >
              {/* Main 360 Angle Image */}
              <img
                src={currentFrame.url}
                alt={selectedProduct.name}
                className="w-full h-full object-cover pointer-events-none transition-all duration-300 group-hover:scale-105"
              />

              {/* Ambient Image Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

              {/* Top Left Live Angle Badge */}
              <div className="absolute top-4 left-4 px-3.5 py-1.5 bg-[#0D0C0A]/90 text-white text-[11px] font-bold uppercase tracking-wider border border-[#C5A059]/40 backdrop-blur-md flex items-center gap-2 shadow-lg">
                <Compass className="w-4 h-4 text-[#C5A059]" />
                <span>{selectedProduct.name}</span>
                <span className="text-[#C5A059] font-mono">({currentFrame.label})</span>
              </div>

              {/* Top Right Live Degree Readout */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-[#C5A059] text-white text-xs font-mono font-black shadow-lg">
                {Math.round(rotationAngle)}°
              </div>

              {/* Hotspots Interactive Pins */}
              {selectedProduct.hotspots &&
                selectedProduct.hotspots.map((hs, idx) => (
                  <div
                    key={idx}
                    className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: hs.x, top: hs.y }}
                  >
                    {/* Pulsing Radar Ring */}
                    <span className="absolute inset-0 rounded-full bg-[#C5A059] opacity-75 animate-ping"></span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspot(activeHotspot === idx ? null : idx);
                      }}
                      className="relative w-8 h-8 rounded-full bg-[#C5A059] text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer border-2 border-white"
                      title={hs.title}
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    {/* Hotspot Glassmorphism Popup */}
                    {activeHotspot === idx && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-60 p-4 bg-[#181614]/95 text-white shadow-2xl border border-[#C5A059] z-30 text-xs animate-fade-in backdrop-blur-md">
                        <div className="flex items-center justify-between border-b border-[#C5A059]/30 pb-1.5 mb-1.5">
                          <h4 className="font-heading font-black text-[#C5A059] uppercase text-xs flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>{hs.title}</span>
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveHotspot(null);
                            }}
                            className="p-0.5 text-neutral-400 hover:text-white bg-transparent border-none cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-neutral-300 leading-relaxed font-normal text-[11px]">
                          {hs.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

              {/* Bottom Drag Instruction Bar */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 bg-[#0D0C0A]/90 border border-[#C5A059]/40 backdrop-blur-md text-[11px] font-bold text-white uppercase tracking-widest flex items-center gap-2 pointer-events-none shadow-xl">
                <MoveHorizontal className="w-4 h-4 text-[#C5A059] animate-pulse" />
                <span>KÉO CHUỘT / VẬY NÓN ĐỂ XOAY 360°</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

