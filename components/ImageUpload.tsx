import React, { useRef } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (base64: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelected(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div 
      className="w-full h-64 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center bg-slate-50 hover:bg-indigo-50 hover:border-indigo-400 transition-colors cursor-pointer group"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={inputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />
      <div className="p-4 rounded-full bg-white shadow-sm mb-4 group-hover:scale-110 transition-transform">
        <UploadCloud className="w-8 h-8 text-indigo-500" />
      </div>
      <p className="text-lg font-medium text-slate-700">Clicca o trascina l'immagine qui</p>
      <p className="text-sm text-slate-500 mt-1">Supporta JPG, PNG (Max 5MB)</p>
    </div>
  );
};

export default ImageUpload;