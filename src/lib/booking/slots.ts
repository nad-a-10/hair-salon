import { addMinutes } from "date-fns";
import type { BookingTimeRange } from "@/types/booking";

export interface GenerateSlotsArgs {
  /** First bookable instant of the day (clinic open time, as a UTC instant). */
  open: Date;
  /** Closing instant of the day (a slot must end at or before this). */
  close: Date;
  serviceDurationMin: number;
  granularityMin: number;
  existingBookings: BookingTimeRange[];
  /**
   * How many bookings may overlap a slot before it's full. Defaults to 1
   * (single room). Pools like nails pass a higher capacity.
   */
  capacity?: number;
}

export interface SlotAvailability {
  start: Date;
  /** False when booking this slot would exceed the pool's capacity. */
  available: boolean;
}

function rangesOverlap(a: BookingTimeRange, b: BookingTimeRange): boolean {
  return a.start < b.end && b.start < a.end;
}

/**
 * Every start time in the day's open window (open → last slot that still ends
 * by close), each flagged available/unavailable. Unavailable slots are kept so
 * the UI can show them disabled rather than dropping them silently.
 */
export function generateSlots(args: GenerateSlotsArgs): SlotAvailability[] {
  const {
    open,
    close,
    serviceDurationMin,
    granularityMin,
    existingBookings,
    capacity = 1,
  } = args;

  if (granularityMin <= 0) return [];
  if (serviceDurationMin <= 0) return [];
  if (capacity <= 0) return [];

  const lastValidStart = addMinutes(close, -serviceDurationMin).getTime();

  const slots: SlotAvailability[] = [];
  let cursor = open;

  while (cursor.getTime() <= lastValidStart) {
    const candidate: BookingTimeRange = {
      start: cursor,
      end: addMinutes(cursor, serviceDurationMin),
    };

    const overlaps = existingBookings.filter((b) =>
      rangesOverlap(candidate, b),
    ).length;
    slots.push({ start: cursor, available: overlaps < capacity });

    cursor = addMinutes(cursor, granularityMin);
  }

  return slots;
}

export function parseHHMM(value: string): number {
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) {
    throw new Error(`Invalid HH:MM string: ${value}`);
  }
  return h * 60 + m;
}
