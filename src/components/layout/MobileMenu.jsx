import React from "react";
import { X, Sparkles, ChevronRight } from "lucide-react";
import { FEATURE_FLAGS } from "../../config/featureFlags";

export default function MobileMenu({ isOpen, onClose, activeTab, setActiveTab }) {
  if (!isOpen) return null;

  const navLinks = [
    { id: "home", label: "Trang Chủ" },
    { id: "products", label: "Sản Phẩm" },
    { id: "express24h", label: "⚡ Đặt Hàng 24h (Giao Hỏa Tốc)", isExpress: true },
    { id: "360", label: "Xem 360°" },
    { id: "lookbook", label: "Bộ Sưu Tập 2026" },
    { id: "design-studio", label: "AI Design Studio (Thiết Kế AI)" },
    ...(FEATURE_FLAGS.ENABLE_AI_TRY_ON ? [{ id: "try-on", label: "Phòng Xem Đồ AI (Thử Đồ AI)" }] : []),
    { id: "about", label: "Câu Chuyện Di Sản" },
    { id: "journal", label: "Tạp Chí & Kỹ Năng" },
    { id: "contact", label: "Liên Hệ Showroom" }
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl flex flex-col justify-between p-6 animate-fade-in">
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#EFB11D]/40 flex items-center justify-center">
                <img src="/logo.jpg" alt="DaiVerse" className="w-full h-full object-cover" />
              </div>
              <span className="font-heading font-bold text-lg text-[#E43D12]">DaiVerse</span>
            </div>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-6 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  onClose();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between text-sm font-medium transition-all ${
                  activeTab === link.id
                    ? "bg-[#EFB11D] text-[#2C1A00] font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className={`w-4 h-4 ${activeTab === link.id ? "text-[#EFB11D]" : "text-gray-400"}`} />
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <button
            onClick={() => {
              setActiveTab("design-studio");
              onClose();
            }}
            className="w-full py-3 bg-[#E43D12] text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-[#E43D12]/25"
          >
            <Sparkles className="w-4 h-4" />
            <span>Trải Nghiệm AI Studio</span>
          </button>
        </div>
      </div>
    </div>
  );
}
