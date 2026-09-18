export type PaperSize = 'a4' | '80mm' | '58mm';
export type TemplateId = 'classic' | 'modern' | 'thermal';
export type OrderType = 'dine-in' | 'takeaway' | 'delivery';
export type PaymentMethod = 'cash' | 'upi' | 'card' | 'online' | 'credit' | 'other';
export type PaymentStatus = 'paid' | 'pending' | 'partial';
export type TaxMode = 'none' | 'gst';
export type GstType = 'cgst-sgst' | 'igst';

export interface BillItem {
  id: string;
  name: string;
  hsn: string;
  qty: number;
  unit: string;
  rate: number;
  discount: number; // amount on this item
  taxPercent: number;
}

export interface Restaurant {
  name: string;
  logo: string; // base64 data URL or ''
  address: string;
  city: string;
  state: string;
  pin: string;
  phone: string;
  email: string;
  gstin: string;
  fssai: string;
  upi: string;
}

export interface InvoiceMeta {
  number: string;
  date: string; // ISO date string
  orderType: OrderType;
  tableNo: string;
  tokenNo: string;
  cashier: string;
}

export interface Customer {
  name: string;
  phone: string;
  email: string;
  address: string;
  gstin: string;
  placeOfSupply: string;
}

export interface Charges {
  discountType: 'percent' | 'fixed';
  discountValue: number;
  serviceChargePercent: number;
}

export interface TaxSettings {
  mode: TaxMode;
  gstType: GstType;
  rate: number; // 0, 5, 12, 18, or custom
  customRate: number;
}

export interface Payment {
  method: PaymentMethod;
  status: PaymentStatus;
  amountPaid: number;
  transactionNo: string;
}

export interface Footer {
  notes: string;
  terms: string;
  thankYou: string;
  signatory: string;
  signature: string; // base64 data URL
}

export interface BillData {
  restaurant: Restaurant;
  invoice: InvoiceMeta;
  customer: Customer;
  items: BillItem[];
  charges: Charges;
  tax: TaxSettings;
  payment: Payment;
  footer: Footer;
}

export interface Preferences {
  template: TemplateId;
  paperSize: PaperSize;
}
