import { PageHero } from "../components/PageHero";
import { BtnLink, ClosingQuiet, DataNote } from "../components/ui";
import { FaqAccordion } from "../components/cards";
import { Reveal } from "../components/motion";
import { ArrowUpRight, ChatIcon } from "../components/icons";
import { Link } from "../lib/router";
import { useSeo } from "../lib/router";
import { useConcierge } from "../components/Concierge";
import {
  ADMISSIONS_STEPS,
  ADMISSIONS_FAQS,
  REQUIREMENTS_ACCORDION,
  IMAGES,
} from "../lib/data";

const DATES: { k: string; v?: string; pending?: boolean }[] = [
  { k: "Applications open", pending: true },
  { k: "Applications close", pending: true },
  { k: "Admissions conversations", pending: true },
  { k: "Decisions communicated", pending: true },
  { k: "Cohort begins", pending: true },
];

export default function Admissions() {
  const { setOpen: openConcierge } = useConcierge();
  useSeo({
    title: "Admissions — GIBS",
    description:
      "The GIBS admissions journey: consult, prepare, apply, converse, then decision and enrolment. Requirements, dates and FAQs.",
  });

  return (
    <>
      <PageHero
        image={IMAGES.colonnade}
        imageAlt="The GIBS colonnade in warm late-afternoon light"
        eyebrow="Admissions"
        title="Begin your GIBS"
        italic="journey."
        intro="Each candidate is guided personally through six deliberate steps, from first conversation to enrolment."
        breadcrumbs={[{ label: "Admissions" }]}
        meta={
          <div className="flex flex-wrap gap-3">
            <BtnLink to="/contact?type=Programmes+%26+MBA+admissions" variant="gold" size="md">
              Apply Now
              <ArrowUpRight className="h-3.5 w-3.5" />
            </BtnLink>
            <BtnLink to="/concierge" variant="outline-light" size="md">
              Ask the Concierge
            </BtnLink>
          </div>
        }
      />

      {/* Process timeline */}
      <section className="bg-paper">
        <div className="container-x py-20 sm:py-24">
          <Reveal>
            <p className="eyebrow">How to apply</p>
            <h2 className="display-serif type-h2 mt-5 max-w-3xl text-ink">
              Six steps, taken <em className="italic text-forest-700">deliberately.</em>
            </h2>
          </Reveal>
          <ol className="mt-14 border-t rule">
            {ADMISSIONS_STEPS.map((step) => (
              <li
                key={step.n}
                className="group grid grid-cols-[3.5rem_1fr] items-baseline gap-5 border-b rule py-7 sm:grid-cols-[5rem_auto_1fr] sm:gap-10"
              >
                <span className="display-serif text-3xl text-gold-600 sm:text-4xl">{step.n}</span>
                <h3 className="display-serif type-h3 w-44 shrink-0 text-ink sm:w-52">
                  {step.title}
                </h3>
                <p className="col-start-2 max-w-xl type-body sm:col-start-auto">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Requirements + dates */}
      <section className="border-y border-line bg-white">
        <div className="container-x grid gap-14 py-20 sm:py-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">Requirements</p>
              <h2 className="display-serif type-h2 mt-5 text-ink">
                What an application asks of you
              </h2>
              <p className="mt-4 max-w-xl type-body">
                Expand each requirement for guidance. Programme-specific
                thresholds and materials are published once confirmed.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-9">
                <FaqAccordion items={REQUIREMENTS_ACCORDION} />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal>
              <div className="border border-line bg-paper p-7 sm:p-9">
                <p className="eyebrow">Key dates · Next intake</p>
                <dl className="mt-6">
                  {DATES.map((d) => (
                    <div
                      key={d.k}
                      className="grid grid-cols-1 gap-1 border-b rule py-4 last:border-b-0 sm:grid-cols-2 sm:gap-4"
                    >
                      <dt className="text-[12px] font-bold uppercase tracking-[0.16em] text-muted">
                        {d.k}
                      </dt>
                      <dd className="text-[13px] italic text-muted/90 sm:text-right">
                        {d.pending ? "To be published" : d.v}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-7">
                  <DataNote label="No dates are estimated">
                    The official calendar is published by the registrar the
                    moment it is confirmed.
                  </DataNote>
                </div>
                <Link to="/events" className="group link-underline mt-7 inline-flex text-sm font-semibold text-forest-700">
                  Open days and events
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Fees */}
      <section className="bg-forest-900 text-ivory">
        <div className="container-x grid gap-10 py-16 sm:py-20 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="display-serif type-h2">Tuition &amp; financial support</h2>
          </div>
          <div className="lg:col-span-8">
            <DataNote light label="Fees & scholarships to be published">
              Tuition, deposits, scholarships, bursaries and sponsor terms are
              published once confirmed. In the meantime, admissions confirms
              the current position in a personal conversation. No figures are
              estimated.
            </DataNote>
            <div className="mt-8">
              <BtnLink to="/contact?type=Programmes+%26+MBA+admissions" variant="gold" size="md">
                Request a fees conversation
                <ArrowUpRight className="h-3.5 w-3.5" />
              </BtnLink>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-paper">
        <div className="container-x grid gap-10 py-20 sm:py-24 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Admissions FAQ</p>
            <h2 className="display-serif type-h2 mt-5 text-ink">The questions we hear most</h2>
          </div>
          <div className="lg:col-span-8">
            <FaqAccordion items={ADMISSIONS_FAQS} />
          </div>
        </div>
      </section>

      {/* Concierge access */}
      <section className="border-y border-line bg-white">
        <div className="container-x flex flex-col items-start gap-7 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-pill bg-forest-50 text-forest-700">
              <ChatIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="display-serif type-h2 text-ink">A question before you apply?</h2>
              <p className="mt-2 max-w-lg type-body">
                The Concierge answers instantly and routes anything official to
                a colleague who can.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <button type="button" onClick={() => openConcierge(true)} className="btn btn-primary btn-md">
              Ask the Concierge
            </button>
          </div>
        </div>
      </section>

      <ClosingQuiet
        eyebrow="Admissions"
        title="The journey begins"
        italic="with a conversation."
        body="Every candidate is guided personally. Tell us where you are heading, and admissions will take it from there. The Concierge can open the door immediately."
        actions={
          <>
            <BtnLink to="/contact?type=Programmes+%26+MBA+admissions" variant="primary" size="lg">
              Start your application
            </BtnLink>
            <BtnLink to="/concierge" variant="outline-ink" size="lg">Ask the Concierge</BtnLink>
          </>
        }
      />
    </>
  );
}
