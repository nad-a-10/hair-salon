"use client";

import { format, startOfToday } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
  ArrowUpRight,
  CalendarCheck2,
  Clock,
  Mail,
  MessageCircle,
  Phone,
  StickyNote,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DayPicker } from "./DayPicker";
import { TimeSlotPicker } from "./TimeSlotPicker";
import { cn, formatCurrency, formatDuration } from "@/lib/utils";
import {
  bookingFormSchema,
  type BookingFormValues,
} from "@/lib/booking/schema";
import { createBooking, getAvailableDays } from "@/server/actions/bookings";
import { siteConfig } from "@/config/site";
import type { ServiceWithCategory } from "@/types/catalog";

const DAY_MODE = siteConfig.bookingMode === "day";

interface Props {
  service: ServiceWithCategory;
}

type Submission =
  | { kind: "idle" }
  | { kind: "error"; message: string }
  | {
      kind: "success";
      bookingId: string;
      whatsappUrl: string;
      messagePreview: string;
      whenPrimary: string;
      whenSecondary: string;
    };

export function BookingFlow({ service }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlotIso, setSelectedSlotIso] = useState<string | null>(null);
  const [availableDayKeys, setAvailableDayKeys] = useState<Set<string> | null>(
    null,
  );
  const [submission, setSubmission] = useState<Submission>({ kind: "idle" });
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      serviceSlug: service.slug,
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      notes: "",
      scheduledAtIso: "",
      dayKey: "",
    },
  });

  // Day-only mode: load which upcoming days are open and under capacity.
  useEffect(() => {
    if (!DAY_MODE) return;
    let cancelled = false;
    const startKey = format(startOfToday(), "yyyy-MM-dd");
    getAvailableDays(service.slug, startKey, 56)
      .then((days) => {
        if (cancelled) return;
        setAvailableDayKeys(
          new Set(days.filter((d) => d.available).map((d) => d.dayKey)),
        );
      })
      .catch(() => {
        if (!cancelled) setAvailableDayKeys(new Set());
      });
    return () => {
      cancelled = true;
    };
  }, [service.slug]);

  function onDaySelect(day: Date) {
    setSelectedDate(day);
    setSelectedSlotIso(null);
  }

  const selectionMade = DAY_MODE ? !!selectedDate : !!selectedSlotIso;

  let whenPrimary: string | null = null;
  let whenSecondary: string | null = null;
  if (DAY_MODE && selectedDate) {
    whenPrimary = format(selectedDate, "EEEE, MMM d");
    whenSecondary = "By arrangement that day";
  } else if (!DAY_MODE && selectedSlotIso) {
    whenPrimary = formatInTimeZone(
      new Date(selectedSlotIso),
      siteConfig.timeZone,
      "EEEE, MMM d",
    );
    whenSecondary = formatInTimeZone(
      new Date(selectedSlotIso),
      siteConfig.timeZone,
      "h:mm a",
    );
  }

  function onSubmit(values: BookingFormValues) {
    if (!selectionMade) {
      setSubmission({
        kind: "error",
        message: DAY_MODE
          ? "Please pick a day before submitting."
          : "Please pick a day and time before submitting.",
      });
      return;
    }

    const payload: BookingFormValues = {
      ...values,
      serviceSlug: service.slug,
      dayKey: DAY_MODE ? format(selectedDate!, "yyyy-MM-dd") : "",
      scheduledAtIso: DAY_MODE ? "" : selectedSlotIso!,
    };

    startTransition(async () => {
      const result = await createBooking(payload);
      if (result.ok) {
        setSubmission({
          kind: "success",
          bookingId: result.bookingId,
          whatsappUrl: result.whatsappUrl,
          messagePreview: result.messagePreview,
          whenPrimary: whenPrimary ?? "",
          whenSecondary: whenSecondary ?? "",
        });
      } else {
        setSubmission({ kind: "error", message: result.message });
      }
    });
  }

  if (submission.kind === "success") {
    return <BookingSuccess submission={submission} service={service} />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16"
    >
      <input type="hidden" {...register("serviceSlug")} />

      <section className="space-y-12 lg:col-span-7">
        <DayPicker
          weekdayMask={service.weekdayMask}
          selectedDate={selectedDate}
          onSelect={onDaySelect}
          availableDayKeys={DAY_MODE ? availableDayKeys ?? undefined : undefined}
        />

        {!DAY_MODE && (
          <TimeSlotPicker
            serviceSlug={service.slug}
            selectedDate={selectedDate}
            selectedSlotIso={selectedSlotIso}
            onSelect={setSelectedSlotIso}
          />
        )}

        <div className="space-y-5">
          <div>
            <h3 className="font-display text-2xl text-charcoal">Your details</h3>
            <p className="mt-1 text-sm text-muted">
              We&apos;ll send these to the studio by WhatsApp so they can
              confirm.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field
              label="Full name"
              icon={<User className="h-4 w-4 text-rose-500" aria-hidden />}
              error={errors.customerName?.message}
            >
              <input
                {...register("customerName")}
                placeholder="Ada Lovelace"
                className="w-full rounded-2xl border border-line/70 bg-ivory px-4 py-3 text-sm text-charcoal placeholder:text-muted/70 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-300/40"
              />
            </Field>

            <Field
              label="Phone"
              icon={<Phone className="h-4 w-4 text-rose-500" aria-hidden />}
              error={errors.customerPhone?.message}
            >
              <input
                {...register("customerPhone")}
                placeholder="+961 70 000 000"
                inputMode="tel"
                className="w-full rounded-2xl border border-line/70 bg-ivory px-4 py-3 text-sm text-charcoal placeholder:text-muted/70 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-300/40"
              />
            </Field>

            <Field
              label="Email (optional)"
              icon={<Mail className="h-4 w-4 text-rose-500" aria-hidden />}
              error={errors.customerEmail?.message}
            >
              <input
                {...register("customerEmail")}
                type="email"
                placeholder="ada@example.com"
                className="w-full rounded-2xl border border-line/70 bg-ivory px-4 py-3 text-sm text-charcoal placeholder:text-muted/70 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-300/40"
              />
            </Field>

            <Field
              label="Notes (optional)"
              icon={<StickyNote className="h-4 w-4 text-rose-500" aria-hidden />}
              error={errors.notes?.message}
              fullSpan
            >
              <textarea
                {...register("notes")}
                rows={3}
                placeholder="Hair length, inspiration, anything we should know."
                className="w-full resize-none rounded-2xl border border-line/70 bg-ivory px-4 py-3 text-sm text-charcoal placeholder:text-muted/70 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-300/40"
              />
            </Field>
          </div>
        </div>
      </section>

      <aside className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <BookingSummary
            service={service}
            whenPrimary={whenPrimary}
            whenSecondary={whenSecondary}
            selectionMade={selectionMade}
            pending={pending}
            error={
              submission.kind === "error"
                ? submission.message
                : Object.keys(errors).length > 0
                  ? "Please complete the highlighted fields above."
                  : null
            }
          />
        </div>
      </aside>
    </form>
  );
}

