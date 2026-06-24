import { listCategories, listServices } from "@/data/catalog";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

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
      <Reveal as="div" className="mb-12 max-w-2xl">
        <header>
          <SectionLabel>the menu</SectionLabel>
          <h2 className="mt-5 font-display text-4xl font-light leading-[1.05] tracking-[-0.01em] text-charcoal md:text-6xl">
            Cuts, color &amp; quiet
            <span className="italic text-rose-600"> care</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Pick what you&apos;re after and choose a day. Every booking is
            confirmed personally over WhatsApp, and your spot is held for 24
            hours while we reply.
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
