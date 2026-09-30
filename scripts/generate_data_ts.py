import json
import re
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
OUTPUT_PATH = PROJECT_ROOT / "src" / "lib" / "data.ts"

if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

# Load the raw items from previous definitions
from generate_gibs_data import local_raw, foreign_raw

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

programmes = []

# Process Local Programmes (1 - 113)
for item in local_raw:
    num = item["num"]
    code = f"GIBS-LOC-{str(num).padStart(3, '0') if hasattr(str(num), 'padStart') else str(num).zfill(3)}"
    title = item["title"]
    clean_t = slugify(title)[:60]
    slug = f"course-{num}-{clean_t}".rstrip('-')
    fee = item["fee"]
    curr = item["currency"]
    target = item["target"]
    sched = item["schedule"]
    dur = item.get("duration", "5 Days")
    cat = item["category"]
    
    # Formatted fee string
    fee_str = f"₦{fee:,}"
    
    prog = {
        "id": f"loc-{num}",
        "code": code,
        "num": num,
        "slug": slug,
        "title": title,
        "category": cat,
        "destination": "Local",
        "fee": fee,
        "currency": curr,
        "targetAudience": target,
        "schedule": sched,
        "duration": dur,
        "inPlantAvailable": True,
        "tagline": f"{cat} · {sched}",
        "summary": f"{title} is an intensive {dur} capacity-building programme designed for {target}. Scheduled across GIBS training centres and regional hubs: {sched}.",
        "audience": [target, "In-plant and customized delivery available on institutional request"],
        "indicativeStructure": [
            f"Modular coursework and applied workshop sessions ({dur})",
            "Institutional case analysis and best practice frameworks",
            "Interactive policy and practical execution exercises",
            "Action plan and performance improvement strategies"
        ],
        "outcomes": [
            "Upgraded technical and strategic competencies in modern public and private sector operations",
            "Immediate practical toolkit ready for deployment in participant's organization",
            "Executive certification from Goshen International Business School (GIBS)"
        ],
        "format": f"Classroom Workshop & Interactive Seminar ({dur}) / In-Plant Option Available",
        "startDate": sched,
        "fees": fee_str,
        "requirements": "Nomination by sponsoring organization or self-sponsored professional registration.",
        "faqs": [
            {
                "q": "Where and when is this programme held?",
                "a": f"The scheduled 2026 calendar sessions are: {sched}."
            },
            {
                "q": "Can this programme be delivered in-plant for our organization?",
                "a": "Yes. GIBS delivers customized, in-plant editions of this programme tailored to your organization's specific operating requirements and location."
            },
            {
                "q": "What is included in the course fee?",
                "a": f"The programme fee of {fee_str} covers executive training materials, workshop facilitation, tea/lunch breaks, and GIBS certification of completion."
            }
        ],
        "officialOnly": []
    }
    programmes.append(prog)

