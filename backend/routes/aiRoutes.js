const express = require("express");
const router = express.Router();
const { generateDesign, virtualTryOn, tryOnWithAiDesign, orderAiDesign } = require("../controllers/aiController");

// POST /api/ai/design  — Thiết kế áo dài với FLUX.1-schnell
router.post("/design", generateDesign);

// POST /api/ai/tryon   — Thử đồ ảo với IDM-VTON + Perfect Corp (garment = URL/path)
router.post("/tryon", virtualTryOn);

// POST /api/ai/tryon-ai-design — Thử đồ với ảnh thiết kế AI base64 (garment = FLUX output)
router.post("/tryon-ai-design", tryOnWithAiDesign);

// POST /api/ai/order-design — Đặt hàng thiết kế AI, gửi mail kèm ảnh thiết kế đến Admin
router.post("/order-design", orderAiDesign);

module.exports = router;
