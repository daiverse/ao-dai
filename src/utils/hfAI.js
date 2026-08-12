import { HfInference } from "@huggingface/inference";

// Token Hugging Face
const HF_TOKEN = "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";

// Singleton client
const hf = new HfInference(HF_TOKEN);

// ─────────────────────────────────────────────────────────────────────────────
// Thiết kế áo dài với FLUX.1-schnell
// ─────────────────────────────────────────────────────────────────────────────
export const generateAoDaiDesign = async ({ prompt, patterns = [], season = "spring", colorName = "" }) => {
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
    "Traditional Vietnamese ao dai dress, full body shot on fashion model",
    patternDesc ? `with intricate ${patternDesc}` : "",
    `${seasonDesc} color palette`,
    colorName ? `${colorName} fabric` : "luxurious silk fabric",
    prompt,
    "high-end fashion photography, studio lighting, 8k ultra detailed, Vietnamese traditional fashion, elegant premium",
  ]
    .filter(Boolean)
    .join(", ");

  // Gọi FLUX.1-schnell — trả về Blob
  const imageBlob = await hf.textToImage({
    model: "black-forest-labs/FLUX.1-schnell",
    inputs: richPrompt,
    parameters: {
      width: 512,
      height: 768,
      num_inference_steps: 4,
      guidance_scale: 0,
    },
  });

  // Chuyển Blob → Object URL để hiển thị trong <img>
  return URL.createObjectURL(imageBlob);
};

// ─────────────────────────────────────────────────────────────────────────────
// Thử đồ ảo với IDM-VTON (Gradio Spaces)
// ─────────────────────────────────────────────────────────────────────────────
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

    const sessionHash = `aodai_${Date.now()}`;
    const SPACE = "https://yisol-idm-vton.hf.space";

    // Bước 1: Đẩy vào queue
    const joinRes = await fetch(`${SPACE}/queue/join`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fn_index: 0,
        data: [
          { data: personB64, name: "person.jpg" },
          { data: garmentB64, name: "garment.jpg" },
          "upper_body",
          true,
          true,
          20,
          42,
        ],
        session_hash: sessionHash,
      }),
    });

    if (!joinRes.ok) return null;
    const { event_id } = await joinRes.json();

    // Bước 2: Poll kết quả với timeout 10 giây để trải nghiệm nhanh mượt
    const MAX_WAIT = 10_000;
    const POLL_MS = 2000;
    const start = Date.now();

    while (Date.now() - start < MAX_WAIT) {
      await new Promise((r) => setTimeout(r, POLL_MS));
      try {
        const statusRes = await fetch(`${SPACE}/queue/status?event_id=${event_id}`, {
          headers: { Authorization: `Bearer ${HF_TOKEN}` },
        });
        const statusData = await statusRes.json();

        if (statusData.status === "COMPLETE") {
          const outData = statusData.output?.data;
          if (outData?.[0]) {
            const img = outData[0];
            return typeof img === "string" ? img : img.data || img.url;
          }
        }
        if (statusData.status === "FAILED") return null;
      } catch (e) {
        // bỏ qua lỗi rải rác khi poll
      }
    }

    return null;
  } catch (err) {
    console.warn("Virtual try-on remote service error/timeout:", err);
    return null;
  }
};
