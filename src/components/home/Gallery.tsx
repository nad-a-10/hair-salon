import Image, { type StaticImageData } from "next/image";
import highlightImg from "@/Images/services/highlight.jpeg";
import chignonImg from "@/Images/services/chignon.jpeg";
import wavyImg from "@/Images/services/wavy.jpeg";
import brushingImg from "@/Images/services/brushing.jpeg";
import haircutImg from "@/Images/services/haircut.jpeg";
import fourDImg from "@/Images/services/4d_treatment.jpeg";

const SHOTS: { src: StaticImageData; alt: string }[] = [
  { src: highlightImg, alt: "Highlights" },
  { src: chignonImg, alt: "Chignon updo" },
  { src: wavyImg, alt: "Waves" },
  { src: brushingImg, alt: "Blowout" },
  { src: haircutImg, alt: "Haircut" },
  { src: fourDImg, alt: "Treatment shine" },
];

export function Gallery() {
  return (
    <section
      id="gallery"
      className="scroll-mt-24 bg-charcoal text-ivory"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <header className="mb-10 max-w-2xl">
          <span className="text-[11px] uppercase tracking-[0.32em] text-rose-300">
            Gallery
          </span>
          <h2 className="mt-3 font-display text-4xl text-ivory md:text-5xl">
            Recent work
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ivory/70">
            A glimpse of cuts, color, and finishes from the chair.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {SHOTS.map((shot, i) => (
            <div
              key={i}
              className="relative aspect-square overflow-hidden rounded-[1.25rem]"
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(min-width: 768px) 30vw, 45vw"
                className="object-cover transition duration-700 hover:scale-[1.04]"
                placeholder="blur"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
