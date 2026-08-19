import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

const AuthContext = createContext();

const API_URL = `${API_BASE_URL}/api/auth`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalInitialView, setModalInitialView] = useState("login"); // 'login' | 'register' | 'forgot'

  // Kiểm tra token từ URL (khi redirect từ Google OAuth)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get("auth_token");
    const authError = urlParams.get("auth_error");

    if (authToken) {
      localStorage.setItem("token", authToken);
      setToken(authToken);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (authError) {
      alert("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Fetch thông tin người dùng nếu có token
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          // Token hết hạn hoặc không hợp lệ
          logout();
        }
      } catch (err) {
        console.error("Fetch user error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Đăng nhập thất bại.");
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
    }

    return data;
  };

  const sendOTP = async (name, email, password, phone) => {
    const res = await fetch(`${API_URL}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Gửi mã OTP thất bại.");
    }
    return data;
  };

  const registerWithOTP = async (email, otp) => {
    const res = await fetch(`${API_URL}/register-with-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Hoàn tất đăng ký thất bại.");
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
    }

    return data;
  };


  const resendOTP = async (email) => {
    const res = await fetch(`${API_URL}/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Gửi lại OTP thất bại.");
    }

    return data;
  };

  const forgotPassword = async (email) => {
    const res = await fetch(`${API_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Yêu cầu đặt lại mật khẩu thất bại.");
    }

    return data;
  };

  const resetPassword = async (tokenParam, password) => {
    const res = await fetch(`${API_URL}/reset-password/${tokenParam}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Đặt lại mật khẩu thất bại.");
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
    }

    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  const openAuthModal = (view = "login") => {
    setModalInitialView(view);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAuthModalOpen,
        modalInitialView,
        login,
        sendOTP,
        registerWithOTP,
        resendOTP,
        forgotPassword,
        resetPassword,
        logout,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được dùng bên trong AuthProvider");
  }
  return context;
}
