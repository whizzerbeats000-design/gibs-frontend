/* ==========================================================================
   GIBS PROGRAMME CONTENT LAYER
   Supplementary, status-gated content for the 135 GIBS programmes.

   This file is the SINGLE source of truth for topic-specific programme copy
   (summaries, learning outcomes, curriculum, FAQs, related-programme links).
   It is deliberately kept SEPARATE from src/lib/data.ts, which is byte-locked
   and therefore cannot be edited to remove the templated duplication that
   affects outcomes, structure, summary and FAQs across the catalogue.

   Publication rule (enforced in BOTH scripts/seo-gen.mjs and
   src/pages/ProgrammeDetail.tsx): only content whose `status` is `approved` is
   ever rendered into static HTML, JSON-LD, the sitemap or llms.txt.
   `pending-verification` / `draft` entries are ignored and the page silently
   falls back to the catalogue values in data.ts.

   NOTE on style: object keys are quoted (e.g. "code":) to match the record
   style already used in src/lib/data.ts, so scripts/seo-gen.mjs can parse this
   file with the SAME balanced-bracket + quoted-key extractors it already uses
   for data.ts — no extra loader or parser required.
   ========================================================================== */

import type { Programme } from "../types/data";

export type ContentStatus = "approved" | "pending-verification" | "draft";

export interface ProgrammeContent {
  code: string;
  status: ContentStatus;
  summary?: string;
  outcomes?: string[];
  structure?: string[];
  faqs?: { q: string; a: string }[];
  relatedSlugs?: string[];
  intro?: string;
  source?: string;
}

/**
 * Programme code -> curated content. Keyed by code so the protected identifiers
 * in data.ts are never altered; this layer overrides only the *narrative*
 * fields (summary/outcomes/structure/faqs/related), never code, slug, category,
 * fee, schedule, etc.
 *
 * Seeded entries below are editorial DRAFTS marked `pending-verification`. They
 * do NOT render until a GIBS syllabus owner confirms the source and sets
 * `status: "approved"`. See src/lib/programme-content.REGISTRY.md and the
 * requirements register (scripts/qa/requirements_register.csv).
 */
