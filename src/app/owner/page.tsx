import type { Metadata } from "next";
import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";
import { ArrowLeft, AlertCircle, CalendarCheck2, Clock, MessageCircle } from "lucide-react";
import { OwnerLogin } from "@/components/owner/OwnerLogin";
import { WhatsAppLink } from "@/components/owner/WhatsAppLink";
import { siteConfig } from "@/config/site";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { listConfirmedBookings } from "@/server/actions/bookings";
import { isOwnerAuthed, ownerPortalConfigured } from "@/lib/booking/owner-auth";
import { isDayMode } from "@/lib/booking/when";

export const metadata: Metadata = {
  title: "Confirmed Bookings",
  description: "Upcoming confirmed bookings.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OwnerDashboardPage() {
  const portalConfigured = ownerPortalConfigured();
  const authed = portalConfigured ? await isOwnerAuthed() : false;
  const result = authed ? await listConfirmedBookings() : null;

  return (
    <main className="min-h-screen bg-ivory bg-grain px-6 py-12 md:px-10 md:py-20">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-muted transition hover:text-rose-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          {siteConfig.name}
        </Link>

        <header className="mt-6">
          <span className="text-[11px] uppercase tracking-[0.32em] text-gold-500">
            Owner — schedule
          </span>
          <h1 className="mt-3 font-display text-4xl leading-tight text-charcoal md:text-5xl">
            Confirmed bookings
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Upcoming appointments you&apos;ve confirmed, earliest first.
          </p>
        </header>

        <div className="mt-10">
          {!portalConfigured ? (
            <PortalNotConfiguredPanel />
          ) : !authed || !result ? (
            <OwnerLogin />
          ) : !result.ok ? (
            <ErrorPanel message={result.message} />
          ) : result.bookings.length === 0 ? (
            <EmptyPanel />
          ) : (
            <ul className="space-y-4">
              {result.bookings.map((b) => {
                const start = new Date(b.scheduledAt);
                const end = new Date(b.endsAt);
                const phoneDigits = b.customerPhone.replace(/[^0-9]/g, "");
                return (
                  <li
                    key={b.id}
                    className="rounded-[1.5rem] border border-line/60 bg-ivory p-6 shadow-soft"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-gold-500">
                          <CalendarCheck2 className="h-3.5 w-3.5" aria-hidden />
                          {formatInTimeZone(start, siteConfig.timeZone, "EEE, MMM d")}
                        </p>
                        <h2 className="mt-2 font-display text-2xl text-charcoal">
                          {b.serviceName}
                        </h2>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted">
                          <Clock className="h-3.5 w-3.5" aria-hidden />
                          {isDayMode ? (
                            <>By arrangement · {formatDuration(b.durationMinutes)}</>
                          ) : (
                            <>
                              {formatInTimeZone(start, siteConfig.timeZone, "h:mm a")}
                              {" – "}
                              {formatInTimeZone(end, siteConfig.timeZone, "h:mm a")}
                              {" · "}
                              {formatDuration(b.durationMinutes)}
                            </>
                          )}
                        </p>
                      </div>
                      <span className="font-display text-xl text-rose-600">
                        {formatCurrency(b.priceCents)}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-4 text-sm">
                      <span className="text-charcoal">
                        {b.customerName}{" "}
                        <span className="text-muted">· {b.customerPhone}</span>
                      </span>
                      {phoneDigits ? (
                        <WhatsAppLink
                          phoneE164={b.customerPhone}
                          className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/20 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-charcoal transition hover:border-rose-500 hover:text-rose-600"
                        >
                          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                          Message
                        </WhatsAppLink>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}

function PortalNotConfiguredPanel() {
  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 px-8 py-10">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-amber-700" aria-hidden />
        <span className="text-[11px] uppercase tracking-[0.28em] text-amber-900">
          Owner portal not configured
        </span>
      </div>
      <h2 className="mt-4 font-display text-2xl text-charcoal">
        Set an owner password
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-amber-900/80">
        Add <code className="font-mono">OWNER_PORTAL_PASSWORD</code> to your
        environment variables and redeploy to access the owner schedule.
      </p>
    </div>
  );
}

function ErrorPanel({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-line/70 bg-ivory px-8 py-12 text-center">
      <AlertCircle className="mx-auto h-8 w-8 text-rose-500" aria-hidden />
      <p className="mt-4 text-sm text-muted">{message}</p>
    </div>
  );
}

function EmptyPanel() {
  return (
    <div className="rounded-3xl border border-dashed border-line/70 bg-ivory px-8 py-12 text-center">
      <CalendarCheck2 className="mx-auto h-8 w-8 text-rose-400" aria-hidden />
      <h2 className="mt-5 font-display text-2xl text-charcoal">
        No upcoming bookings
      </h2>
      <p className="mt-2 text-sm text-muted">
        Confirmed appointments will appear here.
      </p>
    </div>
  );
}
