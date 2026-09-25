import { PageHero } from "../components/PageHero";
import { BtnLink, ClosingQuiet } from "../components/ui";
import { Reveal } from "../components/motion";
import { useSeo } from "../lib/router";
import { IMAGES, INSTITUTION, GOVERNANCE, ACCREDITATIONS } from "../lib/data";

export default function About() {
  useSeo({
    title: `About ${INSTITUTION.abbreviation} — ${INSTITUTION.legalName}`,
    description: INSTITUTION.mission,
  });

  return (
    <>
      <PageHero
        image={IMAGES.hero}
        imageAlt="The GIBS campus promenade"
        eyebrow={`About ${INSTITUTION.abbreviation}`}
        title="Capacity Building &"
        italic="Manpower Development."
        intro={INSTITUTION.positioning}
        breadcrumbs={[{ label: `About ${INSTITUTION.abbreviation}` }]}
      />

      {/* Institutional Overview & Slogan */}
      <section className="bg-paper">
        <div className="container-x grid gap-12 py-20 sm:py-24 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow">Official Identity</p>
              <p className="mt-3 text-[13px] font-bold uppercase tracking-[0.16em] text-forest-700">
                CAC {INSTITUTION.cac}
              </p>
              <p className="mt-1 text-[12px] text-muted">
                Incorporated {INSTITUTION.incorporationDate} ({INSTITUTION.registrationAuthority})
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal delay={0.08}>
              <blockquote className="display-serif type-h3 text-ink border-l-2 border-gold-500 pl-6 italic">
                "{INSTITUTION.slogan}"
              </blockquote>
              <p className="mt-6 type-body text-ink/85">
                {INSTITUTION.positioning}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="border-y border-line bg-white">
        <div className="container-x grid gap-px overflow-hidden bg-line lg:grid-cols-2">
          {[
            {
              label: "Mission",
              text: INSTITUTION.mission,
            },
            {
              label: "Vision",
              text: INSTITUTION.vision,
            },
          ].map((block) => (
            <div key={block.label} className="bg-white p-10 sm:p-14">
              <Reveal>
                <p className="eyebrow">{block.label}</p>
                <p className="display-serif type-h3 mt-6 text-ink">
                  {block.text}
                </p>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values & Guiding Principles */}
      <section className="paper-grain bg-paper">
        <div className="container-x py-20 sm:py-24">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Reveal>
                <p className="eyebrow">Core Values</p>
                <h2 className="display-serif type-h2 mt-4 text-ink">
                  Institutional <em className="text-forest-700">Pillars</em>
                </h2>
                <div className="mt-8 flex flex-wrap gap-3">
                  {INSTITUTION.coreValues.map((value) => (
                    <span
                      key={value}
                      className="chip border-forest-600/30 bg-white text-forest-900 font-medium text-[14px] px-4 py-2"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6">
              <Reveal delay={0.1}>
                <p className="eyebrow">Guiding Principles</p>
                <h2 className="display-serif type-h2 mt-4 text-ink">
                  How We <em className="text-forest-700">Operate</em>
                </h2>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {INSTITUTION.guidingPrinciples.map((principle) => (
                    <div key={principle} className="border border-line bg-white p-5">
                      <p className="display-serif text-lg font-semibold text-ink">{principle}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Focus */}
      <section className="border-y border-line bg-white">
        <div className="container-x py-20 sm:py-24">
          <Reveal>
            <p className="eyebrow">Strategic Focus</p>
            <h2 className="display-serif type-h2 mt-4 text-ink">
              Our Core <em className="text-forest-700">Objectives</em>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {INSTITUTION.strategicFocus.map((item, index) => (
              <Reveal key={item} delay={index * 0.05}>
                <div className="border border-line bg-paper p-7">
                  <span className="text-[11px] font-bold tracking-[0.16em] text-forest-600">
                    0{index + 1}
                  </span>
                  <h3 className="display-serif type-h3 mt-3 text-ink">{item}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Governance & Accreditations */}
      <section className="border-y border-line bg-forest-900 text-ivory">
        <div className="container-x py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Reveal>
                <p className="eyebrow-light">Governance</p>
                <h2 className="display-serif type-h2 mt-4 text-ivory">
                  {GOVERNANCE.council}
                </h2>
                <p className="mt-6 type-body text-ivory/85">
                  {GOVERNANCE.structure}
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-6">
              <Reveal delay={0.1}>
                <p className="eyebrow-light">Accreditations & Recognition</p>
                <h2 className="display-serif type-h2 mt-4 text-ivory">
                  Compliance & Standards
                </h2>
                <ul className="mt-6 space-y-3">
                  {ACCREDITATIONS.map((acc) => (
                    <li key={acc} className="flex items-center gap-3 text-[14px] text-ivory/90">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                      {acc}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <ClosingQuiet
        eyebrow="Continue"
        title="Explore our"
        italic="programmes."
        body="Discover our comprehensive local and international training pathways."
        actions={
          <>
            <BtnLink to="/programmes" variant="primary" size="lg">Explore programmes</BtnLink>
            <BtnLink to="/campus" variant="outline-ink" size="lg">Visit the campus</BtnLink>
          </>
        }
      />
    </>
  );
}
