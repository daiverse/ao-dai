import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ContactPage() {
  const { showToast } = useCart();
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("Cảm ơn bạn! DaiVerse đã nhận thông tin và sẽ phản hồi trong 15 phút.");
    setFormData({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <div className="pt-28 pb-20 bg-[#EBE9E1] min-h-screen">
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-[#E43D12] font-bold mb-2">
            Kết Nối Cùng DaiVerse
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900">
            Liên Hệ Showroom & Tư Vấn
          </h1>
          <p className="text-gray-600 mt-3 text-sm sm:text-base">
            Đội ngũ tư vấn thiết kế DaiVerse luôn sẵn sàng lắng nghe & đáp ứng nhu cầu may đo áo dài của quý khách.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Info Card Left */}
          <div className="lg:col-span-5 bg-[#EFB11D] text-[#2C1A00] p-8 rounded-3xl shadow-xl space-y-8">
            <h3 className="font-heading font-bold text-2xl text-[#2C1A00]">Showroom Trải Nghiệm</h3>
            
            <div className="space-y-6 text-sm text-[#2C1A00]/80">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#2C1A00]/10 rounded-xl text-[#2C1A00]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-[#2C1A00]">Địa chỉ:</p>
                  <p className="text-[#2C1A00]/70 mt-0.5">Hoành Sơn Complex, 282 Nguyễn Huy Tưởng, Thanh Xuân, Hà Nội</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#2C1A00]/10 rounded-xl text-[#2C1A00]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-[#2C1A00]">Hotline tư vấn đặt lịch:</p>
                  <p className="text-[#2C1A00]/70 mt-0.5">0394961557 (Zalo / Call)</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#2C1A00]/10 rounded-xl text-[#2C1A00]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-[#2C1A00]">Email hỗ trợ:</p>
                  <p className="text-[#2C1A00]/70 mt-0.5">daiverseg5@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#2C1A00]/10 rounded-xl text-[#2C1A00]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-[#2C1A00]">Giờ mở cửa:</p>
                  <p className="text-[#2C1A00]/70 mt-0.5">08:00 — 22:00 (Tất cả các ngày trong tuần)</p>
                </div>
              </div>

              {/* Social & Contact Actions */}
              <div className="pt-4 border-t border-[#2C1A00]/10 flex flex-wrap justify-center gap-2.5">
                <a
                  href="https://www.facebook.com/profile.php?id=61590664110972"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-[#2C1A00] text-white rounded-xl text-xs font-bold hover:bg-[#2C1A00]/80 transition-colors inline-flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>
                <a
                  href="https://www.tiktok.com/@daiverse91"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-[#2C1A00] text-white rounded-xl text-xs font-bold hover:bg-[#2C1A00]/80 transition-colors inline-flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.82.12V9.4a6.33 6.33 0 0 0-1-.08 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.05a8.27 8.27 0 0 0 4.97 1.63V7.24a4.83 4.83 0 0 1-3.01-.55z"/>
                  </svg>
                  <span>TikTok</span>
                </a>
                <a
                  href="https://zalo.me/0394961557"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-[#2C1A00] text-white rounded-xl text-xs font-bold hover:bg-[#2C1A00]/80 transition-colors inline-flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Zalo Chat</span>
                </a>
                <a
                  href="tel:0394961557"
                  className="px-3.5 py-2 bg-[#2C1A00] text-white rounded-xl text-xs font-bold hover:bg-[#2C1A00]/80 transition-colors inline-flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Gọi Miễn Phí (0394961557)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Form Right */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h3 className="font-heading font-bold text-2xl text-gray-900 mb-6">Gửi Yêu Cầu Tư Vấn May Đo</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5">Họ và tên của bạn *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#EBE9E1] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#EFB11D]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1.5">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0901234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[#EBE9E1] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#EFB11D]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Email liên hệ</label>
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#EBE9E1] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#EFB11D]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Nội dung tư vấn (Áo dài cưới, sự kiện, may theo số đo...)</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Nhập nội dung cần hỗ trợ..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-[#EBE9E1] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#EFB11D]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#EFB11D] text-white font-bold rounded-2xl hover:bg-[#EFB11D]/90 shadow-xl shadow-[#EFB11D]/20 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
              >
                <Send className="w-4 h-4 text-[#EFB11D]" />
                <span>Gửi Yêu Cầu Tư Vấn</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
