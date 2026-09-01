import React, { useState, useEffect } from "react";
import { X, Mail, Lock, User, Phone, ArrowRight, ShieldCheck, RefreshCw, KeyRound, Sparkles, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import PasswordStrengthBar, { calculatePasswordStrength } from "./PasswordStrengthBar";

import { API_BASE_URL } from "../../config/api";

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
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  // Màn hình Animation thành công sau khi Đăng nhập / Đăng ký
  if (loginSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
        <div className="relative w-full max-w-sm bg-white rounded-none p-8 shadow-2xl text-center space-y-4 border border-neutral-200">
          <div className="w-16 h-16 bg-[#111111] text-[#C5A059] rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div>
            <h3 className="font-heading font-black text-xl text-[#111111] uppercase tracking-wide">ĐĂNG NHẬP THÀNH CÔNG!</h3>
            <p className="text-xs text-neutral-500 mt-1">Chào mừng bạn trở lại với <strong>DaiVerse</strong></p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs text-[#C5A059] font-bold bg-rose-50 px-3 py-1.5 rounded-none border border-rose-200 uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Đã đồng bộ thông tin & giỏ hàng...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-none shadow-2xl overflow-hidden border border-neutral-300">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white bg-transparent hover:bg-[#C5A059] transition-all z-10 border-none cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="bg-[#111111] p-6 text-center text-white relative border-b-2 border-[#C5A059]">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#C5A059] text-white text-[10px] font-extrabold uppercase tracking-widest mb-2">
            DaiVerse FASHION ACCOUNT
          </div>
          <h2 className="font-heading text-xl font-black tracking-widest text-white uppercase">
            {view === "login" && "ĐĂNG NHẬP TÀI KHOẢN"}
            {view === "register" && "ĐĂNG KÝ TÀI KHOẢN MỚI"}
            {view === "otp" && "MÃ XÁC NHẬN OTP"}
            {view === "forgot" && "KHÔI PHỤC MẬT KHẨU"}
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-normal">
            {view === "login" && "Đăng nhập để nhận ưu đãi thành viên & lưu thiết kế Áo Dài"}
            {view === "register" && "Điền thông tin để nhận mã xác thực OTP qua Email"}
            {view === "otp" && `Nhập mã OTP 6 số đã được gửi về email ${email}`}
            {view === "forgot" && "Nhập email của bạn để nhận hướng dẫn khôi phục mật khẩu"}
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs text-[#C5A059] bg-rose-50 border border-rose-200 rounded-none font-semibold flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-none font-semibold flex items-center gap-2">
              <span>✅</span> {successMsg}
            </div>
          )}

          {/* ──────────────── 1. FORM ĐĂNG NHẬP ──────────────── */}
          {view === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Email tài khoản</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="example@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 text-xs font-semibold focus:outline-none focus:border-[#111111] focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Mật khẩu</label>
                  <button
                    type="button"
                    onClick={() => {
                      setView("forgot");
                      setError("");
                      setSuccessMsg("");
                    }}
                    className="text-xs font-bold text-[#C5A059] hover:underline bg-transparent border-none cursor-pointer p-0"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-2.5 bg-neutral-50 border border-neutral-300 text-xs font-semibold focus:outline-none focus:border-[#111111] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 bg-transparent border-none cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#111111] hover:bg-[#C5A059] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border-none disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  <span>Đăng Nhập Ngay</span>
                )}
              </button>

              <div className="relative my-3 flex items-center justify-center">
                <div className="w-full border-t border-neutral-200"></div>
                <span className="absolute bg-white px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  HOẶC
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 bg-white border border-neutral-300 hover:border-neutral-800 text-neutral-800 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Đăng nhập qua Google</span>
              </button>

              <p className="text-center text-xs text-neutral-500 pt-2">
                Chưa có tài khoản DaiVerse?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setView("register");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className="font-bold text-[#C5A059] hover:underline bg-transparent border-none cursor-pointer p-0 uppercase"
                >
                  Đăng ký ngay
                </button>
              </p>
            </form>
          )}

          {/* ──────────────── 2. FORM ĐĂNG KÝ ──────────────── */}
          {view === "register" && (
            <form onSubmit={handleSendOTPSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Họ và tên</label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-300 text-xs font-semibold focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Email nhận OTP</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="example@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-300 text-xs font-semibold focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Mật khẩu</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-2 bg-neutral-50 border border-neutral-300 text-xs font-semibold focus:outline-none focus:border-[#111111]"
                  />
                </div>
                <PasswordStrengthBar password={password} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Xác nhận mật khẩu</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-2 bg-neutral-50 border border-neutral-300 text-xs font-semibold focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#111111] hover:bg-[#C5A059] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border-none disabled:opacity-50 mt-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : <span>Nhận Mã OTP Qua Email</span>}
              </button>

              <p className="text-center text-xs text-neutral-500 pt-1">
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className="font-bold text-[#C5A059] hover:underline bg-transparent border-none cursor-pointer p-0 uppercase"
                >
                  Đăng nhập
                </button>
              </p>
            </form>
          )}

          {/* ──────────────── 3. BƯỚC 2: NHẬP OTP ──────────────── */}
          {view === "otp" && (
            <form onSubmit={handleRegisterWithOTP} className="space-y-4">
              <div className="flex justify-between gap-2 my-2">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="otp-input w-11 h-13 text-center font-bold text-lg bg-neutral-50 border border-neutral-300 focus:border-[#111111] focus:outline-none"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#C5A059] hover:bg-[#A4813D] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border-none disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : <span>Hoàn Tất Đăng Ký</span>}
              </button>
            </form>
          )}

          {/* ──────────────── 4. QUÊN MẬT KHẨU ──────────────── */}
          {view === "forgot" && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">Email tài khoản</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="example@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 text-xs font-semibold focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#111111] hover:bg-[#C5A059] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border-none"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : <span>Gửi Link Khôi Phục</span>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

