/* ==========================================================================
   GIBS CONTENT LAYER — single source for site content.

   CONTENT INTEGRITY
   -----------------
   Nothing here is presented as an official fact unless it is generic
   institutional positioning. All dates, fees, durations, accreditation,
   faculty identities, statistics and curriculum details that only GIBS can
   confirm are flagged with DATA_REQUIRED and rendered by <DataNote/>.
   Replace these markers with official GIBS content before launch.
   ========================================================================== */

export const DATA_REQUIRED = "[OFFICIAL GIBS DATA REQUIRED]";

export const IMAGES = {
  hero: "/images/hero-campus.jpg",
  colonnade: "/images/campus-colonnade.jpg",
  library: "/images/library-interior.jpg",
  /*
   * PLACEHOLDER ALIASES — official photography not yet supplied.
   * Each alias maps to the closest available local asset.
   * Alt text describes what is ACTUALLY VISIBLE in the substituted image,
   * not the hypothetical future image. Replace image paths and alt text
   * together when official photography arrives.
   *
   * Original Pexels reference URLs (for photographer/art-direction reference):
   *   boardroom: https://images.pexels.com/photos/6950048/...
   *   city:      https://images.pexels.com/photos/29069344/...
   *   lecture:   https://images.pexels.com/photos/8197558/...
   *   seminar:   https://images.pexels.com/photos/14612128/...
   *   books:     https://images.pexels.com/photos/7703306/...
   *   study:     https://images.pexels.com/photos/7793679/...
   */
  boardroom: "/images/library-interior.jpg",
  city: "/images/hero-campus.jpg",
  lecture: "/images/library-interior.jpg",
  seminar: "/images/campus-colonnade.jpg",
  books: "/images/library-interior.jpg",
  study: "/images/library-interior.jpg",
};

export const NAV_LINKS = [
  { label: "Programmes", to: "/programmes" },
  { label: "Executive Education", to: "/executive-education" },
  { label: "Faculty & Research", to: "/faculty" },
  { label: "About GIBS", to: "/about" },
  { label: "Admissions", to: "/admissions" },
];

/* ---------------- Events ----------------
   No events are fabricated. The official calendar is marked pending and the
   interface is fully built: categories, featured/upcoming/past grouping,
   filtering and registration CTAs all activate the moment official events
   are supplied through this array. */

export type GIBS_EVENT = {
  slug: string;
  title: string;
  category:
    | "Public Lecture"
    | "Conference"
    | "Executive Session"
    | "Open Day"
    | "Research";
  date: string;
  time: string;
  location: string;
  excerpt: string;
  status: "upcoming" | "past";
};

export const EVENTS: GIBS_EVENT[] = [];

/* ---------------- Programmes ---------------- */

export type ProgrammeCategory =
  | "Degree"
  | "Executive"
  | "Doctoral"
  | "Undergraduate";

export type Programme = {
  slug: string;
  title: string;
  category: ProgrammeCategory;
  tagline: string;
  summary: string;
  audience: string[];
  indicativeStructure: string[];
  outcomes: string[];
  format: string;
  duration: string;
  startDate: string;
  fees: string;
  requirements: string;
  faqs: { q: string; a: string }[];
  officialOnly: string[];
};

