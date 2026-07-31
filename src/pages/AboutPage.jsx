import React from "react";
import { Heart, ShieldCheck, Sparkles, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20 bg-[#FBF9F5] min-h-screen">
      <div className="container-page space-y-16">
        {/* Hero story Header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C85A32] font-bold mb-2">
            Câu Chuyện Thương Hiệu
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#18392B]">
            DaiVerse — Tôn Vinh Vẻ Đẹp Việt
          </h1>
          <p className="text-gray-600 mt-4 text-base leading-relaxed">
            Hành trình kết nối di sản dệt lụa truyền thống nghìn năm cùng công nghệ thiết kế AI tương lai.
          </p>
        </div>

        {/* Narrative Image Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-gray-100">
          <div className="space-y-6">
            <h2 className="font-heading text-3xl font-bold text-gray-900 leading-tight">
              Từ Làng Nghề Dệt Lụa Đến <span className="text-[#C85A32]">Trí Tuệ Nhân Tạo</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              DaiVerse bắt đầu từ giấc mơ gìn giữ những cuộn lụa tơ tằm Bảo Lộc và đường kim thêu hoa sen tỉ mỉ của các nghệ nhân làng nghề. Chúng tôi mang đến nét thanh nhã cổ điển nhưng đầy tiện nghi hiện đại cho phái đẹp.
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Năm 2026, DaiVerse chính thức tích hợp AI Design Studio & Virtual Try-on giúp người dùng toàn cầu cá nhân hóa màu sắc, họa tiết và thử áo dài 3D vừa vặn ngay trên thiết bị di động.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
            <img src="/anh/754058094_122120859087355470_3079712870670515575_n.jpg" alt="DaiVerse Story" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#18392B]/10 text-[#18392B] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-gray-900">100% Lụa Tơ Tằm Tự Nhiên</h3>
            <p className="text-xs text-gray-500">Tuyển chọn chất liệu thượng hạng mềm nhẹ và bền màu qua hàng chục năm.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C85A32]/10 text-[#C85A32] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-gray-900">AI Studio Tiên Phong</h3>
            <p className="text-xs text-gray-500">Ứng dụng AI mô phỏng phom dáng 3D chuẩn từng milimet cho khách hàng.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-gray-900">Nghệ Nhân May Đo Thâm Niên</h3>
            <p className="text-xs text-gray-500">Mỗi tà áo được phụ trách may bởi các bàn tay vàng thâm niên trên 15 năm.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
