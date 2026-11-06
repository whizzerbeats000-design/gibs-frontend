import { type ProgrammeCategory } from "../types/data.ts";
import { PROGRAM_CATEGORIES } from "./categories.ts";

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
 * Human-readable category heading with a consistent "... Programmes" suffix.
 *
 * Several catalogue category names already end in "Training" (e.g. "Special
 * Executive Training"). Naively appending " Training Programmes" produced a
 * doubled "Special Executive Training Training Programmes". This helper avoids
 * the duplication: categories ending in "Training" only gain the " Programmes"
 * suffix, while all others gain the full " Training Programmes".
 *
 * The underlying category name and its slug are unchanged, so this is a purely
 * presentational fix that touches no identifiers and no URLs.
 */
export function formatCategoryDisplayName(category: string): string {
  const trimmed = (category || "").trim();
  if (!trimmed) return "Training Programmes";
  if (/Training$/i.test(trimmed)) return `${trimmed} Programmes`;
  return `${trimmed} Training Programmes`;
}

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
