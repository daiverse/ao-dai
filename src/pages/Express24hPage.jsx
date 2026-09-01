import React, { useState, useEffect } from "react";
import { Clock, Zap, ShieldCheck, Truck, Sparkles, MapPin, CheckCircle, ArrowRight, PhoneCall } from "lucide-react";
import { PRODUCTS } from "../data/products";
import ProductCard from "../components/common/ProductCard";
import { useCart } from "../context/CartContext";

export default function Express24hPage({ onTryOn, onRotate360 }) {
  const { showToast } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [addressInput, setAddressInput] = useState("");
  const [isCheckingAddress, setIsCheckingAddress] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState(null);

  // Filter products prioritized for 24h delivery
  const expressProducts = PRODUCTS.filter((p) => p.isExpress24h);

  const displayedProducts = selectedCategory === "all"
    ? expressProducts
    : expressProducts.filter((p) => p.category === selectedCategory);

  // Live Countdown timer to end of today's order deadline
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckDelivery = (e) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    setIsCheckingAddress(true);
    setDeliveryResult(null);

    setTimeout(() => {
      setIsCheckingAddress(false);
      setDeliveryResult({
        status: "success",
        time: "Dự kiến giao trước 17:30 chiều mai",
        method: "Shipper Hỏa Tốc DaiVerse VIP (Hộp quà Luxury DaiVerse)",
        location: addressInput
      });
      showToast("Khả dụng cho giao hỏa tốc 24H tại địa chỉ của bạn!");
    }, 800);
  };

  return (
    <div className="pt-32 sm:pt-36 pb-20 bg-white min-h-screen">

      {/* Hero Header Section */}
      <div className="container-page">
        <div className="relative overflow-hidden bg-[#111111] text-white p-8 sm:p-12 shadow-xl mb-10 border-b-2 border-[#C5A059]">
          <img 
            src="/anh/thanh-phong/banner.png" 
            alt="Express 24h Banner" 
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/70 to-transparent"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059] text-white text-[10px] font-extrabold uppercase tracking-widest">
                <Zap className="w-4 h-4 text-white" />
                <span>DaiVerse EXPRESS 24H — DỊCH VỤ GIAO HỎA TỐC</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl font-black leading-tight text-white uppercase tracking-wide">
                ĐẶT HÀNG & NHẬN ÁO DÀI <br />
                <span className="text-[#C5A059]">TRONG VÒNG 24 GIỜ</span>
              </h1>

              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed max-w-xl font-normal">
                Dành riêng cho những sự kiện quan trọng, tiệc cưới & lễ hội gấp. Mẫu áo dài DaiVerse thiết kế chuẩn phom dáng cao cấp, giao hỏa tốc tận tay.
              </p>

              {/* Countdown Banner */}
              <div className="inline-flex flex-wrap items-center gap-4 bg-neutral-900 p-4 border border-neutral-800">
                <div className="flex items-center gap-2 text-neutral-300 font-bold text-xs uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-[#C5A059]" />
                  <span>CÒN LẠI ĐỂ GIAO TRONG NGÀY:</span>
                </div>
                <div className="flex items-center gap-2 text-white font-mono font-bold text-base">
                  <span className="px-2 py-1 bg-black border border-neutral-700">
                    {String(timeLeft.hours).padStart(2, "0")}h
                  </span>
                  <span>:</span>
                  <span className="px-2 py-1 bg-black border border-neutral-700">
                    {String(timeLeft.minutes).padStart(2, "0")}m
                  </span>
                  <span>:</span>
                  <span className="px-2 py-1 bg-[#C5A059] text-white">
                    {String(timeLeft.seconds).padStart(2, "0")}s
                  </span>
                </div>
              </div>
            </div>

            {/* Address Checker Box */}
            <div className="lg:col-span-5 bg-white text-[#111111] p-6 shadow-2xl border border-neutral-300">
              <h3 className="font-heading font-black text-base text-[#111111] uppercase tracking-wide flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-[#C5A059]" />
                <span>KIỂM TRA GIAO TẬN NƠI</span>
              </h3>
              <p className="text-xs text-neutral-600 mb-4 font-normal">
                Nhập địa chỉ giao hàng để tra cứu thời gian nhận hàng chính xác.
              </p>

              <form onSubmit={handleCheckDelivery} className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="VD: Số 18 Tràng Tiền, Hoàn Kiếm..."
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 text-xs focus:outline-none focus:border-[#111111]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCheckingAddress}
                  className="w-full py-3 bg-[#111111] hover:bg-[#C5A059] text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                  {isCheckingAddress ? (
                    <span>ĐANG KIỂM TRA...</span>
                  ) : (
                    <>
                      <span>TRA CỨU TỐC ĐỘ GIAO</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {deliveryResult && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 space-y-1 animate-fade-in">
                  <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{deliveryResult.time}</span>
                  </p>
                  <p className="text-neutral-600 pl-5 text-[11px]">{deliveryResult.method}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3 Core Commitments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-neutral-50 p-5 border border-neutral-300 flex items-start gap-3">
            <div className="w-10 h-10 bg-[#111111] text-white flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h4 className="font-heading font-black text-[#111111] text-xs uppercase mb-1">GIAO HÀNG TRONG 24H</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Đơn hàng ưu tiên được vận chuyển hỏa tốc ngay lập tức.
              </p>
            </div>
          </div>

          <div className="bg-neutral-50 p-5 border border-neutral-300 flex items-start gap-3">
            <div className="w-10 h-10 bg-[#111111] text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h4 className="font-heading font-black text-[#111111] text-xs uppercase mb-1">CHỈNH SIZE THẦN TỐC</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Hỗ trợ chỉnh sửa thông số eo/tà chuẩn dáng trong 2h.
              </p>
            </div>
          </div>

          <div className="bg-neutral-50 p-5 border border-neutral-300 flex items-start gap-3">
            <div className="w-10 h-10 bg-[#111111] text-white flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h4 className="font-heading font-black text-[#111111] text-xs uppercase mb-1">THỬ TẠI NHÀ & ĐỔI TRẢ</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Cho phép thử đồ trực tiếp và hỗ trợ đổi size linh hoạt.
              </p>
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-neutral-200 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C5A059] font-extrabold block mb-1">
              DANH MỤC ƯU TIÊN GIAO NGAY
            </span>
            <h2 className="font-heading text-2xl font-black text-[#111111] uppercase">
              SẢN PHẨM SẴN CÓ 24H
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                selectedCategory === "all"
                  ? "bg-[#111111] text-white border-[#111111]"
                  : "bg-white text-neutral-700 border-neutral-300"
              }`}
            >
              TẤT CẢ ({expressProducts.length})
            </button>

            <button
              onClick={() => setSelectedCategory("cuoi")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                selectedCategory === "cuoi"
                  ? "bg-[#111111] text-white border-[#111111]"
                  : "bg-white text-neutral-700 border-neutral-300"
              }`}
            >
              ÁO DÀI CƯỚI
            </button>
            <button
              onClick={() => setSelectedCategory("truyen-thong")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                selectedCategory === "truyen-thong"
                  ? "bg-[#111111] text-white border-[#111111]"
                  : "bg-white text-neutral-700 border-neutral-300"
              }`}
            >
              TRUYỀN THỐNG
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {displayedProducts.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard
                product={product}
                onTryOn={onTryOn}
                onRotate360={onRotate360}
                isExpressContext={true}
              />
              {/* Express Tag line */}
              <div className="mt-2 px-3 py-1.5 bg-neutral-100 border border-neutral-300 text-[11px] font-bold text-[#111111] flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{product.expressTag || "Giao hỏa tốc 24h"}</span>
                </span>
                <span className="text-[#C5A059] font-extrabold">24H</span>
              </div>
            </div>
          ))}
        </div>

        {/* Express Support Hotline Bar */}
        <div className="mt-14 bg-[#111111] text-white p-6 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#C5A059] text-white flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg uppercase text-white">CẦN HỖ TRỢ GIAO GẤP TRONG NGÀY?</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Đội ngũ tư vấn DaiVerse sẵn sàng hỗ trợ chọn size và ship hỏa tốc 24/7.
              </p>
            </div>
          </div>
          <a
            href="tel:0394961557"
            className="px-6 py-3 bg-[#C5A059] hover:bg-[#A4813D] text-white font-bold text-xs uppercase tracking-widest transition-all border-none"
          >
            HOTLINE: 0394.961.557
          </a>
        </div>
      </div>
    </div>
  );
}

