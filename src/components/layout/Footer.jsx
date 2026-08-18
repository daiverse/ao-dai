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
    <footer className="relative bg-[#18392B] text-[#FBF9F5] overflow-hidden mt-16">
      {/* Background SVG Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B6B09D' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#C85A32] to-transparent"></div>
      <div className="h-px bg-gradient-to-r from-transparent via-[#C85A32]/50 to-transparent mt-px"></div>

      <div className="relative container-page py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Col 1: Brand & Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="font-heading text-2xl text-[#C85A32] mb-4 font-bold flex items-center gap-2">
              <img src="/logo.jpg" alt="DaiVerse" className="w-8 h-8 rounded-full object-cover border border-[#D4A373]/40" />
              <span>DaiVerse</span>
            </h3>
            <p className="text-sm text-[#FBF9F5]/70 leading-relaxed">
              Thương hiệu thời trang áo dài cao cấp kết hợp tinh hoa nghề dệt truyền thống với công nghệ AI hiện đại. Mỗi tà áo là một tác phẩm nghệ thuật tôn vinh vẻ đẹp người phụ nữ Việt Nam.
            </p>
            <div className="mt-6">
              <p className="text-xs uppercase tracking-wider text-[#C85A32] font-medium mb-3">Nhận Ưu Đãi Mới Nhất</p>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full min-w-0 px-3.5 py-2.5 h-10 bg-white/10 border border-white/20 text-[#FBF9F5] placeholder:text-[#FBF9F5]/40 text-sm rounded-lg focus:border-[#C85A32] focus:outline-none focus:ring-1 focus:ring-[#C85A32]"
                />
                <button
                  type="submit"
                  aria-label="Đăng ký"
                  className="h-10 px-4 bg-[#C85A32] hover:bg-[#C85A32]/90 text-white shrink-0 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Col 2: Khám Phá */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C85A32] mb-5">Khám Phá</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={() => handleNav("products")} className="text-sm text-[#FBF9F5]/60 hover:text-[#C85A32] transition-colors duration-200 hover:translate-x-1 inline-block text-left cursor-pointer">
                  Bộ Sưu Tập
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("express24h")} className="text-sm text-[#C85A32] font-semibold hover:underline transition-colors duration-200 hover:translate-x-1 inline-block text-left cursor-pointer flex items-center gap-1">
                  <span>⚡ Đặt Hàng 24h</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("lookbook")} className="text-sm text-[#FBF9F5]/60 hover:text-[#C85A32] transition-colors duration-200 hover:translate-x-1 inline-block text-left cursor-pointer">
                  Lookbook
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("design-studio")} className="text-sm text-[#FBF9F5]/60 hover:text-[#C85A32] transition-colors duration-200 hover:translate-x-1 inline-block text-left cursor-pointer">
                  AI Design Studio
                </button>
              </li>
              {FEATURE_FLAGS.ENABLE_AI_TRY_ON && (
                <li>
                  <button onClick={() => handleNav("try-on")} className="text-sm text-[#FBF9F5]/60 hover:text-[#C85A32] transition-colors duration-200 hover:translate-x-1 inline-block text-left cursor-pointer">
                    Phòng Xem Đồ AI
                  </button>
                </li>
              )}
              <li>
                <button onClick={() => handleNav("360")} className="text-sm text-[#FBF9F5]/60 hover:text-[#C85A32] transition-colors duration-200 hover:translate-x-1 inline-block text-left cursor-pointer">
                  Trải Nghiệm 360°
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("journal")} className="text-sm text-[#FBF9F5]/60 hover:text-[#C85A32] transition-colors duration-200 hover:translate-x-1 inline-block text-left cursor-pointer">
                  Tạp Chí
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("about")} className="text-sm text-[#FBF9F5]/60 hover:text-[#C85A32] transition-colors duration-200 hover:translate-x-1 inline-block text-left cursor-pointer">
                  Câu Chuyện
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Chính Sách */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C85A32] mb-5">Chính Sách</h4>
            <ul className="space-y-3">
              <li><span className="text-sm text-[#FBF9F5]/60 hover:text-[#C85A32] transition-colors duration-200 cursor-pointer">Giao Hàng Toàn Quốc</span></li>
              <li><span className="text-sm text-[#FBF9F5]/60 hover:text-[#C85A32] transition-colors duration-200 cursor-pointer">Đổi Trả 30 Ngày</span></li>
              <li><span className="text-sm text-[#FBF9F5]/60 hover:text-[#C85A32] transition-colors duration-200 cursor-pointer">Bảo Mật Thông Tin</span></li>
              <li><span className="text-sm text-[#FBF9F5]/60 hover:text-[#C85A32] transition-colors duration-200 cursor-pointer">Hướng Dẫn Chọn Size</span></li>
              <li><span className="text-sm text-[#FBF9F5]/60 hover:text-[#C85A32] transition-colors duration-200 cursor-pointer">Chăm Sóc Áo Dài</span></li>
            </ul>
          </div>

          {/* Col 4: Liên Hệ & Social */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C85A32] mb-5">Liên Hệ</h4>
            <ul className="space-y-3 text-sm text-[#FBF9F5]/60">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C85A32]/80 mt-0.5 shrink-0" />
                <span>Hà Nội, Việt Nam</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C85A32]/80 shrink-0" />
                <span>(+84) 394961557</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C85A32]/80 shrink-0" />
                <span>admin@daiverse.com.vn</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C85A32]/80 shrink-0" />
                <span>9:00 — 21:00</span>
              </li>
            </ul>

            <div className="flex gap-3 mt-6">
              <a href="#" className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:border-[#C85A32] hover:text-[#C85A32] hover:bg-[#C85A32]/10 transition-all">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:border-[#C85A32] hover:text-[#C85A32] hover:bg-[#C85A32]/10 transition-all">
                <Send className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 mb-8 flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#C85A32]/30"></div>
          <div className="w-1.5 h-1.5 rotate-45 bg-[#C85A32]/60"></div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#C85A32]/30"></div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#FBF9F5]/40">
          <p>© 2026 DaiVerse. Bảo lưu mọi quyền.</p>
          <p className="flex items-center gap-1.5">
            Thiết kế với <Heart className="w-3 h-3 text-[#C85A32] fill-current" /> tại Việt Nam
          </p>
        </div>
      </div>
    </footer>
  );
}
