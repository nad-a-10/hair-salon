export type WeekdayMask = number;

export const SUNDAY_BIT = 1 << 0;
export const MONDAY_BIT = 1 << 1;
export const TUESDAY_BIT = 1 << 2;
export const WEDNESDAY_BIT = 1 << 3;
export const THURSDAY_BIT = 1 << 4;
export const FRIDAY_BIT = 1 << 5;
export const SATURDAY_BIT = 1 << 6;

export const MON_TO_SAT_MASK: WeekdayMask =
  MONDAY_BIT |
  TUESDAY_BIT |
  WEDNESDAY_BIT |
  THURSDAY_BIT |
  FRIDAY_BIT |
  SATURDAY_BIT;

export const ALL_WEEK_MASK: WeekdayMask = MON_TO_SAT_MASK | SUNDAY_BIT;

export function isOpenOn(mask: WeekdayMask, jsDayOfWeek: number): boolean {
  return (mask & (1 << jsDayOfWeek)) !== 0;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  blurb: string;
  sortOrder: number;
}

export interface Service {
  id: string;
  categoryId: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  durationMinutes: number;
  imageUrl: string | null;
  /** CSS object-position for the card image, when the default center crop is wrong. */
  imageObjectPosition?: string;
  weekdayMask: WeekdayMask;
  isActive: boolean;
  sortOrder: number;
}

export interface ServiceWithCategory extends Service {
  category: Category;
}
