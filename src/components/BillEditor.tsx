import { useCallback } from 'react';
import type { BillData } from '@/types/bill';
import { RestaurantForm } from './editor/RestaurantForm';
import { InvoiceForm } from './editor/InvoiceForm';
import { CustomerForm } from './editor/CustomerForm';
import { ItemTable } from './editor/ItemTable';
import { ChargesForm } from './editor/ChargesForm';
import { TaxSettingsForm } from './editor/TaxSettingsForm';
import { PaymentForm } from './editor/PaymentForm';
import { FooterForm } from './editor/FooterForm';

interface BillEditorProps {
  data: BillData;
  onChange: (data: BillData) => void;
}

export function BillEditor({ data, onChange }: BillEditorProps) {
  const update = useCallback(<K extends keyof BillData>(key: K, value: BillData[K]) => {
    onChange({ ...data, [key]: value });
  }, [data, onChange]);

  return (
    <div className="space-y-3">
      <RestaurantForm value={data.restaurant} onChange={(v) => update('restaurant', v)} />
      <InvoiceForm value={data.invoice} onChange={(v) => update('invoice', v)} />
      <CustomerForm value={data.customer} onChange={(v) => update('customer', v)} />
      <ItemTable items={data.items} onChange={(v) => update('items', v)} />
      <ChargesForm value={data.charges} onChange={(v) => update('charges', v)} />
      <TaxSettingsForm value={data.tax} onChange={(v) => update('tax', v)} />
      <PaymentForm value={data.payment} data={data} onChange={(v) => update('payment', v)} />
      <FooterForm value={data.footer} onChange={(v) => update('footer', v)} />
    </div>
  );
}
