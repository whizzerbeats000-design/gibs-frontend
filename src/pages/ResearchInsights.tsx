import { useState } from "react";
import { PageHero } from "../components/PageHero";
import { BtnLink, EmptyState, ArrowTextLink, ClosingJournal } from "../components/ui";
import { Reveal } from "../components/motion";
import { EditorialCard } from "../components/cards";
import { Link, useSeo } from "../lib/router";
import { RESEARCH_THEMES, ARTICLES, imageSet } from "../lib/data";
import { cn } from "../utils/cn";

export default function ResearchInsights() {
  useSeo({
    title: "Research & Insights — GIBS",
    description:
      "GIBS research themes, forthcoming essays, leadership perspectives and case studies from the Global Africa.",
  });

  const [featured, ...rest] = ARTICLES;
  const categories = ["All", ...Array.from(new Set(ARTICLES.map((a) => a.category)))];
  const [active, setActive] = useState("All");
  const list = rest.filter((a) => active === "All" || a.category === active);
  // Count only what appears in the grid below the featured piece.
  // The featured article is always shown regardless of filter.
  const filteredCount = list.length;
  const featuredMatchesFilter = active === "All" || (featured ? featured.category === active : false);

  return (
    <>
      <PageHero
        title="The GIBS journal"
        intro="The first edition is in editorial preparation. Research essays, case studies and faculty perspectives will appear here once it publishes."
        breadcrumbs={[{ label: "Research & Insights" }]}
      />

      {/* Featured */}
      {featured && (
        <section className="bg-white">
          <div className="container-x section-y">
            <Reveal>
              <p className="meta text-forest-600">{featured.kicker} · {featured.status}</p>
            </Reveal>
            <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-10">
              <Reveal y={36} className="lg:col-span-7">
                <Link
                  to={`/research-insights/${featured.slug}`}
                  className="group block"
                  aria-label={`Read the preview: ${featured.title}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      {...imageSet(featured.image)}
                      alt={featured.alt}
                      loading="eager"
                      decoding="async"
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-forest-900/25" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-ink/10" />
                  </div>
                </Link>
              </Reveal>
              <div className="flex flex-col justify-center lg:col-span-5">
                <Reveal>
                  <p className="eyebrow text-forest-600">
                    {featured.category}
                  </p>
                  <Link to={`/research-insights/${featured.slug}`} className="group">
                    <h2 className="type-h2 mt-5 text-ink transition-colors group-hover:text-forest-700">
                      {featured.title}
                    </h2>
                  </Link>
                  <p className="mt-5 type-body">{featured.dek}</p>
                  <div className="mt-8">
                    <ArrowTextLink to={`/research-insights/${featured.slug}`}>
                      Read the editorial preview
                    </ArrowTextLink>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Theme navigation */}
      <section className="paper-grain border-y border-line bg-paper">
        <div className="container-x section-y grid lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">Browse by theme</p>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-7 lg:mt-0">
            {RESEARCH_THEMES.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.05}>
                <h3 className="type-h3 mt-3 text-ink">{t.title}</h3>
                <p className="mt-2 max-w-prose type-body">{t.blurb}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Forthcoming listing */}
      <section className="bg-white">
        <div className="container-x section-y grid lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">Forthcoming</p>
              <h2 className="type-h2 mt-5 text-ink">
                The first edition
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            {/* Functional category filter */}
            <div className="mt-9 flex flex-wrap items-center gap-2.5" role="group" aria-label="Filter insights by category">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={active === cat}
                  onClick={() => setActive(cat)}
                  className={cn(
                    "chip",
                    active === cat
                      ? "border-forest-600 bg-forest-600 text-ivory"
                      : "border-ink/20 text-ink/70 hover:border-forest-600 hover:text-forest-700"
                  )}
                >
                  {cat}
                </button>
              ))}
              <span className="meta ml-1" aria-live="polite">
                {featuredMatchesFilter ? filteredCount + 1 : filteredCount}{" "}
                {(featuredMatchesFilter ? filteredCount + 1 : filteredCount) === 1 ? "piece" : "pieces"}
              </span>
            </div>

            {list.length > 0 ? (
              <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                {list.map((post) => (
                  <EditorialCard
                    key={post.slug}
                    to={`/research-insights/${post.slug}`}
                    image={post.image}
                    alt={post.alt}
                    tag={post.category}
                    meta="Forthcoming"
                    title={post.title}
                    excerpt={post.dek}
                    cta="Read the preview"
                  />
                ))}
              </div>
            ) : (
              <div className="mt-12">
                <EmptyState
                  title={
                    featuredMatchesFilter
                      ? "Featured above"
                      : ARTICLES.length === 0
                      ? "Inaugural edition in preparation"
                      : "No pieces in this theme yet"
                  }
                  body={
                    featuredMatchesFilter
                      ? `The ${active} piece in this first edition is featured at the top of this page. New pieces in this theme will appear here as the journal publishes.`
                      : ARTICLES.length === 0
                      ? "The first edition is in editorial preparation. Research essays, case studies and faculty perspectives will appear here once it publishes."
                      : `No pieces in the "${active}" theme have been published yet. More essays and perspectives are in preparation.`
                  }
                  action={<BtnLink to="/concierge" variant="outline-ink" size="md">Ask GIBS AI</BtnLink>}
                />
              </div>
            )}

            <div className="mt-16">
              <EmptyState
                title="The full archive opens with the journal"
                body="Published articles, case studies and research papers appear here with their authors, dates and citations."
                action={<BtnLink to="/events" variant="outline-ink" size="md">See launch events</BtnLink>}
              />
            </div>
          </div>
        </div>
      </section>

      <ClosingJournal
        eyebrow="The GIBS Brief"
        quote={<>Follow the thinking <em className="italic text-gold-300">as it forms.</em></>}
        body="Subscribe to the monthly brief when the journal launches, or speak with faculty about research and casework."
        actions={
          <>
            <BtnLink to="/faculty" variant="gold" size="lg">Faculty & research</BtnLink>
            <BtnLink to="/contact" variant="outline-light" size="lg">
              Contact the editors
            </BtnLink>
          </>
        }
      />
    </>
  );
}
