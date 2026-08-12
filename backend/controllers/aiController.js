const asyncHandler = require("express-async-handler");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Đọc ảnh local từ thư mục public → base64
// ─────────────────────────────────────────────────────────────────────────────
const localImageToBase64 = (imagePath) => {
  const absolutePath = path.join(
    __dirname,
    "../../public",
    imagePath.replace(/^\//, "")
  );
  if (!fs.existsSync(absolutePath)) return null;
  const buffer = fs.readFileSync(absolutePath);
  const ext = path.extname(imagePath).replace(".", "") || "jpg";
  return `data:image/${ext};base64,${buffer.toString("base64")}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Gọi FLUX.1-schnell qua Hugging Face Inference API (dùng axios)
// ─────────────────────────────────────────────────────────────────────────────
const callFluxAPI = async (prompt) => {
  const HF_TOKEN = process.env.HF_TOKEN;
  const MODEL = "black-forest-labs/FLUX.1-schnell";

  const response = await axios({
    method: "POST",
    url: `https://api-inference.huggingface.co/models/${MODEL}`,
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
      "x-wait-for-model": "true",
    },
    data: {
      inputs: prompt,
      parameters: {
        width: 512,
        height: 768,
        num_inference_steps: 4,
        guidance_scale: 0,
      },
    },
    responseType: "arraybuffer",     // ← nhận binary image
    timeout: 120000,                 // 2 phút timeout
  });

  const base64 = Buffer.from(response.data).toString("base64");
  const contentType = response.headers["content-type"] || "image/png";
  return `data:${contentType};base64,${base64}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Gọi IDM-VTON qua HF Spaces Gradio API (dùng axios)
// ─────────────────────────────────────────────────────────────────────────────
const callIDMVTON = async (personBase64, garmentBase64) => {
  const HF_TOKEN = process.env.HF_TOKEN;
  const SPACE_URL = "https://yisol-idm-vton.hf.space";
  const sessionHash = `aodai_${Date.now()}`;

  // Bước 1: Tham gia queue
  const joinRes = await axios({
    method: "POST",
    url: `${SPACE_URL}/queue/join`,
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    data: {
      fn_index: 0,
      data: [
        { data: personBase64, name: "person.jpg" },
        { data: garmentBase64, name: "garment.jpg" },
        "upper_body",
        true,
        true,
        20,
        42,
      ],
      session_hash: sessionHash,
    },
    timeout: 30000,
  });

  const { event_id } = joinRes.data;

  // Bước 2: Poll kết quả (tối đa 120 giây)
  const MAX_WAIT = 120_000;
  const POLL_INTERVAL = 3000;
  const startTime = Date.now();

  while (Date.now() - startTime < MAX_WAIT) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL));

    try {
      const statusRes = await axios({
        method: "GET",
        url: `${SPACE_URL}/queue/status`,
        params: { event_id },
        headers: { Authorization: `Bearer ${HF_TOKEN}` },
        timeout: 10000,
      });

      const { status, output } = statusRes.data;

      if (status === "COMPLETE") {
        const outputData = output?.data;
        if (outputData && outputData[0]) {
          const img = outputData[0];
          return typeof img === "string" ? img : img.data || img.url;
        }
      }

      if (status === "FAILED") {
        throw new Error("IDM-VTON xử lý thất bại. Vui lòng thử lại.");
      }
    } catch (pollErr) {
      if (pollErr.message.includes("VTON")) throw pollErr;
      // Bỏ qua lỗi poll tạm thời
    }
  }

  throw new Error("Quá thời gian chờ IDM-VTON. Thử lại sau ít phút.");
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Thiết kế áo dài với FLUX.1-schnell
// @route   POST /api/ai/design
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const generateDesign = asyncHandler(async (req, res) => {
  const { prompt, patterns = [], season = "spring", colorName = "" } = req.body;

  if (!prompt || prompt.trim().length < 5) {
    res.status(400);
    throw new Error("Vui lòng nhập mô tả thiết kế (ít nhất 5 ký tự).");
  }

  const patternMap = {
    sen: "lotus flower embroidery",
    hac: "crane bird motif",
    rong: "dragon pattern",
    phuong: "phoenix motif",
    mai: "plum blossom",
    song: "water wave pattern",
  };

  const seasonMap = {
    spring: "soft pink and white, spring blossom",
    summer: "golden amber, summer sunshine",
    autumn: "terracotta and rust, autumn harvest",
    winter: "deep navy royal, winter elegance",
  };

  const patternDesc = patterns.map((p) => patternMap[p] || p).join(", ");
  const seasonDesc = seasonMap[season] || "elegant neutral tones";

  const richPrompt = [
    "Traditional Vietnamese ao dai dress, full body shot on model",
    patternDesc ? `with intricate ${patternDesc}` : "",
    `${seasonDesc} color palette`,
    colorName ? `${colorName} fabric` : "luxurious silk fabric",
    prompt,
    "high-end fashion photography, studio lighting, 8k ultra detailed",
    "Vietnamese traditional fashion, elegant, premium quality",
  ]
    .filter(Boolean)
    .join(", ");

  try {
    const imageUrl = await callFluxAPI(richPrompt);
    res.json({
      success: true,
      message: "Thiết kế AI hoàn tất!",
      imageUrl,
      promptUsed: richPrompt,
    });
  } catch (err) {
    // Nếu HF trả về JSON error (model loading), parse và trả lời thân thiện
    if (err.response) {
      const status = err.response.status;
      let msg = "Lỗi từ Hugging Face API";
      try {
        const errData = JSON.parse(Buffer.from(err.response.data).toString());
        if (errData.error?.includes("loading")) {
          msg = "Model AI đang khởi động (~30s), vui lòng thử lại sau vài giây.";
        } else {
          msg = errData.error || errData.message || msg;
        }
      } catch (_) {}
      res.status(status >= 400 ? status : 500);
      throw new Error(msg);
    }
    throw err;
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Thử đồ ảo với IDM-VTON
// @route   POST /api/ai/tryon
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const virtualTryOn = asyncHandler(async (req, res) => {
  const { personImageBase64, garmentImageBase64, garmentImagePath } = req.body;

  let personB64 = personImageBase64;
  let garmentB64 = garmentImageBase64;

  if (!garmentB64 && garmentImagePath) {
    garmentB64 = localImageToBase64(garmentImagePath);
    if (!garmentB64) {
      res.status(400);
      throw new Error("Không tìm thấy ảnh sản phẩm.");
    }
  }

  if (!personB64) {
    res.status(400);
    throw new Error("Vui lòng cung cấp ảnh người mẫu.");
  }

  if (!garmentB64) {
    res.status(400);
    throw new Error("Vui lòng cung cấp ảnh áo dài.");
  }

  const imageUrl = await callIDMVTON(personB64, garmentB64);

  res.json({
    success: true,
    message: "Thử đồ AI hoàn tất!",
    imageUrl,
  });
});

module.exports = { generateDesign, virtualTryOn };
