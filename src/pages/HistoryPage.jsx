import React from "react";
import { Sparkles, Clock, ArrowRight } from "lucide-react";
import { PRODUCTS } from "../data/products";
import { FEATURE_FLAGS } from "../config/featureFlags";

export default function HistoryPage({ onNavigateToTryOn }) {
  const sampleHistory = [
    {
      id: 1,
      date: " Hôm nay, 16:45",
      productName: "Áo Dài Gấm Sen Thêu Tay Mộng Liên",
      image: PRODUCTS[0].images[0],
      price: PRODUCTS[0].formattedPrice
    },
    {
      id: 2,
      date: " Hôm qua, 10:20",
      productName: "Áo Dài Cưới Gấm Hoàng Gia Xích Nguyệt",
      image: PRODUCTS[1].images[0],
      price: PRODUCTS[1].formattedPrice
    }
  ];

  return (
    <div className="pt-28 pb-20 bg-[#EBE9E1] min-h-screen">
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFB11D]/10 text-[#EFB11D] text-xs font-semibold uppercase tracking-wider mb-3">
            <Clock className="w-4 h-4 text-[#E43D12]" />
            <span>Lịch Sử Thử Đồ AI</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900">
            Các Mẫu Đã Thử Trực Tuyến
          </h1>
          <p className="text-gray-600 mt-3 text-sm sm:text-base">
            Danh sách các mẫu áo dài bạn đã tạo hoặc ghép phom trong Phòng Xem Đồ AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleHistory.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl space-y-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
                <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{item.date}</p>
                <h3 className="font-heading font-bold text-base text-gray-900 mt-1">{item.productName}</h3>
                <p className="text-sm font-bold text-[#E43D12] mt-1">{item.price}</p>
              </div>

              {FEATURE_FLAGS.ENABLE_AI_TRY_ON && (
                <button
                  onClick={() => onNavigateToTryOn && onNavigateToTryOn()}
                  className="w-full py-2.5 bg-[#EFB11D] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#EFB11D]" />
                  <span>Thử Lại Trong Virtual Try-on</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
