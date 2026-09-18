import { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface LogoUploaderProps {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
  compact?: boolean;
}

export function LogoUploader({ value, onChange, label = 'Logo', compact = false }: LogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 500_000) {
      alert('Please choose an image under 500KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {value ? (
          <>
            <img src={value} alt="logo" className="h-12 w-12 rounded-lg object-cover border border-gray-200" />
            <button type="button" onClick={() => onChange('')} className="text-gray-400 hover:text-red-500 transition">
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs text-gray-500 hover:border-orange-400 hover:text-orange-600 transition"
          >
            <Upload className="w-3.5 h-3.5" /> Upload
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>
    );
  }

  return (
    <div>
      <span className="block text-xs font-medium text-gray-600 mb-1">{label}</span>
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
          {value ? (
            <img src={value} alt="logo" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-gray-300" />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" /> {value ? 'Change' : 'Upload'}
          </button>
          {value && (
            <button type="button" onClick={() => onChange('')} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
              <X className="w-3 h-3" /> Remove
            </button>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>
    </div>
  );
}
