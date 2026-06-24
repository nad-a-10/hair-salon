import { describe, expect, it } from "vitest";
import { addDays } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { countOverlaps } from "@/lib/booking/conflicts";

// Day-only bookings are stored as full-day ranges, so the daily capacity is
// enforced by the same overlap counter used for timed slots: a day is full
// once `countOverlaps(candidate, existing) >= capacity` (capacity = 3 here).

const TZ = "Asia/Beirut";

function fullDay(dayKey: string) {
  const start = fromZonedTime(`${dayKey}T00:00:00`, TZ);
  return { start, end: addDays(start, 1) };
}

describe("day-only capacity", () => {
  it("treats all bookings on the same day as overlapping", () => {
    const day = "2026-07-01";
    const existing = [fullDay(day), fullDay(day), fullDay(day)];
    // The 4th booking on a capacity-3 day would be blocked.
    expect(countOverlaps(fullDay(day), existing)).toBe(3);
    expect(countOverlaps(fullDay(day), existing) >= 3).toBe(true);
  });

  it("allows a day that is under capacity", () => {
    const day = "2026-07-01";
    const existing = [fullDay(day)];
    expect(countOverlaps(fullDay(day), existing)).toBe(1);
    expect(countOverlaps(fullDay(day), existing) >= 3).toBe(false);
  });

  it("does not count bookings on a different day", () => {
    const existing = [fullDay("2026-07-02"), fullDay("2026-07-03")];
    expect(countOverlaps(fullDay("2026-07-01"), existing)).toBe(0);
  });
});
