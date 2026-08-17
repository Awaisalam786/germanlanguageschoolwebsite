import React from 'react';
import dynamic from 'next/dynamic';
import { X, Loader2 } from 'lucide-react';

const FilerobotImageEditor = dynamic(
  () => import('react-filerobot-image-editor'),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div> }
);

export default function ImageEditorModal({ fileUrl, fileName, onSave, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 flex flex-col">
      <div className="flex justify-between items-center p-4 bg-slate-900 border-b border-slate-800">
        <h3 className="text-white font-bold text-lg">Edit Certificate Image</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-2">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex-1 w-full h-full relative overflow-hidden bg-slate-950">
        <FilerobotImageEditor
          source={fileUrl}
          onSave={(editedImageObject, designState) => {
            // The edited image object contains the base64 or blob of the edited image
            // We want to pass the edited base64 back
            if (editedImageObject.imageBase64) {
               onSave(editedImageObject.imageBase64, editedImageObject.extension || 'png');
            }
          }}
          annotationsCommon={{
            fill: '#ff0000',
          }}
          Text={{ text: 'Filerobot...' }}
          Rotate={{ angle: 90, componentType: 'slider' }}
          tabsIds={[
            'Adjust',
            'Finetune',
            'Filters',
            'Watermark',
            'Annotate',
          ]}
          defaultTabId="Adjust"
          defaultToolId="Crop"
          theme={{
            palette: {
              'bg-primary': '#0f172a', // slate-900
              'bg-secondary': '#1e293b', // slate-800
              'txt-primary': '#f8fafc', // slate-50
              'txt-secondary': '#94a3b8', // slate-400
              'accent': '#f59e0b', // amber-500
              'accent-hover': '#fbbf24', // amber-400
            },
          }}
        />
      </div>
    </div>
  );
}
