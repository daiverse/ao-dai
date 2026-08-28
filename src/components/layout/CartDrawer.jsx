import React from "react";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function CartDrawer({ onNavigateToCheckout }) {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, formattedTotalPrice, totalItems } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-fade-in">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#FDF6C0]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#FFDF00]" />
              <h2 className="font-heading text-xl font-bold text-[#FFDF00]">
                Giỏ Hàng Của Bạn ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-[#FDF6C0] rounded-full flex items-center justify-center mx-auto text-gray-400">
                  <ShoppingBag className="w-8 h-8 text-[#C8920A]/60" />
                </div>
                <p className="text-gray-500 font-medium">Giỏ hàng của bạn đang trống</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-[#FFDF00] text-white text-sm rounded-full font-medium hover:bg-[#FFDF00]/90 transition-all shadow-md"
                >
                  Khám Phá Áo Dài Ngay
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="flex gap-4 p-3 bg-[#FDF6C0] rounded-2xl border border-gray-100 relative group">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-xl shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-heading font-semibold text-sm text-gray-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Kích thước: <span className="font-semibold text-gray-700">{item.size}</span> | Màu: <span className="font-semibold text-gray-700">{item.color}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(index, -1)}
                          className="p-1 hover:bg-gray-100 text-gray-600 rounded-l-lg"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, 1)}
                          className="p-1 hover:bg-gray-100 text-gray-600 rounded-r-lg"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-bold text-sm text-[#C8920A]">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(index)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer: Total & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-[#FDF6C0] space-y-4">
              <div className="flex items-center justify-between text-base">
                <span className="text-gray-600 font-medium">Tổng tiền tạm tính:</span>
                <span className="font-heading font-bold text-xl text-[#FFDF00]">{formattedTotalPrice}</span>
              </div>
              <p className="text-xs text-gray-500">Phí vận chuyển và ưu đãi sẽ được tính khi đặt hàng.</p>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  if (onNavigateToCheckout) onNavigateToCheckout();
                }}
                className="w-full py-4 bg-[#FFDF00] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#FFDF00]/90 transition-all shadow-xl shadow-[#FFDF00]/20 cursor-pointer"
              >
                <span>Tiến Hành Đặt Hàng</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
