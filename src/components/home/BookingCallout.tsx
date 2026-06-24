import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

export function BookingCallout() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
      <Reveal
        as="div"
        className="relative overflow-hidden rounded-[2.5rem] bg-rose-600 px-6 py-12 text-ivory shadow-lift sm:px-8 sm:py-16 md:px-16 md:py-24"
      >
        {/* paper grain + a hairline frame, in place of the usual glow blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grain opacity-[0.12]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-4 rounded-[2rem] border border-ivory/15 md:inset-6"
        />
        {/* oversized backdrop word as a quiet motif */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-10 -right-2 select-none font-display text-[10rem] italic leading-none text-ivory/10 md:text-[16rem]"
        >
          book.
        </span>

        <div className="relative z-10 flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-3 font-display text-lg italic lowercase text-ivory/75">
              <span aria-hidden className="h-px w-10 bg-ivory/40" />
              ready when you are
            </span>
            <h2 className="mt-5 font-display text-4xl font-light leading-[1.05] tracking-[-0.01em] text-ivory text-balance md:text-6xl">
              Save your spot
              <span className="italic"> in the chair.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ivory/85 text-pretty md:text-lg">
              Choose a service, pick a day, and we&apos;ll confirm on WhatsApp.
              No accounts, no waiting, just a simple reservation.
            </p>
          </div>
          <a
            href="#services"
            className="group inline-flex shrink-0 items-center gap-2.5 rounded-full bg-ivory px-8 py-4 text-sm font-medium text-rose-700 transition hover:bg-cream"
          >
            See services
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
