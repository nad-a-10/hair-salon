import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  cents: number,
  currency: string = "USD",
  locale: string = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

/**
 * A single price ("$80") or a range ("$80–$100") when maxCents is given and
 * exceeds the base price. Used wherever a service price is shown to customers.
 */
export function formatPrice(
  cents: number,
  maxCents?: number,
  currency: string = "USD",
  locale: string = "en-US",
): string {
  const base = formatCurrency(cents, currency, locale);
  if (maxCents != null && maxCents > cents) {
    return `${base}–${formatCurrency(maxCents, currency, locale)}`;
  }
  return base;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}
