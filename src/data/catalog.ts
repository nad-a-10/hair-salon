import {
  ALL_WEEK_MASK,
  Category,
  Service,
  ServiceWithCategory,
} from "@/types/catalog";
import haircutImg from "@/Images/services/haircut.jpeg";
import brushingImg from "@/Images/services/brushing.jpeg";
import wavyImg from "@/Images/services/wavy.jpeg";
import chignonImg from "@/Images/services/chignon.jpeg";
import brideBridesmaidImg from "@/Images/services/bride_and_bridesmaid.jpeg";
import highlightImg from "@/Images/services/highlight.jpeg";
import rootColorImg from "@/Images/services/teinture_racine.jpeg";
import fullColorImg from "@/Images/services/teinture_racine_et_longueur.jpeg";
import rincageImg from "@/Images/services/rincage.jpeg";
import keratinImg from "@/Images/services/keratin_treatment.jpeg";
import collagenImg from "@/Images/services/collagen_treatment.jpeg";
import hairRepairImg from "@/Images/services/hair_repair_treatment.jpeg";
import fourDImg from "@/Images/services/4d_treatment.jpeg";

// Studio is open every day of the week. Adjust if hours change.
const OPEN_DAYS = ALL_WEEK_MASK;

export const PLACEHOLDER_CATEGORIES: Category[] = [
  {
    id: "cat-hair",
    slug: "hair",
    name: "Hair",
    blurb:
      "Cuts, color, blowouts, updos, and restorative treatments by a dedicated stylist.",
    sortOrder: 1,
  },
];

