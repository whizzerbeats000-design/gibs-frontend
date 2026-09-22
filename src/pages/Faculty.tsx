import { PageHero } from "../components/PageHero";
import { BtnLink, ClosingQuiet, EmptyState } from "../components/ui";
import { ThemeCard } from "../components/cards";
import { Reveal } from "../components/motion";
import { useSeo } from "../lib/router";
import { RESEARCH_THEMES, IMAGES } from "../lib/data";

const ACADEMIC_PILLARS = [
  {
    title: "Research that answers practice",
    body: "Faculty pursue questions drawn from real institutions, then carry answers back into the classroom and the boardroom.",
  },
  {
    title: "Teaching by practitioners",
    body: "Faculty work within the markets and organizations they teach, not at a distance from them.",
  },
  {
    title: "A global conversation",
    body: "Visiting scholars and partnerships connect GIBS to the wider academy. Details are published as confirmed.",
  },
];

export default function Faculty() {
  useSeo({
    title: "Faculty & Research — GIBS",
    description:
      "GIBS faculty research across leadership, markets, enterprise and organizations. Faculty directory and publications in preparation.",
  });

  return (
    <>
      <PageHero
        image={IMAGES.library}
        imageAlt="The GIBS library, where scholarship and practice meet"
        eyebrow="Faculty & Research"
        title="Knowledge with"
        italic="consequence."
        intro="GIBS faculty are scholar-practitioners who move between institutions of learning and the institutions their work describes. Their scholarship is judged by what it changes."
        breadcrumbs={[{ label: "Faculty & Research" }]}
      />

      {/* Research themes */}
      <section className="bg-white">
        <div className="container-x py-20 sm:py-24">
          <Reveal>
            <p className="eyebrow">Research Areas</p>
            <h2 className="display-serif type-h2 mt-5 max-w-3xl text-ink">
              Four questions the institution
              <em className="text-forest-700"> keeps returning to.</em>
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

      {/* Directory pending */}
      <section className="bg-white">
        <div className="container-x py-20 sm:py-24">
          <Reveal>
            <p className="eyebrow">The Directory</p>
            <h2 className="display-serif type-h2 mt-5 text-ink">
              Faculty profiles
            </h2>
          </Reveal>
          <div className="mt-10">
            <EmptyState
              title="The faculty directory is in preparation"
              body="Named chairs, biographies, research interests and publication records are published as appointments are confirmed. The directory contains no speculative names."
              action={
                <div className="flex flex-wrap justify-center gap-3">
                  <BtnLink to="/research-insights" variant="primary" size="md">
                    Research & insights
                  </BtnLink>
                  <BtnLink to="/contact?type=Media+%26+partnerships" variant="outline-ink" size="md">
                    Enquire about faculty
                  </BtnLink>
                </div>
              }
            />
          </div>
        </div>
      </section>

      <ClosingQuiet
        surface="white"
        eyebrow="Faculty & Research"
        title="Think"
        italic="with us."
        body="Follow research as it forms, or begin a conversation about doctoral study, executive partnerships and casework."
        actions={
          <>
            <BtnLink to="/research-insights" variant="primary" size="lg">Research & insights</BtnLink>
            <BtnLink to="/programmes/doctorate-business-administration" variant="outline-ink" size="lg">
              Doctoral study
            </BtnLink>
          </>
        }
      />
    </>
  );
}
