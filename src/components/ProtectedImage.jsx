import React, { useState, useEffect } from 'react';
import { applyAutoWatermark } from '../utils/watermark';

export default function ProtectedImage({ 
  src, 
  alt = 'Protected Image', 
  className = '', 
  watermarkText = '03421189593',
  watermarkOpacity = 0.18,
  isPrivateOriginal = false,
  objectFit = 'contain'
}) {
  const [watermarkedSrc, setWatermarkedSrc] = useState(src);
  const isPdf = src && src.toLowerCase().includes('.pdf');

  useEffect(() => {
    if (src && !isPrivateOriginal && !isPdf) {
      applyAutoWatermark(src, watermarkText, watermarkOpacity).then((res) => {
        setWatermarkedSrc(res);
      }).catch(() => {
        setWatermarkedSrc(src);
      });
    } else {
      setWatermarkedSrc(src);
    }
  }, [src, watermarkText, watermarkOpacity, isPrivateOriginal, isPdf]);

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
      {isPdf ? (
        <iframe
          src={`${watermarkedSrc}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
          title={alt}
          className="w-full aspect-[1/1.414] max-h-[85vh] border-none bg-white"
          style={{ pointerEvents: isPrivateOriginal ? 'auto' : 'none' }}
        />
      ) : (
        <img
          src={watermarkedSrc}
          alt={alt}
          className={`w-full h-auto max-h-[80vh] ${fitClass} select-none pointer-events-auto`}
          onContextMenu={handlePrevent}
          onDragStart={handlePrevent}
        />
      )}
      
      {/* CSS Overlay Watermark Layer to Guarantee Watermark Text Visibility on Screenshots */}
      {!isPrivateOriginal && (
        <div 
          className="absolute inset-0 pointer-events-none flex flex-wrap items-center justify-around p-4 select-none z-10"
          style={{ transform: 'rotate(-20deg) scale(1.1)', opacity: watermarkOpacity * 1.5 }}
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
