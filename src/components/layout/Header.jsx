import React, { useState, useEffect } from "react";
import { ShoppingBag, Sparkles, ChevronDown, Menu, X, Palette, History, User as UserIcon, LogOut, Search, PhoneCall } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { FEATURE_FLAGS } from "../../config/featureFlags";

// Helper: Viết tắt họ và tên đệm nếu tên dài
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
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "TRANG CHỦ" },
    { id: "products", label: "SẢN PHẨM" },
    { id: "lookbook", label: "BỘ SƯU TẬP" },
    { id: "express24h", label: "GIAO 24H", isExpress: true },
    { id: "360", label: "XEM 360°" },
    { id: "about", label: "CÂU CHUYỆN DAIVERSE" },
    { id: "journal", label: "TẠP CHÍ DAIVERSE" },
    { id: "contact", label: "LIÊN HỆ" }
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
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white">
      {/* Top Announcement Bar */}
      <div className="bg-[#111111] text-white text-[11px] font-medium tracking-wider py-1.5 px-4 text-center hidden sm:flex justify-between items-center border-b border-neutral-800">
        <div className="flex items-center gap-2 text-neutral-300">
          <PhoneCall className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Hotline mua hàng: <strong className="text-white font-semibold">0394961557</strong> (8:00 - 22:00)</span>
        </div>
        <div className="uppercase tracking-widest text-[#C5A059] font-bold animate-pulse">
          ⚡ GIAO HÀNG 24H • ĐỔI TRẢ TRONG 15 NGÀY
        </div>
        <div className="flex items-center gap-4 text-neutral-300 text-[11px]">
          <span className="hover:text-white cursor-pointer" onClick={() => handleNavClick("about")}>Về DaiVerse</span>
          <span className="hover:text-white cursor-pointer" onClick={() => handleNavClick("contact")}>Cửa Hàng</span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className={`transition-all duration-300 border-b ${isScrolled ? "border-neutral-200 shadow-md py-2" : "border-neutral-100 py-3.5"}`}>
        <div className="container-page flex items-center justify-between">

          {/* Left / Graphic Logo & Brand Name */}
          <button 
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-2 cursor-pointer group border-none bg-transparent outline-none p-0 appearance-none text-left shrink-0"
          >
            <img 
              src="/logo.png" 
              alt="Áo Dài DaiVerse" 
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105 shrink-0" 
            />
            <span className="font-heading font-black text-sm sm:text-base lg:text-lg tracking-wider text-[#C5A059] uppercase leading-none group-hover:text-[#A4813D] transition-colors whitespace-nowrap">
              DAIVERSE
            </span>
          </button>

          {/* Center Navigation Bar (Desktop) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-[12px] xl:text-[13px] font-semibold tracking-wider transition-all relative py-1 uppercase border-none bg-transparent outline-none p-0 cursor-pointer ${
                  activeTab === item.id 
                    ? "text-[#C5A059]" 
                    : item.isExpress
                      ? "text-[#C5A059] hover:text-[#A4813D]"
                      : "text-[#111111] hover:text-[#C5A059]"
                }`}
              >
                <span>{item.label}</span>
                {item.isExpress && (
                  <span className="ml-1 px-1 py-0.5 text-[9px] font-bold bg-[#C5A059] text-white rounded tracking-tight leading-none">
                    HOT
                  </span>
                )}
                <span className={`absolute bottom-0 left-0 h-[2px] bg-[#C5A059] transition-all duration-300 ${
                  activeTab === item.id ? "w-full" : "w-0 group-hover:w-full"
                }`}></span>
              </button>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Search Bar / Icon */}
            <button 
              onClick={() => handleNavClick("products")}
              className="p-2 text-[#111111] hover:text-[#C5A059] transition-colors cursor-pointer border-none bg-transparent outline-none"
              aria-label="Tìm kiếm sản phẩm"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* AI Experience Menu */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsAiDropdownOpen(!isAiDropdownOpen)}
                onBlur={() => setTimeout(() => setIsAiDropdownOpen(false), 200)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#111111] text-white hover:bg-[#C5A059] transition-all cursor-pointer border-none outline-none"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
                <span className="uppercase tracking-wider">AI Studio</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isAiDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isAiDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-64 bg-white rounded-none shadow-xl border border-neutral-200 p-2 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-neutral-100 bg-neutral-50">
                    <p className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest">Trải Nghiệm AI Đột Phá</p>
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
                        className="w-full text-left p-2.5 hover:bg-neutral-50 transition-colors flex items-center gap-3 group cursor-pointer border-none bg-transparent"
                      >
                        <div className="w-8 h-8 rounded bg-neutral-100 text-[#111111] group-hover:bg-[#C5A059] group-hover:text-white transition-all flex items-center justify-center shrink-0">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#111111] group-hover:text-[#C5A059] transition-colors">
                            {exp.title}
                          </p>
                          <p className="text-[11px] text-neutral-500">{exp.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Auth / Account */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsUserDropdownOpen(false), 200)}
                  className={`flex items-center gap-2 p-1.5 rounded-full transition-all cursor-pointer border ${
                    justLoggedIn ? "border-[#C5A059] ring-2 ring-[#C5A059]/30" : "border-neutral-300 hover:border-[#111111]"
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      user.name?.charAt(0)?.toUpperCase() || "U"
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#111111] hidden md:inline-block max-w-[100px] truncate">
                    {formatDisplayName(user.name)}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-neutral-500 transition-transform ${isUserDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-56 bg-white rounded-none shadow-xl border border-neutral-200 p-2 z-50 animate-fade-in">
                    <div className="px-3 py-2 border-b border-neutral-100 bg-neutral-50 mb-1">
                      <p className="text-xs font-bold text-[#111111]">{user.name}</p>
                      <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left p-2 hover:bg-neutral-100 text-[#C5A059] transition-colors flex items-center gap-2 text-xs font-bold cursor-pointer border-none bg-transparent"
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
                className="p-2 text-[#111111] hover:text-[#C5A059] transition-colors cursor-pointer border-none bg-transparent outline-none flex items-center gap-1 text-xs font-semibold uppercase tracking-wider"
              >
                <UserIcon className="w-5 h-5" />
                <span className="hidden md:inline">Đăng Nhập</span>
              </button>
            )}

            {/* Shopping Cart Icon Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Giỏ hàng DaiVerse"
              className="relative p-2 text-[#111111] hover:text-[#C5A059] transition-colors cursor-pointer border-none bg-transparent outline-none"
            >
              <ShoppingBag className="w-5.5 h-5.5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#C5A059] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={onOpenMobileMenu}
              className="p-2 lg:hidden text-[#111111] hover:text-[#C5A059] transition-colors cursor-pointer border-none bg-transparent outline-none"
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

