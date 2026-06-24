"use client";

import { useState, useTransition } from "react";
import { Check, MessageCircle, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { respondToBooking } from "@/server/actions/bookings";
import type { BookingStatus } from "@/types/booking";

type Decision = "confirmed" | "denied";

interface Props {
  token: string;
  customerPhoneE164: string;
  customerName: string;
  serviceName: string;
  initialStatus: BookingStatus;
}

type ViewState =
  | { kind: "pending" }
  | { kind: "decided"; status: Decision }
  | { kind: "error"; message: string };

export function OwnerActions({
  token,
  customerPhoneE164,
  customerName,
  serviceName,
  initialStatus,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [view, setView] = useState<ViewState>(() =>
    initialStatus === "confirmed" || initialStatus === "denied"
      ? { kind: "decided", status: initialStatus }
      : { kind: "pending" },
  );
  const [pendingAction, setPendingAction] = useState<"confirm" | "deny" | null>(
    null,
  );

  function handle(action: "confirm" | "deny") {
    setPendingAction(action);
    startTransition(async () => {
      const res = await respondToBooking(token, action);
      setPendingAction(null);

      if (res.ok) {
        setView({
          kind: "decided",
          status: action === "confirm" ? "confirmed" : "denied",
        });
        return;
      }

      // Surface a friendly error and keep the prior view intact.
      setView({ kind: "error", message: res.message });
    });
  }

  if (view.kind === "decided") {
    const opposite: "confirm" | "deny" =
      view.status === "confirmed" ? "deny" : "confirm";
    return (
      <DecisionPanel
        status={view.status}
        customerPhoneE164={customerPhoneE164}
        customerName={customerName}
        serviceName={serviceName}
        onChangeMind={() => handle(opposite)}
        changing={pending && pendingAction === opposite}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => handle("confirm")}
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-medium uppercase tracking-[0.22em] text-white shadow-soft transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Check className="h-4 w-4" aria-hidden />
          {pending && pendingAction === "confirm" ? "Working…" : "Confirm booking"}
        </button>
        <button
          type="button"
          onClick={() => handle("deny")}
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-ivory px-6 py-4 text-sm font-medium uppercase tracking-[0.22em] text-rose-700 transition hover:border-rose-500 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <X className="h-4 w-4" aria-hidden />
          {pending && pendingAction === "deny" ? "Working…" : "Deny booking"}
        </button>
      </div>

      {view.kind === "error" ? (
        <p
          role="alert"
          className="rounded-xl bg-rose-100 px-4 py-3 text-xs leading-relaxed text-rose-800"
        >
          {view.message}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted">
        Confirming locks the slot. Denying releases it for other clients. The
        customer is not auto-notified — message them in WhatsApp afterwards.
      </p>
    </div>
  );
}

function DecisionPanel({
  status,
  customerPhoneE164,
  customerName,
  serviceName,
  onChangeMind,
  changing,
}: {
  status: Decision;
  customerPhoneE164: string;
  customerName: string;
  serviceName: string;
  onChangeMind: () => void;
  changing: boolean;
}) {
  const isConfirm = status === "confirmed";
  const phoneDigits = customerPhoneE164.replace(/[^0-9]/g, "");
  const message = isConfirm
    ? `Hi ${customerName}, your ${serviceName} booking is confirmed. See you soon.`
    : `Hi ${customerName}, unfortunately we can't take your ${serviceName} booking at that time. Could we suggest another?`;
  const waUrl = phoneDigits
    ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`
    : null;

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "overflow-hidden rounded-3xl p-8 text-white shadow-lift",
          isConfirm ? "bg-emerald-600" : "bg-rose-700",
        )}
      >
        <div className="flex items-center gap-3">
          <div
            aria-hidden
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/20"
          >
            {isConfirm ? <Check className="h-6 w-6" /> : <X className="h-6 w-6" />}
          </div>
          <span className="text-[11px] uppercase tracking-[0.32em] text-white/80">
            {isConfirm ? "Confirmed" : "Denied"}
          </span>
        </div>

        <h2 className="mt-5 font-display text-3xl leading-tight md:text-4xl">
          {isConfirm
            ? "The slot is locked in."
            : "The slot is back on the calendar."}
        </h2>
        <p className="mt-3 max-w-lg text-white/90">
          {isConfirm
            ? "We've set this booking to confirmed. The time is reserved on the website and won't be offered to anyone else."
            : "We've released this slot. Customers can book it again. The 24-hour hold has been cancelled."}
        </p>

        {waUrl ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-ivory px-7 py-3.5 text-sm font-medium uppercase tracking-[0.22em] text-charcoal transition hover:bg-cream"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            {isConfirm
              ? "Message client to confirm"
              : "Message client to suggest a new time"}
          </a>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-line/60 bg-cream/40 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-charcoal/80">
          {isConfirm
            ? "Tapped Confirm by mistake?"
            : "Changed your mind about denying?"}
        </p>
        <button
          type="button"
          onClick={onChangeMind}
          disabled={changing}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-xs font-medium uppercase tracking-[0.22em] transition disabled:cursor-not-allowed disabled:opacity-60",
            isConfirm
              ? "border-rose-200 bg-ivory text-rose-700 hover:border-rose-500 hover:bg-rose-50"
              : "border-emerald-200 bg-ivory text-emerald-700 hover:border-emerald-500 hover:bg-emerald-50",
          )}
        >
          <RefreshCw
            className={cn("h-3.5 w-3.5", changing && "animate-spin")}
            aria-hidden
          />
          {changing
            ? "Updating…"
            : isConfirm
              ? "Change to deny"
              : "Change to confirm"}
        </button>
      </div>
    </div>
  );
}
