import { PageHero } from "../components/PageHero";
import { BtnLink, ClosingQuiet } from "../components/ui";
import { Reveal } from "../components/motion";
import { useSeo } from "../lib/router";
import { INSTITUTIONAL_DATA, IMAGES } from "../lib/data";
import { Diamond, CheckIcon } from "../components/icons";

export default function About() {
  useSeo({
    title: "About GIBS — Goshen International Business School Limited (RC 1178333)",
    description:
      "Official institutional profile, mission, vision, 4 guiding principles, core values, and strategic focus areas of Goshen International Business School.",
  });

  return (
    <>
      <PageHero
        image={IMAGES.hero}
        imageAlt="The GIBS campus — dedicated to manpower development and capacity building"
        eyebrow="Institutional Profile"
        title="Goshen International"
        italic="Business School."
        intro={INSTITUTIONAL_DATA.positioningStatement}
        breadcrumbs={[{ label: "About GIBS" }]}
      />

      {/* Slogan Banner */}
      <section className="border-b border-line bg-forest-900 py-10 text-ivory">
        <div className="container-x text-center">
          <p className="eyebrow-light">Official Slogan</p>
          <blockquote className="display-serif mt-3 text-2xl text-gold-300 sm:text-3xl">
            “{INSTITUTIONAL_DATA.slogan}”
          </blockquote>
          <p className="mt-2 text-[12px] uppercase tracking-[0.16em] text-ivory/60">
            Goshen International Business School Limited · Incorporated March 17, 2014 (RC 1178333)
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="border-b border-line bg-white">
        <div className="container-x grid gap-px overflow-hidden bg-line lg:grid-cols-2">
          <div className="bg-white p-10 sm:p-14">
            <Reveal>
              <p className="eyebrow">Mission Statement</p>
              <p className="display-serif type-h3 mt-6 text-ink">
                {INSTITUTIONAL_DATA.mission}
              </p>
            </Reveal>
          </div>
          <div className="bg-white p-10 sm:p-14">
            <Reveal delay={0.08}>
              <p className="eyebrow">Vision Statement</p>
              <p className="display-serif type-h3 mt-6 text-ink">
                {INSTITUTIONAL_DATA.vision}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Guiding Principles (4 Pillars) */}
      <section className="paper-grain bg-paper">
        <div className="container-x py-20 sm:py-24">
          <Reveal>
            <p className="eyebrow">4 Pillars</p>
            <h2 className="display-serif type-h2 mt-4 text-ink">
              Guiding <em className="italic text-forest-700">Principles.</em>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {INSTITUTIONAL_DATA.guidingPrinciples.map((pillar, i) => (
              <Reveal key={pillar} delay={i * 0.06}>
                <div className="border border-line bg-white p-8 shadow-crisp">
                  <span className="text-[11px] font-bold tracking-[0.16em] text-forest-600">
                    Pillar 0{i + 1}
                  </span>
                  <h3 className="display-serif mt-4 text-2xl text-ink">{pillar}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                    Core institutional anchor upholding standards across all GIBS capacity-building exercises.
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values & Strategic Focus */}
      <section className="border-y border-line bg-white">
        <div className="container-x grid gap-14 py-20 sm:py-24 lg:grid-cols-12">
          {/* Core Values */}
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow">Core Values</p>
              <h2 className="display-serif type-h2 mt-4 text-ink">What we stand for</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {INSTITUTIONAL_DATA.coreValues.map((val) => (
                  <div key={val} className="flex items-center gap-3 border border-line bg-paper px-4 py-3.5">
                    <Diamond className="h-2 w-2 shrink-0 text-gold-600" />
                    <span className="text-[14px] font-bold text-ink">{val}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Strategic Focus Areas */}
          <div className="lg:col-span-6">
            <Reveal delay={0.1}>
              <p className="eyebrow">Strategic Focus Areas</p>
              <h2 className="display-serif type-h2 mt-4 text-ink">Our Mandate</h2>
              <ul className="mt-8 space-y-4">
                {INSTITUTIONAL_DATA.strategicFocusAreas.map((area, i) => (
                  <li key={area} className="flex items-start gap-4 border-b rule pb-4">
                    <span className="text-[11px] font-bold text-forest-700">0{i + 1}</span>
                    <span className="text-[14.5px] font-medium leading-snug text-ink/85">{area}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Accreditations & Technical Partner */}
      <section className="bg-forest-950 py-20 text-ivory">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow-light">Official Accreditations &amp; Global Partnerships</p>
            <h2 className="display-serif type-h2 mt-4">
              Institutional standing and global reach
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="border border-ivory/20 bg-forest-900/60 p-8 sm:p-10">
              <h3 className="display-serif text-2xl text-gold-300">National Accreditations</h3>
              <ul className="mt-6 space-y-3.5">
                {INSTITUTIONAL_DATA.accreditations.map((acc) => (
                  <li key={acc} className="flex items-start gap-3 text-[14.5px] text-ivory/85">
                    <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-gold-300" />
                    {acc}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-ivory/20 bg-forest-900/60 p-8 sm:p-10">
              <h3 className="display-serif text-2xl text-gold-300">International Technical Partnership</h3>
              <p className="mt-4 text-[15px] font-bold text-ivory">
                {INSTITUTIONAL_DATA.technicalPartner}
              </p>
              <p className="mt-4 text-[13.5px] leading-relaxed text-ivory/70">
                GIBS delivers executive training across global hubs:
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {INSTITUTIONAL_DATA.overseasHubs.map((hub) => (
                  <span key={hub} className="rounded-pill bg-ivory/10 px-3 py-1 text-[12px] font-semibold text-ivory">
                    {hub}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ClosingQuiet
        eyebrow="Take Advantage of Us"
        title="Ready to elevate"
        italic="your workforce?"
        body="Browse the complete 2026 Training Calendar of 113 Local and 22 Foreign Executive Programmes, or speak with our training advisors."
        actions={
          <>
            <BtnLink to="/programmes" variant="primary" size="lg">
              2026 Training Calendar
            </BtnLink>
            <BtnLink to="/contact" variant="outline-ink" size="lg">
              Contact Registry
            </BtnLink>
          </>
        }
      />
    </>
  );
}
