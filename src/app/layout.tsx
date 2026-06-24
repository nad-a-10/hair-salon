import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import { BrandLoader } from "@/components/splash/BrandLoader";
import { siteConfig } from "@/config/site";
import "./globals.css";

// Body: a warm humanist grotesk — quiet, legible, not Inter.
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

// Display: Fraunces, a soft old-style serif with real character and italics.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} · ${siteConfig.role}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ivory text-charcoal">
        <BrandLoader />
        {children}
      </body>
    </html>
  );
}
