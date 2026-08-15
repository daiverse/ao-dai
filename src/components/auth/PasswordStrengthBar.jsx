import React from "react";
import { Check, X } from "lucide-react";

export const calculatePasswordStrength = (password) => {
  if (!password) {
    return {
      isValid: false,
      score: 0,
      label: "Rất yếu",
      color: "bg-rose-500",
      textColor: "text-rose-600",
      percent: 0,
      checks: {
        length: false,
        hasUpperAndLower: false,
        hasNumber: false,
        hasSpecial: false,
      },
    };
  }

  const checks = {
    length: password.length >= 8,
    hasUpperAndLower: /[A-Z]/.test(password) && /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const isValid = checks.length && checks.hasUpperAndLower && checks.hasNumber && checks.hasSpecial;

  let count = 0;
  if (checks.length) count++;
  if (checks.hasUpperAndLower) count++;
  if (checks.hasNumber) count++;
  if (checks.hasSpecial) count++;

  let label = "Rất yếu";
  let color = "bg-rose-500";
  let textColor = "text-rose-600";
  let percent = 25;

  switch (count) {
    case 1:
      label = "Rất yếu";
      color = "bg-rose-500";
      textColor = "text-rose-600";
      percent = 25;
      break;
    case 2:
      label = "Yếu";
      color = "bg-rose-500";
      textColor = "text-rose-600";
      percent = 50;
      break;
    case 3:
      label = "Trung bình";
      color = "bg-amber-500";
      textColor = "text-amber-600";
      percent = 75;
      break;
    case 4:
      label = "Đạt chuẩn mạnh";
      color = "bg-emerald-600";
      textColor = "text-emerald-700";
      percent = 100;
      break;
    default:
      label = "Rất yếu";
      color = "bg-rose-500";
      textColor = "text-rose-600";
      percent = 15;
  }

  return { isValid, score: count, label, color, textColor, percent, checks };
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

      {/* 4 Bắt Buộc Requirements Checklist */}
      <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1 text-gray-500">
        <div className="flex items-center gap-1">
          {checks.length ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <X className="w-3.5 h-3.5 text-rose-500" />}
          <span className={checks.length ? "text-emerald-700 font-bold" : "text-rose-600 font-medium"}>Tối thiểu 8 ký tự</span>
        </div>

        <div className="flex items-center gap-1">
          {checks.hasUpperAndLower ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <X className="w-3.5 h-3.5 text-rose-500" />}
          <span className={checks.hasUpperAndLower ? "text-emerald-700 font-bold" : "text-rose-600 font-medium"}>Chữ hoa & chữ thường</span>
        </div>

        <div className="flex items-center gap-1">
          {checks.hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <X className="w-3.5 h-3.5 text-rose-500" />}
          <span className={checks.hasNumber ? "text-emerald-700 font-bold" : "text-rose-600 font-medium"}>Có chữ số (0-9)</span>
        </div>

        <div className="flex items-center gap-1">
          {checks.hasSpecial ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <X className="w-3.5 h-3.5 text-rose-500" />}
          <span className={checks.hasSpecial ? "text-emerald-700 font-bold" : "text-rose-600 font-medium"}>Có ký tự đặc biệt (@#$)</span>
        </div>
      </div>
    </div>
  );
}
