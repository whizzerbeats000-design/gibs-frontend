import { PageHero } from "../components/PageHero";
import { BtnLink, ClosingImmersive, ArrowTextLink } from "../components/ui";
import { ProgramRow } from "../components/cards";
import { Reveal } from "../components/motion";
import { ArrowUpRight } from "../components/icons";
import { Link } from "../lib/router";
import { useSeo } from "../lib/router";
import { getProgramme, IMAGES, INTERNATIONAL, INSTITUTION } from "../lib/data";

const ENGAGEMENT = [
  {
    n: "01",
    title: "Diagnose",
    body: "A confidential conversation to identify the real institutional question beneath the stated brief.",
  },
  {
    n: "02",
    title: "Design",
    body: "A learning architecture built jointly: faculty, cases, rhythm and measures of success.",
  },
  {
    n: "03",
    title: "Deliver",
    body: "Faculty-led convening, coaching and application work woven into the organization's calendar.",
  },
  {
    n: "04",
    title: "Measure",
    body: "Impact assessed against the institution's own outcomes. The measure of success is whether decisions changed.",
  },
];

const FOREIGN_HUBS = [
  { destination: "Kigali, Rwanda", fee: "$4,800 USD", currency: "USD", note: "8 specialized executive programs" },
  { destination: "Dubai, UAE", fee: "$4,800 USD", currency: "USD", note: "5 specialized executive programs" },
  { destination: "London, UK", fee: "£4,800 GBP", currency: "GBP", note: "4 specialized executive programs" },
  { destination: "Houston, Texas", fee: "$5,000 – $9,500 USD", currency: "USD", note: "5 specialized executive programs" },
];

export default function ExecutiveEducation() {
  useSeo({
    title: `Executive Education & Foreign Training — ${INSTITUTION.abbreviation}`,
    description: `Executive education, in-plant customized workshops, and international training programs in Kigali, Dubai, London, and Houston by ${INSTITUTION.legalName}.`,
  });

  const open = getProgramme("executive-education")!;
  const custom = getProgramme("custom-programmes")!;

  return (
    <>
      <PageHero
        image={IMAGES.boardroom}
        imageAlt="GIBS executive learning environment"
        eyebrow="Executive Education & Capacity Development"
        title="Leadership for those already"
        italic="operating at scale."
        intro={`${INSTITUTION.legalName} delivers executive open programs, in-plant customized workshops, and foreign training in key international hubs.`}
        breadcrumbs={[{ label: "Executive Education" }]}
      />

      {/* Two tracks */}
      <section className="bg-white">
        <div className="container-x py-20 sm:py-24">
          <div className="grid gap-px overflow-hidden border border-line bg-line lg:grid-cols-2">
            {[
              {
                p: open,
                eyebrowText: "For Individuals & Executives",
                body: "Short, intensive convenings for rising and senior leaders, focused, practical and taught by faculty and advisors who work inside real institutions.",
              },
              {
                p: custom,
                eyebrowText: "In-Plant & Custom Workshops",
                body: "Custom leadership journeys and in-plant workshops designed for boards, public sector agencies, and private enterprises.",
              },
            ].map(({ p, eyebrowText, body }) => (
              <div key={p.slug} className="bg-white p-8 sm:p-12">
                <Reveal>
                  <p className="eyebrow">{eyebrowText}</p>
                  <h2 className="display-serif type-h2 mt-4 text-ink">{p.title}</h2>
                  <p className="mt-5 type-body">{body}</p>
                  <ul className="mt-6 space-y-3">
                    {p.indicativeStructure.slice(0, 3).map((item) => (
                      <li key={item} className="flex gap-3 type-body text-ink/80">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/programmes/${p.slug}`}
                    className="group link-underline mt-8 inline-flex text-sm font-semibold text-forest-700"
                  >
                    Programme detail
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Foreign Training Catalogue Highlights */}
      <section className="border-y border-line bg-forest-900 text-ivory py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow-light">International Training Locations</p>
            <h2 className="display-serif type-h2 mt-4 text-ivory">
              Foreign Training Destinations & Currencies
            </h2>
            <p className="mt-3 type-body text-ivory/80 max-w-2xl">
              Academic Technical Partner: <strong className="text-gold-300">{INTERNATIONAL.technicalPartner}</strong>. Foreign training is hosted across four primary international destinations with destination-specific pricing:
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FOREIGN_HUBS.map((hub) => (
              <Reveal key={hub.destination}>
                <div className="border border-gold-500/30 bg-forest-950 p-6 h-full flex flex-col justify-between">
                  <div>
                    <span className="chip border-gold-400/40 bg-gold-400/10 text-gold-300 font-mono text-[12px] px-3 py-1">
                      {hub.currency}
                    </span>
                    <h3 className="display-serif type-h3 mt-3 text-ivory">{hub.destination}</h3>
                    <p className="mt-2 text-[13px] text-ivory/70">{hub.note}</p>
                  </div>
                  <div className="mt-6 border-t rule-light pt-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-300">Tuition Fee</p>
                    <p className="display-serif text-lg font-semibold text-ivory mt-1">{hub.fee}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 border-t rule-light pt-6">
            <p className="text-[12px] text-ivory/70">
              Additional overseas hubs include: {INTERNATIONAL.overseasHubs.join(", ")}.
            </p>
          </div>
        </div>
      </section>

      {/* Custom engagement method */}
      <section className="paper-grain bg-paper">
        <div className="container-x py-20 sm:py-24">
          <Reveal>
            <p className="eyebrow">The Method</p>
            <h2 className="display-serif type-h2 mt-5 max-w-3xl text-ink">
              In-Plant & Custom Work Method
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {ENGAGEMENT.map((step) => (
              <Reveal key={step.n} delay={0.05 * Number(step.n)}>
                <p className="text-[11px] font-medium tracking-[0.14em] text-muted">{step.n}</p>
                <h3 className="display-serif type-h3 mt-4 text-ink">{step.title}</h3>
                <p className="mt-3 type-body">{step.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* All executive programmes */}
      <section className="border-t border-line bg-white">
        <div className="container-x py-20 sm:py-24">
          <Reveal>
            <p className="eyebrow">Executive pathways</p>
          </Reveal>
          <div className="mt-8 border-t rule">
            <ProgramRow programme={open} index={0} />
            <ProgramRow programme={custom} index={1} />
          </div>
          <div className="mt-10">
            <ArrowTextLink to="/contact?type=Custom+programmes+for+my+organization">
              Commission a conversation about custom work
            </ArrowTextLink>
          </div>
        </div>
      </section>

      <ClosingImmersive
        image={IMAGES.seminar}
        alt="Executives in a GIBS convening"
        eyebrow="Executive Education"
        title="Bring a capacity question."
        italic="We'll bring the team."
        body="Commission a custom in-plant workshop or enroll in our foreign training cohorts."
        actions={
          <>
            <BtnLink to="/contact?type=Executive+education" variant="gold" size="lg">
              Speak with the team
            </BtnLink>
            <BtnLink to="/concierge" variant="outline-light" size="lg">
              Ask the Concierge
            </BtnLink>
          </>
        }
      />
    </>
  );
}
