import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Truck,
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

  // Tính phí vận chuyển (Miễn phí từ 1.000.000đ)
  const shippingFee = totalPrice >= 1000000 || totalPrice === 0 ? 0 : 30000;
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
      const res = await fetch("http://localhost:5000/api/payos/create-payment-link", {
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
        const res = await fetch(`http://localhost:5000/api/payos/order-status/${orderCode}`);
        const data = await res.json();

        if (data.success && data.status === "PAID") {
          setPayOsStatus("PAID");
          clearInterval(pollingTimerRef.current);
          // Tự động tạo đơn hàng hoàn tất
          autoCompletePayOsOrder();
        }
      } catch (err) {}
    }, 3000);
  };

  // Tự động chuyển màn hình thành công khi PayOS quét thành công
  const autoCompletePayOsOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderItems: cart.map((item) => ({
            product: item.product?._id || item.product?.id,
            name: item.product?.name || item.name,
            image: item.product?.images?.[0] || item.image || "",
            price: item.product?.price || item.price,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          })),
          shippingAddress: { fullName, phone, address, city, note },
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
        product: item.product?._id || item.product?.id,
        name: item.product?.name || item.name,
        image: item.product?.images?.[0] || item.image || "",
        price: item.product?.price || item.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      }));

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress: { fullName, phone, address, city, note },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-all z-10 border-none cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Step Indicator */}
        <div className="bg-gradient-to-r from-[#18392B] to-[#0F241B] p-6 text-white text-center shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#D4A373] text-[11px] font-bold uppercase tracking-wider mb-2 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" /> DaiVerse Checkout
          </div>
          <h2 className="font-heading text-2xl font-bold">
            {step === 1 && "Thông Tin Giao Hàng"}
            {step === 2 && "Cổng Thanh Toán QR PayOS"}
            {step === 3 && "Đặt Hàng Thành Công!"}
          </h2>

          {/* Steps Progress */}
          <div className="flex items-center justify-center gap-3 mt-4 text-xs font-bold">
            <span className={`px-3 py-1 rounded-full ${step >= 1 ? "bg-[#C85A32] text-white" : "bg-white/10 text-white/60"}`}>
              1. Địa Chỉ
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            <span className={`px-3 py-1 rounded-full ${step >= 2 ? "bg-[#C85A32] text-white" : "bg-white/10 text-white/60"}`}>
              2. Thanh Toán QR
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            <span className={`px-3 py-1 rounded-full ${step === 3 ? "bg-emerald-600 text-white" : "bg-white/10 text-white/60"}`}>
              3. Hoàn Tất
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl">
              ⚠️ {error}
            </div>
          )}

          {/* ──────────────── BƯỚC 1: ĐỊA CHỈ GIAO HÀNG ──────────────── */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Họ và tên người nhận</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#FBF9F5] border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#C85A32]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Số điện thoại nhận hàng</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="0912 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#FBF9F5] border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#C85A32]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">Tỉnh / Thành phố</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FBF9F5] border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#C85A32]"
                >
                  <option value="Hà Nội">Hà Nội (Giao hỏa tốc 2h - 24h)</option>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh (Giao 1 - 2 ngày)</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Khác">Tỉnh thành khác</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">Địa chỉ chi tiết (Số nhà, tên đường)</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="VD: Số 18 Tràng Tiền, Hoàn Kiếm"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FBF9F5] border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#C85A32]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">Ghi chú cho thợ may / shipper (Tùy chọn)</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    placeholder="VD: May gấp tà áo dài 140cm, giao giờ hành chính"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#FBF9F5] border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#C85A32]"
                  />
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
                className="w-full py-3.5 bg-[#18392B] hover:bg-[#18392B]/90 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-none mt-4"
              >
                <span>Tiếp Tục: Chọn Phương Thức Thanh Toán</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ──────────────── BƯỚC 2: PHƯƠNG THỨC THANH TOÁN ──────────────── */}
          {step === 2 && (
            <form onSubmit={handleCreateOrder} className="space-y-5">
              {/* Tóm tắt tổng tiền */}
              <div className="p-4 bg-[#FBF9F5] rounded-2xl border border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Tiền hàng ({cart.length} sản phẩm):</span>
                  <span className="font-semibold text-gray-900">{formattedTotalPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span className="font-semibold text-emerald-700">
                    {shippingFee === 0 ? "Miễn phí (Freeship)" : "30.000 đ"}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between items-center font-bold text-sm">
                  <span className="text-gray-900">TỔNG THÀNH TIỀN:</span>
                  <span className="text-base text-[#18392B] font-heading">{formattedFinalTotal}</span>
                </div>
              </div>

              {/* Lựa chọn phương thức thanh toán */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Chọn Phương Thức Thanh Toán:
                </label>

                {/* 1. PAYOS VIETQR AUTO */}
                <label
                  onClick={() => setPaymentMethod("PAYOS")}
                  className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === "PAYOS"
                      ? "border-[#005baa] bg-[#005baa]/5 ring-2 ring-[#005baa]/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "PAYOS"}
                    onChange={() => setPaymentMethod("PAYOS")}
                    className="accent-[#005baa]"
                  />
                  <div className="w-9 h-9 rounded-xl bg-[#005baa] text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-sm">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-xs text-gray-900">Thanh Toán QR PayOS (Tự Động 24/7)</p>
                      <span className="bg-[#005baa] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                        Khuyên Dùng
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Quét mã QR tự động nhận diện khớp đơn 100% bằng ngân hàng bất kỳ (VietQR, MB, VCB)
                    </p>
                  </div>
                </label>

                {/* 2. COD */}
                <label
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-[#18392B] bg-[#18392B]/5 ring-2 ring-[#18392B]/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="accent-[#18392B]"
                  />
                  <div className="w-9 h-9 rounded-xl bg-[#18392B]/10 text-[#18392B] flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-gray-900">Thanh toán khi nhận hàng (COD)</p>
                    <p className="text-[11px] text-gray-500">Kiểm tra sản phẩm vừa vặn mới thanh toán cho shipper</p>
                  </div>
                </label>
              </div>

              {/* KHUNG HIỂN THỊ MÃ QR PAYOS TỰ ĐỘNG */}
              {paymentMethod === "PAYOS" && (
                <div className="p-5 bg-white border-2 border-dashed border-[#005baa]/30 rounded-2xl text-center space-y-3 animate-fadeIn shadow-sm">
                  {isPayOsLoading ? (
                    <div className="py-8 flex flex-col items-center gap-2">
                      <RefreshCw className="w-8 h-8 text-[#005baa] animate-spin" />
                      <p className="text-xs text-gray-600 font-semibold">Đang kết nối cổng thanh toán PayOS 4K...</p>
                    </div>
                  ) : (
                    <>
                      <div className="relative w-48 h-48 bg-white p-2 rounded-2xl overflow-hidden mx-auto shadow-md border border-gray-200 group">
                        <img
                          src={payOsData?.qrCode || `https://img.vietqr.io/image/mb-0394961557-compact2.png?amount=${finalTotal}&addInfo=DV-AODAI&accountName=DAIVERSE%20AO%20DAI`}
                          alt="VietQR PayOS Code"
                          className="w-full h-full object-contain"
                        />
                        {payOsStatus === "PAID" && (
                          <div className="absolute inset-0 bg-emerald-600/90 text-white flex flex-col items-center justify-center gap-1 font-bold animate-fadeIn">
                            <CheckCircle2 className="w-10 h-10 animate-bounce" />
                            <span>Đã Nhận Chuyển Khoản!</span>
                          </div>
                        )}
                      </div>

                      <div className="text-xs space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#005baa] rounded-full font-bold text-[11px]">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Đang chờ quét mã QR PayOS...</span>
                        </div>

                        <p className="font-bold text-gray-900 pt-1">
                          Số tài khoản: <span className="text-[#005baa] text-sm">{payOsData?.accountNumber || "0394961557"}</span>
                        </p>
                        <p className="font-medium text-gray-700">Chủ TK: {payOsData?.accountName || "DAIVERSE AO DAI"}</p>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-xl text-[11px] text-gray-800">
                          <span>Nội dung CK: <strong>{payOsData?.description || "DV-AODAI"}</strong></span>
                          <button
                            type="button"
                            onClick={() => handleCopyMemo(payOsData?.description || "DV-AODAI")}
                            className="text-xs font-bold text-[#005baa] hover:underline bg-transparent border-none p-0 cursor-pointer flex items-center gap-0.5"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{isCopied ? "Đã copy!" : "Copy"}</span>
                          </button>
                        </div>
                      </div>

                      {payOsData?.checkoutUrl && (
                        <a
                          href={payOsData.checkoutUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005baa] hover:underline pt-1"
                        >
                          <span>Mở trang Gateway PayOS</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all cursor-pointer border-none flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 bg-[#C85A32] hover:bg-[#C85A32]/90 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>{paymentMethod === "PAYOS" ? "HOÀN TẤT ĐẶT HÀNG QR PAYOS" : "XÁC NHẬN ĐẶT HÀNG COD"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ──────────────── BƯỚC 3: ĐẶT HÀNG THÀNH CÔNG ──────────────── */}
          {step === 3 && createdOrder && (
            <div className="text-center p-6 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-2xl text-gray-900">Đặt Hàng Thành Công!</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Cảm ơn bạn đã tin tưởng dịch vụ của <strong>DaiVerse</strong>. Đơn hàng đang được nghệ nhân tiếp nhận.
                </p>
              </div>

              <div className="p-4 bg-[#FBF9F5] border border-gray-200 rounded-2xl text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Mã đơn hàng:</span>
                  <span className="font-bold text-[#18392B] text-sm">{createdOrder.orderCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Người nhận:</span>
                  <span className="font-semibold text-gray-800">{createdOrder.shippingAddress?.fullName} ({createdOrder.shippingAddress?.phone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phương thức:</span>
                  <span className="font-bold text-[#005baa] uppercase">{createdOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-500">Tổng thanh toán:</span>
                  <span className="font-bold text-[#C85A32] text-sm">{formattedFinalTotal}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  setStep(1);
                }}
                className="w-full py-3.5 bg-[#18392B] hover:bg-[#18392B]/90 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer border-none"
              >
                Tiếp Tục Khám Phá Bộ Sưu Tập Áo Dài
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
