"use server";

import { addDays, addMinutes } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { findServiceBySlug } from "@/data/catalog";
import { isSupabaseConfigured } from "@/config/env";
import { siteConfig } from "@/config/site";
import { generateSlots } from "@/lib/booking/slots";
import { countOverlaps } from "@/lib/booking/conflicts";
import { poolForCategoryId, poolForServiceId } from "@/lib/booking/resources";
import { isOwnerAuthed, signInOwner } from "@/lib/booking/owner-auth";
import { bookingFormSchema } from "@/lib/booking/schema";
import { getNotifier } from "@/lib/booking/notifier";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import type {
  BookingStatus,
  BookingTimeRange,
  BookingWithService,
} from "@/types/booking";
import { isOpenOn } from "@/types/catalog";

const DEFAULT_GRANULARITY = 15;
const CLINIC_TZ = siteConfig.timeZone;
const BOOKING_MODE = siteConfig.bookingMode;
const DAY_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

const CLINIC_HOURS_HHMM: Record<number, [string, string] | null> = {
  0: null,
  1: ["09:00", "19:00"],
  2: ["09:00", "19:00"],
  3: ["09:00", "19:00"],
  4: ["09:00", "19:00"],
  5: ["09:00", "19:00"],
  6: ["09:00", "19:00"],
};

const SUNDAY_HOURS_HHMM: [string, string] = ["11:00", "17:00"];

/**
 * Open/close instants for a clinic calendar day (yyyy-MM-dd), anchored to the
 * clinic timezone so a "09:00" open is 09:00 in Beirut, not on the server.
 */
function clinicHoursForDay(
  dayKey: string,
  weekdayMask: number,
): { open: Date; close: Date } | null {
  // Day-of-week of the calendar date itself (noon UTC avoids tz edge shifts).
  const dow = new Date(`${dayKey}T12:00:00Z`).getUTCDay();
  if (!isOpenOn(weekdayMask, dow)) return null;
  const hhmm = dow === 0 ? SUNDAY_HOURS_HHMM : CLINIC_HOURS_HHMM[dow];
  if (!hhmm) return null;
  return {
    open: fromZonedTime(`${dayKey}T${hhmm[0]}:00`, CLINIC_TZ),
    close: fromZonedTime(`${dayKey}T${hhmm[1]}:00`, CLINIC_TZ),
  };
}

/** The clinic calendar day (yyyy-MM-dd) that a given instant falls on. */
function clinicDayKey(instant: Date): string {
  return formatInTimeZone(instant, CLINIC_TZ, "yyyy-MM-dd");
}

type DayBooking = BookingTimeRange & { serviceId: string };

/**
 * Every active booking for the clinic day, across all services. Pool filtering
 * happens in-memory afterwards so the single-room lock spans every service.
 */
async function fetchDayBookings(dayKey: string): Promise<DayBooking[]> {
  const admin = await createSupabaseAdmin();
  if (!admin) return [];

  const dayStart = fromZonedTime(`${dayKey}T00:00:00`, CLINIC_TZ);
  const dayEnd = addDays(dayStart, 1);

  const { data, error } = await admin
    .from("bookings")
    .select("service_id,scheduled_at,ends_at,status")
    .in("status", ["pending", "confirmed"])
    .gte("scheduled_at", dayStart.toISOString())
    .lt("scheduled_at", dayEnd.toISOString());

  if (error) {
    console.error("[bookings] fetchDayBookings error", error);
    return [];
  }

  type BookingRow = { service_id: string; scheduled_at: string; ends_at: string };
  return ((data as BookingRow[] | null) ?? []).map((row) => ({
    serviceId: row.service_id,
    start: new Date(row.scheduled_at),
    end: new Date(row.ends_at),
  }));
}

/** Keep only the bookings that compete for the same resource pool. */
function bookingsInPool(
  dayBookings: DayBooking[],
  poolKey: string,
): BookingTimeRange[] {
  return dayBookings
    .filter((b) => poolForServiceId(b.serviceId).key === poolKey)
    .map(({ start, end }) => ({ start, end }));
}

