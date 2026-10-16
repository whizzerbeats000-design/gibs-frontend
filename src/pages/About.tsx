import { PageHero } from "../components/PageHero";
import { BtnLink, ClosingQuiet } from "../components/ui";
import { Reveal } from "../components/motion";
import { useSeo } from "../lib/router";
import { INSTITUTIONAL_DATA, GOVERNANCE_INFO, FACULTY_ADVISORS, CAMPUS_LOCATIONS } from "../lib/data";
import { Diamond, CheckIcon, MapPinIcon } from "../components/icons";

export default function About() {
  useSeo({
    title: "About GIBS — Goshen International Business School Limited (RC 1178333)",
    description:
      "Institutional profile, founding history, governing council, accreditations, and training locations for Goshen International Business School.",
  });

  return (
    <>
      <PageHero
        image="/images/gibs-hq-architecture-edited-branded.webp"
        imageAlt="GIBS headquarters building with signage and blue-framed windows"
        eyebrow="Institutional Profile"
        title="Goshen International"
        italic="Business School."
        intro="Founded in 2014, GIBS offers executive training across three Nigerian centres and four overseas hubs."
        breadcrumbs={[{ label: "About GIBS" }]}
      />

      {/* Guiding Principles (4 Pillars) */}
      <section className="paper-grain bg-paper">
        <div className="container-x section-y grid lg:grid-cols-12">
          <div className="lg:col-span-12">
            <Reveal>
              <p className="eyebrow">4 Pillars</p>
              <h2 className="type-h2 mt-4 text-ink">
                Guiding <em className="italic text-forest-700">Principles.</em>
              </h2>
            </Reveal>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-4">
            {INSTITUTIONAL_DATA.guidingPrinciples.map((pillar, i) => (
              <Reveal key={pillar} delay={i * 0.06}>
                <div className="rounded-panel border border-line bg-white px-4 py-4">
                  <span className="text-[10px] font-semibold tracking-[0.12em] text-muted">
                    Pillar 0{i + 1}
                  </span>
                  <h3 className="display-serif mt-2 text-xl text-ink sm:text-2xl">{pillar}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values & Strategic Focus */}
      <section className="border-y border-line bg-white">
        <div className="container-x section-y grid gap-14 lg:grid-cols-12">
          {/* Core Values */}
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">Core Values</p>
              <h2 className="type-h2 mt-4 text-ink">What we stand for</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {INSTITUTIONAL_DATA.coreValues.map((val) => (
                  <div key={val} className="flex items-center gap-3 border border-line bg-paper px-4 py-3.5 max-w-card">
                    <Diamond className="h-2 w-2 shrink-0 text-gold-600" />
                    <span className="text-[14px] font-bold text-ink">{val}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Strategic Focus Areas */}
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <p className="eyebrow">Strategic Focus Areas</p>
              <h2 className="type-h2 mt-4 text-ink">Our Mandate</h2>
              <ul className="mt-8 space-y-4">
                {INSTITUTIONAL_DATA.strategicFocusAreas.map((area, i) => (
                  <li key={area} className="flex items-start gap-4 border-b rule pb-4">
                    <span className="text-[11px] font-bold text-forest-700">0{i + 1}</span>
                    <span className="text-[14.5px] font-medium leading-snug text-ink/85 max-w-prose">{area}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Institutional capability statement */}
      <section className="border-y border-line bg-white section-y">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <h2 className="type-h2 text-ink">WHY CHOOSE US?</h2>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal>
              <p className="type-body text-muted">Because we have capacity to do the following:</p>
              <ol className="mt-5 list-decimal space-y-4 pl-5 text-[15px] leading-relaxed text-ink/85">
                <li>Developing effective corporate teamwork aiming for constructive changes in organizational performance and growth.</li>
                <li>Structuring corporation, partnership and veracity.</li>
                <li>Exposure to multifaceted organizational advancement elucidation.</li>
                <li>Learning and applying corporate understanding for creating and implementing effective group planning.</li>
                <li>Imbibing corporate planning principles.</li>
                <li>Serving professional staff and other employees to attain excellence in their routine.</li>
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-paper section-y">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <h2 className="type-h2 text-ink">PLEDGE:</h2>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal>
              <p className="display-serif text-2xl leading-snug text-forest-800 sm:text-3xl">
                We pledge skilled practice, moral and ethical standard.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white section-y">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <h2 className="type-h2 text-ink">OUR FACULTY:</h2>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal>
              <p className="max-w-prose text-[15px] leading-relaxed text-ink/85">
                &quot;Our Training Program aims at managing relationship between internal and external stakeholders, public and private sectors, including policy makers, Investors, Employees, Regulators, NGOs, and media. Also we have versatile experience in Leadership, Organisational Management, Emotional Intelligence and Knowledge Management. We are linked to Corporate and Social Responsibility (CSR) and community involvement initiatives. Our faculty is rich and experienced.&quot;
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Accreditations & Technical Partner */}
      <section className="bg-forest-950 section-y text-ivory">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow-light">Institutional Registration &amp; Global Partnerships</p>
            <h2 className="type-h2 mt-4">
              Institutional standing and global reach
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            <div className="border border-ivory/20 bg-forest-900/60 p-8 sm:p-10 lg:col-span-7">
              <h3 className="display-serif text-2xl text-gold-300">Company Registration</h3>
              <p className="mt-4 max-w-prose text-[14.5px] leading-relaxed text-ivory/85">
                Registered with the Corporate Affairs Commission (CAC), RC 1178333.
              </p>
              <h3 className="mt-8 display-serif text-2xl text-gold-300">Accreditations &amp; Certifications</h3>
              <ul className="mt-6 space-y-3.5">
                {INSTITUTIONAL_DATA.accreditations
                  .filter((acc) => !acc.startsWith("Corporate Affairs Commission"))
                  .map((acc) => (
                  <li key={acc} className="flex items-start gap-3 text-[14.5px] text-ivory/85 max-w-prose">
                    <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-gold-300" />
                    {acc}
                  </li>
                  ))}
              </ul>
            </div>

            <div className="border border-ivory/20 bg-forest-900/60 p-8 sm:p-10 lg:col-span-5">
              <h3 className="display-serif text-2xl text-gold-300">International Technical Partnership</h3>
              <p className="mt-4 text-[15px] font-bold text-ivory">
                {INSTITUTIONAL_DATA.technicalPartner}
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

      {/* Governance & Advisory */}
      <section className="border-t border-line bg-white section-y">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">Governance &amp; Advisory</p>
              <h2 className="type-h2 mt-4 text-ink">
                Institutional governance &amp; management structure
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-ink/85 max-w-prose">
                {GOVERNANCE_INFO.councilSummary}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-pill bg-forest-50 px-4 py-1.5 text-[12.5px] font-bold text-forest-800">
                  Governing Council: 4 Directors
                </span>
                <span className="rounded-pill bg-stone px-4 py-1.5 text-[12.5px] font-bold text-ink">
                  Management Team: 20 Advisors &amp; Experts
                </span>
                <span className="rounded-pill bg-gold-100 px-4 py-1.5 text-[12.5px] font-bold text-gold-700">
                  {GOVERNANCE_INFO.boardChairman}
                </span>
              </div>
            </Reveal>
          </div>

          <div className="mt-12 lg:col-span-5 lg:mt-0">
            <Reveal delay={0.08}>
              <p className="eyebrow">Academic Board &amp; Advisory Structure</p>
              <h3 className="display-serif mt-3 text-xl text-ink">
                14 Functional Designations
              </h3>
              <p className="mt-3 type-body text-muted">
                The operational governance framework coordinating academic
                activities, curriculum development, inter-agency relations, and
                international partnerships.
              </p>
            </Reveal>
            <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {FACULTY_ADVISORS.map((advisor) => (
                <Reveal key={advisor.id} delay={advisor.id * 0.03}>
                  <div className="border-t rule pt-5 max-w-card">
                    <h4 className="text-[15px] font-bold text-ink">{advisor.designation}</h4>
                    <p className="mt-1 type-body text-muted max-w-prose">{advisor.category}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Training Locations */}
      <section className="border-y border-line bg-paper section-y">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">Training Locations</p>
              <h2 className="type-h2 mt-4 text-ink">
                Three <em className="italic text-forest-700">training hubs.</em>
              </h2>
              <p className="mt-5 max-w-prose type-body text-muted">
                Permanent training centres in Ilorin, Abuja and Ibafo, with
                additional off-campus delivery across Nigeria.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 space-y-8 lg:col-span-7 lg:mt-0">
            {CAMPUS_LOCATIONS.map((campus, idx) => (
              <Reveal key={campus.id} delay={idx * 0.08}>
                <div className="border border-line bg-white p-8 shadow-crisp lg:p-10">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b rule pb-5">
                    <h3 className="display-serif text-2xl text-ink sm:text-3xl">
                      {campus.name}
                    </h3>
                    <span className="rounded-pill bg-forest-600 px-4 py-1.5 text-[12px] font-bold text-ivory">
                      Active Training Center
                    </span>
                  </div>
                  <div className="mt-5 flex items-start gap-3 text-[14.5px] text-ink/90">
                    <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-forest-600" />
                    <p className="font-semibold max-w-prose">{campus.address}</p>
                  </div>
                  <p className="mt-4 text-[13.5px] leading-relaxed text-muted max-w-prose">
                    {campus.academicFacilities}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ClosingQuiet
        eyebrow="Take Advantage of Us"
        title="Train your team"
        body="The 2026 Training Calendar lists 113 local and 22 foreign executive programmes. Organisations can enquire about training for their staff, or ask our training advisors what fits."
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
