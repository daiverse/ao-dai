import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ContactPage() {
  const { showToast } = useCart();
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("Cảm ơn bạn! Serene đã nhận thông tin và sẽ phản hồi trong 15 phút.");
    setFormData({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <div className="pt-28 pb-20 bg-[#FBF9F5] min-h-screen">
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C85A32] font-bold mb-2">
            Kết Nối Cùng Serene
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900">
            Liên Hệ Showroom & Tư Vấn
          </h1>
          <p className="text-gray-600 mt-3 text-sm sm:text-base">
            Đội ngũ tư vấn thiết kế Serene luôn sẵn sàng lắng nghe & đáp ứng nhu cầu may đo áo dài của quý khách.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Info Card Left */}
          <div className="lg:col-span-5 bg-[#18392B] text-white p-8 rounded-3xl shadow-xl space-y-8">
            <h3 className="font-heading font-bold text-2xl text-[#D4A373]">Showroom Trải Nghiệm</h3>
            
            <div className="space-y-6 text-sm text-gray-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-xl text-[#D4A373]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white">Địa chỉ flagship:</p>
                  <p className="text-gray-300 mt-0.5">123 Đường Đồng Khởi, Quận 1, Thành Phố Hồ Chí Minh</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl text-[#D4A373]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white">Hotline tư vấn đặt lịch:</p>
                  <p className="text-gray-300 mt-0.5">0909 123 456 (Zalo / Call)</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl text-[#D4A373]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white">Email hỗ trợ:</p>
                  <p className="text-gray-300 mt-0.5">hello@sereneaodai.vn</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl text-[#D4A373]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white">Giờ mở cửa:</p>
                  <p className="text-gray-300 mt-0.5">9:00 — 21:00 (Tất cả các ngày trong tuần)</p>
                </div>
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
                    className="w-full px-4 py-3 bg-[#FBF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#18392B]"
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
                    className="w-full px-4 py-3 bg-[#FBF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#18392B]"
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
                  className="w-full px-4 py-3 bg-[#FBF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#18392B]"
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
                  className="w-full px-4 py-3 bg-[#FBF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#18392B]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#18392B] text-white font-bold rounded-2xl hover:bg-[#18392B]/90 shadow-xl shadow-[#18392B]/20 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
              >
                <Send className="w-4 h-4 text-[#D4A373]" />
                <span>Gửi Yêu Cầu Tư Vấn</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
