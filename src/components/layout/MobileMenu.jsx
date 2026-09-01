import React from "react";
import { X, Sparkles, ChevronRight } from "lucide-react";
import { FEATURE_FLAGS } from "../../config/featureFlags";

export default function MobileMenu({ isOpen, onClose, activeTab, setActiveTab }) {
  if (!isOpen) return null;

  const navLinks = [
    { id: "home", label: "TRANG CHỦ" },
    { id: "products", label: "SẢN PHẨM" },
    { id: "express24h", label: "⚡ GIAO 24H (HỎA TỐC)", isExpress: true },
    { id: "360", label: "XEM SẢN PHẨM 360°" },
    { id: "lookbook", label: "BỘ SƯU TẬP LOOKBOOK 2026" },
    { id: "design-studio", label: "CUSTOM ÁO DÀI" },
    ...(FEATURE_FLAGS.ENABLE_AI_TRY_ON ? [{ id: "try-on", label: "PHÒNG THỬ ĐỒ AI" }] : []),
    { id: "about", label: "CÂU CHUYỆN CÔNG TY DaiVerse" },
    { id: "journal", label: "TẠP CHÍ THỜI TRANG" },
    { id: "contact", label: "HỆ THỐNG CỬA HÀNG" }
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl flex flex-col justify-between p-5 animate-fade-in border-l border-neutral-200">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Áo Dài DaiVerse" className="h-8 w-auto object-contain shrink-0" />
              <span className="font-heading font-black text-sm tracking-wider text-[#C5A059] uppercase">
                DAIVERSE
              </span>
            </div>
            <button onClick={onClose} className="p-2 text-neutral-500 hover:text-black cursor-pointer border-none bg-transparent">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-4 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  onClose();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-full text-left px-3 py-2.5 flex items-center justify-between text-xs font-bold tracking-wider transition-all border-none uppercase ${
                  activeTab === link.id
                    ? "bg-[#111111] text-white"
                    : link.isExpress
                      ? "text-[#C5A059] hover:bg-neutral-100"
                      : "text-[#111111] hover:bg-neutral-100"
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className={`w-4 h-4 ${activeTab === link.id ? "text-[#C5A059]" : "text-neutral-400"}`} />
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-neutral-200">
          <button
            onClick={() => {
              setActiveTab("design-studio");
              onClose();
            }}
            className="w-full py-3 bg-[#C5A059] text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#A4813D] transition-all cursor-pointer border-none"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Trải Nghiệm Custom Áo Dài</span>
          </button>
        </div>
      </div>
    </div>
  );
}

