import { PROGRAMMES } from "./data";

/* ==========================================================================
   GIBS CONCIERGE — frontend conversation engine.

   IMPORTANT: This is a deterministic, rule-based routing assistant — NOT an
   AI system and not a pretence of one. It exists to guide visitors to the
   right pages and actions.

   INTEGRATION SEAM
   ----------------
   To connect a real provider (LLM API, support backend, etc.), replace
   `getConciergeReply` with an async call to your service. The message and
   card types below are the contract the UI renders — a live API can return
   the same shape. Keep all keys and endpoints server-side.
   ========================================================================== */

export type ConciergeCard =
  | { kind: "link"; label: string; to: string; detail?: string }
  | { kind: "programme"; slug: string; label: string; detail?: string };

export type ConciergeReply = {
  text: string;
  cards?: ConciergeCard[];
};

export const CONCIERGE_SUGGESTIONS = [
  "Which programme is right for me?",
  "How does the admissions process work?",
  "Tell me about Executive Education.",
  "What can I expect from GIBS?",
  "Campus experience",
  "Speak with admissions",
];

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
      text: "Welcome to GIBS Concierge. I can guide you through our programmes, admissions, executive education, the campus and our team. How can I help you find your way?",
    },
  },
  {
    test: /\b(mba|emba|executive mba|degree|doctorate|dba|phd|undergrad|program|programme|study|studying)\b/i,
    reply: {
      text: "GIBS offers a family of pathways: the MBA, Executive MBA, Doctor of Business Administration, executive programmes and undergraduate business study. Each programme page outlines its audience and structure, with official details such as dates and fees clearly marked pending publication.",
      cards: [
        programmeCard("mba"),
        programmeCard("executive-mba"),
        programmeCard("doctorate-business-administration"),
        { kind: "link", label: "See all programmes", to: "/programmes", detail: "Browse and filter every pathway" },
      ],
    },
  },
  {
    test: /\b(executive|exec ed|corporate|organization|organisation|company|custom|board|training)\b/i,
    reply: {
      text: "Executive Education serves both individuals through open programmes and organizations through custom leadership journeys. Custom engagements begin with a confidential diagnosis with our team.",
      cards: [
        programmeCard("executive-education"),
        programmeCard("custom-programmes"),
        { kind: "link", label: "Executive Education", to: "/executive-education" },
      ],
    },
  },
  {
    test: /\b(apply|admission|admissions|application|apply now|entr(y|ance)|requirement|deadline|intake|fee|fees|tuition|scholarship|bursary)\b/i,
    reply: {
      text: "Admissions follows a six-step journey: consult, prepare, apply, converse, then decision and enrolment. Official dates, requirements, fees and scholarship terms are pending publication and marked clearly throughout. The Concierge can connect you with the admissions office directly.",
      cards: [
        { kind: "link", label: "Admissions journey & FAQs", to: "/admissions" },
        { kind: "link", label: "Contact admissions", to: "/contact?type=Programmes+%26+MBA+admissions" },
      ],
    },
  },
  {
    test: /\b(campus|visit|tour|library|facilit|building|residence|where are you|location|address)\b/i,
    reply: {
      text: "The campus is designed around stone, light and quiet intention: libraries, case rooms, a convening forum, gardens and residential quarters. The official address and open-day schedule are being prepared; the Concierge can arrange a visit directly.",
      cards: [
        { kind: "link", label: "Explore the campus", to: "/campus" },
        { kind: "link", label: "Arrange a visit", to: "/contact?type=Campus+visits+%26+events" },
      ],
    },
  },
  {
    test: /\b(faculty|professor|lecturer|research|insight|publication|paper|thought leadership)\b/i,
    reply: {
      text: "Faculty and research are organized around four themes: leadership and institutions, markets and the Global Africa, enterprise and scale, and organizations and the future of work. The official faculty directory is being prepared for publication.",
      cards: [
        { kind: "link", label: "Faculty & Research", to: "/faculty" },
        { kind: "link", label: "Research & Insights", to: "/research-insights" },
      ],
    },
  },
  {
    test: /\b(event|lecture|open day|open-day|seminar|when)\b/i,
    reply: {
      text: "Public lectures, open days and executive convenings will appear on the Events calendar as dates are confirmed. The calendar currently shows its official-data pending state rather than placeholder events.",
      cards: [{ kind: "link", label: "Events calendar", to: "/events" }],
    },
  },
  {
    test: /\b(contact|email|phone|call|talk|speak|someone|human|advis(or|er|e))\b/i,
    reply: {
      text: "Of course. You can send a structured enquiry to the right team through the contact form, and the Concierge can route you there with the enquiry type pre-selected.",
      cards: [
        { kind: "link", label: "Contact GIBS", to: "/contact" },
        {
          kind: "link",
          label: "Programmes & MBA admissions",
          to: "/contact?type=Programmes+%26+MBA+admissions",
        },
        {
          kind: "link",
          label: "Executive education",
          to: "/contact?type=Executive+education",
        },
      ],
    },
  },
  {
    test: /\b(expect|experience|what.*(like|can i)|why gibs|life at|student life)\b/i,
    reply: {
      text: "Expect a deliberately unhurried education: scholarship grounded in practice, conversations that continue after seminars, a campus built for study and dialogue, and faculty invested in each fellow's trajectory.",
      cards: [
        { kind: "link", label: "The GIBS experience", to: "/campus" },
        { kind: "link", label: "About GIBS", to: "/about" },
        { kind: "link", label: "Programmes", to: "/programmes" },
      ],
    },
  },
  {
    test: /\b(about|who is|history|mission|vision|values|accreditation|gibs)\b/i,
    reply: {
      text: "GIBS is an international business school built around modern classicism, global excellence and an African heart. The About page sets out the institution's identity, mission and values.",
      cards: [{ kind: "link", label: "About GIBS", to: "/about" }],
    },
  },
];

const FALLBACK: ConciergeReply = {
  text: "That's a question best handled by a colleague. I can help with programmes, admissions, executive education, the campus, faculty and research, or events, and I can route your enquiry directly to the right team.",
  cards: [
    { kind: "link", label: "See all programmes", to: "/programmes" },
    { kind: "link", label: "Contact GIBS", to: "/contact" },
  ],
};

export function getConciergeReply(input: string): ConciergeReply {
  const q = input.trim();
  if (!q) {
    return {
      text: "Tell me a little about what you're looking for, whether a programme, admissions, executive education or a visit, and I'll guide you.",
    };
  }
  for (const rule of RULES) {
    if (rule.test.test(q)) return rule.reply;
  }
  return FALLBACK;
}
