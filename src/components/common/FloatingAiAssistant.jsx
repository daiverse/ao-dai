import React, { useState } from "react";
import { MessageCircle, X, Send, Sparkles, Bot, User } from "lucide-react";

export default function FloatingAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Xin chào! Tôi là Trợ Lý AI của ÁO DÀI DAIVERSE. Bạn cần tư vấn chọn Áo Dài, chọn size hay thử đồ với công nghệ AI?"
    }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputMsg("");

    setTimeout(() => {
      let botReply = "Cảm ơn bạn! ÁO DÀI DAIVERSE khuyên bạn nên thử trải nghiệm **AI Design Studio** hoặc **Phòng Thử Đồ AI** để phối đồ chuẩn vóc dáng nhất.";
      if (userText.toLowerCase().includes("cưới") || userText.toLowerCase().includes("lễ")) {
        botReply = "Đối với lễ cưới và sự kiện trọng đại, bộ sưu tập **Áo Dài Cưới DaiVerse Gấm Hoàng Gia** đang là lựa chọn được yêu thích nhất với sắc đỏ quý phái!";
      } else if (userText.toLowerCase().includes("size") || userText.toLowerCase().includes("đo")) {
        botReply = "DaiVerse hỗ trợ bảng size tiêu chuẩn S, M, L, XL và dịch vụ may theo số đo riêng. Bạn có thể bấm vào 'Bảng Size Chuẩn' khi xem chi tiết sản phẩm!";
      } else if (userText.toLowerCase().includes("giá") || userText.toLowerCase().includes("tiền")) {
        botReply = "Các sản phẩm Áo Dài DaiVerse có mức giá ưu đãi từ 1.250.000đ - 2.850.000đ tùy theo chất liệu gấm lụa cao cấp!";
      }

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-none shadow-2xl border border-neutral-300 overflow-hidden animate-fade-in flex flex-col h-[480px]">
          {/* Top Bar */}
          <div className="bg-[#111111] text-white p-4 flex items-center justify-between border-b-2 border-[#C5A059]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#C5A059] flex items-center justify-center text-[#111111] shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-black text-xs uppercase tracking-wider text-white">TRỢ LÝ AI DAIVERSE</h3>
                <p className="text-[10px] text-neutral-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  Đang trực tuyến 24/7
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer border-none bg-transparent"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                  msg.sender === "user" ? "bg-[#C5A059] text-white" : "bg-[#111111] text-white"
                }`}>
                  {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />}
                </div>
                <div
                  className={`p-3 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#111111] text-white"
                      : "bg-white border border-neutral-200 text-neutral-800 shadow-xs"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-neutral-200 flex gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => setInputMsg("Gợi ý áo dài cưới?")}
              className="px-2.5 py-1 bg-neutral-100 hover:bg-[#C5A059] hover:text-white border border-neutral-300 font-semibold whitespace-nowrap text-neutral-700 transition-colors cursor-pointer"
            >
              💍 Áo dài cưới
            </button>
            <button
              onClick={() => setInputMsg("Hướng dẫn chọn size")}
              className="px-2.5 py-1 bg-neutral-100 hover:bg-[#C5A059] hover:text-white border border-neutral-300 font-semibold whitespace-nowrap text-neutral-700 transition-colors cursor-pointer"
            >
              📏 Chọn size
            </button>
            <button
              onClick={() => setInputMsg("Giá may theo yêu cầu?")}
              className="px-2.5 py-1 bg-neutral-100 hover:bg-[#C5A059] hover:text-white border border-neutral-300 font-semibold whitespace-nowrap text-neutral-700 transition-colors cursor-pointer"
            >
              💎 Bảng giá
            </button>
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-neutral-200 flex gap-2">
            <input
              type="text"
              placeholder="Nhập câu hỏi cho DaiVerse AI..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 px-3 py-2 bg-neutral-100 border border-neutral-300 text-xs focus:border-[#C5A059] focus:outline-none"
            />
            <button
              type="submit"
              className="p-2 bg-[#111111] hover:bg-[#C5A059] text-white transition-colors cursor-pointer border-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-full bg-[#111111] text-white shadow-xl hover:bg-[#C5A059] hover:scale-105 flex items-center justify-center transition-all cursor-pointer relative border-2 border-white"
        aria-label="Mở trợ lý AI DaiVerse"
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-[#C5A059] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-white">
              AI
            </span>
          </>
        )}
      </button>
    </div>
  );
}

