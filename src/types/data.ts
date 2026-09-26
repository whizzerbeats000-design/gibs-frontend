/* ==========================================================================
   GIBS OFFICIAL DATA TYPES
   Goshen International Business School Limited (GIBS)
   RC 1178333 (Incorporated March 17, 2014)
   ========================================================================== */

export type CurrencyCode = "NGN" | "USD" | "GBP";

export type ProgrammeDestination = "Local" | "Kigali" | "Dubai" | "London" | "Houston";

export type ProgrammeCategory =
  | "Accounting and Financial Management"
  | "General Administration and Management"
  | "Telecom & Utilities Regulation"
  | "Consumer Protection & Utilities"
  | "Environmental Sustainability & Management"
  | "Oil & Gas Sector"
  | "Secretarial Administration & Management"
  | "Capital Market & Securities Management"
  | "Information Technology Workshops"
  | "Legal & Legislative Studies"
  | "Power & Energy Sector"
  | "Maritime & Transportation"
  | "Pension Management"
  | "Special Executive Training"
  | "Foreign Executive Training";

export type Programme = {
  id: string;
  code: string;
  num: number;
  slug: string;
  title: string;
  category: ProgrammeCategory;
  destination: ProgrammeDestination;
  fee: number;
  feeSecondary?: number | null;
  feeNotes?: string | null;
  currency: CurrencyCode;
  targetAudience: string;
  schedule: string;
  duration?: string | null;
  inPlantAvailable?: boolean;
  tagline?: string | null;
  summary: string;
  audience?: string[];
  indicativeStructure?: string[];
  outcomes?: string[];
  format?: string | null;
  startDate?: string | null;
  fees?: string | null;
  requirements?: string | null;
  faqs?: { q: string; a: string }[];
  officialOnly?: string[];
};

export type CampusFacility = {
  name: string;
  note: string;
};

export type CampusLocation = {
  id: string;
  name: string;
  address: string;
  academicFacilities: string;
  recreationalFacilities?: string;
  highlights: string[];
};

export type FacultyAdvisor = {
  id: number;
  designation: string;
  category: "Leadership" | "Advisor" | "Coordinator";
};

export type InstitutionalMetadata = {
  legalName: string;
  cacRegistration: string;
  slogan: string;
  positioningStatement: string;
  mission: string;
  vision: string;
  guidingPrinciples: string[];
  coreValues: string[];
  strategicFocusAreas: string[];
  website: string;
  emails: string[];
  phoneNumbers: string[];
  postalAddress: string;
  technicalPartner: string;
  overseasHubs: string[];
  accreditations: string[];
};
