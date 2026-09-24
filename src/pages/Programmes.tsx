import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ProgramRow } from "../components/cards";
import { BtnLink, Breadcrumbs, EmptyState } from "../components/ui";
import { SearchIcon, CloseIcon } from "../components/icons";
import { PROGRAMMES, PROGRAM_CATEGORIES, LOCAL_PROGRAMMES, FOREIGN_PROGRAMMES } from "../lib/data";
import { Reveal, stagger, staggerItem } from "../components/motion";
import { useSeo } from "../lib/router";
import { cn } from "../utils/cn";

export default function ProgrammesPage() {
  useSeo({
    title: "135 Training Programmes — GIBS",
    description:
      "Explore GIBS complete catalogue of 113 local training programmes across Nigeria and 22 foreign programmes in Kigali, Dubai, London, and Houston.",
  });

  const [category, setCategory] = useState<(typeof PROGRAM_CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROGRAMMES.filter((p) => {
      let categoryMatch = false;
      if (category === "All") {
        categoryMatch = true;
      } else if (category === "Local/Open") {
        categoryMatch = p.programmeType === "Local/Open";
      } else if (category === "Foreign") {
        categoryMatch = p.programmeType === "Foreign";
      } else {
        categoryMatch = p.category === category;
      }

      const queryMatch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.target.toLowerCase().includes(q) ||
        p.schedule.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.destination.toLowerCase().includes(q) ||
        (p.number && p.number.toString().includes(q));

      return categoryMatch && queryMatch;
    });
  }, [category, query]);

  return (
    <>
      {/* Editorial introduction */}
      <section className="bg-paper">
        <div className="container-x pb-12 pt-[112px] sm:pb-16 sm:pt-[132px] lg:pb-20 lg:pt-[148px]">
          <Breadcrumbs items={[{ label: "Programmes" }]} />
          <Reveal>
            <p className="eyebrow mt-6">Catalogue of 135 Programmes</p>
          </Reveal>
          <Reveal delay={0.06} y={20}>
            <h1 className="type-h1 mt-4 max-w-3xl text-ink">
              Capacity-building for <em className="italic text-forest-700">public & private leaders.</em>
            </h1>
          </Reveal>
          <Reveal delay={0.12} y={16}>
            <p className="mt-6 max-w-2xl type-body">
              Browse all <strong>113 local training courses</strong> across our Ilorin HQ, Abuja, Ibafo, and domestic centers, plus <strong>22 foreign overseas programmes</strong> in Kigali, Dubai, London, and Houston.
            </p>
          </Reveal>

          {/* Quick metric chips */}
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-wider text-forest-800">
              <span className="rounded-full bg-forest-50 px-3 py-1.5 border border-forest-200">
                Total: 135 Programmes
              </span>
              <span className="rounded-full bg-forest-50 px-3 py-1.5 border border-forest-200">
                Local: 113 Courses (₦ NGN)
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1.5 border border-amber-200 text-amber-900">
                Foreign: 22 Courses (USD / GBP)
              </span>
            </div>
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
                className="flex flex-wrap gap-2"
              >
                {PROGRAM_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={category === cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "chip text-xs py-1.5 px-3",
                      category === cat
                        ? "border-forest-600 bg-forest-600 text-ivory"
                        : "border-ink/20 text-ink/70 hover:border-forest-600 hover:text-forest-700"
                    )}
                  >
                    {cat === "Local/Open" ? `Local Courses (${LOCAL_PROGRAMMES.length})` : cat === "Foreign" ? `Foreign Courses (${FOREIGN_PROGRAMMES.length})` : cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:w-80">
                <label htmlFor="programme-search" className="sr-only">
                  Search programmes by title, category, venue, or number
                </label>
                <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  id="programme-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title, location, schedule, or number…"
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

          {/* Results Metadata */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="meta" aria-live="polite">
              Showing <strong>{filtered.length}</strong> of <strong>135</strong> programmes
              {category !== "All" ? ` · ${category}` : ""}
              {query ? ` · matching "${query}"` : ""}
            </p>
            {(category !== "All" || query) && (
              <button
                type="button"
                onClick={() => {
                  setCategory("All");
                  setQuery("");
                }}
                className="text-xs font-semibold text-forest-700 hover:underline"
              >
                Reset all filters
              </button>
            )}
          </div>

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
              body="No programme matches that combination of category and search. Try a broader term like 'finance', 'telecom', 'dubai', or 'kigali'."
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

          <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t rule pt-10">
            <div>
              <p className="type-h3 text-ink">Need custom corporate training?</p>
              <p className="mt-1 text-sm text-ink/70">
                GIBS designs tailored capacity-building workshops for public sector MDAs and private enterprises.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <BtnLink to="/contact" variant="primary" size="lg">
                Register Participants
              </BtnLink>
              <BtnLink to="/concierge" variant="outline-ink" size="lg">
                Inquire via Concierge
              </BtnLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
