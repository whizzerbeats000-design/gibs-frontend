import { PROGRAMMES, INSTITUTIONAL_DATA } from "./data";
import { activePhoneNumbers, scrubRetiredNumbersInProse } from "./phones";

/* ==========================================================================
   GIBS AI — frontend conversational intelligence engine.
   Official programme & institutional guide for Goshen International Business School (GIBS)
   ========================================================================== */

/* Render-layer transform for INSTITUTIONAL_DATA.phoneNumbers. data.ts is
   byte-locked (SHA-256 910ff4d7…), so the retired numbers it still lists are
   filtered out and the current official number is appended. The policy lives
   in src/lib/phones.ts and is shared with the Contact page and the SEO shell
   generator, so the three cannot drift apart. This list is what the
   concierge surfaces in its contact reply. */
const ACTIVE_PHONE_NUMBERS: string[] = activePhoneNumbers(INSTITUTIONAL_DATA.phoneNumbers);

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

type Rule = { test: RegExp; reply: ConciergeReply; id?: string };
type RankedProgramme = { slug: string; label: string; num: number; score: number; topicMatch: boolean };

const SEARCH_STOP_WORDS = new Set([
  "a", "about", "an", "and", "any", "at", "available", "best", "by", "can", "could", "department",
  "dept", "for", "from", "find", "get", "help", "i", "in", "is", "list", "looking", "me", "my", "near", "need", "of", "on",
  "or", "please", "programme", "programmes", "program", "programs", "recommend",
  "recommendation", "recommendations", "suitable", "the", "to", "training", "workshop",
  "workshops", "course", "courses", "class", "classes", "sector", "cadre", "staff", "team",
  "quarter", "month", "during", "which", "what", "with", "you", "your", "search", "show", "suggest", "suggestion", "suggestions", "want",
]);

const MONTHS = [
  { name: "january", aliases: ["jan", "january"], quarter: 1 },
  { name: "february", aliases: ["feb", "february"], quarter: 1 },
  { name: "march", aliases: ["mar", "march"], quarter: 1 },
  { name: "april", aliases: ["apr", "april"], quarter: 2 },
  { name: "may", aliases: ["may"], quarter: 2 },
  { name: "june", aliases: ["jun", "june"], quarter: 2 },
  { name: "july", aliases: ["jul", "july"], quarter: 3 },
  { name: "august", aliases: ["aug", "august"], quarter: 3 },
  { name: "september", aliases: ["sep", "sept", "september"], quarter: 3 },
  { name: "october", aliases: ["oct", "october"], quarter: 4 },
  { name: "november", aliases: ["nov", "november"], quarter: 4 },
  { name: "december", aliases: ["dec", "december"], quarter: 4 },
];

const ORDINAL_QUARTERS = ["first", "second", "third", "fourth"];

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function quarterFromText(value: string) {
  const text = normalizeSearchText(value);
  for (let quarter = 1; quarter <= 4; quarter++) {
    const pattern = new RegExp(`\\bq\\s*${quarter}\\b|\\bquarter\\s+${quarter}\\b|\\b${ORDINAL_QUARTERS[quarter - 1]}\\s+quarter\\b`);
    if (pattern.test(text)) return quarter;
  }
  return null;
}

function searchTerms(value: string) {
  const text = normalizeSearchText(value);
  const tokens = new Set(text.split(/\s+/).filter(Boolean).map((token) => {
    const month = MONTHS.find((entry) => entry.aliases.includes(token));
    return month ? month.name : token;
  }));
  const quarter = quarterFromText(text);
  if (quarter) {
    tokens.delete(`q${quarter}`);
    tokens.delete(String(quarter));
    tokens.delete("quarter");
    tokens.delete(ORDINAL_QUARTERS[quarter - 1]);
    tokens.add(`quarter-${quarter}`);
  }
  for (const month of MONTHS) {
    if (tokens.has(month.name)) tokens.add(`quarter-${month.quarter}`);
  }
  return [...tokens].filter((token) => !SEARCH_STOP_WORDS.has(token));
}

