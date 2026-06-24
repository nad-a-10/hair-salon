import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Service } from "@/types/catalog";

interface Props {
  service: Service;
  categoryName: string;
}

export function ServiceCard({ service, categoryName }: Props) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-line/60 bg-ivory shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
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
        <span className="absolute left-4 top-4 rounded-full bg-ivory/90 px-3.5 py-1 font-display text-sm italic lowercase text-charcoal/80 backdrop-blur">
          {categoryName}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <header className="space-y-2">
          <h3 className="font-display text-2xl font-light leading-tight text-charcoal">
            {service.name}
          </h3>
          <p className="text-sm leading-relaxed text-muted">
            {service.description}
          </p>
        </header>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-line/70 pt-4">
          <div className="font-display text-2xl text-rose-600">
            {formatPrice(service.priceCents, service.priceMaxCents)}
          </div>
          <Link
            href={`/book/${service.slug}`}
            className="group/btn inline-flex items-center gap-2 rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-ivory transition hover:bg-rose-600"
          >
            Book
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover/btn:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
