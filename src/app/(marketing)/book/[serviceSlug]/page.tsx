import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BookingFlow } from "@/components/services/booking/BookingFlow";
import { getServiceBySlug } from "@/server/actions/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ serviceSlug: string }>;
}) {
  const { serviceSlug } = await params;
  const service = await getServiceBySlug(serviceSlug);
  if (!service) return { title: "Book" };
  return {
    title: `Book ${service.name}`,
    description: `Reserve a day for ${service.name} at our hair studio.`,
  };
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ serviceSlug: string }>;
}) {
  const { serviceSlug } = await params;
  const service = await getServiceBySlug(serviceSlug);
  if (!service) notFound();

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
      <Link
        href="/#services"
        className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-muted transition hover:text-rose-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        Back to services
      </Link>

      <header className="mt-6 max-w-3xl">
        <span className="text-[11px] uppercase tracking-[0.32em] text-gold-500">
          {service.category.name}
        </span>
        <h1 className="mt-3 font-display text-5xl leading-[1.05] text-charcoal md:text-6xl">
          Book {service.name}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted md:text-lg text-pretty">
          Pick a day, share a few details, and we&apos;ll forward your request
          to the studio on WhatsApp. Your booking is held for 24h while we
          confirm.
        </p>
      </header>

      <div className="mt-12">
        <BookingFlow service={service} />
      </div>
    </section>
  );
}
