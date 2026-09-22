import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "../lib/router";
import { PROGRAMMES, RESEARCH_THEMES, STATIC_PAGES, ARTICLES } from "../lib/data";
import { useBodyScrollLock, useEscape, useFocusTrap } from "../lib/hooks";
import { EASE } from "./motion";
import { SearchIcon, CloseIcon, ArrowUpRight, Diamond } from "./icons";

type SearchItem = {
  title: string;
  blurb: string;
  to: string;
  group: "Programmes" | "Pages" | "Research" | "Insights";
  keywords: string;
};

const INDEX: SearchItem[] = [
  ...PROGRAMMES.map((p) => ({
    title: p.title,
    blurb: p.tagline,
    to: `/programmes/${p.slug}`,
    group: "Programmes" as const,
    keywords: `${p.category} ${p.summary} mba emba dba doctorate executive undergraduate degree`,
  })),
  ...STATIC_PAGES.map((p) => ({
    title: p.title,
    blurb: p.blurb,
    to: p.to,
    group: "Pages" as const,
    keywords: p.blurb,
  })),
  ...RESEARCH_THEMES.map((t, i) => ({
    title: t.title,
    blurb: t.blurb,
    to: "/research-insights",
    group: "Research" as const,
    keywords: `faculty scholarship theme ${i}`,
  })),
  ...ARTICLES.map((a) => ({
    title: a.title,
    blurb: a.dek,
    to: `/research-insights/${a.slug}`,
    group: "Insights" as const,
    keywords: `${a.category} ${a.kicker} essay article insight journal ${a.blocks
      .map((b) => ("text" in b ? b.text : ""))
      .join(" ")}`,
  })),
];

const GROUP_ORDER: SearchItem["group"][] = ["Programmes", "Insights", "Pages", "Research"];

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

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useBodyScrollLock(open);
  useEscape(open, onClose);
  const trapRef = useFocusTrap<HTMLDivElement>(open);

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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[var(--z-search)] flex items-start justify-center px-4 pt-[8vh] sm:pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
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
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden border border-line bg-paper shadow-lift sm:rounded-panel"
          >
            <div className="flex items-center gap-3 border-b border-line px-5">
              <SearchIcon className="h-5 w-5 shrink-0 text-forest-700" />
              <label htmlFor="global-search" className="sr-only">
                Search programmes, pages and research
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
                placeholder="Search programmes, admissions, faculty, insights…"
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
              {/* Initial state */}
              {trimmed.length < 2 && (
                <div className="px-4 py-8">
                  <p className="meta">Start typing. Try</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["MBA", "Executive", "Admissions", "Campus", "Research"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setQuery(s)}
                        className="min-h-[40px] rounded-pill border border-ink/20 px-4 py-2 text-[13px] font-semibold text-ink/75 transition-colors hover:border-forest-600 hover:text-forest-700"
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
                  <Diamond className="mx-auto h-2.5 w-2.5 text-gold-600" />
                  <p className="display-serif mt-4 text-xl text-ink">
                    No results for “{trimmed}”
                  </p>
                  <p className="mx-auto mt-2 max-w-sm type-body text-muted">
                    Nothing in the site index matches that search. Try a programme name such
                    as MBA, or ask the Concierge for personal guidance.
                  </p>
                  <Link
                    to="/concierge"
                    onClick={onClose}
                    className="btn btn-primary btn-md mt-6"
                  >
                    Ask the Concierge
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
                          <ArrowUpRight className="ml-auto mt-1 h-4 w-4 shrink-0 text-ink/40 transition-all duration-200 group-hover:text-forest-700" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-line bg-stone/50 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              <span>Esc to close</span>
              <span>Enter to open first result</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
