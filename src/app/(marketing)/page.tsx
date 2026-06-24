import { Hero } from "@/components/home/Hero";
import { ServicesSection } from "@/components/home/ServicesSection";
import { Gallery } from "@/components/home/Gallery";
import { About } from "@/components/home/About";
import { BookingCallout } from "@/components/home/BookingCallout";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <Gallery />
      <About />
      <BookingCallout />
    </>
  );
}
