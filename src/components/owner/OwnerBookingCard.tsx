import { formatInTimeZone } from "date-fns-tz";
import {
  CalendarCheck2,
  Clock,
  Mail,
  MessageCircle,
  Phone,
  StickyNote,
  User,
} from "lucide-react";
import { cn, formatCurrency, formatDuration } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { isDayMode } from "@/lib/booking/when";
import { WhatsAppLink } from "./WhatsAppLink";
import type { OwnerBookingView } from "@/server/actions/bookings";
import type { BookingStatus } from "@/types/booking";

const STATUS_TONE: Record<
  BookingStatus,
  { label: string; pill: string; ring: string }
> = {
  pending: {
    label: "Pending — awaiting your decision",
    pill: "bg-amber-100 text-amber-900 border-amber-200",
    ring: "ring-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    pill: "bg-emerald-100 text-emerald-900 border-emerald-200",
    ring: "ring-emerald-200",
  },
  denied: {
    label: "Denied",
    pill: "bg-rose-100 text-rose-900 border-rose-200",
    ring: "ring-rose-200",
  },
  expired: {
    label: "Expired (24h hold elapsed)",
    pill: "bg-stone-100 text-stone-700 border-stone-200",
    ring: "ring-stone-200",
  },
  cancelled: {
    label: "Cancelled",
    pill: "bg-stone-100 text-stone-700 border-stone-200",
    ring: "ring-stone-200",
  },
};

export function OwnerBookingCard({ booking }: { booking: OwnerBookingView }) {
  const start = new Date(booking.scheduledAt);
  const end = new Date(booking.endsAt);
  const tone = STATUS_TONE[booking.status];
  const hasPhone = /[0-9]/.test(booking.customerPhone);

  return (
    <article
      className={cn(
        "rounded-[1.75rem] border border-line/60 bg-ivory p-7 shadow-soft ring-1",
        tone.ring,
      )}
    >
      <header className="flex flex-wrap items-center gap-3">
        <span
          className={cn(
            "rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em]",
            tone.pill,
          )}
        >
          {tone.label}
        </span>
        <span className="text-xs text-muted">
          Ref: <span className="font-mono">{booking.id.slice(0, 8)}</span>
        </span>
      </header>

      <h3 className="mt-5 font-display text-3xl text-charcoal">
        {booking.serviceName}
      </h3>

      <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Row icon={<CalendarCheck2 className="h-4 w-4" />} label="Date">
          {formatInTimeZone(start, siteConfig.timeZone, "EEEE, MMMM d, yyyy")}
        </Row>
        <Row icon={<Clock className="h-4 w-4" />} label={isDayMode ? "Booking" : "Time"}>
          {isDayMode ? (
            <>By arrangement that day · {formatDuration(booking.durationMinutes)}</>
          ) : (
            <>
              {formatInTimeZone(start, siteConfig.timeZone, "h:mm a")} –{" "}
              {formatInTimeZone(end, siteConfig.timeZone, "h:mm a")} ·{" "}
              {formatDuration(booking.durationMinutes)}
            </>
          )}
        </Row>
        <Row icon={<User className="h-4 w-4" />} label="Customer">
          {booking.customerName}
        </Row>
        <Row icon={<Phone className="h-4 w-4" />} label="Phone">
          {hasPhone ? (
            <WhatsAppLink
              phoneE164={booking.customerPhone}
              className="inline-flex items-center gap-1.5 text-charcoal underline-offset-4 hover:text-rose-600 hover:underline"
            >
              {booking.customerPhone}
              <MessageCircle className="h-3.5 w-3.5 text-rose-500" aria-hidden />
            </WhatsAppLink>
          ) : (
            booking.customerPhone
          )}
        </Row>
        {booking.customerEmail ? (
          <Row icon={<Mail className="h-4 w-4" />} label="Email">
            <a
              href={`mailto:${booking.customerEmail}`}
              className="text-charcoal underline-offset-4 hover:text-rose-600 hover:underline"
            >
              {booking.customerEmail}
            </a>
          </Row>
        ) : null}
        <Row icon={<span className="font-display text-base">$</span>} label="Price">
          {formatCurrency(booking.priceCents)}
        </Row>
      </dl>

      {booking.notes ? (
        <div className="mt-6 rounded-2xl border border-line/60 bg-cream/40 p-4">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-muted">
            <StickyNote className="h-3.5 w-3.5" aria-hidden />
            Customer notes
          </div>
          <p className="mt-2 text-sm leading-relaxed text-charcoal">
            {booking.notes}
          </p>
        </div>
      ) : null}
    </article>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-muted">
        <span className="text-rose-500">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1 text-sm text-charcoal">{children}</dd>
    </div>
  );
}
