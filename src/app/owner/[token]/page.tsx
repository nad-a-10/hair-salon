import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, AlertCircle, CalendarCheck2 } from "lucide-react";
import { OwnerActions } from "@/components/owner/OwnerActions";
import { OwnerBookingCard } from "@/components/owner/OwnerBookingCard";
import { OwnerLogin } from "@/components/owner/OwnerLogin";
import { siteConfig } from "@/config/site";
import { findBookingByToken } from "@/server/actions/bookings";
import { isOwnerAuthed, ownerPortalConfigured } from "@/lib/booking/owner-auth";

export const metadata: Metadata = {
  title: "Manage Booking",
  description: "Confirm or deny an incoming booking request.",
  robots: { index: false, follow: false },
};

export default async function OwnerManagePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const portalConfigured = ownerPortalConfigured();
  const authed = portalConfigured ? await isOwnerAuthed() : false;
  const result = authed ? await findBookingByToken(token) : null;

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
            Owner — booking management
          </span>
          <h1 className="mt-3 font-display text-4xl leading-tight text-charcoal md:text-5xl">
            Booking request
          </h1>
        </header>

        <div className="mt-10">
          {!portalConfigured ? (
            <PortalNotConfiguredPanel />
          ) : !authed || !result ? (
            <OwnerLogin />
          ) : !result.ok && result.reason === "not_configured" ? (
            <NotConfiguredPanel />
          ) : !result.ok ? (
            <NotFoundPanel />
          ) : (
            <div className="space-y-8">
              <OwnerBookingCard booking={result.booking} />

              {result.booking.status === "expired" ||
              result.booking.status === "cancelled" ? (
                <ResolvedNotice status={result.booking.status} />
              ) : (
                <OwnerActions
                  token={token}
                  customerPhoneE164={result.booking.customerPhone}
                  customerName={result.booking.customerName}
                  serviceName={result.booking.serviceName}
                  initialStatus={result.booking.status}
                />
              )}

              <Link
                href="/owner"
                className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-muted transition hover:text-rose-600"
              >
                <CalendarCheck2 className="h-3.5 w-3.5" aria-hidden />
                View all confirmed bookings
              </Link>
            </div>
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
        Set an owner password to manage bookings
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-amber-900/80">
        Add <code className="font-mono">OWNER_PORTAL_PASSWORD</code> to your
        environment variables, then redeploy. Until it&apos;s set, no one can
        confirm or deny bookings from this link — including the customer who
        received it.
      </p>
    </div>
  );
}

function NotFoundPanel() {
  return (
    <div className="rounded-3xl border border-dashed border-line/70 bg-ivory px-8 py-12 text-center">
      <AlertCircle
        className="mx-auto h-8 w-8 text-rose-500"
        aria-hidden
      />
      <h2 className="mt-5 font-display text-3xl text-charcoal">
        Booking not found
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        This link is invalid or the booking has been removed. If you reached
        this from a recent WhatsApp message, double-check the link or get in
        touch with the customer directly.
      </p>
    </div>
  );
}

function NotConfiguredPanel() {
  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 px-8 py-10">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-amber-700" aria-hidden />
        <span className="text-[11px] uppercase tracking-[0.28em] text-amber-900">
          Database not configured
        </span>
      </div>
      <h2 className="mt-4 font-display text-2xl text-charcoal">
        Owner links need Supabase to be set up
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-amber-900/80">
        Add <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
        <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{" "}
        <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> to
        <code className="font-mono"> .env.local</code> (template is in{" "}
        <code className="font-mono">.env.local.example</code>), then run the
        migration in <code className="font-mono">supabase/migrations/</code>.
        Once that&apos;s in place, every booking will get a unique link here so
        you can confirm or deny it from your phone.
      </p>
    </div>
  );
}

function ResolvedNotice({ status }: { status: string }) {
  return (
    <div className="rounded-2xl border border-line/60 bg-cream/40 px-6 py-5 text-sm leading-relaxed text-charcoal/80">
      This booking is already <strong>{status}</strong>. No further action is
      needed from this page.
    </div>
  );
}