export const PROGRAMMES: Programme[] = [
  {
    slug: "mba",
    title: "MBA",
    category: "Degree",
    tagline: "The flagship transformation in general management",
    summary:
      "Built for managers ready to lead institutions: rigorous management scholarship with repeated practice in judgment, leadership and enterprise.",
    audience: [
      "Mid-career professionals moving into general management",
      "Founders scaling ventures beyond the start-up phase",
      "Specialists transitioning into cross-functional leadership",
    ],
    indicativeStructure: [
      "Core management disciplines: finance, strategy, markets, operations and people",
      "Leadership practice and communication, taught through repeated rehearsal",
      "Global Africa and emerging-market perspective",
      "Applied institutional project with a live organization",
      "Electives aligned to each fellow's trajectory",
    ],
    outcomes: [
      "A disciplined, portable framework for leading complex organizations",
      "Judgment tested against live markets and real institutions",
      "A lifelong network of peers, faculty and practitioners",
    ],
    format: DATA_REQUIRED + "; full-time and/or modular format to be confirmed",
    duration: DATA_REQUIRED,
    startDate: DATA_REQUIRED,
    fees: DATA_REQUIRED,
    requirements: DATA_REQUIRED,
    faqs: [
      {
        q: "Is the MBA offered full-time or on a modular schedule?",
        a: "Available study formats and the official calendar are published by the registrar.",
      },
      {
        q: "What are the entrance requirements?",
        a: "Academic prerequisites, professional experience and admissions assessments are programme-specific and published once confirmed.",
      },
      {
        q: "Are scholarships or financial aid available?",
        a: "The scholarships and financing framework is published with the official admissions materials.",
      },
    ],
    officialOnly: ["Duration", "Intake dates", "Tuition & fees", "Entry requirements"],
  },
  {
    slug: "executive-mba",
    title: "Executive MBA",
    category: "Degree",
    tagline: "For senior leaders who keep working while they learn",
    summary:
      "For experienced leaders whose work cannot pause: the MBA spine in a modular rhythm built around executive responsibilities and immediate application.",
    audience: [
      "Senior managers, directors and heads of function",
      "Executives preparing for C-suite and board-level roles",
      "Leaders of fast-scaling African enterprises",
    ],
    indicativeStructure: [
      "The MBA core, sequenced for working executives",
      "Residential and modular convening blocks",
      "Strategy, governance and organizational leadership",
      "An applied strategic initiative within the fellow's own organization",
      "Executive coaching and peer advisory practice",
    ],
    outcomes: [
      "Strategic confidence at the level of the enterprise",
      "A leadership language shared across functions and borders",
      "Immediate return on learning within the sponsoring organization",
    ],
    format: DATA_REQUIRED + "; modular/residential schedule to be confirmed",
    duration: DATA_REQUIRED,
    startDate: DATA_REQUIRED,
    fees: DATA_REQUIRED,
    requirements: DATA_REQUIRED,
    faqs: [
      {
        q: "How is the Executive MBA scheduled around work?",
        a: "Residential block frequency and the official calendar are published by the registrar.",
      },
      {
        q: "Can an organization sponsor a cohort of leaders?",
        a:
          "Sponsored executives are common, and custom cohort arrangements can be discussed through Executive Education. Commercial terms are published once confirmed.",
      },
    ],
    officialOnly: ["Residential schedule", "Intake dates", "Tuition & fees", "Sponsorship terms"],
  },
  {
    slug: "doctorate-business-administration",
    title: "Doctor of Business Administration",
    category: "Doctoral",
    tagline: "Original knowledge for scholar-practitioners",
    summary:
      "A professional doctorate for practitioners producing durable, original research into how organizations are led and understood.",
    audience: [
      "Senior practitioners, consultants and executives with a research question",
      "Faculty moving between practice and the academy",
      "Leaders shaping policy, capital and enterprise across the Global Africa",
    ],
    indicativeStructure: [
      "Research philosophy and doctoral method",
      "Supervised original inquiry into a live organizational problem",
      "Faculty-led research workshops and examination",
      "A dissertation contributing new managerial knowledge",
    ],
    outcomes: [
      "Doctoral-level research capability",
      "A defended contribution to management practice",
      "Membership in a community of practicing scholars",
    ],
    format: DATA_REQUIRED,
    duration: DATA_REQUIRED,
    startDate: DATA_REQUIRED,
    fees: DATA_REQUIRED,
    requirements: DATA_REQUIRED,
    faqs: [
      {
        q: "How does the DBA differ from a PhD?",
        a:
          "The DBA centres on rigorous, supervised research into a live problem of practice, rather than a primarily academic career path. Examination structure is published once confirmed.",
      },
      {
        q: "Who supervises doctoral candidates?",
        a:
          "Faculty profiles are being prepared for publication. The official supervisor directory is published on the Faculty & Research page once appointments are confirmed.",
      },
    ],
    officialOnly: ["Supervisory faculty", "Examination structure", "Intake & fees"],
  },
  {
    slug: "executive-education",
    title: "Executive Education — Open Programmes",
    category: "Executive",
    tagline: "Short, intensive programs for rising and senior leaders",
    summary:
      "Focused programmes for rising and senior leaders: strategy, leadership, finance, governance and enterprise growth.",
    audience: [
      "High-potential managers on a leadership track",
      "Senior executives updating strategic capability",
      "Teams seeking a shared language before a major transition",
    ],
    indicativeStructure: [
      "Focused programs of several days or modular weeks",
      "Faculty-led sessions paired with practitioner cases",
      "Applied work tied to the participant's organization",
      "Optional continuation through the EMBA pathway",
    ],
    outcomes: [
      "A specific capability uplift, defined before the program begins",
      "A cross-industry peer group",
      "A practical artifact ready to use on return to work",
    ],
    format: DATA_REQUIRED + "; programme calendar and formats to be published",
    duration: DATA_REQUIRED,
    startDate: DATA_REQUIRED,
    fees: DATA_REQUIRED,
    requirements: "Open to nominated and self-nominated leaders; " + DATA_REQUIRED,
    faqs: [
      {
        q: "When is the next open programme?",
        a: "The public executive calendar is published on the Events page once confirmed.",
      },
    ],
    officialOnly: ["Programme calendar", "Faculty", "Fees", "Locations"],
  },
  {
    slug: "custom-programmes",
    title: "Custom Programmes for Organizations",
    category: "Executive",
    tagline: "Leadership journeys built around one institution",
    summary:
      "Leadership journeys designed around one institution, built with boards, governments and fast-scaling firms.",
    audience: [
      "Boards and executive committees facing a strategic transition",
      "Public-sector and development institutions",
      "Regional and pan-African enterprises scaling across markets",
    ],
    indicativeStructure: [
      "Diagnosis with leadership and the sponsoring executive",
      "A jointly authored learning architecture",
      "Faculty-led convening, coaching and application work",
      "Measurement tied to the institution's own outcomes",
    ],
    outcomes: [
      "Alignment across the leadership team",
      "Capability where the strategy actually depends on it",
      "An internal language and method that outlasts the program",
    ],
    format: "Designed per engagement; " + DATA_REQUIRED,
    duration: DATA_REQUIRED,
    startDate: "Convened on agreement; " + DATA_REQUIRED,
    fees: DATA_REQUIRED + "; scoped per engagement",
    requirements: "By consultation; " + DATA_REQUIRED,
    faqs: [
      {
        q: "How does a custom engagement begin?",
        a: "With a confidential conversation with the Executive Education team. Begin via the Concierge or the Contact page.",
      },
    ],
    officialOnly: ["Engagement terms", "Faculty assignments", "Pricing"],
  },
  {
    slug: "undergraduate-business",
    title: "Undergraduate Business Programme",
    category: "Undergraduate",
    tagline: "A first degree in management and enterprise",
    summary:
      "A foundation in management, enterprise and the liberal arts for young people who can think clearly, write well and lead early.",
    audience: [
      "School-leavers preparing for a business or enterprise trajectory",
      "Early-career entrants seeking a rigorous first degree",
    ],
    indicativeStructure: [
      "Management and quantitative foundations",
      "Economics, enterprise and the liberal arts",
      "Internship and applied enterprise practice",
      "Capstone business inquiry",
    ],
    outcomes: [
      "A broad, rigorous foundation for business careers",
      "Early fluency across the disciplines of management",
      "A pathway into graduate work or enterprise",
    ],
    format: DATA_REQUIRED,
    duration: DATA_REQUIRED,
    startDate: DATA_REQUIRED,
    fees: DATA_REQUIRED,
    requirements: DATA_REQUIRED,
    faqs: [
      {
        q: "What qualifications are awarded?",
        a: "The official undergraduate award titles and accreditation are published once confirmed.",
      },
    ],
    officialOnly: ["Award title", "Accreditation", "Intake & fees", "Entry requirements"],
  },
];

