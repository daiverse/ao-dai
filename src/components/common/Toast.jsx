import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function Toast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-20 right-6 z-50 animate-fade-in">
      <div className="bg-[#FFDF00] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#E8C55A]/30 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-[#E8C55A]" />
        <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
      </div>
    </div>
  );
}
