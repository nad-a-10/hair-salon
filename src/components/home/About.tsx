import Image from "next/image";
import { siteConfig } from "@/config/site";
import portraitImg from "@/Images/services/brushing.jpeg";

export function About() {
  return (
    <section
      id="about"
      className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20 md:px-10 md:py-28"
    >
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift">
            <Image
              src={portraitImg}
              alt={`${siteConfig.name} studio`}
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover"
              placeholder="blur"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center md:col-span-7">
          <span className="text-[11px] uppercase tracking-[0.32em] text-gold-500">
            About
          </span>
          <h2 className="mt-3 font-display text-4xl leading-[1.08] text-charcoal md:text-5xl">
            A dedicated chair for hair that feels like you
          </h2>
          {/* TODO: replace with the stylist's real story. */}
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted text-pretty md:text-lg">
            {siteConfig.name} is a one-on-one hair studio focused on cuts,
            color, and treatments that suit your hair and your routine. Every
            appointment is unhurried and personal, from the first consultation
            to the final finish.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted text-pretty md:text-lg">
            Booking is simple: choose a service, pick a day, and confirm by
            WhatsApp. A limited number of appointments are taken each day so you
            always get full attention.
          </p>
        </div>
      </div>
    </section>
  );
}