export const PROGRAMME_CONTENT: Record<string, ProgrammeContent> = {
  "GIBS-LOC-101": {
    "code": "GIBS-LOC-101",
    "status": "pending-verification",
    "summary": "Advanced Public Speaking and Presentation Skills is a 5-day executive workshop that develops the mechanics and judgment of high-stakes communication for protocols staff, executive assistants and PAs who present to C-suite and board audiences.",
    "outcomes": [
      "Structure executive briefings, board papers and stakeholder presentations for clarity under pressure",
      "Apply voice, pace and posture control to command presence across live, hybrid and recorded presentations",
      "Manage difficult questions and hostile scrutiny without losing composure or credibility",
      "Use visual aids and slide architecture that reinforce—rather than obscure—the message",
      "Deliver confident presentations in English for multilingual executive audiences"
    ],
    "structure": [
      "Day 1: Presence, posture and the physiology of confidence",
      "Day 2: Storytelling frameworks for executive briefings",
      "Day 3: Slide design and visual argument for senior audiences",
      "Day 4: Handling Q&A, hostility and off-script moments",
      "Day 5: Recorded presentation review and peer feedback"
    ],
    "relatedSlugs": [
      "course-96-strategies-for-effective-business-communication",
      "course-21-leading-high-performing-teams-for-improved-productivity-work",
      "course-35-effective-leadership-and-corporate-governance-for-directors"
    ],
    "source": "Editorial draft derived from programme title/audience (Protocols, EAs & PAs); pending GIBS syllabus verification.",
    "faqs": [
      { "q": "Is this workshop suitable for participants with no prior presentation experience?", "a": "Yes. The course is built for EAs and PAs who regularly brief executives; it starts from foundational presence work and scales to board-level delivery." },
      { "q": "Are delegates recorded for feedback?", "a": "Optional peer-review recordings are shared only within the cohort for coaching; they are not retained or redistributed." }
    ]
  },

  "GIBS-LOC-062": {
    "code": "GIBS-LOC-062",
    "status": "pending-verification",
    "summary": "Securities and Stock Market Development and Management is a 5-day programme for senior and middle-level professionals that covers Nigerian capital-market structure, trading mechanics and the regulatory lifecycle of issuances.",
    "outcomes": [
      "Navigate the Nigerian capital market value chain from primary to secondary market operations",
      "Interpret regulatory obligations under the Investments and Securities Act and SEC rules",
      "Evaluate issuance mechanics, pricing windows and post-listing compliance for public offerings",
      "Assess market microstructure risks and the role of market makers, clearing and settlement",
      "Apply basic valuation and funding-raising frameworks to capital-raising decisions"
    ],
    "structure": [
      "Day 1: Capital market architecture and regulatory framework",
      "Day 2: Primary market issuance and listing requirements",
      "Day 3: Secondary market trading, market makers and liquidity",
      "Day 4: Clearing, settlement and risk management",
      "Day 5: Case study and applied capital-raising exercise"
    ],
    "relatedSlugs": [
      "course-1-public-sector-accounting-procedure-and-standards",
      "course-3-finance-for-non-finance-staff",
      "course-35-effective-leadership-and-corporate-governance-for-directors"
    ],
    "source": "Editorial draft derived from programme title/category (Capital Market & Securities Management); pending GIBS syllabus verification.",
    "faqs": [
      { "q": "Do participants need prior experience in financial markets?", "a": "The programme assumes a working knowledge of basic finance; no prior market experience is required." },
      { "q": "Is the Nigerian capital-market regulatory framework covered?", "a": "Yes—Securities and Exchange Commission rules, the Investments and Securities Act, and FX impacts on issuance are all covered." }
    ]
  },

  "GIBS-LOC-096": {
    "code": "GIBS-LOC-096",
    "status": "pending-verification",
    "summary": "Strategies for Effective Business Communication is a 5-day skills workshop for staff at all levels on professional written, spoken and digital communication across organisational boundaries.",
    "outcomes": [
      "Draft clear executive summaries, briefing memos and formal correspondence under time pressure",
      "Structure complex information for oral presentation to mixed seniority and disciplinary audiences",
      "Apply tone and channel selection for internal, external and cross-cultural stakeholder communication",
      "Use visual structure and editing to make written material scannable and action-oriented",
      "Deliver difficult messages and navigate sensitive conversations with credibility"
    ],
    "structure": [
      "Day 1: Principles of audience-first communication",
      "Day 2: Executive writing—memos, summaries and proposals",
      "Day 3: Presentation design and slide storytelling",
      "Day 4: Difficult conversations and feedback delivery",
      "Day 5: Digital communication and multi-channel messaging"
    ],
    "relatedSlugs": [
      "course-101-advanced-public-speaking-and-presentation-skills",
      "course-21-leading-high-performing-teams-for-improved-productivity-work",
      "course-35-effective-leadership-and-corporate-governance-for-directors"
    ],
    "source": "Editorial draft derived from programme title; category (Pension Management) is a confirmed misclassification—pending correction.",
    "faqs": [
      { "q": "Is this suitable for non-native English speakers?", "a": "Yes. The workshop emphasises structure and clarity over idiom, with attention to professional register for multilingual workplaces." },
      { "q": "Are participants required to prepare a presentation in advance?", "a": "Yes—a short topic is chosen on day one and developed through the week for peer and facilitator feedback." }
    ]
  },

  "GIBS-LOC-001": {
    "code": "GIBS-LOC-001",
    "status": "pending-verification",
    "summary": "Public Sector Accounting Procedure and Standards is a 5-day programme for finance, audit and procurement staff on Nigerian public-sector accounting rules, cash management and compliance reporting.",
    "outcomes": [
      "Apply Nigeria's public-sector accounting standards (SAS and IPSAS fundamentals) to departmental transactions",
      "Prepare and interpret quarterly financial statements and cash-flow reports under public-sector rules",
      "Manage the public-sector budget execution cycle, release and drawdown controls, and treasury operations",
      "Conduct procurement-to-pay internal controls aligned with the Public Procurement Act",
      "Perform compliance reviews and draft management letters for audit readiness"
    ],
    "structure": [
      "Day 1: Public-sector accounting frameworks and the cash basis",
      "Day 2: Budget preparation, authorisation and execution controls",
      "Day 3: Treasury management and cash-flow forecasting",
      "Day 4: Procurement accounting and audit trails",
      "Day 5: Reporting, compliance review and action planning"
    ],
    "relatedSlugs": [
      "course-3-finance-for-non-finance-staff",
      "course-62-securitiesstock-market-development-and-management",
      "course-35-effective-leadership-and-corporate-governance-for-directors"
    ],
    "source": "Editorial draft derived from programme title/category (Accounting and Financial Management); pending GIBS syllabus verification.",
    "faqs": [
      { "q": "Which accounting standards are covered?", "a": "The workshop focuses on Nigeria's public-sector standards of accounting and the practical transition to full IPSAS adoption." },
      { "q": "Should participants bring their organisation's most recent financial statements?", "a": "A redacted sample set is supplied for exercises; delegates may optionally bring anonymised departmental reports for context." }
    ]
  },

  "GIBS-LOC-035": {
    "code": "GIBS-LOC-035",
    "status": "pending-verification",
    "summary": "Effective Leadership and Corporate Governance for Directors and Senior Management Staff is a 5-day programme on board responsibilities, decision-making and oversight in complex organisations.",
    "outcomes": [
      "Distinguish director duties of care, loyalty and good faith under Nigerian company law",
      "Evaluate board and committee effectiveness, composition and information flows",
      "Assess risk oversight, internal control and whistle-blowing framework responsibilities",
      "Apply strategic decision-making frameworks and steer organisational culture",
      "Manage stakeholder engagement and crisis communication at the leadership level"
    ],
    "structure": [
      "Day 1: Legal duties and the role of the director",
      "Day 2: Board effectiveness and committee structures",
      "Day 3: Risk, audit and internal-control oversight",
      "Day 4: Strategy, culture and executive decision-making",
      "Day 5: Stakeholder engagement and crisis simulation"
    ],
    "relatedSlugs": [
      "course-21-leading-high-performing-teams-for-improved-productivity-work",
      "course-101-advanced-public-speaking-and-presentation-skills",
      "course-96-strategies-for-effective-business-communication"
    ],
    "source": "Editorial draft derived from programme title; category (Telecom & Utilities Regulation) is a confirmed misclassification—pending correction.",
    "faqs": [
      { "q": "Is this programme limited to sitting company directors?", "a": "No. It is designed for directors, CEOs, senior managers and future board members from any sector." },
      { "q": "Are case studies drawn from Nigerian organisations?", "a": "Yes—cases are grounded in recent Nigerian corporate-governance events and regulatory updates." }
    ]
  },

  "GIBS-LOC-003": {
    "code": "GIBS-LOC-003",
    "status": "pending-verification",
    "summary": "Finance for Non-Finance Staff is a 5-day programme that equips non-financial managers with the literacy to read, interpret and apply financial statements and metrics to operational decisions.",
    "outcomes": [
      "Read and interpret balance sheets, income statements and cash-flow statements with confidence",
      "Translate financial ratios into operational performance signals for your department",
      "Build and interpret budgets, variance reports and cost-volume-profit analysis",
      "Apply basic investment appraisal—NPV and payback—to evaluate proposals",
      "Communicate financial implications of decisions to senior stakeholders"
    ],
    "structure": [
      "Day 1: The three core financial statements",
      "Day 2: Ratio analysis and performance indicators",
      "Day 3: Budgeting, forecasting and variance analysis",
      "Day 4: Investment appraisal and decision tools",
      "Day 5: Financial storytelling for non-financial managers"
    ],
    "relatedSlugs": [
      "course-1-public-sector-accounting-procedure-and-standards",
      "course-62-securitiesstock-market-development-and-management",
      "course-79-unbundling-the-power-sector-prospects-for-economic-growth"
    ],
    "source": "Editorial draft derived from programme title/category (Accounting and Financial Management); pending GIBS syllabus verification.",
    "faqs": [
      { "q": "What level of mathematics is assumed?", "a": "Only basic arithmetic and a calculator. All financial concepts are taught from first principles." }
    ]
  },

  "GIBS-LOC-021": {
    "code": "GIBS-LOC-021",
    "status": "pending-verification",
    "summary": "Leading High-Performing Teams for Improved Productivity is a 5-day workshop for managers who must motivate multidisciplinary teams to deliver measurable results.",
    "outcomes": [
      "Diagnose team performance using productivity and engagement diagnostics",
      "Design team structures, roles and accountability frameworks that reduce ambiguity",
      "Lead difficult conversations, conflict resolution and performance correction",
      "Deploy coaching conversations that raise standards without destroying morale",
      "Align team goals to organisational KPIs and measure progress reliably"
    ],
    "structure": [
      "Day 1: Situational leadership and team diagnostics",
      "Day 2: Motivation, roles and high-performance norms",
      "Day 3: Difficult conversations and conflict resolution",
      "Day 4: Coaching, feedback and capability building",
      "Day 5: Measurement, dashboards and continuous improvement"
    ],
    "relatedSlugs": [
      "course-35-effective-leadership-and-corporate-governance-for-directors",
      "course-96-strategies-for-effective-business-communication",
      "course-101-advanced-public-speaking-and-presentation-skills"
    ],
    "source": "Editorial draft derived from programme title/category (General Administration and Management); pending GIBS syllabus verification.",
    "faqs": [
      { "q": "Should participants come with a live team challenge to work on?", "a": "Yes—a current team productivity issue is brought to the workshop and developed through the week." }
    ]
  },

  "GIBS-LOC-046": {
    "code": "GIBS-LOC-046",
    "status": "pending-verification",
    "summary": "Customers Experience Management Workshop is a 5-day programme for managers responsible for designing, measuring and improving customer journeys across service channels.",
    "outcomes": [
      "Map end-to-end customer journeys and identify pain points and moments of truth",
      "Design service encounters that recover failure and turn dissatisfaction into loyalty",
      "Measure customer experience using CSAT, NPS and CES correctly",
      "Apply behavioural insights to reduce friction in high-volume service processes",
      "Build a cross-functional CX improvement plan with clear ownership and metrics"
    ],
    "structure": [
      "Day 1: CX fundamentals and journey mapping",
      "Day 2: Measuring and benchmarking customer experience",
      "Day 3: Service recovery and complaint handling",
      "Day 4: Digital and human-channel integration",
      "Day 5: CX governance and action planning"
    ],
    "relatedSlugs": [
      "course-96-strategies-for-effective-business-communication",
      "course-21-leading-high-performing-teams-for-improved-productivity-work",
      "course-101-advanced-public-speaking-and-presentation-skills"
    ],
    "source": "Editorial draft derived from programme title/category (Consumer Protection & Utilities); pending GIBS syllabus verification.",
    "faqs": [
      { "q": "Do I need existing CX data to attend?", "a": "No—foundational concepts are taught first; bring any anonymised customer feedback you can share for exercises." }
    ]
  },

  "GIBS-LOC-076": {
    "code": "GIBS-LOC-076",
    "status": "pending-verification",
    "summary": "International Oil and Gas Management Development Strategies is a 5-day programme examining upstream and downstream segments, local-content policy and commercial strategies across the oil and gas value chain.",
    "outcomes": [
      "Analyse upstream exploration, development and production investment decisions",
      "Evaluate downstream refining, distribution and retail commercial strategies",
      "Assess Nigerian local-content policy, joint-venture structures and fiscal regimes",
      "Compare FPSO, pipeline and LNG project delivery models and their financial risks",
      "Apply decommissioning, environment and community-relations frameworks to project appraisal"
    ],
    "structure": [
      "Day 1: Global and Nigerian oil & gas value-chain overview",
      "Day 2: Upstream geopolitics, licensing and investment",
      "Day 3: Midstream transportation, storage and FPSO economics",
      "Day 4: Downstream refining, retail and local content",
      "Day 5: Energy transition and integrated project planning"
    ],
    "relatedSlugs": [
      "course-79-unbundling-the-power-sector-prospects-for-economic-growth",
      "course-1-public-sector-accounting-procedure-and-standards",
      "course-62-securitiesstock-market-development-and-management"
    ],
    "source": "Editorial draft derived from programme title; category (Power & Energy Sector) is a confirmed misclassification—pending correction.",
    "faqs": [
      { "q": "Is prior oil and gas industry experience required?", "a": "No. The programme is designed for managers moving into oil & gas roles as well as sector newcomers with a business brief." }
    ]
  },

  "GIBS-LOC-079": {
    "code": "GIBS-LOC-079",
    "status": "pending-verification",
    "summary": "Unbundling the Power Sector: Prospects For Economic Growth is a 5-day programme on Nigerian electricity-sector reform, regulation and the economics of generation, transmission and distribution unbundling.",
    "outcomes": [
      "Trace the structure and ownership models of the Nigerian power sector post-unbundling",
      "Evaluate generation mix, transmission constraints and distribution losses as economic risks",
      "Interpret regulatory frameworks and tariff-setting processes under NERC",
      "Assess power-purchase agreements, IPPs and mini-grid commercial models",
      "Analyse sector reform impact on industrialisation and GDP growth"
    ],
    "structure": [
      "Day 1: Power-sector reform history and institutional architecture",
      "Day 2: Generation economics and the generation company model",
      "Day 3: Transmission planning and grid stability",
      "Day 4: Distribution, metering and tariff regulation",
      "Day 5: Independent power projects and sector outlook"
    ],
    "relatedSlugs": [
      "course-76-international-oil-and-gas-management-development-strategies",
      "course-62-securitiesstock-market-development-and-management",
      "course-3-finance-for-non-finance-staff"
    ],
    "source": "Editorial draft derived from programme title/category (Power & Energy Sector); pending GIBS syllabus verification.",
    "faqs": [
      { "q": "Will recent regulatory changes be reflected?", "a": "Yes—the syllabus is updated for the latest NERC and fiscal-framework developments." }
    ]
  }
};

