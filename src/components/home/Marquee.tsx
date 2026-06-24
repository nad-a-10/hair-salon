const WORDS = [
  "cuts",
  "color",
  "blow-dry",
  "highlights",
  "treatments",
  "chignon",
  "bridal",
  "keratin",
];

/**
 * A slow word ribbon drifting between sections — a quiet sign of life that
 * doubles as a second look at the service vocabulary. The list is duplicated
 * so the CSS marquee loops seamlessly (track translates by -50%).
 */
export function Marquee() {
  return (
    <div
      aria-hidden
      className="overflow-hidden border-y border-line/60 bg-cream/40 py-7 md:py-9"
    >
      <div className="marquee-track flex w-max items-center gap-12">
        {[...WORDS, ...WORDS].map((word, i) => (
          <span
            key={i}
            className="flex items-center gap-12 whitespace-nowrap font-display text-3xl italic lowercase text-charcoal/30 md:text-4xl"
          >
            {word}
            <span className="text-base not-italic text-rose-400">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
