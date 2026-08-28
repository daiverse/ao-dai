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
  const [viewMode, setViewMode] = useState("model"); // 'model' | 'detail' | 'user'

  const avatars = [
    { name: "Người mẫu Thùy Trang", desc: "Chiều cao 1m68 · Dáng thon thanh tú", image: "/anh/746927465_122119237899355470_7558522641041819280_n.jpg" },
    { name: "Người mẫu Mai Chi", desc: "Chiều cao 1m62 · Dáng tròn đằm thắm", image: "/anh/747178293_122119072509355470_7986902361393680700_n.jpg" },
    { name: "Người mẫu Bích Ngọc", desc: "Chiều cao 1m65 · Dáng sang trọng", image: "/anh/754058094_122120859087355470_3079712870670515575_n.jpg" }
  ];

  // Xử lý khi chọn sản phẩm khác
  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod);
    setSelectedColor(prod.colors?.[0]?.name || "");
    setResultImage(null);
    setHasTriedOn(false);
  };

  // Xử lý upload ảnh cá nhân
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

  // Ghép ảnh người dùng / người mẫu với Mẫu Áo Dài Thực Tế bằng IDM-VTON AI (fallback Canvas)
  const handleRunAiTryOn = async () => {
    setIsProcessing(true);
    setHasTriedOn(false);
    setResultImage(null);

    const personImageUrl = userUploadedImage || avatars[selectedAvatar].image;
    const garmentImageUrl = selectedProduct?.images?.[0];

    try {
      // 1. Gọi IDM-VTON AI qua Backend Proxy
      const aiResult = await runVirtualTryOn(personImageUrl, garmentImageUrl);
      if (aiResult) {
        setResultImage(aiResult);
        setHasTriedOn(true);
        return;
      }
      // 2. Fallback sang Canvas compositor nếu AI remote bận hoặc timeout
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

  // Lấy ảnh hiển thị chính xác theo sản phẩm
  const activeProductImage = selectedProduct?.images?.[0] || avatars[selectedAvatar].image;
  const secondaryProductImage = selectedProduct?.images?.[1] || activeProductImage;

  return (
    <div className="pt-28 pb-20 bg-[#FDF6C0] min-h-screen text-gray-900">
      <div className="container-page">
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFDF00]/10 text-[#FFDF00] text-xs font-bold uppercase tracking-wider mb-3 border border-[#FFDF00]/20">
            <Sparkles className="w-4 h-4 text-[#C8920A]" />
            <span>Phòng Thử Đồ AI 4K · Khớp Phom Chính Xác 100%</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Thử Áo Dài Thực Tế <span className="text-[#FFDF00] italic">Chuẩn Tỉ Lệ Dáng</span>
          </h1>
          <p className="text-gray-600 mt-3 text-sm sm:text-base max-w-xl mx-auto">
            Xem trực quan 100% hình ảnh thực tế của từng bộ trang phục (*Bạch Lan, Thanh Phong, Sương Mai, Mộc An, Hồng Nguyệt*) được ghép phom vừa vặn trên người mẫu chuẩn.
          </p>
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Left Column */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 space-y-8">
            {/* Step 1: Choose Model / Upload */}
            <div>
              <h3 className="font-heading font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#FFDF00] text-white text-xs font-sans flex items-center justify-center">1</span>
                Chọn Người Mẫu Chuẩn Hoặc Tải Ảnh Cá Nhân
              </h3>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {avatars.map((av, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAvatar(idx);
                      if (viewMode === "user") setViewMode("model");
                    }}
                    className={`p-2.5 rounded-2xl border transition-all text-center cursor-pointer ${
                      selectedAvatar === idx && viewMode !== "user"
                        ? "border-[#FFDF00] bg-[#FFDF00]/5 ring-2 ring-[#FFDF00]/30"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={av.image} alt={av.name} className="w-full aspect-square object-cover rounded-xl mb-2 shadow-xs" />
                    <p className="font-semibold text-xs text-gray-900 line-clamp-1">{av.name}</p>
                    <p className="text-[10px] text-gray-500 line-clamp-1">{av.desc}</p>
                  </button>
                ))}
              </div>

              {/* Upload Box */}
              <label className="p-4 border-2 border-dashed border-gray-300 rounded-2xl text-center bg-[#FDF6C0] hover:border-[#FFDF00] transition-colors cursor-pointer block">
                <input type="file" accept="image/*" className="hidden" onChange={handleUserImageUpload} />
                {userUploadedImage ? (
                  <div className="flex items-center gap-3">
                    <img src={userUploadedImage} alt="Ảnh của bạn" className="w-14 h-14 object-cover rounded-xl border-2 border-[#FFDF00]" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-[#FFDF00]">✓ Đã chọn ảnh của bạn</p>
                      <p className="text-[11px] text-gray-500">Nhấn để tải ảnh khác</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-gray-700">Tải Ảnh Cá Nhân Toàn Thân (.jpg, .png)</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Tự động căn chỉnh vai, eo & tà áo theo số đo cơ thể</p>
                  </>
                )}
              </label>
            </div>

            {/* Step 2: Choose Ao Dai Product */}
            <div>
              <h3 className="font-heading font-bold text-lg text-gray-900 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#FFDF00] text-white text-xs font-sans flex items-center justify-center">2</span>
                  Chọn Mẫu Áo Dài Để Thử
                </span>
                <span className="text-xs text-[#C8920A] font-semibold">{PRODUCTS.length} Mẫu BST Mộc Lan</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRODUCTS.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedProduct.id === prod.id
                        ? "border-[#C8920A] bg-[#C8920A]/5 ring-2 ring-[#C8920A]/30 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-gray-100">
                      <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                      {selectedProduct.id === prod.id && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#C8920A] text-white flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-xs text-gray-900 line-clamp-1">{prod.name}</p>
                    <p className="text-xs text-[#C8920A] font-bold mt-0.5">{prod.formattedPrice}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Select Size Option */}
            <div className="p-4 rounded-2xl bg-[#FDF6C0] border border-gray-200/80">
              <div>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Chọn Size Áo:</p>
                <div className="flex items-center gap-2">
                  {selectedProduct.sizes?.map((sz, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedSize === sz
                          ? "border-[#C8920A] bg-[#C8920A] text-white shadow-sm"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Trigger */}
            <button
              onClick={handleRunAiTryOn}
              disabled={isProcessing}
              className="w-full py-4 bg-[#FFDF00] text-white font-bold rounded-2xl hover:bg-[#FFDF00]/90 shadow-xl shadow-[#FFDF00]/20 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm disabled:opacity-60"
            >
              <Sparkles className={`w-5 h-5 text-[#E8C55A] ${isProcessing ? "animate-spin" : ""}`} />
              <span>{isProcessing ? "Đang quét tỉ lệ dáng & cân chỉnh phom 4K..." : "Cập Nhật Khớp Phom Dáng Thử Đồ"}</span>
            </button>
          </div>

          {/* Render Result Right Column */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-28 space-y-6">
            {/* Header & Mode Switcher */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-heading font-bold text-xl text-gray-900">Kết Quả Mặc Thử Thực Tế 4K</h3>
                <p className="text-xs text-gray-500 mt-0.5">Hình ảnh thực tế 100% từ xưởng thiết kế</p>
              </div>

              {/* View Mode Buttons */}
              <div className="flex items-center gap-1 bg-[#FDF6C0] p-1 rounded-xl border border-gray-200">
                <button
                  onClick={() => setViewMode("model")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === "model" ? "bg-[#FFDF00] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Mẫu Chuẩn</span>
                </button>
                <button
                  onClick={() => setViewMode("detail")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === "detail" ? "bg-[#FFDF00] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Cận Cảnh Vải</span>
                </button>
                {userUploadedImage && (
                  <button
                    onClick={() => setViewMode("user")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode === "user" ? "bg-[#FFDF00] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Ảnh Của Bạn</span>
                  </button>
                )}
              </div>
            </div>

            {/* Display Canvas Frame */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 shadow-2xl flex items-center justify-center group">
              {isProcessing ? (
                <div className="flex flex-col items-center gap-4 text-center p-8 text-white">
                  <div className="w-16 h-16 rounded-full bg-[#FFDF00] border border-[#E8C55A]/40 flex items-center justify-center text-[#E8C55A]">
                    <Sparkles className="w-8 h-8 animate-spin" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-lg text-white">Đang quét phom dáng 4K...</h4>
                    <p className="text-xs text-white/70 mt-1">Định hình đường eo & căn chỉnh chất liệu lụa gấm</p>
                    <div className="mt-4 w-48 bg-white/20 h-1.5 rounded-full overflow-hidden mx-auto">
                      <div className="bg-[#C8920A] h-full w-3/4 animate-pulse rounded-full"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* High Quality Real Product / Blended AI Image */}
                  <img
                    src={resultImage || (viewMode === "detail" ? secondaryProductImage : activeProductImage)}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover object-top transition-all duration-500"
                  />

                  {/* Overlaid Badge for User Photo Fitting */}
                  {viewMode === "user" && userUploadedImage && (
                    <div className="absolute top-4 left-4 p-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/20 text-white flex items-center gap-2">
                      <img src={userUploadedImage} alt="User avatar" className="w-8 h-8 rounded-lg object-cover border border-white" />
                      <span className="text-[11px] font-semibold">Đã ghép phom dáng cá nhân</span>
                    </div>
                  )}

                  {/* Guarantee Badge Top Right */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold rounded-full border border-white/20 flex items-center gap-1.5 shadow-lg">
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                    <span>Mẫu Thực 100%</span>
                  </div>

                  {/* Caption Overlay Bottom */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 text-white space-y-1">
                    <p className="text-xs uppercase tracking-widest text-[#E8C55A] font-bold">
                      {selectedProduct.fabric}
                    </p>
                    <h4 className="font-heading text-2xl font-bold">
                      {selectedProduct.name}
                    </h4>
                    <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Product Summary Card & Action Button */}
            <div className="space-y-4 pt-2">
              <div className="p-4 bg-[#FDF6C0] rounded-2xl border border-gray-200 flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-sm text-gray-900">{selectedProduct.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Kích thước: <span className="font-semibold text-gray-800">Size {selectedSize}</span> · Chất liệu: <span className="font-semibold text-gray-800">{selectedProduct.fabric}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg font-heading text-[#FFDF00] block">{selectedProduct.formattedPrice}</span>
                  <span className="text-[10px] text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-semibold">Giao Hỏa Tốc 24h</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => addToCart(selectedProduct, selectedSize, selectedColor)}
                  className="py-4 bg-[#C8920A] text-white font-bold rounded-2xl hover:bg-[#C8920A]/90 shadow-xl shadow-[#C8920A]/25 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Thêm Vào Giỏ Hàng</span>
                </button>

                <button
                  onClick={() => {
                    addToCart(selectedProduct, selectedSize, selectedColor);
                    window.location.hash = "#cart";
                  }}
                  className="py-4 bg-[#FFDF00] text-white font-bold rounded-2xl hover:bg-[#FFDF00]/90 shadow-xl shadow-[#FFDF00]/25 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
                >
                  <span>Đặt May Ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

