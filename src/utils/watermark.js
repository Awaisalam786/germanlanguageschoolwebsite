// AUTOMATED WATERMARK UTILITY ENGINE FOR GERMAN LANGUAGE SCHOOL
// Automatically tiles diagonal watermark "0342 1189593" (1-5 repeats) at 15-20% opacity

export function applyAutoWatermark(imageSrc, text = "0342 1189593", opacity = 0.18) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

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
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;

      // Calculate font size relative to image height
      const fontSize = Math.max(16, Math.min(width / 18, 36));
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;

      // Determine repeats count based on image dimensions
      let gridCols = 2;
      let gridRows = 2;

      if (width > 600 && height > 400) {
        gridCols = 3;
        gridRows = 3; // 4-5 repeats tiled across
      } else if (width < 300 || height < 300) {
        gridCols = 1;
        gridRows = 2; // 1-2 repeats for small images
      }

      // Rotate for diagonal placement
      ctx.translate(width / 2, height / 2);
      ctx.rotate((-25 * Math.PI) / 180);

      const stepX = width / gridCols;
      const stepY = height / gridRows;

      for (let x = -width; x < width * 1.5; x += stepX * 1.2) {
        for (let y = -height; y < height * 1.5; y += stepY * 1.2) {
          ctx.fillText(text, x, y);
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
  });
}
