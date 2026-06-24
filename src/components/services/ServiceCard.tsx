import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { formatCurrency, formatDuration } from "@/lib/utils";
import type { Service } from "@/types/catalog";

interface Props {
  service: Service;
  categoryName: string;
}

export function ServiceCard({ service, categoryName }: Props) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-line/60 bg-ivory shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {service.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.imageUrl}
            alt={service.name}
            style={
              service.imageObjectPosition
                ? { objectPosition: service.imageObjectPosition }
                : undefined
            }
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-rose-100 via-rose-200 to-rose-300" />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-ivory/90 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-charcoal backdrop-blur">
          {categoryName}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <header className="space-y-2">
          <h3 className="font-display text-2xl leading-tight text-charcoal">
            {service.name}
          </h3>
          <p className="text-sm leading-relaxed text-muted">
            {service.description}
          </p>
        </header>

        <div className="mt-auto flex items-end justify-between gap-4 pt-2">
          <div>
            <div className="font-display text-2xl text-rose-600">
              {formatCurrency(service.priceCents)}
            </div>
            <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {formatDuration(service.durationMinutes)}
            </div>
          </div>
          <Link
            href={`/book/${service.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-charcoal px-5 py-2.5 text-xs font-medium uppercase tracking-[0.22em] text-ivory transition hover:bg-rose-600"
          >
            Book
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
