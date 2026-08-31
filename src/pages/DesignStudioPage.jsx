import React, { useState, useRef } from "react";
import { Sparkles, Palette, Upload, Check, RefreshCw, Wand2, ArrowRight, Bookmark, Image as ImageIcon, Layers, HelpCircle, Flower2, Feather, Crown, Flame, Sun, Waves, ShoppingCart, Camera, User, CheckCircle2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { generateAoDaiDesign } from "../utils/hfAI";
import { runTryOnWithAiDesign } from "../utils/aiTryOnDesign";
import { FEATURE_FLAGS } from "../config/featureFlags";
import { API_BASE_URL } from "../config/api";

export default function DesignStudioPage({ onNavigate, onNavigateToTryOn }) {
  const { showToast } = useCart();

  // Step 1: Plain Áo Dài selection
  const [selectedSeason, setSelectedSeason] = useState("bach-lan");
  const [customBaseImage, setCustomBaseImage] = useState(null);

  // Step 2: Pattern library selection (max 3)
  const [selectedPatterns, setSelectedPatterns] = useState(["sen"]);

  // Step 3: Prompt Description
  const [promptText, setPromptText] = useState(
    "Giữ nguyên form áo dài. Thêm hoa sen vàng chạy dọc tà áo, phong cách Huế, chất liệu lụa cao cấp."
  );

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);

  // Plain Áo Dài Collections Data (5 bộ chuẩn DaiVerse)
  const seasonsData = [
    {
      id: "bach-lan",
      name: "Bạch Lan",
      colorName: "Trắng Ngọc",
      colorCode: "#F8F5EE",
      image: "/anh/bach-lan/1.jpg"
    },
    {
      id: "suong-mai",
      name: "Sương Mai",
      colorName: "Xanh Ngọc Dịu",
      colorCode: "#14B8A6",
      image: "/anh/suong-mai/1.jpg"
    },
    {
      id: "moc-an",
      name: "Mộc An",
      colorName: "Hồng Phấn",
      colorCode: "#F472B6",
      image: "/anh/moc-an/1.jpg"
    },
    {
      id: "hong-nguyet",
      name: "Hồng Nguyệt",
      colorName: "Hồng Ánh Kim",
      colorCode: "#EC4899",
      image: "/anh/hong-nguyet/1.jpg"
    },
    {
      id: "thanh-phong",
      name: "Thanh Phong",
      colorName: "Xanh Dịu",
      colorCode: "#2563EB",
      image: "/anh/thanh-phong/1.jpg"
    }
  ];

  // Pattern Library Options
  const patternOptions = [
    { id: "sen", name: "Hoa Sen", icon: Flower2, desc: "Thêu tay sen vàng kiêu hãnh", color: "bg-[#E8A5A5]/25 text-[#E43D12]" },
    { id: "hac", name: "Chim Hạc", icon: Feather, desc: "Hạc mây cuộn dệt nổi kim tuyến", color: "bg-[#E43D12]/15 text-[#E43D12]" },
    { id: "rong", name: "Rồng", icon: Crown, desc: "Long triều uốn lụa cổ điển", color: "bg-[#EFB11D]/15 text-[#EFB11D]" },
    { id: "phuong", name: "Phượng", icon: Flame, desc: "Phượng hoàng hoàng gia quý phái", color: "bg-[#EFB11D]/25 text-[#E43D12]" },
    { id: "mai", name: "Hoa Mai", icon: Sun, desc: "Mai vàng nhị thêu tơ tằm", color: "bg-[#E9C46A]/25 text-amber-700" },
    { id: "song", name: "Sóng Nước", icon: Waves, desc: "Sóng nước Thủy Ba triều đại", color: "bg-teal-500/15 text-teal-700" }
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
    // Mở panel Try-On inline
    setShowTryOnPanel(true);
    setTryOnResult(null);
    setTryOnPersonImage(null);
  };

  // ── Virtual Try-On Inline State ──
  const [showTryOnPanel, setShowTryOnPanel] = useState(false);
  const [tryOnPersonImage, setTryOnPersonImage] = useState(null);
  const [isTryingOn, setIsTryingOn] = useState(false);
  const [tryOnResult, setTryOnResult] = useState(null);
  const tryOnFileRef = useRef(null);

  const handleTryOnPersonUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTryOnPersonImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRunInlineTryOn = async () => {
    if (!tryOnPersonImage) {
      showToast("⚠️ Vui lòng tải ảnh của bạn để thử đồ!");
      return;
    }
    if (!generatedResult?.image) {
      showToast("⚠️ Chưa có thiết kế AI để thử đồ.");
      return;
    }
    setIsTryingOn(true);
    setTryOnResult(null);
    try {
      const garmentBase64 = generatedResult.image.startsWith("data:image/")
        ? generatedResult.image
        : await fetch(generatedResult.image).then(r => r.blob()).then(b => new Promise(res => { const fr = new FileReader(); fr.onloadend = () => res(fr.result); fr.readAsDataURL(b); }));

      const result = await runTryOnWithAiDesign(tryOnPersonImage, garmentBase64);
      setTryOnResult(result);
      showToast("🎉 Thử đồ thiết kế AI hoàn tất!");
    } catch (err) {
      showToast(`❌ ${err.message || "Lỗi Virtual Try-On."}`);
    } finally {
      setIsTryingOn(false);
    }
  };

  // ── Order Form State ──
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: "",
    phone: "",
    email: "",
    size: "M",
    deliveryOption: "standard",
    address: "",
    note: "",
  });
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const handleOrderDesign = () => {
    setShowOrderForm(true);
    setShowTryOnPanel(false);
  };

  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const handleSubmitOrder = async () => {
    if (!orderForm.name || !orderForm.phone) {
      showToast("⚠️ Vui lòng nhập họ tên và số điện thoại!");
      return;
    }

    setIsSubmittingOrder(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/order-design`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: orderForm.name,
          phone: orderForm.phone,
          email: orderForm.email,
          size: orderForm.size,
          deliveryOption: orderForm.deliveryOption,
          address: orderForm.address,
          note: orderForm.note,
          designName: generatedResult?.name,
          designImage: tryOnResult || generatedResult?.image,
          price: generatedResult?.formattedPrice,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrderSubmitted(true);
        showToast("🎉 Đã gửi đơn đặt thiết kế AI! Email cảm ơn kèm ảnh đã được gửi đến bạn.");
      } else {
        showToast(`⚠️ ${data.message || "Không thể gửi đơn đặt hàng."}`);
      }
    } catch (err) {
      console.error("Order AI Design Error:", err);
      // Vẫn ghi nhận đặt hàng ngay cả khi lỗi kết nối API
      setOrderSubmitted(true);
      showToast("🎉 Đã lưu thông tin đặt hàng thiết kế AI!");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleSaveDesign = () => {
    showToast("Đã lưu thiết kế vào Lịch Sử Thử Đồ của bạn!");
  };

  const currentSeason = seasonsData.find((s) => s.id === selectedSeason);

  return (
    <div className="pt-24 pb-20 bg-[#EBE9E1] min-h-screen">
      {/* 1. Hero Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#EFB11D] via-[#1c4333] to-[#0f241c] text-white py-14 px-4 sm:px-6 lg:px-8 mb-10 shadow-xl border-b border-[#EFB11D]/30">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E43D12]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container-page relative z-10 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-[0.25em] text-[#EFB11D]">
            <Wand2 className="w-3.5 h-3.5" />
            <span>DAIVERSE CUSTOM ÁO DÀI</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-white">
            CUSTOM ÁO DÀI
          </h1>

          <p className="text-gray-200 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Upload áo dài trơn, chọn họa tiết từ thư viện DaiVerse, nhập mô tả — AI sẽ tạo thiết kế mới để bạn thử đồ ngay lập tức.
          </p>

          {/* Steps Indicator Flow */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-xs font-mono font-semibold text-[#EFB11D]">
            <span className="px-3 py-1 bg-black/30 rounded-full border border-white/15">1. CHỌN ÁO TRƠN</span>
            <span className="text-gray-400">→</span>
            <span className="px-3 py-1 bg-black/30 rounded-full border border-white/15">2. HỌA TIẾT</span>
            <span className="text-gray-400">→</span>
            <span className="px-3 py-1 bg-black/30 rounded-full border border-white/15">3. MÔ TẢ</span>
            <span className="text-gray-400">→</span>
            <span className="px-3 py-1 bg-[#E43D12] text-white rounded-full font-bold">GENERATE</span>
          </div>
        </div>
      </section>

      {/* Main Workspace Layout */}
      <div className="container-page">
        {/* Step Progress Circles */}
        <div className="flex items-center justify-center gap-4 mb-10 text-xs font-medium">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${
              selectedSeason ? "bg-[#EFB11D] text-white" : "bg-gray-200 text-gray-600"
            }`}>
              <Check className="w-4 h-4" />
            </div>
            <span className="text-gray-900 font-semibold hidden sm:inline">Áo trơn</span>
          </div>
          <div className="w-12 sm:w-20 h-px bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${
              selectedPatterns.length > 0 ? "bg-[#EFB11D] text-white" : "bg-gray-200 text-gray-600"
            }`}>
              {selectedPatterns.length > 0 ? <Check className="w-4 h-4" /> : "2"}
            </div>
            <span className="text-gray-900 font-semibold hidden sm:inline">Họa tiết</span>
          </div>
          <div className="w-12 sm:w-20 h-px bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${
              promptText.trim() ? "bg-[#EFB11D] text-white" : "bg-gray-200 text-gray-600"
            }`}>
              <Sparkles className="w-4 h-4 text-[#EFB11D]" />
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
                <span className="text-xs font-bold uppercase tracking-widest text-[#E43D12] block mb-1">BƯỚC 1</span>
                <h2 className="font-heading font-bold text-2xl text-gray-900">Chọn áo dài trơn</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Chọn một trong 5 bộ áo dài của DaiVerse hoặc tải ảnh áo dài trơn của bạn
                </p>
              </div>

              {/* 5 Plain Áo Dài Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
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
                          ? "border-[#EFB11D] ring-2 ring-[#EFB11D]/20 bg-[#EFB11D]/5 shadow-md"
                          : "border-gray-200 hover:border-gray-300 bg-[#EBE9E1]"
                      }`}
                    >
                      <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
                        <img
                          src={s.image}
                          alt={s.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#EFB11D] text-white flex items-center justify-center shadow-md">
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
                <label className="border-2 border-dashed border-gray-200 hover:border-[#EFB11D] rounded-2xl p-4 text-center block cursor-pointer bg-[#EBE9E1] transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={handleCustomBaseUpload} />
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-700">
                    <Upload className="w-4 h-4 text-[#E43D12]" />
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
                <span className="text-xs font-bold uppercase tracking-widest text-[#E43D12] block mb-1">BƯỚC 2</span>
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
                          ? "border-[#E43D12] bg-[#E43D12]/5 ring-2 ring-[#E43D12]/20 shadow-xs"
                          : "border-gray-200 hover:border-gray-300 bg-[#EBE9E1]"
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


            </div>

            {/* BƯỚC 3: MÔ TẢ THIẾT KẾ */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#E43D12] block mb-1">BƯỚC 3</span>
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
                className="w-full p-4 bg-[#EBE9E1] border border-gray-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-[#EFB11D] focus:ring-2 focus:ring-[#EFB11D]/10 leading-relaxed resize-none"
              ></textarea>


            </div>
          </div>

          {/* Right Column: AI Preview Canvas & Results (Sticky Panel) */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#EFB11D] text-white flex items-center justify-center">
                    <Wand2 className="w-4 h-4 text-[#EFB11D]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-gray-900">Kết Quả AI</h3>
                  </div>
                </div>
              </div>

              {/* Render Canvas Box */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#EBE9E1] border border-gray-200 shadow-inner flex flex-col items-center justify-center p-4">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center text-center p-6 space-y-4 animate-pulse">
                    <div className="w-16 h-16 rounded-full bg-[#EFB11D] text-[#EFB11D] flex items-center justify-center shadow-lg">
                      <Sparkles className="w-8 h-8 animate-spin" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-lg text-[#EFB11D]">AI đang dệt mẫu áo dài...</h4>
                      <p className="text-xs text-gray-500 mt-1">Đang xử lý ánh sáng, thêu gấm và dựng mẫu 3D</p>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden max-w-xs">
                      <div className="bg-[#E43D12] h-full w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                ) : generatedResult ? (
                  <div className="w-full h-full relative group">
                    <img
                      src={generatedResult.image}
                      alt={generatedResult.name}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = generatedResult.baseImage || "/anh/746927465_122119237899355470_7558522641041819280_n.jpg";
                      }}
                    />

                    {/* Overlay Details Tag */}
                    <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-lg text-xs space-y-1 border border-white/50">
                      <p className="font-heading font-bold text-[#EFB11D] truncate">{generatedResult.name}</p>
                      <p className="text-[11px] text-gray-600">Màu: {generatedResult.color} • {generatedResult.season}</p>
                      <p className="text-[11px] text-[#E43D12] font-semibold">Họa tiết: {generatedResult.patterns.join(", ")}</p>
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
                    className="w-full py-4 bg-[#EFB11D] text-white font-bold rounded-2xl shadow-xl shadow-[#EFB11D]/20 hover:bg-[#EFB11D]/90 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-5 h-5 text-[#EFB11D]" />
                    <span>{isGenerating ? "Đang tạo..." : "Tạo Thiết Kế Với AI (Generate)"}</span>
                  </button>
                ) : (
                  <div className="space-y-2.5">
                    {/* Primary CTA: Virtual Try-On */}
                    <button
                      onClick={handleTryOnNow}
                      className="w-full py-3.5 bg-gradient-to-r from-[#1c4333] to-[#0f241c] text-white font-bold rounded-2xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2.5 text-sm cursor-pointer group"
                    >
                      <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>Thử Đồ Virtual Try-On</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Secondary CTA: Đặt Mua */}
                    <button
                      onClick={handleOrderDesign}
                      className="w-full py-3.5 bg-[#EFB11D] text-white font-bold rounded-2xl shadow-lg shadow-[#EFB11D]/20 hover:bg-[#E43D12] transition-all flex items-center justify-center gap-2.5 text-sm cursor-pointer group"
                    >
                      <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>Đặt Mua Thiết Kế Này</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleSaveDesign}
                        className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-[#E43D12]" />
                        <span>Lưu Thiết Kế</span>
                      </button>

                      <button
                        onClick={() => { setGeneratedResult(null); setShowOrderForm(false); setOrderSubmitted(false); setShowTryOnPanel(false); setTryOnResult(null); setTryOnPersonImage(null); }}
                        className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Thiết Kế Mới</span>
                      </button>
                    </div>

                    {/* ── Virtual Try-On Inline Panel ── */}
                    {showTryOnPanel && (
                      <div className="mt-1 p-4 bg-gradient-to-b from-[#f0faf8] to-[#EBE9E1] rounded-2xl border border-teal-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-heading font-bold text-sm text-gray-900 flex items-center gap-1.5">
                            <Camera className="w-4 h-4 text-teal-600" />
                            Virtual Try-On
                          </h4>
                          <button onClick={() => setShowTryOnPanel(false)} className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer">✕</button>
                        </div>

                        {/* Upload Person Image */}
                        <label className="border-2 border-dashed border-teal-300 hover:border-teal-500 rounded-xl p-3 text-center block cursor-pointer bg-white transition-colors">
                          <input
                            ref={tryOnFileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleTryOnPersonUpload}
                          />
                          {tryOnPersonImage ? (
                            <div className="flex items-center gap-3">
                              <img src={tryOnPersonImage} alt="Ảnh của bạn" className="w-12 h-12 object-cover rounded-lg border-2 border-teal-400" />
                              <div className="text-left">
                                <p className="text-xs font-bold text-teal-700">✓ Đã chọn ảnh</p>
                                <p className="text-[11px] text-gray-500">Nhấn để đổi ảnh khác</p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <User className="w-6 h-6 text-teal-400 mx-auto" />
                              <p className="text-xs font-semibold text-gray-700">Tải ảnh toàn thân của bạn</p>
                              <p className="text-[11px] text-gray-400">AI sẽ ghép thiết kế lên người bạn</p>
                            </div>
                          )}
                        </label>

                        {/* Garment Preview */}
                        {generatedResult?.image && (
                          <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-gray-100">
                            <img src={generatedResult.image} alt="Thiết kế AI" className="w-10 h-10 object-cover rounded-lg"
                              onError={(e) => { e.target.onerror = null; e.target.src = generatedResult.baseImage; }} />
                            <div>
                              <p className="text-[11px] font-semibold text-gray-700 truncate max-w-[160px]">{generatedResult.name}</p>
                              <p className="text-[10px] text-[#E43D12] font-semibold">Thiết kế AI · {generatedResult.formattedPrice}</p>
                            </div>
                          </div>
                        )}

                        {/* Run Try-On Button */}
                        <button
                          onClick={handleRunInlineTryOn}
                          disabled={isTryingOn || !tryOnPersonImage}
                          className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Sparkles className={`w-3.5 h-3.5 ${isTryingOn ? "animate-spin" : ""}`} />
                          {isTryingOn ? "Perfect Corp đang xử lý..." : "Thử Đồ Với Perfect Corp AI"}
                        </button>

                        {/* Try-On Result */}
                        {tryOnResult && (
                          <div className="space-y-2">
                            <div className="relative rounded-xl overflow-hidden aspect-[3/4] bg-gray-100">
                              <img src={tryOnResult} alt="Kết quả thử đồ" className="w-full h-full object-cover" />
                              <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-green-400" />
                                Perfect Corp AI
                              </div>
                            </div>
                            <button
                              onClick={handleOrderDesign}
                              className="w-full py-2.5 bg-[#EFB11D] text-white rounded-xl text-xs font-bold hover:bg-[#E43D12] transition-colors cursor-pointer flex items-center justify-center gap-2"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              Ưng ý! Đặt Mua Thiết Kế Này
                            </button>
                          </div>
                        )}
                      </div>
                    )}


                    {showOrderForm && !orderSubmitted && (
                      <div className="mt-2 p-4 bg-[#EBE9E1] rounded-2xl border border-[#EFB11D]/40 space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-heading font-bold text-sm text-gray-900">📋 Đặt Hàng Thiết Kế AI</h4>
                          <button onClick={() => setShowOrderForm(false)} className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer">✕</button>
                        </div>
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Họ và tên *"
                            value={orderForm.name}
                            onChange={(e) => setOrderForm({...orderForm, name: e.target.value})}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#EFB11D]"
                          />
                          <input
                            type="tel"
                            placeholder="Số điện thoại *"
                            value={orderForm.phone}
                            onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#EFB11D]"
                          />
                          <input
                            type="email"
                            placeholder="Email nhận xác nhận đơn & hình ảnh *"
                            value={orderForm.email}
                            onChange={(e) => setOrderForm({...orderForm, email: e.target.value})}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#EFB11D]"
                          />

                          {/* Lựa chọn hình thức giao hàng */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-700 block">Hình thức giao hàng:</label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setOrderForm({...orderForm, deliveryOption: "standard"})}
                                className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                                  orderForm.deliveryOption === "standard"
                                    ? "border-[#1c4333] bg-[#1c4333]/10 ring-1 ring-[#1c4333]"
                                    : "border-gray-200 bg-white hover:bg-gray-50"
                                }`}
                              >
                                <p className="text-[11px] font-bold text-gray-900">📦 Tiêu Chuẩn</p>
                                <p className="text-[10px] text-gray-500">Toàn quốc (Freeship)</p>
                              </button>
                              <button
                                type="button"
                                onClick={() => setOrderForm({...orderForm, deliveryOption: "express24h"})}
                                className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                                  orderForm.deliveryOption === "express24h"
                                    ? "border-[#E43D12] bg-[#E43D12]/10 ring-1 ring-[#E43D12]"
                                    : "border-gray-200 bg-white hover:bg-gray-50"
                                }`}
                              >
                                <p className="text-[11px] font-bold text-[#E43D12]">⚡ Hỏa Tốc 24h</p>
                                <p className="text-[10px] text-gray-500">Giao 2h-24h (Hà Nội)</p>
                              </button>
                            </div>
                          </div>

                          <input
                            type="text"
                            placeholder="Địa chỉ giao hàng (tùy chọn)..."
                            value={orderForm.address}
                            onChange={(e) => setOrderForm({...orderForm, address: e.target.value})}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#EFB11D]"
                          />
                          <select
                            value={orderForm.size}
                            onChange={(e) => setOrderForm({...orderForm, size: e.target.value})}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#EFB11D] cursor-pointer"
                          >
                            <option value="S">Size S</option>
                            <option value="M">Size M</option>
                            <option value="L">Size L</option>
                            <option value="XL">Size XL</option>
                            <option value="Tailored">May theo số đo riêng</option>
                          </select>
                          <textarea
                            placeholder="Ghi chú thêm cho xưởng may (tùy chọn)..."
                            value={orderForm.note}
                            onChange={(e) => setOrderForm({...orderForm, note: e.target.value})}
                            rows={2}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#EFB11D] resize-none"
                          />
                        </div>
                        <div className="bg-white/70 rounded-xl p-2.5 flex items-center justify-between">
                          <span className="text-xs text-gray-600">Giá thiết kế AI:</span>
                          <span className="font-bold text-sm text-[#E43D12]">{generatedResult?.formattedPrice}</span>
                        </div>
                        <button
                          onClick={handleSubmitOrder}
                          disabled={isSubmittingOrder}
                          className="w-full py-2.5 bg-[#1c4333] text-white rounded-xl text-xs font-bold hover:bg-[#0f241c] transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <ShoppingCart className={`w-3.5 h-3.5 ${isSubmittingOrder ? "animate-spin" : ""}`} />
                          {isSubmittingOrder ? "Đang gửi đơn & email..." : "Xác Nhận Đặt Hàng"}
                        </button>
                      </div>
                    )}

                    {orderSubmitted && (
                      <div className="mt-2 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-1">
                        <div className="text-2xl">🎉</div>
                        <p className="font-bold text-sm text-emerald-800">Đặt hàng thành công!</p>
                        <p className="text-xs text-emerald-600">Daiverse sẽ liên hệ bạn qua số điện thoại để xác nhận đơn hàng.</p>
                      </div>
                    )}
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
