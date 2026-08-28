import React, { useState, useEffect } from "react";
import { ShoppingBag, Sparkles, ChevronDown, Menu, X, Palette, History, User as UserIcon, LogOut, ShieldCheck } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

import { FEATURE_FLAGS } from "../../config/featureFlags";

// Helper: Viết tắt họ và tên đệm nếu tên dài (vd: Nguyễn Văn Minh -> N. V. Minh)
const formatDisplayName = (fullName) => {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  const lastName = parts[parts.length - 1];
  const initials = parts.slice(0, -1).map(p => p.charAt(0).toUpperCase() + ".").join(" ");
  return `${initials} ${lastName}`;
};

export default function Header({ activeTab, setActiveTab, onOpenMobileMenu }) {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAiDropdownOpen, setIsAiDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setJustLoggedIn(true);
      const timer = setTimeout(() => setJustLoggedIn(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Trang Chủ" },
    { id: "products", label: "Sản Phẩm" },
    { id: "express24h", label: "Đặt 24h", isExpress: true },
    { id: "360", label: "Xem 360°" },
    { id: "lookbook", label: "Bộ Sưu Tập" },
    { id: "about", label: "Câu Chuyện" },
    { id: "journal", label: "Tạp Chí" },
    { id: "contact", label: "Liên Hệ" }
  ];

  const aiExperiences = [
    { id: "design-studio", title: "AI Design Studio", desc: "Tự tay thiết kế kiểu dáng & họa tiết", icon: Palette },
    ...(FEATURE_FLAGS.ENABLE_AI_TRY_ON ? [{ id: "try-on", title: "Phòng Xem Đồ AI", desc: "Thử áo dài trực tiếp trên ảnh cá nhân", icon: Sparkles }] : []),
    { id: "history", title: "Lịch Sử Thử Đồ", desc: "Xem lại các mẫu đã tạo & thử nghiệm", icon: History }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="fixed top-2 sm:top-3 left-0 right-0 z-50 transition-all duration-300 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className={`relative flex items-center justify-between px-3 sm:px-5 lg:px-6 h-16 rounded-full transition-all duration-500 border ${
          isScrolled 
            ? "border-gray-300 bg-white/95 backdrop-blur-md shadow-xl" 
            : "border-gray-200/80 bg-white/90 backdrop-blur-md shadow-lg"
        }`}>

          {/* Brand Logo */}
          <button 
            onClick={() => handleNavClick("home")}
            className="flex items-center cursor-pointer group z-10 shrink-0 text-left border-none bg-transparent outline-none p-0 appearance-none mr-2 lg:mr-3 xl:mr-5"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-[#E8C55A]/40 shadow-sm group-hover:scale-105 transition-transform bg-[#FFDF00] flex items-center justify-center">
              <img src="/logo.jpg" alt="DaiVerse" className="w-full h-full object-cover" />
            </div>
            <div className="ml-2.5 hidden sm:block">
              <span className="font-heading font-bold text-lg sm:text-xl text-[#FFDF00] block leading-none">DaiVerse</span>
            </div>
          </button>

          {/* Desktop Navigation (lg+) */}
          <nav className="hidden lg:flex items-center justify-center gap-1.5 lg:gap-2.5 xl:gap-4 z-10 mx-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-xs lg:text-[13px] xl:text-[14px] font-medium transition-all relative group whitespace-nowrap flex items-center gap-1 border-none bg-transparent outline-none p-0 appearance-none ${
                  activeTab === item.id 
                    ? "text-[#C8920A] font-semibold" 
                    : item.isExpress
                      ? "text-[#C8920A] font-semibold hover:text-[#FFDF00]"
                      : "text-gray-700 hover:text-[#C8920A]"
                }`}
              >
                <span>{item.label}</span>
                {item.isExpress && (
                  <span className="px-1 py-0.5 text-[9px] font-bold bg-[#C8920A] text-white rounded tracking-tight leading-none animate-pulse">
                    24h
                  </span>
                )}
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#C8920A] transition-all duration-300 ${
                  activeTab === item.id ? "w-full" : "w-0 group-hover:w-full"
                }`}></span>
              </button>
            ))}
          </nav>

          {/* Right Actions (Desktop - lg+) */}
          <div className="hidden lg:flex items-center gap-2 lg:gap-2.5 z-10 relative shrink-0 ml-1 lg:ml-2 xl:ml-4">
            {/* User Login/Account Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsUserDropdownOpen(false), 200)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white transition-all cursor-pointer shadow-sm hover:shadow-md ${
                    justLoggedIn
                      ? "border-[#E8C55A] ring-4 ring-[#E8C55A]/50 shadow-xl scale-105 animate-pulse"
                      : "border-gray-200 hover:border-[#C8920A]/40"
                  }`}
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-[#FFDF00] text-[#2C1A00] flex items-center justify-center text-xs font-bold shrink-0 shadow-inner">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name?.charAt(0)?.toUpperCase() || "U"
                    )}
                  </div>
                  <span className="text-xs font-bold text-gray-800 whitespace-nowrap">
                    {formatDisplayName(user.name)}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isUserDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 animate-fade-in">
                    <div className="px-3.5 py-3 border-b border-gray-100 bg-[#FDF6C0] rounded-xl mb-1">
                      <p className="text-xs font-bold text-gray-900 leading-snug">{user.name}</p>
                      <p className="text-[11px] text-gray-500 font-light truncate mt-0.5">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors flex items-center gap-2 text-xs font-bold cursor-pointer border-none bg-transparent"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal("login")}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[#2C1A00] border border-[#FFDF00]/60 hover:bg-[#FFDF00] hover:text-[#2C1A00] transition-all cursor-pointer bg-transparent whitespace-nowrap"
              >
                Đăng Nhập
              </button>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Giỏ hàng"
              className="relative p-2 rounded-full text-gray-700 hover:text-[#C8920A] hover:bg-[#C8920A]/10 transition-all cursor-pointer border-none bg-transparent outline-none appearance-none"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#C8920A] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setIsAiDropdownOpen(!isAiDropdownOpen)}
                onBlur={() => setTimeout(() => setIsAiDropdownOpen(false), 200)}
                className="flex items-center gap-1.5 px-3.5 lg:px-4 py-2 rounded-full font-medium transition-all text-xs xl:text-sm bg-[#FFDF00] text-[#2C1A00] shadow-md shadow-[#FFDF00]/40 hover:bg-[#FFDF00]/90 hover:shadow-lg cursor-pointer border-none outline-none appearance-none"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E8C55A] animate-pulse" />
                <span>Trải Nghiệm AI</span>
                <ChevronDown className={`w-3 h-3 opacity-80 transition-transform ${isAiDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isAiDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-[11px] font-semibold text-[#C8920A] uppercase tracking-wider">Bộ Công Cụ AI 2026</p>
                  </div>
                  {aiExperiences.map((exp) => {
                    const IconComponent = exp.icon;
                    return (
                      <button
                        key={exp.id}
                        onClick={() => {
                          handleNavClick(exp.id);
                          setIsAiDropdownOpen(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#FDF6C0] transition-colors flex items-center gap-3 group cursor-pointer border-none bg-transparent outline-none appearance-none"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#FFDF00]/10 text-[#FFDF00] group-hover:bg-[#C8920A] group-hover:text-white transition-all flex items-center justify-center shrink-0">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-[#C8920A] transition-colors">
                            {exp.title}
                          </p>
                          <p className="text-xs text-gray-500 leading-snug">{exp.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Controls (< lg) */}
          <div className="flex lg:hidden items-center gap-2 z-10 shrink-0">
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Giỏ hàng"
              className="relative p-2 rounded-full text-gray-700 hover:text-[#C8920A]"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#C8920A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsAiDropdownOpen(!isAiDropdownOpen)}
              aria-label="Trải nghiệm AI"
              className="p-2 rounded-full text-[#FFDF00] bg-[#FFDF00]/10 hover:bg-[#FFDF00]/20 transition-colors cursor-pointer border-none outline-none"
            >
              <Sparkles className="w-5 h-5 text-[#C8920A]" />
            </button>

            <button
              onClick={onOpenMobileMenu}
              className="p-2 text-gray-700 hover:text-[#C8920A] transition-colors cursor-pointer border-none bg-transparent outline-none"
              aria-label="Mở menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
