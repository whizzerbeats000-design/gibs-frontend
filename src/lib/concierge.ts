import { PROGRAMMES, INSTITUTIONAL_DATA } from "./data";
import { activePhoneNumbers, scrubRetiredNumbersInProse } from "./phones";

/* ==========================================================================
   GIBS AI — frontend conversational intelligence engine.
   Official catalogue & institutional guide for Goshen International Business School (GIBS)
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

export type ConciergeContext = {
  lastIntent?: string;
  lastTopic?: string;
  lastCategory?: string;
  lastDestination?: "Local" | "Foreign" | "Kigali" | "Dubai" | "London" | "Houston";
  lastQuarter?: number;
  lastProgrammeSlug?: string;
  lastQuestionType?: "ask_destination" | "ask_hub" | "ask_topic" | "general";
  hasGreeted?: boolean;
  turnCount?: number;
};

export type ConversationTurn = {
  role: "user" | "concierge";
  text: string;
  cards?: ConciergeCard[];
};

export type ConciergeReply = {
  text: string;
  cards?: ConciergeCard[];
  context?: ConciergeContext;
};

export const programmeCard = (slug: string): ConciergeCard => {
  const p = PROGRAMMES.find((x) => x.slug === slug);
  return {
    kind: "programme",
    slug,
    label: p?.title ?? slug,
    detail: p?.tagline || (p ? `${p.destination !== "Local" ? `${p.destination} Hub · ` : ""}${p.code}` : null),
  };
};

type Rule = { test: RegExp; reply: ConciergeReply; id?: string };
type RankedProgramme = {
  slug: string;
  label: string;
  num: number;
  score: number;
  topicMatch: boolean;
  destination: string;
};

const SEARCH_STOP_WORDS = new Set([
  "a", "about", "am", "an", "and", "any", "are", "at", "available", "best", "by", "can", "class", "classes", "could", "department",
  "dept", "do", "does", "during", "find", "for", "from", "get", "give", "have", "help", "how", "i", "in", "is",
  "it", "interested", "learn", "like", "list", "look", "looking", "me", "month", "months", "much", "my", "near",
  "need", "of", "on", "or", "please", "programme", "programmes", "program", "programs", "course", "courses", "quarter", "recommend",
  "recommendation", "recommendations", "run", "search", "sector", "see", "share", "show", "some", "staff", "study",
  "suggest", "suggestion", "suggestions", "suitable", "take", "team", "tell", "the", "there", "to", "training",
  "trainings", "want", "what", "which", "who", "with", "workshop", "workshops", "would", "you", "your",
  "interested", "looking", "looking for", "i'm", "im", "interested in", "interested", "about", "can you", "could you", "recommend", "suggest", "training in"
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

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function quarterFromText(value: string): number | null {
  const text = normalizeSearchText(value);
  for (let quarter = 1; quarter <= 4; quarter++) {
    const pattern = new RegExp(`\\bq\\s*${quarter}\\b|\\bquarter\\s+${quarter}\\b|\\b${ORDINAL_QUARTERS[quarter - 1]}\\s+quarter\\b`);
    if (pattern.test(text)) return quarter;
  }
  return null;
}

function destinationFromText(value: string): "Local" | "Foreign" | "Kigali" | "Dubai" | "London" | "Houston" | null {
  const text = normalizeSearchText(value);
  if (/\b(kigali|rwanda)\b/.test(text)) return "Kigali";
  if (/\b(dubai|uae)\b/.test(text)) return "Dubai";
  if (/\b(london|uk|britain|england)\b/.test(text)) return "London";
  if (/\b(houston|texas|usa|united states)\b/.test(text)) return "Houston";
  if (/\b(foreign|overseas|international|abroad)\b/.test(text)) return "Foreign";
  if (/\b(local|nigeria|nigerian|domestic|ilorin|abuja|ibafo)\b/.test(text)) return "Local";
  return null;
}

function searchTerms(value: string): string[] {
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

function rankProgrammes(query: string, options: { destination?: string; topic?: string } = {}): RankedProgramme[] {
  let terms = searchTerms(query);
  if (options.topic) {
    const topicTerms = searchTerms(options.topic);
    terms = [...new Set([...terms, ...topicTerms])];
  }
  if (terms.length === 0) return [];

  const targetDest = options.destination;

  return PROGRAMMES.flatMap((programme) => {
    if (targetDest) {
      if (targetDest === "Foreign" && programme.destination === "Local") return [];
      if (targetDest === "Local" && programme.destination !== "Local") return [];
      if (["Kigali", "Dubai", "London", "Houston"].includes(targetDest) && programme.destination !== targetDest) return [];
    }

    const fields = [
      { value: programme.title, weight: 6, topic: true },
      { value: programme.category, weight: 5, topic: true },
      { value: programme.targetAudience, weight: 4, topic: true },
      { value: programme.destination, weight: 3, topic: false },
      { value: programme.schedule, weight: 2, topic: false },
      { value: programme.startDate ?? "", weight: 2, topic: false },
    ].map((field) => ({ ...field, tokens: new Set(searchTerms(field.value)) }));

    const matchedTerms = terms.filter((term) => fields.some((field) => field.tokens.has(term)));

    // Strict AND match
    if (matchedTerms.length === terms.length) {
      const score = terms.reduce((total, term) => {
        const bestField = fields.reduce(
          (best, field) => (field.tokens.has(term) ? Math.max(best, field.weight) : best),
          0
        );
        return total + bestField;
      }, 0);
      const topicMatch = terms.some((term) => fields.some((field) => field.topic && field.tokens.has(term)));

      return [{
        slug: programme.slug,
        label: programme.title,
        num: programme.num,
        score,
        topicMatch,
        destination: programme.destination,
      }];
    }

    // Fallback: Partial match (OR logic) with scoring
    // We only allow a fallback if at least one "meaningful" term matches.
    // "Meaningful" here is defined as any term that isn't a stop word (already handled by searchTerms).
    if (matchedTerms.length > 0) {
      const score = matchedTerms.reduce((total, term) => {
        const bestField = fields.reduce(
          (best, field) => (field.tokens.has(term) ? Math.max(best, field.weight) : best),
          0
        );
        return total + bestField;
      }, 0);

      // Threshold: To avoid irrelevant results, the match must be strong.
      // A score of 4 means it matched at least one target audience, category, or title field.
      if (score < 4) return [];

      const topicMatch = matchedTerms.some((term) => fields.some((field) => field.topic && field.tokens.has(term)));

      return [{
        slug: programme.slug,
        label: programme.title,
        num: programme.num,
        score: score * 0.5, // Penalize partial matches so they always rank below strict matches
        topicMatch,
        destination: programme.destination,
      }];
    }

    return [];
  }).sort((a, b) => b.score - a.score || a.num - b.num);
}

function programmeReply(matches: RankedProgramme[], destination?: string): ConciergeReply {
  const destNote = destination === "Foreign"
    ? " (Foreign Executive)"
    : destination === "Local"
    ? " (Local Nigeria)"
    : destination
    ? ` (${destination} Hub)`
    : "";
  const followUp = matches.some((m) => m.destination === "Local") && matches.some((m) => m.destination !== "Local")
    ? " Would you prefer training in Nigeria (Local) or at one of our overseas hubs (Kigali, Dubai, London, Houston)?"
    : " Would you like to review full dates, fee schedules, or make an enquiry for any of these courses?";

  return {
    text: `These are the closest matches from programme titles, categories, stated audiences, and published schedules${destNote}. Sector, cadre, and department are not separate catalogue filters; I can match those terms only where the programme record explicitly names them.${followUp}`,
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

function hasProgrammeIntent(query: string): boolean {
  return /\b(programmes?|courses?|training|workshops?|recommend(?:ation)?s?|suggest(?:ion)?s?|suitable|sector|cadre|department|quarter|months?|q[1-4])\b/i.test(query);
}

const LOCAL_PROGRAMMES_COUNT = PROGRAMMES.filter((p) => p.destination === "Local").length;
const FOREIGN_PROGRAMMES_COUNT = PROGRAMMES.filter((p) => p.destination !== "Local").length;
const KIGALI_COUNT = PROGRAMMES.filter((p) => p.destination === "Kigali").length;
const DUBAI_COUNT = PROGRAMMES.filter((p) => p.destination === "Dubai").length;
const LONDON_COUNT = PROGRAMMES.filter((p) => p.destination === "London").length;
const HOUSTON_COUNT = PROGRAMMES.filter((p) => p.destination === "Houston").length;

function foreignHubsReply(hub?: string): ConciergeReply {
  const cards: ConciergeCard[] = [
    { kind: "link", label: "Explore All Foreign Programmes", to: "/executive-education", detail: `View all ${FOREIGN_PROGRAMMES_COUNT} overseas courses` },
  ];

  if (hub === "Kigali") {
    cards.push(
      programmeCard(PROGRAMMES[113].slug),
      programmeCard(PROGRAMMES[114].slug),
      programmeCard(PROGRAMMES[115].slug)
    );
  } else if (hub === "Dubai") {
    cards.push(
      programmeCard(PROGRAMMES[121].slug),
      programmeCard(PROGRAMMES[122].slug),
      programmeCard(PROGRAMMES[124].slug)
    );
  } else if (hub === "London") {
    cards.push(
      programmeCard(PROGRAMMES[126].slug),
      programmeCard(PROGRAMMES[127].slug),
      programmeCard(PROGRAMMES[128].slug)
    );
  } else if (hub === "Houston") {
    cards.push(
      programmeCard(PROGRAMMES[130].slug),
      programmeCard(PROGRAMMES[131].slug),
      programmeCard(PROGRAMMES[132].slug)
    );
  } else {
    cards.push(
      programmeCard(PROGRAMMES[113].slug),
      programmeCard(PROGRAMMES[121].slug),
      programmeCard(PROGRAMMES[126].slug),
      programmeCard(PROGRAMMES[130].slug)
    );
  }

  const hubDetail = hub
    ? ` In our ${hub} hub, executive programmes are scheduled across published calendar dates. Here are featured ${hub} programmes:`
    : " Which international hub would you like to explore—Kigali, Dubai, London, or Houston?";

  return {
    text: `GIBS conducts ${FOREIGN_PROGRAMMES_COUNT} Foreign Executive Training Programmes across 4 international hubs: Kigali (${KIGALI_COUNT} courses, $4,800 USD), Dubai (${DUBAI_COUNT} courses, $4,800 USD), London (${LONDON_COUNT} courses, £4,800 GBP), and Houston, Texas (${HOUSTON_COUNT} courses, $5,000–$9,500 USD).${hubDetail}`,
    cards,
  };
}

const RULES: Rule[] = [
  {
    test: /\b(hi|hello|hey|good (morning|afternoon|evening)|greetings)\b/i,
    reply: {
      text: `Welcome to Goshen International Business School (GIBS). We offer ${LOCAL_PROGRAMMES_COUNT} Local Open Training Programmes and ${FOREIGN_PROGRAMMES_COUNT} Foreign Executive Training Programmes across Kigali, Dubai, London, and Houston. What area of professional development or institutional information can I guide you with today?`,
      cards: [
        { kind: "link", label: "Browse 2026 Training Calendar", to: "/programmes", detail: `${LOCAL_PROGRAMMES_COUNT} Local & ${FOREIGN_PROGRAMMES_COUNT} Foreign Courses` },
        { kind: "link", label: "Foreign Training Hubs", to: "/executive-education", detail: "Kigali, Dubai, London & Houston" },
        { kind: "link", label: "Contact Training Desk", to: "/contact", detail: "Direct email & phone lines" },
      ],
    },
  },
  {
    id: "foreign-hubs",
    test: /\b(foreign|overseas|international|kigali|dubai|london|houston|rwanda|uae|uk|usa|texas)\b/i,
    reply: foreignHubsReply(),
  },
  {
    test: /\b(in-plant|custom|customized|tailor|organization|organisation|company|corporate|in house|in-house)\b/i,
    reply: {
      text: "GIBS provides tailored in-plant customized training workshops for public sector MDAs and corporate organizations. We adapt course content, dates, and locations to your institutional objectives. Would you like to request a customized workshop proposal?",
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
      text: `GIBS offers ${LOCAL_PROGRAMMES_COUNT} Local Open and ${FOREIGN_PROGRAMMES_COUNT} Foreign Executive Programmes across its 2026 training calendar. Organisations and individuals enquire by email, phone, or in person; GIBS processes enquiries and provides formal proforma invoices and programme guidance. Local programme fees range from ₦300,000 to ₦800,000 NGN; foreign programmes range from $4,800–$9,500 USD and £4,800 GBP. Would you like enquiry guidance or fee details for a specific programme?`,
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
      text: `GIBS operates across 3 permanent centers: Ilorin Main HQ (No 81, Olorunsogo St, Upper Gaa-Akanbi, Kwara State), Abuja Center (Plot 194, Lugbe 1, Airport Rd), and Ibafo Center (KM 36, Lagos-Ibadan Express Rd), plus off-campus centers across Nigeria. Our campuses feature modern lecture suites, conference halls, and executive guest facilities. Would you like to schedule a visit or explore training at one of our locations?`,
      cards: [
        { kind: "link", label: "Campus Locations", to: "/about", detail: "Ilorin, Abuja and Ibafo addresses" },
        { kind: "link", label: "Book a Visit or Facility", to: "/contact?type=Campus+Facility+Booking+%26+Enquiries" },
      ],
    },
  },
  {
    test: /\b(faculty|governance|board|council|advisor|director|who|accredit|cac|cmd|itf|nstif)\b/i,
    reply: {
      text: `GIBS is governed by a Governing Council of 4 Directors under the Chairman of the Council, supported by a 20-member management and advisory board. It is registered with the Corporate Affairs Commission (CAC), RC 1178333, and accredited by the Centre For Management Development (CMD), with ITF and NSTIF compliance certifications. Would you like more details on governance or to contact the registry?`,
      cards: [
        { kind: "link", label: "Governance & Accreditations", to: "/about" },
        { kind: "link", label: "Contact GIBS", to: "/contact" },
      ],
    },
  },
  {
    test: /\b(contact|email|phone|call|talk|speak|reach|number|help)\b/i,
    reply: {
      text: `You can reach GIBS directly via email at gibsilorin@gmail.com / goshenibs22@gmail.com, or call our official phone lines: ${ACTIVE_PHONE_NUMBERS.slice(0, 3).join(", ")}. Our registry and training desk are available to assist with nominations, schedules, and proforma invoices.`,
      cards: [
        { kind: "link", label: "Contact Form & Full Directory", to: "/contact" },
        { kind: "link", label: "Browse Programmes", to: "/programmes" },
      ],
    },
  },
  {
    test: /\b(about|mission|vision|values|principles|history|slogan|tagline)\b/i,
    reply: {
      text: `"${INSTITUTIONAL_DATA.slogan}". Goshen International Business School Limited (RC 1178333) is dedicated to national manpower development, management excellence, and professional capacity-building. Our core values include ${INSTITUTIONAL_DATA.coreValues.slice(0, 4).join(", ")}. Would you like to review our institutional profile or explore our programmes?`,
      cards: [
        { kind: "link", label: "About GIBS", to: "/about" },
        { kind: "link", label: "Browse 2026 Training Calendar", to: "/programmes" },
      ],
    },
  },
];

const FALLBACK: ConciergeReply = {
  text: `I can help you explore our ${LOCAL_PROGRAMMES_COUNT} Local Open Training Programmes, ${FOREIGN_PROGRAMMES_COUNT} Foreign Executive Programmes, customized in-plant workshops, or campus venues across Ilorin, Abuja, and Ibafo.\n\nCould you clarify the topic, destination, or question you would like assistance with?`,
  cards: [
    { kind: "link", label: "Browse 2026 Training Calendar", to: "/programmes", detail: `${LOCAL_PROGRAMMES_COUNT} Local & ${FOREIGN_PROGRAMMES_COUNT} Foreign Courses` },
    { kind: "link", label: "Foreign Training Hubs", to: "/executive-education", detail: "Kigali, Dubai, London & Houston" },
    { kind: "link", label: "Contact Training Desk", to: "/contact", detail: "Direct email & phone lines" },
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

function extractContextFromHistory(history: ConversationTurn[]): ConciergeContext {
  if (!history || !Array.isArray(history) || history.length === 0) {
    return { hasGreeted: false, turnCount: 0 };
  }

  let hasGreeted = false;
  let lastTopic: string | undefined = undefined;
  let lastDestination: "Local" | "Foreign" | "Kigali" | "Dubai" | "London" | "Houston" | undefined = undefined;
  let lastProgrammeSlug: string | undefined = undefined;
  let lastQuestionType: "ask_destination" | "ask_hub" | "ask_topic" | "general" | undefined = undefined;

  for (const msg of history) {
    if (!msg || typeof msg.text !== "string") continue;
    const text = msg.text.trim();
    if (msg.role === "user") {
      if (/\b(hi|hello|hey|good (morning|afternoon|evening)|greetings)\b/i.test(text)) {
        hasGreeted = true;
      }
      const terms = searchTerms(text);
      if (terms.length > 0) {
        const potentialTopic = terms.filter((t) => !["foreign", "local", "dubai", "kigali", "london", "houston", "yes", "no"].includes(t)).join(" ");
        if (potentialTopic) lastTopic = potentialTopic;
      }
      const dest = destinationFromText(text);
      if (dest) lastDestination = dest;
    } else if (msg.role === "concierge") {
      if (/\bWelcome to Goshen International Business School\b/i.test(text) || /\bWelcome to GIBS AI\b/i.test(text)) {
        hasGreeted = true;
      }
      if (/Would you prefer training in Nigeria \(Local\) or at one of our overseas hubs/i.test(text)) {
        lastQuestionType = "ask_destination";
      } else if (/Which international hub suits your schedule best/i.test(text)) {
        lastQuestionType = "ask_hub";
      }
      if (msg.cards && Array.isArray(msg.cards)) {
        const progCard = msg.cards.find((c) => c.kind === "programme");
        if (progCard && progCard.kind === "programme") lastProgrammeSlug = progCard.slug;
      }
    }
  }

  return {
    hasGreeted,
    lastTopic,
    lastDestination,
    lastProgrammeSlug,
    lastQuestionType,
    turnCount: history.length,
  };
}

export function getConciergeReply(
  input: string,
  historyOrContext?: ConversationTurn[] | ConciergeContext
): ConciergeReply {
  const q = input.trim();
  if (!q) {
    return {
      text: "Tell me what training or institutional information you are looking for, and I will guide you.",
    };
  }

  const context: ConciergeContext = Array.isArray(historyOrContext)
    ? extractContextFromHistory(historyOrContext)
    : historyOrContext || { hasGreeted: false, turnCount: 0 };

  const norm = normalizeSearchText(q);

  // Conversational Gratitude
  if (/\b(thank(s|\s+you)?|appreciate(d)?|helpful|great|awesome)\b/i.test(q)) {
    return publishable({
      text: "You are welcome. If you need any further programme recommendations, fee details, or enquiry assistance, feel free to ask.",
      cards: [
        { kind: "link", label: "Browse 2026 Training Calendar", to: "/programmes" },
        { kind: "link", label: "Make an Enquiry", to: "/contact?type=Local+Open+Training+Registration" },
      ],
    });
  }

  // 1. Greetings & Welcome
  if (/\b(hi|hello|hey|good (morning|afternoon|evening)|greetings)\b/i.test(q)) {
    if (context.hasGreeted) {
      return publishable({
        text: "Hello again! How can I assist you further with GIBS programmes, locations, or admissions?",
        cards: [
          { kind: "link", label: "Browse 2026 Training Calendar", to: "/programmes" },
          { kind: "link", label: "Foreign Training Hubs", to: "/executive-education" },
        ],
      });
    }
    return publishable({
      text: `Welcome to Goshen International Business School (GIBS). We offer ${LOCAL_PROGRAMMES_COUNT} Local Open Training Programmes and ${FOREIGN_PROGRAMMES_COUNT} Foreign Executive Training Programmes across Kigali, Dubai, London, and Houston. \n\nI can help you find a specific programme, explain our foreign training hubs, or guide you through the enquiry process. What would you like to explore today?`,
      cards: [
        { kind: "link", label: "Browse 2026 Training Calendar", to: "/programmes", detail: `${LOCAL_PROGRAMMES_COUNT} Local & ${FOREIGN_PROGRAMMES_COUNT} Foreign Courses` },
        { kind: "link", label: "Foreign Training Hub hubs", to: "/executive-education", detail: "Kigali, Dubai, London & Houston" },
        { kind: "link", label: "Contact Training Desk", to: "/contact", detail: "Direct email & phone lines" },
      ],
    });
  }

  // 2. Capabilities ("What can you do?")
  if (/\b(what can you do|how can you help|what are your capabilities|what do you do)\b/i.test(q)) {
    return publishable({
      text: "I am the GIBS AI concierge. I can help you navigate our institutional offerings by:\n\n• Finding and exploring local and foreign training programmes\n• Providing details on our international hubs (Kigali, Dubai, London, and Houston)\n• Answering questions about GIBS locations, governance, and purpose\n• Guiding you through the enquiry and registration process\n• Directing you to the right contact for customized in-plant workshops\n\nWould you like to start by browsing the 2026 Training Calendar or asking about a specific topic?",
      cards: [
        { kind: "link", label: "Browse 2026 Training Calendar", to: "/programmes" },
        { kind: "link", label: "Foreign Training Hubs", to: "/executive-education" },
        { kind: "link", label: "Contact the Registry", to: "/contact" },
      ],
    });
  }

  // 3. Institutional Intro ("Tell me more about GIBS")
  if (/\b(tell me more about gibs|who is gibs|what is gibs|about gibs)\b/i.test(q)) {
    return publishable({
      text: `Goshen International Business School (GIBS) is a professional development institution dedicated to national manpower development, management excellence, and professional capacity-building.\n\nWe specialize in executive training across various sectors, offering ${LOCAL_PROGRAMMES_COUNT} Local Open programmes in Nigeria and ${FOREIGN_PROGRAMMES_COUNT} Foreign Executive programmes across our hubs in Kigali, Dubai, London, and Houston.\n\nOur goal is to equip professionals and organizations with the leadership and management skills necessary for institutional growth. You can explore our full calendar or make a direct enquiry for further guidance.`,
      cards: [
        { kind: "link", label: "About GIBS", to: "/about" },
        { kind: "link", label: "Browse 2026 Training Calendar", to: "/programmes" },
        { kind: "link", label: "Make an Enquiry", to: "/contact" },
      ],
    });
  }
  if (
    /\b(training for (our|my|a)?\s*staff|train (our|my)?\s*staff|capacity building for (our|my)?\s*staff|staff training)\b/i.test(q) &&
    !/\b(hospital|nursing|doctor)\b/i.test(q)
  ) {
    return publishable({
      text: "GIBS provides professional capacity building for teams across our 113 local programmes and 22 foreign executive programmes, as well as customized in-plant workshops tailored directly to your organisation's mandate. What subject, cadre, or department does your staff require training in?",
      cards: [
        { kind: "link", label: "Request Customized In-Plant Workshop", to: "/contact?type=Customized+In-Plant+Workshop+Request" },
        { kind: "link", label: "Browse 2026 Training Calendar", to: "/programmes" },
        { kind: "link", label: "Contact Training Desk", to: "/contact" },
      ],
    });
  }

  // Follow-up: "Tell me more" / "Explain that"
  if (/^(tell me more|explain that|can you explain that|more details)\b/i.test(norm)) {
    if (context.lastProgrammeSlug) {
      const p = PROGRAMMES.find((x) => x.slug === context.lastProgrammeSlug);
      if (p) {
        return publishable({
          text: `The ${p.title} programme focuses on ${p.summary}. It is held in ${p.destination} and is designed for ${p.targetAudience}. Would you like to see the full dates or make an enquiry for this specific course?`,
          cards: [
            programmeCard(p.slug),
            { kind: "link", label: "Make an Enquiry", to: "/contact?type=Local+Open+Training+Registration" },
          ],
        });
      }
    }
    if (context.lastTopic) {
      return publishable({
        text: `Regarding ${context.lastTopic}, GIBS offers specialized training and capacity-building tailored to professional standards. I can help you find a specific programme in this area or direct you to the training desk for more detailed institutional guidance.`,
        cards: [
          { kind: "link", label: "Browse Programmes", to: "/programmes" },
          { kind: "link", label: "Contact the Registry", to: "/contact" },
        ],
      });
    }
    return publishable({
      text: "Could you please specify what you would like more details about? For example, you can ask about a specific programme, one of our training hubs, or the enquiry process.",
      cards: [
        { kind: "link", label: "Browse 2026 Training Calendar", to: "/programmes" },
      ],
    });
  }

  // Follow-up: "What about the foreign ones?" / "Foreign ones?"
  if (/^(foreign ones|the foreign ones|overseas ones|international ones)\b/i.test(norm)) {
    if (context.lastTopic) {
      const foreignMatches = rankProgrammes(context.lastTopic, { destination: "Foreign" });
      if (foreignMatches.length > 0) {
        return publishable({
          text: `For overseas executive training in ${context.lastTopic}, GIBS offers ${foreignMatches.length} programme${foreignMatches.length > 1 ? "s" : ""} across our international hubs: Kigali, Dubai, London, and Houston.`,
          cards: [
            { kind: "link", label: "Explore All Foreign Programmes", to: "/executive-education" },
            ...foreignMatches.slice(0, 3).map((p) => programmeCard(p.slug)),
          ],
        });
      }
    }
    return publishable(foreignHubsReply());
  }

  // Follow-up: "How much does it cost?" / "Price?"
  if (/^(how much does it cost|what is the cost|price|fee|fees)\b/i.test(norm)) {
    if (context.lastProgrammeSlug) {
      const p = PROGRAMMES.find((x) => x.slug === context.lastProgrammeSlug);
      if (p) {
        const feeStr = `${p.currency === "USD" ? "$" : p.currency === "GBP" ? "£" : "₦"}${p.fee.toLocaleString()} ${p.currency}`;
        return publishable({
          text: `The published fee for ${p.title} is ${feeStr}. Please note that this is the standard rate; proforma invoices are provided upon formal enquiry.`,
          cards: [
            programmeCard(p.slug),
            { kind: "link", label: "Make an Enquiry", to: "/contact?type=Local+Open+Training+Registration" },
          ],
        });
      }
    }
    // Fallback to general fee info
    const enrolmentRule = RULES.find((rule) => rule.id === "enrolment");
    if (enrolmentRule) return publishable(enrolmentRule.reply);
  }

  // Follow-up: "Where is it held?" / "Location?"
  if (/^(where is it held|location|where is it)\b/i.test(norm)) {
    if (context.lastProgrammeSlug) {
      const p = PROGRAMMES.find((x) => x.slug === context.lastProgrammeSlug);
      if (p) {
        return publishable({
          text: `${p.title} is held in ${p.destination}. ${p.destination === "Local" ? "Local programmes are delivered across our Ilorin, Abuja, and Ibafo centers." : "Foreign programmes are delivered at our specialized hub in " + p.destination + "."}`,
          cards: [
            programmeCard(p.slug),
            { kind: "link", label: "Campus Locations", to: "/about" },
          ],
        });
      }
    }
    const campusRule = RULES.find((rule) => rule.id === "campus-locations");
    if (campusRule) return publishable(campusRule.reply);
  }

  // Follow-up: "How do I apply?" / "How to register?"
  if (/^(how do i apply|how to register|application process|how to enrol)\b/i.test(norm)) {
    const enrolmentRule = RULES.find((rule) => rule.id === "enrolment");
    if (enrolmentRule) {
      return publishable({
        text: `${enrolmentRule.reply.text} To begin the process, please use the contact form to send a formal enquiry.`,
        cards: enrolmentRule.reply.cards,
      });
    }
  }

  // Follow-up: "Local" or "Nigeria"
  if (/^(local|nigeria|domestic)$/i.test(norm)) {
    if (context.lastTopic) {
      const localMatches = rankProgrammes(context.lastTopic, { destination: "Local" });
      if (localMatches.length > 0) {
        return publishable({
          text: `Here are our local Nigerian programmes for ${context.lastTopic}, delivered across our Ilorin HQ, Abuja, and Ibafo centres:`,
          cards: [
            { kind: "link", label: "Browse all programmes", to: "/programmes" },
            ...localMatches.slice(0, 3).map((p) => programmeCard(p.slug)),
          ],
        });
      }
    }
  }

  // Follow-up: Hub name ("Dubai", "Kigali", "London", "Houston")
  if (/^(dubai|kigali|london|houston)$/i.test(norm)) {
    const hub = norm.charAt(0).toUpperCase() + norm.slice(1);
    if (context.lastTopic) {
      const hubMatches = rankProgrammes(context.lastTopic, { destination: hub });
      if (hubMatches.length > 0) {
        const topProg = PROGRAMMES.find((p) => p.slug === hubMatches[0].slug);
        const feeStr = topProg
          ? `${topProg.currency === "USD" ? "$" : topProg.currency === "GBP" ? "£" : "₦"}${topProg.fee.toLocaleString()} ${topProg.currency}`
          : "Approved Fee";
        return publishable({
          text: `In our ${hub} hub, GIBS offers "${hubMatches[0].label}". Published fee: ${feeStr} (${topProg?.schedule || "2026 Calendar"}). Would you like enquiry guidance for this programme?`,
          cards: [
            programmeCard(hubMatches[0].slug),
            { kind: "link", label: "Make an Enquiry", to: "/contact?type=Foreign+Training+Programmes+(Kigali,+Dubai,+London,+Houston)" },
          ],
        });
      }
    }
  }

  // Priority: Hub-specific queries that might also match programmes
  const requestedHub = destinationFromText(q);
  const isForeignHub = requestedHub && ["Kigali", "Dubai", "London", "Houston"].includes(requestedHub);
  const searchWords = searchTerms(q);
  const destinationOnly =
    searchWords.length === 1 &&
    /^(foreign|overseas|international|kigali|dubai|london|houston|rwanda|uae|uk|usa|texas)$/i.test(searchWords[0]);
  const hasHubOverview = /\bhubs?\b/i.test(q) && !/\b(programme|program|course)\b/i.test(q);
  const localHubIntent = /\b(local|nigeria|nigerian|ilorin|abuja|ibafo)\b/i.test(q) && /\bhubs?\b/i.test(q);

  if (localHubIntent) {
    const localHubRule = RULES.find((rule) => rule.id === "campus-locations");
    if (localHubRule) return publishable(localHubRule.reply);
  }
  if (hasHubOverview || (destinationOnly && (isForeignHub || requestedHub === "Foreign"))) {
    return publishable(foreignHubsReply(isForeignHub ? requestedHub : undefined));
  }

  // Restore campus-location precedence for explicit location-seeking questions.
  // City names (ilorin/abuja/ibafo) also occur in programme `schedule` fields,
  // and "office"-type questions score >=4 on office-management programmes, so a
  // naive "Where is your Ilorin office?" earns programme matches and would be
  // hijacked to programmeReply (line below) before the campus rule is consulted.
  // HEAD avoided this only by accident of score=0; here we make the precedence
  // explicit for unambiguously location-seeking questions, reusing the
  // authoritative campus-locations reply (no hardcoded addresses).
  const campusLocationRule = RULES.find((rule) => rule.id === "campus-locations");
  if (
    campusLocationRule &&
    campusLocationRule.test.test(q) &&
    /\b(where\s+is|where\s+are|where\s+can\s+i|how\s+do\s+i\s+get(?:\s+to)?|how\s+to\s+get(?:\s+to)?|how\s+do\s+i\s+visit)\b/i.test(q)
  ) {
    return publishable(campusLocationRule.reply);
  }

  const matches = rankProgrammes(q);
  const programmeIntent = hasProgrammeIntent(q);

  // Prioritize institutional rules over programme matches only if they are high-confidence matches.
  // If we have strong programme matches, we should return them first to support discovery.
  if (matches.length === 0) {
    for (const rule of RULES) {
      if (rule.test.test(q)) return publishable(rule.reply);
    }
  }

  // Fix for Test #9: If the user is asking about fees/costs but also provides a query
  // that matches programmes, the enrolment rule should still take precedence if
  // the user's primary intent is the fee.
  if (/\b(fee|fees|cost|price|tuition)\b/i.test(q)) {
    const enrolmentRule = RULES.find((rule) => rule.id === "enrolment");
    if (enrolmentRule) return publishable(enrolmentRule.reply);
  }

  if (matches.length && !destinationOnly && !hasHubOverview && (programmeIntent || matches.some((match) => match.topicMatch))) {
    return publishable(programmeReply(matches));
  }
  if (programmeIntent && !destinationOnly && !hasHubOverview) {
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
