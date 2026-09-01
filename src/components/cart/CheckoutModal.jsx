import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Truck,
  Zap,
  Clock,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  ChevronRight,
  Copy,
  ArrowLeft,
  Sparkles,
  MapPin,
  Phone,
  User,
  FileText,
  ExternalLink,
  QrCode,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config/api";

export default function CheckoutModal({ isOpen, onClose }) {
  const { cart, totalPrice, formattedTotalPrice, removeFromCart } = useCart();
  const { user, token, isAuthenticated, openAuthModal } = useAuth();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment & QR, 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Shipping Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Hà Nội");
  const [note, setNote] = useState("");
  const [shippingOption, setShippingOption] = useState("fast"); // 'standard' | 'fast' | 'express'

  // Payment Method State: 'COD' | 'PAYOS' | 'BANK'
  const [paymentMethod, setPaymentMethod] = useState("PAYOS");
  const [createdOrder, setCreatedOrder] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  // PayOS QR States
  const [payOsData, setPayOsData] = useState(null);
  const [isPayOsLoading, setIsPayOsLoading] = useState(false);
  const [payOsStatus, setPayOsStatus] = useState("PENDING"); // 'PENDING' | 'PAID' | 'CANCELLED'
  const pollingTimerRef = useRef(null);

  // Autofill user info if logged in
  useEffect(() => {
    if (user && isOpen) {
      if (user.name) setFullName(user.name);
      if (user.phone) setPhone(user.phone);
    }
  }, [user, isOpen]);

  // Clean up polling timer
  useEffect(() => {
    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  // Danh sách Phương Thức Giao Hàng & Phí Vận Chuyển
  const shippingRates = {
    standard: {
      id: "standard",
      name: "Giao Tiêu Chuẩn (3 - 5 ngày)",
      badge: "FREESHIP 500K",
      desc: "Vận chuyển đường bộ tiêu chuẩn toàn quốc",
      fee: totalPrice >= 500000 || totalPrice === 0 ? 0 : 30000,
      feeText: totalPrice >= 500000 || totalPrice === 0 ? "Miễn phí (Freeship)" : "30.000 đ",
      icon: Truck,
    },
    fast: {
      id: "fast",
      name: "Giao Nhanh (1 - 2 ngày)",
      badge: "DaiVerse FAST",
      desc: "Vận chuyển hàng không / đường bộ ưu tiên",
      fee: 50000,
      feeText: "50.000 đ",
      icon: Zap,
    },
    express: {
      id: "express",
      name: "Giao Hỏa Tốc (2h - 24h) ⚡",
      badge: "DaiVerse 24H VIP",
      desc: "Shipper riêng giao tận tay + Hộp quà Luxury DaiVerse",
      fee: 90000,
      feeText: "90.000 đ",
      icon: Clock,
    },
  };

  const selectedShipping = shippingRates[shippingOption] || shippingRates.fast;
  const shippingFee = selectedShipping.fee;
  const finalTotal = totalPrice + shippingFee;

  const formattedFinalTotal = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(finalTotal);

  // Khởi tạo thông tin PayOS QR Link
  const handleGeneratePayOsLink = async () => {
    setIsPayOsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/payos/create-payment-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotal,
          description: `May ao dai DV-${Date.now().toString().slice(-6)}`,
          items: cart.map((item) => ({
            name: item.product?.name || item.name || "Áo Dài Thiết Kế",
            quantity: item.quantity || 1,
            price: item.product?.price || item.price || finalTotal,
          })),
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setPayOsData(data.data);
        startPollingPayOsStatus(data.data.orderCode);
      }
    } catch (err) {
      console.error("Lỗi PayOS Client:", err);
    } finally {
      setIsPayOsLoading(false);
    }
  };

  // Tự động kiểm tra trạng thái thanh toán PayOS định kỳ 3 giây/lần
  const startPollingPayOsStatus = (orderCode) => {
    if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);

    pollingTimerRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/payos/order-status/${orderCode}`);
        const data = await res.json();

        if (data.success && data.status === "PAID") {
          setPayOsStatus("PAID");
          clearInterval(pollingTimerRef.current);
          autoCompletePayOsOrder();
        }
      } catch (err) {}
    }, 3000);
  };

  // Tự động chuyển màn hình thành công khi PayOS quét thành công
  const autoCompletePayOsOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderItems: cart.map((item) => ({
            product: item.product?._id || item.product?.id || null,
            name: item.product?.name || item.name,
            image: item.product?.images?.[0] || item.image || "",
            price: item.product?.price || item.price,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            isCustomAi: item.isCustomAi || item.product?.isCustomAi || false,
            customOptions: item.customOptions || item.product?.customOptions || {},
            customPrompt: item.customPrompt || item.product?.customPrompt || "",
            baseAoDaiName: item.baseAoDaiName || item.product?.baseAoDaiName || "",
            aiGeneratedImage: item.aiGeneratedImage || item.product?.aiGeneratedImage || "",
            tryOnImage: item.tryOnImage || item.product?.tryOnImage || "",
          })),
          shippingAddress: { fullName, phone, address, city, note, shippingMethod: selectedShipping.name },
          paymentMethod: "PAYOS",
          itemsPrice: totalPrice,
          shippingFee,
          totalAmount: finalTotal,
        }),
      });

      const data = await res.json();
      if (data.order) {
        setCreatedOrder(data.order);
        setStep(3);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  // Submit Order thủ công (COD hoặc khi bấm xác nhận)
  const handleCreateOrder = async (e) => {
    if (e) e.preventDefault();

    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }

    if (!fullName || !phone || !address) {
      setError("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const orderItems = cart.map((item) => ({
        product: item.product?._id || item.product?.id || null,
        name: item.product?.name || item.name,
        image: item.product?.images?.[0] || item.image || "",
        price: item.product?.price || item.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        isCustomAi: item.isCustomAi || item.product?.isCustomAi || false,
        customOptions: item.customOptions || item.product?.customOptions || {},
        customPrompt: item.customPrompt || item.product?.customPrompt || "",
        baseAoDaiName: item.baseAoDaiName || item.product?.baseAoDaiName || "",
        aiGeneratedImage: item.aiGeneratedImage || item.product?.aiGeneratedImage || "",
        tryOnImage: item.tryOnImage || item.product?.tryOnImage || "",
      }));

      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress: { fullName, phone, address, city, note, shippingMethod: selectedShipping.name },
          paymentMethod,
          itemsPrice: totalPrice,
          shippingFee,
          totalAmount: finalTotal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Đặt hàng thất bại.");
      }

      setCreatedOrder(data.order);
      setStep(3);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi tạo đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMemo = (text) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-none shadow-2xl overflow-hidden border border-neutral-300 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white bg-transparent hover:bg-[#C5A059] transition-all z-10 border-none cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Step Indicator */}
        <div className="bg-[#111111] p-6 text-white text-center shrink-0 border-b-2 border-[#C5A059]">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#C5A059] text-white text-[10px] font-extrabold uppercase tracking-widest mb-2">
            DaiVerse FASHION CHECKOUT
          </div>
          <h2 className="font-heading text-xl font-black uppercase tracking-wider text-white">
            {step === 1 && "1. THÔNG TIN GIAO HÀNG"}
            {step === 2 && "2. CỔNG THANH TOÁN QR PAYOS"}
            {step === 3 && "3. ĐẶT HÀNG THÀNH CÔNG!"}
          </h2>

          {/* Steps Progress */}
          <div className="flex items-center justify-center gap-3 mt-3 text-[11px] font-bold uppercase tracking-wider">
            <span className={`px-2.5 py-0.5 ${step >= 1 ? "bg-[#C5A059] text-white" : "bg-neutral-800 text-neutral-400"}`}>
              1. ĐỊA CHỈ
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
            <span className={`px-2.5 py-0.5 ${step >= 2 ? "bg-[#C5A059] text-white" : "bg-neutral-800 text-neutral-400"}`}>
              2. THANH TOÁN
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
            <span className={`px-2.5 py-0.5 ${step === 3 ? "bg-emerald-600 text-white" : "bg-neutral-800 text-neutral-400"}`}>
              3. HOÀN TẤT
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-white">
          {error && (
            <div className="p-3 text-xs text-[#C5A059] bg-rose-50 border border-rose-200 font-semibold">
              ⚠️ {error}
            </div>
          )}

          {/* ──────────────── BƯỚC 1: ĐỊA CHỈ GIAO HÀNG ──────────────── */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Họ và tên người nhận</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-300 text-xs font-semibold focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Số điện thoại nhận hàng</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="0912 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-300 text-xs font-semibold focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Tỉnh / Thành phố</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 text-xs font-semibold focus:outline-none focus:border-[#111111]"
                >
                  <option value="Hà Nội">Hà Nội (Giao hỏa tốc 2h - 24h)</option>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh (Giao 1 - 2 ngày)</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Khác">Tỉnh thành khác</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Địa chỉ chi tiết (Số nhà, tên đường)</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="VD: Số 18 Tràng Tiền, Hoàn Kiếm"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-300 text-xs font-semibold focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Ghi chú cho DaiVerse / shipper (Tùy chọn)</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    placeholder="VD: Giao giờ hành chính..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              {/* LỰA CHỌN PHƯƠNG THỨC GIAO HÀNG */}
              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                  Chọn Phương Thức Vận Chuyển:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.values(shippingRates).map((opt) => {
                    const isSelected = shippingOption === opt.id;
                    const IconComponent = opt.icon;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setShippingOption(opt.id)}
                        className={`p-3 border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? "border-[#111111] bg-neutral-100"
                            : "border-neutral-200 hover:border-neutral-400 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-none flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-[#111111] text-white" : "bg-neutral-200 text-neutral-600"
                          }`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-xs text-[#111111] truncate">{opt.name}</p>
                              {opt.badge && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-[#C5A059] text-white uppercase shrink-0">
                                  {opt.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-neutral-500 truncate mt-0.5">{opt.desc}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`font-bold text-xs ${isSelected ? "text-[#C5A059]" : "text-neutral-700"}`}>
                            {opt.feeText}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!fullName || !phone || !address) {
                    setError("Vui lòng điền đủ Họ tên, Số điện thoại và Địa chỉ.");
                    return;
                  }
                  setError("");
                  setStep(2);
                  handleGeneratePayOsLink();
                }}
                className="w-full py-3.5 bg-[#111111] hover:bg-[#C5A059] text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer border-none mt-4"
              >
                <span>Tiếp Tục: Chọn Phương Thức Thanh Toán</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ──────────────── BƯỚC 2: PHƯƠNG THỨC THANH TOÁN ──────────────── */}
          {step === 2 && (
            <form onSubmit={handleCreateOrder} className="space-y-4">
              {/* Tóm tắt tổng tiền */}
              <div className="p-4 bg-neutral-50 border border-neutral-300 space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Sản phẩm ({cart.length}):</span>
                  <span className="font-bold text-[#111111]">{formattedTotalPrice}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Phí giao hàng:</span>
                  <span className="font-bold text-[#C5A059]">{selectedShipping.feeText}</span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between items-center font-bold text-sm">
                  <span className="text-[#111111]">TỔNG CỘNG:</span>
                  <span className="text-base text-[#C5A059] font-heading font-black">{formattedFinalTotal}</span>
                </div>
              </div>

              {/* Lựa chọn phương thức thanh toán */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                  Chọn Phương Thức Thanh Toán:
                </label>

                {/* 1. PAYOS VIETQR */}
                <label
                  onClick={() => setPaymentMethod("PAYOS")}
                  className={`p-3.5 border flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === "PAYOS"
                      ? "border-[#111111] bg-neutral-100"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "PAYOS"}
                    onChange={() => setPaymentMethod("PAYOS")}
                    className="accent-[#111111]"
                  />
                  <div className="w-8 h-8 bg-[#111111] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-xs text-[#111111] uppercase">Quét Mã QR PayOS (Auto 24/7)</p>
                      <span className="bg-[#C5A059] text-white text-[9px] px-1.5 py-0.5 font-bold uppercase">
                        Khuyên Dùng
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">Tự động xác nhận khớp đơn hàng sau khi quét QR</p>
                  </div>
                </label>

                {/* 2. COD */}
                <label
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-3.5 border flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-[#111111] bg-neutral-100"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="accent-[#111111]"
                  />
                  <div className="w-8 h-8 bg-neutral-200 text-neutral-700 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-[#111111] uppercase">Thanh Toán Khi Nhận Hàng (COD)</p>
                    <p className="text-[11px] text-neutral-500">Thanh toán trực tiếp cho nhân viên giao hàng</p>
                  </div>
                </label>
              </div>

              {/* KHUNG HIỂN THỊ MÃ QR PAYOS TỰ ĐỘNG */}
              {paymentMethod === "PAYOS" && (
                <div className="p-4 bg-white border border-neutral-300 text-center space-y-3 animate-fade-in shadow-xs">
                  {isPayOsLoading ? (
                    <div className="py-6 flex flex-col items-center gap-2">
                      <RefreshCw className="w-6 h-6 text-[#111111] animate-spin" />
                      <p className="text-xs text-neutral-600 font-bold uppercase">Đang tải mã QR PayOS...</p>
                    </div>
                  ) : (
                    <>
                      <div className="relative w-44 h-44 bg-white p-2 border border-neutral-300 mx-auto shadow-sm">
                        <img
                          src={
                            payOsData?.qrCode
                              ? payOsData.qrCode.startsWith("http") || payOsData.qrCode.startsWith("data:")
                                ? payOsData.qrCode
                                : `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(payOsData.qrCode)}`
                              : `https://img.vietqr.io/image/mb-0394961557-compact2.png?amount=${finalTotal}&addInfo=DV-AODAI&accountName=LE%20THI%20VAN%20ANH`
                          }
                          alt="VietQR PayOS Code"
                          className="w-full h-full object-contain"
                        />
                        {payOsStatus === "PAID" && (
                          <div className="absolute inset-0 bg-emerald-700/90 text-white flex flex-col items-center justify-center gap-1 font-bold">
                            <CheckCircle2 className="w-8 h-8" />
                            <span className="text-xs uppercase">Đã Nhận Chuyển Khoản!</span>
                          </div>
                        )}
                      </div>

                      <div className="text-xs space-y-1">
                        <p className="font-bold text-[#111111]">
                          STK MB: <span className="text-[#C5A059] font-mono text-sm">{payOsData?.accountNumber || "0394961557"}</span>
                        </p>
                        <p className="text-neutral-600">Chủ TK: {payOsData?.accountName || "DaiVerse FASHION AO DAI"}</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border-none flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 bg-[#111111] hover:bg-[#C5A059] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border-none disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    <span>XÁC NHẬN ĐẶT HÀNG</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ──────────────── BƯỚC 3: ĐẶT HÀNG THÀNH CÔNG ──────────────── */}
          {step === 3 && createdOrder && (
            <div className="text-center p-6 space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-[#111111] text-[#C5A059] rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h3 className="font-heading font-black text-xl text-[#111111] uppercase tracking-wide">ĐẶT HÀNG THÀNH CÔNG!</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Cảm ơn bạn đã lựa chọn sản phẩm Áo Dài từ <strong>DaiVerse</strong>.
                </p>
              </div>

              <div className="p-4 bg-neutral-50 border border-neutral-300 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Mã đơn hàng:</span>
                  <span className="font-bold text-[#111111]">{createdOrder.orderCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Người nhận:</span>
                  <span className="font-semibold text-neutral-900">{createdOrder.shippingAddress?.fullName} ({createdOrder.shippingAddress?.phone})</span>
                </div>
                <div className="flex justify-between border-t border-neutral-200 pt-2">
                  <span className="text-neutral-500">Tổng thanh toán:</span>
                  <span className="font-bold text-[#C5A059] text-sm">{formattedFinalTotal}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  setStep(1);
                }}
                className="w-full py-3.5 bg-[#111111] hover:bg-[#C5A059] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border-none"
              >
                Tiếp Tục Mua Sắm Tại DaiVerse
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

