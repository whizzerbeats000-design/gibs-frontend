import { Reveal } from "../components/motion";
import { BtnLink, Eyebrow } from "../components/ui";
import { ArrowUpRight } from "../components/icons";
import { Link } from "../lib/router";
import {
  PROGRAMMES,
  LOCAL_PROGRAMMES,
  FOREIGN_PROGRAMMES,
  HOME_PROGRAMME_BANDS,
  type Programme,
} from "../lib/data";

/*
 * The curated homepage selection, resolved to real programme records.
 *
 * `HOME_PROGRAMME_BANDS` is the four editorial bands this section has always
 * drawn from — three local, one covering the four foreign hubs — each a list of
 * slugs. Flattening and resolving them keeps the selection canonical: titles,
 * codes and destinations come straight from PROGRAMMES, and partitioning on
 * `destination` yields the twelve local and four foreign programmes with no
 * slug hard-coded here. Group totals are read from the derived LOCAL/FOREIGN
 * arrays the catalogue pages use, so the copy cannot drift from PROGRAMMES.
 */
const SELECTED_PROGRAMMES = HOME_PROGRAMME_BANDS.flatMap((band) => band.slugs)
  .map((slug) => PROGRAMMES.find((p) => p.slug === slug))
  .filter((p): p is Programme => Boolean(p));

const PROGRAMME_GROUPS = [
  {
    title: "Local Programmes",
    body: `${LOCAL_PROGRAMMES.length} programmes across Nigeria, with training locations including Ilorin, Abuja and Ibafo.`,
    cta: "Explore Local Programmes",
    to: "/programmes",
    selected: SELECTED_PROGRAMMES.filter((p) => p.destination === "Local"),
  },
  {
    title: "Foreign Executive Programmes",
    body: `${FOREIGN_PROGRAMMES.length} international executive programmes across Kigali, Dubai, London and Houston.`,
    cta: "Explore Foreign Executive Programmes",
    to: "/executive-education",
    selected: SELECTED_PROGRAMMES.filter((p) => p.destination !== "Local"),
  },
];

/** One row of the editorial list: real title, quiet provenance, detail link.
    Sized to scan rather than to describe — the catalogue carries the copy. */
function ProgrammeListItem({ programme }: { programme: Programme }) {
  const isForeign = programme.destination !== "Local";
  return (
    <li className="border-t rule">
      <Link to={`/programmes/${programme.slug}`} className="group flex items-start gap-3 py-3 sm:py-4">
        <span className="min-w-0">
          {/* Titles come from PROGRAMMES, not markup, so they may carry long
              unbroken tokens. `wrap-anywhere` and not `break-words`: the row is
              a grid item, and only `anywhere` reduces the min-content
              contribution, so the column can shrink instead of forcing the
              whole document into horizontal scroll. They wrap rather than
              truncate — the full title is the thing being scanned. */}
          <span className="card-title block wrap-anywhere group-focus-visible:text-forest-700">
            {programme.title}
          </span>
          <span className="meta mt-1 block">
            {isForeign ? `${programme.destination} Hub · ` : ""}
            {programme.code}
          </span>
        </span>
        {/* The arrow and the title carry the same two states. Hover alone would
            leave a keyboard user with the focus ring but none of the affordance
            a mouse user gets, which is the split this codebase forbids (see the
            focus-visible/focus-within pairing note above `.card-lift`). */}
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-forest-600 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5" />
      </Link>
    </li>
  );
}

export default function ProgrammeDiscovery() {
  return (
    <section id="programmes" className="cv-auto relative bg-white px-6 md:px-12 lg:px-16">
      <div className="container-x mx-auto section-y text-left">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>Programme Discovery</Eyebrow>
            </Reveal>
            <Reveal delay={0.08} y={28}>
              <h2 className="type-h2 mt-5 text-ink">
                Explore our programmes
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16} className="lg:col-span-6 lg:col-start-7">
            <p className="max-w-prose type-body">
              Professional development programmes in Nigeria and international
              executive training.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 space-y-12 sm:mt-16 sm:space-y-14">
          {PROGRAMME_GROUPS.map((group) => (
            <Reveal key={group.title} delay={0.08}>
              <h3 className="type-h3 text-ink">{group.title}</h3>
              <p className="mt-3 max-w-prose type-body text-muted">{group.body}</p>

              <ul className="mt-8 grid gap-x-12 sm:grid-cols-2">
                {group.selected.map((programme) => (
                  <ProgrammeListItem key={programme.slug} programme={programme} />
                ))}
              </ul>

              {/* Long label on the foreign CTA would overrun 320px, so it wraps
                  to a full-width pill on phones and returns to auto-width from
                  sm up. */}
              <div className="mt-8">
                <BtnLink
                  to={group.to}
                  variant="primary"
                  size="lg"
                  className="w-full justify-center whitespace-normal px-5 text-center text-sm sm:w-auto sm:whitespace-nowrap sm:px-7 sm:text-[15px]"
                >
                  {group.cta}
                  <ArrowUpRight className="h-4 w-4" />
                </BtnLink>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}