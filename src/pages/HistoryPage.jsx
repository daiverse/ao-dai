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
    <div className="pt-32 sm:pt-36 pb-20 bg-white min-h-screen text-[#111111]">
      <div className="container-page">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 bg-[#C5A059] text-white inline-block mb-3">
            LỊCH SỬ THỬ ĐỒ AI
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#111111] uppercase tracking-wide">
            CÁC MẪU ĐÃ THỬ TRỰC TUYẾN
          </h1>
          <p className="text-neutral-600 mt-2 text-xs sm:text-sm max-w-xl mx-auto font-normal">
            Danh sách các mẫu áo dài bạn đã tạo hoặc ghép phom trong Phòng Xem Đồ AI Studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleHistory.map((item) => (
            <div key={item.id} className="bg-neutral-50 p-5 border border-neutral-300 space-y-3">
              <div className="aspect-[3/4] overflow-hidden bg-neutral-200">
                <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#C5A059]" />{item.date}</p>
                <h3 className="font-heading font-black text-sm uppercase text-[#111111] mt-1 truncate">{item.productName}</h3>
                <p className="text-xs font-bold text-[#C5A059] mt-0.5">{item.price}</p>
              </div>

              {FEATURE_FLAGS.ENABLE_AI_TRY_ON && (
                <button
                  onClick={() => onNavigateToTryOn && onNavigateToTryOn()}
                  className="w-full py-2.5 bg-[#111111] hover:bg-[#C5A059] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border-none flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
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

