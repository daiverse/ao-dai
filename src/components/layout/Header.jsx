import React, { useState, useEffect } from "react";
import { ShoppingBag, Sparkles, ChevronDown, Menu, X, Palette, History } from "lucide-react";
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
    { id: "try-on", title: "Phòng Xem Đồ AI", desc: "Thử áo dài trực tiếp trên ảnh cá nhân", icon: Sparkles },
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
            className="flex items-center cursor-pointer group z-10 shrink-0 text-left border-none bg-transparent outline-none p-0 appearance-none mr-2 lg:mr-4 xl:mr-6"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-[#D4A373]/40 shadow-sm group-hover:scale-105 transition-transform bg-[#18392B] flex items-center justify-center">
              <img src="/logo.jpg" alt="DaiVerse" className="w-full h-full object-cover" />
            </div>
            <div className="ml-2.5 hidden sm:block">
              <span className="font-heading font-bold text-lg sm:text-xl text-[#18392B] block leading-none">DaiVerse</span>
            </div>
          </button>

          {/* Desktop Navigation (lg+) */}
          <nav className="hidden lg:flex items-center justify-center gap-2 lg:gap-3 xl:gap-5 z-10 mx-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-xs lg:text-[13px] xl:text-[14px] font-medium transition-all relative group whitespace-nowrap flex items-center gap-1 border-none bg-transparent outline-none p-0 appearance-none ${
                  activeTab === item.id 
                    ? "text-[#C85A32] font-semibold" 
                    : item.isExpress
                      ? "text-[#C85A32] font-semibold hover:text-[#18392B]"
                      : "text-gray-700 hover:text-[#C85A32]"
                }`}
              >
                <span>{item.label}</span>
                {item.isExpress && (
                  <span className="px-1 py-0.5 text-[9px] font-bold bg-[#C85A32] text-white rounded tracking-tight leading-none animate-pulse">
                    24h
                  </span>
                )}
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#C85A32] transition-all duration-300 ${
                  activeTab === item.id ? "w-full" : "w-0 group-hover:w-full"
                }`}></span>
              </button>
            ))}
          </nav>

          {/* Right Actions (Desktop - lg+) */}
          <div className="hidden lg:flex items-center gap-2 lg:gap-3 z-10 relative shrink-0 ml-2 lg:ml-4 xl:ml-6">
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Giỏ hàng"
              className="relative p-2 rounded-full text-gray-700 hover:text-[#C85A32] hover:bg-[#C85A32]/10 transition-all cursor-pointer border-none bg-transparent outline-none appearance-none"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#C85A32] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setIsAiDropdownOpen(!isAiDropdownOpen)}
                onBlur={() => setTimeout(() => setIsAiDropdownOpen(false), 200)}
                className="flex items-center gap-1.5 px-3.5 lg:px-4 py-2 rounded-full font-medium transition-all text-xs xl:text-sm bg-[#18392B] text-white shadow-md shadow-[#18392B]/25 hover:bg-[#18392B]/90 hover:shadow-lg cursor-pointer border-none outline-none appearance-none"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4A373] animate-pulse" />
                <span>Trải Nghiệm AI</span>
                <ChevronDown className={`w-3 h-3 opacity-80 transition-transform ${isAiDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isAiDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-[11px] font-semibold text-[#C85A32] uppercase tracking-wider">Bộ Công Cụ AI 2026</p>
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
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#FBF9F5] transition-colors flex items-center gap-3 group cursor-pointer border-none bg-transparent outline-none appearance-none"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#18392B]/10 text-[#18392B] group-hover:bg-[#C85A32] group-hover:text-white transition-all flex items-center justify-center shrink-0">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-[#C85A32] transition-colors">
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
              onClick={() => setIsAiDropdownOpen(!isAiDropdownOpen)}
              aria-label="Trải nghiệm AI"
              className="p-2 rounded-full text-[#18392B] bg-[#18392B]/10 hover:bg-[#18392B]/20 transition-colors cursor-pointer border-none outline-none"
            >
              <Sparkles className="w-5 h-5 text-[#C85A32]" />
            </button>

            <button
              onClick={onOpenMobileMenu}
              className="p-2 text-gray-700 hover:text-[#C85A32] transition-colors cursor-pointer border-none bg-transparent outline-none"
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
