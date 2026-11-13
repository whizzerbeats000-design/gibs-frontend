/**
 * Shared programme category values.
 *
 * Kept separate from src/lib/data.ts so that src/lib/categoryUtils.ts (which is
 * imported by the always-rendered App shell) does not pull the 394 KB programme
 * catalogue into the initial bundle. The same values are also declared in
 * data.ts for catalogue-consuming modules (lazy-loaded routes).
 */
export const PROGRAM_CATEGORIES: readonly string[] = [
  "All",
  "Accounting and Financial Management",
  "General Administration and Management",
  "Telecom & Utilities Regulation",
  "Consumer Protection & Utilities",
  "Environmental Sustainability & Management",
  "Oil & Gas Sector",
  "Secretarial Administration & Management",
  "Capital Market & Securities Management",
  "Information Technology Workshops",
  "Legal & Legislative Studies",
  "Power & Energy Sector",
  "Maritime & Transportation",
  "Pension Management",
  "Special Executive Training",
  "Foreign Executive Training",
];
