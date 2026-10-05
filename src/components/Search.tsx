import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "../lib/router";
import { PROGRAMMES, STATIC_PAGES } from "../lib/data";
import { useBodyScrollLock, useEscape, useFocusTrap } from "../lib/hooks";
import { EASE } from "./motion";
import { SearchIcon, CloseIcon, ArrowUpRight } from "./icons";

type SearchItem = {
  title: string;
  blurb: string;
  to: string;
  group: "Programmes" | "Pages";
  keywords: string;
};

const INDEX: SearchItem[] = [
  ...PROGRAMMES.map((p) => ({
    title: `${p.code} · ${p.title}`,
    blurb: `${p.fees} · ${p.schedule}`,
    to: `/programmes/${p.slug}`,
    group: "Programmes" as const,
    keywords: `${p.code} ${p.title} ${p.category} ${p.destination} ${p.targetAudience} ${p.schedule} ${p.fees} ${p.summary} ${p.duration}`,
  })),
  ...STATIC_PAGES.filter(
    (p) => !["/faculty", "/research-insights", "/events", "/campus"].includes(p.to)
  ).map((p) => {
    /* STATIC_PAGES blurbs in data.ts contain "nomination" and "subscribe"
       terminology. Transform at the render layer — data.ts is byte-locked. */
    let blurb = p.blurb;
    if (p.to === "/admissions") {
      blurb = "Browse the 2026 calendar and make an enquiry for any programme.";
    } else if (p.to === "/concierge") {
      blurb = "Ask about programmes, locations and how to enquire.";
    }
    return {
      title: p.title,
      blurb,
      to: p.to,
      group: "Pages" as const,
      keywords: `${p.title} ${blurb}`,
    };
  }),
];

const GROUP_ORDER: SearchItem["group"][] = ["Programmes", "Pages"];

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-gold-300/70 px-0.5 text-ink">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

/** Longest exit animation below (the dialog panel), so nothing is cut short. */
const EXIT_MS = 350;

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [rendered, setRendered] = useState(open);
  const inputRef = useRef<HTMLInputElement>(null);
  // Scroll lock and focus trap follow `rendered`, not `open`, so they stay
  // engaged for the whole exit animation and are released only once the
  // aria-modal element actually unmounts. Tying them to `open` released both
  // while the fading dialog was still mounted and interactive.
  useBodyScrollLock(rendered);
  useEscape(open, onClose);
  const trapRef = useFocusTrap<HTMLDivElement>(rendered);

  // Unmount on a timer rather than relying on the exit animation to signal
  // completion. AnimatePresence waits for that signal, and when the animation
  // is dropped (busy or software-rendered frame) it keeps the dialog mounted —
  // leaving a live aria-modal overlay that traps focus and locks scrolling
  // after Escape. The timer makes the teardown deterministic.
  useEffect(() => {
    if (open) {
      setRendered(true);
      return;
    }
    const t = window.setTimeout(() => setRendered(false), EXIT_MS);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      const t = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.blurb.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q)
    ).slice(0, 24);
  }, [query]);

  const grouped = useMemo(() => {
    return GROUP_ORDER.map((group) => ({
      group,
      items: results.filter((r) => r.group === group),
    })).filter((g) => g.items.length > 0);
  }, [results]);

  const trimmed = query.trim();

  if (!rendered) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[var(--z-search)] flex items-start justify-center px-4 pt-[8dvh] sm:pt-[12dvh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: open ? 1 : 0 }}
      transition={{ duration: EXIT_MS / 1000, ease: EASE }}
    >
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/50 backdrop-blur-[2px]"
      />
      <motion.div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search GIBS"
        initial={{ y: 18, opacity: 0, scale: 0.99 }}
        animate={{
          y: open ? 0 : 12,
          opacity: open ? 1 : 0,
          scale: open ? 1 : 0.99,
        }}
        transition={{ duration: 0.35, ease: EASE }}
        className="relative flex max-h-[80dvh] w-full max-w-2xl flex-col overflow-hidden border border-line bg-paper shadow-lift sm:rounded-panel"
      >
        <div className="flex items-center gap-3 border-b border-line px-5 focus-within:border-forest-600/50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-forest-600/40">
          <SearchIcon className="h-5 w-5 shrink-0 text-forest-700" />
          <label htmlFor="global-search" className="sr-only">
            Search programmes and pages
          </label>
          <input
            ref={inputRef}
            id="global-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results[0]) {
                onClose();
                window.location.hash = `#${results[0].to}`;
              }
            }}
            placeholder="Search by programme name, code, sector, venue or city…"
            className="w-full bg-transparent py-5 text-[16px] text-ink placeholder:text-muted/70 focus:outline-none"
            type="search"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-stone hover:text-ink"
          >
            <CloseIcon className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto px-2 py-3">
          {/* Result count is announced for screen readers; sighted users get it
              from the result groups and the no-results panel below. */}
          <p className="sr-only" aria-live="polite">
            {trimmed.length < 2
              ? ""
              : results.length === 0
              ? `No results for ${trimmed}`
              : `${results.length} result${results.length === 1 ? "" : "s"} for ${trimmed}`}
          </p>

          {/* Initial state */}
          {trimmed.length < 2 && (
            <div className="px-4 py-8">
              <p className="meta">Quick Searches</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Accounting",
                  "Kigali",
                  "Dubai",
                  "London",
                  "Houston",
                  "Telecom",
                  "Oil & Gas",
                  "Pension",
                  "Maritime",
                  "Cybersecurity",
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="min-h-[44px] rounded-pill border border-ink/20 px-4 py-2 text-[13px] font-semibold text-ink/75 transition-colors hover:border-forest-600 hover:text-forest-700"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {trimmed.length >= 2 && results.length === 0 && (
            <div className="px-5 py-12 text-center">
              <p className="display-serif text-xl text-ink">
                No results for “{trimmed}”
              </p>
              <p className="mx-auto mt-2 max-w-sm type-body text-muted">
                Nothing in the site index matches. Try Accounting, Procurement, Kigali or Dubai, or ask GIBS AI.
              </p>
              <Link
                to="/concierge"
                onClick={onClose}
                className="btn btn-primary btn-md mt-6"
              >
                Ask GIBS AI
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {/* Results */}
          {grouped.map(({ group, items }) => (
            <div key={group} className="py-2">
              <p className="meta px-4 pb-1 pt-2">{group}</p>
              <ul>
                {items.map((item) => (
                  <li key={`${group}-${item.to}-${item.title}`}>
                    <Link
                      to={item.to}
                      onClick={onClose}
                      className="group flex items-start gap-4 rounded-sm px-4 py-3.5 transition-colors hover:bg-stone"
                    >
                      <span className="min-w-0">
                        <span className="block text-[15px] font-bold text-ink">
                          <Highlight text={item.title} query={trimmed} />
                        </span>
                        <span className="mt-0.5 block truncate text-[13px] text-muted">
                          <Highlight text={item.blurb} query={trimmed} />
                        </span>
                      </span>
                      <ArrowUpRight className="ml-auto mt-1 h-4 w-4 shrink-0 text-ink/60 transition-all duration-200 group-hover:text-forest-700" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="meta flex items-center justify-between border-t border-line bg-stone/50 px-5 py-2.5">
          <span>Esc to close</span>
          <span>Enter to open first result</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
