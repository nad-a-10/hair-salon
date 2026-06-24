import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/motion/Reveal";
import heroImg from "@/Images/services/wavy.jpeg";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-charcoal text-ivory"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-grain opacity-20"
        aria-hidden
      />
      {/* Warm light pooling from the upper-right, for depth on the dark ground. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(120% 80% at 85% 0%, rgba(168,101,75,0.22), transparent 55%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-20 md:grid-cols-12 md:gap-10 md:px-10 md:pb-32 md:pt-28">
        <div className="flex flex-col md:col-span-7 lg:col-span-6">
          <Reveal as="div" index={0}>
            <p className="text-xs uppercase tracking-[0.3em] text-ivory/55">
              Hair Studio · Zalka, Lebanon
            </p>
          </Reveal>
          <Reveal as="div" index={1}>
            <h1 className="mt-6 font-display text-[3.25rem] font-light leading-[0.98] tracking-[-0.02em] text-ivory text-balance md:text-7xl lg:text-[5.5rem]">
              Hair that feels
              <br />
              like <em className="italic text-rose-300">you.</em>
            </h1>
          </Reveal>
          <Reveal as="div" index={2}>
            <p className="mt-8 max-w-md text-base leading-relaxed text-ivory/70 text-pretty md:text-lg">
              A one-on-one studio in Zalka for cuts, color, and treatments —
              unhurried, personal, and done with real care. Pick a day, and
              we&apos;ll take it from there.
            </p>
          </Reveal>
          <Reveal
            as="div"
            index={3}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            <a
              href="#services"
              className="group inline-flex items-center gap-2.5 rounded-full bg-rose-500 px-8 py-4 text-sm font-medium text-ivory shadow-soft transition hover:bg-rose-400"
            >
              Book a service
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </a>
            <a
              href="#gallery"
              className="group inline-flex items-center gap-2 text-sm text-ivory/85 transition hover:text-rose-300"
            >
              <span className="border-b border-ivory/30 pb-0.5 transition group-hover:border-rose-300">
                See the work
              </span>
            </a>
          </Reveal>
        </div>

        {/* Offset, framed portrait — asymmetric and slightly lower than the text. */}
        <Reveal
          as="div"
          index={2}
          className="md:col-span-5 md:col-start-8 md:mt-16 lg:col-start-8"
        >
          <figure className="group relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] rounded-tr-[5rem] ring-1 ring-ivory/15">
              <Image
                src={heroImg}
                alt={`${siteConfig.name} hair styling`}
                fill
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 45vw, 100vw"
                className="object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.04]"
                placeholder="blur"
                priority
              />
            </div>
            <figcaption className="mt-4 flex items-center gap-3 font-display text-base italic text-ivory/60">
              <span aria-hidden className="h-px w-8 bg-gold-400/50" />
              at the chair
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
