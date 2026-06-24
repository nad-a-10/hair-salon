import { describe, expect, it } from "vitest";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { generateSlots, type SlotAvailability } from "@/lib/booking/slots";

const TZ = "Asia/Beirut";

// Clinic open 09:00–19:00 on 2026-05-04 (Monday), in Beirut wall time.
const open = fromZonedTime("2026-05-04T09:00:00", TZ);
const close = fromZonedTime("2026-05-04T19:00:00", TZ);

function hhmm(d: Date) {
  return formatInTimeZone(d, TZ, "HH:mm");
}

function times(slots: SlotAvailability[]) {
  return slots.map((s) => hhmm(s.start));
}

function availabilityAt(slots: SlotAvailability[], time: string) {
  return slots.find((s) => hhmm(s.start) === time)?.available;
}

describe("generateSlots", () => {
  it("returns no slots when duration is non-positive", () => {
    expect(
      generateSlots({
        open,
        close,
        serviceDurationMin: 0,
        granularityMin: 15,
        existingBookings: [],
      }),
    ).toEqual([]);
  });

  it("respects service duration so the last slot fits before close", () => {
    const slots = generateSlots({
      open,
      close,
      serviceDurationMin: 60,
      granularityMin: 30,
      existingBookings: [],
    });

    const t = times(slots);
    expect(t[0]).toBe("09:00");
    // 60-min service: last start that ends by 19:00 is 18:00.
    expect(t[t.length - 1]).toBe("18:00");
    // No bookings → everything available.
    expect(slots.every((s) => s.available)).toBe(true);
  });

  it("produces 15-minute granularity from open to last fit", () => {
    const slots = generateSlots({
      open,
      close,
      serviceDurationMin: 30,
      granularityMin: 15,
      existingBookings: [],
    });

    const t = times(slots);
    expect(t[0]).toBe("09:00");
    expect(t[t.length - 1]).toBe("18:30");
  });

  it("marks overlapping slots unavailable but still returns them", () => {
    const blocked = {
      start: fromZonedTime("2026-05-04T12:00:00", TZ),
      end: fromZonedTime("2026-05-04T13:30:00", TZ),
    };
    const slots = generateSlots({
      open,
      close,
      serviceDurationMin: 60,
      granularityMin: 30,
      existingBookings: [blocked],
    });

    // The slots are kept (for display) but flagged.
    expect(times(slots)).toContain("12:00");
    expect(availabilityAt(slots, "12:00")).toBe(false);
    // 11:30 + 60 = 12:30 still overlaps the blocked range.
    expect(availabilityAt(slots, "11:30")).toBe(false);
    // 13:30 + 60 = 14:30 is free.
    expect(availabilityAt(slots, "13:30")).toBe(true);
  });

  it("treats touching boundaries as available", () => {
    const blocked = {
      start: fromZonedTime("2026-05-04T11:00:00", TZ),
      end: fromZonedTime("2026-05-04T12:00:00", TZ),
    };
    const slots = generateSlots({
      open,
      close,
      serviceDurationMin: 60,
      granularityMin: 60,
      existingBookings: [blocked],
    });

    expect(availabilityAt(slots, "12:00")).toBe(true);
  });

  it("allows overlap up to capacity (nails-style pool)", () => {
    const a = {
      start: fromZonedTime("2026-05-04T12:00:00", TZ),
      end: fromZonedTime("2026-05-04T13:00:00", TZ),
    };
    // Capacity 2: a single existing booking should NOT block the 12:00 slot.
    const slots = generateSlots({
      open,
      close,
      serviceDurationMin: 60,
      granularityMin: 60,
      existingBookings: [a],
      capacity: 2,
    });

    expect(availabilityAt(slots, "12:00")).toBe(true);
  });
});
