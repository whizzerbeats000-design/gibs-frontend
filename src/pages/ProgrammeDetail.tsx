import { PageHero } from "../components/PageHero";
import { BtnLink, DataNote } from "../components/ui";
import { FaqAccordion } from "../components/cards";
import { ProgrammeNav, type ProgrammeSection } from "../components/ProgrammeNav";
import { CheckIcon, ArrowUpRight, ArrowLeft, Diamond } from "../components/icons";
import { Link } from "../lib/router";
import { getProgramme, relatedProgrammes, DATA_REQUIRED, IMAGES } from "../lib/data";
import { useSeo } from "../lib/router";
import { Reveal } from "../components/motion";
import NotFound from "./NotFound";

const HERO_BY_SLUG: Record<string, { image: string; alt: string }> = {
  mba: { image: IMAGES.colonnade, alt: "The GIBS colonnade walked by MBA fellows" },
  "executive-mba": { image: IMAGES.boardroom, alt: "The GIBS library — a quiet environment for executive study" },
  "doctorate-business-administration": { image: IMAGES.books, alt: "The GIBS library with oak shelving and warm research light" },
  "executive-education": { image: IMAGES.lecture, alt: "A sunlit interior study space at GIBS" },
  "custom-programmes": { image: IMAGES.seminar, alt: "Sunlight through the sandstone colonnade of the GIBS campus" },
  "undergraduate-business": { image: IMAGES.study, alt: "The GIBS library — a space for focused undergraduate study" },
};

const SECTIONS: ProgrammeSection[] = [
  { id: "overview", label: "Overview" },
  { id: "audience", label: "Who it is for" },
  { id: "curriculum", label: "Curriculum & structure" },
  { id: "experience", label: "The experience" },
  { id: "faculty", label: "Faculty" },
  { id: "admissions", label: "Admissions" },
  { id: "faq", label: "FAQ" },
];

const SPINE = [
  {
    phase: "I",
    title: "Core scholarship",
    body: "The management disciplines every leader must read, write and reason with fluently.",
  },
  {
    phase: "II",
    title: "Practice & rehearsal",
    body: "Cases, conversations and repeated practice that turn knowledge into judgment.",
  },
  {
    phase: "III",
    title: "Applied work",
    body: "An institutional or strategic project carried back into the fellow's own organization.",
  },
];

function cleanPending(v: string) {
  const t = v
    .split(DATA_REQUIRED)
    .join(" ")
    .replace(/^[\s—–-]+/, "")
    .replace(/[\s—–-]+$/, "")
    .replace(/\s+/g, " ")
    .trim();
  return t || "To be published";
}

function FactRow({ label, value, pending }: { label: string; value: string; pending?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b rule py-4 last:border-b-0">
      <dt className="meta shrink-0">{label}</dt>
      <dd className={`text-right text-[13.5px] leading-relaxed ${pending ? "italic text-muted" : "text-ink"}`}>
        {pending ? cleanPending(value) : value}
      </dd>
    </div>
  );
}

