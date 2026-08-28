import React, { useState, useEffect } from "react";
import { Lock, ArrowRight, RefreshCw, KeyRound, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PasswordStrengthBar, { calculatePasswordStrength } from "../components/auth/PasswordStrengthBar";

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Trích xuất token từ URL: /reset-password/:token
    const pathParts = window.location.pathname.split("/");
    const tokenFromUrl = pathParts[pathParts.length - 1];
    setToken(tokenFromUrl);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Token không hợp lệ.");
      return;
    }

    const { isValid } = calculatePasswordStrength(password);
    if (!isValid) {
      setError("Mật khẩu chưa đủ độ mạnh! Mật khẩu phải đáp ứng ĐỦ CẢ 4 YẾU TỐ (Độ dài, Chữ hoa & thường, Số và Ký tự đặc biệt).");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, password);
      // Xóa token đăng nhập cũ để bắt buộc đăng nhập lại với mật khẩu mới
      localStorage.removeItem("aodai_token");
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (err) {
      setError(err.message || "Đặt lại mật khẩu thất bại. Link có thể đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-36 pb-24 min-h-screen bg-[#FDF6C0] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#FFDF00]/10 text-[#FFDF00] rounded-2xl flex items-center justify-center mx-auto mb-2">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Tạo Mật Khẩu Mới</h1>
          <p className="text-xs text-gray-500 font-light">Vui lòng nhập mật khẩu mới thỏa mãn đủ 4 yếu tố an toàn</p>
        </div>

        {error && (
          <div className="p-3.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl">
            ⚠️ {error}
          </div>
        )}

        {success ? (
          <div className="text-center p-6 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-heading text-lg font-bold text-emerald-900">Đặt Lại Mật Khẩu Thành Công!</h3>
            <p className="text-xs text-emerald-700">Tự động quay về trang chủ sau 3 giây...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Mật khẩu mới (Đủ 4 yếu tố)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-[#FDF6C0] border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#C8920A] focus:bg-white transition-all"
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
                  className="w-full pl-10 pr-11 py-3 bg-[#FDF6C0] border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#C8920A] focus:bg-white transition-all"
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
                <p className="text-[11px] text-rose-600 font-semibold pt-1">⚠️ Mật khẩu không trùng khớp</p>
              )}
              {confirmPassword && password === confirmPassword && (
                <p className="text-[11px] text-emerald-600 font-semibold pt-1">✓ Mật khẩu khớp hoàn toàn</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#C8920A] hover:bg-[#C8920A]/90 text-white font-bold text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Cập Nhật Mật Khẩu</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
