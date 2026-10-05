import { PageHero } from "../components/PageHero";
import { BtnLink, ClosingImmersive } from "../components/ui";
import { ProgrammeCard, DIRECTORY_GRID } from "../components/cards";
import { Reveal } from "../components/motion";
import { ArrowUpRight } from "../components/icons";
import { Link } from "../lib/router";
import { useSeo } from "../lib/router";
import { PROGRAMMES, IMAGES } from "../lib/data";

const FOREIGN_HUBS = [
  {
    city: "Kigali (Rwanda)",
    coursesCount: 8,
    fee: "$4,800 USD",
    dates: "June – November 2026",
    summary: "East Africa regional hub for service quality, ICT literacy, business process management, ethics, customer relationship, and regulatory compliance.",
  },
  {
    city: "Dubai (UAE)",
    coursesCount: 5,
    fee: "$4,800 USD",
    dates: "July – December 2026",
    summary: "Middle East innovation hub for administrative management, secretarial techniques, utilities regulation, leadership innovation, and interpersonal skills.",
  },
  {
    city: "London (UK)",
    coursesCount: 4,
    fee: "£4,800 GBP",
    dates: "July – October 2026",
    summary: "European executive hub for top utility regulators, telecom executives, ICT security awareness, and knowledge management.",
  },
  {
    city: "Houston, Texas (USA)",
    coursesCount: 5,
    fee: "$5,000 – $9,500 USD",
    dates: "June – November 2026",
    summary: "North American technology & energy hub for smart cities, Big Data, AI/5G, knowledge management, and utilities regulatory management (1–2 week options).",
  },
];

export default function ExecutiveEducation() {
  useSeo({
    title: "Foreign Executive Training & In-Plant Workshops — GIBS",
    description:
      "Explore 22 Foreign Executive Training Programmes across Kigali, Dubai, London, and Houston, plus customized in-plant workshops for organizations.",
  });

  const foreignProgrammes = PROGRAMMES.filter((p) => p.destination !== "Local");

  return (
    <>
      <PageHero
        image={IMAGES.boardroom}
        imageAlt="GIBS Foreign Executive Training Hubs"
        eyebrow="International & Customized Training"
        title="Training abroad and in-plant"
        intro="22 foreign executive programmes run in Kigali, Dubai, London and Houston, alongside in-plant workshops built around your organisation's own systems."
        breadcrumbs={[{ label: "Foreign & Executive Training" }]}
        meta={
          <div className="flex flex-wrap gap-3">
            <BtnLink
              to="/contact?type=Foreign+Training+Programmes+(Kigali,+Dubai,+London,+Houston)"
              variant="gold"
              size="md"
            >
              Enquire
              <ArrowUpRight className="h-3.5 w-3.5" />
            </BtnLink>
            <BtnLink
              to="/contact?type=Customized+In-Plant+Workshop+Request"
              variant="outline-light"
              size="md"
            >
              Request In-Plant Workshop
            </BtnLink>
          </div>
        }
      />

      {/* 4 International Hubs Grid */}
      <section className="bg-white section-y">
        <div className="container-x grid lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">4 International Destinations</p>
              <h2 className="type-h2 mt-4 text-ink">
                Foreign Executive Training <em className="italic text-forest-700">Hubs.</em>
              </h2>
              <p className="mt-3 max-w-prose type-body">
                In technical partnership with the Pacific Institute of Technology, Georgia, USA.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:col-span-7 lg:mt-0">
            {FOREIGN_HUBS.map((hub) => (
              <div key={hub.city} className="flex flex-col border border-line bg-paper p-7 shadow-crisp">
                <span className="pill pill-forest self-start">
                  {hub.coursesCount} Programmes
                </span>
                <h3 className="display-serif mt-4 text-2xl text-ink">{hub.city}</h3>
                <p className="mt-1 text-[13px] font-bold text-forest-700">Fee: {hub.fee}</p>
                <p className="text-[12px] font-medium text-muted">Schedule: {hub.dates}</p>
                <p className="mt-4 flex-1 text-[13.5px] leading-relaxed text-ink/80 max-w-prose">{hub.summary}</p>
                <div className="mt-6 border-t rule pt-4">
                  <Link
                    to="/programmes"
                    className="inline-flex min-h-[24px] items-center gap-1 text-[13px] font-bold text-forest-700 hover:text-forest-900"
                  >
                    View courses
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* In-Plant Customized Workshops */}
      <section className="border-y border-line bg-forest-900 section-y text-ivory">
        <div className="container-x grid lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow-light">Customized In-Plant Delivery</p>
              <h2 className="type-h2 mt-4">
                Bring GIBS faculty and curriculum directly to your organization
              </h2>
              <p className="mt-6 text-[15.5px] leading-relaxed text-ivory/85 max-w-prose">
                GIBS designs and delivers customized in-plant workshops for government ministries,
                departments, agencies, and private corporate bodies. Courses can be tailored to
                address your specific operating challenges, scheduled at your preferred venue and dates.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <BtnLink
                  to="/contact?type=Customized+In-Plant+Workshop+Request"
                  variant="gold"
                  size="lg"
                >
                  Request In-Plant Proposal
                  <ArrowUpRight className="h-4 w-4" />
                </BtnLink>
                <BtnLink to="/contact" variant="outline-light" size="lg">
                  Speak with Registry
                </BtnLink>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-ivory/20 bg-forest-950/70 p-7 shadow-lift max-w-editorial">
              <p className="eyebrow-light text-gold-300">In-Plant Advantages</p>
              <ul className="mt-5 space-y-4 text-[14px] text-ivory/85">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-400" />
                  <span>Cost-effective team training at your institutional facility</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-400" />
                  <span>Curriculum customized to internal SOPs, systems, and challenges</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-400" />
                  <span>Flexible scheduling aligned with organizational calendars</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-400" />
                  <span>Full GIBS &amp; CMD accredited certification for all participants</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* All 22 Foreign Programmes List */}
      <section className="bg-white section-y">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b rule pb-6">
            <div>
              <p className="eyebrow">2026 Overseas Calendar</p>
              <h2 className="type-h2 mt-2 text-ink">
                All 22 Foreign Training Programmes
              </h2>
            </div>
            <p className="meta">{foreignProgrammes.length} International Courses</p>
          </div>

          <div className={"mt-6 border-t rule pt-6 " + DIRECTORY_GRID}>
            {foreignProgrammes.map((p, idx) => (
              <div key={p.id}>
                <ProgrammeCard programme={p} index={idx} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <ClosingImmersive
        image={IMAGES.city}
        alt="International Executive Training"
        eyebrow="Overseas Subscription"
        title="Training outside Nigeria"
        body="Our international desk can issue visa support letters, confirm itineraries and process nominations for the Miami, Houston, London, Dubai, Cape Town, Durban, Kigali, Netherlands and Ghana hubs."
        actions={
          <>
            <BtnLink
              to="/contact?type=Foreign+Training+Programmes+(Kigali,+Dubai,+London,+Houston)"
              variant="gold"
              size="lg"
            >
              Enquire
            </BtnLink>
            <BtnLink to="/concierge" variant="outline-light" size="lg">
              Ask GIBS AI
            </BtnLink>
          </>
        }
      />
    </>
  );
}
