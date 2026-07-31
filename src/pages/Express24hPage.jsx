import React, { useState, useEffect } from "react";
import { Clock, Zap, ShieldCheck, Truck, Sparkles, MapPin, CheckCircle, ArrowRight, Filter, PhoneCall } from "lucide-react";
import { PRODUCTS } from "../data/products";
import ProductCard from "../components/common/ProductCard";
import { useCart } from "../context/CartContext";

export default function Express24hPage({ onTryOn, onRotate360 }) {
  const { showToast } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userLocation, setUserLocation] = useState("HCM");
  const [addressInput, setAddressInput] = useState("");
  const [isCheckingAddress, setIsCheckingAddress] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState(null);

  // Filter products prioritized for 24h delivery
  const expressProducts = PRODUCTS.filter((p) => p.isExpress24h);

  const displayedProducts = selectedCategory === "all"
    ? expressProducts
    : expressProducts.filter((p) => p.category === selectedCategory);

  // Live Countdown timer to end of today's 16:00 order deadline
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
        method: "Shipper Hỏa Tốc VIP (Đóng gói hộp quà DaiVerse Luxury)",
        location: addressInput
      });
      showToast("Khả dụng cho giao hỏa tốc 24H tại địa chỉ của bạn!");
    }, 800);
  };

  return (
    <div className="pt-28 pb-20 bg-[#FBF9F5] min-h-screen">
      {/* Hero Header Section */}
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#18392B] via-[#1c4434] to-[#0f251c] text-white p-8 sm:p-12 shadow-2xl mb-12 border border-[#D4A373]/30">
          {/* Subtle Background Art */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-[#C85A32]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#D4A373]/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C85A32] text-white text-xs font-bold uppercase tracking-wider shadow-lg animate-pulse">
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Dịch Vụ Ưu Tiên — Giao Hỏa Tốc 24H</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight text-[#FBF9F5]">
                Đặt Hàng & Nhận Áo Dài <br />
                <span className="text-[#D4A373] italic">Trong Vòng 24 Giờ</span>
              </h1>

              <p className="text-gray-200 text-sm sm:text-base leading-relaxed max-w-xl">
                Dành riêng cho những sự kiện quan trọng, tiệc cưới & lễ hội gấp. Mẫu áo dài may sẵn theo phom chuẩn mực cao cấp, hỗ trợ bóp eo/tà thần tốc & ship hỏa tốc tận nhà.
              </p>

              {/* Countdown Banner */}
              <div className="inline-flex flex-wrap items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs sm:text-sm">
                  <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Thời gian còn lại để nhận trong ngày:</span>
                </div>
                <div className="flex items-center gap-2 text-white font-mono font-bold text-lg sm:text-xl">
                  <span className="px-2.5 py-1 bg-black/40 rounded-lg border border-white/20">
                    {String(timeLeft.hours).padStart(2, "0")}h
                  </span>
                  <span>:</span>
                  <span className="px-2.5 py-1 bg-black/40 rounded-lg border border-white/20">
                    {String(timeLeft.minutes).padStart(2, "0")}m
                  </span>
                  <span>:</span>
                  <span className="px-2.5 py-1 bg-[#C85A32] rounded-lg border border-white/20 text-white">
                    {String(timeLeft.seconds).padStart(2, "0")}s
                  </span>
                </div>
              </div>
            </div>

            {/* Address Checker Box */}
            <div className="lg:col-span-5 bg-white/95 text-gray-900 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/40">
              <h3 className="font-heading font-bold text-lg text-[#18392B] flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-[#C85A32]" />
                <span>Kiểm tra giao hỏa tốc tận nơi</span>
              </h3>
              <p className="text-xs text-gray-600 mb-4">
                Nhập địa chỉ giao hàng để kiểm tra thời gian nhận áo chính xác nhất.
              </p>

              <form onSubmit={handleCheckDelivery} className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Ví dụ: 123 Lê Lợi, Quận 1, TP.HCM..."
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FBF9F5] border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#18392B]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCheckingAddress}
                  className="w-full py-3 bg-[#18392B] text-white font-bold rounded-xl text-xs sm:text-sm hover:bg-[#18392B]/90 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  {isCheckingAddress ? (
                    <span>Đang kiểm tra...</span>
                  ) : (
                    <>
                      <span>Tra cứu tốc độ giao 24H</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {deliveryResult && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1 animate-fade-in">
                  <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{deliveryResult.time}</span>
                  </p>
                  <p className="text-gray-600 pl-5">{deliveryResult.method}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3 Core Commitments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#C85A32]/10 text-[#C85A32] flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-gray-900 text-base mb-1">Giao Hàng Trong 24h</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Đơn hàng ưu tiên được đóng gói và vận chuyển hỏa tốc ngay lập tức trong khu vực nội thành.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#18392B]/10 text-[#18392B] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-gray-900 text-base mb-1">Hỗ Trợ Chỉnh Size Tốc Độ</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Nghệ nhân may đo hỗ trợ chỉnh hạ tà & eo chuẩn theo thông số cá nhân chỉ trong 2-3 giờ.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-gray-900 text-base mb-1">Thử Tại Nhà & Đổi Size</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Shipper đợi thử đồ trực tiếp, không vừa đổi size thần tốc ngay trong buổi.
              </p>
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C85A32] font-bold block mb-1">
              Danh Mục Ưu Tiên Giao Ngay
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-900">
              Sản Phẩm Đặt Hàng 24H Hot Nhất
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-[#18392B] text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Tất Cả Sẵn 24H ({expressProducts.length})
            </button>
            <button
              onClick={() => setSelectedCategory("theu-tay")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === "theu-tay"
                  ? "bg-[#18392B] text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Áo Dài Thêu Tay
            </button>
            <button
              onClick={() => setSelectedCategory("cuoi")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === "cuoi"
                  ? "bg-[#18392B] text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Áo Dài Cưới
            </button>
            <button
              onClick={() => setSelectedCategory("truyen-thong")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === "truyen-thong"
                  ? "bg-[#18392B] text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              Truyền Thống & Lụa
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
              />
              {/* Express Tag line */}
              <div className="mt-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] font-medium text-amber-900 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#C85A32]" />
                  <span>{product.expressTag || "Giao hỏa tốc trong 24h"}</span>
                </span>
                <span className="text-[#C85A32] font-bold">24H</span>
              </div>
            </div>
          ))}
        </div>

        {/* Express Support Hotline Bar */}
        <div className="mt-16 bg-white p-8 rounded-3xl border border-gray-200 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#C85A32] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#C85A32]/30">
              <PhoneCall className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-gray-900">Cần tư vấn chọn size & giao gấp?</h3>
              <p className="text-xs text-gray-600 mt-1">
                Đội ngũ stylist DaiVerse sẵn sàng hỗ trợ bạn đo dáng và ship áo siêu tốc 24/7.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href="tel:0909123456"
              className="px-6 py-3 bg-[#18392B] text-white font-bold text-sm rounded-xl hover:bg-[#18392B]/90 transition-all shadow-md"
            >
              Hotline 24/7: 0909 123 456
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
