import React, { useState } from "react";
import { Sparkles, Upload, User, Check, RefreshCw, ShoppingBag, ArrowRight } from "lucide-react";
import { PRODUCTS } from "../data/products";
import { useCart } from "../context/CartContext";

export default function TryOnPage({ selectedProductFromState }) {
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(selectedProductFromState || PRODUCTS[0]);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasTriedOn, setHasTriedOn] = useState(false);

  const avatars = [
    { name: "Người mẫu Thùy Trang", desc: "Chiều cao 1m68 · Dáng thon thanh tú", image: "/anh/746927465_122119237899355470_7558522641041819280_n.jpg" },
    { name: "Người mẫu Mai Chi", desc: "Chiều cao 1m62 · Dáng tròn đằm thắm", image: "/anh/747178293_122119072509355470_7986902361393680700_n.jpg" },
    { name: "Người mẫu Bích Ngọc", desc: "Chiều cao 1m65 · Dáng sang trọng", image: "/anh/754058094_122120859087355470_3079712870670515575_n.jpg" }
  ];

  const handleRunAiTryOn = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setHasTriedOn(true);
    }, 1500);
  };

  return (
    <div className="pt-28 pb-20 bg-[#FBF9F5] min-h-screen">
      <div className="container-page">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C85A32]/10 text-[#C85A32] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Phòng Xem Đồ AI (Virtual Try-on)</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Thử Áo Dài Direct Trên <span className="text-[#18392B] italic">Trí Tuệ Nhân Tạo</span>
          </h1>
          <p className="text-gray-600 mt-3 text-sm sm:text-base">
            Tải ảnh cá nhân hoặc chọn người mẫu chuẩn để ngắm tà áo dài ôm phom dáng 3D sống động trước khi quyết định đặt mua.
          </p>
        </div>

        {/* Step Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Left Column */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 space-y-8">
            {/* Step 1: Choose Avatar or Upload */}
            <div>
              <h3 className="font-heading font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#18392B] text-white text-xs font-sans flex items-center justify-center">1</span>
                Chọn Người Mẫu Hoặc Tải Ảnh Cá Nhân
              </h3>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {avatars.map((av, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSelectedAvatar(idx); setHasTriedOn(false); }}
                    className={`p-2 rounded-2xl border transition-all text-center cursor-pointer ${
                      selectedAvatar === idx
                        ? "border-[#18392B] bg-[#18392B]/5 ring-2 ring-[#18392B]/30"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={av.image} alt={av.name} className="w-full aspect-square object-cover rounded-xl mb-2" />
                    <p className="font-semibold text-xs text-gray-900 line-clamp-1">{av.name}</p>
                    <p className="text-[10px] text-gray-500 line-clamp-1">{av.desc}</p>
                  </button>
                ))}
              </div>

              {/* Upload Box */}
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-2xl text-center bg-[#FBF9F5] hover:border-[#18392B] transition-colors cursor-pointer">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-700">Tải Ảnh Toàn Thân Của Bạn (.jpg, .png)</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Ản bảo mật 100% · AI chỉ dùng để khớp phom áo dài</p>
              </div>
            </div>

            {/* Step 2: Choose Product */}
            <div>
              <h3 className="font-heading font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#18392B] text-white text-xs font-sans flex items-center justify-center">2</span>
                Chọn Mẫu Áo Dài Để Thử
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRODUCTS.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => { setSelectedProduct(prod); setHasTriedOn(false); }}
                    className={`p-2 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedProduct.id === prod.id
                        ? "border-[#C85A32] bg-[#C85A32]/5 ring-2 ring-[#C85A32]/30"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={prod.images[0]} alt={prod.name} className="w-full aspect-[3/4] object-cover rounded-xl mb-2" />
                    <p className="font-semibold text-xs text-gray-900 line-clamp-1">{prod.name}</p>
                    <p className="text-xs text-[#C85A32] font-bold mt-0.5">{prod.formattedPrice}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Trigger */}
            <button
              onClick={handleRunAiTryOn}
              disabled={isProcessing}
              className="w-full py-4 bg-[#18392B] text-white font-bold rounded-2xl hover:bg-[#18392B]/90 shadow-xl shadow-[#18392B]/20 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
            >
              <Sparkles className={`w-5 h-5 text-[#D4A373] ${isProcessing ? "animate-spin" : ""}`} />
              <span>{isProcessing ? "AI Đang Khớp Phom Áo Dài..." : "Chạy Thử Đồ Với AI Virtual Try-on"}</span>
            </button>
          </div>

          {/* Render Result Right Column */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-28 space-y-6">
            <h3 className="font-heading font-bold text-xl text-gray-900 flex items-center justify-between">
              <span>Kết Quả Thử Đồ AI Virtual Try-On</span>
              {hasTriedOn && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                  ✓ Hoàn tất ghép phom
                </span>
              )}
            </h3>

            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#FBF9F5] border border-gray-200 shadow-inner flex items-center justify-center">
              {isProcessing ? (
                <div className="flex flex-col items-center gap-4 text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-[#18392B] flex items-center justify-center text-[#D4A373]">
                    <Sparkles className="w-8 h-8 animate-spin" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-lg text-[#18392B]">Đang Xử Lý Thuật Toán AI...</h4>
                    <p className="text-xs text-gray-500 mt-1">Đang cân chỉnh nếp gấp lụa & đường may theo số đo người mẫu</p>
                  </div>
                </div>
              ) : (
                <img
                  src={hasTriedOn ? (selectedProduct?.images?.[0] || selectedProduct?.image || avatars[selectedAvatar]?.image) : avatars[selectedAvatar]?.image}
                  alt="Kết quả xem đồ AI"
                  className="w-full h-full object-cover transition-all duration-700"
                />
              )}
            </div>

            {hasTriedOn && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 bg-[#FBF9F5] rounded-2xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-gray-900">{selectedProduct.name}</h4>
                    <p className="text-xs text-gray-500">{selectedProduct.fabric} · Phom dáng ôm chuẩn</p>
                  </div>
                  <span className="font-bold text-base text-[#18392B]">{selectedProduct.formattedPrice}</span>
                </div>

                <button
                  onClick={() => addToCart(selectedProduct, "M", selectedProduct.colors?.[0]?.name)}
                  className="w-full py-4 bg-[#C85A32] text-white font-bold rounded-2xl hover:bg-[#C85A32]/90 shadow-xl shadow-[#C85A32]/25 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Mua Ngay Mẫu Áo Dài Này</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
