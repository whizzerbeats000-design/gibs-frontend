/* ==========================================================================
   GIBS DATA TYPES — Complete Type Definitions
   ========================================================================== */

export interface InstitutionInfo {
  legalName: string;
  abbreviation: string;
  cac: string;
  incorporationDate: string;
  registrationAuthority: string;
  slogan: string;
  positioning: string;
  mission: string;
  vision: string;
  guidingPrinciples: string[];
  coreValues: string[];
  strategicFocus: string[];
}

export interface ContactInfo {
  website: string;
  emails: string[];
  phones: string[];
  postalAddress: string;
}

export interface CampusInfo {
  id: string;
  name: string;
  type: "Headquarters" | "Campus";
  address: string;
  facilities: string[];
  capacity?: string;
  recreationalFacilities?: string[];
}

export interface FacultyDesignation {
  id: string;
  title: string;
  department: string;
}

export type ProgrammeCurrency = "NGN" | "USD" | "GBP";

export type ProgrammeType = "Local/Open" | "Foreign";

export interface GIBS_EVENT {
  slug: string;
  title: string;
  category: "Public Lecture" | "Conference" | "Executive Session" | "Open Day" | "Research";
  date: string;
  time: string;
  location: string;
  excerpt: string;
  status: "upcoming" | "past";
}

export interface Programme {
  id: string;
  number?: number;
  slug: string;
  title: string;
  category: string;
  programmeType: ProgrammeType;
  fee: string;
  fees: string; // compatibility getter/property
  currency: ProgrammeCurrency;
  feeAmount: number;
  target: string;
  schedule: string;
  location: string;
  destination: string;
  duration: string;
  tagline: string;
  summary: string;
  audience: string[];
  indicativeStructure: string[];
  outcomes: string[];
  format: string;
  startDate: string;
  requirements: string;
  faqs: { q: string; a: string }[];
  officialOnly: string[];
}