export const PROGRAM_CATEGORIES: ("All" | ProgrammeCategory)[] = [
  "All",
  "Degree",
  "Executive",
  "Doctoral",
  "Undergraduate",
];

export function getProgramme(slug: string) {
  return PROGRAMMES.find((p) => p.slug === slug);
}

export function relatedProgrammes(slug: string, count = 3) {
  const current = getProgramme(slug);
  if (!current) return PROGRAMMES.slice(0, count);
  return PROGRAMMES.filter((p) => p.slug !== slug)
    .sort((a, b) => Number(b.category === current.category) - Number(a.category === current.category))
    .slice(0, count);
}

/* ---------------- Research & insights ---------------- */

export const RESEARCH_THEMES = [
  {
    title: "Leadership & Institutions",
    blurb: "How durable institutions are built, led and renewed.",
  },
  {
    title: "Markets & the Global Africa",
    blurb: "Capital, enterprise and development across African markets.",
  },
  {
    title: "Enterprise, Innovation & Scale",
    blurb: "Founding, financing and scaling ventures under conditions of real uncertainty.",
  },
  {
    title: "Organizations & the Future of Work",
    blurb: "How organizations decide, develop people and reorganize.",
  },
];

export const INSIGHT_TYPES = ["All", "Research", "Leadership Perspective", "Case Study", "Events"];

