import type { Charges } from '@/types/bill';
import { Percent, Tags } from 'lucide-react';
import { CollapsibleCard } from '../ui/CollapsibleCard';
import { Field, TextInput, Segmented } from '../ui/Field';

interface ChargesFormProps {
  value: Charges;
  onChange: (v: Charges) => void;
}

export function ChargesForm({ value, onChange }: ChargesFormProps) {
  const set = <K extends keyof Charges>(key: K, v: Charges[K]) => onChange({ ...value, [key]: v });

  return (
    <CollapsibleCard title="Charges & Discounts" icon={<Tags className="w-4 h-4" />} accent="text-purple-600">
      <div className="space-y-3 mt-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Discount Type">
            <Segmented<'percent' | 'fixed'>
              value={value.discountType}
              onChange={(v) => set('discountType', v)}
              size="sm"
              options={[
                { value: 'percent', label: '%', icon: <Percent className="w-3 h-3" /> },
                { value: 'fixed', label: '₹' },
              ]}
            />
          </Field>
          <Field label={value.discountType === 'percent' ? 'Discount %' : 'Discount Amount'}>
            <TextInput
              type="number"
              min={0}
              value={value.discountValue}
              onChange={(e) => set('discountValue', Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="0"
            />
          </Field>
        </div>
        <Field label="Service Charge (%)" hint="Optional — applied on taxable amount">
          <TextInput
            type="number"
            min={0}
            value={value.serviceChargePercent}
            onChange={(e) => set('serviceChargePercent', Math.max(0, parseFloat(e.target.value) || 0))}
            placeholder="0"
          />
        </Field>
      </div>
    </CollapsibleCard>
  );
}
