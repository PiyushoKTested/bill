import type { Footer } from '@/types/bill';
import { FileSignature } from 'lucide-react';
import { CollapsibleCard } from '../ui/CollapsibleCard';
import { Field, TextInput, TextArea } from '../ui/Field';
import { LogoUploader } from '../ui/LogoUploader';

interface FooterFormProps {
  value: Footer;
  onChange: (v: Footer) => void;
}

export function FooterForm({ value, onChange }: FooterFormProps) {
  const set = (key: keyof Footer, v: string) => onChange({ ...value, [key]: v });

  return (
    <CollapsibleCard title="Footer & Notes" icon={<FileSignature className="w-4 h-4" />} accent="text-teal-600">
      <div className="space-y-3 mt-3">
        <Field label="Notes">
          <TextArea rows={2} value={value.notes} onChange={(e) => set('notes', e.target.value)} placeholder="All items freshly prepared..." />
        </Field>
        <Field label="Terms & Conditions">
          <TextArea rows={2} value={value.terms} onChange={(e) => set('terms', e.target.value)} placeholder="Goods once sold will not be exchanged..." />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
          <Field label="Thank You Message">
            <TextInput value={value.thankYou} onChange={(e) => set('thankYou', e.target.value)} placeholder="Thank you for dining with us!" />
          </Field>
          <Field label="Authorized Signatory">
            <TextInput value={value.signatory} onChange={(e) => set('signatory', e.target.value)} placeholder="Authorized Signatory" />
          </Field>
        </div>
        <LogoUploader value={value.signature} onChange={(v) => set('signature', v)} label="Signature Image" compact />
      </div>
    </CollapsibleCard>
  );
}
