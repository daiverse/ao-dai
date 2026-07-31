import React, { useState, useEffect } from "react";
import { ShoppingBag, Sparkles, ChevronDown, Menu, X } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function Header({ activeTab, setActiveTab, onOpenMobileMenu }) {
  const { totalItems, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAiDropdownOpen, setIsAiDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Trang Chủ", path: "/" },
    { id: "products", label: "Sản Phẩm", path: "/products" },
    { id: "express24h", label: "Đặt hàng 24h", path: "/express-24h", isExpress: true },
    { id: "360", label: "Xem 360°", path: "/product-360" },
    { id: "lookbook", label: "Bộ Sưu Tập", path: "/lookbook" },
    { id: "about", label: "Câu Chuyện", path: "/about" },
    { id: "journal", label: "Tạp Chí", path: "/journal" },
    { id: "contact", label: "Liên Hệ", path: "/contact" }
  ];

  const aiExperiences = [
    { id: "design-studio", title: "AI Design Studio", desc: "Tự tay thiết kế kiểu dáng & họa tiết", icon: "🎨" },
    { id: "try-on", title: "Phòng Xem Đồ AI", desc: "Thử áo dài trực tiếp trên ảnh cá nhân", icon: "✨" },
    { id: "history", title: "Lịch Sử Thử Đồ", desc: "Xem lại các mẫu đã tạo & thử nghiệm", icon: "📜" }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-300">
      <div className="container-page">
        <div className={`relative flex items-center justify-between px-4 sm:px-6 h-16 rounded-full transition-all duration-500 border ${
          isScrolled 
            ? "border-gray-300 bg-white/95 backdrop-blur-md shadow-xl" 
            : "border-gray-200/80 bg-white/90 backdrop-blur-md shadow-lg"
        }`}>
          {/* Progress underline */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#18392B] rounded-full scale-x-0 origin-left transition-transform"></div>

          {/* Brand Logo */}
          <button 
            onClick={() => handleNavClick("home")}
            className="flex items-center cursor-pointer group z-10 shrink-0 text-left"
          >
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#D4A373]/40 shadow-sm group-hover:scale-105 transition-transform bg-[#18392B] flex items-center justify-center">
              <img src="/logo.jpg" alt="DaiVerse" className="w-full h-full object-cover" />
            </div>
            <div className="ml-3 hidden sm:block">
              <span className="font-heading font-bold text-xl text-[#18392B] block leading-none">DaiVerse</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 z-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-[15px] font-medium transition-all relative group whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === item.id 
                    ? "text-[#C85A32] font-semibold" 
                    : item.isExpress
                      ? "text-[#C85A32] font-semibold hover:text-[#18392B]"
                      : "text-gray-700 hover:text-[#C85A32]"
                }`}
              >
                <span>{item.label}</span>
                {item.isExpress && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#C85A32] text-white rounded-md tracking-tight leading-none animate-pulse">
                    24h
                  </span>
                )}
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#C85A32] transition-all duration-300 ${
                  activeTab === item.id ? "w-full" : "w-0 group-hover:w-full"
                }`}></span>
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3 z-10 relative">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Giỏ hàng"
              className="relative p-2.5 rounded-full text-gray-700 hover:text-[#C85A32] hover:bg-[#C85A32]/10 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C85A32] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* AI Experience Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setIsAiDropdownOpen(!isAiDropdownOpen)}
                onBlur={() => setTimeout(() => setIsAiDropdownOpen(false), 200)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all text-sm bg-[#18392B] text-white shadow-lg shadow-[#18392B]/25 hover:bg-[#18392B]/90 hover:shadow-xl hover:scale-105 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#D4A373] animate-pulse" />
                <span>Trải Nghiệm AI</span>
                <ChevronDown className={`w-3.5 h-3.5 opacity-80 transition-transform ${isAiDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {isAiDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-[11px] font-semibold text-[#C85A32] uppercase tracking-wider">Bộ Công Cụ AI 2026</p>
                  </div>
                  {aiExperiences.map((exp) => (
                    <button
                      key={exp.id}
                      onClick={() => {
                        handleNavClick(exp.id);
                        setIsAiDropdownOpen(false);
                      }}
                      className="w-full text-left p-3 rounded-xl hover:bg-[#FBF9F5] transition-colors flex items-start gap-3 group cursor-pointer"
                    >
                      <span className="text-xl p-1.5 bg-gray-50 rounded-lg group-hover:bg-[#C85A32]/10 transition-colors">
                        {exp.icon}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-[#C85A32] transition-colors">
                          {exp.title}
                        </p>
                        <p className="text-xs text-gray-500 leading-snug">{exp.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-2 z-10">
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Giỏ hàng"
              className="relative p-2 rounded-full text-gray-700 hover:text-[#C85A32]"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#C85A32] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={onOpenMobileMenu}
              className="p-2 text-gray-700 hover:text-[#C85A32] transition-colors"
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
