/* Suppress expired 2026 programme schedule dates across all rendered surfaces.
 *
 * All programme schedules in src/lib/data.ts reference 2026 calendar sessions
 * that have passed as of November 2026. This module provides functions to
 * replace expired date information with an enquiry message, without modifying
 * the protected catalogue.
 *
 * Two patterns are handled:
 * 1. Summary text ending with " Scheduled across ...: [dates]." → remove date portion
 * 2. Schedule field entirely consisting of dates → replace with enquiry message
 * 3. Tagline ending with " · [dates]" → remove date portion
 * 4. FAQ answers containing "2026 calendar sessions" or "confirmed dates: [dates]" → replace
 */

export const EXPIRED_SCHEDULE_MESSAGE = 'Contact GIBS for the current programme schedule.';
export const EXPIRED_FAQ_MESSAGE = 'Contact GIBS for the current programme schedule and dates.';

/* Remove expired schedule dates from programme summary text used in meta
 * descriptions, Open Graph descriptions, Twitter descriptions, and visible
 * page content. Handles both " Scheduled across ...: [dates]." and
 * " Dates: [dates]." patterns. */
export function suppressExpiredDatesInSummary(text: string | undefined | null): string {
  if (!text) return '';
  let result = text.replace(/\s+Scheduled across.*$/, '');
  result = result.replace(/\s+Dates:.*$/, '');
  result = result.replace(/\.\./g, '.');
  return result.trim();
}

/* Remove expired schedule dates from programme taglines used in page hero
 * intros. Taglines end with " · [dates]" which has passed. */
export function suppressExpiredDatesInTagline(text: string | undefined | null): string {
  if (!text) return '';
  const dotIndex = text.lastIndexOf('\u00b7');
  if (dotIndex > 0) {
    const afterDot = text.slice(dotIndex + 1).trim();
    if (/\d[\u2013\-]\d/.test(afterDot) || /2026/.test(afterDot)) {
      return text.slice(0, dotIndex).trim();
    }
  }
  return text.trim();
}

/* Replace an entire programme schedule field (which consists entirely of
 * expired dates) with an enquiry message. */
export function suppressExpiredSchedule(schedule: string | undefined | null): string {
  if (!schedule) return EXPIRED_SCHEDULE_MESSAGE;
  return EXPIRED_SCHEDULE_MESSAGE;
}

/* Replace FAQ answers that contain expired date references with an enquiry
 * message. Handles both "2026 calendar sessions" and "confirmed dates: [dates]"
 * patterns. */
export function suppressExpiredFaqAnswer(answer: string | undefined | null): string {
  if (!answer) return EXPIRED_FAQ_MESSAGE;
  if (/2026 calendar sessions/.test(answer)) {
    return EXPIRED_FAQ_MESSAGE;
  }
  if (/confirmed dates:.*/.test(answer)) {
    return EXPIRED_FAQ_MESSAGE;
  }
  return EXPIRED_FAQ_MESSAGE;
}
