import React, { useState } from "react";
import { Send, MapPin, Phone, Mail, Clock, Heart, ExternalLink } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { FEATURE_FLAGS } from "../../config/featureFlags";

export default function Footer({ setActiveTab }) {
  const [email, setEmail] = useState("");
  const { showToast } = useCart();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      showToast("Cảm ơn bạn đã đăng ký nhận tin tức & ưu đãi!");
      setEmail("");
    }
  };

  const handleNav = (tab) => {
    if (setActiveTab) {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-[#FFDF00] text-[#2C1A00] overflow-hidden mt-16">
      {/* Background SVG Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B6B09D' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#C8920A] to-transparent"></div>
      <div className="h-px bg-gradient-to-r from-transparent via-[#C8920A]/50 to-transparent mt-px"></div>

      <div className="relative container-page py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Col 1: Khám Phá */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C8920A] mb-5">Khám Phá</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={() => handleNav("products")} className="text-sm text-[#2C1A00]/70 hover:text-[#C8920A] transition-colors duration-200 hover:translate-x-1 inline-block text-left cursor-pointer">
                  Bộ Sưu Tập
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("express24h")} className="text-sm text-[#C8920A] font-semibold hover:underline transition-colors duration-200 hover:translate-x-1 inline-block text-left cursor-pointer flex items-center gap-1">
                  <span>⚡ Đặt Hàng 24h</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("lookbook")} className="text-sm text-[#2C1A00]/70 hover:text-[#C8920A] transition-colors duration-200 hover:translate-x-1 inline-block text-left cursor-pointer">
                  Lookbook
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("design-studio")} className="text-sm text-[#2C1A00]/70 hover:text-[#C8920A] transition-colors duration-200 hover:translate-x-1 inline-block text-left cursor-pointer">
                  AI Design Studio
                </button>
              </li>
              {FEATURE_FLAGS.ENABLE_AI_TRY_ON && (
                <li>
                  <button onClick={() => handleNav("try-on")} className="text-sm text-[#2C1A00]/70 hover:text-[#C8920A] transition-colors duration-200 hover:translate-x-1 inline-block text-left cursor-pointer">
                    Phòng Xem Đồ AI
                  </button>
                </li>
              )}
              <li>
                <button onClick={() => handleNav("360")} className="text-sm text-[#2C1A00]/70 hover:text-[#C8920A] transition-colors duration-200 hover:translate-x-1 inline-block text-left cursor-pointer">
                  Trải Nghiệm 360°
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("journal")} className="text-sm text-[#2C1A00]/70 hover:text-[#C8920A] transition-colors duration-200 hover:translate-x-1 inline-block text-left cursor-pointer">
                  Tạp Chí
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("about")} className="text-sm text-[#2C1A00]/70 hover:text-[#C8920A] transition-colors duration-200 hover:translate-x-1 inline-block text-left cursor-pointer">
                  Câu Chuyện
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Chính Sách */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C8920A] mb-5">Chính Sách</h4>
            <ul className="space-y-3">
              <li><span className="text-sm text-[#2C1A00]/70 hover:text-[#C8920A] transition-colors duration-200 cursor-pointer">Giao Hàng Toàn Quốc</span></li>
              <li><span className="text-sm text-[#2C1A00]/70 hover:text-[#C8920A] transition-colors duration-200 cursor-pointer">Đổi Trả 15 Ngày</span></li>
              <li><span className="text-sm text-[#2C1A00]/70 hover:text-[#C8920A] transition-colors duration-200 cursor-pointer">Bảo Mật Thông Tin</span></li>
              <li><span className="text-sm text-[#2C1A00]/70 hover:text-[#C8920A] transition-colors duration-200 cursor-pointer">Hướng Dẫn Chọn Size</span></li>
              <li><span className="text-sm text-[#2C1A00]/70 hover:text-[#C8920A] transition-colors duration-200 cursor-pointer">Chăm Sóc Áo Dài</span></li>
            </ul>
          </div>

          {/* Col 3: Liên Hệ & Social */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C8920A] mb-5">Liên Hệ</h4>
            <ul className="space-y-3 text-sm text-[#2C1A00]/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C8920A]/80 mt-0.5 shrink-0" />
                <span>Hoành Sơn Complex, 282 Nguyễn Huy Tưởng, Thanh Xuân, Hà Nội</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C8920A]/80 shrink-0" />
                <span>0394961557</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C8920A]/80 shrink-0" />
                <span>daiverseg5@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C8920A]/80 shrink-0" />
                <span>08:00 — 22:00</span>
              </li>
            </ul>

            <div className="flex gap-3 mt-6">
              <a 
                href="https://www.facebook.com/profile.php?id=61590664110972" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Facebook Fanpage"
                className="w-9 h-9 rounded-full border border-[#2C1A00]/20 flex items-center justify-center text-[#2C1A00]/70 hover:border-[#C8920A] hover:text-[#C8920A] hover:bg-[#C8920A]/10 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://www.tiktok.com/@daiverse91" 
                target="_blank" 
                rel="noopener noreferrer"
                title="TikTok"
                className="w-9 h-9 rounded-full border border-[#2C1A00]/20 flex items-center justify-center text-[#2C1A00]/70 hover:border-[#C8920A] hover:text-[#C8920A] hover:bg-[#C8920A]/10 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.82.12V9.4a6.33 6.33 0 0 0-1-.08 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.05a8.27 8.27 0 0 0 4.97 1.63V7.24a4.83 4.83 0 0 1-3.01-.55z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 4: Brand & Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="font-heading text-2xl text-[#C8920A] mb-4 font-bold flex items-center gap-2">
              <img src="/logo.jpg" alt="DaiVerse" className="w-8 h-8 rounded-full object-cover border border-[#E8C55A]/40" />
              <span>DaiVerse</span>
            </h3>
            <p className="text-sm text-[#2C1A00]/80 leading-relaxed">
              DaiVerse – nơi vẻ đẹp áo dài Việt hòa quyện cùng công nghệ AI, tạo nên những thiết kế độc bản mang dấu ấn riêng của mỗi người.
            </p>
            <div className="mt-6">
              <p className="text-xs uppercase tracking-wider text-[#C8920A] font-medium mb-3">Nhận Ưu Đãi Mới Nhất</p>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full min-w-0 px-3.5 py-2.5 h-10 bg-[#2C1A00]/10 border border-[#2C1A00]/25 text-[#2C1A00] placeholder:text-[#2C1A00]/50 text-sm rounded-lg focus:border-[#C8920A] focus:outline-none focus:ring-1 focus:ring-[#C8920A]"
                />
                <button
                  type="submit"
                  aria-label="Đăng ký"
                  className="h-10 px-4 bg-[#C8920A] hover:bg-[#C8920A]/90 text-white shrink-0 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-12 mb-8 flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#C8920A]/30"></div>
          <div className="w-1.5 h-1.5 rotate-45 bg-[#C8920A]/60"></div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#C8920A]/30"></div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#2C1A00]/50">
          <p>© 2026 DaiVerse.</p>
        </div>
      </div>
    </footer>
  );
}
