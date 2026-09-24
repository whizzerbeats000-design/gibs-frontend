import { PageHero } from "../components/PageHero";
import { BtnLink, ClosingQuiet } from "../components/ui";
import { ThemeCard } from "../components/cards";
import { Reveal } from "../components/motion";
import { useSeo } from "../lib/router";
import {
  RESEARCH_THEMES,
  IMAGES,
  FACULTY_DESIGNATIONS,
  INTERNATIONAL,
  INSTITUTION,
} from "../lib/data";

const ACADEMIC_PILLARS = [
  {
    title: "Research that answers practice",
    body: "Faculty and advisors pursue questions drawn from real institutions, carrying practical answers into capacity-building workshops.",
  },
  {
    title: "Expertise by practitioners",
    body: "Advisors work directly within the industries, agencies, and projects they guide.",
  },
  {
    title: "Global academic partnerships",
    body: `Technical partnership with ${INTERNATIONAL.technicalPartner} connects ${INSTITUTION.abbreviation} to international standards.`,
  },
];

export default function Faculty() {
  useSeo({
    title: `Faculty & Advisory Board — ${INSTITUTION.abbreviation}`,
    description: `Official management team and advisors of ${INSTITUTION.legalName}.`,
  });

  return (
    <>
      <PageHero
        image={IMAGES.library}
        imageAlt="GIBS faculty and academic library"
        eyebrow="Faculty & Advisory Structure"
        title="Scholarship &"
        italic="Capacity Development."
        intro={`${INSTITUTION.legalName} operates under a Governing Council with 4 directors under the Chairman, supported by an academic and management advisory team of experts.`}
        breadcrumbs={[{ label: "Faculty & Board" }]}
      />

      {/* Research themes */}
      <section className="bg-white">
        <div className="container-x py-20 sm:py-24">
          <Reveal>
            <p className="eyebrow">Research & Capacity Focus</p>
            <h2 className="display-serif type-h2 mt-5 max-w-3xl text-ink">
              Core academic <em className="text-forest-700">pillars.</em>
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {RESEARCH_THEMES.map((theme, i) => (
              <Reveal key={theme.title} delay={i * 0.06}>
                <ThemeCard number="" title={theme.title} blurb={theme.blurb} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Academic pillars */}
      <section className="paper-grain border-y border-line bg-paper">
        <div className="container-x grid gap-px overflow-hidden border border-line bg-line lg:grid-cols-3">
          {ACADEMIC_PILLARS.map((p) => (
            <div key={p.title} className="bg-paper p-9 sm:p-11">
              <h3 className="display-serif type-h3 text-ink">{p.title}</h3>
              <p className="mt-4 type-body">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Partnership Section */}
      <section className="border-y border-line bg-forest-900 text-ivory">
        <div className="container-x py-16 sm:py-20">
          <Reveal>
            <p className="eyebrow-light">International Technical Partner</p>
            <h2 className="display-serif type-h2 mt-3 text-ivory">
              {INTERNATIONAL.technicalPartner}
            </h2>
            <p className="mt-4 max-w-2xl type-body text-ivory/85">
              GIBS collaborates with global partners to deliver international standard management and capacity-building programs.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Official Management & Advisory Structure */}
      <section className="bg-white">
        <div className="container-x py-20 sm:py-24">
          <Reveal>
            <p className="eyebrow">Academic & Management Board</p>
            <h2 className="display-serif type-h2 mt-4 text-ink">
              Advisory & Coordination Designations
            </h2>
            <p className="mt-3 type-body text-muted max-w-3xl">
              Official institutional designations of the GIBS management and advisory team:
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FACULTY_DESIGNATIONS.map((member) => (
              <Reveal key={member.id} delay={Number(member.id) * 0.03}>
                <div className="border border-line bg-paper p-6 h-full flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold tracking-[0.16em] text-forest-600">
                      {member.id}
                    </span>
                    <h3 className="display-serif type-h3 mt-2 text-ink">{member.title}</h3>
                  </div>
                  <p className="mt-4 text-[12px] font-medium uppercase tracking-[0.12em] text-muted">
                    {member.department}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ClosingQuiet
        surface="white"
        eyebrow="Academic Governance"
        title="Partner"
        italic="with us."
        body="Contact the academic board for institutional collaborations, capacity development projects, and custom training."
        actions={
          <>
            <BtnLink to="/contact?type=Media+%26+partnerships" variant="primary" size="lg">
              Partner With Us
            </BtnLink>
            <BtnLink to="/programmes" variant="outline-ink" size="lg">
              View Programmes
            </BtnLink>
          </>
        }
      />
    </>
  );
}