function Field({
  label,
  icon,
  error,
  children,
  fullSpan,
}: {
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
  fullSpan?: boolean;
}) {
  return (
    <label className={cn("block space-y-2", fullSpan && "md:col-span-2")}>
      <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-muted">
        {icon}
        {label}
      </span>
      {children}
      {error ? (
        <span className="block text-xs text-rose-700">{error}</span>
      ) : null}
    </label>
  );
}

function BookingSummary({
  service,
  whenPrimary,
  whenSecondary,
  selectionMade,
  pending,
  error,
}: {
  service: ServiceWithCategory;
  whenPrimary: string | null;
  whenSecondary: string | null;
  selectionMade: boolean;
  pending: boolean;
  error: string | null;
}) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-line/60 bg-ivory shadow-soft">
      <div className="relative aspect-[4/3]">
        {service.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.imageUrl}
            alt={service.name}
            style={
              service.imageObjectPosition
                ? { objectPosition: service.imageObjectPosition }
                : undefined
            }
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-rose-200" />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-ivory/90 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-charcoal backdrop-blur">
          {service.category.name}
        </span>
      </div>

      <div className="space-y-5 p-6">
        <header>
          <h3 className="font-display text-2xl text-charcoal">{service.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {service.description}
          </p>
        </header>

        <dl className="space-y-3 border-y border-line/60 py-4 text-sm">
          <div className="flex items-center justify-between">
            <dt className="inline-flex items-center gap-2 text-muted">
              <Clock className="h-4 w-4" aria-hidden /> Duration
            </dt>
            <dd className="font-medium text-charcoal">
              {formatDuration(service.durationMinutes)}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">Price</dt>
            <dd className="font-display text-xl text-rose-600">
              {formatCurrency(service.priceCents)}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="inline-flex items-center gap-2 text-muted">
              <CalendarCheck2 className="h-4 w-4" aria-hidden /> When
            </dt>
            <dd className="text-right font-medium text-charcoal">
              {whenPrimary ? (
                <>
                  <span className="block">{whenPrimary}</span>
                  {whenSecondary ? (
                    <span className="block text-xs text-muted">
                      {whenSecondary}
                    </span>
                  ) : null}
                </>
              ) : (
                <span className="text-muted">
                  {DAY_MODE ? "Pick a day" : "Pick a slot"}
                </span>
              )}
            </dd>
          </div>
        </dl>

        {error ? (
          <p
            role="alert"
            className="rounded-xl bg-rose-100 px-4 py-3 text-xs leading-relaxed text-rose-800"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending || !selectionMade}
          className={cn(
            "inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-medium uppercase tracking-[0.22em] transition",
            selectionMade
              ? "bg-rose-500 text-white shadow-soft hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-70"
              : "cursor-not-allowed bg-line/70 text-charcoal/50",
          )}
        >
          {pending ? (
            "Sending…"
          ) : (
            <>
              Continue to WhatsApp
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </>
          )}
        </button>

        <p className="text-center text-xs leading-relaxed text-muted">
          Your booking is held for 24h while the studio confirms by WhatsApp.
        </p>
      </div>
    </div>
  );
}

