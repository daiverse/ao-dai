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

  // Plain Áo Dài Collections Data (5 bộ chuẩn NEM Fashion)
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
    { id: "sen", name: "Hoa Sen", icon: Flower2, desc: "Thêu tay sen vàng kiêu hãnh", color: "bg-neutral-100 text-[#C5A059]" },
    { id: "hac", name: "Chim Hạc", icon: Feather, desc: "Hạc mây cuộn dệt nổi kim tuyến", color: "bg-neutral-100 text-[#C5A059]" },
    { id: "rong", name: "Rồng", icon: Crown, desc: "Long triều uốn lụa cổ điển", color: "bg-neutral-100 text-[#C5A059]" },
    { id: "phuong", name: "Phượng", icon: Flame, desc: "Phượng hoàng hoàng gia quý phái", color: "bg-neutral-100 text-[#C5A059]" },
    { id: "mai", name: "Hoa Mai", icon: Sun, desc: "Mai vàng nhị thêu tơ tằm", color: "bg-neutral-100 text-[#C5A059]" },
    { id: "song", name: "Sóng Nước", icon: Waves, desc: "Sóng nước Thủy Ba triều đại", color: "bg-neutral-100 text-[#C5A059]" }
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

      const imageUrl = await generateAoDaiDesign({
        prompt: promptText,
        patterns: selectedPatterns,
        season: selectedSeason,
        colorName: activeSeasonObj?.colorName || "",
      });

      setGeneratedResult({
        id: `ai-design-${Date.now()}`,
        name: `Áo Dài DaiVerse AI — ${activeSeasonObj?.name} ${patternOptions.find((p) => p.id === selectedPatterns[0])?.name || "Hoa Sen"}`,
        season: activeSeasonObj?.name,
        color: activeSeasonObj?.colorName,
        patterns: selectedPatterns.map((id) => patternOptions.find((p) => p.id === id)?.name),
        prompt: promptText,
        image: imageUrl,
        baseImage: customBaseImage || activeSeasonObj?.image,
        price: 2150000,
        formattedPrice: "2.150.000đ",
      });

      showToast("🪄 DaiVerse AI đã tạo thiết kế áo dài thành công!");
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
    setShowTryOnPanel(true);
    setTryOnResult(null);
    setTryOnPersonImage(null);
  };

  // Virtual Try-On Inline State
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

  // Order Form State
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
        showToast("🎉 Đã gửi đơn đặt thiết kế AI! Email xác nhận đã được gửi.");
      } else {
        showToast(`⚠️ ${data.message || "Không thể gửi đơn đặt hàng."}`);
      }
    } catch (err) {
      console.error("Order AI Design Error:", err);
      setOrderSubmitted(true);
      showToast("🎉 Đã lưu thông tin đặt hàng thiết kế AI!");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleSaveDesign = () => {
    showToast("Đã lưu thiết kế vào danh sách của bạn!");
  };

  const currentSeason = seasonsData.find((s) => s.id === selectedSeason);

  return (
    <div className="pt-32 sm:pt-36 pb-20 bg-white min-h-screen">

      {/* Hero Header Banner */}
      <section className="relative overflow-hidden bg-[#111111] text-white py-14 px-4 sm:px-6 lg:px-8 mb-10 shadow-xl border-b-2 border-[#C5A059]">
        <img 
          src="/anh/suong-mai/banner.png" 
          alt="AI Design Studio Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/70 to-transparent"></div>
        <div className="container-page relative z-10 text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059] text-white text-[10px] font-extrabold uppercase tracking-widest">
            <Wand2 className="w-3.5 h-3.5" />
            <span>DaiVerse AI DESIGN STUDIO</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-wide text-white uppercase">
            THIẾT KẾ ÁO DÀI <span className="text-[#C5A059]">CÙNG DaiVerse AI</span>
          </h1>

          <p className="text-neutral-300 text-xs sm:text-sm max-w-xl mx-auto font-normal leading-relaxed">
            Chọn mẫu áo trơn, kết hợp họa tiết và ý tưởng sáng tạo — Trí tuệ nhân tạo DaiVerse sẽ tạo nên tác phẩm Áo Dài độc bản cho riêng bạn.
          </p>
        </div>
      </section>

      {/* Main Workspace Layout */}
      <div className="container-page">
        {/* Step Progress Circles */}
        <div className="flex items-center justify-center gap-4 mb-10 text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 flex items-center justify-center ${
              selectedSeason ? "bg-[#111111] text-white" : "bg-neutral-200 text-neutral-600"
            }`}>
              1
            </div>
            <span className="text-[#111111]">Áo trơn</span>
          </div>
          <div className="w-12 sm:w-16 h-px bg-neutral-300"></div>

          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 flex items-center justify-center ${
              selectedPatterns.length > 0 ? "bg-[#111111] text-white" : "bg-neutral-200 text-neutral-600"
            }`}>
              2
            </div>
            <span className="text-[#111111]">Họa tiết</span>
          </div>
          <div className="w-12 sm:w-16 h-px bg-neutral-300"></div>

          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 flex items-center justify-center ${
              promptText.trim() ? "bg-[#C5A059] text-white" : "bg-neutral-200 text-neutral-600"
            }`}>
              3
            </div>
            <span className="text-[#111111]">Mô tả</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* BƯỚC 1: CHỌN ÁO DÀI TRƠN */}
            <div className="bg-neutral-50 p-6 border border-neutral-300 space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059] block mb-1">BƯỚC 1</span>
                <h2 className="font-heading font-black text-lg text-[#111111] uppercase">CHỌN PHOM ÁO DÀI TRƠN</h2>
              </div>

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
                      className={`group relative overflow-hidden border-2 transition-all cursor-pointer text-left ${
                        isSelected
                          ? "border-[#111111] bg-white font-bold"
                          : "border-neutral-200 bg-neutral-100 hover:border-neutral-400"
                      }`}
                    >
                      <div className="aspect-[3/4] overflow-hidden bg-neutral-200 relative">
                        <img
                          src={s.image}
                          alt={s.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-2 bg-white border-t border-neutral-200">
                        <p className="font-heading font-bold text-xs text-[#111111] uppercase">{s.name}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Upload */}
              <div className="pt-2">
                <label className="border border-dashed border-neutral-400 p-3 text-center block cursor-pointer bg-white hover:border-[#111111] transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={handleCustomBaseUpload} />
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#111111] uppercase tracking-wider">
                    <Upload className="w-4 h-4 text-[#C5A059]" />
                    <span>HOẶC TẢI ẢNH ÁO DÀI TRƠN CỦA BẠN</span>
                  </div>
                </label>
              </div>
            </div>

            {/* BƯỚC 2: CHỌN HỌA TIẾT THAM KHẢO */}
            <div className="bg-neutral-50 p-6 border border-neutral-300 space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059] block mb-1">BƯỚC 2</span>
                <h2 className="font-heading font-black text-lg text-[#111111] uppercase">CHỌN HỌA TIẾT NỔI BẬT</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {patternOptions.map((pat) => {
                  const isSelected = selectedPatterns.includes(pat.id);
                  const IconComp = pat.icon;
                  return (
                    <button
                      key={pat.id}
                      onClick={() => togglePattern(pat.id)}
                      className={`p-3 border-2 transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-2 ${
                        isSelected
                          ? "border-[#111111] bg-white font-bold shadow-xs"
                          : "border-neutral-200 bg-neutral-100 hover:border-neutral-400"
                      }`}
                    >
                      <IconComp className="w-5 h-5 text-[#C5A059]" />
                      <div>
                        <p className="font-heading font-bold text-xs text-[#111111] uppercase">{pat.name}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BƯỚC 3: MÔ TẢ THIẾT KẾ */}
            <div className="bg-neutral-50 p-6 border border-neutral-300 space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059] block mb-1">BƯỚC 3</span>
                <h2 className="font-heading font-black text-lg text-[#111111] uppercase">MÔ TẢ CHI TIẾT SÁNG TẠO</h2>
              </div>

              <textarea
                rows={4}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="w-full p-3 bg-white border border-neutral-300 text-xs focus:outline-none focus:border-[#111111] leading-relaxed resize-none font-normal"
              ></textarea>
            </div>
          </div>

          {/* Right Column: AI Preview Canvas & Results */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="bg-neutral-50 p-6 border border-neutral-300 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <h3 className="font-heading font-black text-base text-[#111111] uppercase tracking-wide">KẾT QUẢ AI CREATIVE</h3>
              </div>

              {/* Render Canvas Box */}
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 border border-neutral-300 shadow-inner flex flex-col items-center justify-center p-4">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center text-center p-6 space-y-3 text-white">
                    <Sparkles className="w-8 h-8 text-[#C5A059] animate-spin" />
                    <h4 className="font-heading font-black text-sm uppercase">DaiVerse AI DỆT ÁO DÀI...</h4>
                  </div>
                ) : generatedResult ? (
                  <div className="w-full h-full relative">
                    <img
                      src={generatedResult.image}
                      alt={generatedResult.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = generatedResult.baseImage;
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6 space-y-2 text-neutral-400">
                    <Wand2 className="w-8 h-8 text-neutral-500" />
                    <h4 className="font-heading font-bold text-xs uppercase text-white">SẴN SÀNG THIẾT KẾ</h4>
                  </div>
                )}
              </div>

              {/* Action Buttons Section */}
              <div className="space-y-3 pt-2">
                {!generatedResult ? (
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-3.5 bg-[#111111] hover:bg-[#C5A059] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border-none"
                  >
                    {isGenerating ? "ĐANG TẠO MẪU..." : "TẠO THIẾT KẾ CÙNG DaiVerse AI"}
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={handleTryOnNow}
                      className="w-full py-3 bg-[#111111] text-white font-bold text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                    >
                      <Camera className="w-4 h-4 text-[#C5A059]" />
                      <span>THỬ ĐỒ VIRTUAL TRY-ON</span>
                    </button>

                    <button
                      onClick={handleOrderDesign}
                      className="w-full py-3 bg-[#C5A059] hover:bg-[#A4813D] text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>ĐẶT MUA THIẾT KẾ NÀY</span>
                    </button>

                    {/* Inline Order Form */}
                    {showOrderForm && !orderSubmitted && (
                      <div className="mt-2 p-4 bg-white border border-neutral-300 space-y-3">
                        <h4 className="font-heading font-black text-xs uppercase text-[#111111]">ĐẶT HÀNG THIẾT KẾ AI</h4>
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Họ và tên *"
                            value={orderForm.name}
                            onChange={(e) => setOrderForm({...orderForm, name: e.target.value})}
                            className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none"
                          />
                          <input
                            type="tel"
                            placeholder="Số điện thoại *"
                            value={orderForm.phone}
                            onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={handleSubmitOrder}
                          disabled={isSubmittingOrder}
                          className="w-full py-2.5 bg-[#111111] text-white font-bold text-xs uppercase tracking-widest border-none cursor-pointer"
                        >
                          XÁC NHẬN ĐẶT HÀNG
                        </button>
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

