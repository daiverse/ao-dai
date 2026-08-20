// API Configuration for local & cloud production (Render / Cloudflare)
const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV || isLocal ? "http://localhost:5000" : "https://ao-dai-ze5i.onrender.com");

