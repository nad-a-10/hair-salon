import type { BookingTimeRange } from "@/types/booking";

export function rangesOverlap(
  a: BookingTimeRange,
  b: BookingTimeRange,
): boolean {
  return a.start < b.end && b.start < a.end;
}

export function findConflict(
  candidate: BookingTimeRange,
  existing: BookingTimeRange[],
): BookingTimeRange | null {
  for (const range of existing) {
    if (rangesOverlap(candidate, range)) return range;
  }
  return null;
}

export function countOverlaps(
  candidate: BookingTimeRange,
  existing: BookingTimeRange[],
): number {
  return existing.filter((range) => rangesOverlap(candidate, range)).length;
}
