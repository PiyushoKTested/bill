import type { TemplateId, PaperSize } from '@/types/bill';
import { FileText, Layout, Receipt } from 'lucide-react';
import { Segmented } from './ui/Field';

interface TemplateSelectorProps {
  template: TemplateId;
  paperSize: PaperSize;
  onTemplateChange: (t: TemplateId) => void;
  onPaperChange: (p: PaperSize) => void;
}

export function TemplateSelector({ template, paperSize, onTemplateChange, onPaperChange }: TemplateSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div>
        <span className="block text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">Template</span>
        <Segmented<TemplateId>
          value={template}
          onChange={onTemplateChange}
          size="sm"
          options={[
            { value: 'classic', label: 'Classic', icon: <FileText className="w-3.5 h-3.5" /> },
            { value: 'modern', label: 'Modern', icon: <Layout className="w-3.5 h-3.5" /> },
            { value: 'thermal', label: 'Thermal', icon: <Receipt className="w-3.5 h-3.5" /> },
          ]}
        />
      </div>
      <div>
        <span className="block text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">Paper</span>
        <Segmented<PaperSize>
          value={paperSize}
          onChange={onPaperChange}
          size="sm"
          options={[
            { value: 'a4', label: 'A4' },
            { value: '80mm', label: '80mm' },
            { value: '58mm', label: '58mm' },
          ]}
        />
      </div>
    </div>
  );
}
