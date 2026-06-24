import Link from "next/link";
import { siteConfig } from "@/config/site";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-ivory/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 md:px-10">
        <Link
          href="/"
          aria-label={`${siteConfig.name} home`}
          className="flex items-baseline gap-2 transition hover:opacity-80"
        >
          <span className="font-display text-2xl tracking-tight text-charcoal sm:text-3xl">
            {siteConfig.name}
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.32em] text-gold-500 md:inline">
            {siteConfig.role}
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-10 md:flex"
        >
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-charcoal/80 transition hover:text-rose-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#services"
            className="hidden items-center justify-center rounded-full border border-rose-500 bg-rose-500 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.22em] text-white transition hover:bg-rose-600 md:inline-flex"
          >
            Book now
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