export type AvailableSlot = { iso: string; available: boolean };

export async function getAvailableSlots(
  serviceSlug: string,
  dayKey: string,
): Promise<{ slots: AvailableSlot[]; closed: boolean }> {
  const service = findServiceBySlug(serviceSlug);
  if (!service) return { slots: [], closed: true };

  if (!DAY_KEY_RE.test(dayKey)) return { slots: [], closed: true };

  const hours = clinicHoursForDay(dayKey, service.weekdayMask);
  if (!hours) return { slots: [], closed: true };

  const pool = poolForCategoryId(service.categoryId);
  const dayBookings = await fetchDayBookings(dayKey);
  const existingBookings = bookingsInPool(dayBookings, pool.key);

  const slots = generateSlots({
    open: hours.open,
    close: hours.close,
    serviceDurationMin: service.durationMinutes,
    granularityMin: DEFAULT_GRANULARITY,
    existingBookings,
    capacity: pool.capacity,
  });

  return {
    slots: slots.map((s) => ({
      iso: s.start.toISOString(),
      available: s.available,
    })),
    closed: false,
  };
}

export type AvailableDay = { dayKey: string; available: boolean };

/**
 * Day-only availability for the next `count` days from `startDayKey`. A day is
 * available when it's an open day, not in the past, and under the pool's daily
 * capacity. Used by the day picker to disable closed and fully-booked days.
 */
export async function getAvailableDays(
  serviceSlug: string,
  startDayKey: string,
  count = 56,
): Promise<AvailableDay[]> {
  const service = findServiceBySlug(serviceSlug);
  if (!service) return [];
  if (!DAY_KEY_RE.test(startDayKey)) return [];

  const pool = poolForCategoryId(service.categoryId);
  const rangeStart = fromZonedTime(`${startDayKey}T00:00:00`, CLINIC_TZ);
  const rangeEnd = addDays(rangeStart, count);

  const counts: Record<string, number> = {};
  const admin = await createSupabaseAdmin();
  if (admin) {
    const { data, error } = await admin
      .from("bookings")
      .select("service_id,scheduled_at,status")
      .in("status", ["pending", "confirmed"])
      .gte("scheduled_at", rangeStart.toISOString())
      .lt("scheduled_at", rangeEnd.toISOString());
    if (!error && data) {
      for (const row of data as { service_id: string; scheduled_at: string }[]) {
        if (poolForServiceId(row.service_id).key !== pool.key) continue;
        const key = clinicDayKey(new Date(row.scheduled_at));
        counts[key] = (counts[key] ?? 0) + 1;
      }
    }
  }

  const todayKey = clinicDayKey(new Date());
  const base = new Date(`${startDayKey}T12:00:00Z`);
  const result: AvailableDay[] = [];
  for (let i = 0; i < count; i++) {
    const dayKey = formatInTimeZone(addDays(base, i), "UTC", "yyyy-MM-dd");
    const dow = new Date(`${dayKey}T12:00:00Z`).getUTCDay();
    const open = isOpenOn(service.weekdayMask, dow);
    const past = dayKey < todayKey;
    const remaining = pool.capacity - (counts[dayKey] ?? 0);
    result.push({ dayKey, available: open && !past && remaining > 0 });
  }
  return result;
}

export type CreateBookingResult =
  | { ok: true; whatsappUrl: string; messagePreview: string; bookingId: string }
  | { ok: false; reason: "validation" | "conflict" | "service_unknown" | "out_of_hours" | "server"; message: string };

