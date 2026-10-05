import { PageHero } from "../components/PageHero";
import { BtnLink, ClosingQuiet } from "../components/ui";
import { FaqAccordion } from "../components/cards";
import { Reveal } from "../components/motion";
import { ArrowUpRight, ChatIcon } from "../components/icons";
import { Link } from "../lib/router";
import { useSeo } from "../lib/router";
import { useConcierge } from "../components/Concierge";
import {
  SUBSCRIPTION_STEPS,
  SUBSCRIPTION_FAQS,
  REQUIREMENTS_ACCORDION,
  IMAGES,
} from "../lib/data";

type CycleStatus = "Concluded" | "Active Intake" | "Open for Enrolment";

const QUARTER_CYCLES = [
  { k: "Quarter 1 Cohorts", v: "January — March 2026", start: "2026-01-01", end: "2026-03-31" },
  { k: "Quarter 2 Cohorts", v: "April — June 2026", start: "2026-04-01", end: "2026-06-30" },
  { k: "Quarter 3 Cohorts", v: "July — September 2026", start: "2026-07-01", end: "2026-09-30" },
  { k: "Quarter 4 Cohorts", v: "October — December 2026", start: "2026-10-01", end: "2026-12-31" },
];

/* Status follows the clock, not the copy — quarters before today are
   Concluded, the quarter in progress is Active Intake, later ones Open. */
function quarterStatus(start: string, end: string): CycleStatus {
  const now = Date.now();
  if (new Date(`${end}T23:59:59Z`).getTime() < now) return "Concluded";
  if (new Date(`${start}T00:00:00Z`).getTime() <= now) return "Active Intake";
  return "Open for Enrolment";
}

/* Render-layer transforms for data.ts-sourced content that contains
   "nomination"/"subscribe" terminology. data.ts is byte-locked, so these
   arrays override specific items before they reach the user. */
const SUBSCRIPTION_STEPS_RENDER = SUBSCRIPTION_STEPS.map((step) =>
  step.n === "02"
    ? { ...step, title: "Enrolment & Confirmation", body: "Organisations submit participant details; individual candidates make an enquiry. GIBS confirms your place and issues a formal confirmation letter." }
    : step.n === "03"
    ? { ...step, body: "GIBS issues official programme confirmation letters, course schedule details, and invoice." }
    : step
);

const SUBSCRIPTION_FAQS_RENDER = SUBSCRIPTION_FAQS.map((faq) => {
  if (faq.q === "How do MDAs and corporate organizations nominate staff to subscribe?")
    return { q: "How do MDAs and corporate organisations enquire about staff training?", a: "Organisations can email gibsilorin@gmail.com / goshenibs22@gmail.com, or contact the training desk via 08160010401 or 08033429427 to request a programme enquiry." };
  if (faq.q === "Are concessions available for group subscriptions and nominations?")
    return { q: "Are concessions available for group enrolments?", a: faq.a };
  return faq;
});

const REQUIREMENTS_ACCORDION_RENDER = REQUIREMENTS_ACCORDION.map((faq) => {
  if (faq.q === "Participant Eligibility & Nominations")
    return { q: "Participant Eligibility", a: faq.a };
  if (faq.q === "Overseas Training Travel Requirements")
    return { q: faq.q, a: faq.a.replace("upon subscription confirmation", "upon programme confirmation") };
  return faq;
});

const CALENDAR_CYCLES: { k: string; v: string; status: string }[] = [
  ...QUARTER_CYCLES.map((c) => ({ k: c.k, v: c.v, status: quarterStatus(c.start, c.end) })),
  { k: "Custom In-Plant Workshops", v: "Tailored on Request", status: "Rolling Schedule" },
];