/**
 * Look up curated content for a programme (any status).
 */
export function getProgrammeContent(p: Programme | undefined): ProgrammeContent | undefined {
  return p ? PROGRAMME_CONTENT[p.code] : undefined;
}

/**
 * The status gate. Returns the content record ONLY when its status is
 * `approved`; otherwise `undefined`, so callers fall back to data.ts catalogue
 * values. This is enforced on the static generator and the React page alike,
 * guaranteeing that `pending-verification` / `draft` content can never reach
 * static HTML, JSON-LD, the sitemap or llms.txt.
 */
export function approvedContent(p: Programme | undefined): ProgrammeContent | undefined {
  const c = getProgrammeContent(p);
  return c && c.status === "approved" ? c : undefined;
}

/**
 * Audited category-corrections map (code -> canonical destination category).
 *
 * Source: editorial review cross-referenced against the locked catalogue
 * (src/lib/data.ts). Each `from` category below is the code's ACTUAL data.ts
 * category (verified via scripts/qa/content_quality.cjs), and each `to`
 * value is a member of the canonical PROGRAM_CATEGORIES list.
 *
 * IMPORTANT — APPROVAL GATING
 *   This map is the DATA ONLY. It is NOT applied to rendered HTML, JSON-LD,
 *   breadcrumbs, sitemap or llms.txt unless the operator explicitly enables
 *   it by setting `APPLY_CATEGORY_CORRECTIONS=true` at generation time
 *   (scripts/seo-gen.mjs) and `VITE_APPLY_CATEGORY_CORRECTIONS=true` at dev
 *   build time. The gate DEFAULTS OFF and src/lib/data.ts is never edited.
 *
 *   Each correction is `pending-verification`: do not flip the gate until a
 *   GIBS programme owner has confirmed the reclassification. See the editor's
 *   notes at scripts/qa/content_approval_register.csv (Category column).
 */
