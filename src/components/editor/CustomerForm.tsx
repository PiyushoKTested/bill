import type { Customer } from '@/types/bill';
import { User } from 'lucide-react';
import { CollapsibleCard } from '../ui/CollapsibleCard';
import { Field, TextInput } from '../ui/Field';

interface CustomerFormProps {
  value: Customer;
  onChange: (v: Customer) => void;
}

export function CustomerForm({ value, onChange }: CustomerFormProps) {
  const set = (key: keyof Customer, v: string) => onChange({ ...value, [key]: v });

  return (
    <CollapsibleCard title="Customer Details" icon={<User className="w-4 h-4" />} accent="text-blue-600">
      <div className="space-y-3 mt-3">
        <p className="text-xs text-gray-400">All fields optional — leave blank for walk-in customers.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Name"><TextInput value={value.name} onChange={(e) => set('name', e.target.value)} placeholder="Priya Iyer" /></Field>
          <Field label="Phone"><TextInput value={value.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" /></Field>
        </div>
        <Field label="Email"><TextInput type="email" value={value.email} onChange={(e) => set('email', e.target.value)} placeholder="priya@example.com" /></Field>
        <Field label="Address"><TextInput value={value.address} onChange={(e) => set('address', e.target.value)} placeholder="Customer address" /></Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Customer GSTIN"><TextInput value={value.gstin} onChange={(e) => set('gstin', e.target.value)} placeholder="Optional" /></Field>
          <Field label="Place of Supply"><TextInput value={value.placeOfSupply} onChange={(e) => set('placeOfSupply', e.target.value)} placeholder="Karnataka (29)" /></Field>
        </div>
      </div>
    </CollapsibleCard>
  );
}
