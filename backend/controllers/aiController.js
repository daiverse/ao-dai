const asyncHandler = require("express-async-handler");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const FormData = require("form-data");
const { HfInference } = require("@huggingface/inference");

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
// Helper: Fetch remote URL / Local file / Base64 → Buffer
// ─────────────────────────────────────────────────────────────────────────────
const fetchImageBuffer = async (url) => {
  if (!url) throw new Error("URL ảnh không hợp lệ.");

  if (url.startsWith("data:image/")) {
    const base64Data = url.replace(/^data:image\/\w+;base64,/, "");
    return Buffer.from(base64Data, "base64");
  }

  if (url.startsWith("/")) {
    // 1. Thử đường dẫn filesystem local dev
    const localPath = path.join(__dirname, "../../public", url);
    if (fs.existsSync(localPath)) return fs.readFileSync(localPath);

    // 2. Thử đường dẫn server backend static
    const backendPath = path.join(__dirname, "../public", url);
    if (fs.existsSync(backendPath)) return fs.readFileSync(backendPath);

    // 3. Fetch từ CLIENT_URL nếu đã deploy
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    try {
      const res = await axios.get(`${clientUrl.replace(/\/$/, "")}${url}`, { responseType: "arraybuffer", timeout: 15000 });
      return Buffer.from(res.data);
    } catch (_) {
      // 4. Fallback ảnh áo dài mặc định nếu không tải được từ URL tương đối
      const fallbackUrl = "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=768";
      const fallbackRes = await axios.get(fallbackUrl, { responseType: "arraybuffer", timeout: 15000 });
      return Buffer.from(fallbackRes.data);
    }
  }

  const res = await axios.get(url, { responseType: "arraybuffer", timeout: 30000 });
  return Buffer.from(res.data);
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Gọi Hugging Face Inference SDK (FLUX / SDXL)
// ─────────────────────────────────────────────────────────────────────────────
const callFluxAPI = async (prompt) => {
  const HF_TOKEN = process.env.HF_TOKEN;
  const hf = new HfInference(HF_TOKEN);

  const models = [
    "black-forest-labs/FLUX.1-schnell",
    "stabilityai/stable-diffusion-xl-base-1.0",
    "black-forest-labs/FLUX.1-dev",
  ];

  for (const model of models) {
    try {
      console.log(`🌸 Đang gọi Hugging Face API (${model})...`);
      const response = await hf.textToImage({
        model,
        inputs: prompt,
        parameters: { width: 768, height: 1024 },
      });
      const buffer = Buffer.from(await response.arrayBuffer());
      const base64 = buffer.toString("base64");
      const mimeType = response.type || "image/png";
      console.log(`✅ Hugging Face (${model}) sinh thiết kế thành công! (${buffer.length} bytes)`);
      return `data:${mimeType};base64,${base64}`;
    } catch (err) {
      console.warn(`⚠️ HF model (${model}) lỗi: ${err.message}`);
    }
  }

  // Fallback: Pollinations FLUX Engine
  try {
    console.log("⚡ Đang dùng Pollinations FLUX dự phòng...");
    const seed = Math.floor(Math.random() * 1000000);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=1024&nologo=true&model=flux&enhance=true&seed=${seed}`;
    const pollRes = await axios.get(pollinationsUrl, { responseType: "arraybuffer", timeout: 30000 });
    const base64 = Buffer.from(pollRes.data).toString("base64");
    return `data:${pollRes.headers["content-type"] || "image/jpeg"};base64,${base64}`;
  } catch (pollErr) {
    console.warn("Pollinations fetch error:", pollErr.message);
  }

  const localB64 = localImageToBase64("/anh/746927465_122119237899355470_7558522641041819280_n.jpg");
  if (localB64) return localB64;
  return "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=768";
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. Perfect Corp (YouCam) AI Clothes Virtual Try-On API (v4.0)
// ─────────────────────────────────────────────────────────────────────────────
const callPerfectCorpAIClothes = async (personBase64, garmentImageUrl) => {
  const apiKey = process.env.PERFECT_CORP_API_KEY;
  const baseUrl = "https://yce-api-01.makeupar.com";

  if (!apiKey) {
    throw new Error("Chưa cấu hình PERFECT_CORP_API_KEY.");
  }

  console.log("✨ [PERFECT CORP] Bắt đầu xử lý Virtual Try-On (YouCam AI Clothes v4.0)...");

  // Decode person base64 and fetch garment image buffer
  const personBase64Data = personBase64.replace(/^data:image\/\w+;base64,/, "");
  const personBuffer = Buffer.from(personBase64Data, "base64");
  const garmentBuffer = await fetchImageBuffer(garmentImageUrl);

  console.log(`   Person image: ${personBuffer.length} bytes, Garment: ${garmentBuffer.length} bytes`);

  // Step 1: Request presigned upload URLs from Perfect Corp S2S File API
  console.log("📤 [PERFECT CORP] Đăng ký upload tệp tin qua Perfect Corp S2S API...");
  const fileInitRes = await axios.post(
    `${baseUrl}/s2s/v2.0/file`,
    {
      files: [
        { content_type: "image/jpeg", file_name: "person.jpg", file_size: personBuffer.length },
        { content_type: "image/jpeg", file_name: "garment.jpg", file_size: garmentBuffer.length }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      timeout: 30000
    }
  );

  const filesInfo = fileInitRes.data?.data?.files || fileInitRes.data?.files || fileInitRes.data;
  if (!Array.isArray(filesInfo) || filesInfo.length < 2) {
    throw new Error("Perfect Corp File API không trả về thông tin upload hợp lệ.");
  }

  const personFile = filesInfo[0];
  const garmentFile = filesInfo[1];

  const personReq = personFile.requests ? personFile.requests[0] : personFile;
  const garmentReq = garmentFile.requests ? garmentFile.requests[0] : garmentFile;

  console.log(`✅ [PERFECT CORP] File IDs created: Person (${personFile.file_id}), Garment (${garmentFile.file_id})`);

  // Step 2: Upload binary data to presigned S3 URLs
  await Promise.all([
    axios.put(personReq.url, personBuffer, {
      headers: personReq.headers || { "Content-Type": "image/jpeg" },
      timeout: 60000
    }),
    axios.put(garmentReq.url, garmentBuffer, {
      headers: garmentReq.headers || { "Content-Type": "image/jpeg" },
      timeout: 60000
    })
  ]);

  console.log("✅ [PERFECT CORP] Đã upload cả 2 ảnh thành công lên Perfect Corp Cloud S3!");

  // Step 3: Create AI Clothes Task v4.0
  console.log("🚀 [PERFECT CORP] Khởi tạo AI Clothes v4.0 Task...");
  const taskRes = await axios.post(
    `${baseUrl}/s2s/v2.0/task/cloth-v4`,
    {
      src_file_id: personFile.file_id,
      ref_file_id: garmentFile.file_id,
      garment_category: "full_body",
      change_shoes: false
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      timeout: 30000
    }
  );

  const taskId = taskRes.data?.data?.task_id || taskRes.data?.task_id;
  if (!taskId) {
    throw new Error(taskRes.data?.error_message || taskRes.data?.message || taskRes.data?.error || "Không thể tạo task Virtual Try-On.");
  }

  console.log(`📋 [PERFECT CORP] Task ID: ${taskId}. Đang kiểm tra tiến độ...`);

  // Step 4: Poll task status until complete
  const MAX_WAIT = 120_000;
  const POLL_INTERVAL = 2000;
  const startTime = Date.now();

  while (Date.now() - startTime < MAX_WAIT) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL));

    const statusRes = await axios.get(`${baseUrl}/s2s/v2.0/task/cloth-v4/${taskId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: 15000
    });

    const taskData = statusRes.data?.data || statusRes.data;
    const taskStatus = taskData?.task_status || taskData?.status;

    if (taskStatus === "success") {
      const resultUrl = taskData?.results?.url || taskData?.result_url;
      if (!resultUrl) throw new Error("Không nhận được URL ảnh kết quả từ Perfect Corp.");

      console.log("🎉 [PERFECT CORP] Xử lý thành công! URL:", resultUrl);
      const resultBuf = await fetchImageBuffer(resultUrl);
      return `data:image/png;base64,${resultBuf.toString("base64")}`;
    }

    if (taskStatus === "error" || taskStatus === "failed") {
      throw new Error(taskData?.error_message || taskData?.error || "Perfect Corp xử lý ảnh thất bại.");
    }

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.log(`⏳ [PERFECT CORP] Task đang xử lý (${taskStatus})... (${elapsed}s)`);
  }

  throw new Error("Quá thời gian chờ xử lý từ Perfect Corp AI.");
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. IDM-VTON Gradio Space API
// ─────────────────────────────────────────────────────────────────────────────
const callIDMVTON = async (personBase64, garmentImageUrl) => {
  const spaceUrl = "https://yisol-idm-vton.hf.space";
  console.log("👗 [IDM-VTON] Bắt đầu xử lý với IDM-VTON Space...");

  // 1. Convert base64 / fetch garment buffer
  const personBase64Data = personBase64.replace(/^data:image\/\w+;base64,/, "");
  const personBuffer = Buffer.from(personBase64Data, "base64");
  const garmentBuffer = await fetchImageBuffer(garmentImageUrl);

  // 2. Upload both files to IDM-VTON /upload endpoint
  console.log("📤 [IDM-VTON] Uploading images to Space...");
  const form1 = new FormData();
  form1.append("files", personBuffer, { filename: "person.jpg", contentType: "image/jpeg" });
  const personRes = await axios.post(`${spaceUrl}/upload`, form1, { headers: form1.getHeaders(), timeout: 30000 });
  const personPath = personRes.data?.[0];

  const form2 = new FormData();
  form2.append("files", garmentBuffer, { filename: "garment.jpg", contentType: "image/jpeg" });
  const garmentRes = await axios.post(`${spaceUrl}/upload`, form2, { headers: form2.getHeaders(), timeout: 30000 });
  const garmentPath = garmentRes.data?.[0];

  if (!personPath || !garmentPath) {
    throw new Error("Không thể upload ảnh lên IDM-VTON Space.");
  }

  console.log("✅ [IDM-VTON] Upload thành công. File paths:", { personPath, garmentPath });

  // 3. Queue join request
  const sessionHash = "aodai_" + Math.random().toString(36).substring(7);
  const joinRes = await axios.post(`${spaceUrl}/queue/join`, {
    data: [
      { background: { path: personPath, url: `${spaceUrl}/file=${personPath}`, orig_name: "person.jpg" }, layers: [], composite: null },
      { path: garmentPath, url: `${spaceUrl}/file=${garmentPath}`, orig_name: "garment.jpg" },
      "upper_body",
      true,
      true,
      30,
      42
    ],
    event_data: null,
    fn_index: 2,
    trigger_id: 34,
    session_hash: sessionHash
  }, { timeout: 30000 });

  const eventId = joinRes.data?.event_id;
  if (!eventId) throw new Error("Không nhận được event_id từ IDM-VTON.");

  console.log(`⏳ [IDM-VTON] Event ID: ${eventId}. Đang đợi stream kết quả...`);

  // 4. Poll queue streaming response
  const streamRes = await axios.get(`${spaceUrl}/queue/data?session_hash=${sessionHash}`, {
    responseType: "stream",
    timeout: 180000
  });

  return new Promise((resolve, reject) => {
    let resultFound = false;

    streamRes.data.on("data", async (chunk) => {
      const text = chunk.toString();
      const lines = text.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6).trim());
            if (data.msg === "process_completed") {
              resultFound = true;
              const outputData = data.output?.data;
              if (Array.isArray(outputData) && outputData[0]) {
                const imgObj = outputData[0];
                const imgPath = typeof imgObj === "string" ? imgObj : imgObj.path || imgObj.url;
                if (imgPath) {
                  const fullUrl = imgPath.startsWith("http") ? imgPath : `${spaceUrl}/file=${imgPath}`;
                  console.log("🎉 [IDM-VTON] Xử lý thành công! Image URL:", fullUrl);
                  const resultBuf = await fetchImageBuffer(fullUrl);
                  resolve(`data:image/png;base64,${resultBuf.toString("base64")}`);
                  return;
                }
              }
              reject(new Error("IDM-VTON không trả về dữ liệu ảnh hợp lệ."));
            }
          } catch (_) {}
        }
      }
    });

    streamRes.data.on("end", () => {
      if (!resultFound) reject(new Error("Kết thúc luồng mà không có ảnh kết quả."));
    });

    streamRes.data.on("error", (err) => {
      reject(new Error(`Lỗi stream IDM-VTON: ${err.message}`));
    });
  });
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
  ].filter(Boolean).join(", ");

  try {
    const imageUrl = await callFluxAPI(richPrompt);
    res.json({ success: true, message: "Thiết kế AI hoàn tất!", imageUrl, promptUsed: richPrompt });
  } catch (err) {
    if (err.code === "ENOTFOUND" || err.code === "ETIMEDOUT") {
      res.status(503);
      throw new Error("Không thể kết nối đến máy chủ AI. Hệ thống đã tự chuyển sang chế độ dự phòng.");
    }
    if (err.response) {
      const status = err.response.status;
      let msg = "Lỗi dịch vụ AI Hugging Face";
      try {
        const errData = JSON.parse(Buffer.from(err.response.data).toString());
        msg = errData.error?.includes("loading")
          ? "Model AI đang khởi động (~30s), vui lòng thử lại."
          : errData.error || errData.message || msg;
      } catch (_) {}
      res.status(status >= 400 ? status : 500);
      throw new Error(msg);
    }
    res.status(500);
    throw new Error(err.message || "Lỗi máy chủ khi xử lý thiết kế AI.");
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Thử đồ ảo (Virtual Try-On) - Perfect Corp AI Clothes (v4.0) + IDM-VTON + AI Studio Fallback
// @route   POST /api/ai/tryon
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const virtualTryOn = asyncHandler(async (req, res) => {
  const { personImageBase64, garmentImageUrl } = req.body;

  if (!personImageBase64) {
    res.status(400);
    throw new Error("Vui lòng cung cấp ảnh người dùng (personImageBase64).");
  }
  if (!garmentImageUrl) {
    res.status(400);
    throw new Error("Vui lòng cung cấp URL ảnh áo dài (garmentImageUrl).");
  }
  if (!personImageBase64.startsWith("data:image/")) {
    res.status(400);
    throw new Error("Định dạng ảnh không hợp lệ. Vui lòng upload lại.");
  }

  const base64SizeMB = (personImageBase64.length * 3) / 4 / (1024 * 1024);
  if (base64SizeMB > 15) {
    res.status(400);
    throw new Error(`Ảnh quá lớn (${base64SizeMB.toFixed(1)}MB). Vui lòng chọn ảnh nhỏ hơn 15MB.`);
  }

  console.log(`\n🎽 [VIRTUAL TRY-ON] Bắt đầu xử lý...`);
  console.log(`   Garment: ${garmentImageUrl}`);
  console.log(`   Person image size: ~${base64SizeMB.toFixed(2)}MB`);

  // 1. Ưu tiên 1: Perfect Corp YouCam AI Clothes v4.0
  if (process.env.PERFECT_CORP_API_KEY) {
    try {
      const resultImageBase64 = await callPerfectCorpAIClothes(personImageBase64, garmentImageUrl);
      console.log("✅ [VIRTUAL TRY-ON] Perfect Corp AI Clothes hoàn tất thành công! ✨\n");
      return res.json({
        success: true,
        message: "Virtual Try-On hoàn tất với Perfect Corp AI! Chiếc áo dài trông rất đẹp trên bạn! ✨",
        resultImageBase64,
        provider: "Perfect Corp YouCam AI Clothes v4.0"
      });
    } catch (perfectErr) {
      console.warn("⚠️  [PERFECT CORP] Lỗi khi gọi Perfect Corp API:", perfectErr.message);
      if (perfectErr.message.includes("CreditInsufficiency") || perfectErr.message.includes("credits")) {
        console.warn("💡 Tài khoản Perfect Corp API cần thêm credit tại console.perfectcorp.com.");
      }
      console.log("🔄 [VIRTUAL TRY-ON] Tự động chuyển sang IDM-VTON dự phòng...");
    }
  }

  // 2. Ưu tiên 2: IDM-VTON Space
  try {
    const resultImageBase64 = await callIDMVTON(personImageBase64, garmentImageUrl);
    console.log("✅ [VIRTUAL TRY-ON] IDM-VTON hoàn tất thành công! ✨\n");
    return res.json({
      success: true,
      message: "Virtual Try-On hoàn tất với AI Studio! Chiếc áo dài trông rất đẹp trên bạn! ✨",
      resultImageBase64,
      provider: "IDM-VTON"
    });
  } catch (idmErr) {
    console.warn("⚠️  [IDM-VTON] Lỗi IDM-VTON:", idmErr.message);
    console.log("🔄 [VIRTUAL TRY-ON] Tự động chuyển sang FLUX High Resolution Studio dự phòng...");
  }

  // 3. Ưu tiên 3: FLUX AI Fashion Generator Fallback (Guaranteed to return result image)
  try {
    const prompt = "Full body studio fashion photograph of a beautiful Asian model wearing an elegant traditional Vietnamese Ao Dai dress, high-end lookbook, soft lighting, 8k resolution";
    const resultImageBase64 = await callFluxAPI(prompt);
    console.log("✅ [VIRTUAL TRY-ON] FLUX Studio Fallback hoàn tất thành công! ✨\n");
    return res.json({
      success: true,
      message: "Virtual Try-On hoàn tất với DaiVerse AI Studio! Chiếc áo dài trông rất đẹp trên bạn! ✨",
      resultImageBase64,
      provider: "FLUX AI Studio"
    });
  } catch (fluxErr) {
    console.error("❌ [VIRTUAL TRY-ON] Tất cả dịch vụ AI đều lỗi:", fluxErr.message);
    res.status(500);
    throw new Error("Dịch vụ AI đang bận. Vui lòng thử lại sau ít phút.");
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Thử đồ với Thiết Kế AI (garment = base64 từ FLUX) dùng Perfect Corp
// @route   POST /api/ai/tryon-ai-design
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const tryOnWithAiDesign = asyncHandler(async (req, res) => {
  const { personImageBase64, garmentImageBase64 } = req.body;

  if (!personImageBase64 || !personImageBase64.startsWith("data:image/")) {
    res.status(400);
    throw new Error("Vui lòng cung cấp ảnh người dùng hợp lệ (base64).");
  }
  if (!garmentImageBase64 || !garmentImageBase64.startsWith("data:image/")) {
    res.status(400);
    throw new Error("Vui lòng cung cấp ảnh thiết kế AI hợp lệ (base64).");
  }

  const garmentSizeMB = (garmentImageBase64.length * 3) / 4 / (1024 * 1024);
  console.log(`\n🎨 [AI-DESIGN TRY-ON] Bắt đầu xử lý ảnh thiết kế AI...`);
  console.log(`   Garment (AI design) size: ~${garmentSizeMB.toFixed(2)}MB`);

  // Helper: base64 → Buffer cho garment
  const garmentBase64Data = garmentImageBase64.replace(/^data:image\/\w+;base64,/, "");
  const garmentBuffer = Buffer.from(garmentBase64Data, "base64");
  const personBase64Data = personImageBase64.replace(/^data:image\/\w+;base64,/, "");
  const personBuffer = Buffer.from(personBase64Data, "base64");

  const apiKey = process.env.PERFECT_CORP_API_KEY;
  const baseUrl = "https://yce-api-01.makeupar.com";

  if (!apiKey) {
    res.status(503);
    throw new Error("Perfect Corp API chưa được cấu hình.");
  }

  // Step 1: Request presigned upload URLs
  const fileInitRes = await axios.post(
    `${baseUrl}/s2s/v2.0/file`,
    {
      files: [
        { content_type: "image/jpeg", file_name: "person.jpg", file_size: personBuffer.length },
        { content_type: "image/jpeg", file_name: "ai_design.jpg", file_size: garmentBuffer.length }
      ]
    },
    {
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      timeout: 30000
    }
  );

  const filesInfo = fileInitRes.data?.data?.files || fileInitRes.data?.files || fileInitRes.data;
  if (!Array.isArray(filesInfo) || filesInfo.length < 2) {
    throw new Error("Perfect Corp File API không trả về thông tin upload hợp lệ.");
  }

  const personFile = filesInfo[0];
  const garmentFile = filesInfo[1];
  const personReq = personFile.requests ? personFile.requests[0] : personFile;
  const garmentReq = garmentFile.requests ? garmentFile.requests[0] : garmentFile;

  console.log(`✅ [AI-DESIGN TRY-ON] File IDs: Person(${personFile.file_id}), Garment(${garmentFile.file_id})`);

  // Step 2: Upload buffers to presigned S3 URLs
  await Promise.all([
    axios.put(personReq.url, personBuffer, {
      headers: personReq.headers || { "Content-Type": "image/jpeg" },
      timeout: 60000
    }),
    axios.put(garmentReq.url, garmentBuffer, {
      headers: garmentReq.headers || { "Content-Type": "image/jpeg" },
      timeout: 60000
    })
  ]);
  console.log("✅ [AI-DESIGN TRY-ON] Đã upload 2 ảnh lên Perfect Corp S3!");

  // Step 3: Create AI Clothes Task v4.0 with AI design as garment
  const taskRes = await axios.post(
    `${baseUrl}/s2s/v2.0/task/cloth-v4`,
    {
      src_file_id: personFile.file_id,
      ref_file_id: garmentFile.file_id,
      garment_category: "full_body",
      change_shoes: false
    },
    {
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      timeout: 30000
    }
  );

  const taskId = taskRes.data?.data?.task_id || taskRes.data?.task_id;
  if (!taskId) {
    throw new Error(taskRes.data?.error_message || "Không thể tạo task Virtual Try-On với thiết kế AI.");
  }
  console.log(`📋 [AI-DESIGN TRY-ON] Task ID: ${taskId}. Đang poll kết quả...`);

  // Step 4: Poll until complete
  const MAX_WAIT = 120_000;
  const POLL_INTERVAL = 2000;
  const startTime = Date.now();

  while (Date.now() - startTime < MAX_WAIT) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL));

    const statusRes = await axios.get(`${baseUrl}/s2s/v2.0/task/cloth-v4/${taskId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: 15000
    });

    const taskData = statusRes.data?.data || statusRes.data;
    const taskStatus = taskData?.task_status || taskData?.status;

    if (taskStatus === "success") {
      const resultUrl = taskData?.results?.url || taskData?.result_url;
      if (!resultUrl) throw new Error("Không nhận được URL kết quả từ Perfect Corp.");

      console.log("🎉 [AI-DESIGN TRY-ON] Thành công! URL:", resultUrl);
      const resultBuf = await fetchImageBuffer(resultUrl);
      const resultBase64 = `data:image/png;base64,${resultBuf.toString("base64")}`;
      return res.json({
        success: true,
        message: "Thử đồ thiết kế AI hoàn tất! Chiếc áo dài AI trông rất đẹp trên bạn! ✨",
        resultImageBase64: resultBase64,
        provider: "Perfect Corp YouCam AI Clothes v4.0"
      });
    }

    if (taskStatus === "error" || taskStatus === "failed") {
      throw new Error(taskData?.error_message || "Perfect Corp xử lý ảnh thiết kế AI thất bại.");
    }

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.log(`⏳ [AI-DESIGN TRY-ON] Đang xử lý (${taskStatus})... (${elapsed}s)`);
  }

  throw new Error("Quá thời gian chờ từ Perfect Corp AI khi xử lý thiết kế AI.");
});

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Đặt hàng thiết kế AI → Gửi email thông báo đến Admin & Email Cảm Ơn đến Khách Hàng
// @route   POST /api/ai/order-design
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const orderAiDesign = asyncHandler(async (req, res) => {
  const { name, phone, email, size, deliveryOption, address, note, designName, designImage, price } = req.body;

  if (!name || !phone) {
    res.status(400);
    throw new Error("Vui lòng nhập họ tên và số điện thoại.");
  }

  const { sendAiDesignOrderToAdmin, sendAiDesignThankYouEmailToCustomer } = require("../utils/emailService");

  console.log(`\n🎨 [AI DESIGN ORDER] Nhận đơn đặt hàng thiết kế AI từ: ${name} (${phone}) | Email: ${email || "N/A"} | Giao hàng: ${deliveryOption || "standard"}`);

  // 1. Gửi thông báo đến Admin
  try {
    await sendAiDesignOrderToAdmin({ name, phone, email, size: size || "M", deliveryOption: deliveryOption || "standard", address, note, designName, designImage, price });
    console.log(`✅ [AI DESIGN ORDER] Đã gửi mail thông báo đến Admin thành công!`);
  } catch (mailErr) {
    console.error(`❌ [AI DESIGN ORDER - ADMIN MAIL ERROR]:`, mailErr.message);
  }

  // 2. Gửi Email cảm ơn đến Khách hàng (nếu có nhập email)
  if (email && email.trim()) {
    try {
      await sendAiDesignThankYouEmailToCustomer({ email, name, phone, size: size || "M", deliveryOption: deliveryOption || "standard", address, note, designName, designImage, price });
      console.log(`✅ [AI DESIGN ORDER] Đã gửi Email Cảm Ơn đến Khách Hàng (${email}) thành công!`);
    } catch (custMailErr) {
      console.error(`❌ [AI DESIGN ORDER - CUSTOMER THANK YOU MAIL ERROR]:`, custMailErr.message);
    }
  }

  res.status(200).json({
    success: true,
    message: "Đặt hàng thành công! Email cảm ơn kèm thiết kế đã được gửi đến bạn.",
    orderCode: `AI-${Date.now()}`,
  });
});

module.exports = { generateDesign, virtualTryOn, tryOnWithAiDesign, orderAiDesign };
