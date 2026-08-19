// ─────────────────────────────────────────────────────────────────────────────
// Client AI Service Proxy (Bảo mật: Token Hugging Face được ẩn an toàn ở Backend)
// ─────────────────────────────────────────────────────────────────────────────
import { API_BASE_URL as BASE_URL } from "../config/api";

const API_BASE_URL = `${BASE_URL}/api/ai`;

/**
 * 🎨 Thiết kế Áo Dài bằng AI (FLUX.1-schnell qua Backend Proxy)
 */
export const generateAoDaiDesign = async ({ prompt, patterns = [], season = "spring", colorName = "" }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/design`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, patterns, season, colorName }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Lỗi tạo thiết kế từ AI backend server.");
    }

    return data.imageUrl;
  } catch (err) {
    console.error("AI Design Error:", err);
    throw err;
  }
};

/**
 * 👗 Thử Đồ Ảo bằng AI (IDM-VTON qua Backend Proxy)
 */
export const runVirtualTryOn = async (personImageUrl, garmentImageUrl) => {
  try {
    const urlToBase64 = async (url) => {
      const res = await fetch(url);
      const blob = await res.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };

    const [personB64, garmentB64] = await Promise.all([
      urlToBase64(personImageUrl),
      urlToBase64(garmentImageUrl),
    ]);

    const res = await fetch(`${API_BASE_URL}/tryon`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personImageBase64: personB64,
        garmentImageBase64: garmentB64,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return null;
    }

    return data.imageUrl;
  } catch (err) {
    console.warn("Virtual try-on backend error:", err);
    return null;
  }
};

