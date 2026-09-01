import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  RotateCcw,
  Sparkles,
  MoveHorizontal,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Compass,
  Info,
  Upload,
  Camera,
  Wand2,
  CheckCircle2,
  AlertCircle,
  Download,
  RefreshCw,
  X,
  ChevronRight,
  Shirt,
} from "lucide-react";
import { PRODUCTS } from "../data/products";
import { FEATURE_FLAGS } from "../config/featureFlags";
import { API_BASE_URL } from "../config/api";

// ── Virtual Try-On Panel ─────────────────────────────────────────────────────
const LOADING_STEPS = [
  { label: "Đang kết nối đến dịch vụ AI...", minProgress: 0, icon: "🔗" },
  { label: "Đang khởi động tiến trình AI...", minProgress: 10, icon: "🌡️" },
  { label: "Đang tải ảnh sản phẩm lên...", minProgress: 25, icon: "👗" },
  { label: "Đang phân tích vóc dáng của bạn...", minProgress: 40, icon: "🔍" },
  { label: "AI đang ghép áo dài chuẩn phom...", minProgress: 55, icon: "✨" },
  { label: "Tinh chỉnh nếp gấp & màu sắc...", minProgress: 75, icon: "🎨" },
  { label: "Hoàn thiện và xuất kết quả...", minProgress: 88, icon: "📸" },
];

