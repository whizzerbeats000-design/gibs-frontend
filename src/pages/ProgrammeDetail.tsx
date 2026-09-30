import { PageHero } from "../components/PageHero";
import { BtnLink } from "../components/ui";
import { FaqAccordion } from "../components/cards";
import { ProgrammeNav, type ProgrammeSection } from "../components/ProgrammeNav";
import { CheckIcon, ArrowUpRight, ArrowLeft, Diamond } from "../components/icons";
import { Link } from "../lib/router";
import { getProgramme, relatedProgrammes, IMAGES } from "../lib/data";
import { useSeo } from "../lib/router";
import { Reveal } from "../components/motion";
import NotFound from "./NotFound";

const SECTIONS: ProgrammeSection[] = [
  { id: "overview", label: "Overview" },
  { id: "audience", label: "Who it is for" },
  { id: "curriculum", label: "Structure & Modules" },
  { id: "delivery", label: "Delivery & Venues" },
  { id: "faq", label: "FAQ" },
  { id: "enrolment", label: "Enrolment & Fees" },
];

function FactRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 border-b rule py-3.5 last:border-b-0 sm:gap-6">
      <dt className="meta shrink-0 text-muted">{label}</dt>
      <dd className="min-w-0 text-right text-[13.5px] font-semibold text-ink">{value}</dd>
    </div>
  );
}

