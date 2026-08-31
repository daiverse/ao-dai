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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E43D12]/10 border border-[#E43D12]/20 text-[#E43D12] text-xs font-bold uppercase tracking-wider mb-3">
          <Wand2 className="w-4 h-4 text-[#E43D12]" />
          <span>AI Virtual Try-On</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-4xl font-bold text-gray-900">
          Thử Áo Dài Với{" "}
          <span className="text-[#E43D12] italic font-heading">Trí Tuệ Nhân Tạo</span>
        </h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base max-w-lg mx-auto font-normal leading-relaxed">
          Tải lên ảnh của bạn — AI sẽ tự động kết hợp với chiếc áo dài đang xem
          để tạo ra hình ảnh bạn mặc thật sự.
        </p>
      </div>

      {/* Main Try-On Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ── Cột 1: Upload Ảnh Người Dùng ── */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 flex flex-col gap-4 shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E43D12] flex items-center justify-center text-white">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-900">
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
                ? "border-[#E43D12]/50 cursor-default"
                : "border-gray-300 hover:border-[#E43D12] bg-[#EBE9E1]/50 cursor-pointer"
              }
              ${isDragOver ? "border-[#E43D12] bg-[#E43D12]/10 scale-[1.02]" : ""}
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
                <div className="absolute top-3 left-3 px-2 py-1 bg-emerald-600 rounded-lg text-xs font-bold text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Sẵn sàng
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-xs">
                  <Upload className="w-7 h-7 text-[#E43D12]" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">
                    Kéo & thả ảnh vào đây
                  </p>
                  <p className="text-gray-500 text-xs mt-1 font-medium">
                    hoặc click để chọn từ thiết bị
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                  {["JPG", "PNG", "WEBP"].map((f) => (
                    <span key={f} className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600 font-mono font-bold">
                      {f}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600 font-mono font-bold">
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
          <div className="bg-[#EBE9E1] border border-gray-200/80 rounded-xl p-3.5 text-xs text-gray-600 space-y-1 font-medium">
            <p className="font-bold text-[#E43D12] text-[11px] uppercase tracking-wider">
              Mẹo để có kết quả tốt nhất
            </p>
            <p>• Chụp ảnh toàn thân hoặc nửa người</p>
            <p>• Nền đơn giản, ánh sáng đều</p>
            <p>• Trang phục sáng màu, ôm body</p>
          </div>
        </div>

        {/* ── Cột 2: Nút Try-On + Trạng thái ── */}
        <div className="flex flex-col items-center justify-center gap-6 py-6 h-full">
          {/* Garment preview lớn rõ nét */}
          <div className="text-center">
            <span className="text-xs text-[#E43D12] font-extrabold uppercase tracking-widest px-3 py-1 bg-[#E43D12]/10 rounded-full border border-[#E43D12]/20 inline-block mb-3">
              ĐANG THỬ MẪU NÀY
            </span>
            <div className="w-36 h-48 sm:w-40 sm:h-52 mx-auto rounded-2xl overflow-hidden border-3 border-[#E43D12] shadow-xl hover:scale-105 transition-transform bg-white">
              {garmentImageUrl && (
                <img
                  src={garmentImageUrl}
                  alt={selectedProduct?.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <p className="font-heading font-bold text-sm sm:text-base text-gray-900 mt-3 max-w-[200px] mx-auto leading-snug">
              {selectedProduct?.name}
            </p>
            <p className="text-xs font-bold text-[#E43D12] mt-1">{selectedProduct?.formattedPrice}</p>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-1.5 text-[#E43D12]/60">
            <ChevronRight className="w-5 h-5 rotate-90" />
            <div className="w-px h-6 bg-[#E43D12]/40" />
            <Wand2 className="w-6 h-6 text-[#E43D12] animate-pulse" />
            <div className="w-px h-6 bg-[#E43D12]/40" />
            <ChevronRight className="w-5 h-5 rotate-90" />
          </div>

          {/* CTA Button Lớn Nổi Bật */}
          <button
            type="button"
            onClick={handleTryOn}
            disabled={status === "loading" || !personImage}
            className={`relative w-full max-w-[340px] py-5 px-8 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all duration-300 border-none cursor-pointer shadow-xl ${
              status === "loading"
                ? "bg-[#E43D12]/60 text-white/70 cursor-not-allowed"
                : !personImage
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#E43D12] hover:bg-[#c7320b] text-white shadow-[#E43D12]/30 hover:scale-105 active:scale-95"
            }`}
          >
            {status === "loading" ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                <span>Thử Đồ Ngay Với AI</span>
              </>
            )}
          </button>

          {/* Loading: Steps + Progress */}
          {status === "loading" && (
            <div className="w-full max-w-[230px] space-y-3">
              {/* Current step badge */}
              <div className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm">
                <span className="text-xl block mb-1">
                  {LOADING_STEPS[loadingStep]?.icon}
                </span>
                <p className="text-[11px] text-[#E43D12] font-bold leading-snug">
                  {LOADING_STEPS[loadingStep]?.label}
                </p>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-[10px] text-gray-600 mb-1 font-bold">
                  <span>Tiến độ</span>
                  <span className="font-mono font-extrabold text-[#E43D12]">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E43D12] rounded-full transition-all duration-1500"
                    style={{ width: `${progress}%` }}
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
                        ? "w-2 h-2 bg-[#E43D12]"
                        : "w-1.5 h-1.5 bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <p className="text-[10px] text-gray-500 font-semibold text-center">
                Quá trình mất 2–5 phút, vui lòng đợi
              </p>
            </div>
          )}

          {/* Status messages */}
          {status === "success" && (
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Hoàn tất!</span>
            </div>
          )}

          {status === "error" && (
            <div className="w-full max-w-[220px] bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-red-700 text-[11px] leading-snug text-left">{errorMsg}</p>
            </div>
          )}
        </div>

        {/* ── Cột 3: Kết quả Try-On ── */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 flex flex-col gap-4 shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E43D12] flex items-center justify-center text-white">
              <Shirt className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-900">
              Kết Quả Try-On
            </h3>
          </div>

          <div
            className="rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-[#EBE9E1]/50"
            style={{ minHeight: "280px" }}
          >
            {status === "loading" ? (
              /* Loading skeleton */
              <div className="flex flex-col items-center gap-4 p-8 text-center">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-[#E43D12]/30" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-[#E43D12] animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-[#E43D12] animate-pulse" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">
                    AI đang tạo hình ảnh...
                  </p>
                  <p className="text-gray-500 text-xs mt-1 font-medium">
                    Phân tích và kết hợp áo dài vào ảnh của bạn
                  </p>
                </div>
                {/* Shimmer skeleton */}
                <div className="w-full max-w-[160px] space-y-2 mt-2">
                  <div className="h-2 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-2 bg-gray-200 rounded-full animate-pulse w-3/4 mx-auto" />
                  <div className="h-2 bg-gray-200 rounded-full animate-pulse w-1/2 mx-auto" />
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
                <div className="w-14 h-14 rounded-2xl bg-[#EBE9E1] flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium text-xs text-center">
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
                className="flex-1 py-2.5 bg-[#E43D12] hover:bg-[#EFB11D] hover:text-[#2C1A00] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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
    <div className="pt-28 pb-20 bg-[#EBE9E1] min-h-screen text-gray-900 relative overflow-hidden select-none">
      {/* Dynamic Lighting Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#E43D12]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#EFB11D]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="container-page relative z-10">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E43D12]/10 border border-[#E43D12]/20 text-[#E43D12] text-xs font-bold uppercase tracking-wider mb-3">
            <RotateCcw className="w-4 h-4 text-[#E43D12] animate-spin" style={{ animationDuration: "10s" }} />
            <span>DaiVerse 360° Experience</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold leading-tight text-gray-900">
            Trải Nghiệm Áo Dài 360°{" "}
            <span className="text-[#E43D12] italic font-heading">Cùng DaiVerse</span>
          </h1>
          <p className="text-gray-600 mt-2 text-xs sm:text-sm max-w-xl mx-auto font-normal">
            Xoay và khám phá từng chi tiết thiết kế với góc nhìn 360°, mang đến
            trải nghiệm chân thực trước khi lựa chọn chiếc áo dài phù hợp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main 360 Interactive Viewer Canvas */}
          <div className="lg:col-span-8 flex flex-col items-center">
            <div
              ref={containerRef}
              className="relative w-full max-w-lg aspect-[3/4] bg-gradient-to-b from-[#1C4333] via-[#142D22] to-[#0F241C] rounded-3xl border border-gray-300 overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing group"
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
              <div className="absolute top-4 left-4 px-4 py-2 bg-black/80 backdrop-blur-md rounded-2xl border border-white/20 text-xs">
                <p className="font-bold text-[#EFB11D] flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#E43D12]" />
                  <span>{selectedProduct.name}</span>
                </p>
                <p className="text-[#EFB11D] font-semibold text-[11px] mt-0.5">
                  Góc chụp:{" "}
                  <span className="text-white font-bold">{currentFrame.label}</span>
                </p>
              </div>

              {/* Digital Compass Degree Indicator */}
              <div className="absolute top-4 right-4 px-3.5 py-1.5 bg-black/80 backdrop-blur-md rounded-full text-xs font-mono font-bold text-[#EFB11D] border border-white/20 flex items-center gap-1.5">
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
                      className="relative w-8 h-8 rounded-full bg-[#E43D12] text-white flex items-center justify-center shadow-xl hover:scale-125 transition-all cursor-pointer"
                    >
                      <Info className="w-4 h-4" />
                      <span className="absolute inset-0 rounded-full bg-[#E43D12] animate-ping opacity-60" />
                    </button>

                    {activeHotspot === idx && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-60 p-3.5 bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-200 z-30 text-xs animate-fadeIn">
                        <h4 className="font-bold text-[#EFB11D] font-heading text-sm flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-[#E43D12]" />
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
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 backdrop-blur-md rounded-full text-xs text-white flex items-center gap-2 border border-white/20 pointer-events-none">
                <MoveHorizontal className="w-4 h-4 text-[#EFB11D] animate-pulse" />
                <span>Kéo trái / phải để xoay 360°</span>
              </div>
            </div>

            {/* Action Toolbar: Auto Rotate & Zoom */}
            <div className="w-full max-w-lg mt-5 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  autoRotate
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition-all cursor-pointer"
                  title="Thu nhỏ"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold text-gray-900 px-2">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(2, z + 0.2))}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition-all cursor-pointer"
                  title="Phóng to soi vải"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Product Selector List */}
          <div className="lg:col-span-4 bg-white border border-gray-200 p-6 rounded-3xl space-y-4 shadow-md">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#E43D12] font-bold block mb-1">
                Bộ Sưu Tập Áo Dài 3D
              </span>
              <h3 className="font-heading font-bold text-xl text-gray-900">
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
                        ? "border-[#E43D12] bg-[#E43D12]/5 ring-1 ring-[#E43D12]"
                        : "border-gray-200 hover:border-gray-300 bg-white"
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
                          <span className="bg-[#E43D12] text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                            3D
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                        {prod.fabric}
                      </p>
                      <p className="text-xs font-bold text-[#E43D12] mt-1">
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
                <Wand2 className="w-4 h-4 text-[#E43D12] shrink-0" />
                <p className="text-[11px] text-gray-600 leading-snug">
                  Cuộn xuống để thử{" "}
                  <span className="text-[#E43D12] font-bold">
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
                <Sparkles className="w-4 h-4 text-[#E43D12]" />
                <span className="text-[#E43D12] text-xs font-bold uppercase tracking-wider">
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
