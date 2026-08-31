import React, { useState, useEffect } from "react";
import { 
  X, Star, Sparkles, ShoppingBag, Check, ShieldCheck, 
  Truck, RefreshCw, ChevronLeft, ChevronRight, BookOpen, RotateCcw, Maximize2
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import SizeGuideModal from "./SizeGuideModal";
import { FEATURE_FLAGS } from "../../config/featureFlags";

export default function ProductQuickView({ onNavigateToTryOn, onNavigateTo360 }) {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useCart();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("story"); // "story" | "specs"
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Reset indices when quickViewProduct changes
  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImageIdx(0);
      setSelectedSize(quickViewProduct.sizes ? quickViewProduct.sizes[0] : "M");
      setSelectedColorIdx(0);
      setActiveTab("story");
      setIsFullscreen(false);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const images = product.images && product.images.length > 0 ? product.images : ["/anh/bach-lan/1.jpg"];
  const selectedColor = product.colors ? product.colors[selectedColorIdx] : null;

  const handlePrevImage = () => {
    setSelectedImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor?.name);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => setQuickViewProduct(null)}
      ></div>

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in border border-gray-100 my-4 sm:my-8 z-10">
          
          {/* Top Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#EBE9E1]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E43D12]"></span>
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#EFB11D]">
                Chi Tiết Sản Phẩm · DaiVerse
              </span>
            </div>

            <button
              onClick={() => setQuickViewProduct(null)}
              className="p-2 rounded-full bg-white hover:bg-gray-200 text-gray-700 transition-colors shadow-sm cursor-pointer"
              title="Đóng chi tiết"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* LEFT COLUMN: INTERACTIVE PHOTO GALLERY (5 cols) */}
            <div className="lg:col-span-6 bg-[#F8F6F0] p-4 sm:p-6 flex flex-col justify-between border-r border-gray-100">
              {/* Main Image Stage */}
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-md bg-white group">
                <img
                  src={images[selectedImageIdx]}
                  alt={`${product.name} - Ảnh ${selectedImageIdx + 1}`}
                  className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                />

                {/* Overlay Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  {product.isExpress24h && (
                    <span className="px-3 py-1 bg-[#E43D12] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md animate-pulse">
                      ⚡ Giao Hỏa Tốc 24h
                    </span>
                  )}
                  {product.isNew && (
                    <span className="px-3 py-1 bg-[#EFB11D] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
                      Mới 2026
                    </span>
                  )}
                </div>

                {/* Photo Counter */}
                <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-full z-10">
                  {selectedImageIdx + 1} / {images.length}
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md transition-all opacity-80 hover:opacity-100 cursor-pointer"
                      title="Ảnh trước"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md transition-all opacity-80 hover:opacity-100 cursor-pointer"
                      title="Ảnh tiếp"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* THUMBNAIL STRIP (All 4-5 images) */}
              {images.length > 1 && (
                <div className="mt-4 space-y-2">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 flex items-center justify-between">
                    <span>Bộ ảnh chi tiết ({images.length} ảnh):</span>
                    <span className="text-gray-400">Click ảnh để phóng to</span>
                  </div>

                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                    {images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIdx(idx)}
                        className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          selectedImageIdx === idx
                            ? "border-[#E43D12] ring-2 ring-[#E43D12]/30 scale-105 shadow-md"
                            : "border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-400"
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {selectedImageIdx === idx && (
                          <div className="absolute inset-0 bg-[#E43D12]/10"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action shortcuts below gallery */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {FEATURE_FLAGS.ENABLE_AI_TRY_ON && product.hasAiTryOn && (
                  <button
                    onClick={() => {
                      setQuickViewProduct(null);
                      if (onNavigateToTryOn) onNavigateToTryOn(product);
                    }}
                    className="py-2.5 px-3 bg-[#EFB11D] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#EFB11D]/90 shadow-sm cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>Thử Đồ AI</span>
                  </button>
                )}
                {product.has360View && (
                  <button
                    onClick={() => {
                      setQuickViewProduct(null);
                      if (onNavigateTo360) onNavigateTo360();
                    }}
                    className="py-2.5 px-3 bg-white text-gray-800 border border-gray-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-100 shadow-sm cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#EFB11D]" />
                    <span>Xem 360°</span>
                  </button>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: PRODUCT STORY & DETAILS (6 cols) */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-start space-y-5 max-h-[85vh] overflow-y-auto pr-3">
              
              {/* Product Info Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#F5F2EB] text-[#E43D12] text-xs font-bold uppercase tracking-wider border border-[#EFB11D]/30">
                    {product.fabric || "Gấm Lụa Cao Cấp"}
                  </span>
                  
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating}</span>
                    <span className="text-gray-400 font-normal">({product.reviewsCount} Đánh giá)</span>
                  </div>
                </div>

                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-gray-900 leading-tight">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="font-heading text-2xl font-bold text-[#EFB11D]">
                    {product.formattedPrice}
                  </span>
                  {product.formattedOriginalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {product.formattedOriginalPrice}
                    </span>
                  )}
                  {product.formattedOriginalPrice && (
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-bold rounded-md">
                      Tiết kiệm 15%
                    </span>
                  )}
                </div>
              </div>

              {/* TAB SELECTOR: Story vs Specs */}
              <div className="border-b border-gray-200 flex gap-4 text-xs font-bold uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab("story")}
                  className={`pb-2.5 transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
                    activeTab === "story"
                      ? "border-[#EFB11D] text-[#EFB11D]"
                      : "border-transparent text-gray-400 hover:text-gray-700"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Câu Chuyện Thiết Kế</span>
                </button>
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`pb-2.5 transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
                    activeTab === "specs"
                      ? "border-[#EFB11D] text-[#EFB11D]"
                      : "border-transparent text-gray-400 hover:text-gray-700"
                  }`}
                >
                  <span>Mô Tả & Thông Số</span>
                </button>
              </div>

              {/* TAB CONTENT 1: CÂU CHUYỆN THIẾT KẾ FROM DOCX */}
              {activeTab === "story" && (
                <div className="bg-[#EBE9E1] p-5 rounded-2xl border border-[#EFB11D]/40 space-y-3 relative max-h-64 overflow-y-auto pr-3 shadow-inner">
                  <div className="sticky top-0 right-0 float-right pl-3 pb-1 text-[#EFB11D]/30 pointer-events-none">
                    <BookOpen className="w-6 h-6" />
                  </div>

                  {product.storyTitle && (
                    <h3 className="font-heading font-bold text-base text-[#EFB11D] tracking-wide border-b border-[#EFB11D]/20 pb-2">
                      {product.storyTitle}
                    </h3>
                  )}

                  <div className="text-xs sm:text-sm text-gray-800 leading-relaxed font-light whitespace-pre-line space-y-2">
                    {product.storyContent ? (
                      product.storyContent
                    ) : (
                      <p>{product.description}</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB CONTENT 2: SPECS */}
              {activeTab === "specs" && (
                <div className="space-y-3 text-xs sm:text-sm text-gray-600 leading-relaxed bg-[#F8F6F0] p-4 rounded-2xl border border-gray-200">
                  <p><strong>Bộ sản phẩm:</strong> {product.expressTag || "Áo dài kèm quần cao cấp"}</p>
                  <p><strong>Chất liệu:</strong> {product.fabric}</p>
                  <p><strong>Dịp sử dụng:</strong> Lễ tết, cưới hỏi, sự kiện truyền thống & dạo phố</p>
                  <p><strong>Bảo quản:</strong> Giặt tay nhẹ nhàng, tránh chất tẩy mạnh, ủi hơi nước ở nhiệt độ vừa</p>
                </div>
              )}


              {/* SIZE SELECTION */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Kích thước (Size):
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs text-[#E43D12] font-medium underline cursor-pointer bg-transparent border-none p-0"
                    >
                      Bảng Hướng Dẫn May Đo
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          selectedSize === sz
                            ? "border-[#EFB11D] bg-[#EFB11D] text-white shadow-md"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GUARANTEES BAR */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 text-[11px] text-gray-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#EFB11D]" />
                  <span>Cam Kết May Tỉ Mỉ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#EFB11D]" />
                  <span>Giao Hàng Hỏa Tốc</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-[#EFB11D]" />
                  <span>Đổi Size 15 Ngày</span>
                </div>
              </div>

              {/* ADD TO CART ACTION BUTTON */}
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-gradient-to-r from-[#EFB11D] to-[#153125] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-95 shadow-xl transition-all cursor-pointer text-sm tracking-wide"
              >
                <ShoppingBag className="w-5 h-5 text-white" />
                <span>THÊM VÀO GIỎ HÀNG — {product.formattedPrice}</span>
              </button>

            </div>

          </div>
        </div>
      </div>
      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        onSelectTailoredSize={(customData) => {
          setSelectedSize("Tailored");
          showToast("Đã áp dụng số đo riêng cho đơn hàng!");
        }}
      />
    </div>
  );
}