export default function ProgrammeDetail({ slug }: { slug: string }) {
  const programme = getProgramme(slug);

  useSeo({
    title: programme ? `${programme.code} · ${programme.title} — GIBS` : "Programme not found — GIBS",
    description: programme?.summary ?? "",
  });

  if (!programme) return <NotFound />;

  const related = relatedProgrammes(slug, 3);
  const isForeign = programme.destination !== "Local";

  return (
    <>
      <PageHero
        image={isForeign ? IMAGES.city : IMAGES.colonnade}
        imageAlt={`GIBS Executive Training — ${programme.title}`}
        eyebrow={`${programme.category} · ${programme.code}`}
        title={programme.title}
        intro={programme.tagline ?? programme.summary}
        breadcrumbs={[
          { label: "2026 Calendar", to: "/programmes" },
          { label: programme.code },
        ]}
        meta={
          <div className="flex flex-wrap gap-3">
            <BtnLink
              to={`/contact?type=${isForeign ? "Foreign+Training+Programmes+(Kigali,+Dubai,+London,+Houston)" : "Local+Open+Training+Registration"}`}
              variant="gold"
              size="md"
            >
              Subscribe / Nominate
              <ArrowUpRight className="h-3.5 w-3.5" />
            </BtnLink>
            <BtnLink to="/concierge" variant="outline-light" size="md">
              Ask GIBS AI
            </BtnLink>
          </div>
        }
      />

      <ProgrammeNav sections={SECTIONS} />

      {/* Overview & Quick Facts */}
      <section id="overview" className="bg-paper">
        <div className="container-x section-y grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="pill pill-forest">
                  {programme.code}
                </span>
                <span className="pill pill-stone">
                  {programme.destination} Training
                </span>
                {programme.inPlantAvailable && (
                  <span className="rounded-pill border border-forest-600/30 px-3 py-1 text-[11px] font-semibold text-forest-700">
                    In-Plant Option Available
                  </span>
                )}
              </div>
              <p className="prose-editorial mt-6 max-w-[62ch] text-[17px] leading-[1.8] text-ink">
                {programme.summary}
              </p>
            </Reveal>

            {/* Target Audience Highlight */}
            <div className="mt-8 border-l-2 border-gold-500 bg-white p-6 shadow-crisp">
              <p className="eyebrow text-gold-700">Target Audience</p>
              <p className="mt-2 text-[15px] font-bold text-ink">{programme.targetAudience}</p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky" style={{ top: "calc(var(--sticky-top) + var(--subnav-height) + 16px)" }}>
              <Reveal y={32}>
                <div className="border border-line bg-white p-7 shadow-card sm:p-8">
                  <p className="eyebrow">Programme Summary</p>
                  <dl className="mt-5">
                    <FactRow label="Course Code" value={programme.code} />
                    <FactRow label="Sector / Category" value={programme.category} />
                    <FactRow label="Scope / Location" value={`${programme.destination} Hub`} />
                    <FactRow label="Duration" value={programme.duration ?? "5 Days"} />
                    <FactRow label="2026 Schedule" value={programme.schedule} />
                    <FactRow label="Official Fee" value={programme.fees} />
                  </dl>

                  <BtnLink
                    to={`/contact?type=${isForeign ? "Foreign+Training+Programmes+(Kigali,+Dubai,+London,+Houston)" : "Local+Open+Training+Registration"}`}
                    variant="primary"
                    size="lg"
                    className="mt-7 w-full whitespace-normal px-4 text-sm sm:px-7 sm:text-[15px]"
                  >
                    Subscribe / Nominate Candidates
                    <ArrowUpRight className="h-4 w-4" />
                  </BtnLink>
                  {programme.inPlantAvailable && (
                    <BtnLink
                      to="/contact?type=Customized+In-Plant+Workshop+Request"
                      variant="outline-ink"
                      size="md"
                      className="mt-3 w-full whitespace-normal"
                    >
                      Request In-Plant Customized Edition
                    </BtnLink>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Audience & Outcomes */}
      <section id="audience" className="border-y border-line bg-white">
        <div className="container-x section-y grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow">Target Participants</p>
            <h2 className="type-h2 mt-4 text-ink">
              Who should <em className="italic text-forest-700">attend.</em>
            </h2>
            <ul className="mt-7 space-y-4">
              {programme.audience?.map((a) => (
                <li key={a} className="flex items-start gap-3.5 type-body text-ink/85">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-forest-600" />
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="eyebrow">Learning Outcomes</p>
            <h2 className="type-h2 mt-4 text-ink">
              Key <em className="italic text-gold-600">takeaways.</em>
            </h2>
            <ul className="mt-7 space-y-4">
              {programme.outcomes?.map((o) => (
                <li key={o} className="flex items-start gap-3.5 type-body text-ink/85">
                  <Diamond className="mt-1.5 h-2 w-2 shrink-0 text-gold-600" />
                  {o}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Structure & Modules */}
      <section id="curriculum" className="paper-grain bg-paper">
        <div className="container-x section-y">
          <Reveal>
            <p className="eyebrow">Curriculum Architecture</p>
            <h2 className="type-h2 mt-4 max-w-3xl text-ink">
              Programme structure &amp; <em className="italic text-forest-700">methodology.</em>
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            <ol className="border-t rule lg:col-span-7">
              {programme.indicativeStructure?.map((item, i) => (
                <li key={i} className="grid grid-cols-[2.75rem_1fr] gap-4 border-b rule py-6">
                  <span className="text-[12px] font-bold tracking-[0.16em] text-forest-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="type-body font-medium text-ink/90">{item}</p>
                </li>
              ))}
            </ol>

            <div className="lg:col-span-5">
              <div className="border border-line bg-white p-7 shadow-card">
                <p className="eyebrow">Training Methodology</p>
                <div className="mt-4 space-y-4 text-[14px] leading-relaxed text-muted">
                  <p>
                    GIBS executive workshops employ participatory case studies, syndicate discussions,
                    expert lectures, and live institutional problem-solving.
                  </p>
                  <p>
                    Delivered in strict accordance with the standards of the Centre For Management
                    Development (CMD) and the Industrial Training Fund (ITF).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery & Venues */}
      <section id="delivery" className="bg-white">
        <div className="container-x section-y">
          <Reveal>
            <p className="eyebrow">Delivery &amp; Venues</p>
            <h2 className="type-h2 mt-4 text-ink">2026 Schedule.</h2>
          </Reveal>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border border-line bg-paper p-6">
              <p className="eyebrow">Format</p>
              <h3 className="display-serif mt-3 text-lg text-ink">{programme.format}</h3>
            </div>
            <div className="border border-line bg-paper p-6">
              <p className="eyebrow">Duration</p>
              <h3 className="display-serif mt-3 text-lg text-ink">{programme.duration ?? "5 Days"}</h3>
            </div>
            <div className="border border-line bg-paper p-6">
              <p className="eyebrow">2026 Schedule</p>
              <h3 className="display-serif mt-3 text-lg text-ink">{programme.schedule}</h3>
            </div>
            <div className="border border-line bg-paper p-6">
              <p className="eyebrow">Tuition Fee</p>
              <h3 className="display-serif mt-3 text-lg text-forest-900">{programme.fees}</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Enrolment & FAQs */}
      <section id="faq" className="border-t border-line bg-paper">
        <div className="container-x section-y grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Frequently Asked Questions</p>
            <h2 className="type-h2 mt-4 text-ink">Registration &amp; logistics</h2>
            <p className="mt-4 type-body">
              Questions regarding nomination procedures, in-plant arrangements, or international logistics.
            </p>
          </div>
          <div className="lg:col-span-8">
            <FaqAccordion items={programme.faqs ?? []} />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section id="enrolment" className="relative overflow-hidden bg-forest-900 text-ivory">
        <div className="container-x band-y relative flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow-light">Subscription Desk</p>
            <h2 className="type-h2 mt-3">
              Subscribe to {programme.code}.
            </h2>
            <p className="mt-2 text-[14px] text-ivory/80">Fee: {programme.fees} · Schedule: {programme.schedule}</p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-4 sm:w-auto">
            <BtnLink
              to={`/contact?type=${isForeign ? "Foreign+Training+Programmes+(Kigali,+Dubai,+London,+Houston)" : "Local+Open+Training+Registration"}`}
              variant="gold"
              size="lg"
              className="min-w-0 w-full sm:w-auto"
            >
              Submit Subscription Enquiry
              <ArrowUpRight className="h-4 w-4" />
            </BtnLink>
            <BtnLink to="/concierge" variant="outline-light" size="lg">
              Ask GIBS AI
            </BtnLink>
          </div>
        </div>
      </section>

      {/* Related Programmes */}
      <section className="bg-forest-950 text-ivory">
        <div className="container-x section-y">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="type-h2">Related 2026 Programmes</h2>
            <Link
              to="/programmes"
              className="group inline-flex items-center gap-2 text-sm font-bold text-gold-300"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              View full calendar (135)
            </Link>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden border rule-light sm:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                to={`/programmes/${p.slug}`}
                className="group bg-forest-950 p-7 transition-colors duration-300 hover:bg-forest-900"
              >
                <div className="flex items-center justify-between">
                  <p className="meta text-gold-300">{p.code}</p>
                  <span className="text-[12px] font-bold text-ivory/80">{p.fees}</span>
                </div>
                <h3 className="type-h3 mt-3">{p.title}</h3>
                <p className="mt-3 text-[13px] text-ivory/70 line-clamp-2">{p.schedule}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-bold text-gold-300">
                  View details
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
