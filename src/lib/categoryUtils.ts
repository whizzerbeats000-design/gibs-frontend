import { PROGRAM_CATEGORIES, type ProgrammeCategory } from "./data.ts";

/**
 * Deterministic category slugification shared across build generation
 * and client-side routing.
 * Normalizes ampersands to 'and', strips punctuation, and produces clean URL-safe slugs.
 */
export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * All valid programme categories from the catalogue (excluding "All").
 * Derived directly from PROGRAM_CATEGORIES in data.ts.
 */
export const VALID_CATEGORIES: ProgrammeCategory[] = PROGRAM_CATEGORIES.filter(
  (c): c is ProgrammeCategory => c !== "All"
);

/**
 * Resolves a URL slug to its canonical catalogue category name.
 * Returns undefined if the slug does not match any known category.
 */
export function slugToCategory(slug: string): ProgrammeCategory | undefined {
  if (!slug) return undefined;
  let decoded: string;
  try {
    decoded = decodeURIComponent(slug).toLowerCase();
  } catch {
    return undefined;
  }
  return VALID_CATEGORIES.find((cat) => categoryToSlug(cat) === decoded);
}
