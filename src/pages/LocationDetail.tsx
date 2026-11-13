import { PageHero } from "../components/PageHero";
import { BtnLink, ClosingQuiet } from "../components/ui";
import { Reveal } from "../components/motion";
import { useSeo } from "../lib/router";
import { PROGRAMMES } from "../lib/data";
import { MapPinIcon } from "../components/icons";
import { gibsResponsiveImage } from "../lib/gibsResponsiveImages";

export type LocationSlug = "ilorin" | "abuja" | "ibafo";

interface LocationConfig {
  id: string;
  slug: LocationSlug;
  name: string;
  shortName: string;
  eyebrow: string;
  title: string;
  italic: string;
  heroImage: string;
  heroImageAlt: string;
  intro: string;
  address: string;
  postal?: string;
  city: string;
  state: string;
  telephone: string;
  email: string;
  highlights: string[];
  academicFacilities: string;
  recreationalFacilities?: string;
  facilityDescription: string;
  capacityNote: string;
  galleryImages: { src: string; alt: string; caption: string }[];
}

const LOCATION_DATA: Record<LocationSlug, LocationConfig> = {
  ilorin: {
    id: "ilorin-hq",
    slug: "ilorin",
    name: "Ilorin Training Headquarters",
    shortName: "Ilorin Headquarters",
    eyebrow: "Permanent Headquarters · Kwara State",
    title: "Ilorin Training",
    italic: "Headquarters.",
    heroImage: "/images/gibs-hq-architecture-edited-branded.webp",
    heroImageAlt: "Goshen International Business School headquarters architecture and signage in Ilorin",
    intro: "The primary administrative and executive training headquarters of Goshen International Business School (GIBS), located in Upper Gaa-Akanbi, Ilorin. Features 12 modern lecture rooms, a 100-seat multi-purpose hall, executive guest accommodation, and comprehensive sports grounds.",
    address: "No 81, Olorunsogo Street, Off Agbabiaka Road, Upper Gaa - Akanbi, Ilorin, Kwara State, Nigeria",
    postal: "P.O. Box 63, Ilorin General Post Office, Kwara State",
    city: "Ilorin",
    state: "Kwara State",
    telephone: "+2348160010401",
    email: "info@gibs.com.ng",
    highlights: [
      "12 Modern Lecture Rooms with Multimedia Integration",
      "Comprehensive Reference Library for Executive Research",
      "100-Person Multi-Purpose Conference Hall",
      "20-Room Executive Guest Lodge for Residential Cohorts",
      "Olympic-Size Lawn Tennis Court & Keep-Fit Grounds",
      "Dedicated Transportation Fleet (16-Seater and 6-Seater Vehicles)",
      "24/7 Dedicated Power Supply and Perimeter Security",
    ],
    academicFacilities: "12 Lecture Rooms, Reference Library, 100-person capacity Hall, 20-Room Executive Guest Facility",
    recreationalFacilities: "Olympic-size Lawn Tennis court, International standard Table Tennis, Open space keep-fit grounds, 3 medium-size breakout halls, 24/7 dedicated power supply, assured security",
    facilityDescription: "Designed for concurrent syndicate workshops, executive seminars, and plenary sessions in the 100-person multi-purpose conference hall, supported by an on-site 20-room executive guest lodge and modern reference library.",
    capacityNote: "Plenary conference hall capacity of 100 delegates, with 12 lecture rooms supporting concurrent syndicate workshop streams.",
    galleryImages: [
      {
        src: "/images/gibs-hq-classroom-branded.webp",
        alt: "Executive classroom at GIBS Ilorin headquarters",
        caption: "Air-conditioned lecture hall with multimedia teaching tools",
      },
      {
        src: "/images/gibs-hq-guest-residence-branded.webp",
        alt: "Executive guest lodge at GIBS Ilorin headquarters",
        caption: "On-site 20-room executive residential lodge for workshop delegates",
      },
      {
        src: "/images/gibs-hq-reception-room-branded.webp",
        alt: "Administrative reception at GIBS Ilorin headquarters",
        caption: "Administrative reception and delegate registration desk",
      },
    ],
  },
  abuja: {
    id: "abuja-center",
    slug: "abuja",
    name: "Abuja Executive Training Centre",
    shortName: "Abuja Centre",
    eyebrow: "Federal Capital Territory Center",
    title: "Abuja Executive",
    italic: "Training Centre.",
    heroImage: "/images/gibs-abuja-architecture-branded.webp",
    heroImageAlt: "GIBS Abuja executive training facility in FHA Lugbe",
    intro: "Purpose-built executive training facility in FHA Lugbe, Airport Road, Abuja. Strategically positioned for Federal Ministries, Departments, Agencies (MDAs), and corporate organisations across the Federal Capital Territory.",
    address: "Plot 194, Lugbe 1 Layout, Near Okay Centre, Direct Behind Rainoil filling station, FHA Lugbe, Airport Road, Abuja",
    postal: "FHA Lugbe, Airport Road, Abuja, FCT",
    city: "Abuja",
    state: "Federal Capital Territory",
    telephone: "+2348160010401",
    email: "info@gibs.com.ng",
    highlights: [
      "2 Large Conference Halls (100-Person Capacity Each)",
      "7 Air-Conditioned Executive Lecture Rooms",
      "2 Dedicated Syndicate & Syndicate Breakout Rooms",
      "3-Room Executive Guest Facility",
      "2 Standby Heavy-Duty Power Generating Sets",
      "18 Modern Restrooms and Secure On-Site Parking",
    ],
    academicFacilities: "2 Halls (100-person capacity each), 7 Lecture Rooms, 2 Administrative offices, 2 Syndicate rooms, 3-Room guest facility",
    facilityDescription: "Configured for executive seminars, concurrent syndicate groups, and conference sessions across two 100-person capacity halls and dedicated breakout rooms.",
    capacityNote: "Two conference halls with 100-person capacity each (up to 200 delegates total across both halls), supplemented by 7 lecture rooms and 2 breakout syndicate rooms.",
    galleryImages: [
      {
        src: "/images/gibs-abuja-office-branded.webp",
        alt: "Executive administration office at GIBS Abuja Centre",
        caption: "Executive administrative offices and conference coordination desk",
      },
      {
        src: "/images/gibs-abuja-school-exterior-branded.webp",
        alt: "Exterior facade of GIBS Abuja Centre in Lugbe",
        caption: "Secure training facility entrance along Airport Road corridor",
      },
    ],
  },
  ibafo: {
    id: "ibafo-center",
    slug: "ibafo",
    name: "Ibafo Training Centre",
    shortName: "Ibafo Centre",
    eyebrow: "Lagos-Ibadan Corridor Center · Ogun State",
    title: "Ibafo Training",
    italic: "Centre.",
    heroImage: "/images/gibs-ibafo-architecture-branded.webp",
    heroImageAlt: "GIBS Ibafo training facility along Lagos-Ibadan Expressway",
    intro: "Situated at KM 36 on the Lagos-Ibadan Expressway, serving corporate and public-sector organisations across Lagos, Ogun, and the South-West commercial corridor with dedicated seminar and syndicate rooms.",
    address: "KM 36, Lagos - Ibadan Express Road, Adjacent Dap-Mude Hotel, Behind World Oil Station, Ibafo, Ogun State, Nigeria",
    postal: "KM 36 Lagos-Ibadan Expressway, Ibafo, Ogun State",
    city: "Ibafo",
    state: "Ogun State",
    telephone: "+2348160010401",
    email: "info@gibs.com.ng",
    highlights: [
      "1 Main Executive Conference Hall",
      "4 Air-Conditioned Lecture Rooms",
      "4 Syndicate & Breakout Rooms",
      "Strategic Lagos-Ibadan Expressway Corridor Access",
      "Dedicated Standby Generator Power",
    ],
    academicFacilities: "1 Hall, 4 Lecture Rooms, 4 Syndicate Rooms",
    facilityDescription: "Purpose-built for corporate seminars, intensive management retreats, and syndicate breakout sessions serving organisations along the Lagos-Ibadan industrial corridor.",
    capacityNote: "Executive conference hall and 4 lecture rooms supplemented by 4 dedicated breakout syndicate rooms. Specific seating arrangements are configured per session upon enquiry.",
    galleryImages: [
      {
        src: "/images/gibs-ibafo-front-gate-branded.webp",
        alt: "Secure entrance gate of GIBS Ibafo Training Centre",
        caption: "Secure entrance gate and perimeter along the expressway corridor",
      },
    ],
  },
};