export default function ProgrammeDetail({ slug }: { slug: string }) {
  const programme = getProgramme(slug);

  useSeo({
    title: programme ? `${programme.title} — GIBS` : "Programme not found — GIBS",
    description: programme?.summary ?? "",
  });

  if (!programme) return <NotFound />;

  const related = relatedProgrammes(slug, 3);

  return (
    <>
      <PageHero
        image={HERO_BY_SLUG[slug]?.image ?? IMAGES.library}
        imageAlt={HERO_BY_SLUG[slug]?.alt ?? `Learning environment for the GIBS ${programme.title}`}
        eyebrow={`${programme.category} Programme`}
        title={programme.title}
        intro={programme.tagline + "."}
        breadcrumbs={[
          { label: "Programmes", to: "/programmes" },
          { label: programme.title },
        ]}
        meta={
          <div className="flex flex-wrap gap-3">
            <BtnLink to="/admissions" variant="gold" size="md">
              Apply for this programme
              <ArrowUpRight className="h-3.5 w-3.5" />
            </BtnLink>
            <BtnLink to="/concierge" variant="outline-light" size="md">
              Ask the Concierge
            </BtnLink>
          </div>
        }
      />

      <ProgrammeNav sections={SECTIONS} />

      {/* Overview */}
      <section id="overview" className="bg-paper">
        <div className="container-x grid gap-12 py-20 sm:py-24 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">Overview</p>
              <p className="prose-editorial mt-5 max-w-[62ch]">{programme.summary}</p>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky" style={{ top: "calc(var(--sticky-top) + 16px)" }}>
              <Reveal y={32}>
                <div className="border border-line bg-white p-7 shadow-card sm:p-8">
                  <p className="eyebrow">At a glance</p>
                  <dl className="mt-5">
                    <FactRow label="Category" value={programme.category} />
                    <FactRow label="Type" value={programme.programmeType} />
                    <FactRow label="Format" value={programme.format} />
                    <FactRow label="Duration" value={programme.duration} />
                    <FactRow label="Schedule" value={programme.schedule} />
                    <FactRow label="Location" value={programme.location} />
                    <FactRow label="Tuition Fee" value={programme.fee || programme.fees} />
                  </dl>
                  <div className="mt-7">
                    <DataNote label="Official GIBS 2026 Calendar">
                      Fees and cohort dates are fixed per official calendar. Registration closes 14 days prior to cohort start.
                    </DataNote>
                  </div>
                  <BtnLink to="/admissions" variant="primary" size="lg" className="mt-7 w-full">
                    Apply Now
                    <ArrowUpRight className="h-4 w-4" />
                  </BtnLink>
                  <BtnLink to="/contact" variant="outline-ink" size="lg" className="mt-3 w-full">
                    Request details
                  </BtnLink>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Audience + outcomes */}
      <section id="audience" className="border-y border-line bg-white">
        <div className="container-x grid gap-14 py-20 sm:py-24 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow">Who it is for</p>
            <ul className="mt-7 space-y-5">
              {programme.audience.map((a) => (
                <li key={a} className="flex items-start gap-3.5 type-body">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-forest-600" />
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">What fellows take away</p>
            <ul className="mt-7 space-y-5">
              {programme.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-3.5 type-body">
                  <Diamond className="mt-1.5 h-2 w-2 shrink-0 text-gold-600" />
                  {o}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Curriculum & structure */}
      <section id="curriculum" className="paper-grain bg-paper">
        <div className="container-x py-20 sm:py-24">
          <Reveal>
            <p className="eyebrow">Curriculum & structure</p>
            <h2 className="type-h2 mt-5 max-w-3xl text-ink">
              One deliberate spine, <em className="italic text-forest-700">built</em> for each pathway.
            </h2>
            <p className="mt-5 max-w-2xl type-body">
              The spine below describes how a GIBS programme is built. Module
              titles, credits and calendar are published by academic affairs
              once confirmed.
            </p>
          </Reveal>

          {/* Indicative content */}
          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <ol className="border-t rule lg:col-span-7">
              {programme.indicativeStructure.map((item, i) => (
                <li key={i} className="grid grid-cols-[2.75rem_1fr] gap-4 border-b rule py-6">
                  <span className="text-[11px] font-bold tracking-[0.16em] text-forest-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="type-body text-ink/85">{item}</p>
                </li>
              ))}
            </ol>

            {/* Delivery phases */}
            <Reveal delay={0.1} className="lg:col-span-5">
              <p className="meta">Indicative structure</p>
              <div className="mt-5 border border-line bg-white p-7 shadow-card sm:p-8">
                {SPINE.map((s) => (
                  <div key={s.phase} className="flex gap-5 border-b rule py-5 first:pt-0 last:border-b-0 last:pb-0">
                    <span className="display-serif text-2xl text-gold-600">{s.phase}</span>
                    <div>
                      <h3 className="display-serif type-h3 text-ink">{s.title}</h3>
                      <p className="mt-1.5 type-body">{s.body}</p>
                    </div>
                  </div>
                ))}
                <p className="mt-6 text-[12px] italic leading-relaxed text-muted">
                  Sequencing, duration and calendar to be published.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Learning experience */}
      <section id="experience" className="bg-white">
        <div className="container-x grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-12 lg:gap-14">
          <Reveal y={36} className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={IMAGES.library}
                alt="The library with oak, brass lamps and quiet reading light"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-forest-950/20" />
              <div className="absolute inset-0 ring-1 ring-inset ring-ink/10" />
            </div>
          </Reveal>
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow">The learning experience</p>
              <h2 className="type-h2 mt-5 text-ink">
                Designed for two moments: deep study, and the conversation after.
              </h2>
              <p className="mt-5 max-w-xl type-body">
                GIBS teaches through case discussion, faculty-led inquiry and
                applied practice, in rooms built for argument. They make passive
                listening difficult. The library gives serious adult learning
                the space and time it needs.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                <Link to="/campus" className="group link-underline text-sm font-semibold text-forest-700">
                  Explore the campus
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link to="/executive-education" className="group link-underline text-sm font-semibold text-forest-700">
                  Executive formats
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Faculty */}
      <section id="faculty" className="border-y border-line bg-forest-900 text-ivory">
        <div className="container-x grid gap-10 py-16 sm:py-20 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow-light">Faculty</p>
              <h2 className="type-h2 mt-5">Taught by scholar-practitioners</h2>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <p className="max-w-2xl type-body text-ivory/85">
                GIBS faculty move between the academy and the institutions
                their scholarship describes. Programme-specific assignments
                and biographies are published as appointments are confirmed.
              </p>
              <div className="mt-8">
                <DataNote light label="Faculty to be published">
                  No names or credentials are shown speculatively.
                </DataNote>
              </div>
              <BtnLink to="/faculty" variant="gold" size="md" className="mt-8">
                Faculty & research
                <ArrowUpRight className="h-3.5 w-3.5" />
              </BtnLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Admissions requirements */}
      <section id="admissions" className="bg-paper">
        <div className="container-x grid gap-10 py-20 sm:py-24 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow">Admissions</p>
              <h2 className="type-h2 mt-5 text-ink">Requirements</h2>
              <BtnLink to="/admissions" variant="outline-ink" size="md" className="mt-8">
                The six-step journey
                <ArrowUpRight className="h-3.5 w-3.5" />
              </BtnLink>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <DataNote label="Entry requirements to be published">
                Academic prerequisites, professional experience and language
                requirements for {programme.title} are confirmed by admissions
                in a personal consultation.
              </DataNote>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faq" className="border-t border-line bg-white">
        <div className="container-x grid gap-10 py-20 sm:py-24 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Questions, answered</p>
            <h2 className="type-h2 mt-5 text-ink">Before you apply</h2>
            <p className="mt-4 type-body">
              Programme-specific questions. The Concierge routes anything more
              specific directly to admissions.
            </p>
          </div>
          <div className="lg:col-span-8">
            <FaqAccordion items={programme.faqs} />
          </div>
        </div>
      </section>

      {/* Apply CTA */}
      <section className="relative overflow-hidden bg-forest-800 text-ivory">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_120%_at_88%_-20%,rgba(235,211,117,0.16),transparent_55%)]" />
        <div className="container-x relative flex flex-col items-start gap-8 py-16 sm:flex-row sm:items-center sm:justify-between sm:py-20">
          <div>
            <p className="eyebrow-light">Your next chapter</p>
            <h2 className="display-serif type-h2 mt-4">
              Begin the {programme.title}.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <BtnLink to="/admissions" variant="gold" size="lg">
              Apply Now
              <ArrowUpRight className="h-4 w-4" />
            </BtnLink>
            <BtnLink to="/concierge" variant="outline-light" size="lg">
              Ask the Concierge
            </BtnLink>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="bg-forest-900 text-ivory">
        <div className="container-x py-16 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="display-serif type-h2">Related pathways</h2>
            <Link
              to="/programmes"
              className="group inline-flex items-center gap-2 text-sm font-bold text-gold-300"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              All programmes
            </Link>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden border rule-light sm:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                to={`/programmes/${p.slug}`}
                className="group bg-forest-900 p-7 transition-colors duration-300 hover:bg-forest-800"
              >
                <p className="meta text-gold-300">{p.category}</p>
                <h3 className="display-serif type-h3 mt-3">{p.title}</h3>
                <p className="mt-3 type-body text-ivory/85">{p.tagline}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-bold text-ivory">
                  View pathway
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
