import React, { useState, useRef, useEffect } from 'react';
import { X, Save, Sun, Contrast, Droplets, Type } from 'lucide-react';

export default function ImageEditorModal({ fileUrl, fileName, onSave, onClose }) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [sharpness, setSharpness] = useState(0); // 0 to 100
  
  const [loading, setLoading] = useState(false);

  // Load image once
  useEffect(() => {
    const img = new Image();
    img.src = fileUrl;
    img.onload = () => {
      imageRef.current = img;
      renderCanvas();
    };
  }, [fileUrl]);

  // Re-render canvas when settings change
  useEffect(() => {
    if (imageRef.current) {
      renderCanvas();
    }
  }, [brightness, contrast, saturation, sharpness]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    if (!img || !canvas || !ctx) return;

    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Apply basic CSS-like filters first
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Apply sharpness if needed (basic convolution matrix for sharpening)
    if (sharpness > 0) {
      applySharpen(ctx, canvas.width, canvas.height, sharpness / 100);
    }
  };

  const applySharpen = (ctx, w, h, mix) => {
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    const w4 = w * 4;
    const copy = new Uint8ClampedArray(data);
    
    // Simple 3x3 sharpen matrix
    const matrix = [
       0, -1,  0,
      -1,  5, -1,
       0, -1,  0
    ];

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = (y * w + x) * 4;
        
        for (let c = 0; c < 3; c++) {
          let val = 
            copy[i - w4 - 4 + c] * matrix[0] + copy[i - w4 + c] * matrix[1] + copy[i - w4 + 4 + c] * matrix[2] +
            copy[i - 4 + c] * matrix[3]      + copy[i + c] * matrix[4]      + copy[i + 4 + c] * matrix[5] +
            copy[i + w4 - 4 + c] * matrix[6] + copy[i + w4 + c] * matrix[7] + copy[i + w4 + 4 + c] * matrix[8];
            
          data[i + c] = data[i + c] * (1 - mix) + val * mix;
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const handleSave = () => {
    setLoading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Export at high quality
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const ext = 'jpg';
    onSave(dataUrl, ext);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 flex flex-col md:flex-row overflow-hidden backdrop-blur-xl">
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0">
        <div className="flex justify-between items-center p-4 border-b border-slate-800">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500" />
            Image Tune
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 transition">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
          {/* Brightness */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
              <span className="flex items-center gap-2"><Sun className="w-4 h-4 text-slate-400" /> Brightness</span>
              <span className="text-amber-500">{brightness}%</span>
            </div>
            <input 
              type="range" min="0" max="200" value={brightness} 
              onChange={e => setBrightness(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Contrast */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
              <span className="flex items-center gap-2"><Contrast className="w-4 h-4 text-slate-400" /> Contrast</span>
              <span className="text-amber-500">{contrast}%</span>
            </div>
            <input 
              type="range" min="0" max="200" value={contrast} 
              onChange={e => setContrast(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Saturation */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
              <span className="flex items-center gap-2"><Droplets className="w-4 h-4 text-slate-400" /> Saturation</span>
              <span className="text-amber-500">{saturation}%</span>
            </div>
            <input 
              type="range" min="0" max="200" value={saturation} 
              onChange={e => setSaturation(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Sharpness */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
              <span className="flex items-center gap-2"><Type className="w-4 h-4 text-slate-400" /> Text Sharpness</span>
              <span className="text-amber-500">{sharpness}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={sharpness} 
              onChange={e => setSharpness(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <p className="text-[10px] text-slate-500">Increases edge contrast to make scanned text easier to read.</p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
          >
            {loading ? <span className="animate-pulse">Processing...</span> : (
              <>
                <Save className="w-5 h-5" />
                Apply Changes & Save
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Main Canvas Area */}
      <div className="flex-1 relative bg-slate-950 flex items-center justify-center p-4 md:p-12 overflow-hidden">
        {/* Checkerboard background for transparency context if any */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <canvas 
          ref={canvasRef} 
          className="max-w-full max-h-full object-contain shadow-2xl rounded-sm ring-1 ring-white/10"
          style={{ transform: 'translateZ(0)' }} // Hardware accel
        />
      </div>
    </div>
  );
}
