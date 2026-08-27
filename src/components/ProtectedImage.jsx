import React, { useState, useEffect } from 'react';
import { applyAutoWatermark } from '../utils/watermark';

export default function ProtectedImage({ 
  src, 
  alt = 'Protected Image', 
  className = '', 
  watermarkText = '03421189593',
  watermarkOpacity = 0.18,
  watermarkColor = '#ffffff',
  isPrivateOriginal = false,
  objectFit = 'contain'
}) {
  const [watermarkedSrc, setWatermarkedSrc] = useState(src);
  const isPdf = src && src.toLowerCase().includes('.pdf');

  useEffect(() => {
    if (src && !isPrivateOriginal && !isPdf) {
      applyAutoWatermark(src, watermarkText, watermarkOpacity, watermarkColor).then((res) => {
        setWatermarkedSrc(res);
      }).catch(() => {
        setWatermarkedSrc(src);
      });
    } else {
      setWatermarkedSrc(src);
    }
  }, [src, watermarkText, watermarkOpacity, watermarkColor, isPrivateOriginal, isPdf]);

  const handlePrevent = (e) => {
    e.preventDefault();
    return false;
  };

  const fitClass = objectFit === 'cover' ? 'object-cover' : 'object-contain';

  const getSvgWatermarkUrl = () => {
    // Generate a reliable brick-pattern SVG watermark for dense overlay
    const svg = `
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="wm" x="0" y="0" width="450" height="150" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
            <text x="50%" y="30%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="22" fill="${watermarkColor}" opacity="${watermarkOpacity}">
              ${watermarkText}
            </text>
            <text x="0%" y="80%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="22" fill="${watermarkColor}" opacity="${watermarkOpacity}">
              ${watermarkText}
            </text>
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#wm)" />
      </svg>
    `;
    return `url('data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}')`;
  };

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
          className="w-full aspect-[1/1.414] border-none bg-white"
          style={{ pointerEvents: isPrivateOriginal ? 'auto' : 'none' }}
        />
      ) : (
        <img
          src={watermarkedSrc}
          alt={alt}
          className={`w-full h-auto ${fitClass} select-none pointer-events-auto`}
          onContextMenu={handlePrevent}
          onDragStart={handlePrevent}
        />
      )}
      
      {/* Dense SVG Pattern Overlay */}
      {!isPrivateOriginal && (
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{ backgroundImage: getSvgWatermarkUrl() }}
        />
      )}
    </div>
  );
}
