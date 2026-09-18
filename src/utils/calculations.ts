import type { BillItem, BillData, TaxSettings } from '@/types/bill';
import { roundTo2, clampNonNegative } from './format';

export function itemAmount(item: BillItem): number {
  const qty = clampNonNegative(item.qty);
  const rate = clampNonNegative(item.rate);
  const discount = clampNonNegative(item.discount);
  const gross = qty * rate;
  const net = Math.max(0, gross - discount);
  return roundTo2(net);
}

export function itemTax(item: BillItem): number {
  return roundTo2((itemAmount(item) * clampNonNegative(item.taxPercent)) / 100);
}

export function subtotal(items: BillItem[]): number {
  return roundTo2(items.reduce((sum, it) => sum + itemAmount(it), 0));
}

export function billDiscount(data: BillData): number {
  const sub = subtotal(data.items);
  const { discountType, discountValue } = data.charges;
  const val = clampNonNegative(discountValue);
  if (discountType === 'percent') {
    return roundTo2((sub * clampNonNegative(val)) / 100);
  }
  return roundTo2(Math.min(val, sub));
}

export function taxableAmount(data: BillData): number {
  return roundTo2(Math.max(0, subtotal(data.items) - billDiscount(data)));
}

export function effectiveGstRate(tax: TaxSettings): number {
  if (tax.mode === 'none') return 0;
  return tax.rate === -1 ? clampNonNegative(tax.customRate) : tax.rate;
}

export function totalGst(data: BillData): number {
  const rate = effectiveGstRate(data.tax);
  return roundTo2((taxableAmount(data) * rate) / 100);
}

export function cgst(data: BillData): number {
  if (data.tax.gstType !== 'cgst-sgst') return 0;
  return roundTo2(totalGst(data) / 2);
}

export function sgst(data: BillData): number {
  if (data.tax.gstType !== 'cgst-sgst') return 0;
  return roundTo2(totalGst(data) / 2);
}

export function igst(data: BillData): number {
  if (data.tax.gstType !== 'igst') return 0;
  return totalGst(data);
}

export function serviceCharge(data: BillData): number {
  const pct = clampNonNegative(data.charges.serviceChargePercent);
  return roundTo2((taxableAmount(data) * pct) / 100);
}

export function grandTotal(data: BillData): number {
  return roundTo2(taxableAmount(data) + totalGst(data) + serviceCharge(data));
}

export function balanceDue(data: BillData): number {
  const paid = clampNonNegative(data.payment.amountPaid);
  return roundTo2(Math.max(0, grandTotal(data) - paid));
}

export function totalItems(data: BillData): number {
  return data.items.reduce((sum, it) => sum + clampNonNegative(it.qty), 0);
}

export function roundGrandTotal(data: BillData): number {
  return Math.round(grandTotal(data));
}

export function roundOff(data: BillData): number {
  return roundTo2(roundGrandTotal(data) - grandTotal(data));
}

export interface BillCalc {
  itemAmounts: { amount: number; tax: number }[];
  subtotal: number;
  billDiscount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
  serviceCharge: number;
  grandTotal: number;
  roundOff: number;
  totalPayable: number;
  amountPaid: number;
  balanceDue: number;
  totalItems: number;
  totalQty: number;
  gstRate: number;
}

export function calculateBill(data: BillData): BillCalc {
  const itemAmounts = data.items.map((it) => ({
    amount: itemAmount(it),
    tax: itemTax(it),
  }));
  const gt = grandTotal(data);
  const rg = roundGrandTotal(data);
  return {
    itemAmounts,
    subtotal: subtotal(data.items),
    billDiscount: billDiscount(data),
    taxableAmount: taxableAmount(data),
    cgst: cgst(data),
    sgst: sgst(data),
    igst: igst(data),
    totalGst: totalGst(data),
    serviceCharge: serviceCharge(data),
    grandTotal: gt,
    roundOff: roundTo2(rg - gt),
    totalPayable: rg,
    amountPaid: clampNonNegative(data.payment.amountPaid),
    balanceDue: balanceDue(data),
    totalItems: data.items.length,
    totalQty: totalItems(data),
    gstRate: effectiveGstRate(data.tax),
  };
}
