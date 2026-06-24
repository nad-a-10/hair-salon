import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

export function BookingCallout() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
      <Reveal as="div" className="relative overflow-hidden rounded-[2.5rem] bg-rose-500 px-6 py-10 text-white shadow-lift sm:px-8 sm:py-14 md:px-16 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 18% 20%, rgba(255,255,255,0.4), transparent 45%), radial-gradient(circle at 80% 80%, rgba(23,19,15,0.45), transparent 55%)",
          }}
        />
        <div className="relative z-10 flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.32em] text-white/80">
              Ready when you are
            </span>
            <h2 className="mt-4 font-display text-4xl leading-[1.1] text-white text-balance md:text-5xl lg:text-6xl">
              Book your chair today.
            </h2>
            <p className="mt-5 max-w-xl text-base text-white/90 text-pretty md:text-lg">
              Choose a service, pick a day, and we&apos;ll confirm on WhatsApp.
              No accounts, no waiting, just a simple reservation.
            </p>
          </div>
          <a
            href="#services"
            className="group inline-flex items-center gap-3 self-start rounded-full bg-ivory px-8 py-4 text-sm font-medium uppercase tracking-[0.22em] text-rose-700 transition hover:bg-cream md:self-auto"
          >
            See services
            <ArrowUpRight
              className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
