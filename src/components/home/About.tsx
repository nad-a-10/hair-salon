import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import portraitImg from "@/Images/services/brushing.jpeg";

export function About() {
  return (
    <section
      id="about"
      className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24 md:px-10 md:py-32"
    >
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        <Reveal as="div" className="md:col-span-5">
          <figure className="group relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] rounded-bl-[5rem] shadow-lift ring-1 ring-line">
              <Image
                src={portraitImg}
                alt={`${siteConfig.name} studio`}
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                className="ken-burns object-cover"
                placeholder="blur"
              />
            </div>
            <figcaption className="mt-4 flex items-center gap-3 font-display text-base italic text-muted">
              <span aria-hidden className="h-px w-8 bg-gold-400/70" />
              in the studio
            </figcaption>
          </figure>
        </Reveal>

        <Reveal
          as="div"
          index={1}
          className="flex flex-col justify-center md:col-span-6 md:col-start-7"
        >
          <SectionLabel>the studio</SectionLabel>
          <h2 className="mt-5 font-display text-4xl font-light leading-[1.08] tracking-[-0.01em] text-charcoal md:text-5xl">
            One chair, full attention, and hair that suits
            <span className="italic text-rose-600"> you.</span>
          </h2>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-muted text-pretty md:text-lg">
            Elie runs a quiet, one-on-one studio in Zalka, cuts, color, and
            treatments shaped around your hair and the way you actually live with
            it. No conveyor belt, no upselling: just a proper consultation and an
            unhurried hour or two that&apos;s entirely yours.
          </p>

          <blockquote className="mt-9 border-l-2 border-rose-300 pl-6 font-display text-2xl italic leading-snug text-charcoal md:text-3xl">
            &ldquo;Good hair is never rushed.&rdquo;
            <footer className="mt-3 font-sans text-sm not-italic tracking-wide text-muted">
              — Elie
            </footer>
          </blockquote>

          <p className="mt-9 max-w-xl text-base leading-relaxed text-muted text-pretty">
            Booking is simple: choose a service, pick a day, and confirm over
            WhatsApp. Only a few appointments are taken each day, so the chair is
            always genuinely yours.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
