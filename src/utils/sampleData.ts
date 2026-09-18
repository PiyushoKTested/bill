import type { BillData } from '@/types/bill';
import { nextInvoiceNumber } from './storage';

export function createEmptyBill(): BillData {
  const now = new Date();
  return {
    restaurant: {
      name: '',
      logo: '',
      address: '',
      city: '',
      state: '',
      pin: '',
      phone: '',
      email: '',
      gstin: '',
      fssai: '',
      upi: '',
    },
    invoice: {
      number: nextInvoiceNumber(),
      date: now.toISOString(),
      orderType: 'dine-in',
      tableNo: '',
      tokenNo: '',
      cashier: '',
    },
    customer: {
      name: '',
      phone: '',
      email: '',
      address: '',
      gstin: '',
      placeOfSupply: '',
    },
    items: [],
    charges: {
      discountType: 'percent',
      discountValue: 0,
      serviceChargePercent: 0,
    },
    tax: {
      mode: 'gst',
      gstType: 'cgst-sgst',
      rate: 5,
      customRate: 0,
    },
    payment: {
      method: 'cash',
      status: 'pending',
      amountPaid: 0,
      transactionNo: '',
    },
    footer: {
      notes: '',
      terms: '',
      thankYou: 'Thank you for dining with us!',
      signatory: '',
      signature: '',
    },
  };
}

export function createSampleBill(): BillData {
  const base = createEmptyBill();
  return {
    ...base,
    restaurant: {
      name: 'Spice Garden Restaurant',
      logo: '',
      address: '12 MG Road, Brigade Lane',
      city: 'Bengaluru',
      state: 'Karnataka',
      pin: '560001',
      phone: '+91 80 2234 5678',
      email: 'hello@spicegarden.in',
      gstin: '29ABCDE1234F1Z5',
      fssai: '10020031001234',
      upi: 'spicegarden@okaxis',
    },
    invoice: {
      ...base.invoice,
      number: nextInvoiceNumber(),
      orderType: 'dine-in',
      tableNo: 'T-07',
      tokenNo: 'TKN-1042',
      cashier: 'Rahul Sharma',
    },
    customer: {
      name: 'Priya Iyer',
      phone: '+91 98765 43210',
      email: 'priya.iyer@example.com',
      address: '45 Indiranagar, 2nd Stage',
      gstin: '',
      placeOfSupply: 'Karnataka (29)',
    },
    items: [
      { id: 's1', name: 'Paneer Butter Masala', hsn: '9963', qty: 1, unit: 'plate', rate: 280, discount: 0, taxPercent: 5 },
      { id: 's2', name: 'Butter Naan', hsn: '9963', qty: 4, unit: 'pcs', rate: 55, discount: 0, taxPercent: 5 },
      { id: 's3', name: 'Veg Biryani', hsn: '9963', qty: 2, unit: 'plate', rate: 220, discount: 20, taxPercent: 5 },
      { id: 's4', name: 'Gulab Jamun', hsn: '9963', qty: 2, unit: 'pcs', rate: 60, discount: 0, taxPercent: 5 },
      { id: 's5', name: 'Masala Chai', hsn: '9963', qty: 3, unit: 'cup', rate: 35, discount: 0, taxPercent: 5 },
      { id: 's6', name: 'Mineral Water (1L)', hsn: '2201', qty: 1, unit: 'btl', rate: 40, discount: 0, taxPercent: 5 },
    ],
    charges: {
      discountType: 'percent',
      discountValue: 5,
      serviceChargePercent: 10,
    },
    tax: {
      mode: 'gst',
      gstType: 'cgst-sgst',
      rate: 5,
      customRate: 0,
    },
    payment: {
      method: 'upi',
      status: 'paid',
      amountPaid: 1100,
      transactionNo: 'UPI-88421907365',
    },
    footer: {
      notes: 'All items are freshly prepared. Please consume within 2 hours.',
      terms: 'Goods once sold will not be exchanged. Subject to Bengaluru jurisdiction.',
      thankYou: 'Thank you for dining with us! Visit again 🌿',
      signatory: 'Authorized Signatory',
      signature: '',
    },
  };
}

export function newItem(): { id: string; name: string; hsn: string; qty: number; unit: string; rate: number; discount: number; taxPercent: number } {
  return {
    id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: '',
    hsn: '',
    qty: 1,
    unit: 'plate',
    rate: 0,
    discount: 0,
    taxPercent: 5,
  };
}
