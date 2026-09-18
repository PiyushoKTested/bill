import type { InvoiceMeta, OrderType } from '@/types/bill';
import { Receipt } from 'lucide-react';
import { CollapsibleCard } from '../ui/CollapsibleCard';
import { Field, TextInput, Segmented } from '../ui/Field';
import { formatDateTimeInput } from '@/utils/dates';

interface InvoiceFormProps {
  value: InvoiceMeta;
  onChange: (v: InvoiceMeta) => void;
}

export function InvoiceForm({ value, onChange }: InvoiceFormProps) {
  const set = <K extends keyof InvoiceMeta>(key: K, v: InvoiceMeta[K]) => onChange({ ...value, [key]: v });

  return (
    <CollapsibleCard title="Invoice Details" icon={<Receipt className="w-4 h-4" />} defaultOpen>
      <div className="space-y-3 mt-3">
        <Field label="Order Type">
          <Segmented<OrderType>
            value={value.orderType}
            onChange={(v) => set('orderType', v)}
            options={[
              { value: 'dine-in', label: 'Dine In' },
              { value: 'takeaway', label: 'Takeaway' },
              { value: 'delivery', label: 'Delivery' },
            ]}
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Invoice Number">
            <TextInput value={value.number} onChange={(e) => set('number', e.target.value)} />
          </Field>
          <Field label="Date & Time">
            <TextInput
              type="datetime-local"
              value={formatDateTimeInput(value.date)}
              onChange={(e) => set('date', new Date(e.target.value).toISOString())}
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Table Number"><TextInput value={value.tableNo} onChange={(e) => set('tableNo', e.target.value)} placeholder="T-07" /></Field>
          <Field label="Token / Order No"><TextInput value={value.tokenNo} onChange={(e) => set('tokenNo', e.target.value)} placeholder="TKN-1042" /></Field>
          <Field label="Cashier / Server"><TextInput value={value.cashier} onChange={(e) => set('cashier', e.target.value)} placeholder="Rahul Sharma" /></Field>
        </div>
      </div>
    </CollapsibleCard>
  );
}
