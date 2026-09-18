export function formatINR(amount: number): string {
  const rounded = roundTo2(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rounded);
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundTo2(amount));
}

export function roundTo2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function clampNonNegative(n: number): number {
  if (isNaN(n) || n < 0) return 0;
  return n;
}
