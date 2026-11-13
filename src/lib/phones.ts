/**
 * GIBS contact-number policy — the single source of truth for which phone
 * numbers may be published, and for scrubbing retired ones out of
 * data.ts-sourced prose.
 *
 * WHY THIS EXISTS
 * ---------------
 * `src/lib/data.ts` is byte-locked (SHA-256 910ff4d7…). It still lists two
 * retired desk numbers in `INSTITUTIONAL_DATA.phoneNumbers`, and one retired
 * number inside a free-text FAQ answer. The file cannot be edited, so the
 * retirement has to be enforced in the render layer.
 *
 * Before this module the same retirement list was duplicated in three places
 * — `src/pages/Contact.tsx`, `src/lib/concierge.ts` and `scripts/seo-gen.mjs` —
 * and each copy only filtered the `phoneNumbers` array. That left the
 * free-text FAQ answer uncovered: the Admissions page happened to hide it
 * behind a one-off string-equality override on the FAQ *question*, which is
 * exactly the kind of brittle special case that drifts. This module replaces
 * all three copies with one implementation and covers both the structured
 * list and the prose.
 *
 * The policy is deliberately narrow. It is applied at the point where
 * content becomes user-visible, never as a global string replacement over a
 * whole document, so unrelated text is left untouched.
 */

/**
 * Numbers that GIBS has retired. They must never be published, in any
 * rendered output, on any route, or in any generated static shell.
 */
export const RETIRED_PHONE_NUMBERS: ReadonlySet<string> = new Set([
  "08033429427",
  "08032296041",
]);

/**
 * The current official training-desk number. It is not present in
 * `data.ts`, so it is appended to the published list explicitly.
 */
export const CURRENT_TRAINING_DESK_NUMBER = "08160010400";

/**
 * The published phone list, derived from `data.ts` with the retired numbers
 * removed and the current training-desk number appended.
 *
 * @param phoneNumbers the raw `phoneNumbers` array from `data.ts`
 */
export function activePhoneNumbers(phoneNumbers: readonly string[]): string[] {
  const active = phoneNumbers.filter((n) => !RETIRED_PHONE_NUMBERS.has(n));
  if (!active.includes(CURRENT_TRAINING_DESK_NUMBER)) {
    active.push(CURRENT_TRAINING_DESK_NUMBER);
  }
  return active;
}

/**
 * Removes every retired number from a piece of prose, leaving the rest of the
 * sentence intact.
 *
 * The pattern is a bare digit run, so it also catches the retired numbers
 * when they appear inside a longer string such as
 * "…contact the training desk via 08160010401 or 08033429427." — the
 * surrounding words and the approved number are preserved.
 *
 * The guard is digit-specific, not word-specific: a retired number embedded
 * in a longer *digit* run is not matched, so a longer, different number that
 * merely begins with the same digit sequence is left alone. A retired number
 * followed by a letter is still removed, because the retirement policy is
 * that the retired digit sequence must not appear in published output at all.
 */
export function scrubRetiredNumbers(text: string): string {
  if (!text) return text;
  let out = text;
  for (const retired of RETIRED_PHONE_NUMBERS) {
    // A digit run that is not flanked by other digits.
    out = out.replace(new RegExp(`(?<!\\d)${retired}(?!\\d)`, "g"), "");
  }
  return out;
}

/**
 * Scrubs retired numbers from a string, then tidies the punctuation left
 * behind by the removal — doubled separators, dangling "or", and trailing
 * commas — without touching any other wording.
 */
export function scrubRetiredNumbersInProse(text: string): string {
  if (!text) return text;
  const scrubbed = scrubRetiredNumbers(text);
  if (scrubbed === text) return text;

  return scrubbed
    /* "via 08160010401 or ." → "via 08160010401." */
    .replace(/\s+(?:or|and|\/|,)\s*(?=[.,;]|$)/gi, "")
    /* ", , " / "  " → " " */
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,;])/g, "$1")
    /* " ." / "," at end of a clause → drop */
    .replace(/([.,;])\s*([.,;])/g, "$2")
    .trim();
}
