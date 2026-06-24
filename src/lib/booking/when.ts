import { formatInTimeZone } from "date-fns-tz";
import { siteConfig } from "@/config/site";

/** True when the studio books by day only (no time-of-day selection). */
export const isDayMode = siteConfig.bookingMode === "day";

export function formatBookingDate(
  iso: string,
  pattern = "EEEE, MMMM d, yyyy",
): string {
  return formatInTimeZone(new Date(iso), siteConfig.timeZone, pattern);
}

export function formatBookingTime(iso: string): string {
  return formatInTimeZone(new Date(iso), siteConfig.timeZone, "h:mm a");
}
