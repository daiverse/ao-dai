import React, { useState } from "react";
import { Sparkles, Upload, User, Check, RefreshCw, ShoppingBag, ArrowRight, Eye, Layers, ShieldCheck, CheckCircle2 } from "lucide-react";
import { PRODUCTS } from "../data/products";
import { useCart } from "../context/CartContext";
import { compositeVirtualTryOn } from "../utils/aiVtonComposer";
import { runVirtualTryOn } from "../utils/hfAI";

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

  const avatars = [
    { name: "Người mẫu Thùy Trang", desc: "Chiều cao 1m68 · Dáng thon thanh tú", image: "/anh/746927465_122119237899355470_7558522641041819280_n.jpg" },
    { name: "Người mẫu Mai Chi", desc: "Chiều cao 1m62 · Dáng tròn đằm thắm", image: "/anh/747178293_122119072509355470_7986902361393680700_n.jpg" },
    { name: "Người mẫu Bích Ngọc", desc: "Chiều cao 1m65 · Dáng sang trọng", image: "/anh/754058094_122120859087355470_3079712870670515575_n.jpg" }
  ];

  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod);
    setSelectedColor(prod.colors?.[0]?.name || "");
    setResultImage(null);
    setHasTriedOn(false);
  };

  const handleUserImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUserUploadedImage(url);
      setViewMode("user");
      setResultImage(null);
      setHasTriedOn(false);
    }
  };

  const handleRunAiTryOn = async () => {
    setIsProcessing(true);
    setHasTriedOn(false);
    setResultImage(null);

    const personImageUrl = userUploadedImage || avatars[selectedAvatar].image;
    const garmentImageUrl = selectedProduct?.images?.[0];

    try {
      const aiResult = await runVirtualTryOn(personImageUrl, garmentImageUrl);
      if (aiResult) {
        setResultImage(aiResult);
        setHasTriedOn(true);
        return;
      }
      const blendedUrl = await compositeVirtualTryOn(personImageUrl, garmentImageUrl);
      setResultImage(blendedUrl);
      setHasTriedOn(true);
    } catch (err) {
      console.warn("AI VTON error:", err);
      const blendedUrl = await compositeVirtualTryOn(personImageUrl, garmentImageUrl);
      setResultImage(blendedUrl);
      setHasTriedOn(true);
    } finally {
      setIsProcessing(false);
    }
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
                CHỌN NGƯỜI MẪU HOẶC TẢI ẢNH BẠN
              </h3>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {avatars.map((av, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAvatar(idx);
                      if (viewMode === "user") setViewMode("model");
                    }}
                    className={`p-2 border transition-all text-center cursor-pointer ${
                      selectedAvatar === idx && viewMode !== "user"
                        ? "border-[#111111] bg-white font-bold"
                        : "border-neutral-200 bg-neutral-100 hover:border-neutral-400"
                    }`}
                  >
                    <img src={av.image} alt={av.name} className="w-full aspect-square object-cover mb-1.5" />
                    <p className="font-bold text-[11px] text-[#111111] truncate">{av.name}</p>
                  </button>
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
              className="w-full py-3.5 bg-[#111111] hover:bg-[#C5A059] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border-none disabled:opacity-60"
            >
              {isProcessing ? "ĐANG XỬ LÝ KHỚP PHOM..." : "BẮT ĐẦU VIRTUAL TRY-ON"}
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
                  Người Mẫu
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
                <div className="flex flex-col items-center gap-3 text-center p-8 text-white">
                  <Sparkles className="w-8 h-8 text-[#C5A059] animate-spin" />
                  <h4 className="font-heading font-black text-sm uppercase">DaiVerse AI ĐANG PHÂN TÍCH...</h4>
                </div>
              ) : (
                <>
                  <img
                    src={resultImage || (viewMode === "detail" ? secondaryProductImage : activeProductImage)}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-[#C5A059] text-white text-[10px] font-bold uppercase tracking-widest">
                    DaiVerse VIRTUAL VTON
                  </div>
                </>
              )}
            </div>

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

              <button
                onClick={() => addToCart(selectedProduct, selectedSize, selectedColor)}
                className="w-full py-3.5 bg-[#C5A059] hover:bg-[#A4813D] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border-none flex items-center justify-center gap-2"
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


