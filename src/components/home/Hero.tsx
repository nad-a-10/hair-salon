import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Scissors } from "lucide-react";
import { siteConfig } from "@/config/site";
import heroImg from "@/Images/services/wavy.jpeg";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-charcoal text-ivory">
      <div
        className="pointer-events-none absolute inset-0 bg-grain opacity-20"
        aria-hidden
      />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-16 md:grid-cols-12 md:gap-16 md:px-10 md:pb-28 md:pt-24">
        <div className="flex flex-col justify-center md:col-span-6 lg:col-span-7">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-rose-400/40 bg-white/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-rose-300">
            <Scissors className="h-3.5 w-3.5" aria-hidden />
            {siteConfig.role}
          </span>
          <h1 className="mt-7 font-display text-5xl leading-[1.05] text-ivory text-balance md:text-6xl lg:text-7xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/70 text-pretty md:text-lg">
            {siteConfig.description}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="#services"
              className="group inline-flex items-center gap-2 rounded-full bg-rose-500 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.22em] text-white shadow-soft transition hover:bg-rose-400"
            >
              Book a service
              <ArrowUpRight
                className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
            <Link
              href="#gallery"
              className="inline-flex items-center gap-2 rounded-full border border-ivory/25 px-6 py-3.5 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:border-rose-400 hover:text-rose-300"
            >
              View work
            </Link>
          </div>
        </div>

        <div className="md:col-span-6 lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-lift">
            <Image
              src={heroImg}
              alt={`${siteConfig.name} hair styling`}
              fill
              sizes="(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
              placeholder="blur"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