/* ---------------- Editorial (Research & Insights) ---------------- */

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string };

export type Article = {
  slug: string;
  category: string;
  kicker: string;
  title: string;
  dek: string;
  image: string;
  alt: string;
  status: "Forthcoming";
  blocks: ArticleBlock[];
  related: string[];
};

export const ARTICLES: Article[] = [
  {
    slug: "quiet-authority-of-long-term-institutions",
    category: "Leadership & Institutions",
    kicker: "Flagship essay",
    title: "The quiet authority of long-term institutions",
    dek: "Why the organizations that shape centuries rarely optimize for the loudest quarter — and what that asks of their leaders.",
    image: IMAGES.books,
    alt: "Hardbound research volumes arranged by hand in warm library light",
    status: "Forthcoming",
    blocks: [
      {
        type: "p",
        text: "There is a particular quality of authority that does not announce itself. It belongs to institutions that expect to exist in a hundred years, and make decisions accordingly. Their leaders are not uninterested in results; they are interested in a different order of result.",
      },
      {
        type: "p",
        text: "This essay, the opening statement of the GIBS journal, argues that management education has drifted toward the temporality of the quarter and the feed, and that a serious school must deliberately teach the long view: compounding reputation, inherited trust, institutions that outlive their founders.",
      },
      { type: "h2", text: "The long view as a discipline" },
      {
        type: "p",
        text: "Long-termism is not patience as a temperament. It is a discipline of decisions about capital, people, quality and silence, one that can be taught, rehearsed and measured. It depends on leaders who can hold two horizons at once: the urgent institution in front of them and the distant one they are answerable to.",
      },
      {
        type: "quote",
        text: "Authority, quietly held, is the freedom to make the decision that only looks correct in twenty years.",
      },
      { type: "h2", text: "What the journal will examine" },
      {
        type: "p",
        text: "The published essay will draw on institutional history, governance practice and the experience of founders building for permanence across the Global Africa. It will avoid the consolations of rankings and the noise of the news cycle, and ask instead what institutions require of the people entrusted with them.",
      },
    ],
    related: ["changed-decisions", "growth-mapped-from-the-continent"],
  },
  {
    slug: "growth-mapped-from-the-continent",
    category: "Markets & the Global Africa",
    kicker: "Research preview",
    title: "The next decade of growth, mapped from the continent",
    dek: "The demographic, capital and infrastructure shifts rewriting the investment map, seen from the markets themselves.",
    image: IMAGES.city,
    alt: "The GIBS campus at golden hour, sandstone pavilions and open sky",
    status: "Forthcoming",
    blocks: [
      {
        type: "p",
        text: "Most maps of the next global economy are still drawn elsewhere. This research preview sets out the questions GIBS faculty will pursue with investors, operators and officials inside the markets the maps describe.",
      },
      { type: "h2", text: "Three shifts worth studying closely" },
      {
        type: "p",
        text: "The first is the restructuring of capital: the slow rise of patient, institutional and domestic capital alongside external flows. The second is infrastructure as strategy, where logistics and energy reshape what is possible for enterprise. The third is demography, not as a dividend assumed but as an obligation to be met through education and employment at scale.",
      },
      {
        type: "quote",
        text: "A market mapped from outside is a forecast. Mapped from inside, it becomes a plan.",
      },
      {
        type: "p",
        text: "The full research piece will be published as the underlying fieldwork and case material are completed. Figures, where cited, will carry sources and dates.",
      },
    ],
    related: ["quiet-authority-of-long-term-institutions", "changed-decisions"],
  },
  {
    slug: "changed-decisions",
    category: "Enterprise, Innovation & Scale",
    kicker: "Leadership perspective",
    title: "Executive education, measured in changed decisions",
    dek: "How to judge a leadership programme: not by decks completed, but by decisions made differently afterwards.",
    image: IMAGES.seminar,
    alt: "Sunlight through the sandstone colonnade of the GIBS campus",
    status: "Forthcoming",
    blocks: [
      {
        type: "p",
        text: "Most executive education is evaluated at the wrong moment. The satisfaction survey closes while the lessons are still warm; the true test arrives weeks later, in a meeting where a leader must decide under pressure.",
      },
      { type: "h2", text: "A harder, fairer measure" },
      {
        type: "p",
        text: "GIBS proposes a simple shift in perspective: a programme succeeds when it changes a specific decision the participant would otherwise have made, such as a hire, an allocation, or a conversation avoided or held. That standard changes how a programme is designed before it changes how it is measured.",
      },
      {
        type: "p",
        text: "The perspective will be developed alongside the organizations that commission custom work, with honest accounts of failure included. It will be published in the first edition of the journal.",
      },
    ],
    related: ["quiet-authority-of-long-term-institutions", "growth-mapped-from-the-continent"],
  },
];

