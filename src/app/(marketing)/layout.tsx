import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollTrack } from "@/components/layout/ScrollTrack";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <ScrollTrack />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
