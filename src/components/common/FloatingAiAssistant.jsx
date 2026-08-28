import React, { useState } from "react";
import { MessageCircle, X, Send, Sparkles, Bot, User } from "lucide-react";

export default function FloatingAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Xin chào! Tôi là Trợ Lý AI của DaiVerse. Bạn cần tư vấn chọn áo dài cưới, chọn size hay trải nghiệm thiết kế AI?"
    }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputMsg("");

    setTimeout(() => {
      let botReply = "Cảm ơn bạn! DaiVerse khuyến nghị bạn thử trải nghiệm **AI Design Studio** hoặc **Phòng Xem Đồ AI** để phối đồ chuẩn phom dáng nhất.";
      if (userText.toLowerCase().includes("cưới") || userText.toLowerCase().includes("lễ")) {
        botReply = "Đối với lễ cưới, bộ sưu tập **Hương Cố Đô** và mẫu **Áo Dài Cưới Gấm Hoàng Gia Xích Nguyệt** đang là lựa chọn được yêu thích nhất với sắc đỏ may mắn và họa tiết thêu phượng tinh tế!";
      } else if (userText.toLowerCase().includes("size") || userText.toLowerCase().includes("đo")) {
        botReply = "DaiVerse có dịch vụ may theo số đo riêng (Tailored Size). Bạn có thể cung cấp Chiều cao, Cân nặng, Vòng 1, Vòng 2 để nghệ nhân may đo chuẩn dáng nhé!";
      } else if (userText.toLowerCase().includes("giá") || userText.toLowerCase().includes("tiền")) {
        botReply = "Các sản phẩm áo dài DaiVerse có mức giá dao động từ 1.350.000đ - 2.950.000đ tuỳ theo chất liệu gấm lụa tơ tằm và mức độ thêu tay thủ công.";
      }

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in flex flex-col h-[480px]">
          {/* Top Bar */}
          <div className="bg-[#FFDF00] text-[#2C1A00] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C8920A] flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-sm">Trợ Lý AI DaiVerse</h3>
                <p className="text-[11px] text-[#2C1A00]/70 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span>
                  Đang hoạt động · Sẵn sàng tư vấn
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-[#2C1A00]/60 hover:text-[#2C1A00] p-1 rounded-full hover:bg-[#2C1A00]/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FDF6C0]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  msg.sender === "user" ? "bg-[#C8920A] text-white" : "bg-[#FFDF00] text-[#2C1A00]"
                }`}>
                  {msg.sender === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-3.5 h-3.5 text-[#E8C55A]" />}
                </div>
                <div
                  className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#C8920A] text-white rounded-tr-none"
                      : "bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-xs"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => setInputMsg("Gợi ý áo dài cưới?")}
              className="px-2.5 py-1 bg-gray-100 hover:bg-[#C8920A]/10 hover:text-[#C8920A] rounded-full whitespace-nowrap text-gray-600 transition-colors"
            >
              💍 Áo dài cưới
            </button>
            <button
              onClick={() => setInputMsg("Hướng dẫn chọn size")}
              className="px-2.5 py-1 bg-gray-100 hover:bg-[#C8920A]/10 hover:text-[#C8920A] rounded-full whitespace-nowrap text-gray-600 transition-colors"
            >
              📏 Cách chọn size
            </button>
            <button
              onClick={() => setInputMsg("Giá may theo yêu cầu?")}
              className="px-2.5 py-1 bg-gray-100 hover:bg-[#C8920A]/10 hover:text-[#C8920A] rounded-full whitespace-nowrap text-gray-600 transition-colors"
            >
              💎 Bảng giá
            </button>
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              placeholder="Nhập câu hỏi cho AI..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 px-3 py-2 bg-[#FDF6C0] border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#FFDF00]"
            />
            <button
              type="submit"
              className="p-2.5 bg-[#FFDF00] text-white rounded-xl hover:bg-[#FFDF00]/90 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#FFDF00] text-white shadow-xl shadow-[#FFDF00]/30 hover:shadow-2xl hover:scale-105 flex items-center justify-center transition-all cursor-pointer relative"
        aria-label="Mở trợ lý AI"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C8920A] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-bounce">
              AI
            </span>
          </>
        )}
      </button>
    </div>
  );
}
