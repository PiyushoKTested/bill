import type { Restaurant } from '@/types/bill';
import { Store } from 'lucide-react';
import { CollapsibleCard } from '../ui/CollapsibleCard';
import { Field, TextInput } from '../ui/Field';
import { LogoUploader } from '../ui/LogoUploader';

interface RestaurantFormProps {
  value: Restaurant;
  onChange: (v: Restaurant) => void;
}

export function RestaurantForm({ value, onChange }: RestaurantFormProps) {
  const set = (key: keyof Restaurant, v: string) => onChange({ ...value, [key]: v });

  return (
    <CollapsibleCard title="Restaurant Details" icon={<Store className="w-4 h-4" />} defaultOpen>
      <div className="space-y-3 mt-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
          <Field label="Restaurant Name">
            <TextInput value={value.name} onChange={(e) => set('name', e.target.value)} placeholder="Spice Garden Restaurant" />
          </Field>
          <LogoUploader value={value.logo} onChange={(v) => set('logo', v)} label="Logo" />
        </div>
        <Field label="Address">
          <TextInput value={value.address} onChange={(e) => set('address', e.target.value)} placeholder="Street address" />
        </Field>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Field label="City"><TextInput value={value.city} onChange={(e) => set('city', e.target.value)} placeholder="Bengaluru" /></Field>
          <Field label="State"><TextInput value={value.state} onChange={(e) => set('state', e.target.value)} placeholder="Karnataka" /></Field>
          <Field label="PIN"><TextInput value={value.pin} onChange={(e) => set('pin', e.target.value)} placeholder="560001" /></Field>
          <Field label="Phone"><TextInput value={value.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 80 1234 5678" /></Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Email"><TextInput type="email" value={value.email} onChange={(e) => set('email', e.target.value)} placeholder="hello@restaurant.in" /></Field>
          <Field label="GSTIN"><TextInput value={value.gstin} onChange={(e) => set('gstin', e.target.value)} placeholder="29ABCDE1234F1Z5" /></Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="FSSAI Number"><TextInput value={value.fssai} onChange={(e) => set('fssai', e.target.value)} placeholder="10020031001234" /></Field>
          <Field label="UPI ID"><TextInput value={value.upi} onChange={(e) => set('upi', e.target.value)} placeholder="restaurant@okaxis" /></Field>
        </div>
      </div>
    </CollapsibleCard>
  );
}
