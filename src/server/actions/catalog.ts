"use server";

import {
  findServiceBySlug as findPlaceholderServiceBySlug,
  listCategories as listPlaceholderCategories,
  listServices as listPlaceholderServices,
} from "@/data/catalog";
import type { Category, Service, ServiceWithCategory } from "@/types/catalog";

export async function getCategories(): Promise<Category[]> {
  return listPlaceholderCategories();
}

export async function getServices(): Promise<Service[]> {
  return listPlaceholderServices();
}

export async function getServiceBySlug(
  slug: string,
): Promise<ServiceWithCategory | null> {
  return findPlaceholderServiceBySlug(slug);
}
