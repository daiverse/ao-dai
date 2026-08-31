// ─────────────────────────────────────────────────────────────────────────────
// AI Design Try-On Utility
// Dùng ảnh thiết kế AI (base64) làm garment để thử đồ với Perfect Corp
// ─────────────────────────────────────────────────────────────────────────────
import { API_BASE_URL as BASE_URL } from "../config/api";

const API_BASE_URL = `${BASE_URL}/api/ai`;

/**
 * Thử đồ với ảnh thiết kế AI (garment = base64 từ FLUX)
 * @param {string} personImageBase64 - Ảnh người dùng dạng base64 data URL
 * @param {string} garmentImageBase64 - Ảnh thiết kế AI dạng base64 data URL
 */
export const runTryOnWithAiDesign = async (personImageBase64, garmentImageBase64) => {
  const res = await fetch(`${API_BASE_URL}/tryon-ai-design`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ personImageBase64, garmentImageBase64 }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Lỗi Virtual Try-On với thiết kế AI.");
  }

  return data.resultImageBase64 || data.imageUrl;
};