export default function Admissions() {
  const { setOpen: openConcierge } = useConcierge();
  useSeo({
    title: "Programme Enquiries — Goshen International Business School",
    description:
      "The GIBS programme enquiry process: browse the 2026 calendar, make an enquiry, and GIBS handles the rest.",
  });

  return (
    <>
      <PageHero
        image={IMAGES.colonnade}
        imageAlt="The GIBS training facility"
        eyebrow="Programme Enquiries"
        title="Enquire About a"
        italic="programme."
        intro="Discover a programme, make an enquiry, and GIBS handles the rest. Whether you are an individual professional or an organisation enquiring about staff training, our team guides you through the process."
        breadcrumbs={[{ label: "Programme Enquiry" }]}
        meta={
          <div className="flex flex-wrap gap-3">
            <BtnLink to="/contact?type=Local+Open+Training+Registration" variant="gold" size="md">
              Make an Enquiry
              <ArrowUpRight className="h-3.5 w-3.5" />
            </BtnLink>
            <BtnLink to="/concierge" variant="outline-light" size="md">
              Ask GIBS AI
            </BtnLink>
          </div>
        }
      />

      {/* Process timeline */}
      <section className="bg-paper">
        <div className="container-x section-y grid lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">How to enquire</p>
              <h2 className="type-h2 mt-5 max-w-prose text-ink">
                Six deliberate steps to <em className="italic text-forest-700">capacity building.</em>
              </h2>
            </Reveal>
          </div>
          <div className="mt-14 border-t rule lg:col-span-7 lg:mt-0">
            <ol className="grid gap-y-1">
              {SUBSCRIPTION_STEPS_RENDER.map((step) => (
                <li
                  key={step.n}
                  className="group grid grid-cols-[3.5rem_1fr] items-baseline gap-5 border-b rule py-7 sm:grid-cols-[5rem_auto_1fr] sm:gap-10"
                >
                  <span className="display-serif text-3xl text-gold-600 sm:text-4xl">{step.n}</span>
                  <h3 className="type-h3 w-44 shrink-0 text-ink sm:w-52">
                    {step.title}
                  </h3>
                  <p className="col-start-2 max-w-prose type-body sm:col-start-auto">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Requirements + dates */}
      <section className="border-y border-line bg-white">
        <div className="container-x section-y grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">Participation Guidelines</p>
              <h2 className="type-h2 mt-5 text-ink">
                Participant and organizational criteria
              </h2>
              <p className="mt-4 max-w-prose type-body">
                GIBS programmes are tailored for career executives, civil servants, directors, managers, and specialized professionals across public and private sectors.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-9">
                <FaqAccordion items={REQUIREMENTS_ACCORDION_RENDER} />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal>
              <div className="border border-line bg-paper p-7 sm:p-9 max-w-editorial">
                <p className="eyebrow">2026 Training Calendar Cycles</p>
                <dl className="mt-6">
                  {CALENDAR_CYCLES.map((d) => (
                    /* dt/dd must be direct children of the grouping <div> inside
                       a <dl>. They were previously nested one level deeper inside
                       a flex wrapper, which axe flags as `dlitem` and which is
                       invalid per the HTML spec — the status chip belongs inside
                       the <dt> it describes. */
                    <div
                      key={d.k}
                      className="border-b rule py-4 last:border-b-0"
                    >
                      <dt className="flex items-center justify-between gap-3">
                        <span className="eyebrow text-forest-800">{d.k}</span>
                        <span className="rounded-full bg-forest-100 px-2.5 py-0.5 text-[11px] font-semibold text-forest-800">
                          {d.status}
                        </span>
                      </dt>
                      <dd className="mt-1 text-[13.5px] text-muted">
                        {d.v}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-7 flex flex-wrap gap-4">
                  <Link to="/programmes" className="group link-underline text-sm font-semibold text-forest-700">
                    Explore all 135 programmes
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Fees & Investment */}
      <section className="bg-forest-900 text-ivory">
        <div className="container-x section-y grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="type-h2">Published Fee Structure</h2>
            <p className="mt-4 max-w-prose type-body text-ivory/80">
              All 135 programmes feature transparent, officially approved fees covering course delivery, study materials, executive luncheon, tea breaks, and certificates.
            </p>
          </div>
          <div className="lg:col-span-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-white/15 bg-forest-800/60 p-6 max-w-card">
                <span className="eyebrow-light">
                  Domestic / Open Programmes (113)
                </span>
                <p className="mt-2 text-2xl font-bold text-white">₦300,000 — ₦800,000</p>
                <p className="mt-2 text-[13px] text-ivory/70 max-w-prose">
                  Delivered at Ilorin HQ, Abuja, Ibafo (Ogun State), or off-campus locations (Lagos, Port Harcourt, Kaduna, etc.).
                </p>
              </div>
              <div className="border border-white/15 bg-forest-800/60 p-6 max-w-card">
                <span className="eyebrow-light">
                  Foreign Training Hubs (22)
                </span>
                <p className="mt-2 text-2xl font-bold text-white">USD $4,800+ / GBP £4,800</p>
                <p className="mt-2 text-[13px] text-ivory/70 max-w-prose">
                  International training hubs in Kigali ($4,800), Dubai ($4,800), London (£4,800), and Houston ($5,000 - $9,500).
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <BtnLink to="/contact?type=Local+Open+Training+Registration" variant="gold" size="md" className="min-w-0 w-full sm:w-auto">
                Make an Enquiry
                <ArrowUpRight className="h-3.5 w-3.5" />
              </BtnLink>
              <BtnLink to="/executive-education" variant="outline-light" size="md">
                Foreign Training Hubs
              </BtnLink>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-paper">
        <div className="container-x section-y grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Programme Enquiries FAQ</p>
            <h2 className="type-h2 mt-5 text-ink">Frequently asked questions</h2>
          </div>
          <div className="lg:col-span-8">
            <FaqAccordion items={SUBSCRIPTION_FAQS_RENDER} />
          </div>
        </div>
      </section>

      {/* Concierge access */}
      <section className="border-y border-line bg-white">
        <div className="container-x band-y flex flex-col items-start gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-pill bg-forest-50 text-forest-700">
              <ChatIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="type-h2 text-ink">Need guidance on programme selection?</h2>
              <p className="mt-2 max-w-lg type-body">
                GIBS AI answers instantly and can recommend programmes based on sector, cadre, department, and calendar quarter.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <button type="button" onClick={() => openConcierge(true)} className="btn btn-primary btn-md">
              Ask GIBS AI
            </button>
          </div>
        </div>
      </section>

      <ClosingQuiet
        eyebrow="Capacity-Building & Manpower Development"
        title="Take advantage of us,"
        italic="so that no one takes advantage of you."
        body="Goshen International Business School (GIBS) offers 113 local and 22 foreign executive programmes. Our training desk helps match organisations and individuals to the right capacity-building programme."
        actions={
          <>
            <BtnLink to="/contact?type=Local+Open+Training+Registration" variant="primary" size="lg">
              Make an Enquiry
            </BtnLink>
            <BtnLink to="/programmes" variant="outline-ink" size="lg">Browse 135 Programmes</BtnLink>
          </>
        }
      />
    </>
  );
}
