import type { TaxSettings, TaxMode, GstType } from '@/types/bill';
import { Calculator } from 'lucide-react';
import { CollapsibleCard } from '../ui/CollapsibleCard';
import { Field, TextInput, Segmented } from '../ui/Field';

interface TaxSettingsFormProps {
  value: TaxSettings;
  onChange: (v: TaxSettings) => void;
}

const GST_RATES = [0, 5, 12, 18];

export function TaxSettingsForm({ value, onChange }: TaxSettingsFormProps) {
  const set = <K extends keyof TaxSettings>(key: K, v: TaxSettings[K]) => onChange({ ...value, [key]: v });

  return (
    <CollapsibleCard title="GST / Tax Settings" icon={<Calculator className="w-4 h-4" />} accent="text-indigo-600">
      <div className="space-y-3 mt-3">
        <Field label="Tax Mode">
          <Segmented<TaxMode>
            value={value.mode}
            onChange={(v) => set('mode', v)}
            options={[
              { value: 'none', label: 'No Tax' },
              { value: 'gst', label: 'GST' },
            ]}
          />
        </Field>

        {value.mode === 'gst' && (
          <>
            <Field label="GST Type">
              <Segmented<GstType>
                value={value.gstType}
                onChange={(v) => set('gstType', v)}
                options={[
                  { value: 'cgst-sgst', label: 'CGST + SGST' },
                  { value: 'igst', label: 'IGST' },
                ]}
              />
            </Field>
            <Field label="GST Rate">
              <div className="flex flex-wrap items-center gap-2">
                {GST_RATES.map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => set('rate', rate)}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                      value.rate === rate
                        ? 'border-orange-400 bg-orange-50 text-orange-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => set('rate', -1)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                    value.rate === -1
                      ? 'border-orange-400 bg-orange-50 text-orange-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Custom
                </button>
                {value.rate === -1 && (
                  <div className="flex items-center gap-1">
                    <TextInput
                      type="number"
                      min={0}
                      max={100}
                      value={value.customRate}
                      onChange={(e) => set('customRate', Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                      className="w-20"
                      placeholder="0"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                )}
              </div>
            </Field>
          </>
        )}

        <p className="text-xs text-gray-400">GST fields are configurable invoice entries. This tool does not verify GSTIN or ensure legal GST compliance.</p>
      </div>
    </CollapsibleCard>
  );
}
