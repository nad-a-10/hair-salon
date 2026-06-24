import { PLACEHOLDER_SERVICES } from "@/data/catalog";

/**
 * A resource pool models booking capacity. Bookings only compete for capacity
 * within the same pool. For this studio there is a single hair pool that
 * accepts up to 3 bookings per day (day-only mode) or 3 concurrent (timed).
 */
export interface ResourcePool {
  key: string;
  capacity: number;
}

export const HAIR_POOL: ResourcePool = { key: "hair", capacity: 3 };

const CATEGORY_POOLS: Record<string, ResourcePool> = {
  "cat-hair": HAIR_POOL,
};

export function poolForCategoryId(categoryId: string | undefined): ResourcePool {
  if (categoryId && CATEGORY_POOLS[categoryId]) return CATEGORY_POOLS[categoryId];
  return HAIR_POOL;
}

/** Resolve a booking's pool from its stored service id. */
export function poolForServiceId(serviceId: string): ResourcePool {
  const service = PLACEHOLDER_SERVICES.find((s) => s.id === serviceId);
  return poolForCategoryId(service?.categoryId);
}