# Process Foreign Programmes (1 - 22)
foreign_index = 0
for item in foreign_raw:
    foreign_index += 1
    dest = item["destination"]
    num = item["num"]
    code = f"GIBS-INT-{dest.upper()[:3]}-{str(num).zfill(2)}"
    title = item["title"]
    clean_t = slugify(title)[:60]
    slug = f"foreign-{dest.lower()}-{num}-{clean_t}".rstrip('-')
    fee = item["fee"]
    curr = item["currency"]
    target = item["target"]
    sched = item["schedule"]
    dur = item.get("duration", "1 Week")
    cat = item["category"]
    
    sym = "£" if curr == "GBP" else "$"
    fee_str = item.get("feeNotes", f"{sym}{fee:,} {curr}")
    
    prog = {
        "id": f"int-{dest.lower()}-{num}",
        "code": code,
        "num": 113 + foreign_index,
        "slug": slug,
        "title": title,
        "category": cat,
        "destination": dest,
        "fee": fee,
        "feeSecondary": item.get("feeSecondary"),
        "feeNotes": item.get("feeNotes"),
        "currency": curr,
        "targetAudience": target,
        "schedule": f"{sched} ({dest})",
        "duration": dur,
        "inPlantAvailable": False,
        "tagline": f"Foreign Executive Training · {dest} ({sched})",
        "summary": f"{title} is an executive international study programme delivered at the GIBS {dest} overseas training hub for {target}. Dates: {sched}.",
        "audience": [target, f"Executives seeking global perspective and international exposure in {dest}"],
        "indicativeStructure": [
            f"International executive seminars and masterclasses in {dest}",
            "Comparative global policy and regulatory case studies",
            "Peer exchange and institutional benchmarking sessions",
            "Applied action learning project for domestic implementation"
        ],
        "outcomes": [
            "Advanced global leadership perspective and international institutional benchmarking",
            "Direct insights from international best practices and cross-border regulatory frameworks",
            "GIBS International Executive Programme Certification"
        ],
        "format": f"Overseas Executive Immersion & Seminar in {dest} ({dur})",
        "startDate": f"{sched} ({dest})",
        "fees": fee_str,
        "requirements": "Open to executives, senior managers and nominated officers. Valid travel documents required.",
        "faqs": [
            {
                "q": f"When and where does the {dest} programme take place?",
                "a": f"The programme takes place in {dest} on the confirmed dates: {sched}."
            },
            {
                "q": "What currency is the tuition charged in?",
                "a": f"The tuition for {dest} programmes is {fee_str}."
            },
            {
                "q": "Does GIBS provide visa support and logistics guidance?",
                "a": "Yes. Upon confirmation of registration and payment, GIBS issues official letters of invitation and guidance for visa processing and travel logistics."
            }
        ],
        "officialOnly": []
    }
    programmes.append(prog)

print(f"Generated {len(programmes)} total programmes.")

# Now let's generate the data.ts TypeScript content
# Kept as a raw constant so the regex and template-literal braces survive
# f-string interpolation of the surrounding ts_content template.
IMAGE_SET_BLOCK = r'''
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
'''

