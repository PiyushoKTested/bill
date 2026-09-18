import type { BillData, Preferences, Restaurant } from '@/types/bill';

const DRAFT_KEY = 'billbite_draft';
const RESTAURANT_KEY = 'billbite_restaurant';
const PREFS_KEY = 'billbite_prefs';
const COUNTER_KEY = 'billbite_counter';

export function saveDraft(data: BillData): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    // storage full or unavailable — silently ignore
  }
}

export function loadDraft(): BillData | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BillData;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}

export function saveRestaurant(r: Restaurant): void {
  try {
    localStorage.setItem(RESTAURANT_KEY, JSON.stringify(r));
  } catch {
    // ignore
  }
}

export function loadRestaurant(): Restaurant | null {
  try {
    const raw = localStorage.getItem(RESTAURANT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Restaurant;
  } catch {
    return null;
  }
}

export function savePreferences(p: Preferences): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

export function loadPreferences(): Preferences | null {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Preferences;
  } catch {
    return null;
  }
}

export function nextInvoiceNumber(): string {
  let counter = 1;
  try {
    const raw = localStorage.getItem(COUNTER_KEY);
    if (raw) counter = parseInt(raw, 10) || 1;
  } catch {
    // ignore
  }
  const num = counter;
  counter += 1;
  try {
    localStorage.setItem(COUNTER_KEY, String(counter));
  } catch {
    // ignore
  }
  const year = new Date().getFullYear();
  return `INV-${year}-${String(num).padStart(4, '0')}`;
}
