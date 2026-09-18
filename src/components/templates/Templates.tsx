import type { BillData, PaperSize } from '@/types/bill';
import { formatINR, formatNumber } from '@/utils/format';
import { calculateBill } from '@/utils/calculations';
import { formatDate, formatTime } from '@/utils/dates';

interface TemplateProps {
  data: BillData;
  paper: PaperSize;
}

function Logo({ data, size = 'h-14' }: { data: BillData; size?: string }) {
  if (data.restaurant.logo) {
    return <img src={data.restaurant.logo} alt="logo" className={`${size} w-auto object-contain`} />;
  }
  return null;
}

function OrderTypeBadge({ data }: { data: BillData }) {
  const labels: Record<string, string> = { 'dine-in': 'Dine In', takeaway: 'Takeaway', delivery: 'Delivery' };
  return <span className="inline-block rounded border border-gray-300 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-gray-600">{labels[data.invoice.orderType] || data.invoice.orderType}</span>;
}

function PaymentStatusBadge({ data }: { data: BillData }) {
  const colors: Record<string, string> = {
    paid: 'bg-green-50 text-green-700 border-green-200',
    pending: 'bg-red-50 text-red-700 border-red-200',
    partial: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  return <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide border ${colors[data.payment.status]}`}>{data.payment.status}</span>;
}

/* ───────────────────────────── Classic (A4) ───────────────────────────── */

export function ClassicTemplate({ data }: TemplateProps) {
  const calc = calculateBill(data);
  const r = data.restaurant;
  const isCgstSgst = data.tax.gstType === 'cgst-sgst';

  return (
    <div className="bg-white text-gray-900 p-8" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4">
        <div className="flex items-start gap-4">
          <Logo data={data} size="h-16" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{r.name || 'Your Restaurant'}</h1>
            <p className="text-xs text-gray-600 mt-1 max-w-xs">{r.address}{r.city && `, ${r.city}`}{r.state && `, ${r.state}`}{r.pin && ` - ${r.pin}`}</p>
            <p className="text-xs text-gray-600 mt-0.5">{r.phone}{r.email && `  |  ${r.email}`}</p>
            {r.gstin && <p className="text-xs text-gray-700 mt-0.5">GSTIN: {r.gstin}</p>}
            {r.fssai && <p className="text-xs text-gray-700">FSSAI: {r.fssai}</p>}
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold uppercase tracking-wider text-gray-800">Tax Invoice</h2>
          <p className="text-sm text-gray-700 mt-1">No: {data.invoice.number}</p>
          <p className="text-xs text-gray-600">{formatDate(data.invoice.date)}</p>
          <p className="text-xs text-gray-600">{formatTime(data.invoice.date)}</p>
          <div className="mt-1.5 flex justify-end gap-1.5">
            <OrderTypeBadge data={data} />
            <PaymentStatusBadge data={data} />
          </div>
        </div>
      </div>

      {/* Bill To + Order details */}
      <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
        <div className="border border-gray-200 rounded p-3">
          <p className="text-[10px] font-bold uppercase text-gray-500 mb-1.5">Bill To</p>
          <p className="text-sm font-semibold text-gray-900">{data.customer.name || 'Walk-in Customer'}</p>
          {data.customer.phone && <p className="text-xs text-gray-600">{data.customer.phone}</p>}
          {data.customer.email && <p className="text-xs text-gray-600">{data.customer.email}</p>}
          {data.customer.address && <p className="text-xs text-gray-600">{data.customer.address}</p>}
          {data.customer.gstin && <p className="text-xs text-gray-700 mt-0.5">GSTIN: {data.customer.gstin}</p>}
          {data.customer.placeOfSupply && <p className="text-xs text-gray-600">Place of Supply: {data.customer.placeOfSupply}</p>}
        </div>
        <div className="border border-gray-200 rounded p-3">
          <p className="text-[10px] font-bold uppercase text-gray-500 mb-1.5">Order Details</p>
          {data.invoice.tableNo && <p className="text-xs text-gray-700"><span className="text-gray-500">Table:</span> {data.invoice.tableNo}</p>}
          {data.invoice.tokenNo && <p className="text-xs text-gray-700"><span className="text-gray-500">Token:</span> {data.invoice.tokenNo}</p>}
          {data.invoice.cashier && <p className="text-xs text-gray-700"><span className="text-gray-500">Server:</span> {data.invoice.cashier}</p>}
          <p className="text-xs text-gray-700"><span className="text-gray-500">Items:</span> {calc.totalItems} ({calc.totalQty} qty)</p>
        </div>
      </div>

      {/* Items table */}
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="text-left py-2 px-2 font-semibold">#</th>
            <th className="text-left py-2 px-2 font-semibold">Item</th>
            <th className="text-center py-2 px-2 font-semibold">HSN</th>
            <th className="text-right py-2 px-2 font-semibold">Qty</th>
            <th className="text-right py-2 px-2 font-semibold">Rate</th>
            {data.items.some((it) => it.discount > 0) && <th className="text-right py-2 px-2 font-semibold">Disc</th>}
            <th className="text-center py-2 px-2 font-semibold">GST%</th>
            <th className="text-right py-2 px-2 font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.length === 0 && (
            <tr><td colSpan={8} className="text-center py-6 text-gray-400 italic border border-gray-200">No items added yet</td></tr>
          )}
          {data.items.map((item, idx) => (
            <tr key={item.id} className="border-b border-gray-100">
              <td className="py-1.5 px-2 text-gray-500">{idx + 1}</td>
              <td className="py-1.5 px-2 font-medium text-gray-900">{item.name || 'Untitled'}</td>
              <td className="py-1.5 px-2 text-center text-gray-600">{item.hsn || '—'}</td>
              <td className="py-1.5 px-2 text-right text-gray-700">{item.qty} {item.unit}</td>
              <td className="py-1.5 px-2 text-right text-gray-700">{formatNumber(item.rate)}</td>
              {data.items.some((it) => it.discount > 0) && <td className="py-1.5 px-2 text-right text-gray-700">{item.discount ? formatNumber(item.discount) : '—'}</td>}
              <td className="py-1.5 px-2 text-center text-gray-600">{item.taxPercent}%</td>
              <td className="py-1.5 px-2 text-right font-medium text-gray-900">{formatNumber(calc.itemAmounts[idx]?.amount ?? 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mt-4">
        <div className="w-72 text-xs">
          <div className="flex justify-between py-1.5 border-b border-gray-100"><span className="text-gray-600">Subtotal</span><span className="font-medium text-gray-900">{formatINR(calc.subtotal)}</span></div>
          {calc.billDiscount > 0 && <div className="flex justify-between py-1.5 border-b border-gray-100"><span className="text-gray-600">Discount{data.charges.discountType === 'percent' && ` (${data.charges.discountValue}%)`}</span><span className="font-medium text-green-700">- {formatINR(calc.billDiscount)}</span></div>}
          <div className="flex justify-between py-1.5 border-b border-gray-100"><span className="text-gray-600">Taxable Amount</span><span className="font-medium text-gray-900">{formatINR(calc.taxableAmount)}</span></div>
          {data.tax.mode === 'gst' && calc.totalGst > 0 && (
            isCgstSgst ? (
              <>
                <div className="flex justify-between py-1.5 border-b border-gray-100"><span className="text-gray-600">CGST ({calc.gstRate / 2}%)</span><span className="font-medium text-gray-900">{formatINR(calc.cgst)}</span></div>
                <div className="flex justify-between py-1.5 border-b border-gray-100"><span className="text-gray-600">SGST ({calc.gstRate / 2}%)</span><span className="font-medium text-gray-900">{formatINR(calc.sgst)}</span></div>
              </>
            ) : (
              <div className="flex justify-between py-1.5 border-b border-gray-100"><span className="text-gray-600">IGST ({calc.gstRate}%)</span><span className="font-medium text-gray-900">{formatINR(calc.igst)}</span></div>
            )
          )}
          {calc.serviceCharge > 0 && <div className="flex justify-between py-1.5 border-b border-gray-100"><span className="text-gray-600">Service Charge ({data.charges.serviceChargePercent}%)</span><span className="font-medium text-gray-900">{formatINR(calc.serviceCharge)}</span></div>}
          {calc.roundOff !== 0 && <div className="flex justify-between py-1.5 border-b border-gray-100"><span className="text-gray-600">Round Off</span><span className="font-medium text-gray-900">{calc.roundOff > 0 ? '+' : ''}{formatINR(calc.roundOff)}</span></div>}
          <div className="flex justify-between py-2.5 mt-1 bg-gray-800 text-white px-2 rounded">
            <span className="font-bold">Grand Total</span>
            <span className="font-bold text-base">{formatINR(calc.totalPayable)}</span>
          </div>
          <div className="flex justify-between py-1.5 mt-2"><span className="text-gray-600">Amount Paid</span><span className="font-medium text-gray-900">{formatINR(calc.amountPaid)}</span></div>
          {calc.balanceDue > 0 && <div className="flex justify-between py-1.5 border-t border-gray-200"><span className="font-semibold text-red-700">Balance Due</span><span className="font-bold text-red-700">{formatINR(calc.balanceDue)}</span></div>}
        </div>
      </div>

      {/* Payment info */}
      <div className="mt-4 text-xs text-gray-600 flex flex-wrap gap-x-6 gap-y-1">
        <span><strong className="text-gray-700">Payment:</strong> {data.payment.method.toUpperCase()}</span>
        {data.payment.transactionNo && <span><strong className="text-gray-700">Txn No:</strong> {data.payment.transactionNo}</span>}
        {r.upi && <span><strong className="text-gray-700">UPI:</strong> {r.upi}</span>}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        {(data.footer.notes || data.footer.terms) && (
          <div className="text-[10px] text-gray-500 mb-3 space-y-1">
            {data.footer.notes && <p><strong>Notes:</strong> {data.footer.notes}</p>}
            {data.footer.terms && <p><strong>Terms:</strong> {data.footer.terms}</p>}
          </div>
        )}
        <div className="flex justify-between items-end">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-800 italic">{data.footer.thankYou}</p>
          </div>
          <div className="text-center">
            {data.footer.signature && <img src={data.footer.signature} alt="signature" className="h-12 w-auto object-contain mx-auto mb-1" />}
            <div className="border-t border-gray-400 w-32 pt-1">
              <p className="text-[10px] text-gray-600">{data.footer.signatory || 'Authorized Signatory'}</p>
            </div>
          </div>
        </div>
        <p className="text-center text-[9px] text-gray-400 mt-4">This is a computer-generated invoice. GST fields are configurable invoice entries, not a verified legal GST document.</p>
      </div>
    </div>
  );
}

/* ───────────────────────────── Modern (A4) ───────────────────────────── */

export function ModernTemplate({ data }: TemplateProps) {
  const calc = calculateBill(data);
  const r = data.restaurant;
  const isCgstSgst = data.tax.gstType === 'cgst-sgst';

  return (
    <div className="bg-white text-gray-900" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header band */}
      <div className="bg-gray-900 text-white px-8 py-6 flex justify-between items-start">
        <div className="flex items-start gap-4">
          <Logo data={data} size="h-14" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">{r.name || 'Your Restaurant'}</h1>
            <p className="text-xs text-gray-300 mt-1 max-w-xs leading-relaxed">{r.address}{r.city && `, ${r.city}`}{r.state && `, ${r.state}`}{r.pin && ` - ${r.pin}`}</p>
            <p className="text-xs text-gray-300 mt-0.5">{r.phone}{r.email && `  ·  ${r.email}`}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-light uppercase tracking-[0.2em] text-orange-400">Invoice</h2>
          <p className="text-sm font-mono mt-1">{data.invoice.number}</p>
          <p className="text-xs text-gray-400 mt-0.5">{formatDate(data.invoice.date)} · {formatTime(data.invoice.date)}</p>
          <div className="mt-1.5 flex justify-end gap-1.5">
            <OrderTypeBadge data={data} />
            <PaymentStatusBadge data={data} />
          </div>
        </div>
      </div>

      {/* Tax IDs strip */}
      <div className="bg-gray-50 border-b border-gray-200 px-8 py-2.5 flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-gray-600">
        {r.gstin && <span>GSTIN: <strong className="text-gray-800">{r.gstin}</strong></span>}
        {r.fssai && <span>FSSAI: <strong className="text-gray-800">{r.fssai}</strong></span>}
        {r.upi && <span>UPI: <strong className="text-gray-800">{r.upi}</strong></span>}
      </div>

      {/* Bill to + Order details */}
      <div className="px-8 pt-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600 mb-1.5">Bill To</p>
          <p className="text-sm font-semibold text-gray-900">{data.customer.name || 'Walk-in Customer'}</p>
          {data.customer.phone && <p className="text-xs text-gray-600">{data.customer.phone}</p>}
          {data.customer.email && <p className="text-xs text-gray-600">{data.customer.email}</p>}
          {data.customer.address && <p className="text-xs text-gray-600">{data.customer.address}</p>}
          {data.customer.gstin && <p className="text-xs text-gray-700 mt-0.5">GSTIN: {data.customer.gstin}</p>}
          {data.customer.placeOfSupply && <p className="text-xs text-gray-600">Place of Supply: {data.customer.placeOfSupply}</p>}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600 mb-1.5">Order Details</p>
          {data.invoice.tableNo && <p className="text-xs text-gray-700"><span className="text-gray-400">Table</span> {data.invoice.tableNo}</p>}
          {data.invoice.tokenNo && <p className="text-xs text-gray-700"><span className="text-gray-400">Token</span> {data.invoice.tokenNo}</p>}
          {data.invoice.cashier && <p className="text-xs text-gray-700"><span className="text-gray-400">Server</span> {data.invoice.cashier}</p>}
          <p className="text-xs text-gray-700"><span className="text-gray-400">Items</span> {calc.totalItems} ({calc.totalQty} qty)</p>
        </div>
      </div>

      {/* Items */}
      <div className="px-8 mt-4">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="text-left py-2 font-semibold text-gray-700">Item</th>
              <th className="text-center py-2 font-semibold text-gray-700">HSN</th>
              <th className="text-right py-2 font-semibold text-gray-700">Qty</th>
              <th className="text-right py-2 font-semibold text-gray-700">Rate</th>
              {data.items.some((it) => it.discount > 0) && <th className="text-right py-2 font-semibold text-gray-700">Disc</th>}
              <th className="text-center py-2 font-semibold text-gray-700">GST</th>
              <th className="text-right py-2 font-semibold text-gray-700">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.length === 0 && (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">No items added yet</td></tr>
            )}
            {data.items.map((item, idx) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                <td className="py-2.5 px-1 font-medium text-gray-900">{item.name || 'Untitled'}<span className="text-gray-400 font-normal"> · {idx + 1}</span></td>
                <td className="py-2.5 text-center text-gray-500">{item.hsn || '—'}</td>
                <td className="py-2.5 text-right text-gray-700">{item.qty} {item.unit}</td>
                <td className="py-2.5 text-right text-gray-700">{formatNumber(item.rate)}</td>
                {data.items.some((it) => it.discount > 0) && <td className="py-2.5 text-right text-gray-700">{item.discount ? formatNumber(item.discount) : '—'}</td>}
                <td className="py-2.5 text-center text-gray-500">{item.taxPercent}%</td>
                <td className="py-2.5 text-right font-semibold text-gray-900">{formatNumber(calc.itemAmounts[idx]?.amount ?? 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="px-8 mt-4 flex justify-end">
        <div className="w-80 text-xs">
          <div className="flex justify-between py-1.5"><span className="text-gray-500">Subtotal</span><span className="font-medium text-gray-900">{formatINR(calc.subtotal)}</span></div>
          {calc.billDiscount > 0 && <div className="flex justify-between py-1.5"><span className="text-gray-500">Discount{data.charges.discountType === 'percent' && ` (${data.charges.discountValue}%)`}</span><span className="font-medium text-green-600">- {formatINR(calc.billDiscount)}</span></div>}
          <div className="flex justify-between py-1.5 border-t border-gray-100"><span className="text-gray-500">Taxable Amount</span><span className="font-medium text-gray-900">{formatINR(calc.taxableAmount)}</span></div>
          {data.tax.mode === 'gst' && calc.totalGst > 0 && (
            isCgstSgst ? (
              <>
                <div className="flex justify-between py-1.5"><span className="text-gray-500">CGST ({calc.gstRate / 2}%)</span><span className="font-medium text-gray-900">{formatINR(calc.cgst)}</span></div>
                <div className="flex justify-between py-1.5"><span className="text-gray-500">SGST ({calc.gstRate / 2}%)</span><span className="font-medium text-gray-900">{formatINR(calc.sgst)}</span></div>
              </>
            ) : (
              <div className="flex justify-between py-1.5"><span className="text-gray-500">IGST ({calc.gstRate}%)</span><span className="font-medium text-gray-900">{formatINR(calc.igst)}</span></div>
            )
          )}
          {calc.serviceCharge > 0 && <div className="flex justify-between py-1.5"><span className="text-gray-500">Service Charge ({data.charges.serviceChargePercent}%)</span><span className="font-medium text-gray-900">{formatINR(calc.serviceCharge)}</span></div>}
          {calc.roundOff !== 0 && <div className="flex justify-between py-1.5"><span className="text-gray-500">Round Off</span><span className="font-medium text-gray-900">{calc.roundOff > 0 ? '+' : ''}{formatINR(calc.roundOff)}</span></div>}
          <div className="flex justify-between py-3 mt-1 bg-gray-900 text-white px-3 rounded-lg">
            <span className="font-bold">Grand Total</span>
            <span className="font-bold text-base">{formatINR(calc.totalPayable)}</span>
          </div>
          <div className="flex justify-between py-1.5 mt-2"><span className="text-gray-500">Amount Paid</span><span className="font-medium text-gray-900">{formatINR(calc.amountPaid)}</span></div>
          {calc.balanceDue > 0 && <div className="flex justify-between py-2 border-t border-gray-200"><span className="font-bold text-red-600">Balance Due</span><span className="font-bold text-red-600">{formatINR(calc.balanceDue)}</span></div>}
        </div>
      </div>

      {/* Payment */}
      <div className="px-8 mt-4 text-xs text-gray-600 flex flex-wrap gap-x-6 gap-y-1">
        <span><strong className="text-gray-700">Payment:</strong> {data.payment.method.toUpperCase()}</span>
        {data.payment.transactionNo && <span><strong className="text-gray-700">Txn:</strong> {data.payment.transactionNo}</span>}
      </div>

      {/* Footer */}
      <div className="px-8 mt-8 pt-4 border-t border-gray-200 flex justify-between items-end">
        <div className="text-[10px] text-gray-500 max-w-xs space-y-1">
          {data.footer.notes && <p><strong>Notes:</strong> {data.footer.notes}</p>}
          {data.footer.terms && <p><strong>Terms:</strong> {data.footer.terms}</p>}
        </div>
        <div className="text-center">
          {data.footer.signature && <img src={data.footer.signature} alt="signature" className="h-12 w-auto object-contain mx-auto mb-1" />}
          <div className="border-t border-gray-300 w-32 pt-1">
            <p className="text-[10px] text-gray-500">{data.footer.signatory || 'Authorized Signatory'}</p>
          </div>
        </div>
      </div>
      <div className="px-8 pb-6 mt-3">
        <p className="text-center text-sm font-medium text-gray-700">{data.footer.thankYou}</p>
        <p className="text-center text-[9px] text-gray-400 mt-3">Computer-generated invoice · GST fields are configurable invoice entries, not a verified legal GST document.</p>
      </div>
    </div>
  );
}

/* ───────────────────────────── Thermal Receipt ───────────────────────────── */

export function ThermalTemplate({ data, paper }: TemplateProps) {
  const calc = calculateBill(data);
  const r = data.restaurant;
  const width = paper === '58mm' ? '58mm' : '80mm';
  const fontSize = paper === '58mm' ? '8px' : '10px';
  const isCgstSgst = data.tax.gstType === 'cgst-sgst';

  return (
    <div className="bg-white text-black mx-auto" style={{ width, fontFamily: 'Courier New, monospace', fontSize, padding: '4mm' }}>
      {/* Header */}
      <div className="text-center">
        {r.logo && <img src={r.logo} alt="logo" className="h-12 w-auto object-contain mx-auto mb-1" />}
        <p className="font-bold text-sm uppercase tracking-wide">{r.name || 'Your Restaurant'}</p>
        <p className="leading-tight">{r.address}{r.city && `, ${r.city}`}{r.state && `, ${r.state}`}{r.pin && ` - ${r.pin}`}</p>
        <p>{r.phone}</p>
        {r.gstin && <p>GSTIN: {r.gstin}</p>}
        {r.fssai && <p>FSSAI: {r.fssai}</p>}
      </div>

      <div className="border-t border-dashed border-gray-400 my-1.5" />

      {/* Invoice info */}
      <div className="flex justify-between">
        <span>No: {data.invoice.number}</span>
        <span>{formatDate(data.invoice.date)}</span>
      </div>
      <div className="flex justify-between">
        <span>{formatTime(data.invoice.date)}</span>
        <span className="uppercase">{data.invoice.orderType.replace('-', ' ')}</span>
      </div>
      {data.invoice.tableNo && <p>Table: {data.invoice.tableNo}  {data.invoice.tokenNo && `  Token: ${data.invoice.tokenNo}`}</p>}
      {data.invoice.cashier && <p>Server: {data.invoice.cashier}</p>}

      <div className="border-t border-dashed border-gray-400 my-1.5" />

      {/* Customer */}
      {(data.customer.name || data.customer.phone) && (
        <>
          <p className="font-bold">Bill To:</p>
          {data.customer.name && <p>{data.customer.name}</p>}
          {data.customer.phone && <p>{data.customer.phone}</p>}
          <div className="border-t border-dashed border-gray-400 my-1.5" />
        </>
      )}

      {/* Items */}
      <div className="flex justify-between font-bold border-b border-gray-400 pb-0.5">
        <span>Item</span>
        <span>Amount</span>
      </div>
      {data.items.length === 0 && <p className="text-center italic py-2">No items</p>}
      {data.items.map((item, idx) => (
        <div key={item.id} className="py-0.5">
          <div className="flex justify-between">
            <span className="truncate pr-1">{item.name || 'Untitled'}</span>
            <span className="whitespace-nowrap">{formatNumber(calc.itemAmounts[idx]?.amount ?? 0)}</span>
          </div>
          <div className="text-gray-500 flex justify-between" style={{ fontSize: paper === '58mm' ? '7px' : '8px' }}>
            <span>{item.qty} {item.unit} x {formatNumber(item.rate)}{item.discount ? ` - ${formatNumber(item.discount)}` : ''} {item.taxPercent ? `(${item.taxPercent}%)` : ''}</span>
          </div>
        </div>
      ))}

      <div className="border-t border-dashed border-gray-400 my-1.5" />

      {/* Totals */}
      <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(calc.subtotal)}</span></div>
      {calc.billDiscount > 0 && <div className="flex justify-between"><span>Discount{data.charges.discountType === 'percent' && ` (${data.charges.discountValue}%)`}</span><span>- {formatINR(calc.billDiscount)}</span></div>}
      {calc.serviceCharge > 0 && <div className="flex justify-between"><span>Svc Chg ({data.charges.serviceChargePercent}%)</span><span>{formatINR(calc.serviceCharge)}</span></div>}
      {data.tax.mode === 'gst' && calc.totalGst > 0 && (
        isCgstSgst ? (
          <>
            <div className="flex justify-between"><span>CGST ({calc.gstRate / 2}%)</span><span>{formatINR(calc.cgst)}</span></div>
            <div className="flex justify-between"><span>SGST ({calc.gstRate / 2}%)</span><span>{formatINR(calc.sgst)}</span></div>
          </>
        ) : (
          <div className="flex justify-between"><span>IGST ({calc.gstRate}%)</span><span>{formatINR(calc.igst)}</span></div>
        )
      )}
      {calc.roundOff !== 0 && <div className="flex justify-between"><span>Round Off</span><span>{calc.roundOff > 0 ? '+' : ''}{formatINR(calc.roundOff)}</span></div>}

      <div className="border-t border-gray-400 my-1" />
      <div className="flex justify-between font-bold text-sm">
        <span>TOTAL</span>
        <span>{formatINR(calc.totalPayable)}</span>
      </div>
      <div className="border-t border-dashed border-gray-400 my-1.5" />

      <div className="flex justify-between"><span>Paid ({data.payment.method.toUpperCase()})</span><span>{formatINR(calc.amountPaid)}</span></div>
      {calc.balanceDue > 0 && <div className="flex justify-between font-bold"><span>BALANCE DUE</span><span>{formatINR(calc.balanceDue)}</span></div>}
      {data.payment.transactionNo && <p>Txn: {data.payment.transactionNo}</p>}
      {r.upi && <p>UPI: {r.upi}</p>}

      <div className="border-t border-dashed border-gray-400 my-1.5" />

      {/* Footer */}
      {data.footer.notes && <p className="leading-tight">{data.footer.notes}</p>}
      {data.footer.terms && <p className="leading-tight text-gray-600">{data.footer.terms}</p>}
      <div className="border-t border-dashed border-gray-400 my-1.5" />
      <p className="text-center font-bold">{data.footer.thankYou}</p>
      {data.footer.signatory && <p className="text-center mt-1">{data.footer.signatory}</p>}
      <p className="text-center text-gray-500 mt-1.5" style={{ fontSize: paper === '58mm' ? '6px' : '7px' }}>Computer-generated · Configurable GST fields</p>
    </div>
  );
}