function rankProgrammes(query: string): RankedProgramme[] {
  const terms = searchTerms(query);
  if (terms.length === 0) return [];

  return PROGRAMMES.flatMap((programme) => {
    const fields = [
      { value: programme.title, weight: 6, topic: true },
      { value: programme.category, weight: 5, topic: true },
      { value: programme.targetAudience, weight: 4, topic: true },
      { value: programme.destination, weight: 3, topic: false },
      { value: programme.schedule, weight: 2, topic: false },
      { value: programme.startDate ?? "", weight: 2, topic: false },
    ].map((field) => ({ ...field, tokens: new Set(searchTerms(field.value)) }));

    if (!terms.every((term) => fields.some((field) => field.tokens.has(term)))) return [];

    const score = terms.reduce((total, term) => {
      const bestField = fields.reduce(
        (best, field) => field.tokens.has(term) ? Math.max(best, field.weight) : best,
        0
      );
      return total + bestField;
    }, 0);
    const topicMatch = terms.some((term) => fields.some((field) => field.topic && field.tokens.has(term)));

    return [{ slug: programme.slug, label: programme.title, num: programme.num, score, topicMatch }];
  }).sort((a, b) => b.score - a.score || a.num - b.num);
}

function programmeReply(matches: RankedProgramme[]): ConciergeReply {
  return {
    text: "These are the closest matches from programme titles, categories, stated audiences, and published schedules. Sector, cadre, and department are not separate catalogue filters; I can match those terms only where the programme record explicitly names them.",
    cards: [
      { kind: "link", label: "Browse all programmes", to: "/programmes" },
      ...matches.slice(0, 3).map((programme) => programmeCard(programme.slug)),
    ],
  };
}

function noProgrammeMatch(): ConciergeReply {
  return {
    text: "I couldn't find a programme that explicitly matches those terms. Sector, cadre, and department are not separate catalogue filters. Try a programme topic, category, stated audience, listed city, month, or quarter, or contact the training desk for help.",
    cards: [
      { kind: "link", label: "Browse all programmes", to: "/programmes" },
      { kind: "link", label: "Contact the training desk", to: "/contact" },
    ],
  };
}

function clarifyProgrammeQuery(): ConciergeReply {
  return {
    text: "What programme topic or published category should I search? You can also name a stated audience, listed city, month, or quarter. Sector, cadre, and department are not separate catalogue filters.",
    cards: [{ kind: "link", label: "Browse all programmes", to: "/programmes" }],
  };
}

