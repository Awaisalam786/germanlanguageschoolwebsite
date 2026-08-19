// AUTOMATED WATERMARK UTILITY ENGINE FOR GERMAN LANGUAGE SCHOOL
// Automatically tiles diagonal watermark "03421189593" (1-5 repeats) at 15-20% opacity

export function applyAutoWatermark(imageSrc, text = "03421189593", opacity = 0.18, color = "#FFFFFF") {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const width = img.width || 800;
      const height = img.height || 600;

      canvas.width = width;
      canvas.height = height;

      // Draw original image onto canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Watermark styling
      ctx.save();
      ctx.globalAlpha = opacity; // 18% opacity
      ctx.fillStyle = color;
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;

      // Calculate font size relative to image height
      const fontSize = Math.max(16, Math.min(width / 24, 48));
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;

      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;

      // Spacing between text repeats
      const stepX = textWidth + 80; // 80px gap horizontally
      const stepY = fontSize * 4;   // gap vertically

      // Rotate for diagonal placement
      ctx.translate(width / 2, height / 2);
      ctx.rotate((-35 * Math.PI) / 180);

      // Tile across a large area to cover rotation bounds (brick pattern)
      for (let x = -width * 2; x < width * 2; x += stepX) {
        let rowIndex = 0;
        for (let y = -height * 2; y < height * 2; y += stepY) {
          let offsetX = (rowIndex % 2 === 1) ? stepX / 2 : 0;
          ctx.fillText(text, x + offsetX, y);
          rowIndex++;
        }
      }

      ctx.restore();

      // Return generated watermarked image data URL
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };

    img.onerror = () => {
      // Fallback if image fails to load in canvas
      resolve(imageSrc);
    };
    
    img.src = imageSrc;
  });
}
