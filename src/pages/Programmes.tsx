import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ProgramRow } from "../components/cards";
import { BtnLink, Breadcrumbs, EmptyState } from "../components/ui";
import { SearchIcon, CloseIcon } from "../components/icons";
import { PROGRAMMES, PROGRAM_CATEGORIES } from "../lib/data";
import { Reveal, stagger, staggerItem } from "../components/motion";
import { useSeo } from "../lib/router";
import { cn } from "../utils/cn";

type DestinationFilter = "All" | "Local" | "Kigali" | "Dubai" | "London" | "Houston";

export default function ProgrammesPage() {
  useSeo({
    title: "2026 Training Calendar (135 Programmes) — GIBS",
    description:
      "Complete 2026 GIBS Training Calendar: 113 Local Open Programmes and 22 Foreign Executive Programmes in Kigali, Dubai, London, and Houston.",
  });

  const [category, setCategory] = useState<(typeof PROGRAM_CATEGORIES)[number]>("All");
  const [destination, setDestination] = useState<DestinationFilter>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROGRAMMES.filter((p) => {
      const categoryMatch = category === "All" || p.category === category;
      const destinationMatch =
        destination === "All"
          ? true
          : destination === "Local"
          ? p.destination === "Local"
          : p.destination === destination;

      const queryMatch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.destination.toLowerCase().includes(q) ||
        p.schedule.toLowerCase().includes(q) ||
        p.targetAudience.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q);

      return categoryMatch && destinationMatch && queryMatch;
    });
  }, [category, destination, query]);

  const localCount = useMemo(() => PROGRAMMES.filter((p) => p.destination === "Local").length, []);

  return (
    <>
      {/* Header section */}
      <section className="bg-paper">
        <div className="container-x pb-10 pt-[112px] sm:pb-14 sm:pt-[132px] lg:pb-16 lg:pt-[148px]">
          <Breadcrumbs items={[{ label: "2026 Training Calendar" }]} />
          <Reveal>
            <p className="eyebrow mt-4">2026 Executive Training Calendar</p>
          </Reveal>
          <Reveal delay={0.06} y={20}>
            <h1 className="display-serif type-h1 mt-3 max-w-4xl text-ink">
              135 Capacity-Building <em className="italic text-forest-700">Programmes.</em>
            </h1>
          </Reveal>
          <Reveal delay={0.12} y={16}>
            <p className="mt-5 max-w-3xl type-body text-ink/80">
              113 Local Open Training Programmes delivered across our Ilorin Headquarters, Abuja,
              and Ibafo Centers, plus 22 Foreign Executive Training Programmes across Kigali,
              Dubai, London, and Houston.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper border-t border-line">
        <div className="container-x pb-24 pt-6 sm:pb-32 sm:pt-8">
          {/* Scope / Destination Tabs */}
          <div className="border-b border-line pb-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="shrink-0 mr-1 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                Scope:
              </span>
              <button
                type="button"
                onClick={() => {
                  setDestination("All");
                  setCategory("All");
                }}
                className={cn(
                  "min-h-[36px] shrink-0 rounded-[10px] px-3.5 py-1.5 text-[12.5px] font-semibold transition-[transform,box-shadow,background-color] duration-150 ease-out",
                  destination === "All"
                    ? "bg-forest-900 text-ivory border border-forest-950 shadow-card"
                    : "bg-white text-ink hover:bg-stone/60 border border-line shadow-crisp"
                )}
              >
                All Programmes (135)
              </button>
              <button
                type="button"
                onClick={() => {
                  setDestination("Local");
                  if (category === "Foreign Executive Training") setCategory("All");
                }}
                className={cn(
                  "min-h-[36px] shrink-0 rounded-[10px] px-3.5 py-1.5 text-[12.5px] font-semibold transition-[transform,box-shadow,background-color] duration-150 ease-out",
                  destination === "Local"
                    ? "bg-forest-600 text-ivory border border-forest-700 shadow-card"
                    : "bg-white text-ink hover:bg-stone/60 border border-line shadow-crisp"
                )}
              >
                Local / Open ({localCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  setDestination("Kigali");
                  setCategory("All");
                }}
                className={cn(
                  "min-h-[36px] shrink-0 rounded-[10px] px-3.5 py-1.5 text-[12.5px] font-semibold transition-[transform,box-shadow,background-color] duration-150 ease-out",
                  destination === "Kigali"
                    ? "bg-gold-600 text-ivory border border-gold-700 shadow-card"
                    : "bg-white text-ink hover:bg-stone/60 border border-line shadow-crisp"
                )}
              >
                Kigali Hub (8)
              </button>
              <button
                type="button"
                onClick={() => {
                  setDestination("Dubai");
                  setCategory("All");
                }}
                className={cn(
                  "min-h-[36px] shrink-0 rounded-[10px] px-3.5 py-1.5 text-[12.5px] font-semibold transition-[transform,box-shadow,background-color] duration-150 ease-out",
                  destination === "Dubai"
                    ? "bg-gold-600 text-ivory border border-gold-700 shadow-card"
                    : "bg-white text-ink hover:bg-stone/60 border border-line shadow-crisp"
                )}
              >
                Dubai Hub (5)
              </button>
              <button
                type="button"
                onClick={() => {
                  setDestination("London");
                  setCategory("All");
                }}
                className={cn(
                  "min-h-[36px] shrink-0 rounded-[10px] px-3.5 py-1.5 text-[12.5px] font-semibold transition-[transform,box-shadow,background-color] duration-150 ease-out",
                  destination === "London"
                    ? "bg-gold-600 text-ivory border border-gold-700 shadow-card"
                    : "bg-white text-ink hover:bg-stone/60 border border-line shadow-crisp"
                )}
              >
                London Hub (4)
              </button>
              <button
                type="button"
                onClick={() => {
                  setDestination("Houston");
                  setCategory("All");
                }}
                className={cn(
                  "min-h-[36px] shrink-0 rounded-[10px] px-3.5 py-1.5 text-[12.5px] font-semibold transition-[transform,box-shadow,background-color] duration-150 ease-out",
                  destination === "Houston"
                    ? "bg-gold-600 text-ivory border border-gold-700 shadow-card"
                    : "bg-white text-ink hover:bg-stone/60 border border-line shadow-crisp"
                )}
              >
                Houston Hub (5)
              </button>
            </div>
          </div>

          {/* Sticky filter & search container (Matching Admissions card elevation) */}
          <div className="sticky top-[72px] z-20 -mx-5 mb-6 border-b border-line bg-paper/95 px-5 py-3.5 backdrop-blur-md sm:mx-0 sm:my-6 sm:rounded-[16px] sm:border sm:border-line sm:bg-white sm:px-6 sm:py-4 sm:shadow-card">
            <div className="flex flex-col gap-3">
              {/* Search bar with warm editorial border & subtle inset highlight */}
              <div className="relative w-full">
                <label htmlFor="programme-search" className="sr-only">
                  Search 2026 programmes
                </label>
                <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  id="programme-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by programme title, course code, sector, venue or city…"
                  className="w-full rounded-[10px] border border-line bg-paper/50 py-2.5 pl-10 pr-9 text-base text-ink placeholder:text-muted shadow-[inset_1px_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(18,18,18,0.03)] focus:border-forest-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600/20 sm:text-sm"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink p-1"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Sector / Category Filter Chips */}
              <div
                role="group"
                aria-label="Filter programmes by sector"
                className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
              >
                {PROGRAM_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={category === cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "shrink-0 rounded-[10px] px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap min-h-[32px] transition-[transform,box-shadow,background-color] duration-150 ease-out",
                      category === cat
                        ? "bg-forest-600 text-ivory border border-forest-700 shadow-card"
                        : "bg-white text-muted hover:text-ink hover:bg-stone/60 border border-line shadow-crisp"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results summary bar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm">
            <p className="text-[12.5px] text-muted" aria-live="polite">
              Showing <span className="font-bold text-ink">{filtered.length}</span> of {PROGRAMMES.length} programmes
              {destination !== "All" ? ` · ${destination} Hub` : ""}
              {category !== "All" ? ` · ${category}` : ""}
            </p>
            {(category !== "All" || destination !== "All" || query) && (
              <button
                type="button"
                onClick={() => {
                  setCategory("All");
                  setDestination("All");
                  setQuery("");
                }}
                className="text-[12px] font-bold uppercase tracking-wider text-forest-700 hover:text-forest-800 hover:underline"
              >
                Reset all filters
              </button>
            )}
          </div>

          {/* Programme list with explicit card spacing */}
          {filtered.length > 0 ? (
            <motion.div
              key={`${category}-${destination}-${query}`}
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-4 sm:gap-4.5"
            >
              {filtered.map((p, i) => (
                <motion.div key={p.id} variants={staggerItem}>
                  <ProgramRow programme={p} index={i} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <EmptyState
              title="No programmes match your filter"
              body="No programme matches that specific filter combination. Try clearing your search or switching destination to browse the full 2026 calendar."
              action={
                <BtnLink
                  to="/programmes"
                  variant="outline-ink"
                  size="md"
                  onClick={() => {
                    setCategory("All");
                    setDestination("All");
                    setQuery("");
                  }}
                >
                  View All 135 Programmes
                </BtnLink>
              }
            />
          )}

          <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t rule pt-10">
            <div>
              <p className="text-[14px] font-bold text-ink">Need customized in-plant delivery?</p>
              <p className="mt-1 text-[13px] text-muted">
                GIBS delivers tailored in-plant workshops for government MDAs and corporate organizations.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <BtnLink to="/contact?type=Customized+In-Plant+Workshop+Request" variant="primary" size="md">
                Request In-Plant Workshop
              </BtnLink>
              <BtnLink to="/contact" variant="outline-ink" size="md">
                Nominate Candidates
              </BtnLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
