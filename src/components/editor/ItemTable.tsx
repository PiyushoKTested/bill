import type { BillItem } from '@/types/bill';
import { Plus, Trash2, Copy, UtensilsCrossed } from 'lucide-react';
import { CollapsibleCard } from '../ui/CollapsibleCard';
import { TextInput, Select } from '../ui/Field';
import { formatINR } from '@/utils/format';
import { itemAmount } from '@/utils/calculations';

interface ItemTableProps {
  items: BillItem[];
  onChange: (items: BillItem[]) => void;
}

export function ItemTable({ items, onChange }: ItemTableProps) {
  const update = (id: string, patch: Partial<BillItem>) => {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };
  const remove = (id: string) => onChange(items.filter((it) => it.id !== id));
  const duplicate = (id: string) => {
    const item = items.find((it) => it.id === id);
    if (!item) return;
    const copy = { ...item, id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` };
    const idx = items.findIndex((it) => it.id === id);
    const next = [...items];
    next.splice(idx + 1, 0, copy);
    onChange(next);
  };

  return (
    <CollapsibleCard title={`Items${items.length > 0 ? ` (${items.length})` : ''}`} icon={<UtensilsCrossed className="w-4 h-4" />} accent="text-green-600" defaultOpen>
      <div className="mt-3 space-y-2">
        {items.length === 0 && (
          <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
            <p className="text-sm text-gray-400">No items yet</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add Item" to start building the bill</p>
          </div>
        )}
        {items.map((item, idx) => (
          <div key={item.id} className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Item {idx + 1}</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => duplicate(item.id)} className="p-1 text-gray-400 hover:text-blue-600 transition" title="Duplicate">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => remove(item.id)} className="p-1 text-gray-400 hover:text-red-600 transition" title="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-12 sm:col-span-5">
                <TextInput value={item.name} onChange={(e) => update(item.id, { name: e.target.value })} placeholder="Item name" />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <TextInput value={item.hsn} onChange={(e) => update(item.id, { hsn: e.target.value })} placeholder="HSN" />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <TextInput
                  type="number"
                  min={0}
                  value={item.qty}
                  onChange={(e) => update(item.id, { qty: Math.max(0, parseFloat(e.target.value) || 0) })}
                  placeholder="Qty"
                />
              </div>
              <div className="col-span-4 sm:col-span-3">
                <Select value={item.unit} onChange={(e) => update(item.id, { unit: e.target.value })}>
                  <option value="plate">plate</option>
                  <option value="pcs">pcs</option>
                  <option value="bowl">bowl</option>
                  <option value="cup">cup</option>
                  <option value="btl">bottle</option>
                  <option value="kg">kg</option>
                  <option value="gm">gm</option>
                  <option value="ltr">ltr</option>
                  <option value="ml">ml</option>
                  <option value="box">box</option>
                  <option value="pkt">packet</option>
                  <option value="combo">combo</option>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <span className="block text-[10px] text-gray-400 mb-0.5">Rate</span>
                <TextInput
                  type="number"
                  min={0}
                  value={item.rate}
                  onChange={(e) => update(item.id, { rate: Math.max(0, parseFloat(e.target.value) || 0) })}
                  placeholder="0"
                />
              </div>
              <div className="col-span-4">
                <span className="block text-[10px] text-gray-400 mb-0.5">Discount</span>
                <TextInput
                  type="number"
                  min={0}
                  value={item.discount}
                  onChange={(e) => update(item.id, { discount: Math.max(0, parseFloat(e.target.value) || 0) })}
                  placeholder="0"
                />
              </div>
              <div className="col-span-4">
                <span className="block text-[10px] text-gray-400 mb-0.5">Tax %</span>
                <TextInput
                  type="number"
                  min={0}
                  value={item.taxPercent}
                  onChange={(e) => update(item.id, { taxPercent: Math.max(0, parseFloat(e.target.value) || 0) })}
                  placeholder="5"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <span className="text-sm font-semibold text-gray-800">{formatINR(itemAmount(item))}</span>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, { id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: '', hsn: '', qty: 1, unit: 'plate', rate: 0, discount: 0, taxPercent: 5 }])}
          className="w-full rounded-lg border-2 border-dashed border-gray-300 py-2.5 text-sm font-medium text-gray-600 hover:border-orange-400 hover:text-orange-600 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>
    </CollapsibleCard>
  );
}
