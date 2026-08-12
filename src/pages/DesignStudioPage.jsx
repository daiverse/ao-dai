import React, { useState } from "react";
import { Sparkles, Palette, Upload, Check, RefreshCw, Wand2, ArrowRight, Bookmark, Image as ImageIcon, Layers, HelpCircle, Flower2, Feather, Crown, Flame, Sun, Waves } from "lucide-react";
import { useCart } from "../context/CartContext";
import { generateAoDaiDesign } from "../utils/hfAI";

export default function DesignStudioPage({ onNavigate, onNavigateToTryOn }) {
  const { showToast } = useCart();

  // Step 1: Plain Áo Dài selection
  const [selectedSeason, setSelectedSeason] = useState("spring");
  const [customBaseImage, setCustomBaseImage] = useState(null);

  // Step 2: Pattern library selection (max 3)
  const [selectedPatterns, setSelectedPatterns] = useState(["sen"]);
  const [customPatternImage, setCustomPatternImage] = useState(null);

  // Step 3: Prompt Description
  const [promptText, setPromptText] = useState(
    "Giữ nguyên form áo dài. Thêm hoa sen vàng chạy dọc tà áo, phong cách Huế, chất liệu lụa cao cấp."
  );

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);

  // Plain Áo Dài Seasons Data
  const seasonsData = [
    {
      id: "spring",
      name: "Mùa Xuân",
      colorName: "Hồng Mộng Liên",
      colorCode: "#E8A5A5",
      image: "/anh/746927465_122119237899355470_7558522641041819280_n.jpg"
    },
    {
      id: "summer",
      name: "Mùa Hạ",
      colorName: "Vàng Nắng Hổ Phách",
      colorCode: "#E9C46A",
      image: "/anh/754058094_122120859087355470_3079712870670515575_n.jpg"
    },
    {
      id: "autumn",
      name: "Mùa Thu",
      colorName: "Cam Đất Hoàng Cúc",
      colorCode: "#C85A32",
      image: "/anh/748811734_122119072365355470_5191248946269688850_n.jpg"
    },
    {
      id: "winter",
      name: "Mùa Đông",
      colorName: "Xanh Đêm Hoàng Gia",
      colorCode: "#1B2A4A",
      image: "/anh/753471319_122120858943355470_7991801264771199577_n.jpg"
    }
  ];

  // Pattern Library Options
  const patternOptions = [
    { id: "sen", name: "Hoa Sen", icon: Flower2, desc: "Thêu tay sen vàng kiêu hãnh", color: "bg-[#E8A5A5]/25 text-[#C85A32]" },
    { id: "hac", name: "Chim Hạc", icon: Feather, desc: "Hạc mây cuộn dệt nổi kim tuyến", color: "bg-[#C85A32]/15 text-[#C85A32]" },
    { id: "rong", name: "Rồng", icon: Crown, desc: "Long triều uốn lụa cổ điển", color: "bg-[#18392B]/15 text-[#18392B]" },
    { id: "phuong", name: "Phượng", icon: Flame, desc: "Phượng hoàng hoàng gia quý phái", color: "bg-[#D4A373]/25 text-[#C85A32]" },
    { id: "mai", name: "Hoa Mai", icon: Sun, desc: "Mai vàng nhị thêu tơ tằm", color: "bg-[#E9C46A]/25 text-amber-700" },
    { id: "song", name: "Sóng Nước", icon: Waves, desc: "Sóng nước Thủy Ba triều đại", color: "bg-teal-500/15 text-teal-700" }
  ];

  // Sample prompt presets
  const samplePrompts = [
    "Giữ nguyên form áo dài. Thêm hoa sen vàng chạy dọc tà áo, phong cách Huế, chất liệu lụa cao cấp.",
    "Họa tiết chim hạc thêu tay tinh xảo ngực áo, viền tà đính hạt pha lê ánh bạc nhẹ nhàng.",
    "Họa tiết phượng hoàng lụa gấm thêu tay hoàng gia đỏ thắm quý phái cho lễ cưới."
  ];

  const togglePattern = (patternId) => {
    if (selectedPatterns.includes(patternId)) {
      setSelectedPatterns(selectedPatterns.filter((p) => p !== patternId));
    } else {
      if (selectedPatterns.length < 3) {
        setSelectedPatterns([...selectedPatterns, patternId]);
      } else {
        showToast("Bạn chỉ có thể chọn tối đa 3 họa tiết tham khảo!");
      }
    }
  };

  const handleCustomBaseUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomBaseImage(url);
      showToast("Đã tải ảnh áo dài trơn của bạn thành công!");
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedResult(null);

    try {
      const activeSeasonObj = seasonsData.find((s) => s.id === selectedSeason);

      // Gọi FLUX.1-schnell qua SDK chính thức (xử lý CORS tự động)
      const imageUrl = await generateAoDaiDesign({
        prompt: promptText,
        patterns: selectedPatterns,
        season: selectedSeason,
        colorName: activeSeasonObj?.colorName || "",
      });

      setGeneratedResult({
        id: `ai-design-${Date.now()}`,
        name: `Áo Dài AI — ${activeSeasonObj?.name} ${patternOptions.find((p) => p.id === selectedPatterns[0])?.name || "Hoa Sen"}`,
        season: activeSeasonObj?.name,
        color: activeSeasonObj?.colorName,
        patterns: selectedPatterns.map((id) => patternOptions.find((p) => p.id === id)?.name),
        prompt: promptText,
        image: imageUrl,
        baseImage: customBaseImage || activeSeasonObj?.image,
        price: 2150000,
        formattedPrice: "2.150.000đ",
      });

      showToast("🪄 FLUX AI đã tạo thiết kế áo dài thành công!");
    } catch (err) {
      console.error("AI Design error:", err);
      const msg = err?.message || "";
      if (msg.toLowerCase().includes("loading") || msg.includes("503")) {
        showToast("⏳ Model AI đang khởi động (~30s), hãy thử lại!");
      } else {
        showToast(`❌ ${msg || "Lỗi kết nối AI."}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };


  const handleTryOnNow = () => {
    if (generatedResult) {
      if (onNavigateToTryOn) {
        onNavigateToTryOn(generatedResult);
      } else if (onNavigate) {
        onNavigate("try-on");
      }
    }
  };

  const handleSaveDesign = () => {
    showToast("Đã lưu thiết kế vào Lịch Sử Thử Đồ của bạn!");
  };

  const currentSeason = seasonsData.find((s) => s.id === selectedSeason);

  return (
    <div className="pt-24 pb-20 bg-[#FBF9F5] min-h-screen">
      {/* 1. Hero Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#18392B] via-[#1c4333] to-[#0f241c] text-white py-14 px-4 sm:px-6 lg:px-8 mb-10 shadow-xl border-b border-[#D4A373]/30">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C85A32]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container-page relative z-10 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-[0.25em] text-[#D4A373]">
            <Wand2 className="w-3.5 h-3.5" />
            <span>FLUX KONTEXT PRO</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-white">
            AI Design Studio
          </h1>

          <p className="text-gray-200 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Upload áo dài trơn, chọn họa tiết từ thư viện DaiVerse, nhập mô tả — AI sẽ tạo thiết kế mới để bạn thử đồ ngay lập tức.
          </p>

          {/* Steps Indicator Flow */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-xs font-mono font-semibold text-[#D4A373]">
            <span className="px-3 py-1 bg-black/30 rounded-full border border-white/15">1. CHỌN ÁO TRƠN</span>
            <span className="text-gray-400">→</span>
            <span className="px-3 py-1 bg-black/30 rounded-full border border-white/15">2. HỌA TIẾT</span>
            <span className="text-gray-400">→</span>
            <span className="px-3 py-1 bg-black/30 rounded-full border border-white/15">3. MÔ TẢ</span>
            <span className="text-gray-400">→</span>
            <span className="px-3 py-1 bg-[#C85A32] text-white rounded-full font-bold">GENERATE</span>
          </div>
        </div>
      </section>

      {/* Main Workspace Layout */}
      <div className="container-page">
        {/* Step Progress Circles */}
        <div className="flex items-center justify-center gap-4 mb-10 text-xs font-medium">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${
              selectedSeason ? "bg-[#18392B] text-white" : "bg-gray-200 text-gray-600"
            }`}>
              <Check className="w-4 h-4" />
            </div>
            <span className="text-gray-900 font-semibold hidden sm:inline">Áo trơn</span>
          </div>
          <div className="w-12 sm:w-20 h-px bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${
              selectedPatterns.length > 0 ? "bg-[#18392B] text-white" : "bg-gray-200 text-gray-600"
            }`}>
              {selectedPatterns.length > 0 ? <Check className="w-4 h-4" /> : "2"}
            </div>
            <span className="text-gray-900 font-semibold hidden sm:inline">Họa tiết</span>
          </div>
          <div className="w-12 sm:w-20 h-px bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${
              promptText.trim() ? "bg-[#18392B] text-white" : "bg-gray-200 text-gray-600"
            }`}>
              <Sparkles className="w-4 h-4 text-[#D4A373]" />
            </div>
            <span className="text-gray-900 font-semibold hidden sm:inline">Mô tả</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Configuration Controls (Step 1, Step 2, Step 3) */}
          <div className="lg:col-span-7 space-y-8">
            {/* BƯỚC 1: CHỌN ÁO DÀI TRƠN */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C85A32] block mb-1">BƯỚC 1</span>
                <h2 className="font-heading font-bold text-2xl text-gray-900">Chọn áo dài trơn</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Chọn một trong 4 màu theo mùa hoặc tải ảnh áo dài trơn của bạn
                </p>
              </div>

              {/* 4 Seasonal Plain Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {seasonsData.map((s) => {
                  const isSelected = selectedSeason === s.id && !customBaseImage;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedSeason(s.id);
                        setCustomBaseImage(null);
                      }}
                      className={`group relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer text-left ${
                        isSelected
                          ? "border-[#18392B] ring-2 ring-[#18392B]/20 bg-[#18392B]/5 shadow-md"
                          : "border-gray-200 hover:border-gray-300 bg-[#FBF9F5]"
                      }`}
                    >
                      <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
                        <img
                          src={s.image}
                          alt={s.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#18392B] text-white flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <div className="p-3 bg-white border-t border-gray-100">
                        <p className="font-heading font-bold text-xs text-gray-900">{s.name}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{ backgroundColor: s.colorCode }}
                          ></span>
                          <span className="text-[10px] text-gray-500 truncate">{s.colorName}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Upload Drop Area */}
              <div className="pt-2">
                <label className="border-2 border-dashed border-gray-200 hover:border-[#18392B] rounded-2xl p-4 text-center block cursor-pointer bg-[#FBF9F5] transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={handleCustomBaseUpload} />
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-700">
                    <Upload className="w-4 h-4 text-[#C85A32]" />
                    <span>{customBaseImage ? "Thay đổi ảnh áo dài trơn của bạn" : "Hoặc tải ảnh áo dài trơn của bạn (PNG, JPG)"}</span>
                  </div>
                </label>
                {customBaseImage && (
                  <p className="text-[11px] text-emerald-700 font-medium mt-1 text-center">
                    ✓ Đã chọn ảnh tải lên cá nhân
                  </p>
                )}
              </div>
            </div>

            {/* BƯỚC 2: CHỌN HỌA TIẾT THAM KHẢO */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C85A32] block mb-1">BƯỚC 2</span>
                <h2 className="font-heading font-bold text-2xl text-gray-900">Chọn họa tiết tham khảo</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Chọn tối đa 3 họa tiết từ thư viện DaiVerse ({selectedPatterns.length}/3 đã chọn)
                </p>
              </div>

              {/* Pattern Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {patternOptions.map((pat) => {
                  const isSelected = selectedPatterns.includes(pat.id);
                  const IconComp = pat.icon;
                  return (
                    <button
                      key={pat.id}
                      onClick={() => togglePattern(pat.id)}
                      className={`group p-4 rounded-2xl border-2 transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-2.5 ${
                        isSelected
                          ? "border-[#C85A32] bg-[#C85A32]/5 ring-2 ring-[#C85A32]/20 shadow-xs"
                          : "border-gray-200 hover:border-gray-300 bg-[#FBF9F5]"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl ${pat.color} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-heading font-bold text-xs text-gray-900">{pat.name}</p>
                        <p className="text-[10px] text-gray-500 line-clamp-1">{pat.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Pattern Upload */}
              <div className="pt-1">
                <label className="border-2 border-dashed border-gray-200 hover:border-[#C85A32] rounded-2xl p-3.5 text-center block cursor-pointer bg-[#FBF9F5] transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    if (e.target.files[0]) {
                      setCustomPatternImage(URL.createObjectURL(e.target.files[0]));
                      showToast("Đã tải ảnh họa tiết riêng của bạn!");
                    }
                  }} />
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-700">
                    <Upload className="w-4 h-4 text-[#18392B]" />
                    <span>Hoặc tải thêm tối đa 2 ảnh tham khảo (tùy chọn)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* BƯỚC 3: MÔ TẢ THIẾT KẾ */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C85A32] block mb-1">BƯỚC 3</span>
                <h2 className="font-heading font-bold text-2xl text-gray-900">Mô tả thiết kế</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Mô tả chi tiết họa tiết, phong cách và chất liệu bạn mong muốn
                </p>
              </div>

              <textarea
                rows={4}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Ví dụ: Giữ nguyên form áo dài. Thêm hoa sen vàng chạy dọc tà áo, phong cách Huế, chất liệu lụa cao cấp..."
                className="w-full p-4 bg-[#FBF9F5] border border-gray-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-[#18392B] focus:ring-2 focus:ring-[#18392B]/10 leading-relaxed resize-none"
              ></textarea>

              {/* Sample Prompt Presets */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  Dùng mẫu gợi ý:
                </span>
                <div className="space-y-1.5">
                  {samplePrompts.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPromptText(preset)}
                      className="w-full text-left p-2.5 bg-[#FBF9F5] hover:bg-gray-100 rounded-xl text-xs text-gray-700 transition-colors border border-gray-200/60 flex items-center justify-between group cursor-pointer"
                    >
                      <span className="truncate pr-2">{preset}</span>
                      <span className="text-[10px] font-semibold text-[#C85A32] shrink-0 group-hover:underline">
                        Dùng mẫu →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Preview Canvas & Results (Sticky Panel) */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#18392B] text-white flex items-center justify-center">
                    <Wand2 className="w-4 h-4 text-[#D4A373]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-gray-900">Kết Quả AI</h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Flux Kontext Pro</p>
                  </div>
                </div>
              </div>

              {/* Render Canvas Box */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#FBF9F5] border border-gray-200 shadow-inner flex flex-col items-center justify-center p-4">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center text-center p-6 space-y-4 animate-pulse">
                    <div className="w-16 h-16 rounded-full bg-[#18392B] text-[#D4A373] flex items-center justify-center shadow-lg">
                      <Sparkles className="w-8 h-8 animate-spin" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-lg text-[#18392B]">AI đang dệt mẫu áo dài...</h4>
                      <p className="text-xs text-gray-500 mt-1">Đang xử lý ánh sáng, thêu gấm và dựng mẫu 3D</p>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden max-w-xs">
                      <div className="bg-[#C85A32] h-full w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                ) : generatedResult ? (
                  <div className="w-full h-full relative group">
                    <img
                      src={generatedResult.image}
                      alt={generatedResult.name}
                      className="w-full h-full object-cover rounded-xl"
                    />

                    {/* Overlay Details Tag */}
                    <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-lg text-xs space-y-1 border border-white/50">
                      <p className="font-heading font-bold text-[#18392B] truncate">{generatedResult.name}</p>
                      <p className="text-[11px] text-gray-600">Màu: {generatedResult.color} • {generatedResult.season}</p>
                      <p className="text-[11px] text-[#C85A32] font-semibold">Họa tiết: {generatedResult.patterns.join(", ")}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6 space-y-3 text-gray-400">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <Wand2 className="w-8 h-8" />
                    </div>
                    <h4 className="font-heading font-bold text-gray-700 text-base">Sẵn sàng tạo thiết kế</h4>
                    <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                      AI sẽ kết hợp áo dài trơn, họa tiết tham khảo và mô tả của bạn thành thiết kế mới
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons Section */}
              <div className="space-y-3 pt-2">
                {!generatedResult ? (
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-4 bg-[#18392B] text-white font-bold rounded-2xl shadow-xl shadow-[#18392B]/20 hover:bg-[#18392B]/90 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-5 h-5 text-[#D4A373]" />
                    <span>{isGenerating ? "Đang tạo..." : "Tạo Thiết Kế Với AI (Generate)"}</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={handleTryOnNow}
                      className="w-full py-3.5 bg-[#18392B] text-white font-bold rounded-2xl shadow-lg shadow-[#18392B]/20 hover:bg-[#18392B]/90 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#D4A373]" />
                      <span>Thử Đồ Ngay</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleSaveDesign}
                        className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Bookmark className="w-4 h-4 text-[#C85A32]" />
                        <span>Lưu Thiết Kế</span>
                      </button>

                      <button
                        onClick={() => setGeneratedResult(null)}
                        className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Thiết Kế Mới</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
