import type { BillData, PaperSize, TemplateId } from '@/types/bill';
import { ClassicTemplate, ModernTemplate, ThermalTemplate } from './templates/Templates';

interface BillPreviewProps {
  data: BillData;
  template: TemplateId;
  paperSize: PaperSize;
}

export function BillPreview({ data, template, paperSize }: BillPreviewProps) {
  const renderTemplate = () => {
    if (template === 'thermal' || paperSize === '80mm' || paperSize === '58mm') {
      // For thermal paper sizes, always use thermal template
      const effectiveTemplate: TemplateId = (paperSize === '80mm' || paperSize === '58mm') ? 'thermal' : template;
      if (effectiveTemplate === 'thermal') {
        return <ThermalTemplate data={data} paper={paperSize} />;
      }
    }
    if (template === 'modern') return <ModernTemplate data={data} paper={paperSize} />;
    return <ClassicTemplate data={data} paper={paperSize} />;
  };

  return (
    <div className="bill-preview-container flex justify-center items-start py-6 px-4 bg-gray-100 min-h-full">
      <div className="bill-document shadow-lg bg-white" data-template={template} data-paper={paperSize}>
        {renderTemplate()}
      </div>
    </div>
  );
}