function hasProgrammeIntent(query: string) {
  return /\b(programmes?|courses?|training|workshops?|recommend(?:ation)?s?|suggest(?:ion)?s?|suitable|sector|cadre|department|quarter|months?|q[1-4])\b/i.test(query);
}

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
    id: "foreign-hubs",
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
    id: "enrolment",
    test: /\b(subscribe|subscription|nominate|nomination|register|enrol|enrolment|requirement|fee|fees|cost|price|tuition|apply|admission|scholarship)\b/i,
    reply: {
      text: "GIBS offers 113 Local Open and 22 Foreign Executive Programmes across its 2026 training calendar. Organisations and individuals enquire by email, phone, or in person; GIBS processes enquiries and provides programme guidance. Local programme fees range from ₦300,000 to ₦800,000 NGN; foreign programmes range from $4,800–$9,500 USD and £4,800 GBP.",
      cards: [
        { kind: "link", label: "Programme Enquiry Guidelines", to: "/admissions" },
        { kind: "link", label: "Make an Enquiry", to: "/contact?type=Local+Open+Training+Registration" },
      ],
    },
  },
  {
    id: "campus-locations",
    test: /\b(campus|visit|location|address|ilorin|abuja|ibafo|facilities|accommodation|lodge|hall)\b/i,
    reply: {
      text: `GIBS operates across 3 permanent centers: Ilorin Main HQ (No 81, Olorunsogo St, Upper Gaa-Akanbi), Abuja Center (Plot 194, Lugbe 1, Airport Rd), and Ibafo Center (KM 36, Lagos-Ibadan Express Rd), plus off-campus centers across Nigeria.`,
      cards: [
        { kind: "link", label: "Campus Locations", to: "/about", detail: "Ilorin, Abuja and Ibafo addresses" },
        { kind: "link", label: "Book a Visit or Facility", to: "/contact?type=Campus+Facility+Booking+%26+Enquiries" },
      ],
    },
  },
  {
    test: /\b(faculty|governance|board|council|advisor|director|who|accredit|cac|cmd|itf|nstif)\b/i,
    reply: {
      text: `GIBS is governed by a Governing Council of 4 Directors under the Chairman of the Council, supported by a 20-member management and advisory board. It is registered with the Corporate Affairs Commission (CAC), RC 1178333. For current accreditation and certification details, please contact the registry.`,
      cards: [
        { kind: "link", label: "Governance & Accreditations", to: "/about" },
        { kind: "link", label: "Contact GIBS", to: "/contact" },
      ],
    },
  },
  {
    test: /\b(contact|email|phone|call|talk|speak|reach|number|help)\b/i,
    reply: {
      text: `You can reach GIBS directly via email at gibsilorin@gmail.com / goshenibs22@gmail.com, or call: ${ACTIVE_PHONE_NUMBERS.slice(0, 3).join(", ")}.`,
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
];

const FALLBACK: ConciergeReply = {
  text: "I can guide you through our 113 Local Open Programmes, 22 Foreign Executive Training Programmes, in-plant workshops, campuses in Ilorin, Abuja & Ibafo, or connect you with the registry.",
  cards: [
    { kind: "link", label: "Browse 2026 Programmes", to: "/programmes" },
    { kind: "link", label: "Foreign Training Hubs", to: "/executive-education" },
    { kind: "link", label: "Contact GIBS", to: "/contact" },
  ],
};

/**
 * Defence in depth: every reply that leaves the concierge passes through the
 * shared retired-number policy, so a rule that quotes data.ts prose can never
 * publish a retired number even if the rule is written later.
 */
function publishable(reply: ConciergeReply): ConciergeReply {
  return {
    ...reply,
    text: scrubRetiredNumbersInProse(reply.text),
  };
}

export function getConciergeReply(input: string): ConciergeReply {
  const q = input.trim();
  if (!q) {
    return {
      text: "Tell me what training or institutional information you are looking for, and I will guide you.",
    };
  }

  const matches = rankProgrammes(q);
  const programmeIntent = hasProgrammeIntent(q);
  const searchWords = searchTerms(q);
  const destinationOnly = searchWords.length === 1 && /^(foreign|overseas|international|kigali|dubai|london|houston|rwanda|uae|uk|usa|texas)$/i.test(searchWords[0]);
  const hasHubOverview = /\bhubs?\b/i.test(q) && !/\b(programme|program|course)\b/i.test(q);
  const localHubIntent = /\b(local|nigeria|nigerian|ilorin|abuja|ibafo)\b/i.test(q) && /\bhubs?\b/i.test(q);

  if (localHubIntent) {
    const localHubRule = RULES.find((rule) => rule.id === "campus-locations");
    if (localHubRule) return publishable(localHubRule.reply);
  }
  if (hasHubOverview) {
    const foreignHubRule = RULES.find((rule) => rule.id === "foreign-hubs");
    if (foreignHubRule) return publishable(foreignHubRule.reply);
  }

  if (matches.length && !destinationOnly && !hasHubOverview && (programmeIntent || matches.some((match) => match.topicMatch))) {
    return publishable(programmeReply(matches));
  }
  if (programmeIntent && !destinationOnly && !hasHubOverview) {
    /* A fee, enrolment or requirement question that also mentions a programme
       must still reach the enrolment rule. The extra word ("fee", "cost")
       prevents a programme match, so the branch above would answer "I
       couldn't find a programme that explicitly matches those terms" — with
       no fee information at all — to a question such as "How much does a
       programme cost?" or "What is the fee of the Public Sector Accounting
       programme?". The rule is only consulted when no programme matched, so
       a query that does identify a programme still gets the programme. */
    const enrolmentRule = RULES.find((rule) => rule.id === "enrolment");
    if (enrolmentRule && enrolmentRule.test.test(q) && matches.length === 0) {
      return publishable(enrolmentRule.reply);
    }
    return publishable(searchWords.length ? noProgrammeMatch() : clarifyProgrammeQuery());
  }

  for (const rule of RULES) {
    if (rule.test.test(q)) return publishable(rule.reply);
  }
  if (matches.length) return publishable(programmeReply(matches));
  return publishable(FALLBACK);
}
