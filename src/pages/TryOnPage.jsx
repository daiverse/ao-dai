import React, { useState } from "react";
import { Sparkles, Upload, User, Check, RefreshCw, ShoppingBag, ArrowRight, Eye, Layers, ShieldCheck, CheckCircle2, Download } from "lucide-react";
import { PRODUCTS } from "../data/products";
import { useCart } from "../context/CartContext";
import { compositeVirtualTryOn } from "../utils/aiVtonComposer";
import { API_BASE_URL } from "../config/api";

const LOADING_STEPS = [
  { label: "Đang kết nối đến máy chủ AI...", minProgress: 10 },
  { label: "Đang phân tích vóc dáng & tỉ lệ...", minProgress: 30 },
  { label: "Đang xử lý phom dáng Áo Dài...", minProgress: 55 },
  { label: "AI đang khớp tà áo 3D & nếp gấp...", minProgress: 75 },
  { label: "Hoàn thiện hình ảnh Virtual Try-On...", minProgress: 95 },
];

export default function TryOnPage({ selectedProductFromState }) {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(selectedProductFromState || PRODUCTS[0]);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [selectedColor, setSelectedColor] = useState(selectedProduct?.colors?.[0]?.name || "");
  const [selectedSize, setSelectedSize] = useState("M");
  const [userUploadedImage, setUserUploadedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasTriedOn, setHasTriedOn] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [viewMode, setViewMode] = useState("model");
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const avatars = [
    { name: "Dáng Đứng Thanh Lịch", desc: "Dáng đứng phom dáng chuẩn mực", image: "/anh/746927465_122119237899355470_7558522641041819280_n.jpg" },
    { name: "Dáng Đứng Cầm Quạt", desc: "Dáng đứng dịu dàng cùng quạt xòe", image: "/anh/747178293_122119072509355470_7986902361393680700_n.jpg" },
    { name: "Dáng Ngồi", desc: "Dáng ngồi phong cách truyền thống", image: "/anh/754058094_122120859087355470_3079712870670515575_n.jpg" }
  ];

  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod);
    setSelectedColor(prod.colors?.[0]?.name || "");
    setResultImage(null);
    setHasTriedOn(false);
    setErrorMsg("");
  };

  const handleUserImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserUploadedImage(reader.result);
        setViewMode("user");
        setResultImage(null);
        setHasTriedOn(false);
        setErrorMsg("");
      };
      reader.readAsDataURL(file);
    }
  };

  const imageUrlToBase64 = async (url) => {
    if (!url) return null;
    if (url.startsWith("data:image/")) return url;
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.warn("Lỗi chuyển đổi ảnh sang Base64:", err);
      return null;
    }
  };

  const handleRunAiTryOn = async () => {
    setIsProcessing(true);
    setHasTriedOn(false);
    setResultImage(null);
    setErrorMsg("");
    setProgress(10);
    setLoadingStep(0);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90;
        const next = prev + Math.floor(Math.random() * 5) + 3;
        if (next >= 75) setLoadingStep(3);
        else if (next >= 55) setLoadingStep(2);
        else if (next >= 30) setLoadingStep(1);
        return next;
      });
    }, 700);

    const personSrc = userUploadedImage || avatars[selectedAvatar].image;
    const garmentPath = selectedProduct?.images?.[0] || selectedProduct?.images360?.[0]?.url;
    const fullGarmentUrl = garmentPath?.startsWith("http")
      ? garmentPath
      : typeof window !== "undefined"
      ? `${window.location.origin}${garmentPath}`
      : garmentPath;

    try {
      // 1. Chuyển ảnh người mẫu/người dùng thành base64 data URL
      const personImageBase64 = await imageUrlToBase64(personSrc);

      if (personImageBase64) {
        // 2. Gọi API backend /api/ai/tryon (Perfect Corp AI Clothes / IDM-VTON)
        let response = await fetch(`${API_BASE_URL}/api/ai/tryon`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            personImageBase64,
            garmentImageUrl: fullGarmentUrl,
          }),
        });

        // Tự động thử lại nếu gặp 502 / 503
        if (response.status === 502 || response.status === 503) {
          await new Promise((r) => setTimeout(r, 3000));
          response = await fetch(`${API_BASE_URL}/api/ai/tryon`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              personImageBase64,
              garmentImageUrl: fullGarmentUrl,
            }),
          });
        }

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.resultImageBase64) {
            clearInterval(progressTimer);
            setProgress(100);
            setLoadingStep(4);
            setResultImage(data.resultImageBase64);
            setHasTriedOn(true);
            setIsProcessing(false);
            return;
          }
        }
      }

      // 3. Dự phòng Canvas Compositor nếu máy chủ API bận
      const blendedUrl = await compositeVirtualTryOn(personSrc, fullGarmentUrl);
      clearInterval(progressTimer);
      setProgress(100);
      setLoadingStep(4);
      setResultImage(blendedUrl);
      setHasTriedOn(true);
    } catch (err) {
      console.warn("Lỗi Virtual Try-On API, chuyển sang trình xử lý dự phòng:", err);
      try {
        const blendedUrl = await compositeVirtualTryOn(personSrc, fullGarmentUrl);
        clearInterval(progressTimer);
        setProgress(100);
        setLoadingStep(4);
        setResultImage(blendedUrl);
        setHasTriedOn(true);
      } catch (fallbackErr) {
        setErrorMsg("Không thể xử lý thử đồ lúc này. Vui lòng thử lại!");
      }
    } finally {
      clearInterval(progressTimer);
      setIsProcessing(false);
    }
  };

  const handleDownloadResult = () => {
    if (!resultImage) return;
    const a = document.createElement("a");
    a.href = resultImage;
    a.download = `DaiVerse-Virtual-TryOn-${selectedProduct?.name || "result"}.png`;
    a.click();
  };

  const activeProductImage = selectedProduct?.images?.[0] || avatars[selectedAvatar].image;
  const secondaryProductImage = selectedProduct?.images?.[1] || activeProductImage;

  return (
    <div className="pt-32 sm:pt-36 pb-20 bg-white min-h-screen text-[#111111]">

      <div className="container-page">
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059] text-white text-[10px] font-extrabold uppercase tracking-widest mb-3">
            <Sparkles className="w-4 h-4 text-white" />
            <span>DaiVerse VIRTUAL TRY-ON STUDIO</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#111111] uppercase tracking-wide">
            THỬ ĐỒ THỜI TRANG <span className="text-[#C5A059]">DaiVerse AI</span>
          </h1>
          <p className="text-neutral-600 mt-2 text-xs sm:text-sm max-w-xl mx-auto font-normal">
            Trải nghiệm công nghệ thử trang phục trực tuyến chuẩn tỉ lệ hình thể trước khi đưa ra quyết định mua hàng.
          </p>
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Left Column */}
          <div className="lg:col-span-6 bg-neutral-50 p-6 border border-neutral-300 space-y-6">
            {/* Step 1 */}
            <div>
              <h3 className="font-heading font-black text-sm uppercase text-[#111111] mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#111111] text-white text-xs font-sans flex items-center justify-center">1</span>
                CHỌN DÁNG MẪU GỢI Ý HOẶC TẢI ẢNH BẠN
              </h3>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {avatars.map((av, idx) => (
                  <div
                    key={idx}
                    className="p-2 border border-neutral-200 bg-neutral-100 text-center select-none"
                  >
                    <img src={av.image} alt={av.name} className="w-full aspect-square object-cover mb-1.5" />
                    <p className="font-bold text-[11px] text-[#111111] truncate">{av.name}</p>
                  </div>
                ))}
              </div>

              {/* Upload Box */}
              <label className="p-3 border border-dashed border-neutral-400 text-center bg-white hover:border-[#111111] transition-colors cursor-pointer block">
                <input type="file" accept="image/*" className="hidden" onChange={handleUserImageUpload} />
                {userUploadedImage ? (
                  <div className="flex items-center gap-3">
                    <img src={userUploadedImage} alt="Ảnh của bạn" className="w-12 h-12 object-cover border border-[#111111]" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-[#C5A059]">✓ Đã chọn ảnh của bạn</p>
                      <p className="text-[10px] text-neutral-500">Bấm để tải ảnh khác</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-neutral-500 mx-auto mb-1" />
                    <p className="text-xs font-bold text-[#111111] uppercase tracking-wider">TẢI ẢNH CÁ NHÂN (.JPG, .PNG)</p>
                  </>
                )}
              </label>
            </div>

            {/* Step 2 */}
            <div>
              <h3 className="font-heading font-black text-sm uppercase text-[#111111] mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#111111] text-white text-xs font-sans flex items-center justify-center">2</span>
                  CHỌN TRANG PHỤC DaiVerse
                </span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRODUCTS.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod)}
                    className={`p-2 border text-left transition-all cursor-pointer ${
                      selectedProduct.id === prod.id
                        ? "border-[#111111] bg-white font-bold"
                        : "border-neutral-200 bg-neutral-100 hover:border-neutral-400"
                    }`}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden mb-1.5 bg-neutral-200">
                      <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="font-bold text-xs text-[#111111] truncate">{prod.name}</p>
                    <p className="text-xs text-[#C5A059] font-bold mt-0.5">{prod.formattedPrice}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3 bg-white border border-neutral-300">
              <p className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-2">CHỌN SIZE Trang Phục:</p>
              <div className="flex items-center gap-2">
                {selectedProduct.sizes?.map((sz, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 text-xs font-bold border transition-all cursor-pointer ${
                      selectedSize === sz
                        ? "border-[#111111] bg-[#111111] text-white"
                        : "border-neutral-300 bg-white text-neutral-700"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Trigger */}
            <button
              onClick={handleRunAiTryOn}
              disabled={isProcessing}
              className="w-full py-3.5 bg-[#111111] hover:bg-[#C5A059] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border-none disabled:opacity-60 flex items-center justify-center gap-2 shadow-md"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" />
                  <span>ĐANG XỬ LÝ KHỚP PHOM...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>BẮT ĐẦU VIRTUAL TRY-ON</span>
                </>
              )}
            </button>
          </div>

          {/* Render Result Right Column */}
          <div className="lg:col-span-6 bg-neutral-50 p-6 border border-neutral-300 sticky top-28 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-neutral-200 pb-3">
              <h3 className="font-heading font-black text-base text-[#111111] uppercase tracking-wide">KẾT QUẢ THỬ ĐỒ</h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode("model")}
                  className={`px-3 py-1 text-xs font-bold uppercase transition-all cursor-pointer border ${
                    viewMode === "model" ? "bg-[#111111] text-white border-[#111111]" : "bg-white text-neutral-700 border-neutral-300"
                  }`}
                >
                  Dáng Mẫu Gợi Ý
                </button>
                {userUploadedImage && (
                  <button
                    onClick={() => setViewMode("user")}
                    className={`px-3 py-1 text-xs font-bold uppercase transition-all cursor-pointer border ${
                      viewMode === "user" ? "bg-[#111111] text-white border-[#111111]" : "bg-white text-neutral-700 border-neutral-300"
                    }`}
                  >
                    Ảnh Của Bạn
                  </button>
                )}
              </div>
            </div>

            {/* Display Canvas Frame */}
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 border border-neutral-300 shadow-xl flex items-center justify-center">
              {isProcessing ? (
                <div className="flex flex-col items-center gap-3 text-center p-8 text-white w-full max-w-xs">
                  <Sparkles className="w-8 h-8 text-[#C5A059] animate-spin mb-1" />
                  <h4 className="font-heading font-black text-xs uppercase tracking-wider text-[#C5A059]">
                    {LOADING_STEPS[loadingStep]?.label || "DaiVerse AI ĐANG PHÂN TÍCH..."}
                  </h4>
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-[#C5A059] transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400 mt-1">{progress}%</span>
                </div>
              ) : (
                <>
                  <img
                    src={resultImage || (viewMode === "user" ? (userUploadedImage || activeProductImage) : activeProductImage)}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover object-top transition-all duration-500"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-[#C5A059] text-white text-[10px] font-bold uppercase tracking-widest shadow-md">
                    DaiVerse VIRTUAL VTON
                  </div>
                </>
              )}
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 font-semibold text-center bg-red-50 p-2 border border-red-200">
                ⚠️ {errorMsg}
              </p>
            )}

            {/* Product Summary Card & Action Button */}
            <div className="space-y-3 pt-2">
              <div className="p-3 bg-white border border-neutral-300 flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-black text-xs uppercase text-[#111111]">{selectedProduct.name}</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Size: <span className="font-bold text-[#111111]">{selectedSize}</span>
                  </p>
                </div>
                <span className="font-bold text-sm text-[#C5A059]">{selectedProduct.formattedPrice}</span>
              </div>

              {resultImage && (
                <button
                  type="button"
                  onClick={handleDownloadResult}
                  className="w-full py-3 bg-[#111111] hover:bg-[#333333] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border-none flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-[#C5A059]" />
                  <span>TẢI ẢNH KẾT QUẢ VỀ</span>
                </button>
              )}

              <button
                onClick={() => addToCart(selectedProduct, selectedSize, selectedColor)}
                className="w-full py-3.5 bg-[#C5A059] hover:bg-[#A4813D] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border-none flex items-center justify-center gap-2 shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>THÊM VÀO GIỎ HÀNG</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
