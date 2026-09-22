import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ProgramRow } from "../components/cards";
import { BtnLink, Breadcrumbs, DataNote, EmptyState } from "../components/ui";
import { SearchIcon, CloseIcon } from "../components/icons";
import { PROGRAMMES, PROGRAM_CATEGORIES } from "../lib/data";
import { Reveal, stagger, staggerItem } from "../components/motion";
import { useSeo } from "../lib/router";
import { cn } from "../utils/cn";

export default function ProgrammesPage() {
  useSeo({
    title: "Programmes — GIBS",
    description:
      "Explore GIBS programmes: the MBA, Executive MBA, Doctor of Business Administration, executive education and undergraduate business pathways.",
  });

  const [category, setCategory] = useState<(typeof PROGRAM_CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROGRAMMES.filter((p) => {
      const categoryMatch = category === "All" || p.category === category;
      const queryMatch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return categoryMatch && queryMatch;
    });
  }, [category, query]);

  return (
    <>
      {/* Editorial introduction — intentionally image-free, typographic, spacious */}
      <section className="bg-paper">
        <div className="container-x pb-12 pt-[112px] sm:pb-16 sm:pt-[132px] lg:pb-20 lg:pt-[148px]">
          <Breadcrumbs items={[{ label: "Programmes" }]} />
          <Reveal>
            <p className="eyebrow mt-6">The Programmes</p>
          </Reveal>
          <Reveal delay={0.06} y={20}>
            <h1 className="type-h1 mt-4 max-w-3xl text-ink">
              Programmes for <em className="italic text-forest-700">ambitious minds.</em>
            </h1>
          </Reveal>
          <Reveal delay={0.12} y={16}>
            <p className="mt-6 max-w-2xl type-body">
              From first degree to doctorate, and from open executive convenings to journeys
              built for one institution.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-10 h-px w-full bg-line" />
          </Reveal>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-x pb-24 pt-8 sm:pb-32 sm:pt-10">
          {/* Filters */}
          <div className="sticky top-[72px] z-20 -mx-5 mb-10 border-y border-line bg-white/92 px-5 py-4 backdrop-blur-md sm:mx-0 sm:rounded-panel sm:border sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div
                role="group"
                aria-label="Filter programmes by category"
                className="flex flex-wrap gap-2.5"
              >
                {PROGRAM_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={category === cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "chip",
                      category === cat
                        ? "border-forest-600 bg-forest-600 text-ivory"
                        : "border-ink/20 text-ink/70 hover:border-forest-600 hover:text-forest-700"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:w-72">
                <label htmlFor="programme-search" className="sr-only">
                  Search programmes
                </label>
                <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  id="programme-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search programmes…"
                  className="w-full rounded-pill border border-ink/20 bg-paper py-2.5 pl-10 pr-9 text-base text-ink placeholder:text-muted/70 focus:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-600/20 sm:text-sm"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          <p className="meta mb-2" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "programme" : "programmes"}
            {category !== "All" ? ` · ${category}` : ""}
          </p>

          {filtered.length > 0 ? (
            <motion.div
              key={`${category}-${query}`}
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="border-t rule"
            >
              {filtered.map((p, i) => (
                <motion.div key={p.slug} variants={staggerItem}>
                  <ProgramRow programme={p} index={i} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <EmptyState
              title="No programmes match"
              body="No programme matches that combination of category and search. Try a broader term or reset the filters to see every pathway."
              action={
                <BtnLink
                  to="/programmes"
                  variant="outline-ink"
                  size="md"
                  onClick={() => {
                    setCategory("All");
                    setQuery("");
                  }}
                >
                  Reset filters
                </BtnLink>
              }
            />
          )}

          <div className="mt-14 grid gap-8 border-t rule pt-10 lg:grid-cols-2">
            <DataNote label="Official programme information to be published">
              Durations, fees, dates and entry requirements are published by
              the registrar once confirmed. Pending items appear on each
              programme page as "To be published".
            </DataNote>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:justify-end">
              <BtnLink to="/admissions" variant="primary" size="lg">
                Begin admissions
              </BtnLink>
              <BtnLink to="/concierge" variant="outline-ink" size="lg">
                Ask the Concierge
              </BtnLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