function VirtualTryOnPanel({ selectedProduct }) {
  const [personImage, setPersonImage] = useState(null); // { file, previewUrl }
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [resultImage, setResultImage] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const fileInputRef = useRef(null);
  const progressInterval = useRef(null);
  const stepInterval = useRef(null);

  const garmentImageUrl =
    selectedProduct?.images360?.[0]?.url || selectedProduct?.images?.[0];

  useEffect(() => {
    setResultImage(null);
    setStatus("idle");
    setErrorMsg("");
  }, [selectedProduct?.id]);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Vui lòng chọn tệp ảnh hợp lệ (JPG, PNG, WEBP).");
      setStatus("error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 10MB.");
      setStatus("error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPersonImage({ file, previewUrl: e.target.result, base64: e.target.result });
      setStatus("idle");
      setResultImage(null);
      setErrorMsg("");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const startFakeProgress = () => {
    setProgress(0);
    setLoadingStep(0);
    let p = 0;

    progressInterval.current = setInterval(() => {
      p += Math.random() * 2.5 + 0.5;
      if (p >= 90) { p = 90; clearInterval(progressInterval.current); }
      setProgress(Math.round(p));
    }, 1500);

    const stepTimes = [0, 3000, 8000, 18000, 35000, 60000, 100000];
    stepTimes.forEach((delay, idx) => {
      setTimeout(() => setLoadingStep(idx), delay);
    });
  };

  const stopFakeProgress = (success = true) => {
    clearInterval(progressInterval.current);
    clearInterval(stepInterval.current);
    setProgress(success ? 100 : 0);
    if (success) setLoadingStep(LOADING_STEPS.length - 1);
  };

  const handleTryOn = async () => {
    if (!personImage) {
      setErrorMsg("Vui lòng tải lên ảnh của bạn trước.");
      setStatus("error");
      return;
    }
    if (!garmentImageUrl) {
      setErrorMsg("Không tìm thấy ảnh sản phẩm. Vui lòng chọn mẫu khác.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    setResultImage(null);
    startFakeProgress();

    const fullGarmentUrl = garmentImageUrl?.startsWith("http")
      ? garmentImageUrl
      : typeof window !== "undefined"
      ? `${window.location.origin}${garmentImageUrl}`
      : garmentImageUrl;

    try {
      let response = await fetch(`${API_BASE_URL}/api/ai/tryon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personImageBase64: personImage.base64,
          garmentImageUrl: fullGarmentUrl,
        }),
      });

      if (response.status === 502 || response.status === 503) {
        await new Promise((r) => setTimeout(r, 4000));
        response = await fetch(`${API_BASE_URL}/api/ai/tryon`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            personImageBase64: personImage.base64,
            garmentImageUrl: fullGarmentUrl,
          }),
        });
      }

      if (response.status === 413) {
        throw new Error("Ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 10MB.");
      }

      let data;
      try {
        data = await response.json();
      } catch (_) {
        throw new Error(`Lỗi máy chủ (${response.status}). Vui lòng thử lại sau.`);
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Xử lý thất bại. Vui lòng thử lại.");
      }

      stopFakeProgress(true);
      setResultImage(data.resultImageBase64);
      setStatus("success");
    } catch (err) {
      console.error("[Virtual Try-On] Lỗi:", err);
      stopFakeProgress(false);

      let friendlyMsg = err.message || "Lỗi kết nối. Vui lòng thử lại.";
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        friendlyMsg = "Không thể kết nối đến máy chủ AI API. Vui lòng thử lại sau ít phút.";
      }

      setErrorMsg(friendlyMsg);
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const a = document.createElement("a");
    a.href = resultImage;
    a.download = `DaiVerse-Fashion-TryOn-${selectedProduct?.name || "result"}.png`;
    a.click();
  };

  const handleReset = () => {
    setPersonImage(null);
    setResultImage(null);
    setStatus("idle");
    setErrorMsg("");
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="mt-12 relative">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059] text-white text-[10px] font-extrabold uppercase tracking-widest mb-2">
          <Wand2 className="w-4 h-4 text-white" />
          <span>DaiVerse AI VIRTUAL TRY-ON</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#111111] uppercase tracking-wide">
          THỬ ĐỒ ẢO CÙNG <span className="text-[#C5A059]">DaiVerse AI</span>
        </h2>
        <p className="text-neutral-600 mt-2 text-xs sm:text-sm max-w-lg mx-auto font-normal">
          Tải ảnh cá nhân để AI ghép phom dáng Áo Dài trực tiếp trên hình thể của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="bg-neutral-50 border border-neutral-300 p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#111111] text-white flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111111]">
              1. ẢNH CỦA BẠN
            </h3>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !personImage && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed transition-all duration-300 overflow-hidden aspect-[3/4] w-full ${
              personImage
                ? "border-[#111111] cursor-default"
                : "border-neutral-300 hover:border-[#111111] bg-white cursor-pointer"
            }`}
          >
            {personImage ? (
              <>
                <img
                  src={personImage.previewUrl}
                  alt="Ảnh của bạn"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="px-3 py-1.5 bg-white text-[#111111] font-bold text-xs uppercase tracking-wider cursor-pointer border-none"
                  >
                    Đổi ảnh
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleReset(); }}
                    className="px-3 py-1.5 bg-[#C5A059] text-white font-bold text-xs uppercase tracking-wider cursor-pointer border-none"
                  >
                    Xóa
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center gap-2">
                <Upload className="w-8 h-8 text-neutral-400" />
                <p className="font-bold text-xs text-[#111111] uppercase">Kéo & thả ảnh vào đây</p>
                <p className="text-neutral-500 text-[11px]">hoặc bấm để tải ảnh lên (JPG, PNG, WEBP)</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-5 py-4">
          <div className="text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-[#111111] text-white inline-block mb-2">
              SẢN PHẨM LỰA CHỌN
            </span>
            <div className="w-32 h-44 border-2 border-[#111111] mx-auto overflow-hidden bg-white">
              {garmentImageUrl && (
                <img
                  src={garmentImageUrl}
                  alt={selectedProduct?.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <p className="font-heading font-black text-xs uppercase text-[#111111] mt-2 max-w-[180px] mx-auto">
              {selectedProduct?.name}
            </p>
            <p className="text-xs font-bold text-[#C5A059]">{selectedProduct?.formattedPrice}</p>
          </div>

          <button
            type="button"
            onClick={handleTryOn}
            disabled={status === "loading" || !personImage}
            className={`w-full py-3.5 px-6 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 border-none cursor-pointer transition-all ${
              status === "loading"
                ? "bg-neutral-400 text-white cursor-not-allowed"
                : !personImage
                ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                : "bg-[#111111] hover:bg-[#C5A059] text-white shadow-md"
            }`}
          >
            {status === "loading" ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang ghép ảnh AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>BẮT ĐẦU THỬ ĐỒ AI</span>
              </>
            )}
          </button>

          {status === "loading" && (
            <div className="w-full space-y-2 text-center">
              <p className="text-[11px] text-[#C5A059] font-bold uppercase">
                {LOADING_STEPS[loadingStep]?.label}
              </p>
              <div className="w-full h-1.5 bg-neutral-200">
                <div className="h-full bg-[#C5A059] transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {errorMsg && (
            <p className="text-xs text-[#C5A059] font-semibold text-center">⚠️ {errorMsg}</p>
          )}
        </div>

        <div className="bg-neutral-50 border border-neutral-300 p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#111111] text-white flex items-center justify-center">
              <Shirt className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#111111]">
              2. KẾT QUẢ VIRTUAL TRY-ON
            </h3>
          </div>

          <div
            className="relative border-2 border-dashed border-neutral-300 overflow-hidden flex items-center justify-center bg-white aspect-[3/4] w-full"
          >
            {resultImage ? (
              <img
                src={resultImage}
                alt="Kết quả Virtual Try-On"
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="text-center p-6 space-y-2">
                <Sparkles className="w-8 h-8 text-neutral-400 mx-auto" />
                <p className="text-neutral-500 font-bold text-xs uppercase">Chưa có kết quả</p>
              </div>
            )}
          </div>

          {resultImage && (
            <button
              type="button"
              onClick={handleDownload}
              className="w-full py-3 bg-[#111111] hover:bg-[#C5A059] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border-none"
            >
              TẢI MẪU ẢNH VỀ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Product360Page() {
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeHotspot, setActiveHotspot] = useState(null);

  const containerRef = useRef(null);

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
    <div className="pt-32 sm:pt-36 pb-20 bg-[#FAF6F0] min-h-screen text-[#111111] relative select-none">
      <div className="container-page relative z-10">

        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059] text-white text-[10px] font-extrabold uppercase tracking-widest mb-3">
            <RotateCcw className="w-3.5 h-3.5 text-white animate-spin" style={{ animationDuration: "10s" }} />
            <span>DaiVerse FASHION 360° EXPERIENCE</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black leading-tight text-[#111111] uppercase tracking-wide">
            PHÒNG XEM ÁO DÀI <span className="text-[#C5A059]">360 ĐỘ</span>
          </h1>
          <p className="text-neutral-600 mt-2 text-xs sm:text-sm max-w-xl mx-auto font-normal">
            Khám phá chi tiết phom dáng, chất liệu gấm lụa cao cấp với công nghệ xoay 360° thực tế.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 flex flex-col items-center">
            <div
              ref={containerRef}
              className="relative w-full max-w-lg aspect-[3/4] bg-neutral-900 border border-neutral-300 overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing group"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
            >
              <img
                src={currentFrame.url}
                alt={selectedProduct.name}
                className="w-full h-full object-cover pointer-events-none transition-all duration-300"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "center center",
                }}
              />

              <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#111111]/90 text-white border border-neutral-700 text-xs">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#C5A059]" />
                  <span>{selectedProduct.name}</span>
                </p>
                <p className="text-neutral-400 font-semibold text-[11px] mt-0.5">
                  Góc quan sát: <span className="text-white font-bold">{currentFrame.label}</span>
                </p>
              </div>

              <div className="absolute top-4 right-4 px-3 py-1 bg-[#C5A059] text-white text-xs font-mono font-bold">
                {Math.round(rotationAngle)}°
              </div>

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
                      className="relative w-7 h-7 bg-[#C5A059] text-white flex items-center justify-center shadow-xl hover:scale-110 transition-all cursor-pointer border-none"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    {activeHotspot === idx && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-white text-[#111111] shadow-2xl border border-neutral-300 z-30 text-xs animate-fade-in">
                        <h4 className="font-black text-[#C5A059] font-heading uppercase text-xs flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>{hs.title}</span>
                        </h4>
                        <p className="text-neutral-600 mt-1 leading-snug text-[11px]">
                          {hs.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#111111]/90 border border-neutral-700 text-xs text-white uppercase tracking-wider flex items-center gap-2 pointer-events-none">
                <MoveHorizontal className="w-4 h-4 text-[#C5A059]" />
                <span>KÉO CHUỘT ĐỂ XOAY 360°</span>
              </div>
            </div>

            <div className="w-full max-w-lg mt-4 bg-neutral-50 p-3 border border-neutral-300 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-none ${
                  autoRotate
                    ? "bg-[#C5A059] text-white"
                    : "bg-[#111111] text-white"
                }`}
              >
                {autoRotate ? "TẠM DỪNG TỰ XOAY" : "TỰ ĐỘNG XOAY 360°"}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(1, z - 0.2))}
                  className="p-1.5 bg-white border border-neutral-300 text-neutral-800 cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold text-[#111111] px-2">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(2, z + 0.2))}
                  className="p-1.5 bg-white border border-neutral-300 text-neutral-800 cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-neutral-50 border border-neutral-300 p-5 space-y-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C5A059] font-extrabold block mb-1">
                BỘ SƯU TẬP 360°
              </span>
              <h3 className="font-heading font-black text-lg text-[#111111] uppercase">
                CHỌN MẪU TRẢI NGHIỆM
              </h3>
            </div>

            <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
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
                      setActiveHotspot(null);
                    }}
                    className={`w-full p-2.5 border flex items-center gap-3 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#111111] bg-white font-bold"
                        : "border-neutral-200 bg-neutral-100 hover:border-neutral-400"
                    }`}
                  >
                    <img
                      src={prod.images360?.[0]?.url || prod.images[0]}
                      alt={prod.name}
                      className="w-12 h-16 object-cover rounded-xl shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-xs text-gray-900 truncate">
                          {prod.name}
                        </p>
                        {prod.images360 && (
                          <span className="bg-[#C5A059] text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                            3D
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                        {prod.fabric}
                      </p>
                      <p className="text-xs font-bold text-[#C5A059] mt-1">
                        {prod.formattedPrice}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Try-On teaser badge */}
            {FEATURE_FLAGS.ENABLE_AI_TRY_ON && (
              <div className="flex items-center gap-2 p-3 bg-[#EBE9E1] border border-gray-200 rounded-xl">
                <Wand2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                <p className="text-[11px] text-gray-600 leading-snug">
                  Cuộn xuống để thử{" "}
                  <span className="text-[#C5A059] font-bold">
                    Virtual Try-On AI
                  </span>{" "}
                  với mẫu đang chọn
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Virtual Try-On Section ── */}
        {FEATURE_FLAGS.ENABLE_AI_TRY_ON && (
          <>
            {/* Divider */}
            <div className="my-12 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300" />
              <div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-200 rounded-full shadow-xs">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span className="text-[#C5A059] text-xs font-bold uppercase tracking-wider">
                  AI Virtual Try-On
                </span>
              </div>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <VirtualTryOnPanel selectedProduct={selectedProduct} />
          </>
        )}
      </div>
    </div>
  );
}
