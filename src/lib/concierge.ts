import { PROGRAMMES, INSTITUTIONAL_DATA } from "./data";

/* ==========================================================================
   GIBS AI — frontend conversational intelligence engine.
   Official programme & institutional guide for Goshen International Business School (GIBS)
   ========================================================================== */

export type ConciergeCard =
  | { kind: "link"; label: string; to: string; detail?: string | null }
  | { kind: "programme"; slug: string; label: string; detail?: string | null };

export type ConciergeReply = {
  text: string;
  cards?: ConciergeCard[];
};

const programmeCard = (slug: string): ConciergeCard => {
  const p = PROGRAMMES.find((x) => x.slug === slug);
  return {
    kind: "programme",
    slug,
    label: p?.title ?? slug,
    detail: p?.tagline,
  };
};

type Rule = { test: RegExp; reply: ConciergeReply };

const RULES: Rule[] = [
  {
    test: /\b(hi|hello|hey|good (morning|afternoon|evening)|greetings)\b/i,
    reply: {
      text: `Welcome to Goshen International Business School (GIBS). We offer 113 Local Open Training Programmes and 22 Foreign Executive Training Programmes across Kigali, Dubai, London, and Houston. How can I guide you today?`,
      cards: [
        { kind: "link", label: "Browse 2026 Training Calendar", to: "/programmes", detail: "113 Local & 22 Foreign Courses" },
        { kind: "link", label: "Foreign Training Hubs", to: "/executive-education", detail: "Kigali, Dubai, London & Houston" },
        { kind: "link", label: "Contact Training Desk", to: "/contact", detail: "Direct email & phone lines" },
      ],
    },
  },
  {
    test: /\b(foreign|overseas|international|kigali|dubai|london|houston|rwanda|uae|uk|usa|texas)\b/i,
    reply: {
      text: "GIBS conducts 22 Foreign Executive Training Programmes across 4 international hubs: Kigali (8 courses, $4,800 USD), Dubai (5 courses, $4,800 USD), London (4 courses, £4,800 GBP), and Houston, Texas (5 courses, $5,000–$9,500 USD).",
      cards: [
        { kind: "link", label: "Explore All Foreign Programmes", to: "/executive-education", detail: "View all 22 overseas courses" },
        programmeCard(PROGRAMMES[113].slug),
        programmeCard(PROGRAMMES[121].slug),
        programmeCard(PROGRAMMES[126].slug),
        programmeCard(PROGRAMMES[130].slug),
      ],
    },
  },
  {
    test: /\b(in-plant|custom|customized|tailor|organization|organisation|company|corporate|in house|in-house)\b/i,
    reply: {
      text: "GIBS provides tailored in-plant customized training workshops for public sector MDAs and corporate organizations. We adapt course content, dates, and locations to your institutional objectives.",
      cards: [
        { kind: "link", label: "Request Customized In-Plant Workshop", to: "/contact?type=Customized+In-Plant+Workshop+Request" },
        { kind: "link", label: "Executive Education Overview", to: "/executive-education" },
      ],
    },
  },
  {
    test: /\b(subscribe|subscription|nominate|nomination|register|enrol|enrolment|requirement|fee|fees|cost|price|tuition|apply|admission|scholarship)\b/i,
    reply: {
      text: "GIBS operates on a direct programme subscription and corporate nomination model for its 2026 training calendar. Organizations nominate participants or individuals subscribe directly. Local programme fees range from ₦300,000 to ₦800,000 NGN; foreign programmes range from $4,800–$9,500 USD and £4,800 GBP.",
      cards: [
        { kind: "link", label: "Programme Subscription Guidelines", to: "/admissions" },
        { kind: "link", label: "Subscribe / Programme Enquiry", to: "/contact?type=Local+Open+Training+Registration" },
      ],
    },
  },
  {
    test: /\b(campus|visit|location|address|ilorin|abuja|ibafo|facilities|accommodation|lodge|hall)\b/i,
    reply: {
      text: `GIBS operates across 3 permanent centers: Ilorin Main HQ (No 81, Olorunsogo St, Upper Gaa-Akanbi), Abuja Center (Plot 194, Lugbe 1, Airport Rd), and Ibafo Center (KM 36, Lagos-Ibadan Express Rd), plus off-campus centers across Nigeria.`,
      cards: [
        { kind: "link", label: "Campus Facilities & Locations", to: "/campus" },
        { kind: "link", label: "Book a Visit or Facility", to: "/contact?type=Campus+Facility+Booking+%26+Enquiries" },
      ],
    },
  },
  {
    test: /\b(faculty|governance|board|council|advisor|director|who|accredit|cac|cmd|itf|nstif)\b/i,
    reply: {
      text: `GIBS is governed by a Governing Council of 4 Directors under the Chairman of the Council, supported by a 20-member management and advisory board. Accredited by CAC (RC 1178333), CMD, ITF, and NSTIF.`,
      cards: [
        { kind: "link", label: "Faculty & Governance Structure", to: "/faculty" },
        { kind: "link", label: "About GIBS & Accreditations", to: "/about" },
      ],
    },
  },
  {
    test: /\b(contact|email|phone|call|talk|speak|reach|number|help)\b/i,
    reply: {
      text: `You can reach GIBS directly via email at gibsilorin@gmail.com / goshenibs22@gmail.com, or call: ${INSTITUTIONAL_DATA.phoneNumbers.slice(0, 3).join(", ")}.`,
      cards: [
        { kind: "link", label: "Contact Form & Full Directory", to: "/contact" },
        { kind: "link", label: "Browse Programmes", to: "/programmes" },
      ],
    },
  },
  {
    test: /\b(about|mission|vision|values|principles|history|slogan|tagline)\b/i,
    reply: {
      text: `"${INSTITUTIONAL_DATA.slogan}". Goshen International Business School Limited (RC 1178333) is dedicated to national manpower development and capacity-building.`,
      cards: [{ kind: "link", label: "About GIBS", to: "/about" }],
    },
  },
  {
    test: /\b(program|programme|calendar|course|training|open|workshop|seminar|finance|accounting|admin|telecom|pension|legal|oil|gas|maritime)\b/i,
    reply: {
      text: "The 2026 GIBS Training Calendar includes 113 Local Open Programmes across 14 categories (Accounting, Administration, Telecom, Consumer Protection, Environmental, Oil & Gas, IT, Legal, Power, Maritime, Pension, and Special Training).",
      cards: [
        { kind: "link", label: "View Complete 2026 Calendar", to: "/programmes", detail: "Filter by category or search" },
        programmeCard(PROGRAMMES[0].slug),
        programmeCard(PROGRAMMES[6].slug),
        programmeCard(PROGRAMMES[32].slug),
        programmeCard(PROGRAMMES[64].slug),
      ],
    },
  },
];

const FALLBACK: ConciergeReply = {
  text: "I can guide you through our 113 Local Open Programmes, 22 Foreign Executive Training Programmes, in-plant workshops, campuses in Ilorin, Abuja & Ibafo, or connect you with the registry.",
  cards: [
    { kind: "link", label: "Browse 2026 Programmes", to: "/programmes" },
    { kind: "link", label: "Foreign Training Hubs", to: "/executive-education" },
    { kind: "link", label: "Contact GIBS", to: "/contact" },
  ],
};

export function getConciergeReply(input: string): ConciergeReply {
  const q = input.trim();
  if (!q) {
    return {
      text: "Tell me what training or institutional information you are looking for, and I will guide you.",
    };
  }
  for (const rule of RULES) {
    if (rule.test.test(q)) return rule.reply;
  }
  return FALLBACK;
}
