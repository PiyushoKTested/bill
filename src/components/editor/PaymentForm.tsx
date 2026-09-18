import type { Payment, PaymentMethod, PaymentStatus } from '@/types/bill';
import { CreditCard } from 'lucide-react';
import { CollapsibleCard } from '../ui/CollapsibleCard';
import { Field, TextInput, Select } from '../ui/Field';
import { formatINR } from '@/utils/format';
import { grandTotal, balanceDue } from '@/utils/calculations';
import type { BillData } from '@/types/bill';

interface PaymentFormProps {
  value: Payment;
  data: BillData;
  onChange: (v: Payment) => void;
}

export function PaymentForm({ value, data, onChange }: PaymentFormProps) {
  const set = <K extends keyof Payment>(key: K, v: Payment[K]) => onChange({ ...value, [key]: v });
  const gt = grandTotal(data);
  const due = balanceDue({ ...data, payment: value });

  return (
    <CollapsibleCard title="Payment" icon={<CreditCard className="w-4 h-4" />} accent="text-emerald-600">
      <div className="space-y-3 mt-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Payment Method">
            <Select value={value.method} onChange={(e) => set('method', e.target.value as PaymentMethod)}>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="online">Online</option>
              <option value="credit">Credit</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <Field label="Status">
            <Select value={value.status} onChange={(e) => set('status', e.target.value as PaymentStatus)}>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="partial">Partially Paid</option>
            </Select>
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Amount Paid">
            <TextInput
              type="number"
              min={0}
              value={value.amountPaid}
              onChange={(e) => set('amountPaid', Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="0"
            />
          </Field>
          <Field label="Transaction / UTR No">
            <TextInput value={value.transactionNo} onChange={(e) => set('transactionNo', e.target.value)} placeholder="UPI-123456789" />
          </Field>
        </div>
        <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-xs space-y-1">
          <div className="flex justify-between"><span className="text-gray-500">Grand Total</span><span className="font-medium text-gray-800">{formatINR(gt)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Balance Due</span><span className={`font-bold ${due > 0 ? 'text-red-600' : 'text-green-600'}`}>{formatINR(due)}</span></div>
        </div>
      </div>
    </CollapsibleCard>
  );
}
