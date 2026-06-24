import Image, { type StaticImageData } from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/utils";
import highlightImg from "@/Images/services/highlight.jpeg";
import chignonImg from "@/Images/services/chignon.jpeg";
import wavyImg from "@/Images/services/wavy.jpeg";
import brushingImg from "@/Images/services/brushing.jpeg";
import haircutImg from "@/Images/services/haircut.jpeg";
import fourDImg from "@/Images/services/4d_treatment.jpeg";

// span is the desktop bento footprint; the order tessellates a 4-col grid.
const SHOTS: { src: StaticImageData; alt: string; span: string }[] = [
  { src: highlightImg, alt: "Highlights", span: "md:col-span-2 md:row-span-2" },
  { src: chignonImg, alt: "Chignon updo", span: "md:col-span-2" },
  { src: wavyImg, alt: "Waves", span: "" },
  { src: brushingImg, alt: "Blowout", span: "" },
  { src: haircutImg, alt: "Haircut", span: "md:col-span-2" },
  { src: fourDImg, alt: "Treatment shine", span: "md:col-span-2" },
];

export function Gallery() {
  return (
    <section
      id="gallery"
      className="scroll-mt-24 bg-charcoal text-ivory"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <Reveal as="div" className="mb-12 max-w-2xl">
          <header>
            <SectionLabel tone="light">from the chair</SectionLabel>
            <h2 className="mt-5 font-display text-4xl font-light leading-[1.05] tracking-[-0.01em] text-ivory md:text-6xl">
              A few we&apos;re
              <span className="italic text-rose-300"> proud of</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ivory/70">
              Cuts, color, and finishes, photographed as they left the studio.
            </p>
          </header>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:auto-rows-[12rem] md:grid-cols-4 md:grid-flow-dense">
          {SHOTS.map((shot, i) => (
            <Reveal
              as="div"
              key={i}
              index={i}
              className={cn(
                "group relative aspect-square overflow-hidden rounded-[1.25rem] ring-1 ring-ivory/10 md:aspect-auto md:h-full",
                shot.span,
              )}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(min-width: 768px) 45vw, 45vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
                placeholder="blur"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
