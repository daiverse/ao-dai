import React from "react";
import { Check, X } from "lucide-react";

export const calculatePasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "bg-gray-200", percent: 0, checks: {} };

  const checks = {
    length: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  let score = 0;
  if (password.length >= 6) score += 1;
  if (checks.length) score += 1;
  if (checks.hasUpper && checks.hasLower) score += 1;
  if (checks.hasNumber) score += 1;
  if (checks.hasSpecial) score += 1;

  // Max score 4
  if (score > 4) score = 4;

  let label = "Rất yếu";
  let color = "bg-rose-500";
  let textColor = "text-rose-600";
  let percent = 20;

  switch (score) {
    case 1:
      label = "Yếu";
      color = "bg-rose-500";
      textColor = "text-rose-600";
      percent = 25;
      break;
    case 2:
      label = "Trung bình";
      color = "bg-amber-500";
      textColor = "text-amber-600";
      percent = 50;
      break;
    case 3:
      label = "Mạnh";
      color = "bg-emerald-500";
      textColor = "text-emerald-600";
      percent = 75;
      break;
    case 4:
      label = "Rất mạnh";
      color = "bg-emerald-600";
      textColor = "text-emerald-700";
      percent = 100;
      break;
    default:
      label = "Rất yếu";
      color = "bg-[#C85A32]";
      textColor = "text-[#C85A32]";
      percent = 15;
  }

  return { score, label, color, textColor, percent, checks };
};

export default function PasswordStrengthBar({ password }) {
  if (!password) return null;

  const { label, color, textColor, percent, checks } = calculatePasswordStrength(password);

  return (
    <div className="space-y-2 pt-1 animate-fadeIn">
      {/* Strength Indicator Bar & Label */}
      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className="text-gray-500 uppercase tracking-wider">Độ mạnh mật khẩu:</span>
        <span className={textColor}>{label}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex gap-1">
        <div
          className={`h-full ${color} transition-all duration-500 rounded-full`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      {/* Quick checklist tips */}
      <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1 text-gray-500">
        <div className="flex items-center gap-1">
          {checks.length ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-gray-300" />}
          <span className={checks.length ? "text-gray-700 font-medium" : ""}>Tối thiểu 8 ký tự</span>
        </div>
        <div className="flex items-center gap-1">
          {checks.hasUpper && checks.hasLower ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-gray-300" />}
          <span className={checks.hasUpper && checks.hasLower ? "text-gray-700 font-medium" : ""}>Chữ hoa & chữ thường</span>
        </div>
        <div className="flex items-center gap-1">
          {checks.hasNumber ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-gray-300" />}
          <span className={checks.hasNumber ? "text-gray-700 font-medium" : ""}>Có chữ số (0-9)</span>
        </div>
        <div className="flex items-center gap-1">
          {checks.hasSpecial ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-gray-300" />}
          <span className={checks.hasSpecial ? "text-gray-700 font-medium" : ""}>Có ký tự đặc biệt (@#$)</span>
        </div>
      </div>
    </div>
  );
}
