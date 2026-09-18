import { useState, useEffect, useCallback, useRef } from 'react';
import type { BillData, TemplateId, PaperSize } from '@/types/bill';
import { BillEditor } from '@/components/BillEditor';
import { BillPreview } from '@/components/BillPreview';
import { TemplateSelector } from '@/components/TemplateSelector';
import { calculateBill } from '@/utils/calculations';
import { formatINR } from '@/utils/format';
import {
  saveDraft, loadDraft, clearDraft,
  saveRestaurant, loadRestaurant,
  savePreferences, loadPreferences,
} from '@/utils/storage';
import { createEmptyBill, createSampleBill } from '@/utils/sampleData';
import {
  FilePlus, Save, FolderOpen, Sparkles, RotateCcw, Printer, Download,
  Pencil, Eye, Check, AlertCircle,
} from 'lucide-react';

type MobileTab = 'edit' | 'preview';

export function GeneratorPage() {
  const [data, setData] = useState<BillData>(() => loadDraft() ?? createEmptyBill());
  const [template, setTemplate] = useState<TemplateId>(() => loadPreferences()?.template ?? 'classic');
  const [paperSize, setPaperSize] = useState<PaperSize>(() => loadPreferences()?.paperSize ?? 'a4');
  const [mobileTab, setMobileTab] = useState<MobileTab>('edit');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const autoSaveTimer = useRef<number | undefined>(undefined);
  const printRef = useRef<HTMLDivElement>(null);

  // Auto-save draft
  useEffect(() => {
    if (autoSaveTimer.current) window.clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = window.setTimeout(() => {
      saveDraft(data);
    }, 800);
    return () => { if (autoSaveTimer.current) window.clearTimeout(autoSaveTimer.current); };
  }, [data]);

  // Save restaurant details when they change
  useEffect(() => {
    saveRestaurant(data.restaurant);
  }, [data.restaurant]);

  // Save preferences
  useEffect(() => {
    savePreferences({ template, paperSize });
  }, [template, paperSize]);

  // Auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => setToast({ msg, type });

  const handleNewBill = () => {
    const saved = loadRestaurant();
    const fresh = createEmptyBill();
    if (saved) fresh.restaurant = saved;
    if (!confirm('Start a new bill? Current bill will be cleared from the editor (saved drafts remain in storage).')) return;
    clearDraft();
    setData(fresh);
    showToast('New bill created');
  };

  const handleSaveDraft = () => {
    saveDraft(data);
    showToast('Draft saved');
  };

  const handleLoadDraft = () => {
    const draft = loadDraft();
    if (!draft) {
      showToast('No saved draft found', 'error');
      return;
    }
    setData(draft);
    showToast('Draft loaded');
  };

  const handleLoadSample = () => {
    setData(createSampleBill());
    showToast('Sample bill loaded');
  };

  const handleReset = () => {
    if (!confirm('Reset everything? This clears all fields and the saved draft.')) return;
    clearDraft();
    const saved = loadRestaurant();
    const fresh = createEmptyBill();
    if (saved) fresh.restaurant = saved;
    setData(fresh);
    showToast('Reset complete');
  };

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleDownloadPDF = useCallback(() => {
    // Use browser's print-to-PDF via the print dialog
    window.print();
  }, []);

  const calc = calculateBill(data);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top toolbar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm print:hidden">
        <div className="max-w-[1600px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-sm">B</div>
              <span className="font-bold text-gray-900 hidden sm:inline">BillBite</span>
            </a>
            <span className="text-xs text-gray-400 hidden md:inline">Generator</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button onClick={handleNewBill} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition">
              <FilePlus className="w-3.5 h-3.5" /> New
            </button>
            <button onClick={handleSaveDraft} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition">
              <Save className="w-3.5 h-3.5" /> Save
            </button>
            <button onClick={handleLoadDraft} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition">
              <FolderOpen className="w-3.5 h-3.5" /> Load
            </button>
            <button onClick={handleLoadSample} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition">
              <Sparkles className="w-3.5 h-3.5" /> Sample
            </button>
            <button onClick={handleReset} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <div className="w-px h-6 bg-gray-200 mx-0.5" />
            <button onClick={handlePrint} className="flex items-center gap-1.5 rounded-lg bg-gray-800 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-gray-900 transition">
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button onClick={handleDownloadPDF} className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-orange-700 transition">
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
          </div>
        </div>
      </div>

      {/* Mobile tab switcher */}
      <div className="lg:hidden sticky top-[49px] z-10 bg-white border-b border-gray-200 print:hidden">
        <div className="flex">
          <button
            onClick={() => setMobileTab('edit')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium border-b-2 transition ${mobileTab === 'edit' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500'}`}
          >
            <Pencil className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium border-b-2 transition ${mobileTab === 'preview' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500'}`}
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-[1600px] mx-auto lg:flex lg:gap-0 print:block">
        {/* Editor */}
        <div className={`lg:w-[45%] lg:flex-shrink-0 p-4 space-y-3 print:hidden ${mobileTab === 'edit' ? 'block' : 'hidden lg:block'}`}>
          {/* Summary strip */}
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Invoice</span>
              <span className="font-semibold text-gray-800 font-mono text-xs">{data.invoice.number}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Items</span>
              <span className="font-semibold text-gray-800">{calc.totalItems}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Total</span>
              <span className="font-bold text-orange-600">{formatINR(calc.totalPayable)}</span>
            </div>
            {calc.balanceDue > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Due</span>
                <span className="font-bold text-red-600">{formatINR(calc.balanceDue)}</span>
              </div>
            )}
          </div>

          <BillEditor data={data} onChange={setData} />
        </div>

        {/* Preview */}
        <div className={`lg:w-[55%] lg:flex-shrink-0 print:w-full ${mobileTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-[57px] z-10 bg-white/80 backdrop-blur border-b border-gray-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 print:hidden">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Live Preview</span>
            <TemplateSelector
              template={template}
              paperSize={paperSize}
              onTemplateChange={setTemplate}
              onPaperChange={setPaperSize}
            />
          </div>
          <div ref={printRef} className="print-area">
            <BillPreview data={data} template={template} paperSize={paperSize} />
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 print:hidden">
          <div className={`flex items-center gap-2 rounded-lg px-4 py-2.5 shadow-lg text-sm font-medium ${toast.type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-600 text-white'}`}>
            {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}
