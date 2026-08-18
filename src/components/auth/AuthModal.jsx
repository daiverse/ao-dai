import React, { useState, useEffect } from "react";
import { X, Mail, Lock, User, Phone, ArrowRight, ShieldCheck, RefreshCw, KeyRound, Sparkles, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import PasswordStrengthBar, { calculatePasswordStrength } from "./PasswordStrengthBar";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    modalInitialView,
    login,
    sendOTP,
    registerWithOTP,
    resendOTP,
    forgotPassword,
  } = useAuth();

  const [view, setView] = useState("login"); // 'login' | 'register' | 'otp' | 'forgot'
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Eye toggle states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (isAuthModalOpen) {
      setView(modalInitialView || "login");
      setError("");
      setSuccessMsg("");
      setLoginSuccess(false);
      setLoading(false);
      setConfirmPassword("");
      setOtp(["", "", "", "", "", ""]);
    }
  }, [isAuthModalOpen, modalInitialView]);

  // Timer đếm ngược resend OTP
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  if (!isAuthModalOpen) return null;

  // Handle Login với Animation thành công
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      setLoginSuccess(true);
      setLoading(false);
      setTimeout(() => {
        setLoginSuccess(false);
        closeAuthModal();
      }, 1400);
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "Đăng nhập thất bại.");
      setLoading(false);
    }
  };

  // Bước 1: Đăng ký -> Nhận mã OTP
  const handleSendOTPSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { isValid } = calculatePasswordStrength(password);
    if (!isValid) {
      setError("Mật khẩu chưa đủ độ mạnh! Mật khẩu phải đáp ứng ĐỦ CẢ 4 YẾU TỐ (Độ dài, Chữ hoa & thường, Số và Ký tự đặc biệt).");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không trùng khớp. Vui lòng kiểm tra lại.");
      return;
    }

    setLoading(true);

    try {
      const res = await sendOTP(name, email, password, phone);
      setView("otp");
      setSuccessMsg(res.message || `Mã OTP đã được gửi về email ${email}`);
      setResendTimer(60);
    } catch (err) {
      setError(err.message || "Không thể gửi mã OTP.");
    } finally {
      setLoading(false);
    }
  };

  // OTP Change
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== "" && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const inputs = document.querySelectorAll(".otp-input");
      if (inputs[index - 1]) inputs[index - 1].focus();
    }
  };

  // Bước 2: Nhập OTP -> Hoàn Tất Đăng Ký
  const handleRegisterWithOTP = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setError("Vui lòng nhập đầy đủ 6 chữ số mã OTP.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await registerWithOTP(email, otpCode);
      setLoginSuccess(true);
      setLoading(false);
      setTimeout(() => {
        setLoginSuccess(false);
        closeAuthModal();
      }, 1400);
    } catch (err) {
      setError(err.message || "Xác nhận OTP thất bại.");
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    setError("");
    setSuccessMsg("");
    try {
      await resendOTP(email);
      setSuccessMsg("Đã gửi lại mã OTP mới!");
      setResendTimer(60);
    } catch (err) {
      setError(err.message || "Không thể gửi lại mã OTP.");
    }
  };

  // Forgot Password
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await forgotPassword(email);
      setSuccessMsg(res.message || "Hướng dẫn đã được gửi về email.");
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  // Màn hình Animation thành công sau khi Đăng nhập / Đăng ký
  if (loginSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
        <div className="relative w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl text-center space-y-4 border border-emerald-100 animate-scaleUp">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-2xl text-gray-900">Đăng Nhập Thành Công!</h3>
            <p className="text-xs text-gray-500 mt-1">Chào mừng bạn đã trở lại với <strong>DaiVerse</strong></p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs text-[#C85A32] font-semibold bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200/60 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Đã đồng bộ thông tin & giỏ hàng...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transition-all">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-all z-10 border-none cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#18392B] to-[#0F241B] p-7 text-white text-center relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-[#D4A373] text-[11px] font-bold uppercase tracking-wider mb-2 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" /> DaiVerse Account
          </div>
          <h2 className="font-heading text-2xl font-bold tracking-tight">
            {view === "login" && "Chào Mừng Trở Lại"}
            {view === "register" && "Tạo Tài Khoản Mới"}
            {view === "otp" && "Nhập Mã OTP Xác Nhận"}
            {view === "forgot" && "Quên Mật Khẩu"}
          </h2>
          <p className="text-xs text-gray-300 mt-1 font-light">
            {view === "login" && "Đăng nhập để trải nghiệm AI Try-On & quản lý đơn hàng"}
            {view === "register" && "Điền thông tin để nhận mã OTP gửi về Email của bạn"}
            {view === "otp" && `Nhập mã OTP 6 số vừa được gửi tới email ${email}`}
            {view === "forgot" && "Nhập email của bạn để nhận hướng dẫn khôi phục mật khẩu"}
          </p>
        </div>

        {/* Body Content */}
        <div className="p-7 space-y-5">
          {error && (
            <div className="p-3.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2">
              <span className="font-bold">⚠️</span> {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2">
              <span className="font-bold">✅</span> {successMsg}
            </div>
          )}

          {/* ──────────────── 1. FORM ĐĂNG NHẬP ──────────────── */}
          {view === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="tenban@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FBF9F5] border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#C85A32] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Mật khẩu</label>
                  <button
                    type="button"
                    onClick={() => {
                      setView("forgot");
                      setError("");
                      setSuccessMsg("");
                    }}
                    className="text-xs font-semibold text-[#C85A32] hover:underline bg-transparent border-none cursor-pointer p-0"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 bg-[#FBF9F5] border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#C85A32] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#C85A32] hover:bg-[#C85A32]/90 text-white font-bold text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Đăng Nhập</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="w-full border-t border-gray-200"></div>
                <span className="absolute bg-white px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Hoặc
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3 px-4 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Tiếp tục với Google</span>
              </button>

              <p className="text-center text-xs text-gray-500 pt-2">
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setView("register");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className="font-bold text-[#18392B] hover:underline bg-transparent border-none cursor-pointer p-0"
                >
                  Đăng ký ngay
                </button>
              </p>
            </form>
          )}

          {/* ──────────────── 2. BƯỚC 1: ĐIỀN THÔNG TIN -> NHẬN OTP ──────────────── */}
          {view === "register" && (
            <form onSubmit={handleSendOTPSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Họ và tên</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FBF9F5] border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#C85A32] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email nhận OTP</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="tenban@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FBF9F5] border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#C85A32] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Số điện thoại (Tùy chọn)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="0912 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FBF9F5] border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#C85A32] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Mật khẩu (Đủ 4 yếu tố)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-2.5 bg-[#FBF9F5] border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#C85A32] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrengthBar password={password} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Xác nhận mật khẩu</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-2.5 bg-[#FBF9F5] border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#C85A32] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[11px] text-rose-600 font-semibold pt-0.5">⚠️ Mật khẩu không trùng khớp</p>
                )}
                {confirmPassword && password === confirmPassword && (
                  <p className="text-[11px] text-emerald-600 font-semibold pt-0.5">✓ Mật khẩu khớp hoàn toàn</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#18392B] hover:bg-[#18392B]/90 text-white font-bold text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Nhận Mã OTP Qua Email</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500 pt-2">
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className="font-bold text-[#C85A32] hover:underline bg-transparent border-none cursor-pointer p-0"
                >
                  Đăng nhập
                </button>
              </p>
            </form>
          )}

          {/* ──────────────── 3. BƯỚC 2: NHẬP OTP -> HOÀN TẤT ĐĂNG KÝ ──────────────── */}
          {view === "otp" && (
            <form onSubmit={handleRegisterWithOTP} className="space-y-5">
              <div className="flex justify-between gap-2 my-4">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="otp-input w-12 h-14 text-center font-bold text-xl bg-[#FBF9F5] border-2 border-gray-200 rounded-2xl focus:border-[#C85A32] focus:bg-white focus:outline-none transition-all"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#C85A32] hover:bg-[#C85A32]/90 text-white font-bold text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Hoàn Tất Đăng Ký</span>
                  </>
                )}
              </button>

              <div className="text-center space-y-2 text-xs">
                <p className="text-gray-500">
                  Chưa nhận được mã?{" "}
                  <button
                    type="button"
                    disabled={resendTimer > 0}
                    onClick={handleResendOTP}
                    className={`font-bold text-[#18392B] bg-transparent border-none p-0 ${
                      resendTimer > 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:underline"
                    }`}
                  >
                    Gửi lại mã {resendTimer > 0 && `(${resendTimer}s)`}
                  </button>
                </p>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setView("register");
                      setError("");
                      setSuccessMsg("");
                    }}
                    className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer"
                  >
                    ← Thay đổi thông tin đăng ký
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ──────────────── 4. FORM QUÊN MẬT KHẨU ──────────────── */}
          {view === "forgot" && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email tài khoản</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="tenban@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FBF9F5] border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#C85A32] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#18392B] hover:bg-[#18392B]/90 text-white font-bold text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Gửi Link Khôi Phục</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className="text-xs font-bold text-gray-500 hover:text-gray-700 bg-transparent border-none cursor-pointer"
                >
                  ← Quay lại Đăng nhập
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
