const express = require("express");
const router = express.Router();
const { generateDesign, virtualTryOn } = require("../controllers/aiController");

// POST /api/ai/design  — Thiết kế áo dài với FLUX.1-schnell
router.post("/design", generateDesign);

// POST /api/ai/tryon   — Thử đồ ảo với IDM-VTON
router.post("/tryon", virtualTryOn);

module.exports = router;
