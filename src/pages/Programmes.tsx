import { useMemo, useState, useDeferredValue } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ProgrammeCard } from "../components/cards";
import { BtnLink, Breadcrumbs, EmptyState } from "../components/ui";
import { SearchIcon, CloseIcon } from "../components/icons";
import { PROGRAMMES, PROGRAM_CATEGORIES } from "../lib/data";
import { Reveal, staggerItem } from "../components/motion";
import { useSeo } from "../lib/router";
import { cn } from "../utils/cn";

type DestinationFilter = "All" | "Local" | "Kigali" | "Dubai" | "London" | "Houston";

/* Stagger that does not scale linearly with the length of the list.
   `stagger` in components/motion uses a flat 0.12s per child, which is right for
   a short editorial row and wrong for a 135-item catalogue: the last card did not
   begin animating until ~16s after mount, so most of the list sat at opacity 0
   for a very long time. The step shrinks once a list is long enough that the
   cumulative delay stops reading as choreography, and the whole sequence is
   capped at 0.5s. Short lists keep the original 0.12s rhythm. */
const listStagger: Variants = {
  hidden: {},
  visible: (count: number) => ({
    transition: {
      staggerChildren: count > 12 ? Math.min(0.12, 0.5 / count) : 0.12,
      delayChildren: 0.05,
    },
  }),
};

/* One configuration row per scope tab. The shared shell is <ScopeToggle>; only
   the active colour, label and value vary — previously each tab was a ~13-line
   block of identical JSX differing solely in `aria-pressed`/`onClick`/colour.
   Keeping a single render path preserves the 44px touch target, the focus
   ring and the accessible-name contract the E2E suite pins. */
const DESTINATION_TABS: { label: string; value: DestinationFilter; activeClass: string }[] = [
  { label: "All Programmes", value: "All", activeClass: "bg-forest-900 text-ivory border border-forest-950 shadow-card" },
  { label: "Local / Open", value: "Local", activeClass: "bg-forest-600 text-ivory border border-forest-700 shadow-card" },
  { label: "Kigali Hub", value: "Kigali", activeClass: "bg-gold-600 text-ivory border border-gold-700 shadow-card" },
  { label: "Dubai Hub", value: "Dubai", activeClass: "bg-gold-600 text-ivory border border-gold-700 shadow-card" },
  { label: "London Hub", value: "London", activeClass: "bg-gold-600 text-ivory border border-gold-700 shadow-card" },
  { label: "Houston Hub", value: "Houston", activeClass: "bg-gold-600 text-ivory border border-gold-700 shadow-card" },
];

function ScopeToggle({ pressed, activeClass, onClick, label, count }: {
  pressed: boolean;
  activeClass: string;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={cn(
        "min-h-[44px] shrink-0 rounded-none px-3.5 py-1.5 text-[12.5px] font-semibold transition-[transform,box-shadow,background-color] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-forest-600 focus-visible:outline-offset-2",
        pressed ? activeClass : "bg-white text-ink hover:bg-stone/60 border border-line shadow-crisp"
      )}
    >
      {label} ({count})
    </button>
  );
}

