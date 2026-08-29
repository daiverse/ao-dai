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
// Các bước xử lý hiển thị cho người dùng
const LOADING_STEPS = [
  { label: "Đang kết nối đến dịch vụ AI...", minProgress: 0, icon: "🔗" },
  { label: "Đang đánh thức AI (cold start)...", minProgress: 10, icon: "🌡️" },
  { label: "Đang tải ảnh áo dài lên...", minProgress: 25, icon: "👗" },
  { label: "Đang phân tích ảnh của bạn...", minProgress: 40, icon: "🔍" },
  { label: "AI đang kết hợp áo dài vào ảnh...", minProgress: 55, icon: "✨" },
  { label: "Đang tinh chỉnh chi tiết cuối cùng...", minProgress: 75, icon: "🎨" },
  { label: "Hoàn thiện và xuất ảnh kết quả...", minProgress: 88, icon: "📸" },
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

  // Garment image = ảnh mặt trước của sản phẩm đang chọn
  const garmentImageUrl =
    selectedProduct?.images360?.[0]?.url || selectedProduct?.images?.[0];

  // Reset khi đổi sản phẩm
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

  // Fake progress + step animation trong khi chờ AI
  const startFakeProgress = () => {
    setProgress(0);
    setLoadingStep(0);
    let p = 0;

    // Progress bar
    progressInterval.current = setInterval(() => {
      p += Math.random() * 2.5 + 0.5;
      if (p >= 90) { p = 90; clearInterval(progressInterval.current); }
      setProgress(Math.round(p));
    }, 1500);

    // Tự động chuyển step dựa theo thời gian
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
      setErrorMsg("Không tìm thấy ảnh áo dài. Vui lòng chọn sản phẩm khác.");
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

      // Nếu backend đang ở trạng thái cold start (Render free tier boot), tự động retry sau 4 giây
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

      // Xử lý HTTP error trước khi parse JSON
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

      // Friendly messages cho từng loại lỗi
      let friendlyMsg = err.message || "Lỗi kết nối. Vui lòng thử lại.";
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        friendlyMsg = "Không thể kết nối đến máy chủ AI API. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau ít phút.";
      }

      setErrorMsg(friendlyMsg);
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const a = document.createElement("a");
    a.href = resultImage;
    a.download = `DaiVerse-TryOn-${selectedProduct?.name || "result"}.png`;
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
    <div className="mt-14 relative">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#E8C55A] text-xs font-bold uppercase tracking-wider mb-3">
          <Wand2 className="w-4 h-4" />
          <span>AI Virtual Try-On</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-4xl font-bold">
          Thử Áo Dài Với{" "}
          <span className="text-[#E8C55A] italic">Trí Tuệ Nhân Tạo</span>
        </h2>
        <p className="text-white/60 mt-2 text-sm max-w-lg mx-auto">
          Tải lên ảnh của bạn — AI sẽ tự động kết hợp với chiếc áo dài đang xem
          để tạo ra hình ảnh bạn mặc thật sự.
        </p>
      </div>

      {/* Main Try-On Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ── Cột 1: Upload Ảnh Người Dùng ── */}
        <div className="bg-white/5 border border-white/15 rounded-3xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#C8920A] flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#E8C55A]">
              Ảnh Của Bạn
            </h3>
          </div>

          {/* Upload Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !personImage && fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden
              ${personImage
                ? "border-[#C8920A]/50 cursor-default"
                : "border-white/30 hover:border-[#C8920A] cursor-pointer"
              }
              ${isDragOver ? "border-[#E8C55A] bg-[#C8920A]/20 scale-[1.02]" : ""}
            `}
            style={{ minHeight: "280px" }}
          >
            {personImage ? (
              <>
                <img
                  src={personImage.previewUrl}
                  alt="Ảnh của bạn"
                  className="w-full h-full object-cover"
                  style={{ maxHeight: "360px" }}
                />
                {/* Overlay controls */}
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="px-3 py-1.5 bg-white/90 text-gray-900 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Đổi ảnh
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleReset(); }}
                    className="px-3 py-1.5 bg-red-500/90 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" /> Xóa
                  </button>
                </div>
                {/* Success badge */}
                <div className="absolute top-3 left-3 px-2 py-1 bg-emerald-500/90 rounded-lg text-xs font-bold text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Sẵn sàng
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-[#E8C55A]" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">
                    Kéo & thả ảnh vào đây
                  </p>
                  <p className="text-white/50 text-xs mt-1">
                    hoặc click để chọn từ thiết bị
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                  {["JPG", "PNG", "WEBP"].map((f) => (
                    <span key={f} className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-white/60 font-mono">
                      {f}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-white/60 font-mono">
                    Max 10MB
                  </span>
                </div>
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

          {/* Tips */}
          <div className="bg-[#C8920A]/10 border border-[#C8920A]/20 rounded-xl p-3 text-xs text-white/60 space-y-1">
            <p className="font-semibold text-[#E8C55A] text-[11px] uppercase tracking-wider">
              Mẹo để có kết quả tốt nhất
            </p>
            <p>• Chụp ảnh toàn thân hoặc nửa người</p>
            <p>• Nền đơn giản, ánh sáng đều</p>
            <p>• Trang phục sáng màu, ôm body</p>
          </div>
        </div>

        {/* ── Cột 2: Nút Try-On + Trạng thái ── */}
        <div className="flex flex-col items-center justify-center gap-6 py-8">
          {/* Garment preview nhỏ */}
          <div className="text-center">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Đang thử</p>
            <div className="w-20 h-28 mx-auto rounded-xl overflow-hidden border-2 border-[#C8920A]/40 shadow-lg">
              {garmentImageUrl && (
                <img
                  src={garmentImageUrl}
                  alt={selectedProduct?.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <p className="text-xs font-semibold text-[#E8C55A] mt-2 max-w-[120px] mx-auto leading-tight">
              {selectedProduct?.name}
            </p>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-1 text-[#C8920A]/50">
            <ChevronRight className="w-5 h-5 rotate-90" />
            <div className="w-px h-8 bg-[#C8920A]/30" />
            <Wand2 className="w-5 h-5 text-[#C8920A] animate-pulse" />
            <div className="w-px h-8 bg-[#C8920A]/30" />
            <ChevronRight className="w-5 h-5 rotate-90" />
          </div>

          {/* CTA Button */}
          <button
            type="button"
            onClick={handleTryOn}
            disabled={status === "loading" || !personImage}
            className={`relative w-full max-w-[200px] py-4 rounded-2xl font-bold text-sm flex flex-col items-center justify-center gap-2 transition-all duration-300 border-none cursor-pointer
              ${status === "loading"
                ? "bg-[#C8920A]/60 text-white/70 cursor-not-allowed"
                : !personImage
                ? "bg-white/10 text-white/40 cursor-not-allowed"
                : "bg-[#C8920A] hover:bg-[#E8C55A] hover:text-[#2C1A00] text-white shadow-xl hover:shadow-[#C8920A]/40 hover:scale-105"
              }
            `}
          >
            {status === "loading" ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Thử Ngay</span>
              </>
            )}
          </button>

          {/* Loading: Steps + Progress */}
          {status === "loading" && (
            <div className="w-full max-w-[230px] space-y-3">
              {/* Current step badge */}
              <div className="bg-black/40 border border-[#C8920A]/30 rounded-xl p-3 text-center backdrop-blur-sm">
                <span className="text-xl block mb-1">
                  {LOADING_STEPS[loadingStep]?.icon}
                </span>
                <p className="text-[11px] text-[#E8C55A] font-semibold leading-snug">
                  {LOADING_STEPS[loadingStep]?.label}
                </p>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-[10px] text-white/50 mb-1">
                  <span>Tiến độ</span>
                  <span className="font-mono font-bold text-[#E8C55A]">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C8920A] via-[#E8C55A] to-[#C8920A] rounded-full transition-all duration-1500"
                    style={{ width: `${progress}%`, backgroundSize: "200% 100%", animation: "shimmer 2s infinite" }}
                  />
                </div>
              </div>

              {/* Step dots */}
              <div className="flex justify-center gap-1.5">
                {LOADING_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-500 ${
                      i <= loadingStep
                        ? "w-2 h-2 bg-[#E8C55A]"
                        : "w-1.5 h-1.5 bg-white/20"
                    }`}
                  />
                ))}
              </div>

              <p className="text-[10px] text-white/30 text-center">
                Quá trình mất 2–5 phút, vui lòng đợi
              </p>
            </div>
          )}

          {/* Status messages */}
          {status === "success" && (
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Hoàn tất!</span>
            </div>
          )}

          {status === "error" && (
            <div className="w-full max-w-[220px] bg-red-900/80 border border-red-500/60 rounded-xl p-3 flex items-start gap-2 backdrop-blur-sm">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-200 text-[11px] leading-snug text-left">{errorMsg}</p>
            </div>
          )}
        </div>

        {/* ── Cột 3: Kết quả Try-On ── */}
        <div className="bg-white/5 border border-white/15 rounded-3xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Shirt className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#E8C55A]">
              Kết Quả Try-On
            </h3>
          </div>

          <div
            className="rounded-2xl border-2 border-dashed border-white/15 overflow-hidden flex items-center justify-center bg-black/20"
            style={{ minHeight: "280px" }}
          >
            {status === "loading" ? (
              /* Loading skeleton */
              <div className="flex flex-col items-center gap-4 p-8 text-center">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-[#C8920A]/30" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-[#C8920A] animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-[#E8C55A] animate-pulse" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white/80">
                    AI đang tạo hình ảnh...
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    Phân tích và kết hợp áo dài vào ảnh của bạn
                  </p>
                </div>
                {/* Shimmer skeleton */}
                <div className="w-full max-w-[160px] space-y-2 mt-2">
                  <div className="h-2 bg-white/10 rounded-full animate-pulse" />
                  <div className="h-2 bg-white/10 rounded-full animate-pulse w-3/4 mx-auto" />
                  <div className="h-2 bg-white/10 rounded-full animate-pulse w-1/2 mx-auto" />
                </div>
              </div>
            ) : resultImage ? (
              <img
                src={resultImage}
                alt="Kết quả Virtual Try-On"
                className="w-full h-full object-cover"
                style={{ maxHeight: "360px" }}
              />
            ) : (
              <div className="flex flex-col items-center gap-3 p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white/20" />
                </div>
                <p className="text-white/30 text-xs">
                  Kết quả sẽ hiển thị<br />tại đây sau khi xử lý
                </p>
              </div>
            )}
          </div>

          {/* Result actions */}
          {resultImage && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 py-2.5 bg-[#C8920A] hover:bg-[#E8C55A] hover:text-[#2C1A00] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Tải ảnh về
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Thử lại
              </button>
            </div>
          )}

          {/* Result note */}
          {resultImage && (
            <p className="text-[10px] text-white/30 text-center">
              Hình ảnh được tạo bởi AI DaiVerse · Chỉ để tham khảo
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main 360 Page ────────────────────────────────────────────────────────────
export default function Product360Page() {
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

  // Helper tính toán ảnh tương ứng theo góc xoay
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
    <div className="pt-28 pb-20 bg-[#C8A800] min-h-screen text-white relative overflow-hidden select-none">
      {/* Dynamic Lighting Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#C8920A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#E8C55A]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="container-page relative z-10">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8920A]/20 border border-[#C8920A]/40 text-[#E8C55A] text-xs font-bold uppercase tracking-wider mb-3">
            <RotateCcw className="w-4 h-4 animate-spin" style={{ animationDuration: "10s" }} />
            <span>DaiVerse 360° Experience</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold leading-tight">
            Trải Nghiệm Áo Dài 360°{" "}
            <span className="text-[#E8C55A] italic">Cùng DaiVerse</span>
          </h1>
          <p className="text-gray-300 mt-2 text-xs sm:text-sm max-w-xl mx-auto">
            Xoay và khám phá từng chi tiết thiết kế với góc nhìn 360°, mang đến
            trải nghiệm chân thực trước khi lựa chọn chiếc áo dài phù hợp.
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
                  Góc chụp:{" "}
                  <span className="text-white font-bold">{currentFrame.label}</span>
                </p>
              </div>

              {/* Digital Compass Degree Indicator */}
              <div className="absolute top-4 right-4 px-3.5 py-1.5 bg-black/70 backdrop-blur-md rounded-full text-xs font-mono font-bold text-[#E8C55A] border border-white/20 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
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
                      <span className="absolute inset-0 rounded-full bg-[#C8920A] animate-ping opacity-60" />
                    </button>

                    {activeHotspot === idx && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-60 p-3.5 bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-200 z-30 text-xs animate-fadeIn">
                        <h4 className="font-bold text-[#FFDF00] font-heading text-sm flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-[#C8920A]" />
                          <span>{hs.title}</span>
                        </h4>
                        <p className="text-gray-600 mt-1 leading-relaxed text-[11px]">
                          {hs.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

              {/* Bottom Drag Instruction Pill */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 backdrop-blur-md rounded-full text-xs text-white flex items-center gap-2 border border-white/20 pointer-events-none">
                <MoveHorizontal className="w-4 h-4 text-[#E8C55A] animate-pulse" />
                <span>Kéo trái / phải để xoay 360°</span>
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
                {autoRotate ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
                <span>
                  {autoRotate ? "Tạm Dừng Tự Xoay" : "Tự Động Xoay 360°"}
                </span>
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
                <span className="text-xs font-mono font-bold px-2">
                  {Math.round(zoomLevel * 100)}%
                </span>
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
                      setActiveHotspot(null);
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
                        <p className="font-semibold text-xs text-white truncate">
                          {prod.name}
                        </p>
                        {prod.images360 && (
                          <span className="bg-[#C8920A] text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                            3D
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-300 mt-0.5 truncate">
                        {prod.fabric}
                      </p>
                      <p className="text-xs font-bold text-[#E8C55A] mt-1">
                        {prod.formattedPrice}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Try-On teaser badge */}
            {FEATURE_FLAGS.ENABLE_AI_TRY_ON && (
              <div className="flex items-center gap-2 p-3 bg-[#C8920A]/15 border border-[#C8920A]/30 rounded-xl">
                <Wand2 className="w-4 h-4 text-[#E8C55A] shrink-0" />
                <p className="text-[11px] text-white/70 leading-snug">
                  Cuộn xuống để thử{" "}
                  <span className="text-[#E8C55A] font-semibold">
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
              <div className="flex-1 h-px bg-white/10" />
              <div className="flex items-center gap-2 px-4 py-1.5 bg-[#C8920A]/20 border border-[#C8920A]/40 rounded-full">
                <Sparkles className="w-4 h-4 text-[#E8C55A]" />
                <span className="text-[#E8C55A] text-xs font-bold uppercase tracking-wider">
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