function BookingSuccess({
  submission,
  service,
}: {
  submission: Extract<Submission, { kind: "success" }>;
  service: ServiceWithCategory;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="overflow-hidden rounded-[2rem] bg-rose-500 p-10 text-white shadow-lift">
        <div
          aria-hidden
          className="pointer-events-none mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/20"
        >
          <MessageCircle className="h-6 w-6" />
        </div>

        <h2 className="font-display text-4xl leading-tight md:text-5xl">
          Almost there — send your booking on WhatsApp
        </h2>
        <p className="mt-4 max-w-xl text-rose-50/90">
          We&apos;ve drafted a message with all the details. Tap the button
          below to open WhatsApp, then hit send. The studio will confirm or
          reschedule shortly.
        </p>

        <a
          href={submission.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-ivory px-8 py-4 text-sm font-medium uppercase tracking-[0.22em] text-rose-700 transition hover:bg-cream"
        >
          Open WhatsApp
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </a>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 rounded-[1.5rem] border border-line/60 bg-ivory p-6 shadow-soft md:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted">
            Service
          </p>
          <p className="mt-1 font-display text-xl text-charcoal">
            {service.name}
          </p>
          <p className="mt-1 text-xs text-muted">
            {formatDuration(service.durationMinutes)} ·{" "}
            {formatCurrency(service.priceCents)}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted">
            When
          </p>
          <p className="mt-1 font-display text-xl text-charcoal">
            {submission.whenPrimary}
          </p>
          {submission.whenSecondary ? (
            <p className="mt-1 text-xs text-muted">{submission.whenSecondary}</p>
          ) : null}
        </div>
      </div>

      <details className="mt-6 rounded-2xl border border-line/60 bg-ivory p-5">
        <summary className="cursor-pointer text-sm font-medium text-charcoal">
          Preview the WhatsApp message
        </summary>
        <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-cream/70 p-4 text-xs leading-relaxed text-charcoal/80">
{submission.messagePreview}
        </pre>
      </details>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <span>
          Reference:{" "}
          <span className="font-mono text-charcoal/80">
            {submission.bookingId.slice(0, 8)}
          </span>
        </span>
        <Link
          href="/#services"
          className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/20 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.22em] text-charcoal transition hover:border-rose-500 hover:text-rose-600"
        >
          Browse more services
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
