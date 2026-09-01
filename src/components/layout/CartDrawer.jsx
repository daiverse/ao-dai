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
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-fade-in border-l border-neutral-200">
          {/* Header */}
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-[#111111] text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-heading text-base font-bold uppercase tracking-wider text-white">
                Giỏ Hàng DaiVerse ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-300 transition-colors cursor-pointer border-none bg-transparent"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-neutral-50">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-white border border-neutral-200 rounded-full flex items-center justify-center mx-auto text-neutral-400 shadow-sm">
                  <ShoppingBag className="w-8 h-8 text-[#C5A059]" />
                </div>
                <p className="text-sm text-neutral-600 font-medium uppercase tracking-wider">Giỏ hàng của bạn chưa có sản phẩm</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-3 bg-[#111111] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] transition-all border-none cursor-pointer"
                >
                  Khám Phá Sản Phẩm Ngay
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="flex gap-4 p-3.5 bg-white rounded-none border border-neutral-200 relative group shadow-sm">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-26 object-cover rounded-none shrink-0 border border-neutral-100"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-xs text-[#111111] uppercase tracking-wide line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-1">
                        Size: <span className="font-bold text-[#111111]">{item.size}</span> | Màu: <span className="font-bold text-[#111111]">{item.color}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-neutral-300 bg-white">
                        <button
                          onClick={() => updateQuantity(index, -1)}
                          className="p-1 hover:bg-neutral-100 text-neutral-600 border-r border-neutral-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-[#111111]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, 1)}
                          className="p-1 hover:bg-neutral-100 text-neutral-600 border-l border-neutral-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold text-xs text-[#C5A059]">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(index)}
                    className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-[#C5A059] transition-colors cursor-pointer border-none bg-transparent"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer: Total & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-neutral-200 bg-white space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 font-semibold uppercase tracking-wider text-xs">Tổng tiền tạm tính:</span>
                <span className="font-heading font-black text-lg text-[#C5A059]">{formattedTotalPrice}</span>
              </div>
              <p className="text-[11px] text-neutral-500">Đã bao gồm thuế VAT. Phí giao hàng tính tại bước thanh toán.</p>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  if (onNavigateToCheckout) onNavigateToCheckout();
                }}
                className="w-full py-3.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#C5A059] transition-all shadow-md cursor-pointer border-none"
              >
                <span>Tiến Hành Thanh Toán</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