export default function LocationDetail({ locationId }: { locationId: LocationSlug }) {
  const config = LOCATION_DATA[locationId] || LOCATION_DATA.ilorin;

  useSeo({
    title: `${config.name} | Goshen International Business School`,
    description: `${config.shortName} of Goshen International Business School (GIBS). Located at ${config.address}. Verified executive capacity-building facilities, lecture halls, and delegate amenities.`,
  });

  // Filter programmes scheduled at this campus
  const locationTag = locationId === "ilorin" ? "Ilorin" : locationId === "abuja" ? "Abuja" : "Ibafo";
  const scheduledProgrammes = PROGRAMMES.filter(
    (p) => p.schedule && p.schedule.toLowerCase().includes(locationTag.toLowerCase())
  ).slice(0, 6);

  return (
    <>
      <PageHero
        image={config.heroImage}
        imageAlt={config.heroImageAlt}
        eyebrow={config.eyebrow}
        title={config.title}
        italic={config.italic}
        intro={config.intro}
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Campuses & Facilities", to: "/contact" },
          { label: config.shortName },
        ]}
      />

      {/* Facility Highlights & Address */}
      <section className="paper-grain bg-paper overflow-hidden">
        <div className="container-x section-y grid gap-12 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <Reveal>
              <p className="eyebrow">Verified Capacity</p>
              <h2 className="type-h2 mt-4 text-ink">
                Academic &amp; Training <em className="italic text-forest-700">Facilities.</em>
              </h2>
              <p className="type-body mt-4 text-ink/80">
                {config.academicFacilities}. {config.facilityDescription}
              </p>
            </Reveal>

            <div className="mt-8 border-t border-line/70">
              {config.highlights.map((h, i) => (
                <Reveal key={h} delay={i * 0.03}>
                  <div className="flex items-start gap-3.5 border-b border-line/70 py-3.5">
                    <span className="font-mono text-xs font-semibold tabular-nums text-forest-700 pt-0.5">
                      0{i + 1}
                    </span>
                    <span className="type-body text-ink font-medium break-words">{h}</span>
                  </div>
                </Reveal>
              ))}
            </div>

            {config.recreationalFacilities && (
              <Reveal delay={0.2}>
                <div className="mt-6 rounded-panel border border-forest-700/25 bg-forest-50/60 p-5">
                  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-forest-800">Recreational &amp; Delegate Welfare Amenities</p>
                  <p className="type-body mt-2 text-ink/85 break-words">{config.recreationalFacilities}</p>
                </div>
              </Reveal>
            )}
          </div>

          <div className="min-w-0 lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="rounded-panel border border-forest-950/[0.08] bg-white p-5 sm:p-6 shadow-crisp">
                <div className="flex items-center gap-2 text-forest-800">
                  <MapPinIcon className="h-5 w-5 shrink-0" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider">Physical Address</span>
                </div>
                <h3 className="type-h3 mt-3 text-ink break-words">{config.name}</h3>
                <p className="type-body mt-3 text-ink/80 break-words">{config.address}</p>
                {config.postal && (
                  <p className="type-caption mt-2 text-muted break-words">
                    <strong>Postal Reference:</strong> {config.postal}
                  </p>
                )}

                <div className="mt-6 border-t border-line/70 pt-4">
                  <p className="font-mono text-xs uppercase tracking-wider text-muted">Institutional Registry</p>
                  <p className="type-body mt-1 text-ink font-medium break-words">
                    Goshen International Business School Limited (RC 1178333)
                  </p>
                  <p className="type-caption text-ink/70 break-words">
                    Accredited by Centre for Management Development (CMD) · ITF &amp; NSITF Compliant
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <BtnLink
                    to={`/contact?center=${config.slug}`}
                    variant="primary"
                    className="w-full text-center whitespace-normal py-3"
                  >
                    Enquire for {config.shortName}
                  </BtnLink>
                  <a
                    href={`tel:${config.telephone}`}
                    className="btn btn-outline-ink w-full text-center whitespace-normal py-3"
                  >
                    Call Training Desk ({config.telephone})
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Campus Capacity Metric */}
            <Reveal delay={0.15}>
              <div className="mt-6 rounded-panel border border-forest-600/20 bg-forest-50/50 p-5">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-forest-800">Operational Capacity</p>
                <p className="type-caption mt-1 text-ink/85 break-words">
                  {config.capacityNote}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Photo Gallery of Physical Facilities */}
      {config.galleryImages.length > 0 && (
        <section className="border-t border-line bg-white">
          <div className="container-x section-y">
            <Reveal>
              <p className="eyebrow">On-Site Infrastructure</p>
              <h2 className="type-h2 mt-4 text-ink">
                Facility <em className="italic text-forest-700">Photographs.</em>
              </h2>
              <p className="type-body mt-2 max-w-2xl text-ink/75">
                Verified images of the training rooms, administration offices, and delegate facilities at our {config.shortName}.
              </p>
            </Reveal>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {config.galleryImages.map((img, idx) => (
                <Reveal key={img.src} delay={idx * 0.08}>
                  <figure className="group overflow-hidden rounded-panel border border-line bg-paper">
                    <img
                      {...gibsResponsiveImage(img.src)}
                      alt={img.alt}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="aspect-video w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <figcaption className="p-4">
                      <p className="type-body text-ink font-medium">{img.caption}</p>
                      <p className="type-caption mt-1 text-muted">{config.shortName}</p>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Programmes Scheduled at this Centre */}
      {scheduledProgrammes.length > 0 && (
        <section className="border-t border-line bg-paper overflow-hidden">
          <div className="container-x section-y">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow">2026 Calendar</p>
                <h2 className="type-h2 mt-2 text-ink">
                  Programmes at <em className="italic text-forest-700">{config.shortName}.</em>
                </h2>
              </div>
              <BtnLink to="/programmes" variant="outline-ink" className="whitespace-normal text-center">
                View All 135 Programmes
              </BtnLink>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {scheduledProgrammes.map((p) => (
                <a
                  key={p.code}
                  href={`/programmes/${p.slug}`}
                  className="group flex flex-col justify-between rounded-panel border border-line bg-white p-5 shadow-crisp transition hover:border-forest-700 min-w-0"
                >
                  <div className="min-w-0">
                    <span className="label-base text-forest-800 font-semibold">{p.code}</span>
                    <h3 className="card-title mt-2 text-ink group-hover:text-forest-800 break-words">
                      {p.title}
                    </h3>
                    <p className="type-caption mt-2 text-muted break-words">{p.category}</p>
                  </div>
                  <div className="mt-4 border-t border-line/60 pt-3 flex items-center justify-between text-ink/75 text-sm">
                    <span>{p.duration || "5 Days"}</span>
                    <span className="font-semibold text-forest-900">
                      ₦{p.fee ? p.fee.toLocaleString() : "Contact GIBS"}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Institutional Closing CTA */}
      <ClosingQuiet
        eyebrow="National Executive Capacity Building"
        title="Register or Schedule an Institutional In-Plant Session"
        body={`Connect with the GIBS training desk for workshop enrolments, group sponsorships, or customised corporate programmes at our ${config.shortName}.`}
        actions={
          <BtnLink to={`/contact?center=${config.slug}`} variant="primary" className="whitespace-normal text-center py-3">
            Contact {config.shortName}
          </BtnLink>
        }
      />
    </>
  );
}
