/* ==========================================================================
   GIBS OFFICIAL DATA LAYER (src/lib/data.ts)
   Goshen International Business School Limited (GIBS)
   Certificate of Incorporation RC 1178333 (March 17, 2014)
   Official Source of Truth — 135 Programmes (113 Local + 22 Foreign)
   ========================================================================== */

import type {
  Programme,
  ProgrammeCategory,
  ProgrammeDestination,
  CurrencyCode,
  CampusFacility,
  CampusLocation,
  FacultyAdvisor,
  InstitutionalMetadata,
} from "../types/data";

export type {
  Programme,
  ProgrammeCategory,
  ProgrammeDestination,
  CurrencyCode,
  CampusFacility,
  CampusLocation,
  FacultyAdvisor,
  InstitutionalMetadata,
};

export const DATA_REQUIRED = "[OFFICIAL GIBS DATA REQUIRED]";

/* ---------------- 1. Institutional Metadata ---------------- */

export const INSTITUTIONAL_DATA: InstitutionalMetadata = {
  legalName: "Goshen International Business School Limited (GIBS)",
  cacRegistration: "Registered at Corporate Affairs Commission, Ilorin, Certificate of Incorporation RC 1178333 (Dated March 17, 2014)",
  slogan: "Take advantage of us, so that no one takes advantage of you",
  positioningStatement: "An outfit committed to manpower development and capacity-building. Our uniqueness is in our dedication to capacity-building exercise.",
  mission: "Goshen International Business School (GIBS) is dedicated to empowering the future generation through acquisition and communication of management and business knowledge relevant to the development of Nigeria and the world at large. We are a world-class Business School impacting positively on the public and private sectors of the economy.",
  vision: "To support the development of National Manpower and Economic Development Policies for the emancipation of the people.",
  guidingPrinciples: ["Thoroughness", "Fair", "Firm", "Forthright"],
  coreValues: [
    "Integrity",
    "Diligence",
    "Excellence",
    "Professionalism",
    "Responsiveness",
    "Innovation",
    "Commitment",
  ],
  strategicFocusAreas: [
    "Availability of required knowledge update",
    "Updating knowledge of stakeholders",
    "Bridge the gap in knowledge",
    "Introduce new developments in the society",
    "Provide platform for the support of our stakeholders",
  ],
  website: "www.gibs.com.ng",
  emails: ["gibsilorin@gmail.com", "goshenibs22@gmail.com"],
  phoneNumbers: [
    "08160010401",
    "08033429427",
    "08186464474",
    "08032296041",
    "07085792767",
  ],
  postalAddress: "P.O. Box 63, Ilorin General Post Office, Kwara State, Nigeria",
  technicalPartner: "Pacific Institute of Technology, Georgia, United States of America.",
  overseasHubs: [
    "Miami (USA)",
    "Houston (USA)",
    "London (UK)",
    "Dubai (UAE)",
    "Cape Town & Durban (South Africa)",
    "Kigali (Rwanda)",
    "Netherlands",
    "Ghana",
  ],
  accreditations: [
    "Corporate Affairs Commission (CAC RC 1178333)",
    "Centre For Management Development (CMD)",
    "Industrial Training Fund (ITF) Certificate of Compliance",
    "Nigeria Social Insurance Trust Fund (NSTIF)",
  ],
};

/* ---------------- 2. Campus Locations & Facilities ---------------- */

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: "ilorin-hq",
    name: "Ilorin Headquarters (Main HQ)",
    address: "No 81, Olorunsogo Street, Off Agbabiaka Road, Upper Gaa - Akanbi, Ilorin, Kwara State, Nigeria",
    academicFacilities: "12 Lecture Rooms, Library, 100-person capacity Hall, 20-Room Guest Facility",
    recreationalFacilities: "Olympic-size Lawn Tennis court, International standard Table Tennis, Open space keep-fit grounds, 3 medium-size Halls, 16-seater buses, 6-seater mini-bus, 24/7 power supply, assured security",
    highlights: [
      "12 Modern Lecture Rooms",
      "Comprehensive Reference Library",
      "100-person capacity Multi-purpose Hall",
      "20-Room Executive Guest Lodge",
      "Olympic-size Lawn Tennis & Sports Grounds",
      "Dedicated 16-seater & 6-seater Transportation Fleet",
      "24/7 Dedicated Power & Security",
    ],
  },
  {
    id: "abuja-center",
    name: "Abuja Center",
    address: "Plot 194, Lugbe 1 Layout, Near Okay Centre, Direct Behind Rainoil filling station, FHA Lugbe, Airport Road, Abuja",
    academicFacilities: "2 Halls (100-person capacity each), 7 Lecture Rooms, 2 Administrative offices, 2 Syndicate rooms, 3-Room guest facility, 2 standby power generating sets, 18 toilets, large parking lot",
    highlights: [
      "2 Large Conference Halls (100-person capacity each)",
      "7 Air-conditioned Lecture Rooms",
      "2 Dedicated Syndicate Rooms",
      "3-Room Executive Guest Facility",
      "2 Standby Heavy-Duty Power Generators",
      "Spacious Parking Facility & 18 Restrooms",
    ],
  },
  {
    id: "ibafo-center",
    name: "Ibafo (Ogun State) Center",
    address: "KM 36, Lagos - Ibadan Express Road, Adjacent Dap-Mude Hotel, Behind World Oil Station, Ibafo, Ogun State, Nigeria",
    academicFacilities: "1 Hall, 4 Lecture Rooms, 4 Syndicate Rooms",
    highlights: [
      "1 Main Conference Hall",
      "4 Executive Lecture Rooms",
      "4 Syndicate & Breakout Rooms",
      "Strategic Lagos-Ibadan Corridor Location",
    ],
  },
];

export const CAMPUS_CAPACITY = {
  regularCapacity: "Each campus accommodates 300 candidates across 6 classes of 25 participants in Workshop/Seminar formats, or up to 500 people in a single large class format.",
  offCampusCities: [
    "Lagos",
    "Keffi",
    "Kaduna",
    "Owerri",
    "Port Harcourt",
    "Benin City",
  ],
};

export const CAMPUS_FACILITIES: CampusFacility[] = [
  { name: "Executive Lecture Rooms", note: "Air-conditioned halls equipped for syndicate & case discussion" },
  { name: "Reference & Research Library", note: "Specialized books, journals and public policy references" },
  { name: "Multi-Purpose Conference Halls", note: "100-person to 500-person capacity seminar spaces" },
  { name: "Syndicate & Breakout Rooms", note: "Dedicated team workshops and strategy deliberations" },
  { name: "Executive Guest Lodges", note: "On-site 20-room and 3-room residential quarters" },
  { name: "Sports & Keep-Fit Grounds", note: "Olympic-size lawn tennis and table tennis facilities (Ilorin HQ)" },
];

/* ---------------- 3. Governance & Faculty Advisory Structure ---------------- */

export const GOVERNANCE_INFO = {
  councilSummary: "Governing Council comprising 4 Directors under the Chairman of the Council, supported by an executive management team of 20 Advisors and subject-matter experts.",
  boardChairman: "Chairman of the Governing Council",
};

export const FACULTY_ADVISORS: FacultyAdvisor[] = [
  { id: 1, designation: "Chairman, Academic Board", category: "Leadership" },
  { id: 2, designation: "Advisor, Environmental Sustainability Project", category: "Advisor" },
  { id: 3, designation: "Advisor, Training and Manpower Development", category: "Advisor" },
  { id: 4, designation: "Advisor, International Partnership", category: "Advisor" },
  { id: 5, designation: "Advisor, Economic Development Project", category: "Advisor" },
  { id: 6, designation: "Advisor, Legal and Regulatory Services", category: "Advisor" },
  { id: 7, designation: "Advisor, Curriculum Development", category: "Advisor" },
  { id: 8, designation: "Coordinator, Academic Activities", category: "Coordinator" },
  { id: 9, designation: "Advisor, Inter-Agencies Services", category: "Advisor" },
  { id: 10, designation: "Advisor, Financial Services", category: "Advisor" },
  { id: 11, designation: "Coordinator, General Services", category: "Coordinator" },
  { id: 12, designation: "Acting Registrar and Coordinator, ICT Services", category: "Leadership" },
  { id: 13, designation: "Coordinator, External Relations", category: "Coordinator" },
  { id: 14, designation: "Coordinator, Research and Development", category: "Coordinator" },
];

/* ---------------- 4. Image Assets ---------------- */

export const IMAGES = {
  hero: "/images/campus-colonnade.webp",
  colonnade: "/images/campus-colonnade.webp",
  library: "/images/library-interior.webp",
  boardroom: "/images/library-interior.webp",
  city: "/images/campus-colonnade.webp",
  lecture: "/images/library-interior.webp",
  seminar: "/images/campus-colonnade.webp",
  books: "/images/library-interior.webp",
  study: "/images/library-interior.webp",
};

/* srcset for the 1376×768 photographic assets. A 640w derivative ships
   alongside each original (same encoding settings, scaled down only); the
   browser picks the closest candidate for the render slot — no resizing at
   runtime and no 1.4MB of decoding on small screens. */
export function imageSet(url: string) {
  const w640 = url.replace(/\.webp$/, "-640.webp");
  return {
    src: url,
    srcSet: `${w640} 640w, ${url} 1376w`,
  };
}

/* ---------------- 5. Navigation Links ---------------- */

/*
 * Single authoritative navigation inventory.
 *
 * NAV_LINKS renders in the desktop header bar. NAV_SECONDARY holds the
 * remaining public sections and is surfaced by the header's "Explore"
 * disclosure on desktop, and by MOBILE_SECONDARY in the mobile sheet.
 *
 * These were previously two unrelated literals: the desktop bar had 4 entries
 * and the mobile sheet had 10, so widening the viewport silently dropped six
 * destinations with no dropdown or overflow to recover them. Every public route
 * must appear in exactly one of these two arrays so no section becomes
 * unreachable at a wider breakpoint.
 */
export const NAV_LINKS = [
  { label: "Programmes", to: "/programmes" },
  { label: "Foreign Training", to: "/executive-education" },
  { label: "Faculty & Governance", to: "/faculty" },
  { label: "About GIBS", to: "/about" },
];

export const NAV_SECONDARY = [
  { label: "Research & Insights", to: "/research-insights", note: "Journal, briefs and think-pieces" },
  { label: "Conferences & Events", to: "/events", note: "Sessions, calendars and registration" },
  { label: "Campuses & Facilities", to: "/campus", note: "Ilorin, Abuja and Ibafo" },
  { label: "Campus Gallery", to: "/gallery", note: "The campus in pictures" },
  { label: "Contact & Registry", to: "/contact", note: "Enquiries and registry details" },
  { label: "Programme Subscription", to: "/admissions", note: "Join the 2026 calendar" },
  { label: "GIBS AI", to: "/concierge", note: "Ask the school assistant" },
];

/* ---------------- 6. Events / Executive Sessions ---------------- */

export type GIBS_EVENT = {
  slug: string;
  title: string;
  category: "Public Lecture" | "Conference" | "Executive Session" | "Open Day" | "Research";
  date: string;
  startDate?: string;
  endDate?: string;
  time: string;
  location: string;
  excerpt: string;
  status: "upcoming" | "past";
};

export const EVENTS: GIBS_EVENT[] = [
  {
    slug: "2026-national-manpower-capacity-building-conference",
    title: "2026 Annual Manpower Development & Capacity-Building Executive Conference",
    category: "Conference",
    date: "4–8 May 2026",
    startDate: "2026-05-04",
    endDate: "2026-05-08",
    time: "09:00 AM – 04:00 PM WAT",
    location: "Abuja Center & Ilorin HQ",
    excerpt: "A national executive convening for public and private sector leaders on policy translation, economic transformation and workforce optimization.",
    status: new Date("2026-05-08T23:59:59Z").getTime() < Date.now() ? "past" : "upcoming",
  },
  {
    slug: "telecom-utilities-regulatory-roundtable",
    title: "Telecom & Utilities Regulation and Rate Setting Executive Roundtable",
    category: "Executive Session",
    date: "13–17 July 2026",
    startDate: "2026-07-13",
    endDate: "2026-07-17",
    time: "10:00 AM – 03:30 PM WAT",
    location: "GIBS Abuja Center",
    excerpt: "High-level regulatory compliance, rates determination, and consumer protection engagement for executives and commissioners.",
    status: new Date("2026-07-17T23:59:59Z").getTime() < Date.now() ? "past" : "upcoming",
  },
];

/* ---------------- 7. Complete Official Programmes (135 Total) ---------------- */