export function getArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}

export function relatedArticles(slug: string, count = 2) {
  const current = getArticle(slug);
  if (!current) return ARTICLES.slice(0, count);
  return current.related
    .map((s) => ARTICLES.find((a) => a.slug === s))
    .filter((a): a is Article => Boolean(a))
    .slice(0, count);
}

/* ---------------- Admissions ---------------- */

export const ADMISSIONS_STEPS = [
  {
    n: "01",
    title: "Discover",
    body: "Explore the programmes, attend an open conversation, ask the Concierge anything.",
  },
  {
    n: "02",
    title: "Choose",
    body: "Select the pathway that fits your trajectory. Admissions helps if the choice is unclear.",
  },
  {
    n: "03",
    title: "Prepare",
    body: "Assemble the academic record, professional history and any assessments required.",
  },
  {
    n: "04",
    title: "Apply",
    body: "Submit through the official channel. The registrar guides every candidate personally.",
  },
  {
    n: "05",
    title: "Review",
    body: "Shortlisted candidates take part in a structured admissions conversation.",
  },
  {
    n: "06",
    title: "Begin",
    body: "Decisions arrive on the official calendar, then enrolment and welcome into the cohort.",
  },
];

export const REQUIREMENTS_ACCORDION = [
  {
    q: "Academic record",
    a: "Qualifications appropriate to each programme's level. Precise thresholds and the treatment of prior learning are programme-specific and published by the registrar.",
  },
  {
    q: "Professional experience",
    a: "Postgraduate and executive pathways expect relevant experience. The nature and duration required per programme are published by the registrar.",
  },
  {
    q: "Statement of purpose",
    a: "Candidates write a short account of the trajectory they intend and why GIBS is the right institution for it. Prompts sit within the official application.",
  },
  {
    q: "References and supporting materials",
    a: "References, portfolios and standardized assessments, where required, are listed in the official application materials.",
  },
  {
    q: "Admissions conversation",
    a: "Shortlisted candidates take part in a structured conversation with faculty or admissions staff, an exchange about intent and fit.",
  },
  {
    q: "International candidates",
    a: "GIBS is conceived as an international school. Visa, residency and language guidance is country-specific, and admissions advises each candidate personally.",
  },
];

