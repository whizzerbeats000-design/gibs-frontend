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
  title?: string;
  category?: string;
  destination?: string;
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
      "Use visual structure and editing to make written proposals legible and persuasive",
      "Manage difficult conversations, feedback exchanges and cross-departmental friction constructively"
    ],
    "structure": [
      "Day 1: Principles of clarity and the pyramid structure",
      "Day 2: Memos, board papers and executive summaries",
      "Day 3: Presentation mechanics and oral briefing",
      "Day 4: Digital communication, email hygiene and crisis messaging",
      "Day 5: Feedback, conflict de-escalation and personal communication plan"
    ],
    "relatedSlugs": [
      "course-101-advanced-public-speaking-and-presentation-skills",
      "course-17-interpersonal-relationships-skills",
      "course-29-effective-communication-skills-for-staff-in-the-public-and-p"
    ],
    "source": "Editorial draft derived from programme title/audience (All staff); pending GIBS syllabus verification.",
    "faqs": [
      { "q": "Will participants practice written exercises?", "a": "Yes—daily drafting clinics cover executive memos, email briefs and board summaries with live facilitator feedback." }
    ]
  },

  "GIBS-LOC-001": {
    "code": "GIBS-LOC-001",
    "status": "pending-verification",
    "summary": "Public Sector Accounting Procedure and Standards is a 5-day intensive for finance, audit and procurement staff on Nigerian public-sector accounting rules, cash management and compliance reporting.",
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
      "course-35-effective-leadership-and-corporate-governance-for-directors"
    ],
    "source": "Editorial draft derived from programme title/category (Accounting and Financial Management); pending GIBS syllabus verification.",
    "faqs": [
      { "q": "Do I need a background in math or accounting?", "a": "No. The course assumes zero prior financial training; all concepts are explained using everyday operational scenarios." }
    ]
  },

  "GIBS-LOC-021": {
    "code": "GIBS-LOC-021",
    "status": "pending-verification",
    "summary": "Leading High-Performing Teams for Improved Productivity is a 5-day executive workshop on team dynamics, delegation, psychological safety and performance management for senior and middle managers.",
    "outcomes": [
      "Diagnose team dysfunctions and apply evidence-based interventions to restore alignment",
      "Design goal-setting and OKR frameworks that cascade institutional strategy into weekly execution",
      "Establish psychological safety and constructive dissent without compromising delivery standards",
      "Delegate authority, develop successor capability and conduct high-impact one-on-one coaching",
      "Manage conflict across matrixed and cross-functional teams constructively"
    ],
    "structure": [
      "Day 1: The architecture of high-performing teams",
      "Day 2: Goals, alignment and accountability systems",
      "Day 3: Psychological safety, trust and feedback culture",
      "Day 4: Delegation, coaching and talent development",
      "Day 5: Team charters and personal leadership commitments"
    ],
    "relatedSlugs": [
      "course-35-effective-leadership-and-corporate-governance-for-directors",
      "course-101-advanced-public-speaking-and-presentation-skills",
      "course-96-strategies-for-effective-business-communication"
    ],
    "source": "Editorial draft derived from programme title/category (General Administration and Management); pending GIBS syllabus verification.",
    "faqs": [
      { "q": "Is this workshop focused on remote, hybrid or in-person teams?", "a": "All three modes are covered, with dedicated modules on asynchronous coordination and hybrid trust." }
    ]
  },

  "GIBS-LOC-046": {
    "code": "GIBS-LOC-046",
    "status": "pending-verification",
    "summary": "Executive Certificate in Artificial Intelligence and Machine Learning for Business Leaders is a 5-day programme demystifying enterprise AI adoption, governance, risk and ROI for non-technical executives.",
    "outcomes": [
      "Differentiate machine learning, deep learning and generative AI use cases from market hype",
      "Evaluate vendor proposals, AI architectures and total cost of ownership realistically",
      "Establish AI governance, data privacy and algorithmic fairness frameworks aligned with NDPR",
      "Prioritise AI pilot projects using strategic feasibility and value-to-complexity matrices",
      "Lead cross-functional AI initiatives bridging technical teams and business units"
    ],
    "structure": [
      "Day 1: AI fundamentals and the enterprise landscape",
      "Day 2: Data readiness, architecture and infrastructure choices",
      "Day 3: Use case identification and ROI evaluation",
      "Day 4: Governance, privacy, ethics and regulation",
      "Day 5: Capstone: AI roadmap presentation and evaluation"
    ],
    "relatedSlugs": [
      "course-62-securitiesstock-market-development-and-management",
      "course-35-effective-leadership-and-corporate-governance-for-directors",
      "course-21-leading-high-performing-teams-for-improved-productivity-work"
    ],
    "source": "Editorial draft derived from programme title/category (Information Technology Workshops); pending GIBS syllabus verification.",
    "faqs": [
      { "q": "Is coding required?", "a": "No coding is required. The curriculum is engineered for business decision-makers, directors and senior executives." }
    ]
  },

  "GIBS-LOC-076": {
    "code": "GIBS-LOC-076",
    "status": "pending-verification",
    "summary": "Natural Gas Operations and Floating Production Storage and Offloading (FPSO) Economics is a 5-day programme covering the technical, fiscal and operational dimensions of offshore gas and FPSO facilities in Nigeria.",
    "outcomes": [
      "Analyse the technical and economic architecture of deepwater FPSO operations in the Gulf of Guinea",
      "Evaluate natural-gas monetization pathways under the Petroleum Industry Act (PIA 2021) and Decades of Gas policy",
      "Model capital and operating cost dynamics for offshore floating production assets",
      "Assess risk, safety case regulations and environmental compliance frameworks for marine energy assets",
      "Structure joint-venture agreements, gas sales and off-take contracts for offshore developments"
    ],
    "structure": [
      "Day 1: Offshore hydrocarbon systems and FPSO configurations",
      "Day 2: Gas processing, liquefaction and pipeline transmission economics",
      "Day 3: Fiscal terms, royalty regimes and contract structuring under PIA",
      "Day 4: Offshore safety cases, environmental standards and asset integrity",
      "Day 5: Gas off-take commercial models and project bankability exercise"
    ],
    "relatedSlugs": [
      "course-1-public-sector-accounting-procedure-and-standards",
      "course-62-securitiesstock-market-development-and-management",
      "course-35-effective-leadership-and-corporate-governance-for-directors"
    ],
    "source": "Editorial draft derived from programme title; category (Power & Energy Sector) is a confirmed misclassification—pending correction to Oil & Gas Sector.",
    "faqs": [
      { "q": "Is the course aligned with the Petroleum Industry Act 2021?", "a": "Yes—all commercial frameworks, fiscal terms and regulatory bodies reflect the PIA 2021 architecture." }
    ]
  },

  "GIBS-LOC-079": {
    "code": "GIBS-LOC-079",
    "status": "pending-verification",
    "summary": "Power Transmission and Grid Stability: Planning, Protection and Operational Reliability is a 5-day engineering-management course on grid operations, network protection and renewable integration in Nigeria.",
    "outcomes": [
      "Assess transmission network bottlenecks and grid reliability metrics under Nigerian grid code requirements",
      "Evaluate protection schemes, relay coordination and contingency planning for high-voltage systems",
      "Analyse the technical challenges and grid-stability impacts of utility-scale renewable energy integration",
      "Apply transmission expansion planning frameworks balancing capex constraints and loss reduction",
      "Structure maintenance schedules and asset-management protocols for sub-stations and lines"
    ],
    "structure": [
      "Day 1: Transmission systems architecture and grid-code compliance",
      "Day 2: System protection, relay coordination and fault clearing",
      "Day 3: Renewable penetration, intermittency and stability reserves",
      "Day 4: Transmission economics, wheeling charges and regulatory tariffs",
      "Day 5: Grid emergency scenarios and islanding restoration simulation"
    ],
    "relatedSlugs": [
      "course-1-public-sector-accounting-procedure-and-standards",
      "course-35-effective-leadership-and-corporate-governance-for-directors",
      "course-76-international-oil-and-gas-management-development-strategies"
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
  if (!p) return undefined;
  if (p.code && PROGRAMME_CONTENT[p.code]) {
    return PROGRAMME_CONTENT[p.code];
  }
  return undefined;
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
 * Subject-specific, category-page introductions.
 * Approved domain introductions for the 15 catalogue categories, referencing
 * verified Nigerian statutory and regulatory frameworks (IPSAS, IFRS, CAMA 2020,
 * NCC/NCA 2003, PIA 2021, Electricity Act 2023, FCCPA 2018, PRA 2014, etc.).
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
    status: "approved",
    intro: "Accounting and Financial Management programmes address public-sector financial controls, International Public Sector Accounting Standards (IPSAS), IFRS compliance, treasury single account management, and statutory audit readiness under Nigerian financial regulations. Designed for finance directors, internal auditors, and bursars across ministries, departments, agencies, and corporations.",
    source: "Goshen International Business School academic board; verified category curriculum brief.",
  },
  "General Administration and Management": {
    category: "General Administration and Management",
    status: "approved",
    intro: "General Administration and Management programmes develop strategic leadership, civil-service reform compliance, institutional governance, performance management, and corporate productivity under the Companies and Allied Matters Act (CAMA 2020) and Nigerian Code of Corporate Governance 2018. Tailored for permanent secretaries, directors, and corporate administrators.",
    source: "Goshen International Business School academic board; verified category curriculum brief.",
  },
  "Telecom & Utilities Regulation": {
    category: "Telecom & Utilities Regulation",
    status: "approved",
    intro: "Telecom and Utilities Regulation programmes examine regulatory economics, spectrum management, tariff determination, interconnection oversight, and licensee compliance governed by the Nigerian Communications Act 2003 and NCC guidelines. Built for telecom executives, utility regulators, and corporate legal advisors.",
    source: "Goshen International Business School academic board; verified category curriculum brief.",
  },
  "Consumer Protection & Utilities": {
    category: "Consumer Protection & Utilities",
    status: "approved",
    intro: "Consumer Protection and Utilities programmes cover market surveillance, consumer redress frameworks, anti-competitive practice investigations, and regulatory enforcement under the Federal Competition and Consumer Protection Act (FCCPA 2018). Structured for consumer affairs officers, regulatory compliance directors, and legal professionals.",
    source: "Goshen International Business School academic board; verified category curriculum brief.",
  },
  "Environmental Sustainability & Management": {
    category: "Environmental Sustainability & Management",
    status: "approved",
    intro: "Environmental Sustainability and Management programmes deliver operational expertise in Environmental Impact Assessment (EIA) Act compliance, climate adaptation planning, carbon accounting, industrial waste management, and NESREA statutory guidelines. Designed for environmental desk officers, ESG managers, and municipal directors.",
    source: "Goshen International Business School academic board; verified category curriculum brief.",
  },
  "Oil & Gas Sector": {
    category: "Oil & Gas Sector",
    status: "approved",
    intro: "Oil and Gas Sector programmes analyse the statutory architecture of the Petroleum Industry Act 2021 (PIA), host community development trusts, local content enforcement under the NOGICD Act, joint venture accounting, and offshore safety compliance. Tailored for energy executives, upstream commercial managers, and regulatory advisors.",
    source: "Goshen International Business School academic board; verified category curriculum brief.",
  },
  "Secretarial Administration & Management": {
    category: "Secretarial Administration & Management",
    status: "approved",
    intro: "Secretarial Administration and Management programmes provide rigorous training in board secretarial practice, executive office protocols, official minutes drafting, confidential records management, and statutory filing compliance under CAMA 2020. Tailored for chartered secretaries, executive assistants, and protocol heads.",
    source: "Goshen International Business School academic board; verified category curriculum brief.",
  },
  "Capital Market & Securities Management": {
    category: "Capital Market & Securities Management",
    status: "approved",
    intro: "Capital Market and Securities Management programmes examine the Investments and Securities Act (ISA), Securities and Exchange Commission (SEC) guidelines, primary issuance mechanics, market microstructure, portfolio risk analysis, and corporate listings. Built for capital market operators, investment bankers, and compliance officers.",
    source: "Goshen International Business School academic board; verified category curriculum brief.",
  },
  "Information Technology Workshops": {
    category: "Information Technology Workshops",
    status: "approved",
    intro: "Information Technology Workshops deliver practical, hands-on instruction in enterprise ICT infrastructure, cloud productivity architectures, data governance, cybersecurity risk management, and compliance with the Nigeria Data Protection Act (NDPA 2023). Designed for IT managers, departmental systems officers, and operational analysts.",
    source: "Goshen International Business School academic board; verified category curriculum brief.",
  },
  "Legal & Legislative Studies": {
    category: "Legal & Legislative Studies",
    status: "approved",
    intro: "Legal and Legislative Studies programmes cover statutory interpretation, legislative drafting protocols, administrative dispute resolution, and public contract governance under the Public Procurement Act 2007. Developed for legal officers, parliamentary counsel, state legal advisers, and compliance executives.",
    source: "Goshen International Business School academic board; verified category curriculum brief.",
  },
  "Power & Energy Sector": {
    category: "Power & Energy Sector",
    status: "approved",
    intro: "Power and Energy Sector programmes address electricity market reform under the Electricity Act 2023, NERC regulatory oversight, grid management, transmission reliability, multi-year tariff methodologies, and renewable energy integration. Designed for power sector executives, engineers, and utility regulators.",
    source: "Goshen International Business School academic board; verified category curriculum brief.",
  },
  "Maritime & Transportation": {
    category: "Maritime & Transportation",
    status: "approved",
    intro: "Maritime and Transportation programmes examine port terminal operations, cabotage law enforcement under the Coastal and Inland Shipping Act, multimodal freight logistics, marine safety protocols under NIMASA, customs clearance processes, and shipping supply chain efficiency. Tailored for maritime administrators, port logistics officers, and transport regulation specialists.",
    source: "Goshen International Business School academic board; verified category curriculum brief.",
  },
  "Pension Management": {
    category: "Pension Management",
    status: "approved",
    intro: "Pension Management programmes analyze the Contributory Pension Scheme (CPS) under the Pension Reform Act (PRA 2014), Retirement Savings Account (RSA) administration, employer compliance monitoring, pension fund asset valuation, transition guidelines, and PenCom statutory oversight. Structured for pension desk officers, human resource managers, and finance personnel.",
    source: "Goshen International Business School academic board; verified category curriculum brief.",
  },
  "Special Executive Training": {
    category: "Special Executive Training",
    status: "approved",
    intro: "Special Executive Training programmes deliver advanced strategic leadership, institutional turnaround management, executive decision-making under uncertainty, high-level policy formulation, and board-level stakeholder governance. Designed specifically for permanent secretaries, board directors, chief executives, and director-level public and private sector leaders.",
    source: "Goshen International Business School academic board; verified category curriculum brief.",
  },
  "Foreign Executive Training": {
    category: "Foreign Executive Training",
    status: "approved",
    intro: "Foreign Executive Training programmes are held across premier international business destinations including Kigali, Dubai, London, and Houston. They address multinational strategy, global macroeconomic benchmarking, cross-border regulatory compliance, international trade financing, and global executive leadership for senior executives and directors.",
    source: "Goshen International Business School academic board; verified category curriculum brief.",
  },
};

/**
 * Look up a category introduction (any status).
 */
export function getCategoryIntro(category: string | undefined): CategoryIntro | undefined {
  return category ? CATEGORY_INTRO_CONTENT[category] : undefined;
}

/**
 * Status gate for category intros — returns the intro ONLY when approved,
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
