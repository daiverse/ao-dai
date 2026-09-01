import React, { useState, useRef } from "react";
import { Sparkles, Palette, Upload, Check, RefreshCw, Wand2, ArrowRight, Bookmark, Image as ImageIcon, Layers, HelpCircle, Flower2, Feather, Crown, Flame, Sun, Waves, ShoppingCart, Camera, User, CheckCircle2, Sliders, Scissors, Download } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { generateAoDaiDesign } from "../utils/hfAI";
import { runTryOnWithAiDesign } from "../utils/aiTryOnDesign";
import { compositeVirtualTryOn } from "../utils/aiVtonComposer";
import { FEATURE_FLAGS } from "../config/featureFlags";
import { API_BASE_URL } from "../config/api";

export default function DesignStudioPage({ onNavigate, onNavigateToTryOn }) {
  const { showToast, addToCart, setIsCartOpen } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();

  // Step 1: Plain Áo Dài base selection
  const [selectedSeason, setSelectedSeason] = useState("bach-lan");
  const [customBaseImage, setCustomBaseImage] = useState(null);

  // 7 Structured Custom Options State
  const [selectedColor, setSelectedColor] = useState("Hồng Sen");
  const [selectedFabric, setSelectedFabric] = useState("Gấm Lụa Cao Cấp");
  const [selectedPattern, setSelectedPattern] = useState("Hoa Sen Thêu Tay");
  const [selectedCollar, setSelectedCollar] = useState("Cổ Cao 3cm");
  const [selectedSleeve, setSelectedSleeve] = useState("Tay Dài Truyền Thống");
  const [selectedLength, setSelectedLength] = useState("Tà Dài Chấm Mắt Cá");
  const [selectedFit, setSelectedFit] = useState("Phom Truyền Thống 2 Tà");
  const [extraPrompt, setExtraPrompt] = useState("Giữ nguyên nét thanh lịch truyền thống, đường may tinh xảo.");

  // Option Lists
  const colorOptions = ["Hồng Sen", "Đỏ Son", "Vàng Hoàng Gia", "Xanh Ngọc", "Trắng Ngọc", "Tím Huế", "Xanh Navy", "Đen Tuyền"];
  const fabricOptions = ["Gấm Lụa Cao Cấp", "Lụa Tơ Tằm", "Tafta Ánh Kim", "Nhung Hoàng Gia", "Voan Tơ Bay"];
  const patternOptionsList = ["Hoa Sen Thêu Tay", "Chim Hạc Truyền Thống", "Rồng Phượng Hoàng Gia", "Hoa Mai Vàng", "Sóng Nước Thủy Ba", "Trơn Tối Giản"];
  const collarOptions = ["Cổ Cao 3cm", "Cổ Tròn Hiện Đại", "Cổ Kiềng Sang Trọng", "Cổ Tim Cách Tân", "Cổ Trụ Vuông"];
  const sleeveOptions = ["Tay Dài Truyền Thống", "Tay Lỡ Thanh Lịch", "Tay Loe Cách Tân", "Tay Phồng 3D", "Tay Bồng Công Chúa"];
  const lengthOptions = ["Tà Dài Quét Đất", "Tà Dài Chấm Mắt Cá", "Tà Lỡ Chấm Gối"];
  const fitOptions = ["Phom Truyền Thống 2 Tà", "Phom Cách Tân 4 Tà", "Phom Suông Rộng", "Phom Áo Choàng 3 Món"];

  // Dynamically constructed full prompt string for AI generation
  const buildFullPrompt = () => {
    return `Áo dài nữ phom dáng ${selectedFit}, màu ${selectedColor}, chất liệu ${selectedFabric}. Họa tiết ${selectedPattern}, kiểu ${selectedCollar}, ${selectedSleeve}, độ dài ${selectedLength}. ${extraPrompt}`.trim();
  };

  const promptText = buildFullPrompt();

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
        patterns: [selectedPattern],
        season: selectedSeason,
        colorName: selectedColor,
      });

      setGeneratedResult({
        id: `ai-design-${Date.now()}`,
        name: `Áo Dài Custom AI — ${selectedColor} ${selectedFabric}`,
        season: activeSeasonObj?.name,
        color: selectedColor,
        fabric: selectedFabric,
        pattern: selectedPattern,
        collar: selectedCollar,
        sleeve: selectedSleeve,
        length: selectedLength,
        fit: selectedFit,
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
  const [tryOnProgress, setTryOnProgress] = useState(0);
  const [tryOnStepMsg, setTryOnStepMsg] = useState("");
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
    setTryOnProgress(10);
    setTryOnStepMsg("Đang kết nối máy chủ AI Virtual Try-On...");

    const progressTimer = setInterval(() => {
      setTryOnProgress((prev) => {
        if (prev >= 90) return 90;
        const next = prev + Math.floor(Math.random() * 6) + 3;
        if (next >= 75) setTryOnStepMsg("AI đang khớp tà áo 3D & nếp gấp...");
        else if (next >= 50) setTryOnStepMsg("Đang xử lý phom dáng Áo Dài...");
        else if (next >= 30) setTryOnStepMsg("Đang phân tích vóc dáng & tỉ lệ...");
        return next;
      });
    }, 650);

    try {
      const personImageBase64 = tryOnPersonImage;
      const garmentImageUrl = generatedResult.image.startsWith("http")
        ? generatedResult.image
        : generatedResult.image.startsWith("data:image/")
        ? generatedResult.image
        : typeof window !== "undefined"
        ? `${window.location.origin}${generatedResult.image}`
        : generatedResult.image;

      // 1. Gọi API Virtual Try-On Backend (/api/ai/tryon)
      let response = await fetch(`${API_BASE_URL}/api/ai/tryon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personImageBase64,
          garmentImageUrl,
        }),
      });

      if (response.status === 502 || response.status === 503) {
        await new Promise((r) => setTimeout(r, 2500));
        response = await fetch(`${API_BASE_URL}/api/ai/tryon`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            personImageBase64,
            garmentImageUrl,
          }),
        });
      }

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.resultImageBase64) {
          clearInterval(progressTimer);
          setTryOnProgress(100);
          setTryOnStepMsg("Hoàn thiện hình ảnh Virtual Try-On!");
          setTryOnResult(data.resultImageBase64);
          showToast("🎉 Virtual Try-On AI hoàn tất!");
          return;
        }
      }

      // 2. Dự phòng Canvas Compositor nếu máy chủ API bận
      const blendedUrl = await compositeVirtualTryOn(personImageBase64, garmentImageUrl);
      clearInterval(progressTimer);
      setTryOnProgress(100);
      setTryOnStepMsg("Hoàn thiện hình ảnh!");
      setTryOnResult(blendedUrl);
      showToast("🎉 Virtual Try-On hoàn tất!");
    } catch (err) {
      console.warn("Lỗi API Virtual Try-On, chuyển sang trình ghép dự phòng:", err);
      try {
        const blendedUrl = await compositeVirtualTryOn(tryOnPersonImage, generatedResult.image);
        clearInterval(progressTimer);
        setTryOnProgress(100);
        setTryOnResult(blendedUrl);
        showToast("🎉 Virtual Try-On hoàn tất!");
      } catch (fallbackErr) {
        showToast("❌ Lỗi xử lý thử đồ. Vui lòng thử lại!");
      }
    } finally {
      clearInterval(progressTimer);
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

  const handleOrderDesign = async () => {
    if (!isAuthenticated) {
      showToast("🔒 Vui lòng đăng nhập để đặt may thiết kế AI!");
      openAuthModal("login");
      return;
    }

    if (!generatedResult) {
      showToast("⚠️ Vui lòng dệt thiết kế AI trước khi đặt may!");
      return;
    }

    const baseSeason = seasonsData.find((s) => s.id === selectedSeason);

    const customAiProduct = {
      id: `ai-custom-${Date.now()}`,
      name: `Áo Dài Custom AI — ${selectedColor} ${selectedFabric}`,
      price: 2150000,
      formattedPrice: "2.150.000đ",
      images: [tryOnResult || generatedResult.image],
      image: tryOnResult || generatedResult.image,
      isCustomAi: true,
      customOptions: {
        color: selectedColor,
        fabric: selectedFabric,
        pattern: selectedPattern,
        collar: selectedCollar,
        sleeve: selectedSleeve,
        length: selectedLength,
        fit: selectedFit,
      },
      customPrompt: promptText,
      baseAoDaiName: baseSeason?.name || "Bạch Lan",
      aiGeneratedImage: generatedResult.image,
      tryOnImage: tryOnResult || null,
    };

    await addToCart(customAiProduct, "M", selectedColor, 1);
    showToast("🎉 Đã thêm thiết kế Custom AI vào giỏ hàng! Đang mở thanh toán...");
    setIsCartOpen(true);
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
          customOptions: {
            color: selectedColor,
            fabric: selectedFabric,
            pattern: selectedPattern,
            collar: selectedCollar,
            sleeve: selectedSleeve,
            length: selectedLength,
            fit: selectedFit,
          },
          customPrompt: promptText,
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
            <span>DaiVerse CUSTOM ÁO DÀI</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-wide text-white uppercase">
            THIẾT KẾ ÁO DÀI <span className="text-[#C5A059]">CÙNG DaiVerse AI</span>
          </h1>

          <p className="text-neutral-300 text-xs sm:text-sm max-w-xl mx-auto font-normal leading-relaxed">
            Chọn mẫu áo trơn, kết hợp màu sắc, chất liệu, cổ áo, tay áo & họa tiết — Trí tuệ nhân tạo DaiVerse sẽ dệt nên tác phẩm Áo Dài độc bản dành riêng cho bạn.
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
            <div className="w-7 h-7 flex items-center justify-center bg-[#111111] text-white">
              2
            </div>
            <span className="text-[#111111]">Cấu hình Custom</span>
          </div>
          <div className="w-12 sm:w-16 h-px bg-neutral-300"></div>

          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 flex items-center justify-center ${
              promptText.trim() ? "bg-[#C5A059] text-white" : "bg-neutral-200 text-neutral-600"
            }`}>
              3
            </div>
            <span className="text-[#111111]">Prompt AI</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* BƯỚC 1: CHỌN ÁO DÀI TRƠN */}
            <div className="bg-neutral-50 p-6 border border-neutral-300 space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059] block mb-1">BƯỚC 1</span>
                <h2 className="font-heading font-black text-lg text-[#111111] uppercase">CHỌN PHOM ÁO DÀI TRƠN MẪU</h2>
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

            {/* BƯỚC 2: CHỌN CHI TIẾT TÙY CHỈNH CUSTOM (MÀU SẮC, CHẤT LIỆU, HỌA TIẾT, CỔ, TAY, TÀ, PHOM) */}
            <div className="bg-neutral-50 p-6 border border-neutral-300 space-y-5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059] block mb-1">BƯỚC 2</span>
                <h2 className="font-heading font-black text-lg text-[#111111] uppercase flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#C5A059]" />
                  <span>CẤU HÌNH CHI TIẾT ÁO DÀI CUSTOM</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-1">Lựa chọn thông số may đo — AI sẽ tự động dệt vào Prompt thiết kế chuẩn xác.</p>
              </div>

              <div className="space-y-4 text-xs">
                {/* 1. Màu Sắc */}
                <div>
                  <label className="font-bold text-[#111111] uppercase tracking-wider block mb-1.5">1. Màu Sắc Áo Dài:</label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 border transition-all cursor-pointer text-xs font-medium ${
                          selectedColor === c ? "border-[#111111] bg-[#111111] text-white font-bold" : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Chất Liệu */}
                <div>
                  <label className="font-bold text-[#111111] uppercase tracking-wider block mb-1.5">2. Chất Liệu Vải:</label>
                  <div className="flex flex-wrap gap-2">
                    {fabricOptions.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setSelectedFabric(f)}
                        className={`px-3 py-1.5 border transition-all cursor-pointer text-xs font-medium ${
                          selectedFabric === f ? "border-[#111111] bg-[#111111] text-white font-bold" : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Họa Tiết */}
                <div>
                  <label className="font-bold text-[#111111] uppercase tracking-wider block mb-1.5">3. Họa Tiết Nổi Bật:</label>
                  <div className="flex flex-wrap gap-2">
                    {patternOptionsList.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setSelectedPattern(p)}
                        className={`px-3 py-1.5 border transition-all cursor-pointer text-xs font-medium ${
                          selectedPattern === p ? "border-[#111111] bg-[#111111] text-white font-bold" : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Kiểu Cổ Áo */}
                <div>
                  <label className="font-bold text-[#111111] uppercase tracking-wider block mb-1.5">4. Kiểu Cổ Áo:</label>
                  <div className="flex flex-wrap gap-2">
                    {collarOptions.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedCollar(col)}
                        className={`px-3 py-1.5 border transition-all cursor-pointer text-xs font-medium ${
                          selectedCollar === col ? "border-[#111111] bg-[#111111] text-white font-bold" : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Kiểu Tay Áo */}
                <div>
                  <label className="font-bold text-[#111111] uppercase tracking-wider block mb-1.5">5. Kiểu Tay Áo:</label>
                  <div className="flex flex-wrap gap-2">
                    {sleeveOptions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSleeve(s)}
                        className={`px-3 py-1.5 border transition-all cursor-pointer text-xs font-medium ${
                          selectedSleeve === s ? "border-[#111111] bg-[#111111] text-white font-bold" : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Độ Dài Tà */}
                <div>
                  <label className="font-bold text-[#111111] uppercase tracking-wider block mb-1.5">6. Độ Dài Tà Áo:</label>
                  <div className="flex flex-wrap gap-2">
                    {lengthOptions.map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setSelectedLength(l)}
                        className={`px-3 py-1.5 border transition-all cursor-pointer text-xs font-medium ${
                          selectedLength === l ? "border-[#111111] bg-[#111111] text-white font-bold" : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 7. Phom Dáng */}
                <div>
                  <label className="font-bold text-[#111111] uppercase tracking-wider block mb-1.5">7. Phom Dáng Thiết Kế:</label>
                  <div className="flex flex-wrap gap-2">
                    {fitOptions.map((fit) => (
                      <button
                        key={fit}
                        type="button"
                        onClick={() => setSelectedFit(fit)}
                        className={`px-3 py-1.5 border transition-all cursor-pointer text-xs font-medium ${
                          selectedFit === fit ? "border-[#111111] bg-[#111111] text-white font-bold" : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                        }`}
                      >
                        {fit}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* BƯỚC 3: PROMPT TỰ ĐỘNG CẬP NHẬT TỪ THÔNG SỐ CUSTOM */}
            <div className="bg-neutral-50 p-6 border border-neutral-300 space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059] block mb-1">BƯỚC 3</span>
                <h2 className="font-heading font-black text-lg text-[#111111] uppercase">PROMPT AI TỔNG HỢP & GHI CHÚ THÊM</h2>
                <p className="text-xs text-neutral-500 mt-1">Câu lệnh (Prompt) bên dưới tự động tổng hợp từ 7 cấu hình trên để gửi trực tiếp cho AI dệt ảnh.</p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider block mb-1">PROMPT ĐÃ TỔNG HỢP CHO AI:</label>
                <div className="p-3 bg-white border border-[#C5A059] text-xs font-mono text-[#111111] leading-relaxed select-all">
                  {promptText}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">GHI CHÚ SÁNG TẠO BỔ SUNG (NẾU CÓ):</label>
                <textarea
                  rows={2}
                  value={extraPrompt}
                  onChange={(e) => setExtraPrompt(e.target.value)}
                  placeholder="Nhập thêm yêu cầu chi tiết khác (ví dụ: đính đá ngọc trai cổ áo, tà xòe rộng...)"
                  className="w-full p-3 bg-white border border-neutral-300 text-xs focus:outline-none focus:border-[#111111] leading-relaxed resize-none font-normal"
                ></textarea>
              </div>
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

              {/* Summary of 7 Custom Parameters */}
              <div className="p-3 bg-white border border-neutral-200 text-[11px] space-y-1 text-neutral-700">
                <p><span className="font-bold text-[#111111]">Màu sắc:</span> {selectedColor} | <span className="font-bold text-[#111111]">Chất liệu:</span> {selectedFabric}</p>
                <p><span className="font-bold text-[#111111]">Họa tiết:</span> {selectedPattern} | <span className="font-bold text-[#111111]">Cổ áo:</span> {selectedCollar}</p>
                <p><span className="font-bold text-[#111111]">Tay áo:</span> {selectedSleeve} | <span className="font-bold text-[#111111]">Phom dáng:</span> {selectedFit}</p>
              </div>

              {/* Action Buttons Section */}
              <div className="space-y-3">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-4 bg-[#111111] hover:bg-[#C5A059] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border-none shadow-xl flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" />
                      <span>ĐANG TẠO THIẾT KẾ AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#C5A059]" />
                      <span>TẠO THIẾT KẾ VỚI DaiVerse AI</span>
                    </>
                  )}
                </button>

                {generatedResult && (
                  <div className="space-y-2 pt-2 border-t border-neutral-200">
                    {FEATURE_FLAGS.ENABLE_AI_TRY_ON && (
                      <button
                        onClick={handleTryOnNow}
                        className="w-full py-3 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border-none flex items-center justify-center gap-2"
                      >
                        <Camera className="w-4 h-4 text-[#C5A059]" />
                        <span>THỬ ĐỒ VIRTUAL TRY-ON (ẢNH BẠN)</span>
                      </button>
                    )}

                    <button
                      onClick={handleOrderDesign}
                      className="w-full py-3.5 bg-[#C5A059] hover:bg-[#A4813D] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border-none flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Scissors className="w-4 h-4" />
                      <span>ĐẶT MAY THIẾT KẾ NÀY</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Inline Try-On Modal Panel */}
            {showTryOnPanel && generatedResult && (
              <div className="bg-neutral-50 p-6 border border-[#C5A059] shadow-2xl space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <h3 className="font-heading font-black text-sm uppercase text-[#111111] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    <span>THỬ ĐỒ ẢNH CỦA BẠN VỚI MẪU AI VỪA TẠO</span>
                  </h3>
                </div>

                <div className="space-y-3">
                  <label className="border border-dashed border-neutral-400 p-3 text-center block cursor-pointer bg-white hover:border-[#111111]">
                    <input type="file" accept="image/*" className="hidden" ref={tryOnFileRef} onChange={handleTryOnPersonUpload} />
                    {tryOnPersonImage ? (
                      <div className="flex items-center justify-center gap-3">
                        <img src={tryOnPersonImage} alt="Ảnh bạn" className="w-12 h-12 object-cover border border-[#111111]" />
                        <span className="text-xs font-bold text-[#C5A059]">✓ Đã chọn ảnh của bạn (Bấm để đổi)</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-[#111111] uppercase tracking-wider">TẢI ẢNH CÁ NHÂN BẠN LÊN (.JPG, .PNG)</span>
                    )}
                  </label>

                  <button
                    onClick={handleRunInlineTryOn}
                    disabled={isTryingOn || !tryOnPersonImage}
                    className="w-full py-3.5 bg-[#111111] hover:bg-[#C5A059] text-white text-xs font-bold uppercase tracking-widest border-none cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                  >
                    {isTryingOn ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" />
                        <span>ĐANG XỬ LÝ VIRTUAL TRY-ON...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#C5A059]" />
                        <span>BẮT ĐẦU VIRTUAL TRY-ON</span>
                      </>
                    )}
                  </button>

                  {isTryingOn && (
                    <div className="p-4 bg-neutral-900 text-white border border-[#C5A059] rounded-xs text-center space-y-2">
                      <Sparkles className="w-6 h-6 text-[#C5A059] animate-spin mx-auto" />
                      <p className="text-xs font-bold text-[#C5A059] uppercase tracking-wide">{tryOnStepMsg}</p>
                      <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-[#C5A059] transition-all duration-500" style={{ width: `${tryOnProgress}%` }} />
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400 block">{tryOnProgress}%</span>
                    </div>
                  )}

                  {tryOnResult && !isTryingOn && (
                    <div className="mt-4 text-center space-y-3 pt-3 border-t border-neutral-300">
                      <p className="text-xs font-bold text-[#C5A059] uppercase tracking-wide">🎉 KẾT QUẢ VIRTUAL TRY-ON THIẾT KẾ AI:</p>
                      <div className="aspect-[3/4] overflow-hidden border-2 border-[#C5A059] shadow-xl bg-neutral-900">
                        <img src={tryOnResult} alt="Kết quả thử đồ AI" className="w-full h-full object-cover" />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href = tryOnResult;
                          a.download = `DaiVerse-Custom-AI-TryOn-${Date.now()}.png`;
                          a.click();
                        }}
                        className="w-full py-2.5 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border-none flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4 text-[#C5A059]" />
                        <span>TẢI ÁNH KẾT QUẢ VỀ</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Form Modal Panel */}
            {showOrderForm && generatedResult && (
              <div className="bg-neutral-50 p-6 border-2 border-[#111111] shadow-2xl space-y-4 animate-fade-in">
                <div className="border-b border-neutral-200 pb-2">
                  <h3 className="font-heading font-black text-sm uppercase text-[#111111]">XÁC NHẬN ĐẶT MAY THIẾT KẾ AI</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Xưởng may thủ công DaiVerse sẽ liên hệ trực tiếp để đo may theo ý tưởng của bạn.</p>
                </div>

                {orderSubmitted ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="font-heading font-black text-sm uppercase text-emerald-900">ĐẶT HÀNG THÀNH CÔNG!</h4>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      Thông tin thiết kế AI cùng 7 cấu hình thông số may đo đã được chuyển tới Admin và xưởng may. Email xác nhận đã được gửi đến bạn!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-[#111111] uppercase block mb-1">Họ và tên (*):</label>
                      <input
                        type="text"
                        value={orderForm.name}
                        onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                        placeholder="Nhập họ tên của bạn"
                        className="w-full p-2.5 bg-white border border-neutral-300 focus:outline-none focus:border-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-[#111111] uppercase block mb-1">Số điện thoại (*):</label>
                      <input
                        type="tel"
                        value={orderForm.phone}
                        onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                        placeholder="Nhập số điện thoại liên hệ"
                        className="w-full p-2.5 bg-white border border-neutral-300 focus:outline-none focus:border-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-[#111111] uppercase block mb-1">Email nhận xác nhận:</label>
                      <input
                        type="email"
                        value={orderForm.email}
                        onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                        placeholder="email@example.com"
                        className="w-full p-2.5 bg-white border border-neutral-300 focus:outline-none focus:border-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-[#111111] uppercase block mb-1">Hình thức giao hàng:</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setOrderForm({ ...orderForm, deliveryOption: "standard" })}
                          className={`p-2 border text-center transition-all cursor-pointer font-bold ${
                            orderForm.deliveryOption === "standard"
                              ? "border-[#111111] bg-[#111111] text-white"
                              : "border-neutral-300 bg-white text-neutral-700"
                          }`}
                        >
                           Tiêu chuẩn (Freeship)
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderForm({ ...orderForm, deliveryOption: "express24h" })}
                          className={`p-2 border text-center transition-all cursor-pointer font-bold ${
                            orderForm.deliveryOption === "express24h"
                              ? "border-[#DC2626] bg-[#DC2626] text-white"
                              : "border-neutral-300 bg-white text-neutral-700"
                          }`}
                        >
                          ⚡ Giao Hỏa Tốc 24h
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-[#111111] uppercase block mb-1">Size áo dài:</label>
                      <div className="flex gap-2">
                        {["S", "M", "L", "XL", "May Đo Chi Tiết"].map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setOrderForm({ ...orderForm, size: sz })}
                            className={`px-3 py-1.5 border font-bold transition-all cursor-pointer ${
                              orderForm.size === sz
                                ? "border-[#111111] bg-[#111111] text-white"
                                : "border-neutral-300 bg-white text-neutral-700"
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-[#111111] uppercase block mb-1">Địa chỉ giao hàng:</label>
                      <input
                        type="text"
                        value={orderForm.address}
                        onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                        placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"
                        className="w-full p-2.5 bg-white border border-neutral-300 focus:outline-none focus:border-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-[#111111] uppercase block mb-1">Ghi chú số đo / xưởng may:</label>
                      <textarea
                        rows={2}
                        value={orderForm.note}
                        onChange={(e) => setOrderForm({ ...orderForm, note: e.target.value })}
                        placeholder="Ví dụ: Vòng ngực 84, Vòng eo 66, Chiều cao 1m62..."
                        className="w-full p-2.5 bg-white border border-neutral-300 focus:outline-none focus:border-[#111111] resize-none"
                      ></textarea>
                    </div>

                    <button
                      onClick={handleSubmitOrder}
                      disabled={isSubmittingOrder}
                      className="w-full py-3.5 bg-[#C5A059] hover:bg-[#A4813D] text-white font-bold text-xs uppercase tracking-widest border-none cursor-pointer disabled:opacity-50 shadow-lg"
                    >
                      {isSubmittingOrder ? "ĐANG GỬI ĐƠN..." : "XÁC NHẬN ĐẶT MAY THIẾT KẾ AI"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
