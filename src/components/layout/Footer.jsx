import React, { useState } from "react";
import { Send, MapPin, Phone, Mail, Clock, Heart, ExternalLink, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { FEATURE_FLAGS } from "../../config/featureFlags";

export default function Footer({ setActiveTab }) {
  const [email, setEmail] = useState("");
  const { showToast } = useCart();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      showToast("Cảm ơn bạn đã đăng ký nhận thông tin ưu đãi từ Áo Dài DaiVerse!");
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
    <footer className="bg-[#111111] text-white pt-16 pb-12 mt-20 border-t-4 border-[#C5A059]">
      {/* Policy highlights bar */}
      <div className="container-page pb-12 border-b border-neutral-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0 text-[#C5A059]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-white">GIAO HÀNG HỎA TỐC 24H</h5>
              <p className="text-xs text-neutral-400 mt-1">Giao hàng hỏa tốc tận tay trong vòng 24h</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0 text-[#C5A059]">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-white">ĐỔI TRẢ TRONG 15 NGÀY</h5>
              <p className="text-xs text-neutral-400 mt-1">Đổi trả dễ dàng tại toàn bộ hệ thống cửa hàng</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0 text-[#C5A059]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-white">100% CHÍNH HÃNG</h5>
              <p className="text-xs text-neutral-400 mt-1">Cam kết sản phẩm cao cấp, tinh xảo từng đường may</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container-page py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Brand Info */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img src="/logo.png" alt="Áo Dài DaiVerse" className="h-12 w-auto bg-white p-1 rounded-sm object-contain shrink-0" />
              <span className="font-heading font-black text-xl tracking-widest text-[#C5A059] uppercase block">
                DAIVERSE
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed mb-6">
              DaiVerse – Thương hiệu thời trang Áo Dài cao cấp hàng đầu Việt Nam. Sự kết hợp giữa đường nét Áo Dài truyền thống và hơi thở công nghệ AI hiện đại.
            </p>
            <ul className="space-y-2.5 text-xs text-neutral-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Showroom: Hoành Sơn Complex, 282 Nguyễn Huy Tưởng, Thanh Xuân, Hà Nội</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Hotline: <strong className="text-white">0394961557</strong> (8:00 - 22:00)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Email: daiverseg5@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-neutral-800 pb-3 mb-4">
              KHÁM PHÁ BỘ SƯU TẬP
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav("products")} className="text-neutral-400 hover:text-[#C5A059] transition-colors cursor-pointer border-none bg-transparent">
                  Áo Dài Truyền Thống
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("express24h")} className="text-[#C5A059] font-semibold hover:underline transition-colors cursor-pointer border-none bg-transparent flex items-center gap-1">
                  <span>⚡ Giao Hàng Hỏa Tốc 24h</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("lookbook")} className="text-neutral-400 hover:text-[#C5A059] transition-colors cursor-pointer border-none bg-transparent">
                  Bộ Sưu Tập Lookbook 2026
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("design-studio")} className="text-neutral-400 hover:text-[#C5A059] transition-colors cursor-pointer border-none bg-transparent">
                  AI Design Studio
                </button>
              </li>
              {FEATURE_FLAGS.ENABLE_AI_TRY_ON && (
                <li>
                  <button onClick={() => handleNav("try-on")} className="text-neutral-400 hover:text-[#C5A059] transition-colors cursor-pointer border-none bg-transparent">
                    Phòng Thử Đồ AI
                  </button>
                </li>
              )}
              <li>
                <button onClick={() => handleNav("360")} className="text-neutral-400 hover:text-[#C5A059] transition-colors cursor-pointer border-none bg-transparent">
                  Xem Sản Phẩm 360°
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("journal")} className="text-neutral-400 hover:text-[#C5A059] transition-colors cursor-pointer border-none bg-transparent">
                  Tạp Chí Thời Trang
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-neutral-800 pb-3 mb-4">
              HỖ TRỢ KHÁCH HÀNG
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li className="hover:text-white cursor-pointer transition-colors">Hướng dẫn chọn Size Áo Dài</li>
              <li className="hover:text-white cursor-pointer transition-colors">Chính sách bảo hành & sửa đồ</li>
              <li className="hover:text-white cursor-pointer transition-colors">Quy định đổi trả hàng</li>
              <li className="hover:text-white cursor-pointer transition-colors">Chính sách bảo mật thông tin</li>
              <li className="hover:text-white cursor-pointer transition-colors">Điều khoản dịch vụ</li>
              <li className="hover:text-white cursor-pointer transition-colors">Hệ thống cửa hàng DaiVerse</li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Social */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-neutral-800 pb-3 mb-4">
              ĐĂNG KÝ NHẬN VOUCHER 10%
            </h4>
            <p className="text-xs text-neutral-400 mb-4">
              Nhập email để nhận ngay mã giảm giá và cập nhật bộ sưu tập mới nhất từ DaiVerse.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
              <input
                type="email"
                placeholder="Địa chỉ Email của bạn..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-xs focus:border-[#C5A059] focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-[#C5A059] hover:bg-[#A4813D] text-white text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer border-none"
              >
                Đăng Ký Ngay
              </button>
            </form>

            <div className="flex gap-3">
              <a 
                href="https://www.facebook.com/profile.php?id=61590664110972" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-[#C5A059] hover:border-[#C5A059] transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://www.tiktok.com/@daiverse91" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-[#C5A059] hover:border-[#C5A059] transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.82.12V9.4a6.33 6.33 0 0 0-1-.08 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.05a8.27 8.27 0 0 0 4.97 1.63V7.24a4.83 4.83 0 0 1-3.01-.55z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="container-page pt-6 border-t border-neutral-900 text-center text-xs text-neutral-500">
        <p>© 2026 ÁO DÀI DAIVERSE. Tất cả quyền được bảo lưu.</p>
      </div>
    </footer>
  );
}

