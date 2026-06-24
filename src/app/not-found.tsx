import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-center">
      <span className="text-[11px] uppercase tracking-[0.32em] text-gold-500">
        404
      </span>
      <h1 className="mt-4 font-display text-6xl leading-tight text-charcoal md:text-7xl">
        This page slipped away
      </h1>
      <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
        The page you&apos;re looking for doesn&apos;t exist (yet). Head back to
        the homepage or browse our services.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.22em] text-white shadow-soft transition hover:bg-rose-600"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back home
        </Link>
        <Link
          href="/#services"
          className="inline-flex items-center gap-2 rounded-full border border-charcoal/20 px-6 py-3.5 text-sm font-medium uppercase tracking-[0.22em] text-charcoal transition hover:border-rose-500 hover:text-rose-600"
        >
          Browse services
        </Link>
      </div>
    </div>
  );
}
