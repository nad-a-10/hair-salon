import { listCategories, listServices } from "@/data/catalog";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Reveal } from "@/components/motion/Reveal";

export function ServicesSection() {
  const services = listServices();
  const categories = listCategories();
  const nameFor = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? "";

  return (
    <section
      id="services"
      className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20 md:px-10 md:py-28"
    >
      <Reveal as="div" className="mb-10 max-w-2xl">
        <header>
          <span className="text-[11px] uppercase tracking-[0.32em] text-gold-500">
            Services
          </span>
          <h2 className="mt-3 font-display text-4xl text-charcoal md:text-5xl">
            Cuts, color &amp; care
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Choose a service to book your day. Each booking is confirmed by
            WhatsApp, and your spot is held for 24 hours while we reply.
          </p>
        </header>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <Reveal as="div" key={service.id} index={i} className="h-full">
            <ServiceCard
              service={service}
              categoryName={nameFor(service.categoryId)}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
