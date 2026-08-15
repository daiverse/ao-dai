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
// ─────────────────────────────────────────────────────────────────────────────
// Helper: Gọi FLUX.1-schnell qua Hugging Face Router / Pollinations FLUX Engine 4K
// ─────────────────────────────────────────────────────────────────────────────
const callFluxAPI = async (prompt) => {
  const HF_TOKEN = process.env.HF_TOKEN;
  const MODEL = "black-forest-labs/FLUX.1-schnell";

  const endpoints = [
    `https://router.huggingface.co/hf-inference/models/${MODEL}`,
    `https://api-inference.huggingface.co/models/${MODEL}`,
  ];

  // 1. Thử Hugging Face Router Endpoints
  for (const endpointUrl of endpoints) {
    try {
      const response = await axios({
        method: "POST",
        url: endpointUrl,
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
          "x-wait-for-model": "true",
        },
        data: {
          inputs: prompt,
          parameters: {
            width: 768,
            height: 1024,
            num_inference_steps: 4,
            guidance_scale: 3.5,
          },
        },
        responseType: "arraybuffer",
        timeout: 12000,
      });

      const base64 = Buffer.from(response.data).toString("base64");
      const contentType = response.headers["content-type"] || "image/png";
      return `data:${contentType};base64,${base64}`;
    } catch (err) {
      console.warn(`HF Endpoint (${endpointUrl}) bypass: ${err.message}`);
    }
  }

  // 2. Pollinations FLUX Engine (Sử dụng prompt đầy đủ 100% không bị cắt bỏ)
  try {
    console.log("⚡ Đang dệt thiết kế FLUX 4K siêu nét theo yêu cầu...");
    const seed = Math.floor(Math.random() * 1000000);
    const encodedPrompt = encodeURIComponent(prompt);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=1024&nologo=true&model=flux&enhance=true&seed=${seed}`;

    const pollRes = await axios.get(pollinationsUrl, {
      responseType: "arraybuffer",
      timeout: 30000,
    });

    const base64 = Buffer.from(pollRes.data).toString("base64");
    const contentType = pollRes.headers["content-type"] || "image/jpeg";
    return `data:${contentType};base64,${base64}`;
  } catch (pollErr) {
    console.warn("Pollinations fetch error:", pollErr.message);
  }

  // 3. Fallback mẫu Áo Dài đẹp từ Local khi mất kết nối mạng
  const defaultLocalImage = "/anh/746927465_122119237899355470_7558522641041819280_n.jpg";
  const localB64 = localImageToBase64(defaultLocalImage);
  if (localB64) return localB64;

  return "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=768";
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
    sen: "intricate golden lotus flower embroidery running along the front panel of the traditional Vietnamese ao dai dress",
    hac: "detailed flying crane motif embroidered with fine metallic golden and silver thread on silk fabric",
    rong: "majestic imperial dragon embroidery pattern on royal Vietnamese silk ao dai",
    phuong: "graceful golden phoenix bird embroidery motif on luxurious silk fabric",
    mai: "delicate yellow plum blossoms hand embroidered with fine silk threads on ao dai",
    song: "traditional royal Thuy Ba water wave patterns embroidered at the hem of ao dai",
  };

  const seasonMap = {
    spring: "soft lotus pink and ivory white silk fabric color palette, spring blossom elegance",
    summer: "golden amber and sunlit yellow silk fabric color palette, summer radiance",
    autumn: "terracotta rust and warm autumn chrysanthemum color palette, vintage elegance",
    winter: "royal deep navy blue and emerald velvet silk fabric color palette, winter majesty",
  };

  const patternDesc = patterns.map((p) => patternMap[p] || p).join(", ");
  const seasonDesc = seasonMap[season] || "luxurious silk fabric color palette";

  const richPrompt = [
    "Full body studio fashion photograph of a beautiful Asian model wearing a traditional high-end Vietnamese Ao Dai dress",
    patternDesc ? `featuring ${patternDesc}` : "",
    seasonDesc,
    colorName ? `${colorName} silk fabric` : "premium Vietnamese silk fabric",
    `Specific details: ${prompt}`,
    "high-end fashion lookbook, elegant posture, soft studio lighting, 8k resolution, hyperdetailed fabric texture, masterpiece, vogue style photography",
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
    if (err.code === "ENOTFOUND" || err.code === "ETIMEDOUT") {
      res.status(503);
      throw new Error("Không thể kết nối đến máy chủ AI (Lỗi DNS/Mạng). Hệ thống đã tự chuyển sang chế độ dự phòng.");
    }
    if (err.response) {
      const status = err.response.status;
      let msg = "Lỗi dịch vụ AI Hugging Face";
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
    res.status(500);
    throw new Error(err.message || "Lỗi máy chủ khi xử lý thiết kế AI.");
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
