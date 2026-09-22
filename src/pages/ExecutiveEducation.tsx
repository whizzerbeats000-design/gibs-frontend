import { PageHero } from "../components/PageHero";
import { BtnLink, ClosingImmersive, DataNote, ArrowTextLink } from "../components/ui";
import { ProgramRow } from "../components/cards";
import { Reveal } from "../components/motion";
import { ArrowUpRight } from "../components/icons";
import { Link } from "../lib/router";
import { useSeo } from "../lib/router";
import { getProgramme, IMAGES } from "../lib/data";

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

export default function ExecutiveEducation() {
  useSeo({
    title: "Executive Education — GIBS",
    description:
      "Open-enrolment executive programmes and custom leadership journeys for boards, governments and fast-scaling organizations.",
  });

  const open = getProgramme("executive-education")!;
  const custom = getProgramme("custom-programmes")!;

  return (
    <>
      <PageHero
        image={IMAGES.boardroom}
        imageAlt="The GIBS library — a quiet environment for executive learning"
        eyebrow="Executive Education"
        title="Leadership for those already"
        italic="operating at scale."
        intro="Open programmes for experienced professionals and custom journeys built around your organization's decision."
        breadcrumbs={[{ label: "Executive Education" }]}
      />

      {/* Two tracks */}
      <section className="bg-white">
        <div className="container-x py-20 sm:py-24">
          <div className="grid gap-px overflow-hidden border border-line bg-line lg:grid-cols-2">
            {[
              {
                p: open,
                eyebrowText: "For individuals",
                body: "Short, intensive convenings for rising and senior leaders, focused, practical and taught by faculty who also work inside real institutions.",
              },
              {
                p: custom,
                eyebrowText: "For organizations",
                body: "A custom engagement built with boards and executive committees around one institution's strategy, transition or transformation.",
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

          <div className="mt-10">
            <DataNote label="Executive calendar & fees to be published">
              Dates, venues and fees follow the official executive calendar
              once confirmed.
            </DataNote>
          </div>
        </div>
      </section>

      {/* Custom engagement method */}
      <section className="paper-grain bg-paper">
        <div className="container-x py-20 sm:py-24">
          <Reveal>
            <p className="eyebrow">The Method</p>
            <h2 className="display-serif type-h2 mt-5 max-w-3xl text-ink">
              Custom work begins with the question
              <em className="text-forest-700"> beneath the question.</em>
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

      {/* Faculty expertise & learning environment */}
      <section className="bg-white">
        <div className="container-x grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-12 lg:gap-14">
          <Reveal y={36} className="lg:col-span-6 lg:order-2">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={IMAGES.library}
                alt="The quiet executive learning environment with oak, brass and reading light"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-forest-950/20" />
              <div className="absolute inset-0 ring-1 ring-inset ring-ink/10" />
            </div>
          </Reveal>
          <div className="lg:col-span-6 lg:order-1">
            <Reveal>
              <p className="eyebrow">Faculty Expertise</p>
              <h2 className="display-serif type-h2 mt-5 text-ink">
                Taught by people who still do the work
              </h2>
              <p className="mt-5 max-w-xl type-body">
                Executive faculty move between the classroom and the boardroom;
                they research, advise and lead, and bring current institutional
                problems into every convening. Programmes are hosted in case
                rooms and residential quarters designed for candour.
              </p>
              <div className="mt-8">
                <DataNote label="Faculty assignments & venue schedules to be published">
                  Named faculty biographies, programme dates and locations are
                  published once confirmed.
                </DataNote>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                <ArrowTextLink to="/faculty">Faculty & research</ArrowTextLink>
                <ArrowTextLink to="/campus">The campus</ArrowTextLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <ClosingImmersive
        image={IMAGES.seminar}
        alt="Executives in a GIBS convening, in discussion around a case room"
        eyebrow="Executive Education"
        title="Bring a leadership question."
        italic="We'll bring the faculty."
        body="Custom work begins with a confidential conversation about the decision your organization must take."
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