export const CATEGORY_CORRECTIONS: Record<string, string> = {
  "GIBS-LOC-005": "General Administration and Management",
  "GIBS-LOC-035": "General Administration and Management",
  "GIBS-LOC-039": "Telecom & Utilities Regulation",
  "GIBS-LOC-043": "Information Technology Workshops",
  "GIBS-LOC-044": "Information Technology Workshops",
  "GIBS-LOC-076": "Oil & Gas Sector",
  "GIBS-LOC-077": "Environmental Sustainability & Management",
  "GIBS-LOC-083": "General Administration and Management",
  "GIBS-LOC-096": "General Administration and Management",
  "GIBS-LOC-099": "General Administration and Management",
};

/**
 * Reads the operator gate universally: Node (seo-gen) via
 * `process.env.APPLY_CATEGORY_CORRECTIONS`, Vite browser builds via the
 * auto-exposed `import.meta.env.VITE_APPLY_CATEGORY_CORRECTIONS`. Defaults to
 * false (no corrections applied) everywhere. Never throws: any
 * `import.meta`/`process` absence resolves to false.
 */
function isCorrectionGateEnabled(): boolean {
  try {
    if (typeof process !== "undefined" && process.env && process.env.APPLY_CATEGORY_CORRECTIONS === "true") {
      return true;
    }
  } catch {}
  try {
    const im = (typeof import.meta !== "undefined") ? import.meta : (null as unknown as undefined);
    const env = im ? (im as unknown as { env?: Record<string, string> }).env : undefined;
    if (env && env.VITE_APPLY_CATEGORY_CORRECTIONS === "true") return true;
  } catch {}
  return false;
}

