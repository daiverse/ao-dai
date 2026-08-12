/**
 * Dịch vụ Pollinations.ai Image Generation
 * Tốc độ cao, 100% Miễn phí, Không cần API key
 */

export const generatePollinationsTryOn = async ({
  product,
  modelName = "Thùy Trang",
  colorName = "",
  userUploadedImage = null,
}) => {
  const productName = product?.name || "Áo Dài Việt Nam";
  const fabric = product?.fabric || "Lụa gấm cao cấp";
  const colorDesc = colorName ? `in ${colorName} color` : "";

  // Tạo prompt chuyên sâu mô tả trang phục và người mẫu
  const promptText = `Full body fashion photography portrait of a beautiful Vietnamese female fashion model, wearing traditional Vietnamese Ao Dai dress named ${productName}, made of ${fabric} ${colorDesc}, luxury fashion editorial style, studio lighting, 8k resolution, ultra detailed photorealistic`;

  const encodedPrompt = encodeURIComponent(promptText);
  const seed = Math.floor(Math.random() * 1000000);
  
  // URL API Pollinations.ai sử dụng model Flux tiên tiến
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=600&height=800&seed=${seed}&nologo=true&model=flux`;

  // Preload ảnh để đảm bảo tải thành công trước khi hiển thị
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(imageUrl);
    img.onerror = () => {
      // Fallback ảnh sản phẩm nếu mất mạng
      resolve(product?.images?.[0] || imageUrl);
    };
    img.src = imageUrl;
  });
};