export const PROGRAMMES: Programme[] = [
  {
    "id": "loc-1",
    "code": "GIBS-LOC-001",
    "num": 1,
    "slug": "course-1-public-sector-accounting-procedure-and-standards",
    "title": "Public Sector Accounting Procedure and Standards",
    "category": "Accounting and Financial Management",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.",
    "schedule": "March 2\u20136 (Ibafo), April 13\u201317 (Ilorin), Sept 7\u201311 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Accounting and Financial Management \u00b7 March 2\u20136 (Ibafo), April 13\u201317 (Ilorin), Sept 7\u201311 (Abuja)",
    "summary": "Public Sector Accounting Procedure and Standards is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.. Scheduled across GIBS training centres and regional hubs: March 2\u20136 (Ibafo), April 13\u201317 (Ilorin), Sept 7\u201311 (Abuja).",
    "audience": [
      "Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "March 2\u20136 (Ibafo), April 13\u201317 (Ilorin), Sept 7\u201311 (Abuja)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: March 2\u20136 (Ibafo), April 13\u201317 (Ilorin), Sept 7\u201311 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-2",
    "code": "GIBS-LOC-002",
    "num": 2,
    "slug": "course-2-accounts-reconciliation-technique-and-cash-management-strate",
    "title": "Accounts Reconciliation Technique and Cash Management Strategies for Accounting and Financial Reporting Efficiency",
    "category": "Accounting and Financial Management",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.",
    "schedule": "March 9\u201313 (Ibafo), April 13\u201317 (Ilorin), Sept 7\u201311 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Accounting and Financial Management \u00b7 March 9\u201313 (Ibafo), April 13\u201317 (Ilorin), Sept 7\u201311 (Abuja)",
    "summary": "Accounts Reconciliation Technique and Cash Management Strategies for Accounting and Financial Reporting Efficiency is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.. Scheduled across GIBS training centres and regional hubs: March 9\u201313 (Ibafo), April 13\u201317 (Ilorin), Sept 7\u201311 (Abuja).",
    "audience": [
      "Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "March 9\u201313 (Ibafo), April 13\u201317 (Ilorin), Sept 7\u201311 (Abuja)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: March 9\u201313 (Ibafo), April 13\u201317 (Ilorin), Sept 7\u201311 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-3",
    "code": "GIBS-LOC-003",
    "num": 3,
    "slug": "course-3-finance-for-non-finance-staff",
    "title": "Finance for Non-Finance Staff",
    "category": "Accounting and Financial Management",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff - Finance, Audit, Procurement",
    "schedule": "April 13\u201317 (Ilorin), July 20\u201324 (Keffi), Aug 3\u20137 (Abuja), Oct 12\u201316 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Accounting and Financial Management \u00b7 April 13\u201317 (Ilorin), July 20\u201324 (Keffi), Aug 3\u20137 (Abuja), Oct 12\u201316 (Lagos)",
    "summary": "Finance for Non-Finance Staff is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff - Finance, Audit, Procurement. Scheduled across GIBS training centres and regional hubs: April 13\u201317 (Ilorin), July 20\u201324 (Keffi), Aug 3\u20137 (Abuja), Oct 12\u201316 (Lagos).",
    "audience": [
      "Senior & Middle level Mgt Staff - Finance, Audit, Procurement",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "April 13\u201317 (Ilorin), July 20\u201324 (Keffi), Aug 3\u20137 (Abuja), Oct 12\u201316 (Lagos)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: April 13\u201317 (Ilorin), July 20\u201324 (Keffi), Aug 3\u20137 (Abuja), Oct 12\u201316 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-4",
    "code": "GIBS-LOC-004",
    "num": 4,
    "slug": "course-4-public-sector-budgeting-and-budget-reforms-implementation-ef",
    "title": "Public Sector Budgeting and Budget Reforms & Implementation Efficiency",
    "category": "Accounting and Financial Management",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior Management Staff - Finance, Audit, Procurement Dept.",
    "schedule": "April 13\u201317 (Ibafo), June 1\u20135 (Abuja), Oct 5\u20139 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Accounting and Financial Management \u00b7 April 13\u201317 (Ibafo), June 1\u20135 (Abuja), Oct 5\u20139 (Ilorin)",
    "summary": "Public Sector Budgeting and Budget Reforms & Implementation Efficiency is an intensive 5 Days capacity-building programme designed for Senior Management Staff - Finance, Audit, Procurement Dept.. Scheduled across GIBS training centres and regional hubs: April 13\u201317 (Ibafo), June 1\u20135 (Abuja), Oct 5\u20139 (Ilorin).",
    "audience": [
      "Senior Management Staff - Finance, Audit, Procurement Dept.",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "April 13\u201317 (Ibafo), June 1\u20135 (Abuja), Oct 5\u20139 (Ilorin)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: April 13\u201317 (Ibafo), June 1\u20135 (Abuja), Oct 5\u20139 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-5",
    "code": "GIBS-LOC-005",
    "num": 5,
    "slug": "course-5-corporate-social-responsibility-for-the-private-and-public-s",
    "title": "Corporate Social Responsibility For the Private and Public Sectors (MDAs)",
    "category": "Accounting and Financial Management",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff - ALL Departments",
    "schedule": "March 9\u201313 (Abuja), April 6\u201310 (Ibafo), Aug 31\u2013Sept 4 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Accounting and Financial Management \u00b7 March 9\u201313 (Abuja), April 6\u201310 (Ibafo), Aug 31\u2013Sept 4 (Ilorin)",
    "summary": "Corporate Social Responsibility For the Private and Public Sectors (MDAs) is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff - ALL Departments. Scheduled across GIBS training centres and regional hubs: March 9\u201313 (Abuja), April 6\u201310 (Ibafo), Aug 31\u2013Sept 4 (Ilorin).",
    "audience": [
      "Senior & Middle level Mgt Staff - ALL Departments",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "March 9\u201313 (Abuja), April 6\u201310 (Ibafo), Aug 31\u2013Sept 4 (Ilorin)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: March 9\u201313 (Abuja), April 6\u201310 (Ibafo), Aug 31\u2013Sept 4 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-6",
    "code": "GIBS-LOC-006",
    "num": 6,
    "slug": "course-6-financial-management-skills-strategies-in-the-public-sector",
    "title": "Financial Management Skills & Strategies in the Public Sector",
    "category": "Accounting and Financial Management",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "All Staff",
    "schedule": "May 4\u20138 (Keffi), Aug 10\u201314 (Abuja), Dec 7\u201311 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Accounting and Financial Management \u00b7 May 4\u20138 (Keffi), Aug 10\u201314 (Abuja), Dec 7\u201311 (Lagos)",
    "summary": "Financial Management Skills & Strategies in the Public Sector is an intensive 5 Days capacity-building programme designed for All Staff. Scheduled across GIBS training centres and regional hubs: May 4\u20138 (Keffi), Aug 10\u201314 (Abuja), Dec 7\u201311 (Lagos).",
    "audience": [
      "All Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 4\u20138 (Keffi), Aug 10\u201314 (Abuja), Dec 7\u201311 (Lagos)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 4\u20138 (Keffi), Aug 10\u201314 (Abuja), Dec 7\u201311 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-7",
    "code": "GIBS-LOC-007",
    "num": 7,
    "slug": "course-7-customer-relationship-management-and-retention",
    "title": "Customer Relationship Management and Retention",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "May 18\u201322 (Ibafo), Aug 17\u201321 (Abuja), Oct 5\u20139 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 May 18\u201322 (Ibafo), Aug 17\u201321 (Abuja), Oct 5\u20139 (Ilorin)",
    "summary": "Customer Relationship Management and Retention is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: May 18\u201322 (Ibafo), Aug 17\u201321 (Abuja), Oct 5\u20139 (Ilorin).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 18\u201322 (Ibafo), Aug 17\u201321 (Abuja), Oct 5\u20139 (Ilorin)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 18\u201322 (Ibafo), Aug 17\u201321 (Abuja), Oct 5\u20139 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-8",
    "code": "GIBS-LOC-008",
    "num": 8,
    "slug": "course-8-translating-policies-into-economic-transformation-of-public",
    "title": "Translating Policies into Economic Transformation of Public and Private Sectors' Economy",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "May 4\u20138 (Abuja), Aug 3\u20137 (Ilorin), Nov 2\u20136 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 May 4\u20138 (Abuja), Aug 3\u20137 (Ilorin), Nov 2\u20136 (Lagos)",
    "summary": "Translating Policies into Economic Transformation of Public and Private Sectors' Economy is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: May 4\u20138 (Abuja), Aug 3\u20137 (Ilorin), Nov 2\u20136 (Lagos).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 4\u20138 (Abuja), Aug 3\u20137 (Ilorin), Nov 2\u20136 (Lagos)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 4\u20138 (Abuja), Aug 3\u20137 (Ilorin), Nov 2\u20136 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-9",
    "code": "GIBS-LOC-009",
    "num": 9,
    "slug": "course-9-a-modern-approach-to-procurement-a-strategic-perspective",
    "title": "A Modern Approach to Procurement: A Strategic Perspective",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.",
    "schedule": "Jul 6\u201310 (Abuja), Aug 3\u20137 (Ibafo), Oct 5\u20139 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 Jul 6\u201310 (Abuja), Aug 3\u20137 (Ibafo), Oct 5\u20139 (Ilorin)",
    "summary": "A Modern Approach to Procurement: A Strategic Perspective is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.. Scheduled across GIBS training centres and regional hubs: Jul 6\u201310 (Abuja), Aug 3\u20137 (Ibafo), Oct 5\u20139 (Ilorin).",
    "audience": [
      "Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "Jul 6\u201310 (Abuja), Aug 3\u20137 (Ibafo), Oct 5\u20139 (Ilorin)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: Jul 6\u201310 (Abuja), Aug 3\u20137 (Ibafo), Oct 5\u20139 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-10",
    "code": "GIBS-LOC-010",
    "num": 10,
    "slug": "course-10-middle-level-management-techniques-new-perspectives",
    "title": "Middle Level Management Techniques: New Perspectives",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "May 4\u20138 (Ibafo), July 6\u201310 (Ilorin), Oct 19\u201323 (Abuja), Nov 30\u2013Dec 4 (Keffi)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 May 4\u20138 (Ibafo), July 6\u201310 (Ilorin), Oct 19\u201323 (Abuja), Nov 30\u2013Dec 4 (Keffi)",
    "summary": "Middle Level Management Techniques: New Perspectives is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: May 4\u20138 (Ibafo), July 6\u201310 (Ilorin), Oct 19\u201323 (Abuja), Nov 30\u2013Dec 4 (Keffi).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 4\u20138 (Ibafo), July 6\u201310 (Ilorin), Oct 19\u201323 (Abuja), Nov 30\u2013Dec 4 (Keffi)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 4\u20138 (Ibafo), July 6\u201310 (Ilorin), Oct 19\u201323 (Abuja), Nov 30\u2013Dec 4 (Keffi)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-11",
    "code": "GIBS-LOC-011",
    "num": 11,
    "slug": "course-11-next-generation-hr-aligning-hr-to-strategy-transforming-huma",
    "title": "Next Generation HR: Aligning HR to Strategy: Transforming Human Resources to Human Capital",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "HR, Admin, Procurement, Senior & Middle level Mgt Staff",
    "schedule": "April 20\u201324 (Ibafo), July 6\u201310 (Ilorin), Oct 12\u201316 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 April 20\u201324 (Ibafo), July 6\u201310 (Ilorin), Oct 12\u201316 (Abuja)",
    "summary": "Next Generation HR: Aligning HR to Strategy: Transforming Human Resources to Human Capital is an intensive 5 Days capacity-building programme designed for HR, Admin, Procurement, Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: April 20\u201324 (Ibafo), July 6\u201310 (Ilorin), Oct 12\u201316 (Abuja).",
    "audience": [
      "HR, Admin, Procurement, Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "April 20\u201324 (Ibafo), July 6\u201310 (Ilorin), Oct 12\u201316 (Abuja)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: April 20\u201324 (Ibafo), July 6\u201310 (Ilorin), Oct 12\u201316 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-12",
    "code": "GIBS-LOC-012",
    "num": 12,
    "slug": "course-12-ethical-standards-and-organisational-development-in-the-publ",
    "title": "Ethical Standards and Organisational Development in the Public Service",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "All Staff",
    "schedule": "July 13\u201317 (Keffi), Aug 24\u201328 (Abuja), Oct 12\u201316 (Ilorin), Nov 30\u2013Dec 4 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 July 13\u201317 (Keffi), Aug 24\u201328 (Abuja), Oct 12\u201316 (Ilorin), Nov 30\u2013Dec 4 (Lagos)",
    "summary": "Ethical Standards and Organisational Development in the Public Service is an intensive 5 Days capacity-building programme designed for All Staff. Scheduled across GIBS training centres and regional hubs: July 13\u201317 (Keffi), Aug 24\u201328 (Abuja), Oct 12\u201316 (Ilorin), Nov 30\u2013Dec 4 (Lagos).",
    "audience": [
      "All Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 13\u201317 (Keffi), Aug 24\u201328 (Abuja), Oct 12\u201316 (Ilorin), Nov 30\u2013Dec 4 (Lagos)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 13\u201317 (Keffi), Aug 24\u201328 (Abuja), Oct 12\u201316 (Ilorin), Nov 30\u2013Dec 4 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-13",
    "code": "GIBS-LOC-013",
    "num": 13,
    "slug": "course-13-improved-productivity-based-on-a-good-performance-culture",
    "title": "Improved Productivity Based on a Good Performance Culture",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff - ALL Depts.",
    "schedule": "Sept 7\u201311 (Abuja), Oct 12\u201316 (Ibafo), Nov 23\u201327 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 Sept 7\u201311 (Abuja), Oct 12\u201316 (Ibafo), Nov 23\u201327 (Lagos)",
    "summary": "Improved Productivity Based on a Good Performance Culture is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff - ALL Depts.. Scheduled across GIBS training centres and regional hubs: Sept 7\u201311 (Abuja), Oct 12\u201316 (Ibafo), Nov 23\u201327 (Lagos).",
    "audience": [
      "Senior & Middle level Mgt Staff - ALL Depts.",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "Sept 7\u201311 (Abuja), Oct 12\u201316 (Ibafo), Nov 23\u201327 (Lagos)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: Sept 7\u201311 (Abuja), Oct 12\u201316 (Ibafo), Nov 23\u201327 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-14",
    "code": "GIBS-LOC-014",
    "num": 14,
    "slug": "course-14-pension-administration-and-management-strategies",
    "title": "Pension Administration and Management Strategies",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 350000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff - ALL Depts.",
    "schedule": "May 4\u20138 (Ilorin), July 13\u201317 (Abuja), Oct 19\u201323 (Keffi)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 May 4\u20138 (Ilorin), July 13\u201317 (Abuja), Oct 19\u201323 (Keffi)",
    "summary": "Pension Administration and Management Strategies is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff - ALL Depts.. Scheduled across GIBS training centres and regional hubs: May 4\u20138 (Ilorin), July 13\u201317 (Abuja), Oct 19\u201323 (Keffi).",
    "audience": [
      "Senior & Middle level Mgt Staff - ALL Depts.",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 4\u20138 (Ilorin), July 13\u201317 (Abuja), Oct 19\u201323 (Keffi)",
    "fees": "\u20a6350,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 4\u20138 (Ilorin), July 13\u201317 (Abuja), Oct 19\u201323 (Keffi)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6350,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-15",
    "code": "GIBS-LOC-015",
    "num": 15,
    "slug": "course-15-building-strong-financial-management-strategies-to-sustain-o",
    "title": "Building Strong Financial Management Strategies to Sustain Organisational Growth",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.",
    "schedule": "April 13\u201317 (Abuja), July 13\u201317 (Ilorin), Sept 14\u201318 (Ibafo)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 April 13\u201317 (Abuja), July 13\u201317 (Ilorin), Sept 14\u201318 (Ibafo)",
    "summary": "Building Strong Financial Management Strategies to Sustain Organisational Growth is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.. Scheduled across GIBS training centres and regional hubs: April 13\u201317 (Abuja), July 13\u201317 (Ilorin), Sept 14\u201318 (Ibafo).",
    "audience": [
      "Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "April 13\u201317 (Abuja), July 13\u201317 (Ilorin), Sept 14\u201318 (Ibafo)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: April 13\u201317 (Abuja), July 13\u201317 (Ilorin), Sept 14\u201318 (Ibafo)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-16",
    "code": "GIBS-LOC-016",
    "num": 16,
    "slug": "course-16-pre-post-service-empowerment-training-programme-2-weeks",
    "title": "Pre & Post Service Empowerment Training Programme - (2 Weeks)",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 800000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "Nov 23\u201327 (Lagos), Mar 23\u2013April 4 (Ibafo)",
    "duration": "2 Weeks",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 Nov 23\u201327 (Lagos), Mar 23\u2013April 4 (Ibafo)",
    "summary": "Pre & Post Service Empowerment Training Programme - (2 Weeks) is an intensive 2 Weeks capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: Nov 23\u201327 (Lagos), Mar 23\u2013April 4 (Ibafo).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (2 Weeks)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (2 Weeks) / In-Plant Option Available",
    "startDate": "Nov 23\u201327 (Lagos), Mar 23\u2013April 4 (Ibafo)",
    "fees": "\u20a6800,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: Nov 23\u201327 (Lagos), Mar 23\u2013April 4 (Ibafo)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6800,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-17",
    "code": "GIBS-LOC-017",
    "num": 17,
    "slug": "course-17-interpersonal-relationships-skills",
    "title": "Interpersonal Relationships Skills",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "June 8\u201312 (Abuja), Aug 17\u201321 (Ilorin), Oct 19\u201323 (Keffi), Nov 30\u2013Dec 4 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 June 8\u201312 (Abuja), Aug 17\u201321 (Ilorin), Oct 19\u201323 (Keffi), Nov 30\u2013Dec 4 (Lagos)",
    "summary": "Interpersonal Relationships Skills is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: June 8\u201312 (Abuja), Aug 17\u201321 (Ilorin), Oct 19\u201323 (Keffi), Nov 30\u2013Dec 4 (Lagos).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 8\u201312 (Abuja), Aug 17\u201321 (Ilorin), Oct 19\u201323 (Keffi), Nov 30\u2013Dec 4 (Lagos)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 8\u201312 (Abuja), Aug 17\u201321 (Ilorin), Oct 19\u201323 (Keffi), Nov 30\u2013Dec 4 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-18",
    "code": "GIBS-LOC-018",
    "num": 18,
    "slug": "course-18-public-and-private-sector-corporate-governance",
    "title": "Public and Private Sector Corporate Governance",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.",
    "schedule": "May 11\u201315 (Ilorin), Aug 10\u201314 (Abuja), Sept 14\u201318 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 May 11\u201315 (Ilorin), Aug 10\u201314 (Abuja), Sept 14\u201318 (Lagos)",
    "summary": "Public and Private Sector Corporate Governance is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.. Scheduled across GIBS training centres and regional hubs: May 11\u201315 (Ilorin), Aug 10\u201314 (Abuja), Sept 14\u201318 (Lagos).",
    "audience": [
      "Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 11\u201315 (Ilorin), Aug 10\u201314 (Abuja), Sept 14\u201318 (Lagos)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 11\u201315 (Ilorin), Aug 10\u201314 (Abuja), Sept 14\u201318 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-19",
    "code": "GIBS-LOC-019",
    "num": 19,
    "slug": "course-19-public-sector-management-making-reforms-effective",
    "title": "Public Sector Management: Making Reforms Effective",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "July 13\u201317 (Ilorin), Sept 14\u201318 (Abuja), Nov 23\u201327 (Lagos), Nov 30\u2013Dec 4 (Keffi)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 July 13\u201317 (Ilorin), Sept 14\u201318 (Abuja), Nov 23\u201327 (Lagos), Nov 30\u2013Dec 4 (Keffi)",
    "summary": "Public Sector Management: Making Reforms Effective is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: July 13\u201317 (Ilorin), Sept 14\u201318 (Abuja), Nov 23\u201327 (Lagos), Nov 30\u2013Dec 4 (Keffi).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 13\u201317 (Ilorin), Sept 14\u201318 (Abuja), Nov 23\u201327 (Lagos), Nov 30\u2013Dec 4 (Keffi)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 13\u201317 (Ilorin), Sept 14\u201318 (Abuja), Nov 23\u201327 (Lagos), Nov 30\u2013Dec 4 (Keffi)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-20",
    "code": "GIBS-LOC-020",
    "num": 20,
    "slug": "course-20-strategic-leadership-through-technological-innovation-worksh",
    "title": "Strategic Leadership Through Technological Innovation Workshop",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "May 18\u201322 (Abuja), Aug 24\u201328 (Ibafo), Oct 5\u20139 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 May 18\u201322 (Abuja), Aug 24\u201328 (Ibafo), Oct 5\u20139 (Ilorin)",
    "summary": "Strategic Leadership Through Technological Innovation Workshop is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: May 18\u201322 (Abuja), Aug 24\u201328 (Ibafo), Oct 5\u20139 (Ilorin).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 18\u201322 (Abuja), Aug 24\u201328 (Ibafo), Oct 5\u20139 (Ilorin)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 18\u201322 (Abuja), Aug 24\u201328 (Ibafo), Oct 5\u20139 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-21",
    "code": "GIBS-LOC-021",
    "num": 21,
    "slug": "course-21-leading-high-performing-teams-for-improved-productivity-work",
    "title": "Leading High Performing Teams For Improved Productivity Workshop",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 395000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "July 13\u201317 (Abuja), Oct 12\u201316 (Lagos), Nov 2\u20136 (Keffi), Dec 7\u201311 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 July 13\u201317 (Abuja), Oct 12\u201316 (Lagos), Nov 2\u20136 (Keffi), Dec 7\u201311 (Ilorin)",
    "summary": "Leading High Performing Teams For Improved Productivity Workshop is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: July 13\u201317 (Abuja), Oct 12\u201316 (Lagos), Nov 2\u20136 (Keffi), Dec 7\u201311 (Ilorin).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 13\u201317 (Abuja), Oct 12\u201316 (Lagos), Nov 2\u20136 (Keffi), Dec 7\u201311 (Ilorin)",
    "fees": "\u20a6395,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 13\u201317 (Abuja), Oct 12\u201316 (Lagos), Nov 2\u20136 (Keffi), Dec 7\u201311 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6395,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-22",
    "code": "GIBS-LOC-022",
    "num": 22,
    "slug": "course-22-preparing-for-retirement-from-the-beginning",
    "title": "Preparing For Retirement from the Beginning",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "May 4\u20138 (Abuja), Oct 12\u201316 (Ilorin), Nov 9\u201313 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 May 4\u20138 (Abuja), Oct 12\u201316 (Ilorin), Nov 9\u201313 (Lagos)",
    "summary": "Preparing For Retirement from the Beginning is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: May 4\u20138 (Abuja), Oct 12\u201316 (Ilorin), Nov 9\u201313 (Lagos).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 4\u20138 (Abuja), Oct 12\u201316 (Ilorin), Nov 9\u201313 (Lagos)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 4\u20138 (Abuja), Oct 12\u201316 (Ilorin), Nov 9\u201313 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-23",
    "code": "GIBS-LOC-023",
    "num": 23,
    "slug": "course-23-emerging-trends-in-human-resources-management-post-covid-19",
    "title": "Emerging Trends in Human Resources Management: Post Covid-19 Approaches",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "May 4\u20138 (Keffi), Aug 10\u201314 (Ilorin), Oct 12\u201316 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 May 4\u20138 (Keffi), Aug 10\u201314 (Ilorin), Oct 12\u201316 (Abuja)",
    "summary": "Emerging Trends in Human Resources Management: Post Covid-19 Approaches is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: May 4\u20138 (Keffi), Aug 10\u201314 (Ilorin), Oct 12\u201316 (Abuja).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 4\u20138 (Keffi), Aug 10\u201314 (Ilorin), Oct 12\u201316 (Abuja)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 4\u20138 (Keffi), Aug 10\u201314 (Ilorin), Oct 12\u201316 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-24",
    "code": "GIBS-LOC-024",
    "num": 24,
    "slug": "course-24-train-the-trainers-workshop-2-weeks",
    "title": "Train-the-Trainers Workshop \u2013 (2 Weeks)",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 800000,
    "currency": "NGN",
    "targetAudience": "HR, Training & Admin Staff",
    "schedule": "March 16\u201320 (Ilorin), Sept 7\u201311 (Abuja), Oct 12\u201316 (Ibafo)",
    "duration": "2 Weeks",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 March 16\u201320 (Ilorin), Sept 7\u201311 (Abuja), Oct 12\u201316 (Ibafo)",
    "summary": "Train-the-Trainers Workshop \u2013 (2 Weeks) is an intensive 2 Weeks capacity-building programme designed for HR, Training & Admin Staff. Scheduled across GIBS training centres and regional hubs: March 16\u201320 (Ilorin), Sept 7\u201311 (Abuja), Oct 12\u201316 (Ibafo).",
    "audience": [
      "HR, Training & Admin Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (2 Weeks)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (2 Weeks) / In-Plant Option Available",
    "startDate": "March 16\u201320 (Ilorin), Sept 7\u201311 (Abuja), Oct 12\u201316 (Ibafo)",
    "fees": "\u20a6800,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: March 16\u201320 (Ilorin), Sept 7\u201311 (Abuja), Oct 12\u201316 (Ibafo)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6800,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-25",
    "code": "GIBS-LOC-025",
    "num": 25,
    "slug": "course-25-emotional-intelligence-and-productivity-in-work-place",
    "title": "Emotional Intelligence and Productivity in Work Place",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "July 13\u201317 (Abuja), Sept 14\u201318 (Keffi), Nov 2\u20136 (Lagos), Nov 30\u2013Dec 4 (Abuja & Keffi)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 July 13\u201317 (Abuja), Sept 14\u201318 (Keffi), Nov 2\u20136 (Lagos), Nov 30\u2013Dec 4 (Abuja & Keffi)",
    "summary": "Emotional Intelligence and Productivity in Work Place is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: July 13\u201317 (Abuja), Sept 14\u201318 (Keffi), Nov 2\u20136 (Lagos), Nov 30\u2013Dec 4 (Abuja & Keffi).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 13\u201317 (Abuja), Sept 14\u201318 (Keffi), Nov 2\u20136 (Lagos), Nov 30\u2013Dec 4 (Abuja & Keffi)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 13\u201317 (Abuja), Sept 14\u201318 (Keffi), Nov 2\u20136 (Lagos), Nov 30\u2013Dec 4 (Abuja & Keffi)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-26",
    "code": "GIBS-LOC-026",
    "num": 26,
    "slug": "course-26-emerging-trends-in-board-room-management-roles-of-company-se",
    "title": "Emerging Trends in Board Room Management: Roles of Company Secretary and Board Effectiveness",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Staff of CEO & ECs (SAs) office, and Commission Secretariat",
    "schedule": "July 6\u201310 (Abuja), Oct 5\u20139 (Ilorin), Nov 9\u201313 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 July 6\u201310 (Abuja), Oct 5\u20139 (Ilorin), Nov 9\u201313 (Lagos)",
    "summary": "Emerging Trends in Board Room Management: Roles of Company Secretary and Board Effectiveness is an intensive 5 Days capacity-building programme designed for Staff of CEO & ECs (SAs) office, and Commission Secretariat. Scheduled across GIBS training centres and regional hubs: July 6\u201310 (Abuja), Oct 5\u20139 (Ilorin), Nov 9\u201313 (Lagos).",
    "audience": [
      "Staff of CEO & ECs (SAs) office, and Commission Secretariat",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 6\u201310 (Abuja), Oct 5\u20139 (Ilorin), Nov 9\u201313 (Lagos)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 6\u201310 (Abuja), Oct 5\u20139 (Ilorin), Nov 9\u201313 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-27",
    "code": "GIBS-LOC-027",
    "num": 27,
    "slug": "course-27-management-of-virtual-business-models-in-the-private-and-pub",
    "title": "Management of Virtual Business Models in the Private and Public Sectors: Future Prerequisite For Self-Employment",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "May 18\u201322 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 May 18\u201322 (Ilorin)",
    "summary": "Management of Virtual Business Models in the Private and Public Sectors: Future Prerequisite For Self-Employment is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: May 18\u201322 (Ilorin).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 18\u201322 (Ilorin)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 18\u201322 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-28",
    "code": "GIBS-LOC-028",
    "num": 28,
    "slug": "course-28-developing-leadership-competencies-for-improved-productivity",
    "title": "Developing Leadership Competencies for Improved Productivity",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "Sept 21\u201325 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 Sept 21\u201325 (Abuja)",
    "summary": "Developing Leadership Competencies for Improved Productivity is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: Sept 21\u201325 (Abuja).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "Sept 21\u201325 (Abuja)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: Sept 21\u201325 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-29",
    "code": "GIBS-LOC-029",
    "num": 29,
    "slug": "course-29-effective-communication-skills-for-staff-in-the-public-and-p",
    "title": "Effective Communication Skills for Staff in the Public and Private Sector",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "June 22\u201326 (Abuja), Sept 7\u201311 (Lagos), Nov 9\u201313 (Ilorin), Dec 7\u201311 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 June 22\u201326 (Abuja), Sept 7\u201311 (Lagos), Nov 9\u201313 (Ilorin), Dec 7\u201311 (Lagos)",
    "summary": "Effective Communication Skills for Staff in the Public and Private Sector is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: June 22\u201326 (Abuja), Sept 7\u201311 (Lagos), Nov 9\u201313 (Ilorin), Dec 7\u201311 (Lagos).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 22\u201326 (Abuja), Sept 7\u201311 (Lagos), Nov 9\u201313 (Ilorin), Dec 7\u201311 (Lagos)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 22\u201326 (Abuja), Sept 7\u201311 (Lagos), Nov 9\u201313 (Ilorin), Dec 7\u201311 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-30",
    "code": "GIBS-LOC-030",
    "num": 30,
    "slug": "course-30-report-writing-and-presentation-skills-for-staff-in-the-publ",
    "title": "Report Writing and Presentation Skills for Staff in the Public and Private Sector",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "All Staff",
    "schedule": "June 1\u20135 (Ilorin), Aug 17\u201321 (Abuja), Oct 12\u201316 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 June 1\u20135 (Ilorin), Aug 17\u201321 (Abuja), Oct 12\u201316 (Lagos)",
    "summary": "Report Writing and Presentation Skills for Staff in the Public and Private Sector is an intensive 5 Days capacity-building programme designed for All Staff. Scheduled across GIBS training centres and regional hubs: June 1\u20135 (Ilorin), Aug 17\u201321 (Abuja), Oct 12\u201316 (Lagos).",
    "audience": [
      "All Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 1\u20135 (Ilorin), Aug 17\u201321 (Abuja), Oct 12\u201316 (Lagos)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 1\u20135 (Ilorin), Aug 17\u201321 (Abuja), Oct 12\u201316 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-31",
    "code": "GIBS-LOC-031",
    "num": 31,
    "slug": "course-31-workshop-on-office-ethics-and-worklife-balance-for-staff",
    "title": "Workshop on Office Ethics and WorkLife Balance for Staff",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff ALL - Depts.",
    "schedule": "July 20\u201324 (Ilorin), Oct 19\u201323 (Lagos), Nov 30\u2013Dec 4 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 July 20\u201324 (Ilorin), Oct 19\u201323 (Lagos), Nov 30\u2013Dec 4 (Abuja)",
    "summary": "Workshop on Office Ethics and WorkLife Balance for Staff is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff ALL - Depts.. Scheduled across GIBS training centres and regional hubs: July 20\u201324 (Ilorin), Oct 19\u201323 (Lagos), Nov 30\u2013Dec 4 (Abuja).",
    "audience": [
      "Senior & Middle level Mgt Staff ALL - Depts.",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 20\u201324 (Ilorin), Oct 19\u201323 (Lagos), Nov 30\u2013Dec 4 (Abuja)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 20\u201324 (Ilorin), Oct 19\u201323 (Lagos), Nov 30\u2013Dec 4 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-32",
    "code": "GIBS-LOC-032",
    "num": 32,
    "slug": "course-32-ict-tools-as-enabler-for-improved-productivity-in-the-workpl",
    "title": "ICT Tools as Enabler For Improved Productivity in the Workplace",
    "category": "General Administration and Management",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff ALL - Depts.",
    "schedule": "June 22\u201326 (Keffi), Aug 10\u201314 (Abuja), Oct 26\u201330 (Lagos), Nov 30\u2013Dec 4 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "General Administration and Management \u00b7 June 22\u201326 (Keffi), Aug 10\u201314 (Abuja), Oct 26\u201330 (Lagos), Nov 30\u2013Dec 4 (Ilorin)",
    "summary": "ICT Tools as Enabler For Improved Productivity in the Workplace is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff ALL - Depts.. Scheduled across GIBS training centres and regional hubs: June 22\u201326 (Keffi), Aug 10\u201314 (Abuja), Oct 26\u201330 (Lagos), Nov 30\u2013Dec 4 (Ilorin).",
    "audience": [
      "Senior & Middle level Mgt Staff ALL - Depts.",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 22\u201326 (Keffi), Aug 10\u201314 (Abuja), Oct 26\u201330 (Lagos), Nov 30\u2013Dec 4 (Ilorin)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 22\u201326 (Keffi), Aug 10\u201314 (Abuja), Oct 26\u201330 (Lagos), Nov 30\u2013Dec 4 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-33",
    "code": "GIBS-LOC-033",
    "num": 33,
    "slug": "course-33-regulatory-and-operational-strategies-for-telecom-executives",
    "title": "Regulatory and Operational Strategies for Telecom Executives",
    "category": "Telecom & Utilities Regulation",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Board Members and Executive Management Staff",
    "schedule": "May 11\u201315 (Ilorin), Aug 3\u20137 (Lagos), Oct 5\u20139 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Telecom & Utilities Regulation \u00b7 May 11\u201315 (Ilorin), Aug 3\u20137 (Lagos), Oct 5\u20139 (Abuja)",
    "summary": "Regulatory and Operational Strategies for Telecom Executives is an intensive 5 Days capacity-building programme designed for Board Members and Executive Management Staff. Scheduled across GIBS training centres and regional hubs: May 11\u201315 (Ilorin), Aug 3\u20137 (Lagos), Oct 5\u20139 (Abuja).",
    "audience": [
      "Board Members and Executive Management Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 11\u201315 (Ilorin), Aug 3\u20137 (Lagos), Oct 5\u20139 (Abuja)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 11\u201315 (Ilorin), Aug 3\u20137 (Lagos), Oct 5\u20139 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-34",
    "code": "GIBS-LOC-034",
    "num": 34,
    "slug": "course-34-next-generation-challenges-opportunities-for-telecom-senior",
    "title": "Next Generation Challenges & Opportunities for Telecom Senior Executives",
    "category": "Telecom & Utilities Regulation",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Board Members and Executive Management Staff",
    "schedule": "Aug 17\u201321 (Ilorin), Oct 12\u201316 (Abuja), Dec 7\u201311 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Telecom & Utilities Regulation \u00b7 Aug 17\u201321 (Ilorin), Oct 12\u201316 (Abuja), Dec 7\u201311 (Lagos)",
    "summary": "Next Generation Challenges & Opportunities for Telecom Senior Executives is an intensive 5 Days capacity-building programme designed for Board Members and Executive Management Staff. Scheduled across GIBS training centres and regional hubs: Aug 17\u201321 (Ilorin), Oct 12\u201316 (Abuja), Dec 7\u201311 (Lagos).",
    "audience": [
      "Board Members and Executive Management Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "Aug 17\u201321 (Ilorin), Oct 12\u201316 (Abuja), Dec 7\u201311 (Lagos)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: Aug 17\u201321 (Ilorin), Oct 12\u201316 (Abuja), Dec 7\u201311 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-35",
    "code": "GIBS-LOC-035",
    "num": 35,
    "slug": "course-35-effective-leadership-and-corporate-governance-for-directors",
    "title": "Effective Leadership and Corporate Governance For Directors & Senior Management Staff",
    "category": "Telecom & Utilities Regulation",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "July 6\u201310 (Ilorin), Sept 14\u201318 (Abuja), Oct 19\u201323 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Telecom & Utilities Regulation \u00b7 July 6\u201310 (Ilorin), Sept 14\u201318 (Abuja), Oct 19\u201323 (Lagos)",
    "summary": "Effective Leadership and Corporate Governance For Directors & Senior Management Staff is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: July 6\u201310 (Ilorin), Sept 14\u201318 (Abuja), Oct 19\u201323 (Lagos).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 6\u201310 (Ilorin), Sept 14\u201318 (Abuja), Oct 19\u201323 (Lagos)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 6\u201310 (Ilorin), Sept 14\u201318 (Abuja), Oct 19\u201323 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-36",
    "code": "GIBS-LOC-036",
    "num": 36,
    "slug": "course-36-regulatory-compliance-monitoring-and-enforcement-in-telecom",
    "title": "Regulatory Compliance Monitoring and Enforcement in Telecom, Power, Pension and Basic Sectors of the Economy",
    "category": "Telecom & Utilities Regulation",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Board Members and Executive Management Staff",
    "schedule": "April 20\u201324 (Abuja), July 13\u201317 (Ilorin), Sept 14\u201318 (Abuja & Ibafo), Oct 19\u201323 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Telecom & Utilities Regulation \u00b7 April 20\u201324 (Abuja), July 13\u201317 (Ilorin), Sept 14\u201318 (Abuja & Ibafo), Oct 19\u201323 (Lagos)",
    "summary": "Regulatory Compliance Monitoring and Enforcement in Telecom, Power, Pension and Basic Sectors of the Economy is an intensive 5 Days capacity-building programme designed for Board Members and Executive Management Staff. Scheduled across GIBS training centres and regional hubs: April 20\u201324 (Abuja), July 13\u201317 (Ilorin), Sept 14\u201318 (Abuja & Ibafo), Oct 19\u201323 (Lagos).",
    "audience": [
      "Board Members and Executive Management Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "April 20\u201324 (Abuja), July 13\u201317 (Ilorin), Sept 14\u201318 (Abuja & Ibafo), Oct 19\u201323 (Lagos)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: April 20\u201324 (Abuja), July 13\u201317 (Ilorin), Sept 14\u201318 (Abuja & Ibafo), Oct 19\u201323 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-37",
    "code": "GIBS-LOC-037",
    "num": 37,
    "slug": "course-37-economics-of-regulation-and-rates-determination-for-utilitie",
    "title": "Economics of Regulation and Rates Determination For Utilities Management",
    "category": "Consumer Protection & Utilities",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "July 13\u201317 (Abuja), Nov 9\u201313 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Consumer Protection & Utilities \u00b7 July 13\u201317 (Abuja), Nov 9\u201313 (Lagos)",
    "summary": "Economics of Regulation and Rates Determination For Utilities Management is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: July 13\u201317 (Abuja), Nov 9\u201313 (Lagos).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 13\u201317 (Abuja), Nov 9\u201313 (Lagos)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 13\u201317 (Abuja), Nov 9\u201313 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-38",
    "code": "GIBS-LOC-038",
    "num": 38,
    "slug": "course-38-regulations-and-consumer-protection-in-the-nigerian-economy",
    "title": "Regulations and Consumer Protection in the Nigerian Economy: Prospects and Challenges",
    "category": "Consumer Protection & Utilities",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "June 15\u201319 (Abuja), Aug 10\u201314 (Lagos), Sept 14\u201318 (Ilorin), Nov 16\u201320 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Consumer Protection & Utilities \u00b7 June 15\u201319 (Abuja), Aug 10\u201314 (Lagos), Sept 14\u201318 (Ilorin), Nov 16\u201320 (Abuja)",
    "summary": "Regulations and Consumer Protection in the Nigerian Economy: Prospects and Challenges is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: June 15\u201319 (Abuja), Aug 10\u201314 (Lagos), Sept 14\u201318 (Ilorin), Nov 16\u201320 (Abuja).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 15\u201319 (Abuja), Aug 10\u201314 (Lagos), Sept 14\u201318 (Ilorin), Nov 16\u201320 (Abuja)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 15\u201319 (Abuja), Aug 10\u201314 (Lagos), Sept 14\u201318 (Ilorin), Nov 16\u201320 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-39",
    "code": "GIBS-LOC-039",
    "num": 39,
    "slug": "course-39-telecom-for-beginners-and-non-engineers",
    "title": "Telecom For Beginners and Non-Engineers",
    "category": "Consumer Protection & Utilities",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Snr/Middle Level Mgt Staff",
    "schedule": "June 15\u201319 (Abuja), Aug 17\u201321 (Ilorin), Oct 19\u201323 (Abuja), Nov 9\u201313 (Lagos), Nov 30\u2013Dec 4 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Consumer Protection & Utilities \u00b7 June 15\u201319 (Abuja), Aug 17\u201321 (Ilorin), Oct 19\u201323 (Abuja), Nov 9\u201313 (Lagos), Nov 30\u2013Dec 4 (Ilorin)",
    "summary": "Telecom For Beginners and Non-Engineers is an intensive 5 Days capacity-building programme designed for Snr/Middle Level Mgt Staff. Scheduled across GIBS training centres and regional hubs: June 15\u201319 (Abuja), Aug 17\u201321 (Ilorin), Oct 19\u201323 (Abuja), Nov 9\u201313 (Lagos), Nov 30\u2013Dec 4 (Ilorin).",
    "audience": [
      "Snr/Middle Level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 15\u201319 (Abuja), Aug 17\u201321 (Ilorin), Oct 19\u201323 (Abuja), Nov 9\u201313 (Lagos), Nov 30\u2013Dec 4 (Ilorin)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 15\u201319 (Abuja), Aug 17\u201321 (Ilorin), Oct 19\u201323 (Abuja), Nov 9\u201313 (Lagos), Nov 30\u2013Dec 4 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-40",
    "code": "GIBS-LOC-040",
    "num": 40,
    "slug": "course-40-code-of-practice-regulation-for-regulators-public-and-privat",
    "title": "Code of Practice Regulation For Regulators: Public and Private sectors of the Nigerian Economy",
    "category": "Consumer Protection & Utilities",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "Aug 17\u201321 (Ibafo), Oct 19\u201323 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Consumer Protection & Utilities \u00b7 Aug 17\u201321 (Ibafo), Oct 19\u201323 (Abuja)",
    "summary": "Code of Practice Regulation For Regulators: Public and Private sectors of the Nigerian Economy is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: Aug 17\u201321 (Ibafo), Oct 19\u201323 (Abuja).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "Aug 17\u201321 (Ibafo), Oct 19\u201323 (Abuja)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: Aug 17\u201321 (Ibafo), Oct 19\u201323 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-41",
    "code": "GIBS-LOC-041",
    "num": 41,
    "slug": "course-41-regulation-and-protection-strategies-in-telecom-power-and-ot",
    "title": "Regulation and Protection Strategies in Telecom, Power and other Utilities",
    "category": "Consumer Protection & Utilities",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "July 20\u201324 (Ilorin), Oct 12\u201316 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Consumer Protection & Utilities \u00b7 July 20\u201324 (Ilorin), Oct 12\u201316 (Abuja)",
    "summary": "Regulation and Protection Strategies in Telecom, Power and other Utilities is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: July 20\u201324 (Ilorin), Oct 12\u201316 (Abuja).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 20\u201324 (Ilorin), Oct 12\u201316 (Abuja)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 20\u201324 (Ilorin), Oct 12\u201316 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-42",
    "code": "GIBS-LOC-042",
    "num": 42,
    "slug": "course-42-evaluation-of-quality-of-experience-of-consumers-feeling-the",
    "title": "Evaluation of Quality of Experience of Consumers \u2013 Feeling the Pulse",
    "category": "Consumer Protection & Utilities",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "July 13\u201317 (Ilorin), Aug 17\u201321 (Abuja), Oct 26\u201330 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Consumer Protection & Utilities \u00b7 July 13\u201317 (Ilorin), Aug 17\u201321 (Abuja), Oct 26\u201330 (Lagos)",
    "summary": "Evaluation of Quality of Experience of Consumers \u2013 Feeling the Pulse is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: July 13\u201317 (Ilorin), Aug 17\u201321 (Abuja), Oct 26\u201330 (Lagos).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 13\u201317 (Ilorin), Aug 17\u201321 (Abuja), Oct 26\u201330 (Lagos)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 13\u201317 (Ilorin), Aug 17\u201321 (Abuja), Oct 26\u201330 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-43",
    "code": "GIBS-LOC-043",
    "num": 43,
    "slug": "course-43-cyber-crime-and-cyber-security-prospects-challenges",
    "title": "Cyber Crime and Cyber Security: Prospects & Challenges",
    "category": "Consumer Protection & Utilities",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "July 20\u201324 (Ilorin), Sept 14\u201318 (Ibafo), Oct 12\u201316 (Abuja), Nov 16\u201320 (Lagos), Dec 7\u201311 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Consumer Protection & Utilities \u00b7 July 20\u201324 (Ilorin), Sept 14\u201318 (Ibafo), Oct 12\u201316 (Abuja), Nov 16\u201320 (Lagos), Dec 7\u201311 (Abuja)",
    "summary": "Cyber Crime and Cyber Security: Prospects & Challenges is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: July 20\u201324 (Ilorin), Sept 14\u201318 (Ibafo), Oct 12\u201316 (Abuja), Nov 16\u201320 (Lagos), Dec 7\u201311 (Abuja).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 20\u201324 (Ilorin), Sept 14\u201318 (Ibafo), Oct 12\u201316 (Abuja), Nov 16\u201320 (Lagos), Dec 7\u201311 (Abuja)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 20\u201324 (Ilorin), Sept 14\u201318 (Ibafo), Oct 12\u201316 (Abuja), Nov 16\u201320 (Lagos), Dec 7\u201311 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-44",
    "code": "GIBS-LOC-044",
    "num": 44,
    "slug": "course-44-capacity-building-workshop-on-ict-literacy-and-security-awar",
    "title": "Capacity-Building Workshop on ICT Literacy and Security Awareness",
    "category": "Consumer Protection & Utilities",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "All Staff",
    "schedule": "July 13\u201317 (Ilorin), Aug 10\u201314 (Abuja), Sept 14\u201318 (Lagos), Nov 2\u20136 (Abuja), Dec 7\u201311 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Consumer Protection & Utilities \u00b7 July 13\u201317 (Ilorin), Aug 10\u201314 (Abuja), Sept 14\u201318 (Lagos), Nov 2\u20136 (Abuja), Dec 7\u201311 (Lagos)",
    "summary": "Capacity-Building Workshop on ICT Literacy and Security Awareness is an intensive 5 Days capacity-building programme designed for All Staff. Scheduled across GIBS training centres and regional hubs: July 13\u201317 (Ilorin), Aug 10\u201314 (Abuja), Sept 14\u201318 (Lagos), Nov 2\u20136 (Abuja), Dec 7\u201311 (Lagos).",
    "audience": [
      "All Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 13\u201317 (Ilorin), Aug 10\u201314 (Abuja), Sept 14\u201318 (Lagos), Nov 2\u20136 (Abuja), Dec 7\u201311 (Lagos)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 13\u201317 (Ilorin), Aug 10\u201314 (Abuja), Sept 14\u201318 (Lagos), Nov 2\u20136 (Abuja), Dec 7\u201311 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-45",
    "code": "GIBS-LOC-045",
    "num": 45,
    "slug": "course-45-managing-consumer-expectations-customer-retention",
    "title": "Managing Consumer Expectations & Customer Retention",
    "category": "Consumer Protection & Utilities",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "Aug 17\u201321 (Abuja), Oct 12\u201316 (Lagos), Nov 9\u201313 (Keffi)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Consumer Protection & Utilities \u00b7 Aug 17\u201321 (Abuja), Oct 12\u201316 (Lagos), Nov 9\u201313 (Keffi)",
    "summary": "Managing Consumer Expectations & Customer Retention is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: Aug 17\u201321 (Abuja), Oct 12\u201316 (Lagos), Nov 9\u201313 (Keffi).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "Aug 17\u201321 (Abuja), Oct 12\u201316 (Lagos), Nov 9\u201313 (Keffi)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: Aug 17\u201321 (Abuja), Oct 12\u201316 (Lagos), Nov 9\u201313 (Keffi)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-46",
    "code": "GIBS-LOC-046",
    "num": 46,
    "slug": "course-46-customers-experience-management-workshop",
    "title": "Customers Experience Management Workshop",
    "category": "Consumer Protection & Utilities",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "July 6\u201310 (Lagos), Sept 7\u201311 (Abuja), Oct 19\u201323 (Ilorin), Nov 23\u201327 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Consumer Protection & Utilities \u00b7 July 6\u201310 (Lagos), Sept 7\u201311 (Abuja), Oct 19\u201323 (Ilorin), Nov 23\u201327 (Abuja)",
    "summary": "Customers Experience Management Workshop is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: July 6\u201310 (Lagos), Sept 7\u201311 (Abuja), Oct 19\u201323 (Ilorin), Nov 23\u201327 (Abuja).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 6\u201310 (Lagos), Sept 7\u201311 (Abuja), Oct 19\u201323 (Ilorin), Nov 23\u201327 (Abuja)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 6\u201310 (Lagos), Sept 7\u201311 (Abuja), Oct 19\u201323 (Ilorin), Nov 23\u201327 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-47",
    "code": "GIBS-LOC-047",
    "num": 47,
    "slug": "course-47-telecom-installations-and-radiation-environmental-impact-ass",
    "title": "Telecom Installations and Radiation: Environmental Impact, Assessment and Quality",
    "category": "Environmental Sustainability & Management",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "May 4\u20138 (Ilorin), July 6\u201310 (Abuja), Sept 14\u201318 (Ibafo), Oct 26\u201330 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Environmental Sustainability & Management \u00b7 May 4\u20138 (Ilorin), July 6\u201310 (Abuja), Sept 14\u201318 (Ibafo), Oct 26\u201330 (Lagos)",
    "summary": "Telecom Installations and Radiation: Environmental Impact, Assessment and Quality is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: May 4\u20138 (Ilorin), July 6\u201310 (Abuja), Sept 14\u201318 (Ibafo), Oct 26\u201330 (Lagos).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 4\u20138 (Ilorin), July 6\u201310 (Abuja), Sept 14\u201318 (Ibafo), Oct 26\u201330 (Lagos)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 4\u20138 (Ilorin), July 6\u201310 (Abuja), Sept 14\u201318 (Ibafo), Oct 26\u201330 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-48",
    "code": "GIBS-LOC-048",
    "num": 48,
    "slug": "course-48-global-environmental-change-and-development-impact",
    "title": "Global Environmental Change and Development Impact",
    "category": "Environmental Sustainability & Management",
    "destination": "Local",
    "fee": 350000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.",
    "schedule": "March 16\u201320 (Ilorin), Aug 10\u201314 (Abuja), Nov 9\u201313 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Environmental Sustainability & Management \u00b7 March 16\u201320 (Ilorin), Aug 10\u201314 (Abuja), Nov 9\u201313 (Abuja)",
    "summary": "Global Environmental Change and Development Impact is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.. Scheduled across GIBS training centres and regional hubs: March 16\u201320 (Ilorin), Aug 10\u201314 (Abuja), Nov 9\u201313 (Abuja).",
    "audience": [
      "Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "March 16\u201320 (Ilorin), Aug 10\u201314 (Abuja), Nov 9\u201313 (Abuja)",
    "fees": "\u20a6350,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: March 16\u201320 (Ilorin), Aug 10\u201314 (Abuja), Nov 9\u201313 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6350,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-49",
    "code": "GIBS-LOC-049",
    "num": 49,
    "slug": "course-49-environmental-sustainability-and-development-strategies",
    "title": "Environmental Sustainability and Development Strategies",
    "category": "Environmental Sustainability & Management",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "March 23\u201327 (Ibafo), Nov 16\u201320 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Environmental Sustainability & Management \u00b7 March 23\u201327 (Ibafo), Nov 16\u201320 (Ilorin)",
    "summary": "Environmental Sustainability and Development Strategies is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: March 23\u201327 (Ibafo), Nov 16\u201320 (Ilorin).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "March 23\u201327 (Ibafo), Nov 16\u201320 (Ilorin)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: March 23\u201327 (Ibafo), Nov 16\u201320 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-50",
    "code": "GIBS-LOC-050",
    "num": 50,
    "slug": "course-50-environmental-protection-issues-prospects-and-challenges-dra",
    "title": "Environmental Protection Issues - Prospects and Challenges: Draught, Deforestation, Afforestation, Desert Encroachment, Water and Air Pollution, Oil Spillage, Erosion Control Mechanism",
    "category": "Environmental Sustainability & Management",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "May 4\u20138 (Ibafo), July 6\u201310 (Abuja), Sept 7\u201311 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Environmental Sustainability & Management \u00b7 May 4\u20138 (Ibafo), July 6\u201310 (Abuja), Sept 7\u201311 (Ilorin)",
    "summary": "Environmental Protection Issues - Prospects and Challenges: Draught, Deforestation, Afforestation, Desert Encroachment, Water and Air Pollution, Oil Spillage, Erosion Control Mechanism is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: May 4\u20138 (Ibafo), July 6\u201310 (Abuja), Sept 7\u201311 (Ilorin).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 4\u20138 (Ibafo), July 6\u201310 (Abuja), Sept 7\u201311 (Ilorin)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 4\u20138 (Ibafo), July 6\u201310 (Abuja), Sept 7\u201311 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-51",
    "code": "GIBS-LOC-051",
    "num": 51,
    "slug": "course-51-climate-change-and-agricultural-development-strategies",
    "title": "Climate Change and Agricultural Development Strategies",
    "category": "Environmental Sustainability & Management",
    "destination": "Local",
    "fee": 350000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "March 23\u201327 (Ilorin), Nov 2\u20136 (Ibafo)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Environmental Sustainability & Management \u00b7 March 23\u201327 (Ilorin), Nov 2\u20136 (Ibafo)",
    "summary": "Climate Change and Agricultural Development Strategies is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: March 23\u201327 (Ilorin), Nov 2\u20136 (Ibafo).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "March 23\u201327 (Ilorin), Nov 2\u20136 (Ibafo)",
    "fees": "\u20a6350,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: March 23\u201327 (Ilorin), Nov 2\u20136 (Ibafo)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6350,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-52",
    "code": "GIBS-LOC-052",
    "num": 52,
    "slug": "course-52-soil-management-and-food-production-techniques",
    "title": "Soil Management and Food Production Techniques",
    "category": "Environmental Sustainability & Management",
    "destination": "Local",
    "fee": 300000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "Nov 16\u201320 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Environmental Sustainability & Management \u00b7 Nov 16\u201320 (Ilorin)",
    "summary": "Soil Management and Food Production Techniques is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: Nov 16\u201320 (Ilorin).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "Nov 16\u201320 (Ilorin)",
    "fees": "\u20a6300,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: Nov 16\u201320 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6300,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-53",
    "code": "GIBS-LOC-053",
    "num": 53,
    "slug": "course-53-international-oil-and-gas-development-strategies-upstream-do",
    "title": "International Oil and Gas Development Strategies: Upstream / Downstream Segments",
    "category": "Oil & Gas Sector",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "HR, Admin, Procurement, Senior & Middle level Mgt Staff",
    "schedule": "Aug 3\u20137 (Abuja), Oct 5\u20139 (Ibafo)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Oil & Gas Sector \u00b7 Aug 3\u20137 (Abuja), Oct 5\u20139 (Ibafo)",
    "summary": "International Oil and Gas Development Strategies: Upstream / Downstream Segments is an intensive 5 Days capacity-building programme designed for HR, Admin, Procurement, Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: Aug 3\u20137 (Abuja), Oct 5\u20139 (Ibafo).",
    "audience": [
      "HR, Admin, Procurement, Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "Aug 3\u20137 (Abuja), Oct 5\u20139 (Ibafo)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: Aug 3\u20137 (Abuja), Oct 5\u20139 (Ibafo)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-54",
    "code": "GIBS-LOC-054",
    "num": 54,
    "slug": "course-54-local-content-development-strategies-in-the-oil-and-gas-indu",
    "title": "Local Content Development Strategies in the Oil and Gas Industry",
    "category": "Oil & Gas Sector",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Top/Senior & Middle Level Mgt",
    "schedule": "June 8\u201312 (Ilorin), Oct 5\u20139 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Oil & Gas Sector \u00b7 June 8\u201312 (Ilorin), Oct 5\u20139 (Abuja)",
    "summary": "Local Content Development Strategies in the Oil and Gas Industry is an intensive 5 Days capacity-building programme designed for Top/Senior & Middle Level Mgt. Scheduled across GIBS training centres and regional hubs: June 8\u201312 (Ilorin), Oct 5\u20139 (Abuja).",
    "audience": [
      "Top/Senior & Middle Level Mgt",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 8\u201312 (Ilorin), Oct 5\u20139 (Abuja)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 8\u201312 (Ilorin), Oct 5\u20139 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-55",
    "code": "GIBS-LOC-055",
    "num": 55,
    "slug": "course-55-building-capacity-in-environmental-management-best-practices",
    "title": "Building Capacity in Environmental Management: Best Practices in the Oil and Gas Industry",
    "category": "Oil & Gas Sector",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Top/Senior & Middle Level Mgt",
    "schedule": "May 11\u201315 (Abuja), July 13\u201317 (Lagos), Sept 7\u201311 (Abuja), Nov 9\u201313 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Oil & Gas Sector \u00b7 May 11\u201315 (Abuja), July 13\u201317 (Lagos), Sept 7\u201311 (Abuja), Nov 9\u201313 (Lagos)",
    "summary": "Building Capacity in Environmental Management: Best Practices in the Oil and Gas Industry is an intensive 5 Days capacity-building programme designed for Top/Senior & Middle Level Mgt. Scheduled across GIBS training centres and regional hubs: May 11\u201315 (Abuja), July 13\u201317 (Lagos), Sept 7\u201311 (Abuja), Nov 9\u201313 (Lagos).",
    "audience": [
      "Top/Senior & Middle Level Mgt",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 11\u201315 (Abuja), July 13\u201317 (Lagos), Sept 7\u201311 (Abuja), Nov 9\u201313 (Lagos)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 11\u201315 (Abuja), July 13\u201317 (Lagos), Sept 7\u201311 (Abuja), Nov 9\u201313 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-56",
    "code": "GIBS-LOC-056",
    "num": 56,
    "slug": "course-56-skill-enhancement-for-secretaries-and-pas",
    "title": "Skill Enhancement for Secretaries and PAs",
    "category": "Secretarial Administration & Management",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Secretaries",
    "schedule": "July 13\u201317 (Abuja), Aug 3\u20137 (Ilorin), Oct 5\u20139 (Keffi), Nov 16\u201320 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Secretarial Administration & Management \u00b7 July 13\u201317 (Abuja), Aug 3\u20137 (Ilorin), Oct 5\u20139 (Keffi), Nov 16\u201320 (Lagos)",
    "summary": "Skill Enhancement for Secretaries and PAs is an intensive 5 Days capacity-building programme designed for Senior & Middle level Secretaries. Scheduled across GIBS training centres and regional hubs: July 13\u201317 (Abuja), Aug 3\u20137 (Ilorin), Oct 5\u20139 (Keffi), Nov 16\u201320 (Lagos).",
    "audience": [
      "Senior & Middle level Secretaries",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 13\u201317 (Abuja), Aug 3\u20137 (Ilorin), Oct 5\u20139 (Keffi), Nov 16\u201320 (Lagos)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 13\u201317 (Abuja), Aug 3\u20137 (Ilorin), Oct 5\u20139 (Keffi), Nov 16\u201320 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-57",
    "code": "GIBS-LOC-057",
    "num": 57,
    "slug": "course-57-modern-secretarial-administration-techniques-in-the-computer",
    "title": "Modern Secretarial Administration Techniques in the Computerisation Era",
    "category": "Secretarial Administration & Management",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Secretaries",
    "schedule": "June 1\u20135 (Ilorin), Aug 17\u201321 (Abuja), Oct 12\u201316 (Keffi)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Secretarial Administration & Management \u00b7 June 1\u20135 (Ilorin), Aug 17\u201321 (Abuja), Oct 12\u201316 (Keffi)",
    "summary": "Modern Secretarial Administration Techniques in the Computerisation Era is an intensive 5 Days capacity-building programme designed for Senior & Middle level Secretaries. Scheduled across GIBS training centres and regional hubs: June 1\u20135 (Ilorin), Aug 17\u201321 (Abuja), Oct 12\u201316 (Keffi).",
    "audience": [
      "Senior & Middle level Secretaries",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 1\u20135 (Ilorin), Aug 17\u201321 (Abuja), Oct 12\u201316 (Keffi)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 1\u20135 (Ilorin), Aug 17\u201321 (Abuja), Oct 12\u201316 (Keffi)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-58",
    "code": "GIBS-LOC-058",
    "num": 58,
    "slug": "course-58-executive-secretarial-management-the-new-strategies",
    "title": "Executive Secretarial Management: The New Strategies",
    "category": "Secretarial Administration & Management",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior level Secretaries",
    "schedule": "June 8\u201312 (Ilorin), Sept 7\u201311 (Abuja), Nov 2\u20136 (Ibafo), Nov 30\u2013Dec 4 (Keffi)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Secretarial Administration & Management \u00b7 June 8\u201312 (Ilorin), Sept 7\u201311 (Abuja), Nov 2\u20136 (Ibafo), Nov 30\u2013Dec 4 (Keffi)",
    "summary": "Executive Secretarial Management: The New Strategies is an intensive 5 Days capacity-building programme designed for Senior level Secretaries. Scheduled across GIBS training centres and regional hubs: June 8\u201312 (Ilorin), Sept 7\u201311 (Abuja), Nov 2\u20136 (Ibafo), Nov 30\u2013Dec 4 (Keffi).",
    "audience": [
      "Senior level Secretaries",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 8\u201312 (Ilorin), Sept 7\u201311 (Abuja), Nov 2\u20136 (Ibafo), Nov 30\u2013Dec 4 (Keffi)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 8\u201312 (Ilorin), Sept 7\u201311 (Abuja), Nov 2\u20136 (Ibafo), Nov 30\u2013Dec 4 (Keffi)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-59",
    "code": "GIBS-LOC-059",
    "num": 59,
    "slug": "course-59-excel-and-power-point-preparation-skill-for-secretaries",
    "title": "Excel and Power Point Preparation Skill for Secretaries",
    "category": "Secretarial Administration & Management",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Secretaries, PAs",
    "schedule": "May 18\u201322 (Ilorin), Oct 5\u20139 (Ibafo)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Secretarial Administration & Management \u00b7 May 18\u201322 (Ilorin), Oct 5\u20139 (Ibafo)",
    "summary": "Excel and Power Point Preparation Skill for Secretaries is an intensive 5 Days capacity-building programme designed for Secretaries, PAs. Scheduled across GIBS training centres and regional hubs: May 18\u201322 (Ilorin), Oct 5\u20139 (Ibafo).",
    "audience": [
      "Secretaries, PAs",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 18\u201322 (Ilorin), Oct 5\u20139 (Ibafo)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 18\u201322 (Ilorin), Oct 5\u20139 (Ibafo)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-60",
    "code": "GIBS-LOC-060",
    "num": 60,
    "slug": "course-60-basic-management-workshop-for-secretaries-and-personal-assis",
    "title": "Basic Management Workshop For Secretaries and Personal Assistants",
    "category": "Secretarial Administration & Management",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Secretaries, PAs",
    "schedule": "June 8\u201312 (Abuja), Aug 31\u2013Sept 4 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Secretarial Administration & Management \u00b7 June 8\u201312 (Abuja), Aug 31\u2013Sept 4 (Ilorin)",
    "summary": "Basic Management Workshop For Secretaries and Personal Assistants is an intensive 5 Days capacity-building programme designed for Secretaries, PAs. Scheduled across GIBS training centres and regional hubs: June 8\u201312 (Abuja), Aug 31\u2013Sept 4 (Ilorin).",
    "audience": [
      "Secretaries, PAs",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 8\u201312 (Abuja), Aug 31\u2013Sept 4 (Ilorin)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 8\u201312 (Abuja), Aug 31\u2013Sept 4 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-61",
    "code": "GIBS-LOC-061",
    "num": 61,
    "slug": "course-61-capital-market-development-and-regulations",
    "title": "Capital Market: Development and Regulations",
    "category": "Capital Market & Securities Management",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "May 11\u201315 (Abuja), Aug 3\u20137 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Capital Market & Securities Management \u00b7 May 11\u201315 (Abuja), Aug 3\u20137 (Ilorin)",
    "summary": "Capital Market: Development and Regulations is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: May 11\u201315 (Abuja), Aug 3\u20137 (Ilorin).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 11\u201315 (Abuja), Aug 3\u20137 (Ilorin)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 11\u201315 (Abuja), Aug 3\u20137 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-62",
    "code": "GIBS-LOC-062",
    "num": 62,
    "slug": "course-62-securitiesstock-market-development-and-management",
    "title": "Securities/Stock Market Development and Management",
    "category": "Capital Market & Securities Management",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "June 1\u20135 (Abuja), Nov 9\u201313 (Ibafo)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Capital Market & Securities Management \u00b7 June 1\u20135 (Abuja), Nov 9\u201313 (Ibafo)",
    "summary": "Securities/Stock Market Development and Management is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: June 1\u20135 (Abuja), Nov 9\u201313 (Ibafo).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 1\u20135 (Abuja), Nov 9\u201313 (Ibafo)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 1\u20135 (Abuja), Nov 9\u201313 (Ibafo)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-63",
    "code": "GIBS-LOC-063",
    "num": 63,
    "slug": "course-63-capital-market-management-foundation-of-development-and-regu",
    "title": "Capital Market Management: Foundation of Development and Regulation",
    "category": "Capital Market & Securities Management",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.",
    "schedule": "Aug 3\u20137 (Ilorin), Sept 7\u201311 (Abuja), Nov 16\u201320 (Ibafo)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Capital Market & Securities Management \u00b7 Aug 3\u20137 (Ilorin), Sept 7\u201311 (Abuja), Nov 16\u201320 (Ibafo)",
    "summary": "Capital Market Management: Foundation of Development and Regulation is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.. Scheduled across GIBS training centres and regional hubs: Aug 3\u20137 (Ilorin), Sept 7\u201311 (Abuja), Nov 16\u201320 (Ibafo).",
    "audience": [
      "Senior & Middle level Mgt Staff - Finance, Audit, Procurement Dept.",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "Aug 3\u20137 (Ilorin), Sept 7\u201311 (Abuja), Nov 16\u201320 (Ibafo)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: Aug 3\u20137 (Ilorin), Sept 7\u201311 (Abuja), Nov 16\u201320 (Ibafo)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-64",
    "code": "GIBS-LOC-064",
    "num": 64,
    "slug": "course-64-alternative-securities-market-raising-capital-for-businesses",
    "title": "Alternative Securities Market: Raising Capital for Businesses",
    "category": "Capital Market & Securities Management",
    "destination": "Local",
    "fee": 350000,
    "currency": "NGN",
    "targetAudience": "All Staff",
    "schedule": "June 8\u201312 (Lagos), Nov 2\u20136 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Capital Market & Securities Management \u00b7 June 8\u201312 (Lagos), Nov 2\u20136 (Ilorin)",
    "summary": "Alternative Securities Market: Raising Capital for Businesses is an intensive 5 Days capacity-building programme designed for All Staff. Scheduled across GIBS training centres and regional hubs: June 8\u201312 (Lagos), Nov 2\u20136 (Ilorin).",
    "audience": [
      "All Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 8\u201312 (Lagos), Nov 2\u20136 (Ilorin)",
    "fees": "\u20a6350,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 8\u201312 (Lagos), Nov 2\u20136 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6350,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-65",
    "code": "GIBS-LOC-065",
    "num": 65,
    "slug": "course-65-strategies-against-cybersecurity-vulnerability-and-threats",
    "title": "Strategies Against Cybersecurity Vulnerability and Threats",
    "category": "Information Technology Workshops",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Senior and Middle Level Staff",
    "schedule": "July 13\u201317 (Keffi), Aug 17\u201321 (Abuja), Oct 5\u20139 (Ibafo), Dec 7\u201311 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Information Technology Workshops \u00b7 July 13\u201317 (Keffi), Aug 17\u201321 (Abuja), Oct 5\u20139 (Ibafo), Dec 7\u201311 (Lagos)",
    "summary": "Strategies Against Cybersecurity Vulnerability and Threats is an intensive 5 Days capacity-building programme designed for Senior and Middle Level Staff. Scheduled across GIBS training centres and regional hubs: July 13\u201317 (Keffi), Aug 17\u201321 (Abuja), Oct 5\u20139 (Ibafo), Dec 7\u201311 (Lagos).",
    "audience": [
      "Senior and Middle Level Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 13\u201317 (Keffi), Aug 17\u201321 (Abuja), Oct 5\u20139 (Ibafo), Dec 7\u201311 (Lagos)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 13\u201317 (Keffi), Aug 17\u201321 (Abuja), Oct 5\u20139 (Ibafo), Dec 7\u201311 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-66",
    "code": "GIBS-LOC-066",
    "num": 66,
    "slug": "course-66-microsoft-excel-for-managers-accountants-statisticians-inter",
    "title": "Microsoft Excel For Managers, Accountants, Statisticians: Intermediate",
    "category": "Information Technology Workshops",
    "destination": "Local",
    "fee": 300000,
    "currency": "NGN",
    "targetAudience": "Senior Level Staff",
    "schedule": "June 1\u20135 (Abuja), Nov 2\u20136 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Information Technology Workshops \u00b7 June 1\u20135 (Abuja), Nov 2\u20136 (Abuja)",
    "summary": "Microsoft Excel For Managers, Accountants, Statisticians: Intermediate is an intensive 5 Days capacity-building programme designed for Senior Level Staff. Scheduled across GIBS training centres and regional hubs: June 1\u20135 (Abuja), Nov 2\u20136 (Abuja).",
    "audience": [
      "Senior Level Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 1\u20135 (Abuja), Nov 2\u20136 (Abuja)",
    "fees": "\u20a6300,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 1\u20135 (Abuja), Nov 2\u20136 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6300,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-67",
    "code": "GIBS-LOC-067",
    "num": 67,
    "slug": "course-67-microsoft-excel-for-managers-accountants-statisticians-advan",
    "title": "Microsoft Excel For Managers, Accountants, Statisticians: Advanced",
    "category": "Information Technology Workshops",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Senior Level Staff",
    "schedule": "Aug 3\u20137 (Ibafo), Sept 14\u201318 (Ilorin), Nov 16\u201320 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Information Technology Workshops \u00b7 Aug 3\u20137 (Ibafo), Sept 14\u201318 (Ilorin), Nov 16\u201320 (Abuja)",
    "summary": "Microsoft Excel For Managers, Accountants, Statisticians: Advanced is an intensive 5 Days capacity-building programme designed for Senior Level Staff. Scheduled across GIBS training centres and regional hubs: Aug 3\u20137 (Ibafo), Sept 14\u201318 (Ilorin), Nov 16\u201320 (Abuja).",
    "audience": [
      "Senior Level Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "Aug 3\u20137 (Ibafo), Sept 14\u201318 (Ilorin), Nov 16\u201320 (Abuja)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: Aug 3\u20137 (Ibafo), Sept 14\u201318 (Ilorin), Nov 16\u201320 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-68",
    "code": "GIBS-LOC-068",
    "num": 68,
    "slug": "course-68-the-role-of-public-servants-in-legal-political-and-social-de",
    "title": "The Role of Public Servants in Legal, Political and Social Development in Nigeria",
    "category": "Legal & Legislative Studies",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "June 15\u201319 (Abuja), Aug 10\u201314 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Legal & Legislative Studies \u00b7 June 15\u201319 (Abuja), Aug 10\u201314 (Abuja)",
    "summary": "The Role of Public Servants in Legal, Political and Social Development in Nigeria is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: June 15\u201319 (Abuja), Aug 10\u201314 (Abuja).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 15\u201319 (Abuja), Aug 10\u201314 (Abuja)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 15\u201319 (Abuja), Aug 10\u201314 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-69",
    "code": "GIBS-LOC-069",
    "num": 69,
    "slug": "course-69-public-service-in-a-constitutional-democracy-the-prospects-a",
    "title": "Public Service in a Constitutional Democracy: The Prospects and Challenges",
    "category": "Legal & Legislative Studies",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "March 9\u201313 (Ilorin), July 20\u201324 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Legal & Legislative Studies \u00b7 March 9\u201313 (Ilorin), July 20\u201324 (Abuja)",
    "summary": "Public Service in a Constitutional Democracy: The Prospects and Challenges is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: March 9\u201313 (Ilorin), July 20\u201324 (Abuja).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "March 9\u201313 (Ilorin), July 20\u201324 (Abuja)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: March 9\u201313 (Ilorin), July 20\u201324 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-70",
    "code": "GIBS-LOC-070",
    "num": 70,
    "slug": "course-70-fundamentals-of-legislative-drafting",
    "title": "Fundamentals of Legislative Drafting",
    "category": "Legal & Legislative Studies",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Legal Dept. Staff",
    "schedule": "Oct 19\u201323 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Legal & Legislative Studies \u00b7 Oct 19\u201323 (Abuja)",
    "summary": "Fundamentals of Legislative Drafting is an intensive 5 Days capacity-building programme designed for Legal Dept. Staff. Scheduled across GIBS training centres and regional hubs: Oct 19\u201323 (Abuja).",
    "audience": [
      "Legal Dept. Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "Oct 19\u201323 (Abuja)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: Oct 19\u201323 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-71",
    "code": "GIBS-LOC-071",
    "num": 71,
    "slug": "course-71-rule-of-law-and-good-governance",
    "title": "Rule of Law and Good Governance",
    "category": "Legal & Legislative Studies",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "Sept 14\u201318 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Legal & Legislative Studies \u00b7 Sept 14\u201318 (Ilorin)",
    "summary": "Rule of Law and Good Governance is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: Sept 14\u201318 (Ilorin).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "Sept 14\u201318 (Ilorin)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: Sept 14\u201318 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-72",
    "code": "GIBS-LOC-072",
    "num": 72,
    "slug": "course-72-law-makers-and-legislative-process",
    "title": "Law Makers and Legislative Process",
    "category": "Legal & Legislative Studies",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Legislators & Related Staff",
    "schedule": "Apr 13\u201317 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Legal & Legislative Studies \u00b7 Apr 13\u201317 (Abuja)",
    "summary": "Law Makers and Legislative Process is an intensive 5 Days capacity-building programme designed for Legislators & Related Staff. Scheduled across GIBS training centres and regional hubs: Apr 13\u201317 (Abuja).",
    "audience": [
      "Legislators & Related Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "Apr 13\u201317 (Abuja)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: Apr 13\u201317 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-73",
    "code": "GIBS-LOC-073",
    "num": 73,
    "slug": "course-73-law-making-as-a-catalyst-for-national-development",
    "title": "Law Making as a Catalyst for National Development",
    "category": "Legal & Legislative Studies",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Legislators & Related Staff",
    "schedule": "Apr 20\u201324 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Legal & Legislative Studies \u00b7 Apr 20\u201324 (Abuja)",
    "summary": "Law Making as a Catalyst for National Development is an intensive 5 Days capacity-building programme designed for Legislators & Related Staff. Scheduled across GIBS training centres and regional hubs: Apr 20\u201324 (Abuja).",
    "audience": [
      "Legislators & Related Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "Apr 20\u201324 (Abuja)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: Apr 20\u201324 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-74",
    "code": "GIBS-LOC-074",
    "num": 74,
    "slug": "course-74-legislature-as-sustainers-of-democracy",
    "title": "Legislature as Sustainers of Democracy",
    "category": "Legal & Legislative Studies",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Legislators & Related Staff",
    "schedule": "June 15\u201319 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Legal & Legislative Studies \u00b7 June 15\u201319 (Abuja)",
    "summary": "Legislature as Sustainers of Democracy is an intensive 5 Days capacity-building programme designed for Legislators & Related Staff. Scheduled across GIBS training centres and regional hubs: June 15\u201319 (Abuja).",
    "audience": [
      "Legislators & Related Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 15\u201319 (Abuja)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 15\u201319 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-75",
    "code": "GIBS-LOC-075",
    "num": 75,
    "slug": "course-75-orientation-and-induction-for-legislators",
    "title": "Orientation and Induction for Legislators",
    "category": "Legal & Legislative Studies",
    "destination": "Local",
    "fee": 600000,
    "currency": "NGN",
    "targetAudience": "Legislators & Related Staff",
    "schedule": "June 22\u201326 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Legal & Legislative Studies \u00b7 June 22\u201326 (Abuja)",
    "summary": "Orientation and Induction for Legislators is an intensive 5 Days capacity-building programme designed for Legislators & Related Staff. Scheduled across GIBS training centres and regional hubs: June 22\u201326 (Abuja).",
    "audience": [
      "Legislators & Related Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 22\u201326 (Abuja)",
    "fees": "\u20a6600,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 22\u201326 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6600,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-76",
    "code": "GIBS-LOC-076",
    "num": 76,
    "slug": "course-76-international-oil-and-gas-management-development-strategies",
    "title": "International Oil and Gas Management Development Strategies: Upstream / Downstream Segments",
    "category": "Power & Energy Sector",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "HR, Admin, Procurement, Senior & Middle level Mgt Staff",
    "schedule": "April 13\u201317 (Ibafo), July 13\u201317 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Power & Energy Sector \u00b7 April 13\u201317 (Ibafo), July 13\u201317 (Abuja)",
    "summary": "International Oil and Gas Management Development Strategies: Upstream / Downstream Segments is an intensive 5 Days capacity-building programme designed for HR, Admin, Procurement, Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: April 13\u201317 (Ibafo), July 13\u201317 (Abuja).",
    "audience": [
      "HR, Admin, Procurement, Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "April 13\u201317 (Ibafo), July 13\u201317 (Abuja)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: April 13\u201317 (Ibafo), July 13\u201317 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-77",
    "code": "GIBS-LOC-077",
    "num": 77,
    "slug": "course-77-building-capacity-in-environmental-management-best-practices",
    "title": "Building Capacity in Environmental Management: Best Practices in the Oil and Gas Industry",
    "category": "Power & Energy Sector",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Top/Senior & Middle Level Mgt",
    "schedule": "May 11\u201315 (Lagos), Aug 17\u201321 (Lagos), Nov 9\u201313 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Power & Energy Sector \u00b7 May 11\u201315 (Lagos), Aug 17\u201321 (Lagos), Nov 9\u201313 (Abuja)",
    "summary": "Building Capacity in Environmental Management: Best Practices in the Oil and Gas Industry is an intensive 5 Days capacity-building programme designed for Top/Senior & Middle Level Mgt. Scheduled across GIBS training centres and regional hubs: May 11\u201315 (Lagos), Aug 17\u201321 (Lagos), Nov 9\u201313 (Abuja).",
    "audience": [
      "Top/Senior & Middle Level Mgt",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 11\u201315 (Lagos), Aug 17\u201321 (Lagos), Nov 9\u201313 (Abuja)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 11\u201315 (Lagos), Aug 17\u201321 (Lagos), Nov 9\u201313 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-78",
    "code": "GIBS-LOC-078",
    "num": 78,
    "slug": "course-78-power-sector-reforms-and-the-impacts-on-economic-development",
    "title": "Power Sector Reforms and the Impacts on Economic Development of the Nation",
    "category": "Power & Energy Sector",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "June 15\u201319 (Abuja), Sept 7\u201311 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Power & Energy Sector \u00b7 June 15\u201319 (Abuja), Sept 7\u201311 (Ilorin)",
    "summary": "Power Sector Reforms and the Impacts on Economic Development of the Nation is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: June 15\u201319 (Abuja), Sept 7\u201311 (Ilorin).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 15\u201319 (Abuja), Sept 7\u201311 (Ilorin)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 15\u201319 (Abuja), Sept 7\u201311 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-79",
    "code": "GIBS-LOC-079",
    "num": 79,
    "slug": "course-79-unbundling-the-power-sector-prospects-for-economic-growth",
    "title": "Unbundling the Power Sector: Prospects For Economic Growth",
    "category": "Power & Energy Sector",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "July 13\u201317 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Power & Energy Sector \u00b7 July 13\u201317 (Abuja)",
    "summary": "Unbundling the Power Sector: Prospects For Economic Growth is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: July 13\u201317 (Abuja).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 13\u201317 (Abuja)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 13\u201317 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-80",
    "code": "GIBS-LOC-080",
    "num": 80,
    "slug": "course-80-tariff-and-rate-setting-management-for-utilities-telecoms-an",
    "title": "Tariff and Rate Setting Management For Utilities (Telecoms and Power Sectors): The Impact on Customers",
    "category": "Power & Energy Sector",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "Aug 24\u201328 (Lagos), Nov 9\u201313 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Power & Energy Sector \u00b7 Aug 24\u201328 (Lagos), Nov 9\u201313 (Abuja)",
    "summary": "Tariff and Rate Setting Management For Utilities (Telecoms and Power Sectors): The Impact on Customers is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: Aug 24\u201328 (Lagos), Nov 9\u201313 (Abuja).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "Aug 24\u201328 (Lagos), Nov 9\u201313 (Abuja)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: Aug 24\u201328 (Lagos), Nov 9\u201313 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-81",
    "code": "GIBS-LOC-081",
    "num": 81,
    "slug": "course-81-best-practices-and-performance-management-for-strategic-impr",
    "title": "Best Practices and Performance Management for Strategic Improvements in the Power Sector (Electricity and Oil & Gas Industry)",
    "category": "Power & Energy Sector",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "June 8\u201312 (Abuja), Nov 16\u201320 (Ibafo)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Power & Energy Sector \u00b7 June 8\u201312 (Abuja), Nov 16\u201320 (Ibafo)",
    "summary": "Best Practices and Performance Management for Strategic Improvements in the Power Sector (Electricity and Oil & Gas Industry) is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: June 8\u201312 (Abuja), Nov 16\u201320 (Ibafo).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 8\u201312 (Abuja), Nov 16\u201320 (Ibafo)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 8\u201312 (Abuja), Nov 16\u201320 (Ibafo)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-82",
    "code": "GIBS-LOC-082",
    "num": 82,
    "slug": "course-82-corporate-governance-as-a-potent-corruption-prevention-and-m",
    "title": "Corporate Governance as a Potent Corruption Prevention and Mitigation Strategy in the Energy and Telecom Sectors",
    "category": "Power & Energy Sector",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "April 13\u201317 (Ilorin), Sept 21\u201325 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Power & Energy Sector \u00b7 April 13\u201317 (Ilorin), Sept 21\u201325 (Abuja)",
    "summary": "Corporate Governance as a Potent Corruption Prevention and Mitigation Strategy in the Energy and Telecom Sectors is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: April 13\u201317 (Ilorin), Sept 21\u201325 (Abuja).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "April 13\u201317 (Ilorin), Sept 21\u201325 (Abuja)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: April 13\u201317 (Ilorin), Sept 21\u201325 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-83",
    "code": "GIBS-LOC-083",
    "num": 83,
    "slug": "course-83-specialised-train-the-trainers-workshop-for-the-utility-mana",
    "title": "Specialised Train - The Trainers Workshop for the Utility Managers in all sectors of the Economy",
    "category": "Power & Energy Sector",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "June 15\u201319 (Abuja), Oct 12\u201316 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Power & Energy Sector \u00b7 June 15\u201319 (Abuja), Oct 12\u201316 (Ilorin)",
    "summary": "Specialised Train - The Trainers Workshop for the Utility Managers in all sectors of the Economy is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: June 15\u201319 (Abuja), Oct 12\u201316 (Ilorin).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 15\u201319 (Abuja), Oct 12\u201316 (Ilorin)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 15\u201319 (Abuja), Oct 12\u201316 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-84",
    "code": "GIBS-LOC-084",
    "num": 84,
    "slug": "course-84-effective-corporate-communication-for-the-telecom-oil-gas-an",
    "title": "Effective Corporate Communication For The Telecom, Oil & Gas, and Power & Energy Sectors",
    "category": "Power & Energy Sector",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "June 15\u201319 (Abuja), Nov 16\u201320 (Ibafo)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Power & Energy Sector \u00b7 June 15\u201319 (Abuja), Nov 16\u201320 (Ibafo)",
    "summary": "Effective Corporate Communication For The Telecom, Oil & Gas, and Power & Energy Sectors is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: June 15\u201319 (Abuja), Nov 16\u201320 (Ibafo).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 15\u201319 (Abuja), Nov 16\u201320 (Ibafo)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 15\u201319 (Abuja), Nov 16\u201320 (Ibafo)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-85",
    "code": "GIBS-LOC-085",
    "num": 85,
    "slug": "course-85-strategic-planning-for-the-protection-of-marine-environment",
    "title": "Strategic Planning for the Protection of Marine Environment: Prospects and Challenges",
    "category": "Maritime & Transportation",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "Aug 3\u20137 (Abuja), Oct 5\u20139 (Lagos & Ibafo)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Maritime & Transportation \u00b7 Aug 3\u20137 (Abuja), Oct 5\u20139 (Lagos & Ibafo)",
    "summary": "Strategic Planning for the Protection of Marine Environment: Prospects and Challenges is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: Aug 3\u20137 (Abuja), Oct 5\u20139 (Lagos & Ibafo).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "Aug 3\u20137 (Abuja), Oct 5\u20139 (Lagos & Ibafo)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: Aug 3\u20137 (Abuja), Oct 5\u20139 (Lagos & Ibafo)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-86",
    "code": "GIBS-LOC-086",
    "num": 86,
    "slug": "course-86-leadership-role-for-ports-managers-for-improved-productivity",
    "title": "Leadership Role for Ports Managers for Improved Productivity",
    "category": "Maritime & Transportation",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Top/Senior & Middle Level Mgt",
    "schedule": "June 1\u20135 (Ibafo), Oct 12\u201316 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Maritime & Transportation \u00b7 June 1\u20135 (Ibafo), Oct 12\u201316 (Abuja)",
    "summary": "Leadership Role for Ports Managers for Improved Productivity is an intensive 5 Days capacity-building programme designed for Top/Senior & Middle Level Mgt. Scheduled across GIBS training centres and regional hubs: June 1\u20135 (Ibafo), Oct 12\u201316 (Abuja).",
    "audience": [
      "Top/Senior & Middle Level Mgt",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 1\u20135 (Ibafo), Oct 12\u201316 (Abuja)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 1\u20135 (Ibafo), Oct 12\u201316 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-87",
    "code": "GIBS-LOC-087",
    "num": 87,
    "slug": "course-87-economic-importance-of-ports-to-national-development",
    "title": "Economic Importance of Ports to National Development",
    "category": "Maritime & Transportation",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Top/Senior & Middle Level Mgt",
    "schedule": "May 18\u201322 (Ibafo), Nov 2\u20136 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Maritime & Transportation \u00b7 May 18\u201322 (Ibafo), Nov 2\u20136 (Abuja)",
    "summary": "Economic Importance of Ports to National Development is an intensive 5 Days capacity-building programme designed for Top/Senior & Middle Level Mgt. Scheduled across GIBS training centres and regional hubs: May 18\u201322 (Ibafo), Nov 2\u20136 (Abuja).",
    "audience": [
      "Top/Senior & Middle Level Mgt",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 18\u201322 (Ibafo), Nov 2\u20136 (Abuja)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 18\u201322 (Ibafo), Nov 2\u20136 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-88",
    "code": "GIBS-LOC-088",
    "num": 88,
    "slug": "course-88-building-capacity-in-environmental-management-best-practices",
    "title": "Building Capacity in Environmental Management: Best Practices in the Maritime Industry \u2013 NPA, NIMASA, Shippers Council, etc.",
    "category": "Maritime & Transportation",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Top/Senior & Middle Level Mgt",
    "schedule": "June 15\u201319 (Ibafo), Aug 10\u201314 (Abuja), Oct 12\u201316 (Lagos & Ibafo)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Maritime & Transportation \u00b7 June 15\u201319 (Ibafo), Aug 10\u201314 (Abuja), Oct 12\u201316 (Lagos & Ibafo)",
    "summary": "Building Capacity in Environmental Management: Best Practices in the Maritime Industry \u2013 NPA, NIMASA, Shippers Council, etc. is an intensive 5 Days capacity-building programme designed for Top/Senior & Middle Level Mgt. Scheduled across GIBS training centres and regional hubs: June 15\u201319 (Ibafo), Aug 10\u201314 (Abuja), Oct 12\u201316 (Lagos & Ibafo).",
    "audience": [
      "Top/Senior & Middle Level Mgt",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 15\u201319 (Ibafo), Aug 10\u201314 (Abuja), Oct 12\u201316 (Lagos & Ibafo)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 15\u201319 (Ibafo), Aug 10\u201314 (Abuja), Oct 12\u201316 (Lagos & Ibafo)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-89",
    "code": "GIBS-LOC-089",
    "num": 89,
    "slug": "course-89-managing-infractions-at-the-seaports-for-improved-productivi",
    "title": "Managing Infractions at the Seaports For Improved Productivity",
    "category": "Maritime & Transportation",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Top/Senior & Middle Level Mgt",
    "schedule": "April 6\u201310 (Lagos), July 13\u201317 (Ilorin), Sept 14\u201318 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Maritime & Transportation \u00b7 April 6\u201310 (Lagos), July 13\u201317 (Ilorin), Sept 14\u201318 (Abuja)",
    "summary": "Managing Infractions at the Seaports For Improved Productivity is an intensive 5 Days capacity-building programme designed for Top/Senior & Middle Level Mgt. Scheduled across GIBS training centres and regional hubs: April 6\u201310 (Lagos), July 13\u201317 (Ilorin), Sept 14\u201318 (Abuja).",
    "audience": [
      "Top/Senior & Middle Level Mgt",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "April 6\u201310 (Lagos), July 13\u201317 (Ilorin), Sept 14\u201318 (Abuja)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: April 6\u201310 (Lagos), July 13\u201317 (Ilorin), Sept 14\u201318 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-90",
    "code": "GIBS-LOC-090",
    "num": 90,
    "slug": "course-90-revenue-generation-strategies-for-maritime-sector-players",
    "title": "Revenue Generation Strategies for Maritime Sector Players",
    "category": "Maritime & Transportation",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Top/Senior & Middle Level Mgt",
    "schedule": "May 11\u201315 (Abuja), July 13\u201317 (Lagos), Nov 16\u201320 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Maritime & Transportation \u00b7 May 11\u201315 (Abuja), July 13\u201317 (Lagos), Nov 16\u201320 (Ilorin)",
    "summary": "Revenue Generation Strategies for Maritime Sector Players is an intensive 5 Days capacity-building programme designed for Top/Senior & Middle Level Mgt. Scheduled across GIBS training centres and regional hubs: May 11\u201315 (Abuja), July 13\u201317 (Lagos), Nov 16\u201320 (Ilorin).",
    "audience": [
      "Top/Senior & Middle Level Mgt",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 11\u201315 (Abuja), July 13\u201317 (Lagos), Nov 16\u201320 (Ilorin)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 11\u201315 (Abuja), July 13\u201317 (Lagos), Nov 16\u201320 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-91",
    "code": "GIBS-LOC-091",
    "num": 91,
    "slug": "course-91-modern-strategies-for-managing-environmental-hazards-at-the",
    "title": "Modern Strategies For Managing Environmental Hazards At The Seaports",
    "category": "Maritime & Transportation",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Top/Senior & Middle Level Mgt",
    "schedule": "Aug 10\u201314 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Maritime & Transportation \u00b7 Aug 10\u201314 (Lagos)",
    "summary": "Modern Strategies For Managing Environmental Hazards At The Seaports is an intensive 5 Days capacity-building programme designed for Top/Senior & Middle Level Mgt. Scheduled across GIBS training centres and regional hubs: Aug 10\u201314 (Lagos).",
    "audience": [
      "Top/Senior & Middle Level Mgt",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "Aug 10\u201314 (Lagos)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: Aug 10\u201314 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-92",
    "code": "GIBS-LOC-092",
    "num": 92,
    "slug": "course-92-strategic-thinking-for-ensuring-compliance-of-employers-of-p",
    "title": "Strategic Thinking For Ensuring Compliance of Employers of Pensionable Workers for Service Delivery \u2013 PENCOM & PFAs, CPFAs",
    "category": "Pension Management",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "May 11\u201315 (Ilorin), Aug 10\u201314 (Abuja), Oct 19\u201323 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Pension Management \u00b7 May 11\u201315 (Ilorin), Aug 10\u201314 (Abuja), Oct 19\u201323 (Lagos)",
    "summary": "Strategic Thinking For Ensuring Compliance of Employers of Pensionable Workers for Service Delivery \u2013 PENCOM & PFAs, CPFAs is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: May 11\u201315 (Ilorin), Aug 10\u201314 (Abuja), Oct 19\u201323 (Lagos).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 11\u201315 (Ilorin), Aug 10\u201314 (Abuja), Oct 19\u201323 (Lagos)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 11\u201315 (Ilorin), Aug 10\u201314 (Abuja), Oct 19\u201323 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-93",
    "code": "GIBS-LOC-093",
    "num": 93,
    "slug": "course-93-critical-thinking-and-problem-solving-for-pension-managers-a",
    "title": "Critical Thinking and Problem Solving for Pension Managers and Regulators",
    "category": "Pension Management",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Top/Senior & Middle Level Mgt",
    "schedule": "June 8\u201312 (Ilorin), Oct 5\u20139 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Pension Management \u00b7 June 8\u201312 (Ilorin), Oct 5\u20139 (Abuja)",
    "summary": "Critical Thinking and Problem Solving for Pension Managers and Regulators is an intensive 5 Days capacity-building programme designed for Top/Senior & Middle Level Mgt. Scheduled across GIBS training centres and regional hubs: June 8\u201312 (Ilorin), Oct 5\u20139 (Abuja).",
    "audience": [
      "Top/Senior & Middle Level Mgt",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 8\u201312 (Ilorin), Oct 5\u20139 (Abuja)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 8\u201312 (Ilorin), Oct 5\u20139 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-94",
    "code": "GIBS-LOC-094",
    "num": 94,
    "slug": "course-94-effective-communication-and-capacity-building-for-pension-ad",
    "title": "Effective Communication and Capacity Building For Pension Administrators and Regulators",
    "category": "Pension Management",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Top/Senior & Middle Level Mgt",
    "schedule": "May 18\u201322 (Ilorin), Sept 14\u201318 (Lagos), Nov 9\u201313 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Pension Management \u00b7 May 18\u201322 (Ilorin), Sept 14\u201318 (Lagos), Nov 9\u201313 (Abuja)",
    "summary": "Effective Communication and Capacity Building For Pension Administrators and Regulators is an intensive 5 Days capacity-building programme designed for Top/Senior & Middle Level Mgt. Scheduled across GIBS training centres and regional hubs: May 18\u201322 (Ilorin), Sept 14\u201318 (Lagos), Nov 9\u201313 (Abuja).",
    "audience": [
      "Top/Senior & Middle Level Mgt",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 18\u201322 (Ilorin), Sept 14\u201318 (Lagos), Nov 9\u201313 (Abuja)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 18\u201322 (Ilorin), Sept 14\u201318 (Lagos), Nov 9\u201313 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-95",
    "code": "GIBS-LOC-095",
    "num": 95,
    "slug": "course-95-current-strategies-for-pension-administration-for-effective",
    "title": "Current Strategies For Pension Administration For Effective Service Delivery",
    "category": "Pension Management",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle Level Mgt Staff \u2013 ALL Depts.",
    "schedule": "May 11\u201315 (Abuja), July 20\u201324 (Lagos), Oct 19\u201323 (Keffi)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Pension Management \u00b7 May 11\u201315 (Abuja), July 20\u201324 (Lagos), Oct 19\u201323 (Keffi)",
    "summary": "Current Strategies For Pension Administration For Effective Service Delivery is an intensive 5 Days capacity-building programme designed for Senior & Middle Level Mgt Staff \u2013 ALL Depts.. Scheduled across GIBS training centres and regional hubs: May 11\u201315 (Abuja), July 20\u201324 (Lagos), Oct 19\u201323 (Keffi).",
    "audience": [
      "Senior & Middle Level Mgt Staff \u2013 ALL Depts.",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 11\u201315 (Abuja), July 20\u201324 (Lagos), Oct 19\u201323 (Keffi)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 11\u201315 (Abuja), July 20\u201324 (Lagos), Oct 19\u201323 (Keffi)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-96",
    "code": "GIBS-LOC-096",
    "num": 96,
    "slug": "course-96-strategies-for-effective-business-communication",
    "title": "Strategies for Effective Business Communication",
    "category": "Pension Management",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "All Staff",
    "schedule": "May 11\u201315 (Ilorin), Aug 17\u201321 (Abuja), Oct 12\u201316 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Pension Management \u00b7 May 11\u201315 (Ilorin), Aug 17\u201321 (Abuja), Oct 12\u201316 (Lagos)",
    "summary": "Strategies for Effective Business Communication is an intensive 5 Days capacity-building programme designed for All Staff. Scheduled across GIBS training centres and regional hubs: May 11\u201315 (Ilorin), Aug 17\u201321 (Abuja), Oct 12\u201316 (Lagos).",
    "audience": [
      "All Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 11\u201315 (Ilorin), Aug 17\u201321 (Abuja), Oct 12\u201316 (Lagos)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 11\u201315 (Ilorin), Aug 17\u201321 (Abuja), Oct 12\u201316 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-97",
    "code": "GIBS-LOC-097",
    "num": 97,
    "slug": "course-97-next-generation-challenges-opportunities-for-pension-adminis",
    "title": "Next Generation Challenges & Opportunities for Pension Administrators",
    "category": "Pension Management",
    "destination": "Local",
    "fee": 300000,
    "currency": "NGN",
    "targetAudience": "Senior & Middle level Mgt Staff",
    "schedule": "July 13\u201317 (Ilorin), Sept 14\u201318 (Abuja), Oct 19\u201323 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Pension Management \u00b7 July 13\u201317 (Ilorin), Sept 14\u201318 (Abuja), Oct 19\u201323 (Lagos)",
    "summary": "Next Generation Challenges & Opportunities for Pension Administrators is an intensive 5 Days capacity-building programme designed for Senior & Middle level Mgt Staff. Scheduled across GIBS training centres and regional hubs: July 13\u201317 (Ilorin), Sept 14\u201318 (Abuja), Oct 19\u201323 (Lagos).",
    "audience": [
      "Senior & Middle level Mgt Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 13\u201317 (Ilorin), Sept 14\u201318 (Abuja), Oct 19\u201323 (Lagos)",
    "fees": "\u20a6300,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 13\u201317 (Ilorin), Sept 14\u201318 (Abuja), Oct 19\u201323 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6300,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-98",
    "code": "GIBS-LOC-098",
    "num": 98,
    "slug": "course-98-regulatory-and-operational-strategies-for-pension-managers-a",
    "title": "Regulatory and Operational Strategies for Pension Managers and Executives",
    "category": "Pension Management",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Middle level and Senior Management Staff",
    "schedule": "May 11\u201315 (Ilorin), Aug 10\u201314 (Abuja), Oct 19\u201323 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Pension Management \u00b7 May 11\u201315 (Ilorin), Aug 10\u201314 (Abuja), Oct 19\u201323 (Lagos)",
    "summary": "Regulatory and Operational Strategies for Pension Managers and Executives is an intensive 5 Days capacity-building programme designed for Middle level and Senior Management Staff. Scheduled across GIBS training centres and regional hubs: May 11\u201315 (Ilorin), Aug 10\u201314 (Abuja), Oct 19\u201323 (Lagos).",
    "audience": [
      "Middle level and Senior Management Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 11\u201315 (Ilorin), Aug 10\u201314 (Abuja), Oct 19\u201323 (Lagos)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 11\u201315 (Ilorin), Aug 10\u201314 (Abuja), Oct 19\u201323 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-99",
    "code": "GIBS-LOC-099",
    "num": 99,
    "slug": "course-99-workshop-on-office-management-and-administrative-skills",
    "title": "Workshop on Office Management and Administrative Skills",
    "category": "Pension Management",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Middle and Senior Level Staff",
    "schedule": "July 13\u201317 (Abuja), Sept 7\u201311 (Ilorin), Nov 30\u2013Dec 4 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Pension Management \u00b7 July 13\u201317 (Abuja), Sept 7\u201311 (Ilorin), Nov 30\u2013Dec 4 (Lagos)",
    "summary": "Workshop on Office Management and Administrative Skills is an intensive 5 Days capacity-building programme designed for Middle and Senior Level Staff. Scheduled across GIBS training centres and regional hubs: July 13\u201317 (Abuja), Sept 7\u201311 (Ilorin), Nov 30\u2013Dec 4 (Lagos).",
    "audience": [
      "Middle and Senior Level Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 13\u201317 (Abuja), Sept 7\u201311 (Ilorin), Nov 30\u2013Dec 4 (Lagos)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 13\u201317 (Abuja), Sept 7\u201311 (Ilorin), Nov 30\u2013Dec 4 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-100",
    "code": "GIBS-LOC-100",
    "num": 100,
    "slug": "course-100-communication-presentations-and-public-relations-skills",
    "title": "Communication / Presentations and Public Relations Skills",
    "category": "Special Executive Training",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "Middle and Senior Level Staff",
    "schedule": "May 4\u20138 (Abuja), Aug 17\u201321 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Special Executive Training \u00b7 May 4\u20138 (Abuja), Aug 17\u201321 (Lagos)",
    "summary": "Communication / Presentations and Public Relations Skills is an intensive 5 Days capacity-building programme designed for Middle and Senior Level Staff. Scheduled across GIBS training centres and regional hubs: May 4\u20138 (Abuja), Aug 17\u201321 (Lagos).",
    "audience": [
      "Middle and Senior Level Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "May 4\u20138 (Abuja), Aug 17\u201321 (Lagos)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: May 4\u20138 (Abuja), Aug 17\u201321 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-101",
    "code": "GIBS-LOC-101",
    "num": 101,
    "slug": "course-101-advanced-public-speaking-and-presentation-skills",
    "title": "Advanced Public Speaking and Presentation Skills",
    "category": "Special Executive Training",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "Protocols, EAs & PAs",
    "schedule": "July 6\u201310 (Ilorin), Oct 12\u201316 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Special Executive Training \u00b7 July 6\u201310 (Ilorin), Oct 12\u201316 (Lagos)",
    "summary": "Advanced Public Speaking and Presentation Skills is an intensive 5 Days capacity-building programme designed for Protocols, EAs & PAs. Scheduled across GIBS training centres and regional hubs: July 6\u201310 (Ilorin), Oct 12\u201316 (Lagos).",
    "audience": [
      "Protocols, EAs & PAs",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 6\u201310 (Ilorin), Oct 12\u201316 (Lagos)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 6\u201310 (Ilorin), Oct 12\u201316 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-102",
    "code": "GIBS-LOC-102",
    "num": 102,
    "slug": "course-102-enhancing-office-etiquette-for-improved-productivity",
    "title": "Enhancing Office Etiquette For Improved Productivity",
    "category": "Special Executive Training",
    "destination": "Local",
    "fee": 390000,
    "currency": "NGN",
    "targetAudience": "All Staff",
    "schedule": "Aug 10\u201314 (Ilorin), Nov 23\u201327 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Special Executive Training \u00b7 Aug 10\u201314 (Ilorin), Nov 23\u201327 (Lagos)",
    "summary": "Enhancing Office Etiquette For Improved Productivity is an intensive 5 Days capacity-building programme designed for All Staff. Scheduled across GIBS training centres and regional hubs: Aug 10\u201314 (Ilorin), Nov 23\u201327 (Lagos).",
    "audience": [
      "All Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "Aug 10\u201314 (Ilorin), Nov 23\u201327 (Lagos)",
    "fees": "\u20a6390,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: Aug 10\u201314 (Ilorin), Nov 23\u201327 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6390,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-103",
    "code": "GIBS-LOC-103",
    "num": 103,
    "slug": "course-103-ethical-standards-and-organisational-development-in-the-publ",
    "title": "Ethical Standards and Organisational Development in the Public Service",
    "category": "Special Executive Training",
    "destination": "Local",
    "fee": 400000,
    "currency": "NGN",
    "targetAudience": "All Staff",
    "schedule": "Aug 24\u201328 (Abuja), Oct 12\u201316 (Ilorin), Nov 30\u2013Dec 4 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Special Executive Training \u00b7 Aug 24\u201328 (Abuja), Oct 12\u201316 (Ilorin), Nov 30\u2013Dec 4 (Lagos)",
    "summary": "Ethical Standards and Organisational Development in the Public Service is an intensive 5 Days capacity-building programme designed for All Staff. Scheduled across GIBS training centres and regional hubs: Aug 24\u201328 (Abuja), Oct 12\u201316 (Ilorin), Nov 30\u2013Dec 4 (Lagos).",
    "audience": [
      "All Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "Aug 24\u201328 (Abuja), Oct 12\u201316 (Ilorin), Nov 30\u2013Dec 4 (Lagos)",
    "fees": "\u20a6400,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: Aug 24\u201328 (Abuja), Oct 12\u201316 (Ilorin), Nov 30\u2013Dec 4 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6400,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-104",
    "code": "GIBS-LOC-104",
    "num": 104,
    "slug": "course-104-next-generation-digital-strategies-and-ict-applications",
    "title": "Next Generation Digital Strategies and ICT Applications",
    "category": "Special Executive Training",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "All Staff",
    "schedule": "July 6\u201310 (Ilorin), Aug 24\u201328 (Abuja), Oct 12\u201316 (Ilorin), Nov 30\u2013Dec 4 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Special Executive Training \u00b7 July 6\u201310 (Ilorin), Aug 24\u201328 (Abuja), Oct 12\u201316 (Ilorin), Nov 30\u2013Dec 4 (Lagos)",
    "summary": "Next Generation Digital Strategies and ICT Applications is an intensive 5 Days capacity-building programme designed for All Staff. Scheduled across GIBS training centres and regional hubs: July 6\u201310 (Ilorin), Aug 24\u201328 (Abuja), Oct 12\u201316 (Ilorin), Nov 30\u2013Dec 4 (Lagos).",
    "audience": [
      "All Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 6\u201310 (Ilorin), Aug 24\u201328 (Abuja), Oct 12\u201316 (Ilorin), Nov 30\u2013Dec 4 (Lagos)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 6\u201310 (Ilorin), Aug 24\u201328 (Abuja), Oct 12\u201316 (Ilorin), Nov 30\u2013Dec 4 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-105",
    "code": "GIBS-LOC-105",
    "num": 105,
    "slug": "course-105-project-management-essentials-prospects-and-challenges",
    "title": "Project Management Essentials: Prospects and Challenges",
    "category": "Special Executive Training",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "All Staff",
    "schedule": "July 6\u201310 (Ilorin), Sept 21\u201325 (Abuja), Oct 12\u201316 (Lagos), Dec 7\u201311 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Special Executive Training \u00b7 July 6\u201310 (Ilorin), Sept 21\u201325 (Abuja), Oct 12\u201316 (Lagos), Dec 7\u201311 (Ilorin)",
    "summary": "Project Management Essentials: Prospects and Challenges is an intensive 5 Days capacity-building programme designed for All Staff. Scheduled across GIBS training centres and regional hubs: July 6\u201310 (Ilorin), Sept 21\u201325 (Abuja), Oct 12\u201316 (Lagos), Dec 7\u201311 (Ilorin).",
    "audience": [
      "All Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 6\u201310 (Ilorin), Sept 21\u201325 (Abuja), Oct 12\u201316 (Lagos), Dec 7\u201311 (Ilorin)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 6\u201310 (Ilorin), Sept 21\u201325 (Abuja), Oct 12\u201316 (Lagos), Dec 7\u201311 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-106",
    "code": "GIBS-LOC-106",
    "num": 106,
    "slug": "course-106-monitoring-and-impact-evaluation-workshop",
    "title": "Monitoring and Impact Evaluation Workshop",
    "category": "Special Executive Training",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "All Staff",
    "schedule": "Aug 24\u201328 (Abuja), Oct 12\u201316 (Ilorin), Nov 30\u2013Dec 4 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Special Executive Training \u00b7 Aug 24\u201328 (Abuja), Oct 12\u201316 (Ilorin), Nov 30\u2013Dec 4 (Lagos)",
    "summary": "Monitoring and Impact Evaluation Workshop is an intensive 5 Days capacity-building programme designed for All Staff. Scheduled across GIBS training centres and regional hubs: Aug 24\u201328 (Abuja), Oct 12\u201316 (Ilorin), Nov 30\u2013Dec 4 (Lagos).",
    "audience": [
      "All Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "Aug 24\u201328 (Abuja), Oct 12\u201316 (Ilorin), Nov 30\u2013Dec 4 (Lagos)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: Aug 24\u201328 (Abuja), Oct 12\u201316 (Ilorin), Nov 30\u2013Dec 4 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-107",
    "code": "GIBS-LOC-107",
    "num": 107,
    "slug": "course-107-procurement-and-vendor-management-skills-workshop",
    "title": "Procurement and Vendor Management Skills Workshop",
    "category": "Special Executive Training",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Relevant Staff",
    "schedule": "June 15\u201319 (Abuja), Sept 14\u201318 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Special Executive Training \u00b7 June 15\u201319 (Abuja), Sept 14\u201318 (Ilorin)",
    "summary": "Procurement and Vendor Management Skills Workshop is an intensive 5 Days capacity-building programme designed for Relevant Staff. Scheduled across GIBS training centres and regional hubs: June 15\u201319 (Abuja), Sept 14\u201318 (Ilorin).",
    "audience": [
      "Relevant Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 15\u201319 (Abuja), Sept 14\u201318 (Ilorin)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 15\u201319 (Abuja), Sept 14\u201318 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-108",
    "code": "GIBS-LOC-108",
    "num": 108,
    "slug": "course-108-resolving-contractual-claims-and-disputes",
    "title": "Resolving Contractual Claims and Disputes",
    "category": "Special Executive Training",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Relevant Staff",
    "schedule": "June 15\u201319 (Abuja), Sept 14\u201318 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Special Executive Training \u00b7 June 15\u201319 (Abuja), Sept 14\u201318 (Ilorin)",
    "summary": "Resolving Contractual Claims and Disputes is an intensive 5 Days capacity-building programme designed for Relevant Staff. Scheduled across GIBS training centres and regional hubs: June 15\u201319 (Abuja), Sept 14\u201318 (Ilorin).",
    "audience": [
      "Relevant Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 15\u201319 (Abuja), Sept 14\u201318 (Ilorin)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 15\u201319 (Abuja), Sept 14\u201318 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-109",
    "code": "GIBS-LOC-109",
    "num": 109,
    "slug": "course-109-basic-data-analytics-for-business-and-financial-analysts",
    "title": "Basic Data Analytics for Business and Financial Analysts",
    "category": "Special Executive Training",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "Relevant Staff",
    "schedule": "July 27\u201331 (Abuja), Oct 19\u201323 (Lagos), Dec 7\u201311 (Abuja)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Special Executive Training \u00b7 July 27\u201331 (Abuja), Oct 19\u201323 (Lagos), Dec 7\u201311 (Abuja)",
    "summary": "Basic Data Analytics for Business and Financial Analysts is an intensive 5 Days capacity-building programme designed for Relevant Staff. Scheduled across GIBS training centres and regional hubs: July 27\u201331 (Abuja), Oct 19\u201323 (Lagos), Dec 7\u201311 (Abuja).",
    "audience": [
      "Relevant Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 27\u201331 (Abuja), Oct 19\u201323 (Lagos), Dec 7\u201311 (Abuja)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 27\u201331 (Abuja), Oct 19\u201323 (Lagos), Dec 7\u201311 (Abuja)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-110",
    "code": "GIBS-LOC-110",
    "num": 110,
    "slug": "course-110-software-disaster-and-contingency-planning-workshop",
    "title": "Software Disaster and Contingency Planning Workshop",
    "category": "Special Executive Training",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "All Staff",
    "schedule": "Nov 30\u2013Dec 4 (Keffi), Dec 7\u201311 (Abuja & Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Special Executive Training \u00b7 Nov 30\u2013Dec 4 (Keffi), Dec 7\u201311 (Abuja & Lagos)",
    "summary": "Software Disaster and Contingency Planning Workshop is an intensive 5 Days capacity-building programme designed for All Staff. Scheduled across GIBS training centres and regional hubs: Nov 30\u2013Dec 4 (Keffi), Dec 7\u201311 (Abuja & Lagos).",
    "audience": [
      "All Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "Nov 30\u2013Dec 4 (Keffi), Dec 7\u201311 (Abuja & Lagos)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: Nov 30\u2013Dec 4 (Keffi), Dec 7\u201311 (Abuja & Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-111",
    "code": "GIBS-LOC-111",
    "num": 111,
    "slug": "course-111-organizational-design-development",
    "title": "Organizational Design & Development",
    "category": "Special Executive Training",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "All Staff",
    "schedule": "July 13\u201317 (Abuja), Oct 12\u201316 (Lagos), Nov 2\u20136 (Keffi), Dec 7\u201311 (Ilorin)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Special Executive Training \u00b7 July 13\u201317 (Abuja), Oct 12\u201316 (Lagos), Nov 2\u20136 (Keffi), Dec 7\u201311 (Ilorin)",
    "summary": "Organizational Design & Development is an intensive 5 Days capacity-building programme designed for All Staff. Scheduled across GIBS training centres and regional hubs: July 13\u201317 (Abuja), Oct 12\u201316 (Lagos), Nov 2\u20136 (Keffi), Dec 7\u201311 (Ilorin).",
    "audience": [
      "All Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "July 13\u201317 (Abuja), Oct 12\u201316 (Lagos), Nov 2\u20136 (Keffi), Dec 7\u201311 (Ilorin)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: July 13\u201317 (Abuja), Oct 12\u201316 (Lagos), Nov 2\u20136 (Keffi), Dec 7\u201311 (Ilorin)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-112",
    "code": "GIBS-LOC-112",
    "num": 112,
    "slug": "course-112-delivering-value-through-people-in-the-public-and-private-se",
    "title": "Delivering Value through People in the Public and Private Sectors",
    "category": "Special Executive Training",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "All Staff",
    "schedule": "June 22\u201326 (Abuja), Sept 7\u201311 (Lagos), Nov 9\u201313 (Ilorin), Dec 7\u201311 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Special Executive Training \u00b7 June 22\u201326 (Abuja), Sept 7\u201311 (Lagos), Nov 9\u201313 (Ilorin), Dec 7\u201311 (Lagos)",
    "summary": "Delivering Value through People in the Public and Private Sectors is an intensive 5 Days capacity-building programme designed for All Staff. Scheduled across GIBS training centres and regional hubs: June 22\u201326 (Abuja), Sept 7\u201311 (Lagos), Nov 9\u201313 (Ilorin), Dec 7\u201311 (Lagos).",
    "audience": [
      "All Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 22\u201326 (Abuja), Sept 7\u201311 (Lagos), Nov 9\u201313 (Ilorin), Dec 7\u201311 (Lagos)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 22\u201326 (Abuja), Sept 7\u201311 (Lagos), Nov 9\u201313 (Ilorin), Dec 7\u201311 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "loc-113",
    "code": "GIBS-LOC-113",
    "num": 113,
    "slug": "course-113-introductory-data-analytics-for-pension-administrators",
    "title": "Introductory Data Analytics for Pension Administrators",
    "category": "Special Executive Training",
    "destination": "Local",
    "fee": 450000,
    "currency": "NGN",
    "targetAudience": "All Staff",
    "schedule": "June 15\u201319 (Abuja), Sept 14\u201318 (Ilorin), Nov 16\u201320 (Abuja), Dec 7\u201311 (Lagos)",
    "duration": "5 Days",
    "inPlantAvailable": true,
    "tagline": "Special Executive Training \u00b7 June 15\u201319 (Abuja), Sept 14\u201318 (Ilorin), Nov 16\u201320 (Abuja), Dec 7\u201311 (Lagos)",
    "summary": "Introductory Data Analytics for Pension Administrators is an intensive 5 Days capacity-building programme designed for All Staff. Scheduled across GIBS training centres and regional hubs: June 15\u201319 (Abuja), Sept 14\u201318 (Ilorin), Nov 16\u201320 (Abuja), Dec 7\u201311 (Lagos).",
    "audience": [
      "All Staff",
      "In-plant and customized delivery available on institutional request"
    ],
    "indicativeStructure": [
      "Modular coursework and applied workshop sessions (5 Days)",
      "Institutional case analysis and best practice frameworks",
      "Interactive policy and practical execution exercises",
      "Action plan and performance improvement strategies"
    ],
    "outcomes": [
      "Upgraded technical and strategic competencies in modern public and private sector operations",
      "Immediate practical toolkit ready for deployment in participant's organization",
      "Executive certification from Goshen International Business School (GIBS)"
    ],
    "format": "Classroom Workshop & Interactive Seminar (5 Days) / In-Plant Option Available",
    "startDate": "June 15\u201319 (Abuja), Sept 14\u201318 (Ilorin), Nov 16\u201320 (Abuja), Dec 7\u201311 (Lagos)",
    "fees": "\u20a6450,000",
    "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
    "faqs": [
      {
        "q": "Where and when is this programme held?",
        "a": "The scheduled 2026 calendar sessions are: June 15\u201319 (Abuja), Sept 14\u201318 (Ilorin), Nov 16\u201320 (Abuja), Dec 7\u201311 (Lagos)."
      },
      {
        "q": "Can this programme be delivered in-plant for our organization?",
        "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
      },
      {
        "q": "What is included in the course fee?",
        "a": "The programme fee of \u20a6450,000 covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "int-kigali-1",
    "code": "GIBS-INT-KIG-01",
    "num": 114,
    "slug": "foreign-kigali-1-managing-service-quality-and-customer-satisfaction-in-the-pu",
    "title": "Managing Service Quality and Customer Satisfaction in the Public and Private Sector",
    "category": "Foreign Executive Training",
    "destination": "Kigali",
    "fee": 4800,
    "feeSecondary": null,
    "feeNotes": null,
    "currency": "USD",
    "targetAudience": "Middle/Senior Management",
    "schedule": "Aug 3\u20137, Nov 9\u201313 (Kigali)",
    "duration": "1 Week",
    "inPlantAvailable": false,
    "tagline": "Foreign Executive Training \u00b7 Kigali (Aug 3\u20137, Nov 9\u201313)",
    "summary": "Managing Service Quality and Customer Satisfaction in the Public and Private Sector is an executive international study programme delivered at the GIBS Kigali overseas training hub for Middle/Senior Management. Dates: Aug 3\u20137, Nov 9\u201313.",
    "audience": [
      "Middle/Senior Management",
      "Executives seeking global perspective and international exposure in Kigali"
    ],
    "indicativeStructure": [
      "International executive seminars and masterclasses in Kigali",
      "Comparative global policy and regulatory case studies",
      "Peer exchange and institutional benchmarking sessions",
      "Applied action learning project for domestic implementation"
    ],
    "outcomes": [
      "Advanced global leadership perspective and international institutional benchmarking",
      "Direct insights from international best practices and cross-border regulatory frameworks",
      "GIBS International Executive Programme Certification"
    ],
    "format": "Overseas Executive Immersion & Seminar in Kigali (1 Week)",
    "startDate": "Aug 3\u20137, Nov 9\u201313 (Kigali)",
    "fees": "$4,800 USD",
    "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
    "faqs": [
      {
        "q": "When and where does the Kigali programme take place?",
        "a": "The programme takes place in Kigali on the confirmed dates: Aug 3\u20137, Nov 9\u201313."
      },
      {
        "q": "What currency is the tuition charged in?",
        "a": "The tuition for Kigali programmes is $4,800 USD."
      },
      {
        "q": "Does GIBS provide visa support and logistics guidance?",
        "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "int-kigali-2",
    "code": "GIBS-INT-KIG-02",
    "num": 115,
    "slug": "foreign-kigali-2-capacity-building-workshop-on-ict-literacy-and-security-awar",
    "title": "Capacity Building Workshop on ICT Literacy and Security Awareness",
    "category": "Foreign Executive Training",
    "destination": "Kigali",
    "fee": 4800,
    "feeSecondary": null,
    "feeNotes": null,
    "currency": "USD",
    "targetAudience": "All Staff",
    "schedule": "June 22\u201326, Oct 12\u201316 (Kigali)",
    "duration": "1 Week",
    "inPlantAvailable": false,
    "tagline": "Foreign Executive Training \u00b7 Kigali (June 22\u201326, Oct 12\u201316)",
    "summary": "Capacity Building Workshop on ICT Literacy and Security Awareness is an executive international study programme delivered at the GIBS Kigali overseas training hub for All Staff. Dates: June 22\u201326, Oct 12\u201316.",
    "audience": [
      "All Staff",
      "Executives seeking global perspective and international exposure in Kigali"
    ],
    "indicativeStructure": [
      "International executive seminars and masterclasses in Kigali",
      "Comparative global policy and regulatory case studies",
      "Peer exchange and institutional benchmarking sessions",
      "Applied action learning project for domestic implementation"
    ],
    "outcomes": [
      "Advanced global leadership perspective and international institutional benchmarking",
      "Direct insights from international best practices and cross-border regulatory frameworks",
      "GIBS International Executive Programme Certification"
    ],
    "format": "Overseas Executive Immersion & Seminar in Kigali (1 Week)",
    "startDate": "June 22\u201326, Oct 12\u201316 (Kigali)",
    "fees": "$4,800 USD",
    "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
    "faqs": [
      {
        "q": "When and where does the Kigali programme take place?",
        "a": "The programme takes place in Kigali on the confirmed dates: June 22\u201326, Oct 12\u201316."
      },
      {
        "q": "What currency is the tuition charged in?",
        "a": "The tuition for Kigali programmes is $4,800 USD."
      },
      {
        "q": "Does GIBS provide visa support and logistics guidance?",
        "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "int-kigali-3",
    "code": "GIBS-INT-KIG-03",
    "num": 116,
    "slug": "foreign-kigali-3-business-process-management-strategies-in-public-and-private",
    "title": "Business Process Management Strategies in Public and Private Sectors",
    "category": "Foreign Executive Training",
    "destination": "Kigali",
    "fee": 4800,
    "feeSecondary": null,
    "feeNotes": null,
    "currency": "USD",
    "targetAudience": "Middle/Senior Management",
    "schedule": "Sept 7\u201311 (Kigali)",
    "duration": "1 Week",
    "inPlantAvailable": false,
    "tagline": "Foreign Executive Training \u00b7 Kigali (Sept 7\u201311)",
    "summary": "Business Process Management Strategies in Public and Private Sectors is an executive international study programme delivered at the GIBS Kigali overseas training hub for Middle/Senior Management. Dates: Sept 7\u201311.",
    "audience": [
      "Middle/Senior Management",
      "Executives seeking global perspective and international exposure in Kigali"
    ],
    "indicativeStructure": [
      "International executive seminars and masterclasses in Kigali",
      "Comparative global policy and regulatory case studies",
      "Peer exchange and institutional benchmarking sessions",
      "Applied action learning project for domestic implementation"
    ],
    "outcomes": [
      "Advanced global leadership perspective and international institutional benchmarking",
      "Direct insights from international best practices and cross-border regulatory frameworks",
      "GIBS International Executive Programme Certification"
    ],
    "format": "Overseas Executive Immersion & Seminar in Kigali (1 Week)",
    "startDate": "Sept 7\u201311 (Kigali)",
    "fees": "$4,800 USD",
    "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
    "faqs": [
      {
        "q": "When and where does the Kigali programme take place?",
        "a": "The programme takes place in Kigali on the confirmed dates: Sept 7\u201311."
      },
      {
        "q": "What currency is the tuition charged in?",
        "a": "The tuition for Kigali programmes is $4,800 USD."
      },
      {
        "q": "Does GIBS provide visa support and logistics guidance?",
        "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "int-kigali-4",
    "code": "GIBS-INT-KIG-04",
    "num": 117,
    "slug": "foreign-kigali-4-ethical-standards-and-organisational-development-in-the-publ",
    "title": "Ethical Standards and Organisational Development in the Public Service and the Private Sector",
    "category": "Foreign Executive Training",
    "destination": "Kigali",
    "fee": 4800,
    "feeSecondary": null,
    "feeNotes": null,
    "currency": "USD",
    "targetAudience": "Middle/Senior Management",
    "schedule": "Aug 10\u201314, Nov 30\u2013Dec 4 (Kigali)",
    "duration": "1 Week",
    "inPlantAvailable": false,
    "tagline": "Foreign Executive Training \u00b7 Kigali (Aug 10\u201314, Nov 30\u2013Dec 4)",
    "summary": "Ethical Standards and Organisational Development in the Public Service and the Private Sector is an executive international study programme delivered at the GIBS Kigali overseas training hub for Middle/Senior Management. Dates: Aug 10\u201314, Nov 30\u2013Dec 4.",
    "audience": [
      "Middle/Senior Management",
      "Executives seeking global perspective and international exposure in Kigali"
    ],
    "indicativeStructure": [
      "International executive seminars and masterclasses in Kigali",
      "Comparative global policy and regulatory case studies",
      "Peer exchange and institutional benchmarking sessions",
      "Applied action learning project for domestic implementation"
    ],
    "outcomes": [
      "Advanced global leadership perspective and international institutional benchmarking",
      "Direct insights from international best practices and cross-border regulatory frameworks",
      "GIBS International Executive Programme Certification"
    ],
    "format": "Overseas Executive Immersion & Seminar in Kigali (1 Week)",
    "startDate": "Aug 10\u201314, Nov 30\u2013Dec 4 (Kigali)",
    "fees": "$4,800 USD",
    "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
    "faqs": [
      {
        "q": "When and where does the Kigali programme take place?",
        "a": "The programme takes place in Kigali on the confirmed dates: Aug 10\u201314, Nov 30\u2013Dec 4."
      },
      {
        "q": "What currency is the tuition charged in?",
        "a": "The tuition for Kigali programmes is $4,800 USD."
      },
      {
        "q": "Does GIBS provide visa support and logistics guidance?",
        "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "int-kigali-5",
    "code": "GIBS-INT-KIG-05",
    "num": 118,
    "slug": "foreign-kigali-5-customer-relationship-management-and-retention",
    "title": "Customer Relationship Management and Retention",
    "category": "Foreign Executive Training",
    "destination": "Kigali",
    "fee": 4800,
    "feeSecondary": null,
    "feeNotes": null,
    "currency": "USD",
    "targetAudience": "All Staff",
    "schedule": "Aug 10\u201314, Oct 20\u201324 (Kigali)",
    "duration": "1 Week",
    "inPlantAvailable": false,
    "tagline": "Foreign Executive Training \u00b7 Kigali (Aug 10\u201314, Oct 20\u201324)",
    "summary": "Customer Relationship Management and Retention is an executive international study programme delivered at the GIBS Kigali overseas training hub for All Staff. Dates: Aug 10\u201314, Oct 20\u201324.",
    "audience": [
      "All Staff",
      "Executives seeking global perspective and international exposure in Kigali"
    ],
    "indicativeStructure": [
      "International executive seminars and masterclasses in Kigali",
      "Comparative global policy and regulatory case studies",
      "Peer exchange and institutional benchmarking sessions",
      "Applied action learning project for domestic implementation"
    ],
    "outcomes": [
      "Advanced global leadership perspective and international institutional benchmarking",
      "Direct insights from international best practices and cross-border regulatory frameworks",
      "GIBS International Executive Programme Certification"
    ],
    "format": "Overseas Executive Immersion & Seminar in Kigali (1 Week)",
    "startDate": "Aug 10\u201314, Oct 20\u201324 (Kigali)",
    "fees": "$4,800 USD",
    "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
    "faqs": [
      {
        "q": "When and where does the Kigali programme take place?",
        "a": "The programme takes place in Kigali on the confirmed dates: Aug 10\u201314, Oct 20\u201324."
      },
      {
        "q": "What currency is the tuition charged in?",
        "a": "The tuition for Kigali programmes is $4,800 USD."
      },
      {
        "q": "Does GIBS provide visa support and logistics guidance?",
        "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "int-kigali-6",
    "code": "GIBS-INT-KIG-06",
    "num": 119,
    "slug": "foreign-kigali-6-regulatory-compliance-monitoring-and-enforcement-in-telecom",
    "title": "Regulatory Compliance Monitoring and Enforcement in Telecom, Power, Pension and Basic Sectors of the Economy",
    "category": "Foreign Executive Training",
    "destination": "Kigali",
    "fee": 4800,
    "feeSecondary": null,
    "feeNotes": null,
    "currency": "USD",
    "targetAudience": "All Staff",
    "schedule": "Aug 25\u201329, Oct 19\u201323, Nov 23\u201327 (Kigali)",
    "duration": "1 Week",
    "inPlantAvailable": false,
    "tagline": "Foreign Executive Training \u00b7 Kigali (Aug 25\u201329, Oct 19\u201323, Nov 23\u201327)",
    "summary": "Regulatory Compliance Monitoring and Enforcement in Telecom, Power, Pension and Basic Sectors of the Economy is an executive international study programme delivered at the GIBS Kigali overseas training hub for All Staff. Dates: Aug 25\u201329, Oct 19\u201323, Nov 23\u201327.",
    "audience": [
      "All Staff",
      "Executives seeking global perspective and international exposure in Kigali"
    ],
    "indicativeStructure": [
      "International executive seminars and masterclasses in Kigali",
      "Comparative global policy and regulatory case studies",
      "Peer exchange and institutional benchmarking sessions",
      "Applied action learning project for domestic implementation"
    ],
    "outcomes": [
      "Advanced global leadership perspective and international institutional benchmarking",
      "Direct insights from international best practices and cross-border regulatory frameworks",
      "GIBS International Executive Programme Certification"
    ],
    "format": "Overseas Executive Immersion & Seminar in Kigali (1 Week)",
    "startDate": "Aug 25\u201329, Oct 19\u201323, Nov 23\u201327 (Kigali)",
    "fees": "$4,800 USD",
    "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
    "faqs": [
      {
        "q": "When and where does the Kigali programme take place?",
        "a": "The programme takes place in Kigali on the confirmed dates: Aug 25\u201329, Oct 19\u201323, Nov 23\u201327."
      },
      {
        "q": "What currency is the tuition charged in?",
        "a": "The tuition for Kigali programmes is $4,800 USD."
      },
      {
        "q": "Does GIBS provide visa support and logistics guidance?",
        "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "int-kigali-7",
    "code": "GIBS-INT-KIG-07",
    "num": 120,
    "slug": "foreign-kigali-7-next-generation-digital-strategies-and-ict-applications-for",
    "title": "Next Generation Digital Strategies and ICT Applications for Improved Productivity in the Work Place",
    "category": "Foreign Executive Training",
    "destination": "Kigali",
    "fee": 4800,
    "feeSecondary": null,
    "feeNotes": null,
    "currency": "USD",
    "targetAudience": "All Staff",
    "schedule": "Aug 24\u201328, Nov 16\u201320 (Kigali)",
    "duration": "1 Week",
    "inPlantAvailable": false,
    "tagline": "Foreign Executive Training \u00b7 Kigali (Aug 24\u201328, Nov 16\u201320)",
    "summary": "Next Generation Digital Strategies and ICT Applications for Improved Productivity in the Work Place is an executive international study programme delivered at the GIBS Kigali overseas training hub for All Staff. Dates: Aug 24\u201328, Nov 16\u201320.",
    "audience": [
      "All Staff",
      "Executives seeking global perspective and international exposure in Kigali"
    ],
    "indicativeStructure": [
      "International executive seminars and masterclasses in Kigali",
      "Comparative global policy and regulatory case studies",
      "Peer exchange and institutional benchmarking sessions",
      "Applied action learning project for domestic implementation"
    ],
    "outcomes": [
      "Advanced global leadership perspective and international institutional benchmarking",
      "Direct insights from international best practices and cross-border regulatory frameworks",
      "GIBS International Executive Programme Certification"
    ],
    "format": "Overseas Executive Immersion & Seminar in Kigali (1 Week)",
    "startDate": "Aug 24\u201328, Nov 16\u201320 (Kigali)",
    "fees": "$4,800 USD",
    "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
    "faqs": [
      {
        "q": "When and where does the Kigali programme take place?",
        "a": "The programme takes place in Kigali on the confirmed dates: Aug 24\u201328, Nov 16\u201320."
      },
      {
        "q": "What currency is the tuition charged in?",
        "a": "The tuition for Kigali programmes is $4,800 USD."
      },
      {
        "q": "Does GIBS provide visa support and logistics guidance?",
        "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "int-kigali-8",
    "code": "GIBS-INT-KIG-08",
    "num": 121,
    "slug": "foreign-kigali-8-regulatory-and-operational-strategies-for-utility-managers-a",
    "title": "Regulatory and Operational Strategies for Utility Managers and Regulators",
    "category": "Foreign Executive Training",
    "destination": "Kigali",
    "fee": 4800,
    "feeSecondary": null,
    "feeNotes": null,
    "currency": "USD",
    "targetAudience": "All Staff",
    "schedule": "July 20\u201324, Oct 5\u20139 (Kigali)",
    "duration": "1 Week",
    "inPlantAvailable": false,
    "tagline": "Foreign Executive Training \u00b7 Kigali (July 20\u201324, Oct 5\u20139)",
    "summary": "Regulatory and Operational Strategies for Utility Managers and Regulators is an executive international study programme delivered at the GIBS Kigali overseas training hub for All Staff. Dates: July 20\u201324, Oct 5\u20139.",
    "audience": [
      "All Staff",
      "Executives seeking global perspective and international exposure in Kigali"
    ],
    "indicativeStructure": [
      "International executive seminars and masterclasses in Kigali",
      "Comparative global policy and regulatory case studies",
      "Peer exchange and institutional benchmarking sessions",
      "Applied action learning project for domestic implementation"
    ],
    "outcomes": [
      "Advanced global leadership perspective and international institutional benchmarking",
      "Direct insights from international best practices and cross-border regulatory frameworks",
      "GIBS International Executive Programme Certification"
    ],
    "format": "Overseas Executive Immersion & Seminar in Kigali (1 Week)",
    "startDate": "July 20\u201324, Oct 5\u20139 (Kigali)",
    "fees": "$4,800 USD",
    "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
    "faqs": [
      {
        "q": "When and where does the Kigali programme take place?",
        "a": "The programme takes place in Kigali on the confirmed dates: July 20\u201324, Oct 5\u20139."
      },
      {
        "q": "What currency is the tuition charged in?",
        "a": "The tuition for Kigali programmes is $4,800 USD."
      },
      {
        "q": "Does GIBS provide visa support and logistics guidance?",
        "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "int-dubai-1",
    "code": "GIBS-INT-DUB-01",
    "num": 122,
    "slug": "foreign-dubai-1-developing-management-skills-for-administrators-sas-pas-and",
    "title": "Developing Management Skills For Administrators, SAs, PAs and Secretaries",
    "category": "Foreign Executive Training",
    "destination": "Dubai",
    "fee": 4800,
    "feeSecondary": null,
    "feeNotes": null,
    "currency": "USD",
    "targetAudience": "Middle/Senior Management",
    "schedule": "July 20\u201324, Nov 16\u201320 (Dubai)",
    "duration": "1 Week",
    "inPlantAvailable": false,
    "tagline": "Foreign Executive Training \u00b7 Dubai (July 20\u201324, Nov 16\u201320)",
    "summary": "Developing Management Skills For Administrators, SAs, PAs and Secretaries is an executive international study programme delivered at the GIBS Dubai overseas training hub for Middle/Senior Management. Dates: July 20\u201324, Nov 16\u201320.",
    "audience": [
      "Middle/Senior Management",
      "Executives seeking global perspective and international exposure in Dubai"
    ],
    "indicativeStructure": [
      "International executive seminars and masterclasses in Dubai",
      "Comparative global policy and regulatory case studies",
      "Peer exchange and institutional benchmarking sessions",
      "Applied action learning project for domestic implementation"
    ],
    "outcomes": [
      "Advanced global leadership perspective and international institutional benchmarking",
      "Direct insights from international best practices and cross-border regulatory frameworks",
      "GIBS International Executive Programme Certification"
    ],
    "format": "Overseas Executive Immersion & Seminar in Dubai (1 Week)",
    "startDate": "July 20\u201324, Nov 16\u201320 (Dubai)",
    "fees": "$4,800 USD",
    "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
    "faqs": [
      {
        "q": "When and where does the Dubai programme take place?",
        "a": "The programme takes place in Dubai on the confirmed dates: July 20\u201324, Nov 16\u201320."
      },
      {
        "q": "What currency is the tuition charged in?",
        "a": "The tuition for Dubai programmes is $4,800 USD."
      },
      {
        "q": "Does GIBS provide visa support and logistics guidance?",
        "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "int-dubai-2",
    "code": "GIBS-INT-DUB-02",
    "num": 123,
    "slug": "foreign-dubai-2-modern-secretarial-administration-techniques-in-the-computer",
    "title": "Modern Secretarial Administration Techniques in the Computerisation Era",
    "category": "Foreign Executive Training",
    "destination": "Dubai",
    "fee": 4800,
    "feeSecondary": null,
    "feeNotes": null,
    "currency": "USD",
    "targetAudience": "Secretaries, PAs, EAs",
    "schedule": "July 20\u201324, Nov 16\u201320 (Dubai)",
    "duration": "1 Week",
    "inPlantAvailable": false,
    "tagline": "Foreign Executive Training \u00b7 Dubai (July 20\u201324, Nov 16\u201320)",
    "summary": "Modern Secretarial Administration Techniques in the Computerisation Era is an executive international study programme delivered at the GIBS Dubai overseas training hub for Secretaries, PAs, EAs. Dates: July 20\u201324, Nov 16\u201320.",
    "audience": [
      "Secretaries, PAs, EAs",
      "Executives seeking global perspective and international exposure in Dubai"
    ],
    "indicativeStructure": [
      "International executive seminars and masterclasses in Dubai",
      "Comparative global policy and regulatory case studies",
      "Peer exchange and institutional benchmarking sessions",
      "Applied action learning project for domestic implementation"
    ],
    "outcomes": [
      "Advanced global leadership perspective and international institutional benchmarking",
      "Direct insights from international best practices and cross-border regulatory frameworks",
      "GIBS International Executive Programme Certification"
    ],
    "format": "Overseas Executive Immersion & Seminar in Dubai (1 Week)",
    "startDate": "July 20\u201324, Nov 16\u201320 (Dubai)",
    "fees": "$4,800 USD",
    "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
    "faqs": [
      {
        "q": "When and where does the Dubai programme take place?",
        "a": "The programme takes place in Dubai on the confirmed dates: July 20\u201324, Nov 16\u201320."
      },
      {
        "q": "What currency is the tuition charged in?",
        "a": "The tuition for Dubai programmes is $4,800 USD."
      },
      {
        "q": "Does GIBS provide visa support and logistics guidance?",
        "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "int-dubai-3",
    "code": "GIBS-INT-DUB-03",
    "num": 124,
    "slug": "foreign-dubai-3-next-generation-challenges-opportunities-for-telecom-other-u",
    "title": "Next Generation Challenges & Opportunities for Telecom Other Utility Managers",
    "category": "Foreign Executive Training",
    "destination": "Dubai",
    "fee": 4800,
    "feeSecondary": null,
    "feeNotes": null,
    "currency": "USD",
    "targetAudience": "Relevant Staff",
    "schedule": "Sept 7\u201311, Oct 12\u201316 (Dubai)",
    "duration": "1 Week",
    "inPlantAvailable": false,
    "tagline": "Foreign Executive Training \u00b7 Dubai (Sept 7\u201311, Oct 12\u201316)",
    "summary": "Next Generation Challenges & Opportunities for Telecom Other Utility Managers is an executive international study programme delivered at the GIBS Dubai overseas training hub for Relevant Staff. Dates: Sept 7\u201311, Oct 12\u201316.",
    "audience": [
      "Relevant Staff",
      "Executives seeking global perspective and international exposure in Dubai"
    ],
    "indicativeStructure": [
      "International executive seminars and masterclasses in Dubai",
      "Comparative global policy and regulatory case studies",
      "Peer exchange and institutional benchmarking sessions",
      "Applied action learning project for domestic implementation"
    ],
    "outcomes": [
      "Advanced global leadership perspective and international institutional benchmarking",
      "Direct insights from international best practices and cross-border regulatory frameworks",
      "GIBS International Executive Programme Certification"
    ],
    "format": "Overseas Executive Immersion & Seminar in Dubai (1 Week)",
    "startDate": "Sept 7\u201311, Oct 12\u201316 (Dubai)",
    "fees": "$4,800 USD",
    "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
    "faqs": [
      {
        "q": "When and where does the Dubai programme take place?",
        "a": "The programme takes place in Dubai on the confirmed dates: Sept 7\u201311, Oct 12\u201316."
      },
      {
        "q": "What currency is the tuition charged in?",
        "a": "The tuition for Dubai programmes is $4,800 USD."
      },
      {
        "q": "Does GIBS provide visa support and logistics guidance?",
        "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "int-dubai-4",
    "code": "GIBS-INT-DUB-04",
    "num": 125,
    "slug": "foreign-dubai-4-leadership-and-management-innovation-for-organisational-deve",
    "title": "Leadership and Management Innovation For Organisational Development Using ICT",
    "category": "Foreign Executive Training",
    "destination": "Dubai",
    "fee": 4800,
    "feeSecondary": null,
    "feeNotes": null,
    "currency": "USD",
    "targetAudience": "Middle/Senior Management",
    "schedule": "Aug 24\u201328, Oct 12\u201316 (Dubai)",
    "duration": "1 Week",
    "inPlantAvailable": false,
    "tagline": "Foreign Executive Training \u00b7 Dubai (Aug 24\u201328, Oct 12\u201316)",
    "summary": "Leadership and Management Innovation For Organisational Development Using ICT is an executive international study programme delivered at the GIBS Dubai overseas training hub for Middle/Senior Management. Dates: Aug 24\u201328, Oct 12\u201316.",
    "audience": [
      "Middle/Senior Management",
      "Executives seeking global perspective and international exposure in Dubai"
    ],
    "indicativeStructure": [
      "International executive seminars and masterclasses in Dubai",
      "Comparative global policy and regulatory case studies",
      "Peer exchange and institutional benchmarking sessions",
      "Applied action learning project for domestic implementation"
    ],
    "outcomes": [
      "Advanced global leadership perspective and international institutional benchmarking",
      "Direct insights from international best practices and cross-border regulatory frameworks",
      "GIBS International Executive Programme Certification"
    ],
    "format": "Overseas Executive Immersion & Seminar in Dubai (1 Week)",
    "startDate": "Aug 24\u201328, Oct 12\u201316 (Dubai)",
    "fees": "$4,800 USD",
    "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
    "faqs": [
      {
        "q": "When and where does the Dubai programme take place?",
        "a": "The programme takes place in Dubai on the confirmed dates: Aug 24\u201328, Oct 12\u201316."
      },
      {
        "q": "What currency is the tuition charged in?",
        "a": "The tuition for Dubai programmes is $4,800 USD."
      },
      {
        "q": "Does GIBS provide visa support and logistics guidance?",
        "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "int-dubai-5",
    "code": "GIBS-INT-DUB-05",
    "num": 126,
    "slug": "foreign-dubai-5-interpersonal-skills-for-effective-communication-and-confide",
    "title": "Interpersonal Skills For Effective Communication and Confidence Building",
    "category": "Foreign Executive Training",
    "destination": "Dubai",
    "fee": 4800,
    "feeSecondary": null,
    "feeNotes": null,
    "currency": "USD",
    "targetAudience": "Middle/Senior Management",
    "schedule": "Sept 21\u201325, Nov 30\u2013Dec 4 (Dubai)",
    "duration": "1 Week",
    "inPlantAvailable": false,
    "tagline": "Foreign Executive Training \u00b7 Dubai (Sept 21\u201325, Nov 30\u2013Dec 4)",
    "summary": "Interpersonal Skills For Effective Communication and Confidence Building is an executive international study programme delivered at the GIBS Dubai overseas training hub for Middle/Senior Management. Dates: Sept 21\u201325, Nov 30\u2013Dec 4.",
    "audience": [
      "Middle/Senior Management",
      "Executives seeking global perspective and international exposure in Dubai"
    ],
    "indicativeStructure": [
      "International executive seminars and masterclasses in Dubai",
      "Comparative global policy and regulatory case studies",
      "Peer exchange and institutional benchmarking sessions",
      "Applied action learning project for domestic implementation"
    ],
    "outcomes": [
      "Advanced global leadership perspective and international institutional benchmarking",
      "Direct insights from international best practices and cross-border regulatory frameworks",
      "GIBS International Executive Programme Certification"
    ],
    "format": "Overseas Executive Immersion & Seminar in Dubai (1 Week)",
    "startDate": "Sept 21\u201325, Nov 30\u2013Dec 4 (Dubai)",
    "fees": "$4,800 USD",
    "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
    "faqs": [
      {
        "q": "When and where does the Dubai programme take place?",
        "a": "The programme takes place in Dubai on the confirmed dates: Sept 21\u201325, Nov 30\u2013Dec 4."
      },
      {
        "q": "What currency is the tuition charged in?",
        "a": "The tuition for Dubai programmes is $4,800 USD."
      },
      {
        "q": "Does GIBS provide visa support and logistics guidance?",
        "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "int-london-1",
    "code": "GIBS-INT-LON-01",
    "num": 127,
    "slug": "foreign-london-1-building-capacity-for-executives-and-top-management-utility",
    "title": "Building Capacity For Executives and Top Management Utility Regulators",
    "category": "Foreign Executive Training",
    "destination": "London",
    "fee": 4800,
    "feeSecondary": null,
    "feeNotes": null,
    "currency": "GBP",
    "targetAudience": "Middle/Senior Management",
    "schedule": "July 6\u201310 (London)",
    "duration": "1 Week",
    "inPlantAvailable": false,
    "tagline": "Foreign Executive Training \u00b7 London (July 6\u201310)",
    "summary": "Building Capacity For Executives and Top Management Utility Regulators is an executive international study programme delivered at the GIBS London overseas training hub for Middle/Senior Management. Dates: July 6\u201310.",
    "audience": [
      "Middle/Senior Management",
      "Executives seeking global perspective and international exposure in London"
    ],
    "indicativeStructure": [
      "International executive seminars and masterclasses in London",
      "Comparative global policy and regulatory case studies",
      "Peer exchange and institutional benchmarking sessions",
      "Applied action learning project for domestic implementation"
    ],
    "outcomes": [
      "Advanced global leadership perspective and international institutional benchmarking",
      "Direct insights from international best practices and cross-border regulatory frameworks",
      "GIBS International Executive Programme Certification"
    ],
    "format": "Overseas Executive Immersion & Seminar in London (1 Week)",
    "startDate": "July 6\u201310 (London)",
    "fees": "\u00a34,800 GBP",
    "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
    "faqs": [
      {
        "q": "When and where does the London programme take place?",
        "a": "The programme takes place in London on the confirmed dates: July 6\u201310."
      },
      {
        "q": "What currency is the tuition charged in?",
        "a": "The tuition for London programmes is \u00a34,800 GBP."
      },
      {
        "q": "Does GIBS provide visa support and logistics guidance?",
        "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "int-london-2",
    "code": "GIBS-INT-LON-02",
    "num": 128,
    "slug": "foreign-london-2-next-generation-challenges-opportunities-for-telecom-senior",
    "title": "Next Generation Challenges & Opportunities for Telecom Senior Executives",
    "category": "Foreign Executive Training",
    "destination": "London",
    "fee": 4800,
    "feeSecondary": null,
    "feeNotes": null,
    "currency": "GBP",
    "targetAudience": "Middle/Senior Management",
    "schedule": "Aug 17\u201321 (London)",
    "duration": "1 Week",
    "inPlantAvailable": false,
    "tagline": "Foreign Executive Training \u00b7 London (Aug 17\u201321)",
    "summary": "Next Generation Challenges & Opportunities for Telecom Senior Executives is an executive international study programme delivered at the GIBS London overseas training hub for Middle/Senior Management. Dates: Aug 17\u201321.",
    "audience": [
      "Middle/Senior Management",
      "Executives seeking global perspective and international exposure in London"
    ],
    "indicativeStructure": [
      "International executive seminars and masterclasses in London",
      "Comparative global policy and regulatory case studies",
      "Peer exchange and institutional benchmarking sessions",
      "Applied action learning project for domestic implementation"
    ],
    "outcomes": [
      "Advanced global leadership perspective and international institutional benchmarking",
      "Direct insights from international best practices and cross-border regulatory frameworks",
      "GIBS International Executive Programme Certification"
    ],
    "format": "Overseas Executive Immersion & Seminar in London (1 Week)",
    "startDate": "Aug 17\u201321 (London)",
    "fees": "\u00a34,800 GBP",
    "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
    "faqs": [
      {
        "q": "When and where does the London programme take place?",
        "a": "The programme takes place in London on the confirmed dates: Aug 17\u201321."
      },
      {
        "q": "What currency is the tuition charged in?",
        "a": "The tuition for London programmes is \u00a34,800 GBP."
      },
      {
        "q": "Does GIBS provide visa support and logistics guidance?",
        "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "int-london-3",
    "code": "GIBS-INT-LON-03",
    "num": 129,
    "slug": "foreign-london-3-capacity-building-workshop-on-ict-literacy-and-security-awar",
    "title": "Capacity Building Workshop on ICT Literacy and Security Awareness",
    "category": "Foreign Executive Training",
    "destination": "London",
    "fee": 4800,
    "feeSecondary": null,
    "feeNotes": null,
    "currency": "GBP",
    "targetAudience": "Middle/Senior Management",
    "schedule": "Sept 21\u201325 (London)",
    "duration": "1 Week",
    "inPlantAvailable": false,
    "tagline": "Foreign Executive Training \u00b7 London (Sept 21\u201325)",
    "summary": "Capacity Building Workshop on ICT Literacy and Security Awareness is an executive international study programme delivered at the GIBS London overseas training hub for Middle/Senior Management. Dates: Sept 21\u201325.",
    "audience": [
      "Middle/Senior Management",
      "Executives seeking global perspective and international exposure in London"
    ],
    "indicativeStructure": [
      "International executive seminars and masterclasses in London",
      "Comparative global policy and regulatory case studies",
      "Peer exchange and institutional benchmarking sessions",
      "Applied action learning project for domestic implementation"
    ],
    "outcomes": [
      "Advanced global leadership perspective and international institutional benchmarking",
      "Direct insights from international best practices and cross-border regulatory frameworks",
      "GIBS International Executive Programme Certification"
    ],
    "format": "Overseas Executive Immersion & Seminar in London (1 Week)",
    "startDate": "Sept 21\u201325 (London)",
    "fees": "\u00a34,800 GBP",
    "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
    "faqs": [
      {
        "q": "When and where does the London programme take place?",
        "a": "The programme takes place in London on the confirmed dates: Sept 21\u201325."
      },
      {
        "q": "What currency is the tuition charged in?",
        "a": "The tuition for London programmes is \u00a34,800 GBP."
      },
      {
        "q": "Does GIBS provide visa support and logistics guidance?",
        "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "int-london-4",
    "code": "GIBS-INT-LON-04",
    "num": 130,
    "slug": "foreign-london-4-infusing-knowledge-management-in-public-service-and-private",
    "title": "Infusing Knowledge Management in Public Service and Private Sector",
    "category": "Foreign Executive Training",
    "destination": "London",
    "fee": 4800,
    "feeSecondary": null,
    "feeNotes": null,
    "currency": "GBP",
    "targetAudience": "Middle/Senior Management",
    "schedule": "Oct 19\u201323 (London)",
    "duration": "1 Week",
    "inPlantAvailable": false,
    "tagline": "Foreign Executive Training \u00b7 London (Oct 19\u201323)",
    "summary": "Infusing Knowledge Management in Public Service and Private Sector is an executive international study programme delivered at the GIBS London overseas training hub for Middle/Senior Management. Dates: Oct 19\u201323.",
    "audience": [
      "Middle/Senior Management",
      "Executives seeking global perspective and international exposure in London"
    ],
    "indicativeStructure": [
      "International executive seminars and masterclasses in London",
      "Comparative global policy and regulatory case studies",
      "Peer exchange and institutional benchmarking sessions",
      "Applied action learning project for domestic implementation"
    ],
    "outcomes": [
      "Advanced global leadership perspective and international institutional benchmarking",
      "Direct insights from international best practices and cross-border regulatory frameworks",
      "GIBS International Executive Programme Certification"
    ],
    "format": "Overseas Executive Immersion & Seminar in London (1 Week)",
    "startDate": "Oct 19\u201323 (London)",
    "fees": "\u00a34,800 GBP",
    "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
    "faqs": [
      {
        "q": "When and where does the London programme take place?",
        "a": "The programme takes place in London on the confirmed dates: Oct 19\u201323."
      },
      {
        "q": "What currency is the tuition charged in?",
        "a": "The tuition for London programmes is \u00a34,800 GBP."
      },
      {
        "q": "Does GIBS provide visa support and logistics guidance?",
        "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "int-houston-1",
    "code": "GIBS-INT-HOU-01",
    "num": 131,
    "slug": "foreign-houston-1-capacity-building-workshop-on-ict-literacy-new-innovations-a",
    "title": "Capacity Building Workshop on ICT Literacy, New Innovations and Security Awareness",
    "category": "Foreign Executive Training",
    "destination": "Houston",
    "fee": 5000,
    "feeSecondary": null,
    "feeNotes": null,
    "currency": "USD",
    "targetAudience": "Middle/Senior Management",
    "schedule": "June 22\u201326 (Houston)",
    "duration": "1 Week",
    "inPlantAvailable": false,
    "tagline": "Foreign Executive Training \u00b7 Houston (June 22\u201326)",
    "summary": "Capacity Building Workshop on ICT Literacy, New Innovations and Security Awareness is an executive international study programme delivered at the GIBS Houston overseas training hub for Middle/Senior Management. Dates: June 22\u201326.",
    "audience": [
      "Middle/Senior Management",
      "Executives seeking global perspective and international exposure in Houston"
    ],
    "indicativeStructure": [
      "International executive seminars and masterclasses in Houston",
      "Comparative global policy and regulatory case studies",
      "Peer exchange and institutional benchmarking sessions",
      "Applied action learning project for domestic implementation"
    ],
    "outcomes": [
      "Advanced global leadership perspective and international institutional benchmarking",
      "Direct insights from international best practices and cross-border regulatory frameworks",
      "GIBS International Executive Programme Certification"
    ],
    "format": "Overseas Executive Immersion & Seminar in Houston (1 Week)",
    "startDate": "June 22\u201326 (Houston)",
    "fees": "$5,000 USD",
    "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
    "faqs": [
      {
        "q": "When and where does the Houston programme take place?",
        "a": "The programme takes place in Houston on the confirmed dates: June 22\u201326."
      },
      {
        "q": "What currency is the tuition charged in?",
        "a": "The tuition for Houston programmes is $5,000 USD."
      },
      {
        "q": "Does GIBS provide visa support and logistics guidance?",
        "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "int-houston-2",
    "code": "GIBS-INT-HOU-02",
    "num": 132,
    "slug": "foreign-houston-2-strategies-for-managing-emerging-concepts-of-smart-cities-bi",
    "title": "Strategies for Managing Emerging Concepts of Smart Cities Big Data, AI, EI and 5G: Prospects and Challenges",
    "category": "Foreign Executive Training",
    "destination": "Houston",
    "fee": 5000,
    "feeSecondary": null,
    "feeNotes": null,
    "currency": "USD",
    "targetAudience": "Middle/Senior Management",
    "schedule": "July 20\u201324 (Houston)",
    "duration": "1 Week",
    "inPlantAvailable": false,
    "tagline": "Foreign Executive Training \u00b7 Houston (July 20\u201324)",
    "summary": "Strategies for Managing Emerging Concepts of Smart Cities Big Data, AI, EI and 5G: Prospects and Challenges is an executive international study programme delivered at the GIBS Houston overseas training hub for Middle/Senior Management. Dates: July 20\u201324.",
    "audience": [
      "Middle/Senior Management",
      "Executives seeking global perspective and international exposure in Houston"
    ],
    "indicativeStructure": [
      "International executive seminars and masterclasses in Houston",
      "Comparative global policy and regulatory case studies",
      "Peer exchange and institutional benchmarking sessions",
      "Applied action learning project for domestic implementation"
    ],
    "outcomes": [
      "Advanced global leadership perspective and international institutional benchmarking",
      "Direct insights from international best practices and cross-border regulatory frameworks",
      "GIBS International Executive Programme Certification"
    ],
    "format": "Overseas Executive Immersion & Seminar in Houston (1 Week)",
    "startDate": "July 20\u201324 (Houston)",
    "fees": "$5,000 USD",
    "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
    "faqs": [
      {
        "q": "When and where does the Houston programme take place?",
        "a": "The programme takes place in Houston on the confirmed dates: July 20\u201324."
      },
      {
        "q": "What currency is the tuition charged in?",
        "a": "The tuition for Houston programmes is $5,000 USD."
      },
      {
        "q": "Does GIBS provide visa support and logistics guidance?",
        "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "int-houston-3",
    "code": "GIBS-INT-HOU-03",
    "num": 133,
    "slug": "foreign-houston-3-infusing-knowledge-management-in-public-service-and-private",
    "title": "Infusing Knowledge Management in Public Service and Private Sector For Improved Productivity",
    "category": "Foreign Executive Training",
    "destination": "Houston",
    "fee": 5000,
    "feeSecondary": 9500,
    "feeNotes": "$5,000 USD (1wk) / $9,500 USD (2wks)",
    "currency": "USD",
    "targetAudience": "Middle/Senior Management",
    "schedule": "Aug 10\u201314 (1wk) / Aug 10\u201321 (2wks) (Houston)",
    "duration": "1\u20132 Weeks",
    "inPlantAvailable": false,
    "tagline": "Foreign Executive Training \u00b7 Houston (Aug 10\u201314 (1wk) / Aug 10\u201321 (2wks))",
    "summary": "Infusing Knowledge Management in Public Service and Private Sector For Improved Productivity is an executive international study programme delivered at the GIBS Houston overseas training hub for Middle/Senior Management. Dates: Aug 10\u201314 (1wk) / Aug 10\u201321 (2wks).",
    "audience": [
      "Middle/Senior Management",
      "Executives seeking global perspective and international exposure in Houston"
    ],
    "indicativeStructure": [
      "International executive seminars and masterclasses in Houston",
      "Comparative global policy and regulatory case studies",
      "Peer exchange and institutional benchmarking sessions",
      "Applied action learning project for domestic implementation"
    ],
    "outcomes": [
      "Advanced global leadership perspective and international institutional benchmarking",
      "Direct insights from international best practices and cross-border regulatory frameworks",
      "GIBS International Executive Programme Certification"
    ],
    "format": "Overseas Executive Immersion & Seminar in Houston (1\u20132 Weeks)",
    "startDate": "Aug 10\u201314 (1wk) / Aug 10\u201321 (2wks) (Houston)",
    "fees": "$5,000 USD (1wk) / $9,500 USD (2wks)",
    "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
    "faqs": [
      {
        "q": "When and where does the Houston programme take place?",
        "a": "The programme takes place in Houston on the confirmed dates: Aug 10\u201314 (1wk) / Aug 10\u201321 (2wks)."
      },
      {
        "q": "What currency is the tuition charged in?",
        "a": "The tuition for Houston programmes is $5,000 USD (1wk) / $9,500 USD (2wks)."
      },
      {
        "q": "Does GIBS provide visa support and logistics guidance?",
        "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "int-houston-4",
    "code": "GIBS-INT-HOU-04",
    "num": 134,
    "slug": "foreign-houston-4-next-generation-challenges-opportunities-for-telecom-other-u",
    "title": "Next Generation Challenges & Opportunities for Telecom & Other Utilities Regulatory Managers",
    "category": "Foreign Executive Training",
    "destination": "Houston",
    "fee": 5000,
    "feeSecondary": 9500,
    "feeNotes": "$5,000 USD (1wk) / $9,500 USD (2wks)",
    "currency": "USD",
    "targetAudience": "Middle/Senior Management",
    "schedule": "Oct 12\u201316 (1wk) / Oct 12\u201323 (2wks) (Houston)",
    "duration": "1\u20132 Weeks",
    "inPlantAvailable": false,
    "tagline": "Foreign Executive Training \u00b7 Houston (Oct 12\u201316 (1wk) / Oct 12\u201323 (2wks))",
    "summary": "Next Generation Challenges & Opportunities for Telecom & Other Utilities Regulatory Managers is an executive international study programme delivered at the GIBS Houston overseas training hub for Middle/Senior Management. Dates: Oct 12\u201316 (1wk) / Oct 12\u201323 (2wks).",
    "audience": [
      "Middle/Senior Management",
      "Executives seeking global perspective and international exposure in Houston"
    ],
    "indicativeStructure": [
      "International executive seminars and masterclasses in Houston",
      "Comparative global policy and regulatory case studies",
      "Peer exchange and institutional benchmarking sessions",
      "Applied action learning project for domestic implementation"
    ],
    "outcomes": [
      "Advanced global leadership perspective and international institutional benchmarking",
      "Direct insights from international best practices and cross-border regulatory frameworks",
      "GIBS International Executive Programme Certification"
    ],
    "format": "Overseas Executive Immersion & Seminar in Houston (1\u20132 Weeks)",
    "startDate": "Oct 12\u201316 (1wk) / Oct 12\u201323 (2wks) (Houston)",
    "fees": "$5,000 USD (1wk) / $9,500 USD (2wks)",
    "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
    "faqs": [
      {
        "q": "When and where does the Houston programme take place?",
        "a": "The programme takes place in Houston on the confirmed dates: Oct 12\u201316 (1wk) / Oct 12\u201323 (2wks)."
      },
      {
        "q": "What currency is the tuition charged in?",
        "a": "The tuition for Houston programmes is $5,000 USD (1wk) / $9,500 USD (2wks)."
      },
      {
        "q": "Does GIBS provide visa support and logistics guidance?",
        "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
      }
    ],
    "officialOnly": []
  },
  {
    "id": "int-houston-5",
    "code": "GIBS-INT-HOU-05",
    "num": 135,
    "slug": "foreign-houston-5-capacity-building-workshop-on-ict-literacy-and-security-awar",
    "title": "Capacity Building Workshop on ICT Literacy and Security Awareness",
    "category": "Foreign Executive Training",
    "destination": "Houston",
    "fee": 9500,
    "feeSecondary": null,
    "feeNotes": "$9,500 USD",
    "currency": "USD",
    "targetAudience": "Middle/Senior Management",
    "schedule": "Nov 9\u201313 (1wk) / Nov 9\u201320 (2wks) (Houston)",
    "duration": "1\u20132 Weeks",
    "inPlantAvailable": false,
    "tagline": "Foreign Executive Training \u00b7 Houston (Nov 9\u201313 (1wk) / Nov 9\u201320 (2wks))",
    "summary": "Capacity Building Workshop on ICT Literacy and Security Awareness is an executive international study programme delivered at the GIBS Houston overseas training hub for Middle/Senior Management. Dates: Nov 9\u201313 (1wk) / Nov 9\u201320 (2wks).",
    "audience": [
      "Middle/Senior Management",
      "Executives seeking global perspective and international exposure in Houston"
    ],
    "indicativeStructure": [
      "International executive seminars and masterclasses in Houston",
      "Comparative global policy and regulatory case studies",
      "Peer exchange and institutional benchmarking sessions",
      "Applied action learning project for domestic implementation"
    ],
    "outcomes": [
      "Advanced global leadership perspective and international institutional benchmarking",
      "Direct insights from international best practices and cross-border regulatory frameworks",
      "GIBS International Executive Programme Certification"
    ],
    "format": "Overseas Executive Immersion & Seminar in Houston (1\u20132 Weeks)",
    "startDate": "Nov 9\u201313 (1wk) / Nov 9\u201320 (2wks) (Houston)",
    "fees": "$9,500 USD",
    "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
    "faqs": [
      {
        "q": "When and where does the Houston programme take place?",
        "a": "The programme takes place in Houston on the confirmed dates: Nov 9\u201313 (1wk) / Nov 9\u201320 (2wks)."
      },
      {
        "q": "What currency is the tuition charged in?",
        "a": "The tuition for Houston programmes is $9,500 USD."
      },
      {
        "q": "Does GIBS provide visa support and logistics guidance?",
        "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
      }
    ],
    "officialOnly": []
  }
];

export const PROGRAM_CATEGORIES: ("All" | ProgrammeCategory | "Foreign Training")[] = [
  "All",
  "Accounting and Financial Management",
  "General Administration and Management",
  "Telecom & Utilities Regulation",
  "Consumer Protection & Utilities",
  "Environmental Sustainability & Management",
  "Oil & Gas Sector",
  "Secretarial Administration & Management",
  "Capital Market & Securities Management",
  "Information Technology Workshops",
  "Legal & Legislative Studies",
  "Power & Energy Sector",
  "Maritime & Transportation",
  "Pension Management",
  "Special Executive Training",
  "Foreign Executive Training",
];

export const FOREIGN_DESTINATIONS: ProgrammeDestination[] = [
  "Kigali",
  "Dubai",
  "London",
  "Houston",
];

export function getProgramme(slugOrId: string): Programme | undefined {
  if (!slugOrId) return undefined;
  const target = slugOrId.toLowerCase().trim();
  return (
    PROGRAMMES.find((p) => p.slug.toLowerCase() === target) ||
    PROGRAMMES.find((p) => p.id.toLowerCase() === target) ||
    PROGRAMMES.find((p) => p.code.toLowerCase() === target) ||
    PROGRAMMES.find((p) => p.slug.toLowerCase().endsWith("-" + target))
  );
}

export function relatedProgrammes(slug: string, count = 3): Programme[] {
  const current = getProgramme(slug);
  if (!current) return PROGRAMMES.slice(0, count);
  return PROGRAMMES.filter((p) => p.slug !== current.slug)
    .sort((a, b) => {
      if (a.destination === current.destination && b.destination !== current.destination) return -1;
      if (b.destination === current.destination && a.destination !== current.destination) return 1;
      if (a.category === current.category && b.category !== current.category) return -1;
      if (b.category === current.category && a.category !== current.category) return 1;
      return 0;
    })
    .slice(0, count);
}

/* ---------------- 8. Research Themes ---------------- */

export const RESEARCH_THEMES = [
  {
    title: "Manpower & Capacity Building",
    blurb: "Methods, assessments and metrics for sustainable institutional workforce development in Nigeria.",
  },
  {
    title: "Public Sector Reforms & Governance",
    blurb: "Policy translation, anti-corruption, financial transparency and performance management.",
  },
  {
    title: "Utilities Regulation & Rates Determination",
    blurb: "Economic regulation, consumer protection and compliance in Telecom, Power, Pension and Maritime sectors.",
  },
  {
    title: "Environmental Sustainability & Energy Transition",
    blurb: "Climate impact, oil spill mitigation, agricultural development, and local content in oil & gas.",
  },
];

export const INSIGHT_TYPES = ["All", "Research", "Leadership Perspective", "Case Study", "Events"];

/* ---------------- 9. Editorial Articles ---------------- */

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
  status: "Published" | "Forthcoming";
  blocks: ArticleBlock[];
  related: string[];
};

export const ARTICLES: Article[] = [
  {
    slug: "capacity-building-and-national-manpower-development",
    category: "Manpower & Capacity Building",
    kicker: "Institutional Perspective",
    title: "Capacity Building as the Foundation of National Manpower Development",
    dek: "How continuous management knowledge update transforms public and private institutions across Nigeria.",
    image: IMAGES.books,
    alt: "Management research and curriculum references at GIBS",
    status: "Published",
    blocks: [
      {
        type: "p",
        text: "The progress of any nation is inextricably bound to the competence, ethical grounding, and responsiveness of its manpower. Goshen International Business School was established in 2014 with an unwavering commitment to manpower development and capacity building.",
      },
      { type: "h2", text: "Bridging the Knowledge Gap" },
      {
        type: "p",
        text: "Our five strategic focus areas centre on making required knowledge updates available to all stakeholders, bridging skill deficits, introducing contemporary societal developments, and creating supportive platforms for institutional growth.",
      },
      {
        type: "quote",
        text: "Take advantage of us, so that no one takes advantage of you.",
      },
      {
        type: "p",
        text: "Across our 113 domestic programmes and 22 overseas executive workshops, GIBS provides hands-on, rigorous training that translates directly into enhanced productivity, prudent resource management, and organizational excellence.",
      },
    ],
    related: ["regulatory-compliance-and-economic-development"],
  },
  {
    slug: "regulatory-compliance-and-economic-development",
    category: "Utilities Regulation & Rates Determination",
    kicker: "Regulatory Insight",
    title: "Regulatory Compliance Monitoring and Consumer Protection in Utility Sectors",
    dek: "Examining the intersections of tariff setting, quality of experience, and sustainable economic growth.",
    image: IMAGES.city,
    alt: "GIBS campus sandstone architecture in focus",
    status: "Published",
    blocks: [
      {
        type: "p",
        text: "Effective regulation in telecommunications, power, maritime, and pensions requires continuous training for both regulators and operators. Transparent tariff setting and firm compliance enforcement protect consumers while safeguarding investments.",
      },
      { type: "h2", text: "The Role of Capacity Building" },
      {
        type: "p",
        text: "Regulators and utilities managers must master economic principles, dispute resolution, cybersecurity vulnerability assessment, and quality of experience metrics to steer modern industries effectively.",
      },
    ],
    related: ["capacity-building-and-national-manpower-development"],
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

/* ---------------- 10. Programme Subscription & Enrolment Steps ---------------- */

export const SUBSCRIPTION_STEPS = [
  {
    n: "01",
    title: "Select Programme",
    body: "Browse the 2026 Calendar of 113 Local and 22 Foreign Executive Training Programmes across your sector.",
  },
  {
    n: "02",
    title: "Nomination & Subscription",
    body: "Organizations submit participant nominations or individual candidates complete the programme subscription registration.",
  },
  {
    n: "03",
    title: "Confirmation & Invoicing",
    body: "GIBS issues official subscription confirmation letters, course schedule details, and invoice.",
  },
  {
    n: "04",
    title: "Logistics & Preparation",
    body: "Receive workshop venue guide (Ilorin HQ, Abuja, Ibafo, or overseas destination) and pre-course materials.",
  },
  {
    n: "05",
    title: "Training Delivery",
    body: "Participate in intensive, faculty-led interactive workshops, syndicate deliberations, and practical exercises.",
  },
  {
    n: "06",
    title: "Certification & Follow-up",
    body: "Award of GIBS Executive Certificate of Completion and post-training impact implementation support.",
  },
];

export const ADMISSIONS_STEPS = SUBSCRIPTION_STEPS;

export const REQUIREMENTS_ACCORDION = [
  {
    q: "Participant Eligibility & Nominations",
    a: "Programmes are tailored for senior and middle-level management staff, executive officers, legislators, administrators, and specialized departmental personnel across public and private sectors.",
  },
  {
    q: "In-Plant & Customized Training Requests",
    a: "Organizations requiring in-house or customized curriculum delivery can request tailored dates, venues, and specialized industry focus areas.",
  },
  {
    q: "Overseas Training Travel Requirements",
    a: "Participants in Kigali, Dubai, London, and Houston foreign training programmes must possess valid international passports. GIBS issues official visa support letters upon subscription confirmation.",
  },
  {
    q: "Course Materials & Logistics Support",
    a: "Course fees cover training folders, comprehensive lecture notes, lunch/tea breaks, and executive certifications. Accommodation can be arranged at GIBS guest lodges upon request.",
  },
];

export const SUBSCRIPTION_FAQS = [
  {
    q: "How do MDAs and corporate organizations nominate staff to subscribe?",
    a: "Organizations can send official nomination letters or emails to gibsilorin@gmail.com / goshenibs22@gmail.com, or contact the training desk via 08160010401 or 08033429427.",
  },
  {
    q: "Where are the training venues located?",
    a: "Domestic programmes are held at our Ilorin Headquarters, Abuja Center, Ibafo Center, and designated executive partner venues in Lagos, Keffi, Kaduna, and Port Harcourt.",
  },
  {
    q: "What accreditations back GIBS certificates?",
    a: "GIBS is incorporated under the Corporate Affairs Commission (RC 1178333) and accredited by the Centre For Management Development (CMD), with Industrial Training Fund (ITF) and NSTIF certifications.",
  },
  {
    q: "Are concessions available for group subscriptions and nominations?",
    a: "Yes. Group concessions and customized in-plant packages are available for organizations sponsoring multiple candidates.",
  },
];

export const ADMISSIONS_FAQS = SUBSCRIPTION_FAQS;

/* ---------------- 11. Homepage Highlight Bands ---------------- */

export const HOME_PROGRAMME_BANDS: {
  band: string;
  note: string;
  slugs: string[];
}[] = [
  {
    band: "Financial & Public Sector Management",
    note: "Public sector accounting, budgeting, CSR, and strategic financial control",
    slugs: [
      PROGRAMMES[0].slug,
      PROGRAMMES[1].slug,
      PROGRAMMES[2].slug,
      PROGRAMMES[3].slug,
    ],
  },
  {
    band: "General Administration & Leadership",
    note: "HR transformation, corporate governance, productivity, and leadership competencies",
    slugs: [
      PROGRAMMES[6].slug,
      PROGRAMMES[7].slug,
      PROGRAMMES[10].slug,
      PROGRAMMES[11].slug,
    ],
  },
  {
    band: "Utilities, Telecom & Consumer Protection",
    note: "Rate determination, compliance monitoring, and consumer satisfaction",
    slugs: [
      PROGRAMMES[32].slug,
      PROGRAMMES[35].slug,
      PROGRAMMES[36].slug,
      PROGRAMMES[37].slug,
    ],
  },
  {
    band: "Foreign Executive Training Hubs",
    note: "International executive study in Kigali, Dubai, London, and Houston",
    slugs: [
      PROGRAMMES[113].slug,
      PROGRAMMES[121].slug,
      PROGRAMMES[126].slug,
      PROGRAMMES[130].slug,
    ],
  },
];

/* ---------------- 12. Contact Form Enquiry Types ---------------- */

export const ENQUIRY_TYPES = [
  "Local Open Training Registration",
  "Foreign Training Programmes (Kigali, Dubai, London, Houston)",
  "Customized In-Plant Workshop Request",
  "Institutional Partnership & Accreditation",
  "Campus Facility Booking & Enquiries",
  "General Administration & Registry",
];

/* ---------------- 13. Static Pages Index for Search ---------------- */

export const STATIC_PAGES = [
  { title: "All Programmes", to: "/programmes", blurb: "Complete 2026 calendar of 113 Local and 22 Foreign executive training programmes.", type: "Page" },
  { title: "Foreign Training", to: "/executive-education", blurb: "International overseas programmes in Kigali, Dubai, London, and Houston.", type: "Page" },
  { title: "About GIBS", to: "/about", blurb: "Official institutional profile, RC 1178333, mission, vision, guiding principles, and values.", type: "Page" },
  { title: "Faculty & Governance", to: "/faculty", blurb: "Governing Council, management team of 20 Advisors, and Academic Board structure.", type: "Page" },
  { title: "Campuses & Facilities", to: "/campus", blurb: "Ilorin Main HQ, Abuja Center, and Ibafo Center facilities and training capacities.", type: "Page" },
  { title: "Programme Subscription", to: "/admissions", blurb: "Six-step nomination and programme subscription process, requirements, and calendar.", type: "Page" },
  { title: "Research & Insights", to: "/research-insights", blurb: "Manpower development, public sector reforms, and regulatory research.", type: "Page" },
  { title: "Gallery", to: "/gallery", blurb: "Campus infrastructure, lecture halls, guest lodges, and learning environments.", type: "Page" },
  { title: "Events & Conferences", to: "/events", blurb: "Annual capacity-building conferences and executive roundtables.", type: "Page" },
  { title: "Contact GIBS", to: "/contact", blurb: "Official emails, phone lines, Ilorin HQ, Abuja, and Ibafo addresses.", type: "Page" },
  { title: "GIBS AI", to: "/concierge", blurb: "Ask about programmes, campuses and how to subscribe.", type: "Page" },
];

/* ---------------- 14. Consolidated Authoritative GIBS Data Exports ---------------- */

export const INSTITUTION = INSTITUTIONAL_DATA;
export const CONTACTS = {
  website: INSTITUTIONAL_DATA.website,
  emails: INSTITUTIONAL_DATA.emails,
  phones: INSTITUTIONAL_DATA.phoneNumbers,
  postalAddress: INSTITUTIONAL_DATA.postalAddress,
};
export const CAMPUSES = CAMPUS_LOCATIONS;
export const GOVERNANCE = GOVERNANCE_INFO;
export const FACULTY = FACULTY_ADVISORS;
export const ACCREDITATIONS = INSTITUTIONAL_DATA.accreditations;
export const INTERNATIONAL = {
  technicalPartner: INSTITUTIONAL_DATA.technicalPartner,
  overseasHubs: INSTITUTIONAL_DATA.overseasHubs,
  foreignDestinations: FOREIGN_DESTINATIONS,
};
export const LOCAL_PROGRAMMES = PROGRAMMES.filter((p) => p.destination === "Local");
export const FOREIGN_PROGRAMMES = PROGRAMMES.filter((p) => p.destination !== "Local");