/**
 * Resolves the category that should be displayed / indexed for a programme.
 * When the operator gate is OFF (default) this returns `programme.category`
 * verbatim — so static shells, JSON-LD, breadcrumbs and the hydrated client all
 * stay byte-aligned with the locked catalogue. When the gate is ON, the
 * approval-pending CATEGORY_CORRECTIONS map reclassifies the code's category
 * (data.ts itself is never written).
 *
 * Consumers in scripts/seo-gen.mjs (resolveCategory) and the React views must
 * BOTH route through this function so static HTML and the hydrated client never
 * disagree.
 */
export function resolveRenderedCategory(
  programme: Programme | undefined,
  opts: { corrections?: Record<string, string>; apply?: boolean } = {},
): string {
  if (!programme) return "";
  const corrections = opts.corrections || (CATEGORY_CORRECTIONS as Record<string, string>);
  const apply = opts.apply ?? isCorrectionGateEnabled();
  if (apply && corrections[programme.code]) return corrections[programme.code];
  return programme.category || "";
}

/**
 * Subject-specific, category-page introductions. Category pages currently carry
 * no meaningful subject copy; these drafts provide domain-grounded intros for
 * each of the 15 catalogue categories. They are marked `pending-verification`
 * (derived from public domain knowledge of each sector, not from a GIBS
 * syllabus) and are NOT rendered until approved — the same gate used for
 * per-programme content.
 */