ts_content = f'''/* ==========================================================================
   GIBS OFFICIAL DATA LAYER (src/lib/data.ts)
   Goshen International Business School Limited (GIBS)
   Certificate of Incorporation RC 1178333 (March 17, 2014)
   Official Source of Truth — 135 Programmes (113 Local + 22 Foreign)
   ========================================================================== */

import type {{
  Programme,
  ProgrammeCategory,
  ProgrammeDestination,
  CurrencyCode,
  CampusFacility,
  CampusLocation,
  FacultyAdvisor,
  InstitutionalMetadata,
}} from "../types/data";

export type {{
  Programme,
  ProgrammeCategory,
  ProgrammeDestination,
  CurrencyCode,
  CampusFacility,
  CampusLocation,
  FacultyAdvisor,
  InstitutionalMetadata,
}};

export const DATA_REQUIRED = "[OFFICIAL GIBS DATA REQUIRED]";

/* ---------------- 1. Institutional Metadata ---------------- */

export const INSTITUTIONAL_DATA: InstitutionalMetadata = {{
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
}};

/* ---------------- 2. Campus Locations & Facilities ---------------- */

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  {{
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
  }},
  {{
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
  }},
  {{
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
  }},
];

export const CAMPUS_CAPACITY = {{
  regularCapacity: "Each campus accommodates 300 candidates across 6 classes of 25 participants in Workshop/Seminar formats, or up to 500 people in a single large class format.",
  offCampusCities: [
    "Lagos",
    "Keffi",
    "Kaduna",
    "Owerri",
    "Port Harcourt",
    "Benin City",
  ],
}};

export const CAMPUS_FACILITIES: CampusFacility[] = [
  {{ name: "Executive Lecture Rooms", note: "Air-conditioned halls equipped for syndicate & case discussion" }},
  {{ name: "Reference & Research Library", note: "Specialized books, journals and public policy references" }},
  {{ name: "Multi-Purpose Conference Halls", note: "100-person to 500-person capacity seminar spaces" }},
  {{ name: "Syndicate & Breakout Rooms", note: "Dedicated team workshops and strategy deliberations" }},
  {{ name: "Executive Guest Lodges", note: "On-site 20-room and 3-room residential quarters" }},
  {{ name: "Sports & Keep-Fit Grounds", note: "Olympic-size lawn tennis and table tennis facilities (Ilorin HQ)" }},
];

/* ---------------- 3. Governance & Faculty Advisory Structure ---------------- */

export const GOVERNANCE_INFO = {{
  councilSummary: "Governing Council comprising 4 Directors under the Chairman of the Council, supported by an executive management team of 20 Advisors and subject-matter experts.",
  boardChairman: "Chairman of the Governing Council",
}};

export const FACULTY_ADVISORS: FacultyAdvisor[] = [
  {{ id: 1, designation: "Chairman, Academic Board", category: "Leadership" }},
  {{ id: 2, designation: "Advisor, Environmental Sustainability Project", category: "Advisor" }},
  {{ id: 3, designation: "Advisor, Training and Manpower Development", category: "Advisor" }},
  {{ id: 4, designation: "Advisor, International Partnership", category: "Advisor" }},
  {{ id: 5, designation: "Advisor, Economic Development Project", category: "Advisor" }},
  {{ id: 6, designation: "Advisor, Legal and Regulatory Services", category: "Advisor" }},
  {{ id: 7, designation: "Advisor, Curriculum Development", category: "Advisor" }},
  {{ id: 8, designation: "Coordinator, Academic Activities", category: "Coordinator" }},
  {{ id: 9, designation: "Advisor, Inter-Agencies Services", category: "Advisor" }},
  {{ id: 10, designation: "Advisor, Financial Services", category: "Advisor" }},
  {{ id: 11, designation: "Coordinator, General Services", category: "Coordinator" }},
  {{ id: 12, designation: "Acting Registrar and Coordinator, ICT Services", category: "Leadership" }},
  {{ id: 13, designation: "Coordinator, External Relations", category: "Coordinator" }},
  {{ id: 14, designation: "Coordinator, Research and Development", category: "Coordinator" }},
];

/* ---------------- 4. Image Assets ---------------- */

export const IMAGES = {{
  hero: "/images/campus-colonnade.webp",
  colonnade: "/images/campus-colonnade.webp",
  library: "/images/library-interior.webp",
  boardroom: "/images/library-interior.webp",
  city: "/images/campus-colonnade.webp",
  lecture: "/images/library-interior.webp",
  seminar: "/images/campus-colonnade.webp",
  books: "/images/library-interior.webp",
  study: "/images/library-interior.webp",
}};
{IMAGE_SET_BLOCK}
/* ---------------- 5. Navigation Links ---------------- */

export const NAV_LINKS = [
  {{ label: "Programmes", to: "/programmes" }},
  {{ label: "Foreign Training", to: "/executive-education" }},
  {{ label: "Faculty & Governance", to: "/faculty" }},
  {{ label: "About GIBS", to: "/about" }},
];

/* ---------------- 6. Events / Executive Sessions ---------------- */

export type GIBS_EVENT = {{
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
}};

export const EVENTS: GIBS_EVENT[] = [
  {{
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
  }},
  {{
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
  }},
];

/* ---------------- 7. Complete Official Programmes (135 Total) ---------------- */

export const PROGRAMMES: Programme[] = {json.dumps(programmes, indent=2)};

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

export function getProgramme(slugOrId: string): Programme | undefined {{
  if (!slugOrId) return undefined;
  const target = slugOrId.toLowerCase().trim();
  return (
    PROGRAMMES.find((p) => p.slug.toLowerCase() === target) ||
    PROGRAMMES.find((p) => p.id.toLowerCase() === target) ||
    PROGRAMMES.find((p) => p.code.toLowerCase() === target) ||
    PROGRAMMES.find((p) => p.slug.toLowerCase().endsWith("-" + target))
  );
}}

export function relatedProgrammes(slug: string, count = 3): Programme[] {{
  const current = getProgramme(slug);
  if (!current) return PROGRAMMES.slice(0, count);
  return PROGRAMMES.filter((p) => p.slug !== current.slug)
    .sort((a, b) => {{
      if (a.destination === current.destination && b.destination !== current.destination) return -1;
      if (b.destination === current.destination && a.destination !== current.destination) return 1;
      if (a.category === current.category && b.category !== current.category) return -1;
      if (b.category === current.category && a.category !== current.category) return 1;
      return 0;
    }})
    .slice(0, count);
}}

/* ---------------- 8. Research Themes ---------------- */

export const RESEARCH_THEMES = [
  {{
    title: "Manpower & Capacity Building",
    blurb: "Methods, assessments and metrics for sustainable institutional workforce development in Nigeria.",
  }},
  {{
    title: "Public Sector Reforms & Governance",
    blurb: "Policy translation, anti-corruption, financial transparency and performance management.",
  }},
  {{
    title: "Utilities Regulation & Rates Determination",
    blurb: "Economic regulation, consumer protection and compliance in Telecom, Power, Pension and Maritime sectors.",
  }},
  {{
    title: "Environmental Sustainability & Energy Transition",
    blurb: "Climate impact, oil spill mitigation, agricultural development, and local content in oil & gas.",
  }},
];

export const INSIGHT_TYPES = ["All", "Research", "Leadership Perspective", "Case Study", "Events"];

/* ---------------- 9. Editorial Articles ---------------- */

export type ArticleBlock =
  | {{ type: "p"; text: string }}
  | {{ type: "h2"; text: string }}
  | {{ type: "quote"; text: string }};

export type Article = {{
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
}};

export const ARTICLES: Article[] = [
  {{
    slug: "capacity-building-and-national-manpower-development",
    category: "Manpower & Capacity Building",
    kicker: "Institutional Perspective",
    title: "Capacity Building as the Foundation of National Manpower Development",
    dek: "How continuous management knowledge update transforms public and private institutions across Nigeria.",
    image: IMAGES.books,
    alt: "Management research and curriculum references at GIBS",
    status: "Published",
    blocks: [
      {{
        type: "p",
        text: "The progress of any nation is inextricably bound to the competence, ethical grounding, and responsiveness of its manpower. Goshen International Business School was established in 2014 with an unwavering commitment to manpower development and capacity building.",
      }},
      {{ type: "h2", text: "Bridging the Knowledge Gap" }},
      {{
        type: "p",
        text: "Our five strategic focus areas centre on making required knowledge updates available to all stakeholders, bridging skill deficits, introducing contemporary societal developments, and creating supportive platforms for institutional growth.",
      }},
      {{
        type: "quote",
        text: "Take advantage of us, so that no one takes advantage of you.",
      }},
      {{
        type: "p",
        text: "Across our 113 domestic programmes and 22 overseas executive workshops, GIBS provides hands-on, rigorous training that translates directly into enhanced productivity, prudent resource management, and organizational excellence.",
      }},
    ],
    related: ["regulatory-compliance-and-economic-development"],
  }},
  {{
    slug: "regulatory-compliance-and-economic-development",
    category: "Utilities Regulation & Rates Determination",
    kicker: "Regulatory Insight",
    title: "Regulatory Compliance Monitoring and Consumer Protection in Utility Sectors",
    dek: "Examining the intersections of tariff setting, quality of experience, and sustainable economic growth.",
    image: IMAGES.city,
    alt: "GIBS campus sandstone architecture in focus",
    status: "Published",
    blocks: [
      {{
        type: "p",
        text: "Effective regulation in telecommunications, power, maritime, and pensions requires continuous training for both regulators and operators. Transparent tariff setting and firm compliance enforcement protect consumers while safeguarding investments.",
      }},
      {{ type: "h2", text: "The Role of Capacity Building" }},
      {{
        type: "p",
        text: "Regulators and utilities managers must master economic principles, dispute resolution, cybersecurity vulnerability assessment, and quality of experience metrics to steer modern industries effectively.",
      }},
    ],
    related: ["capacity-building-and-national-manpower-development"],
  }},
];

export function getArticle(slug: string) {{
  return ARTICLES.find((a) => a.slug === slug);
}}

export function relatedArticles(slug: string, count = 2) {{
  const current = getArticle(slug);
  if (!current) return ARTICLES.slice(0, count);
  return current.related
    .map((s) => ARTICLES.find((a) => a.slug === s))
    .filter((a): a is Article => Boolean(a))
    .slice(0, count);
}}

/* ---------------- 10. Programme Subscription & Enrolment Steps ---------------- */

export const SUBSCRIPTION_STEPS = [
  {{
    n: "01",
    title: "Select Programme",
    body: "Browse the 2026 Calendar of 113 Local and 22 Foreign Executive Training Programmes across your sector.",
  }},
  {{
    n: "02",
    title: "Nomination & Subscription",
    body: "Organizations submit participant nominations or individual candidates complete the programme subscription registration.",
  }},
  {{
    n: "03",
    title: "Confirmation & Invoicing",
    body: "GIBS issues official subscription confirmation letters, course schedule details, and invoice.",
  }},
  {{
    n: "04",
    title: "Logistics & Preparation",
    body: "Receive workshop venue guide (Ilorin HQ, Abuja, Ibafo, or overseas destination) and pre-course materials.",
  }},
  {{
    n: "05",
    title: "Training Delivery",
    body: "Participate in intensive, faculty-led interactive workshops, syndicate deliberations, and practical exercises.",
  }},
  {{
    n: "06",
    title: "Certification & Follow-up",
    body: "Award of GIBS Executive Certificate of Completion and post-training impact implementation support.",
  }},
];

export const ADMISSIONS_STEPS = SUBSCRIPTION_STEPS;

export const REQUIREMENTS_ACCORDION = [
  {{
    q: "Participant Eligibility & Nominations",
    a: "Programmes are tailored for senior and middle-level management staff, executive officers, legislators, administrators, and specialized departmental personnel across public and private sectors.",
  }},
  {{
    q: "In-Plant & Customized Training Requests",
    a: "Organizations requiring in-house or customized curriculum delivery can request tailored dates, venues, and specialized industry focus areas.",
  }},
  {{
    q: "Overseas Training Travel Requirements",
    a: "Participants in Kigali, Dubai, London, and Houston foreign training programmes must possess valid international passports. GIBS issues official visa support letters upon subscription confirmation.",
  }},
  {{
    q: "Course Materials & Logistics Support",
    a: "Course fees cover training folders, comprehensive lecture notes, lunch/tea breaks, and executive certifications. Accommodation can be arranged at GIBS guest lodges upon request.",
  }},
];

export const SUBSCRIPTION_FAQS = [
  {{
    q: "How do MDAs and corporate organizations nominate staff to subscribe?",
    a: "Organizations can send official nomination letters or emails to gibsilorin@gmail.com / goshenibs22@gmail.com, or contact the training desk via 08160010401 or 08033429427.",
  }},
  {{
    q: "Where are the training venues located?",
    a: "Domestic programmes are held at our Ilorin Headquarters, Abuja Center, Ibafo Center, and designated executive partner venues in Lagos, Keffi, Kaduna, and Port Harcourt.",
  }},
  {{
    q: "What accreditations back GIBS certificates?",
    a: "GIBS is incorporated under the Corporate Affairs Commission (RC 1178333) and accredited by the Centre For Management Development (CMD), with Industrial Training Fund (ITF) and NSTIF certifications.",
  }},
  {{
    q: "Are concessions available for group subscriptions and nominations?",
    a: "Yes. Group concessions and customized in-plant packages are available for organizations sponsoring multiple candidates.",
  }},
];

export const ADMISSIONS_FAQS = SUBSCRIPTION_FAQS;

/* ---------------- 11. Homepage Highlight Bands ---------------- */

export const HOME_PROGRAMME_BANDS: {{
  band: string;
  note: string;
  slugs: string[];
}}[] = [
  {{
    band: "Financial & Public Sector Management",
    note: "Public sector accounting, budgeting, CSR, and strategic financial control",
    slugs: [
      PROGRAMMES[0].slug,
      PROGRAMMES[1].slug,
      PROGRAMMES[2].slug,
      PROGRAMMES[3].slug,
    ],
  }},
  {{
    band: "General Administration & Leadership",
    note: "HR transformation, corporate governance, productivity, and leadership competencies",
    slugs: [
      PROGRAMMES[6].slug,
      PROGRAMMES[7].slug,
      PROGRAMMES[10].slug,
      PROGRAMMES[11].slug,
    ],
  }},
  {{
    band: "Utilities, Telecom & Consumer Protection",
    note: "Rate determination, compliance monitoring, and consumer satisfaction",
    slugs: [
      PROGRAMMES[32].slug,
      PROGRAMMES[35].slug,
      PROGRAMMES[36].slug,
      PROGRAMMES[37].slug,
    ],
  }},
  {{
    band: "Foreign Executive Training Hubs",
    note: "International executive study in Kigali, Dubai, London, and Houston",
    slugs: [
      PROGRAMMES[113].slug,
      PROGRAMMES[121].slug,
      PROGRAMMES[126].slug,
      PROGRAMMES[130].slug,
    ],
  }},
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
  {{ title: "All Programmes", to: "/programmes", blurb: "Complete 2026 calendar of 113 Local and 22 Foreign executive training programmes.", type: "Page" }},
  {{ title: "Foreign Training", to: "/executive-education", blurb: "International overseas programmes in Kigali, Dubai, London, and Houston.", type: "Page" }},
  {{ title: "About GIBS", to: "/about", blurb: "Official institutional profile, RC 1178333, mission, vision, guiding principles, and values.", type: "Page" }},
  {{ title: "Faculty & Governance", to: "/faculty", blurb: "Governing Council, management team of 20 Advisors, and Academic Board structure.", type: "Page" }},
  {{ title: "Campuses & Facilities", to: "/campus", blurb: "Ilorin Main HQ, Abuja Center, and Ibafo Center facilities and training capacities.", type: "Page" }},
  {{ title: "Programme Subscription", to: "/admissions", blurb: "Six-step nomination and programme subscription process, requirements, and calendar.", type: "Page" }},
  {{ title: "Research & Insights", to: "/research-insights", blurb: "Manpower development, public sector reforms, and regulatory research.", type: "Page" }},
  {{ title: "Gallery", to: "/gallery", blurb: "Campus infrastructure, lecture halls, guest lodges, and learning environments.", type: "Page" }},
  {{ title: "Events & Conferences", to: "/events", blurb: "Annual capacity-building conferences and executive roundtables.", type: "Page" }},
  {{ title: "Contact GIBS", to: "/contact", blurb: "Official emails, phone lines, Ilorin HQ, Abuja, and Ibafo addresses.", type: "Page" }},
  {{ title: "GIBS AI", to: "/concierge", blurb: "Ask about programmes, campuses and how to subscribe.", type: "Page" }},
];

/* ---------------- 14. Consolidated Authoritative GIBS Data Exports ---------------- */

export const INSTITUTION = INSTITUTIONAL_DATA;
export const CONTACTS = {{
  website: INSTITUTIONAL_DATA.website,
  emails: INSTITUTIONAL_DATA.emails,
  phones: INSTITUTIONAL_DATA.phoneNumbers,
  postalAddress: INSTITUTIONAL_DATA.postalAddress,
}};
export const CAMPUSES = CAMPUS_LOCATIONS;
export const GOVERNANCE = GOVERNANCE_INFO;
export const FACULTY = FACULTY_ADVISORS;
export const ACCREDITATIONS = INSTITUTIONAL_DATA.accreditations;
export const INTERNATIONAL = {{
  technicalPartner: INSTITUTIONAL_DATA.technicalPartner,
  overseasHubs: INSTITUTIONAL_DATA.overseasHubs,
  foreignDestinations: FOREIGN_DESTINATIONS,
}};
export const LOCAL_PROGRAMMES = PROGRAMMES.filter((p) => p.destination === "Local");
export const FOREIGN_PROGRAMMES = PROGRAMMES.filter((p) => p.destination !== "Local");

'''

OUTPUT_PATH.write_text(ts_content, encoding="utf-8")

print(f"Successfully written {OUTPUT_PATH}")
