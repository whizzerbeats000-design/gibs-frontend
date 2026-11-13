import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const admissionsSource = readFileSync(new URL("../../src/pages/Admissions.tsx", import.meta.url), "utf8");
const journeySource = readFileSync(new URL("../../src/sections/Journey.tsx", import.meta.url), "utf8");
const conciergeSource = readFileSync(new URL("../../src/lib/concierge.ts", import.meta.url), "utf8");

test("Admissions does not claim automatic confirmation/invoice from site", () => {
  assert.ok(!/GIBS confirms your place and issues a formal confirmation letter/i.test(admissionsSource),
    "step 2 must not claim a formal confirmation letter from site");
  assert.ok(!/issues official programme confirmation letters, course schedule details, and invoice/i.test(admissionsSource),
    "step 3 must not claim automatic invoice/confirmation from site");
});

test("Admissions uses enquiry-first visible terminology and action", () => {
  assert.ok(/Make an Enquiry/.test(admissionsSource), "primary CTA must be Make an Enquiry");
  assert.ok(/Programme Enquiry/i.test(admissionsSource) || /Enquiry \& Guidance/i.test(admissionsSource), "visible label must be enquiry-oriented");
});

test("Journey teaser does not suggest site-based registration", () => {
  assert.ok(!/make an enquiry to register/i.test(journeySource), "must not prompt registering via site");
  assert.ok(/How to enquire/i.test(journeySource), "must label process as enquiry");
});

test("Concierge reply clarifies enquiry rather than automatic enrolment", () => {
  assert.ok(/processes enquiries/i.test(conciergeSource) || /makes an enquiry/i.test(conciergeSource) || /enquire/.test(conciergeSource),
    "must describe enquiry, not automatic enrolment");
  assert.ok(/Programme Enquiry Guidelines/i.test(conciergeSource) || /Make an Enquiry/i.test(conciergeSource),
    "must link to enquiry resources");
});

console.log("PASS terminology regression");
