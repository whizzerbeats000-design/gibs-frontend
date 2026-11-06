/**
 * Minimal static institutional data needed by the application chrome
 * (header, footer, and other always-rendered components).
 *
 * This module intentionally does NOT import src/lib/data.ts so that the
 * main entry bundle remains free of the 394 KB programme catalogue. Pages
 * that need the full catalogue (Programmes, ProgrammeDetail, ExecutiveEd,
 * Admissions, Contact, Concierge) are lazy-loaded and can import data.ts
 * from within their own code-split chunk.
 *
 * The phone-number list here must stay in sync with INSTITUTIONAL_DATA in
 * src/lib/data.ts. The shared retirement policy in src/lib/phones.ts
 * handles active-number filtering, so adding a number here AND in data.ts
 * is the correct dual-source update procedure.
 */

/** Raw phone numbers as stored in INSTITUTIONAL_DATA.phoneNumbers */
export const CHROME_PHONE_NUMBERS: readonly string[] = [
  "08160010401",
  "08033429427",
  "08186464474",
  "08032296041",
  "07085792767",
];
