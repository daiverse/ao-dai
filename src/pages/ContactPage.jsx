import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ContactPage() {
  const { showToast } = useCart();
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("Cảm ơn bạn! Áo Dài DaiVerse đã nhận thông tin và sẽ phản hồi trong 15 phút.");
    setFormData({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <div className="pt-32 sm:pt-36 pb-20 bg-[#FAF6F0] min-h-screen text-[#111111]">

      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-[10px] uppercase tracking-widest text-white bg-[#C5A059] font-extrabold px-3 py-1 inline-block">
            KẾT NỐI CÙNG ÁO DÀI DAIVERSE
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#111111] uppercase tracking-wide">
            LIÊN HỆ & TƯ VẤN MAY ĐO
          </h1>
          <p className="text-neutral-600 text-xs sm:text-sm max-w-lg mx-auto font-normal">
            Đội ngũ tư vấn Áo Dài DaiVerse luôn sẵn sàng hỗ trợ & đáp ứng nhu cầu thời trang Áo Dài của quý khách.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Info Card Left */}
          <div className="lg:col-span-5 bg-[#111111] text-white p-6 sm:p-8 border border-neutral-800 space-y-6">
            <h3 className="font-heading font-black text-xl text-white uppercase">SHOWROOM TRẢI NGHIỆM</h3>
            
            <div className="space-y-5 text-xs text-neutral-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white uppercase">Địa chỉ Showroom:</p>
                  <p className="text-neutral-400 mt-0.5">Hoành Sơn Complex, 282 Nguyễn Huy Tưởng, Thanh Xuân, Hà Nội</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#C5A059] shrink-0" />
                <div>
                  <p className="font-bold text-white uppercase">Hotline tư vấn VIP:</p>
                  <p className="text-neutral-400 mt-0.5">0394.961.557 (Zalo / Call 24/7)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#C5A059] shrink-0" />
                <div>
                  <p className="font-bold text-white uppercase">Email hỗ trợ:</p>
                  <p className="text-neutral-400 mt-0.5">daiverseg5@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#C5A059] shrink-0" />
                <div>
                  <p className="font-bold text-white uppercase">Giờ mở cửa:</p>
                  <p className="text-neutral-400 mt-0.5">08:00 — 22:00 (Tất cả các ngày trong tuần)</p>
                </div>
              </div>

              {/* Social & Contact Actions */}
              <div className="pt-4 border-t border-neutral-800 flex flex-wrap justify-center gap-2">
                <a
                  href="tel:0394961557"
                  className="px-4 py-2.5 bg-[#C5A059] text-white font-bold text-xs uppercase tracking-widest transition-all border-none"
                >
                  HOTLINE 0394.961.557
                </a>
              </div>
            </div>
          </div>

          {/* Form Right */}
          <div className="lg:col-span-7 bg-neutral-50 p-6 sm:p-8 border border-neutral-300">
            <h3 className="font-heading font-black text-lg text-[#111111] uppercase mb-4">GỬI YÊU CẦU TƯ VẤN THỜI TRANG</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#111111] uppercase block mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-neutral-300 text-xs focus:outline-none focus:border-[#111111]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#111111] uppercase block mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0394961557"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-neutral-300 text-xs focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#111111] uppercase block mb-1">Email liên hệ</label>
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white border border-neutral-300 text-xs focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#111111] uppercase block mb-1">Nội dung tư vấn</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Nhập nội dung bạn cần hỗ trợ tư vấn..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white border border-neutral-300 text-xs focus:outline-none focus:border-[#111111] resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#111111] hover:bg-[#C5A059] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border-none flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>GỬI YÊU CẦU TƯ VẤN</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