export default function ProgrammesPage({
  initialCategory = "All",
}: {
  initialCategory?: (typeof PROGRAM_CATEGORIES)[number];
} = {}) {
  const reduceMotion = useReducedMotion();
  const isCategoryFilter = initialCategory !== "All";

  useSeo({
    title: isCategoryFilter
      ? `${initialCategory} Training Programmes | GIBS`
      : "2026 Training Calendar (135 Programmes) — GIBS",
    description: isCategoryFilter
      ? `Explore our executive training programmes in ${initialCategory} at GIBS.`
      : "Complete 2026 GIBS Training Calendar: 113 Local Open Programmes and 22 Foreign Executive Programmes in Kigali, Dubai, London, and Houston.",
  });

  const [category, setCategory] = useState<(typeof PROGRAM_CATEGORIES)[number]>(initialCategory);
  const [destination, setDestination] = useState<DestinationFilter>("All");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) {
      return PROGRAMMES.filter((p) => {
        const categoryMatch = category === "All" || p.category === category;
        const destinationMatch =
          destination === "All"
            ? true
            : destination === "Local"
            ? p.destination === "Local"
            : p.destination === destination;
        return categoryMatch && destinationMatch;
      });
    }

    return PROGRAMMES.filter((p) => {
      const categoryMatch = category === "All" || p.category === category;
      const destinationMatch =
        destination === "All"
          ? true
          : destination === "Local"
          ? p.destination === "Local"
          : p.destination === destination;

      const tokens = q.split(/\s+/);
      const queryMatch = tokens.every((token) =>
        p.title.toLowerCase().includes(token) ||
        p.code.toLowerCase().includes(token) ||
        p.category.toLowerCase().includes(token) ||
        p.destination.toLowerCase().includes(token) ||
        p.schedule.toLowerCase().includes(token) ||
        p.targetAudience.toLowerCase().includes(token) ||
        p.summary.toLowerCase().includes(token)
      );

      return categoryMatch && destinationMatch && queryMatch;
    });
  }, [category, destination, deferredQuery]);

  const destinationCounts = useMemo(
    () =>
      PROGRAMMES.reduce<Record<string, number>>((acc, p) => {
        acc[p.destination] = (acc[p.destination] ?? 0) + 1;
        return acc;
      }, {}),
    []
  );

  const handleScope = (value: DestinationFilter) => {
    setDestination(value);
    if (value === "Local") {
      if (category === "Foreign Executive Training") setCategory("All");
    } else {
      setCategory("All");
    }
  };

  return (
    <>
      {/* Header section */}
      <section className="bg-paper">
        <div className="container-x pb-10 pt-[var(--pt-page)] sm:pb-14 sm:pt-[var(--pt-page-sm)] lg:pb-16 lg:pt-[var(--pt-page-lg)]">
          <Breadcrumbs
            items={
              isCategoryFilter
                ? [{ label: "2026 Training Calendar", to: "/programmes" }, { label: initialCategory }]
                : [{ label: "2026 Training Calendar" }]
            }
          />
          <Reveal>
            <p className="eyebrow mt-4">2026 Executive Training Calendar</p>
          </Reveal>
          <Reveal delay={0.06} y={20}>
            <h1 className="type-h1 mt-3 max-w-4xl text-ink">
              {isCategoryFilter ? (
                <>
                  {initialCategory} <em className="italic text-forest-700">Programmes.</em>
                </>
              ) : (
                <>
                  135 Capacity-Building <em className="italic text-forest-700">Programmes.</em>
                </>
              )}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper border-t border-line" aria-labelledby="programme-results-heading">
        <div className="container-x pb-20 pt-6 sm:pb-24 sm:pt-8">
          <h2 id="programme-results-heading" className="sr-only">
            Programme catalogue
          </h2>
          {/* Scope / Destination Tabs */}
          <div className="border-b border-line pb-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="shrink-0 mr-1 meta">
                Scope:
              </span>
              {DESTINATION_TABS.map((tab) => {
                const pressed =
                  tab.value === "All"
                    ? destination === "All" && category === "All"
                    : destination === tab.value;
                const count = tab.value === "All" ? PROGRAMMES.length : destinationCounts[tab.value] ?? 0;
                return (
                  <ScopeToggle
                    key={tab.value}
                    pressed={pressed}
                    activeClass={tab.activeClass}
                    onClick={() => handleScope(tab.value)}
                    label={tab.label}
                    count={count}
                  />
                );
              })}
            </div>
          </div>

          {/* Sticky filter & search container (Matching Admissions card elevation) */}
          <div className="sticky top-[var(--sticky-top)] z-[var(--z-sticky-panel)] -mx-5 mb-6 border-b border-line bg-paper/95 px-5 py-3.5 backdrop-blur-md sm:mx-0 sm:my-6 sm:rounded-none sm:border sm:border-line sm:bg-white sm:px-6 sm:py-4 sm:shadow-card">
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
                  className="w-full rounded-none border border-line bg-paper/50 py-2.5 pl-10 pr-9 text-base text-ink placeholder:text-muted shadow-[inset_1px_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(18,18,18,0.03)] focus:border-forest-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600/20 sm:text-sm"
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
              <div className="flex items-center justify-between gap-3 pb-1">
                <span className="meta shrink-0">Sector / category</span>
                <span id="programme-filter-hint" className="meta text-right">Scroll for more</span>
              </div>
              <div
                role="group"
                aria-label="Filter programmes by sector"
                aria-describedby="programme-filter-hint"
                className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none focus-within:outline-none"
              >
                {PROGRAM_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={category === cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "shrink-0 rounded-none px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap min-h-[44px] transition-[transform,box-shadow,background-color] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-forest-600 focus-visible:outline-offset-2",
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
            <p className="text-[13px] text-muted" aria-live="polite">
              Showing <span className="font-bold text-ink">{filtered.length}</span> of {PROGRAMMES.length} programmes
              {destination === "Local"
                ? " · Local / Open"
                : destination !== "All"
                ? ` · ${destination} Hub`
                : ""}
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
                className="text-[12px] font-semibold uppercase tracking-[0.12em] text-forest-700 hover:text-forest-800 hover:underline"
              >
                Reset all filters
              </button>
            )}
          </div>

          {/* Programme register */}
          {(() => {
            const item = (p: (typeof PROGRAMMES)[number]) => (
              <li key={p.id} className="border-b border-line">
                <ProgrammeCard programme={p} presentation="register" />
              </li>
            );
            return filtered.length > 0 ? (
              reduceMotion ? (
                <ul className="border-t border-line">
                  {filtered.map((p) => item(p))}
                </ul>
              ) : (
                <motion.ul
                  custom={filtered.length}
                  variants={listStagger}
                  initial="hidden"
                  animate="visible"
                  className="border-t border-line"
                >
                  {filtered.map((p) => (
                    <motion.li key={p.id} variants={staggerItem} className="border-b border-line">
                      <ProgrammeCard programme={p} presentation="register" />
                    </motion.li>
                  ))}
                </motion.ul>
              )
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
            );
          })()}

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
                Make an Enquiry
              </BtnLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
