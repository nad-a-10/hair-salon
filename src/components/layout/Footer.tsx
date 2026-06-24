import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.43-4.92 8.43-9.94Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="scroll-mt-24 mt-24 border-t border-line/60 bg-cream/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-3 md:px-10">
        <div className="space-y-4">
          <span className="block font-display text-3xl font-medium text-charcoal">
            {siteConfig.name}
          </span>
          <p className="font-display text-base italic lowercase text-rose-600">
            hair studio · {siteConfig.tagline}
          </p>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            {siteConfig.description}
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-display text-xl italic lowercase text-charcoal">
            visit
          </h4>
          <address className="not-italic text-sm leading-relaxed text-charcoal/80">
            {siteConfig.contact.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <a
            href={siteConfig.contact.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-rose-600 underline-offset-4 transition hover:underline"
          >
            <MapPin className="h-4 w-4" aria-hidden />
            View on Google Maps
          </a>
          <p className="text-sm leading-relaxed text-charcoal/80">
            <span className="block">{siteConfig.hours.weekdays}</span>
            <span className="block">{siteConfig.hours.sunday}</span>
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-display text-xl italic lowercase text-charcoal">
            reach us
          </h4>
          <ul className="space-y-3 text-sm text-charcoal/80">
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-rose-500" aria-hidden />
              <a
                href={`tel:${siteConfig.contact.whatsappE164}`}
                className="transition hover:text-rose-600"
              >
                {siteConfig.contact.phoneDisplay}{" "}
                <span className="text-muted">· mobile / WhatsApp</span>
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-rose-500" aria-hidden />
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="break-all transition hover:text-rose-600"
              >
                {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <InstagramIcon className="h-4 w-4 text-rose-500" />
              <a
                href={siteConfig.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-rose-600"
              >
                {siteConfig.contact.instagramHandle} · Instagram
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FacebookIcon className="h-4 w-4 text-rose-500" />
              <a
                href={siteConfig.contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-rose-600"
              >
                {siteConfig.contact.facebookLabel} · Facebook
              </a>
            </li>
          </ul>
          <Link
            href="/#services"
            className="mt-4 inline-flex items-center justify-center rounded-full border border-charcoal/20 px-6 py-2.5 text-sm font-medium text-charcoal transition hover:border-rose-500 hover:bg-rose-500 hover:text-ivory"
          >
            Book a visit
          </Link>
        </div>
      </div>

      <div className="border-t border-line/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-muted md:flex-row md:px-10">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </span>
          <span className="font-display text-sm italic lowercase text-rose-600">
            {siteConfig.tagline}
          </span>
        </div>
      </div>
    </footer>
  );
}