export const PLACEHOLDER_SERVICES: Service[] = [
  {
    id: "srv-haircut",
    categoryId: "cat-hair",
    slug: "haircut",
    name: "Haircut",
    description: "A precision cut and finish tailored to your hair and face.",
    priceCents: 4000,
    durationMinutes: 45,
    imageUrl: haircutImg.src,
    weekdayMask: OPEN_DAYS,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "srv-brushing",
    categoryId: "cat-hair",
    slug: "brushing",
    name: "Brushing (Blowout)",
    description: "A smooth, voluminous blow-dry for a polished finish.",
    priceCents: 1000,
    priceMaxCents: 1500,
    durationMinutes: 45,
    imageUrl: brushingImg.src,
    weekdayMask: OPEN_DAYS,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "srv-waves",
    categoryId: "cat-hair",
    slug: "waves",
    name: "Waves",
    description: "Soft, lasting waves styled to your liking.",
    priceCents: 2000,
    durationMinutes: 60,
    imageUrl: wavyImg.src,
    weekdayMask: OPEN_DAYS,
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "srv-chignon",
    categoryId: "cat-hair",
    slug: "chignon",
    name: "Chignon (Updo)",
    description: "An elegant updo for weddings, events, and special evenings.",
    priceCents: 5000,
    durationMinutes: 60,
    imageUrl: chignonImg.src,
    weekdayMask: OPEN_DAYS,
    isActive: true,
    sortOrder: 4,
  },
  {
    id: "srv-bridal-hair",
    categoryId: "cat-hair",
    slug: "bridal-bridesmaid-hair",
    name: "Bridal & Bridesmaid Hair",
    description: "Bridal styling for the wedding day, with bridesmaid looks on request.",
    priceCents: 30000,
    durationMinutes: 120,
    imageUrl: brideBridesmaidImg.src,
    weekdayMask: OPEN_DAYS,
    isActive: true,
    sortOrder: 5,
  },
  {
    id: "srv-highlights",
    categoryId: "cat-hair",
    slug: "highlights",
    name: "Highlights",
    description: "Hand-placed highlights for dimension and brightness.",
    priceCents: 8000,
    priceMaxCents: 10000,
    durationMinutes: 120,
    imageUrl: highlightImg.src,
    weekdayMask: OPEN_DAYS,
    isActive: true,
    sortOrder: 6,
  },
  {
    id: "srv-root-color",
    categoryId: "cat-hair",
    slug: "root-color",
    name: "Root Color",
    description: "A clean root touch-up to refresh your color.",
    priceCents: 4000,
    durationMinutes: 60,
    imageUrl: rootColorImg.src,
    weekdayMask: OPEN_DAYS,
    isActive: true,
    sortOrder: 7,
  },
  {
    id: "srv-full-color",
    categoryId: "cat-hair",
    slug: "full-color",
    name: "Full Color (Roots + Lengths)",
    description: "All-over color from roots through the lengths.",
    priceCents: 5000,
    durationMinutes: 120,
    imageUrl: fullColorImg.src,
    weekdayMask: OPEN_DAYS,
    isActive: true,
    sortOrder: 8,
  },
  {
    id: "srv-gloss",
    categoryId: "cat-hair",
    slug: "gloss",
    name: "Gloss / Rinçage",
    description: "A glossing rinse that revives shine and tone.",
    priceCents: 3000,
    durationMinutes: 45,
    imageUrl: rincageImg.src,
    weekdayMask: OPEN_DAYS,
    isActive: true,
    sortOrder: 9,
  },
  {
    id: "srv-keratin",
    categoryId: "cat-hair",
    slug: "keratin-treatment",
    name: "Keratin Treatment",
    description: "A smoothing keratin treatment that tames frizz for weeks.",
    priceCents: 15000,
    priceMaxCents: 20000,
    durationMinutes: 120,
    imageUrl: keratinImg.src,
    weekdayMask: OPEN_DAYS,
    isActive: true,
    sortOrder: 10,
  },
  {
    id: "srv-collagen",
    categoryId: "cat-hair",
    slug: "collagen-treatment",
    name: "Collagen Treatment",
    description: "A collagen treatment that softens and strengthens the hair.",
    priceCents: 10000,
    priceMaxCents: 15000,
    durationMinutes: 90,
    imageUrl: collagenImg.src,
    weekdayMask: OPEN_DAYS,
    isActive: true,
    sortOrder: 11,
  },
  {
    id: "srv-hair-repair",
    categoryId: "cat-hair",
    slug: "hair-repair-treatment",
    name: "Hair Repair Treatment",
    description: "A restorative treatment for dry or damaged hair.",
    priceCents: 6000,
    priceMaxCents: 8000,
    durationMinutes: 60,
    imageUrl: hairRepairImg.src,
    weekdayMask: OPEN_DAYS,
    isActive: true,
    sortOrder: 12,
  },
  {
    id: "srv-4d",
    categoryId: "cat-hair",
    slug: "4d-treatment",
    name: "4D Treatment",
    description: "An intensive 4D treatment for deep repair and shine.",
    priceCents: 8000,
    priceMaxCents: 10000,
    durationMinutes: 90,
    imageUrl: fourDImg.src,
    weekdayMask: OPEN_DAYS,
    isActive: true,
    sortOrder: 13,
  },
];

export function listCategories(): Category[] {
  return [...PLACEHOLDER_CATEGORIES].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function listServices(): Service[] {
  return [...PLACEHOLDER_SERVICES]
    .filter((s) => s.isActive)
    .sort((a, b) => {
      if (a.categoryId !== b.categoryId) {
        const catA = PLACEHOLDER_CATEGORIES.find((c) => c.id === a.categoryId)?.sortOrder ?? 0;
        const catB = PLACEHOLDER_CATEGORIES.find((c) => c.id === b.categoryId)?.sortOrder ?? 0;
        if (catA !== catB) return catA - catB;
      }
      return a.sortOrder - b.sortOrder;
    });
}

export function listServicesByCategory(categorySlug: string): Service[] {
  const category = PLACEHOLDER_CATEGORIES.find((c) => c.slug === categorySlug);
  if (!category) return [];
  return listServices().filter((s) => s.categoryId === category.id);
}

export function findServiceBySlug(slug: string): ServiceWithCategory | null {
  const service = PLACEHOLDER_SERVICES.find((s) => s.slug === slug && s.isActive);
  if (!service) return null;
  const category = PLACEHOLDER_CATEGORIES.find((c) => c.id === service.categoryId);
  if (!category) return null;
  return { ...service, category };
}