export async function createBooking(
  input: unknown,
): Promise<CreateBookingResult> {
  const parsed = bookingFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      reason: "validation",
      message: parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; "),
    };
  }

  const {
    serviceSlug,
    customerName,
    customerPhone,
    customerEmail,
    notes,
    scheduledAtIso,
    dayKey: dayKeyInput,
  } = parsed.data;
  const service = findServiceBySlug(serviceSlug);
  if (!service) {
    return { ok: false, reason: "service_unknown", message: "Service not found." };
  }

  let start: Date;
  let end: Date;

  if (BOOKING_MODE === "day") {
    const dayKey = dayKeyInput ?? "";
    if (!DAY_KEY_RE.test(dayKey)) {
      return { ok: false, reason: "validation", message: "Please pick a day." };
    }
    const dow = new Date(`${dayKey}T12:00:00Z`).getUTCDay();
    if (!isOpenOn(service.weekdayMask, dow)) {
      return { ok: false, reason: "out_of_hours", message: "We're closed on that day." };
    }
    if (dayKey < clinicDayKey(new Date())) {
      return { ok: false, reason: "validation", message: "That day has already passed." };
    }
    // A day-only booking occupies the whole day, so the daily capacity is
    // enforced by the same overlap counter used for timed slots.
    start = fromZonedTime(`${dayKey}T00:00:00`, CLINIC_TZ);
    end = addDays(start, 1);
  } else {
    if (!scheduledAtIso) {
      return { ok: false, reason: "validation", message: "Please pick a time." };
    }
    start = new Date(scheduledAtIso);
    if (Number.isNaN(start.getTime())) {
      return { ok: false, reason: "validation", message: "Invalid time." };
    }
    end = addMinutes(start, service.durationMinutes);
    const hours = clinicHoursForDay(clinicDayKey(start), service.weekdayMask);
    if (!hours || start < hours.open || end > hours.close) {
      return {
        ok: false,
        reason: "out_of_hours",
        message: "That time is outside the studio's open hours for this service.",
      };
    }
  }

  const pool = poolForCategoryId(service.categoryId);
  const dayBookings = await fetchDayBookings(clinicDayKey(start));
  const existingBookings = bookingsInPool(dayBookings, pool.key);
  if (countOverlaps({ start, end }, existingBookings) >= pool.capacity) {
    return {
      ok: false,
      reason: "conflict",
      message:
        BOOKING_MODE === "day"
          ? "Sorry — that day is fully booked. Please choose another day."
          : "Sorry — that slot has just been taken. Please choose another time.",
    };
  }

  const holdMinutes = siteConfig.defaultBookingHoldHours * 60;
  const holdExpiresAt = addMinutes(new Date(), holdMinutes);

  let bookingId = crypto.randomUUID();
  let ownerToken = crypto.randomUUID();

  const admin = await createSupabaseAdmin();
  if (admin) {
    const { data, error } = await admin
      .from("bookings")
      .insert({
        service_id: service.id,
        service_name: service.name,
        service_price_cents: service.priceCents,
        service_duration_minutes: service.durationMinutes,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || null,
        notes: notes || null,
        scheduled_at: start.toISOString(),
        ends_at: end.toISOString(),
        status: "pending",
        hold_expires_at: holdExpiresAt.toISOString(),
      })
      .select("id, owner_token")
      .single();

    if (error || !data) {
      console.error("[bookings] insert error", error);
      return {
        ok: false,
        reason: "server",
        message: "We couldn't save your booking. Please try again in a moment.",
      };
    }
    bookingId = data.id as string;
    ownerToken = data.owner_token as string;
  } else if (isSupabaseConfigured) {
    return {
      ok: false,
      reason: "server",
      message:
        "Database is online but the service role key isn't set. Add SUPABASE_SERVICE_ROLE_KEY to .env.local.",
    };
  }

  const bookingForNotifier: BookingWithService = {
    id: bookingId,
    serviceId: service.id,
    customerName,
    customerPhone,
    customerEmail: customerEmail || null,
    notes: notes || null,
    scheduledAt: start.toISOString(),
    endsAt: end.toISOString(),
    status: "pending",
    holdExpiresAt: holdExpiresAt.toISOString(),
    ownerToken,
    createdAt: new Date().toISOString(),
    serviceName: service.name,
    serviceDurationMinutes: service.durationMinutes,
    servicePriceCents: service.priceCents,
  };

  const result = await getNotifier().buildHandoff(bookingForNotifier);

  if (result.kind === "handoff") {
    return {
      ok: true,
      whatsappUrl: result.whatsappUrl,
      messagePreview: result.messagePreview,
      bookingId,
    };
  }

  return {
    ok: true,
    whatsappUrl: "",
    messagePreview: "Booking sent directly to the clinic.",
    bookingId,
  };
}