/* Editorial category bands for homepage programme discovery.
   Grouping is a navigation aid, not an official taxonomy — it invents no
   programme facts; every item links to its verified-detail page. */
export const HOME_PROGRAMME_BANDS: {
  band: string;
  note: string;
  slugs: string[];
}[] = [
  {
    band: "Undergraduate & Degree",
    note: "The first degree and the flagship MBA",
    slugs: ["mba", "undergraduate-business"],
  },
  {
    band: "Postgraduate",
    note: "Executive MBA and the professional doctorate",
    slugs: ["executive-mba", "doctorate-business-administration"],
  },
  {
    band: "Executive Education",
    note: "Open convenings for rising and senior leaders",
    slugs: ["executive-education"],
  },
  {
    band: "Professional",
    note: "Custom journeys built for one institution",
    slugs: ["custom-programmes"],
  },
];

export const ADMISSIONS_FAQS = [
  {
    q: "When do applications open and close?",
    a: "Deadlines and intake dates are published by the registrar once confirmed.",
  },
  {
    q: "What documents and qualifications are required?",
    a: "Programme-specific entry requirements are published on each programme page once confirmed.",
  },
  {
    q: "Is there financial aid, scholarships or sponsorship?",
    a: "The scholarship, bursary and employer-sponsorship framework is published by the registrar once confirmed.",
  },
  {
    q: "Can I visit the campus before applying?",
    a: "Visits and open days are coordinated through the Concierge. Scheduled open-day dates appear on the Events calendar once confirmed.",
  },
  {
    q: "Do you admit international candidates?",
    a: "GIBS is conceived as an international school. Visa, residency and language guidance is country-specific and advised personally by admissions.",
  },
];

/* ---------------- Campus ---------------- */

export const CAMPUS_FACILITIES = [
  { name: "The Library", note: "Quiet reading, collections and research rooms" },
  { name: "The Forum", note: "Convening hall for lectures and public dialogue" },
  { name: "Learning Studios", note: "Case rooms, group work and practice spaces" },
  { name: "The Enterprise Studio", note: "Ventures, making and applied project work" },
  { name: "Quadrangles & Gardens", note: "Open-air cloisters for conversation" },
  { name: "Residences & Common Rooms", note: "For residential fellows and executives" },
];

/* ---------------- Contact ---------------- */

export const ENQUIRY_TYPES = [
  "Programmes & MBA admissions",
  "Executive education",
  "Custom programmes for my organization",
  "Doctoral research",
  "Campus visits & events",
  "Media & partnerships",
  "Something else",
];

/* ---------------- Static page index (powers search) ---------------- */

export const STATIC_PAGES = [
  { title: "Programmes", to: "/programmes", blurb: "MBA, EMBA, doctorate, executive and undergraduate pathways.", type: "Page" },
  { title: "Executive Education", to: "/executive-education", blurb: "Open programmes and custom leadership journeys for organizations.", type: "Page" },
  { title: "Admissions", to: "/admissions", blurb: "The application journey, requirements, dates and FAQs.", type: "Page" },
  { title: "About GIBS", to: "/about", blurb: "Identity, vision, mission, values and the institution in formation.", type: "Page" },
  { title: "Faculty & Research", to: "/faculty", blurb: "Research areas, faculty directory status and scholarly work.", type: "Page" },
  { title: "Research & Insights", to: "/research-insights", blurb: "Research themes, leadership perspectives and case studies.", type: "Page" },
  { title: "Campus", to: "/campus", blurb: "The campus, learning environments, facilities and visiting.", type: "Page" },
  { title: "Gallery", to: "/gallery", blurb: "Architecture, classrooms, facilities, student life and outdoor spaces.", type: "Page" },
  { title: "Events", to: "/events", blurb: "Public lectures, open days and executive convenings.", type: "Page" },
  { title: "Contact", to: "/contact", blurb: "Reach admissions, executive education and the institution.", type: "Page" },
  { title: "GIBS Concierge", to: "/concierge", blurb: "A guided assistant for finding your way through GIBS.", type: "Page" },
];
