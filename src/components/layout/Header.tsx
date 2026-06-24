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
          className="flex items-baseline gap-2.5 transition hover:opacity-80"
        >
          <span className="font-display text-2xl font-medium tracking-tight text-charcoal sm:text-3xl">
            {siteConfig.name}
          </span>
          <span className="hidden font-display text-base italic lowercase text-rose-600 md:inline">
            hair studio
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/#services"
            className="hidden items-center justify-center rounded-full bg-rose-500 px-6 py-2.5 text-sm font-medium text-ivory transition hover:bg-rose-600 md:inline-flex"
          >
            Book now
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