export async function expirePendingBookings(): Promise<{
  expired: number;
}> {
  const admin = await createSupabaseAdmin();
  if (!admin) return { expired: 0 };

  const nowIso = new Date().toISOString();
  const { count, error } = await admin
    .from("bookings")
    .update({ status: "expired" }, { count: "exact" })
    .eq("status", "pending")
    .lt("hold_expires_at", nowIso);

  if (error) {
    console.error("[bookings] expire error", error);
    return { expired: 0 };
  }

  return { expired: count ?? 0 };
}

// ── Owner manage flow ──────────────────────────────────────────

export type OwnerBookingView = {
  id: string;
  status: BookingStatus;
  scheduledAt: string;
  endsAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  notes: string | null;
  serviceName: string;
  durationMinutes: number;
  priceCents: number;
  holdExpiresAt: string;
};

export type FindBookingByTokenResult =
  | { ok: true; booking: OwnerBookingView }
  | {
      ok: false;
      reason: "not_configured" | "not_found";
      message: string;
    };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function findBookingByToken(
  token: string,
): Promise<FindBookingByTokenResult> {
  if (!UUID_RE.test(token)) {
    return { ok: false, reason: "not_found", message: "Booking not found." };
  }

  const admin = await createSupabaseAdmin();
  if (!admin) {
    return {
      ok: false,
      reason: "not_configured",
      message:
        "The database isn't configured yet — owner links require Supabase.",
    };
  }

  const { data, error } = await admin
    .from("bookings")
    .select(
      "id, status, scheduled_at, ends_at, customer_name, customer_phone, customer_email, notes, hold_expires_at, service_name, service_duration_minutes, service_price_cents",
    )
    .eq("owner_token", token)
    .maybeSingle();

  if (error) {
    console.error("[bookings] findBookingByToken error", error);
    return { ok: false, reason: "not_found", message: "Booking not found." };
  }
  if (!data) {
    return { ok: false, reason: "not_found", message: "Booking not found." };
  }

  type BookingRow = {
    id: string;
    status: BookingStatus;
    scheduled_at: string;
    ends_at: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string | null;
    notes: string | null;
    hold_expires_at: string;
    service_name: string;
    service_duration_minutes: number;
    service_price_cents: number;
  };

  const row = data as unknown as BookingRow;

  return {
    ok: true,
    booking: {
      id: row.id,
      status: row.status,
      scheduledAt: row.scheduled_at,
      endsAt: row.ends_at,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      customerEmail: row.customer_email,
      notes: row.notes,
      holdExpiresAt: row.hold_expires_at,
      serviceName: row.service_name,
      durationMinutes: row.service_duration_minutes,
      priceCents: row.service_price_cents,
    },
  };
}

export type RespondToBookingResult =
  | { ok: true; status: BookingStatus; alreadyInState?: boolean }
  | {
      ok: false;
      reason:
        | "not_configured"
        | "unauthorized"
        | "not_found"
        | "invalid_action"
        | "terminal_state"
        | "conflict"
        | "server";
      message: string;
      currentStatus?: BookingStatus;
    };

export async function authenticateOwner(
  password: string,
): Promise<{ ok: boolean }> {
  const ok = await signInOwner(password);
  return { ok };
}

