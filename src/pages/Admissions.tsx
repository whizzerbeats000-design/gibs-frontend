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

const CALENDAR_CYCLES = [
  { k: "Quarter 1 Cohorts", v: "January — March 2026", status: "Concluded" },
  { k: "Quarter 2 Cohorts", v: "April — June 2026", status: "Concluded" },
  { k: "Quarter 3 Cohorts", v: "July — September 2026", status: "Active Intake" },
  { k: "Quarter 4 Cohorts", v: "October — December 2026", status: "Open for Nominations" },
  { k: "Custom In-Plant Workshops", v: "Tailored on Request", status: "Rolling Schedule" },
];

export default function Admissions() {
  const { setOpen: openConcierge } = useConcierge();
  useSeo({
    title: "Programme Subscription & Enquiries — Goshen International Business School",
    description:
      "The GIBS programme subscription journey: programme selection, corporate nomination, schedule confirmation, and executive certification.",
  });

  return (
    <>
      <PageHero
        image={IMAGES.colonnade}
        imageAlt="The GIBS training facility"
        eyebrow="Programme Subscription & Enquiries"
        title="Subscribe to a"
        italic="programme."
        intro="GIBS operates on a programme subscription and corporate nomination model for its 2026 training calendar. Whether subscribing individually or nominating organizational teams, participants and sponsoring institutions are guided through a transparent registration process."
        breadcrumbs={[{ label: "Programme Subscription" }]}
        meta={
          <div className="flex flex-wrap gap-3">
            <BtnLink to="/contact?type=Local+Open+Training+Registration" variant="gold" size="md">
              Subscribe or Nominate
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
        <div className="container-x py-20 sm:py-24">
          <Reveal>
            <p className="eyebrow">How to subscribe</p>
            <h2 className="type-h2 mt-5 max-w-3xl text-ink">
              Six deliberate steps to <em className="italic text-forest-700">capacity building.</em>
            </h2>
          </Reveal>
          <ol className="mt-14 border-t rule">
            {SUBSCRIPTION_STEPS.map((step) => (
              <li
                key={step.n}
                className="group grid grid-cols-[3.5rem_1fr] items-baseline gap-5 border-b rule py-7 sm:grid-cols-[5rem_auto_1fr] sm:gap-10"
              >
                <span className="display-serif text-3xl text-gold-600 sm:text-4xl">{step.n}</span>
                <h3 className="type-h3 w-44 shrink-0 text-ink sm:w-52">
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
              <p className="eyebrow">Participation Guidelines</p>
              <h2 className="type-h2 mt-5 text-ink">
                Participant and organizational criteria
              </h2>
              <p className="mt-4 max-w-xl type-body">
                GIBS programmes are tailored for career executives, civil servants, directors, managers, and specialized professionals across public and private sectors.
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
        <div className="container-x grid gap-10 py-16 sm:py-20 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="type-h2">Published Fee Structure</h2>
            <p className="mt-4 type-body text-ivory/80">
              All 135 programmes feature transparent, officially approved fees covering course delivery, study materials, executive luncheon, tea breaks, and certificates.
            </p>
          </div>
          <div className="lg:col-span-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-white/15 bg-forest-800/60 p-6">
                <span className="eyebrow-light">
                  Domestic / Open Programmes (113)
                </span>
                <p className="mt-2 text-2xl font-bold text-white">₦300,000 — ₦800,000</p>
                <p className="mt-2 text-[13px] text-ivory/70">
                  Delivered at Ilorin HQ, Abuja, Ibafo (Ogun State), or off-campus locations (Lagos, Port Harcourt, Kaduna, etc.).
                </p>
              </div>
              <div className="border border-white/15 bg-forest-800/60 p-6">
                <span className="eyebrow-light">
                  Foreign Training Hubs (22)
                </span>
                <p className="mt-2 text-2xl font-bold text-white">USD $4,800+ / GBP £4,800</p>
                <p className="mt-2 text-[13px] text-ivory/70">
                  International training hubs in Kigali ($4,800), Dubai ($4,800), London (£4,800), and Houston ($5,000 - $9,500).
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <BtnLink to="/contact?type=Local+Open+Training+Registration" variant="gold" size="md">
                Request Nomination Information
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
        <div className="container-x grid gap-10 py-20 sm:py-24 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Subscription &amp; Nominations FAQ</p>
            <h2 className="type-h2 mt-5 text-ink">Frequently asked questions</h2>
          </div>
          <div className="lg:col-span-8">
            <FaqAccordion items={SUBSCRIPTION_FAQS} />
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
              <h2 className="type-h2 text-ink">Need guidance on course selection?</h2>
              <p className="mt-2 max-w-lg type-body">
                GIBS AI answers instantly and can recommend courses based on sector, cadre, department, and calendar quarter.
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
        body="Goshen International Business School (GIBS) is dedicated to empowering the future generation through acquisition and communication of management and business knowledge. Contact our training desk today."
        actions={
          <>
            <BtnLink to="/contact?type=Local+Open+Training+Registration" variant="primary" size="lg">
              Subscribe to a Programme
            </BtnLink>
            <BtnLink to="/programmes" variant="outline-ink" size="lg">Browse 135 Programmes</BtnLink>
          </>
        }
      />
    </>
  );
}