export type CategoryIntroStatus = ContentStatus;

export interface CategoryIntro {
  category: string;
  status: CategoryIntroStatus;
  intro: string;
  source: string;
}

export const CATEGORY_INTRO_CONTENT: Record<string, CategoryIntro> = {
  "Accounting and Financial Management": {
    category: "Accounting and Financial Management",
    status: "pending-verification",
    intro: "Accounting and Financial Management programmes address the application of public-sector and corporate financial reporting standards, the adoption of IPSAS, budget preparation and execution, treasury management, internal audit, and procurement-to-pay accounting controls. Delegates build the literacy to read quarterly financial statements, interpret variance reports, and apply cost-volume-profit reasoning to operational decisions\u2014without assuming prior specialist training.",
    source: "Editorial draft derived from the category domain; pending GIBS syllabus verification.",
  },
  "General Administration and Management": {
    category: "General Administration and Management",
    status: "pending-verification",
    intro: "General Administration and Management programmes span strategic planning, organisational design, performance management, public-sector reform, staff appraisal systems, and the delivery of public services under fiscal and accountability frameworks. The focus is on transferring management practice from complex organisations to delegates' own institutions, with attention to Nigeria's civil-service reform imperatives.",
    source: "Editorial draft derived from the category domain; pending GIBS syllabus verification.",
  },
  "Telecom & Utilities Regulation": {
    category: "Telecom & Utilities Regulation",
    status: "pending-verification",
    intro: "Telecom and Utilities Regulation programmes cover Nigerian telecommunications licensing, spectrum management, universal-service obligations, utilities service-quality standards, cross-subsidy pricing, and the coordination of infrastructure policy across telecom, electricity and water sectors. Delegates examine recent regulatory decisions and the economics of access provision.",
    source: "Editorial draft derived from the category domain; pending GIBS syllabus verification.",
  },
  "Consumer Protection & Utilities": {
    category: "Consumer Protection & Utilities",
    status: "pending-verification",
    intro: "Consumer Protection and Utilities programmes address consumer rights, fair trading, utilities service standards, complaint handling and redress, multi-lateral dispute resolution, and the regulatory framework governing electricity, water and telecommunications services. The emphasis is on translating regulatory intent into measurable service-delivery outcomes.",
    source: "Editorial draft derived from the category domain; pending GIBS syllabus verification.",
  },
  "Environmental Sustainability & Management": {
    category: "Environmental Sustainability & Management",
    status: "pending-verification",
    intro: "Environmental Sustainability and Management programmes cover environmental impact assessment, climate-change adaptation and mitigation, sustainable resource management, ESG reporting, pollution-control frameworks, and the integration of environmental risk into project and investment appraisal for both public and private organisations.",
    source: "Editorial draft derived from the category domain; pending GIBS syllabus verification.",
  },
  "Oil & Gas Sector": {
    category: "Oil & Gas Sector",
    status: "pending-verification",
    intro: "Oil and Gas Sector programmes address the Nigerian hydrocarbon value chain in full: upstream exploration and production, midstream transportation and storage (including FPSO economics), downstream refining and retail, alongside local-content policy, joint-venture structures, fiscal regimes, and the transition pressures affecting project finance.",
    source: "Editorial draft derived from the category domain; pending GIBS syllabus verification.",
  },
  "Secretarial Administration & Management": {
    category: "Secretarial Administration & Management",
    status: "pending-verification",
    intro: "Secretarial Administration and Management programmes address corporate-governance support, board secretarial practice, meeting and resolution procedures, records and minutes management, regulatory compliance, and the effectiveness of executive office support\u2014particularly within the Nigerian company-law and public-sector governance context.",
    source: "Editorial draft derived from the category domain; pending GIBS syllabus verification.",
  },
  "Capital Market & Securities Management": {
    category: "Capital Market & Securities Management",
    status: "pending-verification",
    intro: "Capital Market and Securities Management programmes cover the structure and regulation of the Nigerian capital market, securities issuance and listing, market microstructure, the role of market makers, clearing and settlement systems, investment analysis, and regulatory compliance under the Investments and Securities Act and SEC rules.",
    source: "Editorial draft derived from the category domain; pending GIBS syllabus verification.",
  },
  "Information Technology Workshops": {
    category: "Information Technology Workshops",
    status: "pending-verification",
    intro: "Information Technology Workshops deliver hands-on coverage of ICT literacy, productivity software, database fundamentals, system administration basics, cybersecurity awareness, and the use of technology to support organisational operations. Workshops are designed for non-technical staff who need functional digital fluency rather than programming expertise.",
    source: "Editorial draft derived from the category domain; pending GIBS syllabus verification.",
  },
  "Legal & Legislative Studies": {
    category: "Legal & Legislative Studies",
    status: "pending-verification",
    intro: "Legal and Legislative Studies programmes address Nigerian legal frameworks, legislative drafting techniques, the legislative process and statutory interpretation, regulatory compliance, and the law governing public and private institutions\u2014including procurement, company, and administrative law fundamentals relevant to policy practitioners.",
    source: "Editorial draft derived from the category domain; pending GIBS syllabus verification.",
  },
  "Power & Energy Sector": {
    category: "Power & Energy Sector",
    status: "pending-verification",
    intro: "Power and Energy Sector programmes address Nigerian electricity-sector reform, generation mix and plant economics, transmission planning and grid stability, distribution, metering and commercial losses, tariff regulation under NERC, and the unbundling of the successor-company model\u2014together with renewable-energy and energy-transition opportunities.",
    source: "Editorial draft derived from the category domain; pending GIBS syllabus verification.",
  },
  "Maritime & Transportation": {
    category: "Maritime & Transportation",
    status: "pending-verification",
    intro: "Maritime and Transportation programmes cover maritime law and safety, port operations and governance, logistics and supply-chain management, transportation regulation, cargo-handling efficiency, and the economics of coastal and inland-waterway transport within Nigeria's multimodal freight framework.",
    source: "Editorial draft derived from the category domain; pending GIBS syllabus verification.",
  },
  "Pension Management": {
    category: "Pension Management",
    status: "pending-verification",
    intro: "Pension Management programmes address the Nigerian pension system in depth: the RSA framework, the role of the National Social Insurance Trust Fund (NSITF), Registered Pension Fund Administrators (PFAs) and Custodians, contribution and benefit payment, funding ratios, retirement planning, solvency and risk management, and regulatory compliance under the PFRDA.",
    source: "Editorial draft derived from the category domain; pending GIBS syllabus verification.",
  },
  "Special Executive Training": {
    category: "Special Executive Training",
    status: "pending-verification",
    intro: "Special Executive Training programmes are designed for senior officials and apex-level executives. They address strategic leadership, high-level policy analysis, executive communication to boards and cabinets, organisational change at scale, and decision-making under uncertainty\u2014drawing on cases from complex public and private institutions.",
    source: "Editorial draft derived from the category domain; pending GIBS syllabus verification.",
  },
  "Foreign Executive Training": {
    category: "Foreign Executive Training",
    status: "pending-verification",
    intro: "Foreign Executive Training programmes are delivered across the Kigali, Dubai, London and Houston hubs and address the strategic challenges faced by multinational and cross-border organisations: international regulatory coordination, cross-cultural leadership, global supply-chain risk, and people-management in matrixed, multi-jurisdictional settings.",
    source: "Editorial draft derived from the category domain; pending GIBS syllabus verification.",
  },
};

/**
 * Look up a category introduction (any status).
 */
export function getCategoryIntro(category: string | undefined): CategoryIntro | undefined {
  return category ? CATEGORY_INTRO_CONTENT[category] : undefined;
}

/**
 * Status gate for category intros \u2014 returns the intro ONLY when approved,
 * identical in intent to `approvedContent`.
 */
export function approvedCategoryIntro(category: string | undefined): CategoryIntro | undefined {
  const c = getCategoryIntro(category);
  return c && c.status === "approved" ? c : undefined;
}

/**
 * Statuses that must NEVER be published. Used by the content QA gate to assert
 * that no unverified draft string leaks into generated output.
 */
export const UNPUBLISHED_STATUSES: ReadonlySet<ContentStatus> = new Set([
  "pending-verification",
  "draft",
]);
