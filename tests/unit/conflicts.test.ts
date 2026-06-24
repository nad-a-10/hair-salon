import { describe, expect, it } from "vitest";
import { findConflict, rangesOverlap } from "@/lib/booking/conflicts";

const r = (start: string, end: string) => ({
  start: new Date(start),
  end: new Date(end),
});

describe("rangesOverlap", () => {
  it("detects partial overlap on the left", () => {
    expect(
      rangesOverlap(
        r("2026-05-04T10:00", "2026-05-04T11:00"),
        r("2026-05-04T10:30", "2026-05-04T11:30"),
      ),
    ).toBe(true);
  });

  it("detects fully contained overlap", () => {
    expect(
      rangesOverlap(
        r("2026-05-04T10:00", "2026-05-04T12:00"),
        r("2026-05-04T10:30", "2026-05-04T11:30"),
      ),
    ).toBe(true);
  });

  it("treats touching edges as non-overlapping", () => {
    expect(
      rangesOverlap(
        r("2026-05-04T10:00", "2026-05-04T11:00"),
        r("2026-05-04T11:00", "2026-05-04T12:00"),
      ),
    ).toBe(false);
  });

  it("non-overlapping for separated ranges", () => {
    expect(
      rangesOverlap(
        r("2026-05-04T10:00", "2026-05-04T11:00"),
        r("2026-05-04T13:00", "2026-05-04T14:00"),
      ),
    ).toBe(false);
  });
});

describe("findConflict", () => {
  it("returns the first overlapping range", () => {
    const conflict = findConflict(
      r("2026-05-04T11:00", "2026-05-04T12:30"),
      [
        r("2026-05-04T09:00", "2026-05-04T10:00"),
        r("2026-05-04T12:00", "2026-05-04T13:00"),
      ],
    );
    expect(conflict).not.toBeNull();
    expect(conflict?.start.toISOString()).toBe(
      r("2026-05-04T12:00", "2026-05-04T13:00").start.toISOString(),
    );
  });

  it("returns null when nothing overlaps", () => {
    expect(
      findConflict(r("2026-05-04T11:00", "2026-05-04T12:00"), [
        r("2026-05-04T09:00", "2026-05-04T10:00"),
        r("2026-05-04T13:00", "2026-05-04T14:00"),
      ]),
    ).toBeNull();
  });
});
