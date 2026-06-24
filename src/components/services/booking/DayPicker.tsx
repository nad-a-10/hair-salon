"use client";

import { addDays, format, isSameDay, startOfToday } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { isOpenOn, type WeekdayMask } from "@/types/catalog";

interface Props {
  weekdayMask: WeekdayMask;
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
  /**
   * Day-only mode: the set of bookable day keys (yyyy-MM-dd). When provided, a
   * day is enabled iff it's in this set (already accounts for closed/full/past).
   * When omitted (timed mode), openness falls back to the weekday mask.
   */
  availableDayKeys?: Set<string>;
}

const VISIBLE_DAYS = 14;

export function DayPicker({
  weekdayMask,
  selectedDate,
  onSelect,
  availableDayKeys,
}: Props) {
  // `startOfToday()` is timezone-dependent, so computing it during render
  // makes the server (UTC) and client (local) HTML disagree and triggers a
  // hydration mismatch. Resolve it on the client after mount instead.
  const [windowStart, setWindowStart] = useState<Date | null>(null);

  useEffect(() => {
    setWindowStart(startOfToday());
  }, []);

  function shift(by: number) {
    if (!windowStart) return;
    const next = addDays(windowStart, by);
    if (next < startOfToday() && by < 0) return;
    setWindowStart(next);
  }

  if (!windowStart) {
    return (
      <div>
        <div className="mb-4">
          <h3 className="font-display text-2xl text-charcoal">Pick a day</h3>
          <p className="mt-1 text-sm text-muted">
            Closed days for this service appear muted.
          </p>
        </div>
        <div
          className="grid grid-cols-3 gap-2 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-7"
          aria-hidden
        >
          {Array.from({ length: VISIBLE_DAYS }).map((_, i) => (
            <div
              key={i}
              className="h-19 animate-pulse rounded-2xl bg-line/40"
            />
          ))}
        </div>
      </div>
    );
  }

  const days = Array.from({ length: VISIBLE_DAYS }, (_, i) =>
    addDays(windowStart, i),
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-2xl text-charcoal">Pick a day</h3>
          <p className="mt-1 text-sm text-muted">
            Closed days for this service appear muted.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => shift(-VISIBLE_DAYS)}
            aria-label="Previous days"
            disabled={windowStart <= startOfToday()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line/70 text-charcoal transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => shift(VISIBLE_DAYS)}
            aria-label="Next days"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line/70 text-charcoal transition hover:bg-rose-50"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <div
        role="radiogroup"
        aria-label="Available days"
        className="grid grid-cols-3 gap-2 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-7"
      >
        {days.map((day) => {
          const open = availableDayKeys
            ? availableDayKeys.has(format(day, "yyyy-MM-dd"))
            : isOpenOn(weekdayMask, day.getDay());
          const selected = selectedDate ? isSameDay(day, selectedDate) : false;
          return (
            <button
              key={day.toISOString()}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={!open}
              onClick={() => open && onSelect(day)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-center transition sm:px-3",
                selected
                  ? "border-rose-500 bg-rose-500 text-white shadow-soft"
                  : open
                    ? "border-line/70 bg-ivory hover:border-rose-300 hover:bg-rose-50"
                    : "border-dashed border-line/60 bg-ivory/40 text-muted/60 cursor-not-allowed",
              )}
            >
              <span
                className={cn(
                  "text-[10px] uppercase tracking-[0.22em]",
                  selected ? "text-rose-50/85" : "text-muted",
                )}
              >
                {format(day, "EEE")}
              </span>
              <span
                className={cn(
                  "font-display text-2xl leading-none",
                  selected ? "text-white" : "text-charcoal",
                )}
              >
                {format(day, "d")}
              </span>
              <span
                className={cn(
                  "text-[10px] uppercase tracking-[0.22em]",
                  selected ? "text-rose-50/85" : "text-muted",
                )}
              >
                {format(day, "MMM")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
