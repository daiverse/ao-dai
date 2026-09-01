import React, { useState, useEffect } from "react";
import { 
  X, Star, Sparkles, ShoppingBag, Check, ShieldCheck, 
  Truck, RefreshCw, ChevronLeft, ChevronRight, BookOpen, RotateCcw, Maximize2
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import SizeGuideModal from "./SizeGuideModal";
import { FEATURE_FLAGS } from "../../config/featureFlags";

export default function ProductQuickView({ onNavigateToTryOn, onNavigateTo360 }) {
  const { quickViewProduct, setQuickViewProduct, addToCart, showToast } = useCart();
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
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setQuickViewProduct(null)}
      ></div>

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-5xl bg-white rounded-none shadow-2xl overflow-hidden animate-fade-in border border-neutral-200 my-4 sm:my-8 z-10">
          
          {/* Top Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#111111] text-white">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]"></span>
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-white">
                DaiVerse FASHION · CHI TIẾT SẢN PHẨM
              </span>
            </div>

            <button
              onClick={() => setQuickViewProduct(null)}
              className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-300 transition-colors shadow-sm cursor-pointer border-none bg-transparent"
              title="Đóng chi tiết"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* LEFT COLUMN: INTERACTIVE PHOTO GALLERY (6 cols) */}
            <div className="lg:col-span-6 bg-neutral-50 p-4 sm:p-6 flex flex-col justify-between border-r border-neutral-200">
              {/* Main Image Stage */}
              <div className="relative aspect-[3/4] w-full rounded-none overflow-hidden border border-neutral-200 bg-white group">
                <img
                  src={images[selectedImageIdx]}
                  alt={`${product.name} - Ảnh ${selectedImageIdx + 1}`}
                  className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                />

                {/* Overlay Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                  {product.isExpress24h && (
                    <span className="px-2.5 py-1 bg-[#111111] text-white text-[10px] font-bold uppercase tracking-wider rounded-none shadow-md">
                      ⚡ Giao Hỏa Tốc 24h
                    </span>
                  )}
                  {product.isNew && (
                    <span className="px-2.5 py-1 bg-[#C5A059] text-white text-[10px] font-bold uppercase tracking-wider rounded-none shadow-md">
                      Mới 2026
                    </span>
                  )}
                </div>

                {/* Photo Counter */}
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/70 text-white text-xs font-semibold rounded-none z-10">
                  {selectedImageIdx + 1} / {images.length}
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 text-neutral-800 hover:bg-[#111111] hover:text-white shadow-md transition-all cursor-pointer border border-neutral-300"
                      title="Ảnh trước"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 text-neutral-800 hover:bg-[#111111] hover:text-white shadow-md transition-all cursor-pointer border border-neutral-300"
                      title="Ảnh tiếp"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* THUMBNAIL STRIP */}
              {images.length > 1 && (
                <div className="mt-4 space-y-2">
                  <div className="text-[11px] uppercase tracking-wider font-bold text-neutral-500 flex items-center justify-between">
                    <span>Ảnh chi tiết ({images.length}):</span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIdx(idx)}
                        className={`relative w-14 h-18 rounded-none overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          selectedImageIdx === idx
                            ? "border-[#C5A059]"
                            : "border-neutral-200 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action shortcuts */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {FEATURE_FLAGS.ENABLE_AI_TRY_ON && product.hasAiTryOn && (
                  <button
                    onClick={() => {
                      setQuickViewProduct(null);
                      if (onNavigateToTryOn) onNavigateToTryOn(product);
                    }}
                    className="py-2.5 px-3 bg-[#C5A059] text-white rounded-none text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#A4813D] cursor-pointer border-none"
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
                    className="py-2.5 px-3 bg-[#111111] text-white rounded-none text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-neutral-800 cursor-pointer border-none"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-white" />
                    <span>Xem 360°</span>
                  </button>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: PRODUCT STORY & DETAILS (6 cols) */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-start space-y-5 max-h-[85vh] overflow-y-auto">
              
              {/* Product Info Header */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-neutral-100 text-[#111111] text-[11px] font-bold uppercase tracking-widest border border-neutral-300">
                    {product.fabric || "Gấm Lụa DaiVerse Cao Cấp"}
                  </span>
                  
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2.5 py-1 rounded-none border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating}</span>
                    <span className="text-neutral-400 font-normal">({product.reviewsCount} Đánh giá)</span>
                  </div>
                </div>

                <h1 className="font-heading font-black text-2xl text-[#111111] uppercase tracking-wide leading-tight">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="font-heading text-2xl font-black text-[#C5A059]">
                    {product.formattedPrice}
                  </span>
                  {product.formattedOriginalPrice && (
                    <span className="text-sm text-neutral-400 line-through">
                      {product.formattedOriginalPrice}
                    </span>
                  )}
                  {product.formattedOriginalPrice && (
                    <span className="px-2 py-0.5 bg-[#C5A059] text-white text-[10px] font-extrabold uppercase rounded-none">
                      GIẢM SALE
                    </span>
                  )}
                </div>
              </div>

              {/* TAB SELECTOR */}
              <div className="border-b border-neutral-200 flex gap-6 text-xs font-bold uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab("story")}
                  className={`pb-2.5 transition-all cursor-pointer border-b-2 ${
                    activeTab === "story"
                      ? "border-[#C5A059] text-[#C5A059]"
                      : "border-transparent text-neutral-400 hover:text-neutral-700"
                  }`}
                >
                  Câu Chuyện Thiết Kế
                </button>
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`pb-2.5 transition-all cursor-pointer border-b-2 ${
                    activeTab === "specs"
                      ? "border-[#C5A059] text-[#C5A059]"
                      : "border-transparent text-neutral-400 hover:text-neutral-700"
                  }`}
                >
                  Mô Tả & Thông Số
                </button>
              </div>

              {/* TAB CONTENT 1: CÂU CHUYỆN THIẾT KẾ */}
              {activeTab === "story" && (
                <div className="bg-neutral-50 p-4 rounded-none border border-neutral-200 space-y-2 max-h-56 overflow-y-auto">
                  {product.storyTitle && (
                    <h3 className="font-heading font-bold text-sm text-[#111111] uppercase tracking-wide border-b border-neutral-200 pb-1.5">
                      {product.storyTitle}
                    </h3>
                  )}
                  <div className="text-xs text-neutral-700 leading-relaxed font-normal whitespace-pre-line space-y-2">
                    {product.storyContent ? product.storyContent : <p>{product.description}</p>}
                  </div>
                </div>
              )}

              {/* TAB CONTENT 2: SPECS */}
              {activeTab === "specs" && (
                <div className="space-y-2 text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-4 border border-neutral-200">
                  <p><strong>Bộ sản phẩm:</strong> {product.expressTag || "Áo dài cao cấp DaiVerse"}</p>
                  <p><strong>Chất liệu:</strong> {product.fabric}</p>
                  <p><strong>Dịp sử dụng:</strong> Công sở, sự kiện, cưới hỏi, dạo phố sang trọng</p>
                  <p><strong>Bảo quản:</strong> Giặt nhẹ, ủi hơi nước nhiệt độ thích hợp</p>
                </div>
              )}

              {/* SIZE SELECTION */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                      Chọn Kích Thước Size:
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs text-[#C5A059] font-bold underline cursor-pointer bg-transparent border-none p-0 uppercase"
                    >
                      Bảng Size Chuẩn
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-4 py-2 text-xs font-bold transition-all cursor-pointer rounded-none border ${
                          selectedSize === sz
                            ? "border-[#111111] bg-[#111111] text-white"
                            : "border-neutral-300 bg-white text-neutral-800 hover:border-neutral-600"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* GUARANTEES BAR */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-neutral-200 text-[11px] text-neutral-600 font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>CAM KẾT DAIVERSE</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#C5A059]" />
                  <span>GIAO HÀNG 24H</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-[#C5A059]" />
                  <span>ĐỔI TRẢ 15 NGÀY</span>
                </div>
              </div>

              {/* ADD TO CART ACTION BUTTON */}
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-[#111111] text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#C5A059] transition-all shadow-md cursor-pointer border-none"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
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

