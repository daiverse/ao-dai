import React, { useState } from "react";
import { X, Ruler, Sparkles, CheckCircle2, ShieldCheck, Info, HelpCircle } from "lucide-react";

export default function SizeGuideModal({ isOpen, onClose, onSelectTailoredSize }) {
  const [activeTab, setActiveTab] = useState("chart"); // 'chart' | 'how-to-measure' | 'custom'

  // Custom measurements state
  const [customHeight, setCustomHeight] = useState("");
  const [customWeight, setCustomWeight] = useState("");
  const [customBust, setCustomBust] = useState("");
  const [customWaist, setCustomWaist] = useState("");
  const [customHips, setCustomHips] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  // Bảng thông số kỹ thuật chuẩn may đo Áo Dài nữ Việt Nam 2026
  const sizeData = [
    { size: "S", height: "150 – 155", weight: "40 – 45", bust: "80 – 84", waist: "60 – 64", hips: "84 – 88" },
    { size: "M", height: "155 – 160", weight: "45 – 50", bust: "84 – 88", waist: "64 – 68", hips: "88 – 92" },
    { size: "L", height: "160 – 165", weight: "50 – 55", bust: "88 – 92", waist: "68 – 72", hips: "92 – 96" },
    { size: "XL", height: "165 – 170", weight: "55 – 60", bust: "92 – 96", waist: "72 – 76", hips: "96 – 100" },
    { size: "XXL", height: "165 – 175", weight: "60 – 68", bust: "96 – 100", waist: "76 – 80", hips: "100 – 104" },
  ];

  const handleSaveCustomMeasurements = (e) => {
    e.preventDefault();
    setIsSaved(true);
    if (onSelectTailoredSize) {
      onSelectTailoredSize({
        height: customHeight,
        weight: customWeight,
        bust: customBust,
        waist: customWaist,
        hips: customHips,
        note: customNote,
      });
    }
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-all z-10 border-none cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#EFB11D] to-[#C8A800] p-6 text-white text-center shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#EFB11D] text-[11px] font-bold uppercase tracking-wider mb-2 border border-white/10">
            <Ruler className="w-3.5 h-3.5" /> Chuẩn Phom May Đo Áo Dài Việt
          </div>
          <h2 className="font-heading text-2xl font-bold">Bảng Hướng Dẫn May Đo Chuẩn</h2>
          <p className="text-xs text-gray-300 mt-1 font-light">
            Thông số chuẩn tôn dáng mềm mại, ôm vừa ngực & thắt eo sang trọng
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <button
              onClick={() => setActiveTab("chart")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                activeTab === "chart"
                  ? "bg-[#E43D12] text-white border-[#E43D12] shadow-md"
                  : "bg-white/10 text-white/80 border-white/10 hover:bg-white/20"
              }`}
            >
              Bảng Size Chuẩn
            </button>
            <button
              onClick={() => setActiveTab("how-to-measure")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                activeTab === "how-to-measure"
                  ? "bg-[#E43D12] text-white border-[#E43D12] shadow-md"
                  : "bg-white/10 text-white/80 border-white/10 hover:bg-white/20"
              }`}
            >
              Cách Đo Tại Nhà
            </button>
            <button
              onClick={() => setActiveTab("custom")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer flex items-center gap-1 ${
                activeTab === "custom"
                  ? "bg-[#EFB11D] text-[#EFB11D] border-[#EFB11D] shadow-md"
                  : "bg-white/10 text-white/80 border-white/10 hover:bg-white/20"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#EFB11D]" />
              <span>May Theo Số Đo</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: BẢNG SIZE CHUẨN */}
          {activeTab === "chart" && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full text-center text-xs">
                  <thead>
                    <tr className="bg-[#EFB11D] text-white font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-2">Size</th>
                      <th className="py-3 px-2">Chiều cao (cm)</th>
                      <th className="py-3 px-2">Cân nặng (kg)</th>
                      <th className="py-3 px-2">Vòng 1 - Ngực</th>
                      <th className="py-3 px-2">Vòng 2 - Eo</th>
                      <th className="py-3 px-2">Vòng 3 - Mông</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {sizeData.map((item, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-[#EBE9E1] transition-colors ${
                          idx % 2 === 1 ? "bg-gray-50/50" : "bg-white"
                        }`}
                      >
                        <td className="py-3 px-2 font-bold text-[#EFB11D] text-sm">{item.size}</td>
                        <td className="py-3 px-2">{item.height}</td>
                        <td className="py-3 px-2">{item.weight}</td>
                        <td className="py-3 px-2 font-semibold text-gray-900">{item.bust} cm</td>
                        <td className="py-3 px-2 font-semibold text-[#E43D12]">{item.waist} cm</td>
                        <td className="py-3 px-2 font-semibold text-gray-900">{item.hips} cm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Advice Box */}
              <div className="p-4 bg-[#EBE9E1] rounded-2xl border border-gray-200/80 space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2 text-[#EFB11D] font-bold">
                  <Info className="w-4 h-4 text-[#E43D12]" />
                  <span>Kinh nghiệm chọn size áo dài vừa vặn:</span>
                </div>
                <ul className="space-y-1 pl-6 list-disc text-gray-600 leading-relaxed">
                  <li><strong>Vòng 2 (Eo) là quan trọng nhất:</strong> Áo dài tôn dáng dựa trên độ siết eo vừa vặn. Hãy ưu tiên chọn theo vòng eo.</li>
                  <li>Nếu số đo của bạn nằm giữa 2 size, hãy <strong>chọn size lớn hơn</strong> để dễ dàng chiết nếp hoặc bóp eo vừa khít.</li>
                  <li>Đối với lụa tơ tằm nguyên chất hoặc gấm không co giãn, vui lòng cộng thêm 1-2cm số đo vòng ngực khi chọn.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: HƯỚNG DẪN ĐO TẠI NHÀ */}
          {activeTab === "how-to-measure" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-2 shadow-xs">
                  <span className="w-6 h-6 rounded-full bg-[#E43D12] text-white font-bold text-xs flex items-center justify-center">1</span>
                  <h4 className="font-bold text-sm text-gray-900">Vòng Ngực (Vòng 1)</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Vòng thước dây ngang qua phần lớn nhất của ngực. Giữ thước thẳng ngang lưng và mặc áo lót đệm vừa phải khi đo.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-2 shadow-xs">
                  <span className="w-6 h-6 rounded-full bg-[#E43D12] text-white font-bold text-xs flex items-center justify-center">2</span>
                  <h4 className="font-bold text-sm text-gray-900">Vòng Eo (Vòng 2)</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Vòng qua vị trí nhỏ nhất của thắt eo (thường cách rốn 4cm hoặc ngang nếp gấp cùi tay khi đứng thẳng). Không hóp bụng.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-2 shadow-xs">
                  <span className="w-6 h-6 rounded-full bg-[#E43D12] text-white font-bold text-xs flex items-center justify-center">3</span>
                  <h4 className="font-bold text-sm text-gray-900">Vòng Mông (Vòng 3)</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Đứng chụm hai chân thẳng, đo quanh điểm đỉnh cao nhất của mông để tà áo xòe rủ ôm mượt dáng.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-2 shadow-xs">
                  <span className="w-6 h-6 rounded-full bg-[#E43D12] text-white font-bold text-xs flex items-center justify-center">4</span>
                  <h4 className="font-bold text-sm text-gray-900">Rộng Vai & Dài Áo</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong>Rộng vai:</strong> Đo từ đầu xương vai trái qua gáy sang vai phải.<br />
                    <strong>Dài áo:</strong> Đo từ chân cổ sau xuống qua đầu gối hoặc gót chân.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-center gap-3">
                <HelpCircle className="w-5 h-5 shrink-0 text-amber-600" />
                <span>Cần tư vấn trực tiếp? Liên hệ hotline/Zalo: <strong>(+84) 394961557</strong> để nghệ nhân hỗ trợ đo dáng.</span>
              </div>
            </div>
          )}

          {/* TAB 3: MAY THEO SỐ ĐO RIÊNG (TAILORED) */}
          {activeTab === "custom" && (
            <form onSubmit={handleSaveCustomMeasurements} className="space-y-4">
              {isSaved ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-900 text-base">Đã Ghi Nhận Số Đo Cá Nhân!</h4>
                  <p className="text-xs text-emerald-700">Bộ phận cắt may DaiVerse sẽ may theo đúng kích thước bạn vừa nhập.</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-600">
                    Nhập số đo thực tế của bạn để nghệ nhân may đo thủ công chuẩn vừa vặn 100%:
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-700 uppercase">Chiều cao (cm)</label>
                      <input
                        type="number"
                        placeholder="160"
                        required
                        value={customHeight}
                        onChange={(e) => setCustomHeight(e.target.value)}
                        className="w-full px-3 py-2 bg-[#EBE9E1] border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#E43D12]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-700 uppercase">Cân nặng (kg)</label>
                      <input
                        type="number"
                        placeholder="48"
                        required
                        value={customWeight}
                        onChange={(e) => setCustomWeight(e.target.value)}
                        className="w-full px-3 py-2 bg-[#EBE9E1] border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#E43D12]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-700 uppercase">Vòng Ngực (cm)</label>
                      <input
                        type="number"
                        placeholder="85"
                        required
                        value={customBust}
                        onChange={(e) => setCustomBust(e.target.value)}
                        className="w-full px-3 py-2 bg-[#EBE9E1] border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#E43D12]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-700 uppercase">Vòng Eo (cm)</label>
                      <input
                        type="number"
                        placeholder="65"
                        required
                        value={customWaist}
                        onChange={(e) => setCustomWaist(e.target.value)}
                        className="w-full px-3 py-2 bg-[#EBE9E1] border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#E43D12]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-700 uppercase">Vòng Mông (cm)</label>
                      <input
                        type="number"
                        placeholder="90"
                        required
                        value={customHips}
                        onChange={(e) => setCustomHips(e.target.value)}
                        className="w-full px-3 py-2 bg-[#EBE9E1] border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#E43D12]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-700 uppercase">Lưu Ý Dáng Người</label>
                      <input
                        type="text"
                        placeholder="VD: Vai hơi gầy, bắp tay nhỏ"
                        value={customNote}
                        onChange={(e) => setCustomNote(e.target.value)}
                        className="w-full px-3 py-2 bg-[#EBE9E1] border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#E43D12]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#EFB11D] hover:bg-[#EFB11D]/90 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer border-none"
                  >
                    Lưu Số Đo May Riêng & Áp Dụng Cho Đơn Hàng
                  </button>
                </>
              )}
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-[#EBE9E1] px-6 py-3 border-t border-gray-200 text-center text-[11px] text-gray-500 flex items-center justify-between shrink-0">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Cam Kết May Vừa Vặn 100%
          </span>
          <span>Đổi Size Miễn Phí Trong 15 Ngày</span>
        </div>
      </div>
    </div>
  );
}