export async function respondToBooking(
  token: string,
  action: "confirm" | "deny",
): Promise<RespondToBookingResult> {
  // Only the owner (holding the portal password) may confirm/deny — the
  // customer can see the token link but must never be able to act on it.
  if (!(await isOwnerAuthed())) {
    return {
      ok: false,
      reason: "unauthorized",
      message: "Owner sign-in required to manage this booking.",
    };
  }

  if (action !== "confirm" && action !== "deny") {
    return {
      ok: false,
      reason: "invalid_action",
      message: "Unknown action.",
    };
  }
  if (!UUID_RE.test(token)) {
    return { ok: false, reason: "not_found", message: "Booking not found." };
  }

  const admin = await createSupabaseAdmin();
  if (!admin) {
    return {
      ok: false,
      reason: "not_configured",
      message: "The database isn't configured.",
    };
  }

  const lookup = await findBookingByToken(token);
  if (!lookup.ok) {
    return { ok: false, reason: "not_found", message: "Booking not found." };
  }
  const current = lookup.booking;

  if (current.status === "expired" || current.status === "cancelled") {
    return {
      ok: false,
      reason: "terminal_state",
      message: `This booking is already ${current.status} and can't be changed.`,
      currentStatus: current.status,
    };
  }

  const newStatus: BookingStatus = action === "confirm" ? "confirmed" : "denied";

  if (current.status === newStatus) {
    return { ok: true, status: newStatus, alreadyInState: true };
  }

  // If we're restoring a previously-denied booking (the slot was open in the
  // meantime), make sure no one else has booked an overlapping slot. Single
  // practitioner = any time overlap is a conflict, regardless of service.
  if (action === "confirm" && current.status === "denied") {
    const { data: conflicts, error: conflictError } = await admin
      .from("bookings")
      .select("id")
      .neq("id", current.id)
      .in("status", ["pending", "confirmed"])
      .lt("scheduled_at", current.endsAt)
      .gt("ends_at", current.scheduledAt);

    if (conflictError) {
      console.error("[bookings] respondToBooking conflict check error", conflictError);
      return {
        ok: false,
        reason: "server",
        message: "Couldn't verify the slot is still free. Please try again.",
      };
    }

    if (conflicts && conflicts.length > 0) {
      return {
        ok: false,
        reason: "conflict",
        message:
          "Another booking now occupies this time slot. To restore this booking, the other one would need to be cancelled first.",
        currentStatus: current.status,
      };
    }
  }

  const { error: updateError } = await admin
    .from("bookings")
    .update({ status: newStatus })
    .eq("owner_token", token);

  if (updateError) {
    console.error("[bookings] respondToBooking update error", updateError);
    return {
      ok: false,
      reason: "server",
      message: "Couldn't update the booking. Please try again.",
    };
  }

  return { ok: true, status: newStatus };
}

// ── Owner dashboard: list confirmed bookings ───────────────────

export type OwnerBookingListItem = {
  id: string;
  scheduledAt: string;
  endsAt: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  durationMinutes: number;
  priceCents: number;
};

export type ListConfirmedBookingsResult =
  | { ok: true; bookings: OwnerBookingListItem[] }
  | { ok: false; reason: "unauthorized" | "not_configured"; message: string };

/**
 * Upcoming confirmed bookings (ends in the future), earliest first. Owner-only.
 */
export async function listConfirmedBookings(): Promise<ListConfirmedBookingsResult> {
  if (!(await isOwnerAuthed())) {
    return {
      ok: false,
      reason: "unauthorized",
      message: "Owner sign-in required.",
    };
  }

  const admin = await createSupabaseAdmin();
  if (!admin) {
    return {
      ok: false,
      reason: "not_configured",
      message: "The database isn't configured.",
    };
  }

  const nowIso = new Date().toISOString();
  const { data, error } = await admin
    .from("bookings")
    .select(
      "id, scheduled_at, ends_at, customer_name, customer_phone, service_name, service_duration_minutes, service_price_cents",
    )
    .eq("status", "confirmed")
    .gte("ends_at", nowIso)
    .order("scheduled_at", { ascending: true });

  if (error) {
    console.error("[bookings] listConfirmedBookings error", error);
    return {
      ok: false,
      reason: "not_configured",
      message: "Couldn't load bookings.",
    };
  }

  type Row = {
    id: string;
    scheduled_at: string;
    ends_at: string;
    customer_name: string;
    customer_phone: string;
    service_name: string;
    service_duration_minutes: number;
    service_price_cents: number;
  };

  const bookings = ((data as Row[] | null) ?? []).map((row) => ({
    id: row.id,
    scheduledAt: row.scheduled_at,
    endsAt: row.ends_at,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    serviceName: row.service_name,
    durationMinutes: row.service_duration_minutes,
    priceCents: row.service_price_cents,
  }));

  return { ok: true, bookings };
}

