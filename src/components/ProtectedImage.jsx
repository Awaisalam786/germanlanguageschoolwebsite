import React, { useState, useEffect } from 'react';
import { applyAutoWatermark } from '../utils/watermark';

export default function ProtectedImage({ 
  src, 
  alt = 'Protected Image', 
  className = '', 
  watermarkText = '03421189593',
  isPrivateOriginal = false,
  objectFit = 'contain'
}) {
  const [watermarkedSrc, setWatermarkedSrc] = useState(src);

  useEffect(() => {
    if (src && !isPrivateOriginal) {
      applyAutoWatermark(src, watermarkText, 0.18).then((res) => {
        setWatermarkedSrc(res);
      });
    } else {
      setWatermarkedSrc(src);
    }
  }, [src, watermarkText, isPrivateOriginal]);

  const handlePrevent = (e) => {
    e.preventDefault();
    return false;
  };

  const fitClass = objectFit === 'cover' ? 'object-cover' : 'object-contain';

  return (
    <div 
      className={`relative overflow-hidden select-none flex items-center justify-center bg-slate-950 ${className}`}
      onContextMenu={handlePrevent}
      onDragStart={handlePrevent}
    >
      <img
        src={watermarkedSrc}
        alt={alt}
        className={`w-full h-full ${fitClass} select-none pointer-events-auto`}
        onContextMenu={handlePrevent}
        onDragStart={handlePrevent}
      />
      
      {/* CSS Overlay Watermark Layer to Guarantee Watermark Text Visibility on Screenshots */}
      {!isPrivateOriginal && (
        <div 
          className="absolute inset-0 pointer-events-none flex flex-wrap items-center justify-around p-4 opacity-25 select-none"
          style={{ transform: 'rotate(-20deg) scale(1.1)' }}
        >
          <span className="text-white font-extrabold text-xs sm:text-sm drop-shadow-md tracking-wider">
            {watermarkText}
          </span>
          <span className="text-white font-extrabold text-xs sm:text-sm drop-shadow-md tracking-wider">
            {watermarkText}
          </span>
          <span className="text-white font-extrabold text-xs sm:text-sm drop-shadow-md tracking-wider hidden sm:inline">
            {watermarkText}
          </span>
        </div>
      )}
    </div>
  );
}
