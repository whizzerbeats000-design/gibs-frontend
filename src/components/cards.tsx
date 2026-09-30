import type { ReactNode } from "react";
import { Link } from "../lib/router";
import { cn } from "../utils/cn";
import { ArrowUpRight, PlusIcon, CalendarIcon, UsersIcon } from "./icons";
import { useCardDepth } from "./depth";
import { type Programme, imageSet } from "../lib/data";

/* ---------- Programme card (index pages / programmes catalog) ---------- */

/** Rebalance a small catalogue so the last row never ends in a lone orphan:
    1 → full width, 2–4 → two-up, and the 3-column directory only when its
    remainder is 0 or 2 (three-up otherwise leaves a single cell stranded at
    the end of the last row). */
export function colsFor(n: number): 1 | 2 | 3 {
  if (n === 1) return 1;
  if (n <= 4) return 2;
  return n % 3 === 1 ? 2 : 3;
}

/** Grid used for the full-catalogue directory register (≥ 9 results). Below lg
    ProgramRow cards run single-column on phones, two-up on tablet; at lg three-up
    and at xl four-up so scanning stays aligned and the page stays roughly
    one third to one quarter of its one-up height. Single definition shared by
    /programmes and /executive-education — keep it in sync here. */
export const DIRECTORY_GRID =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4.5 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-4 lg:gap-y-3";

/**
 * Unified ProgrammeCard component.
 * Replaces the legacy ProgramRow and ProgrammeDirectoryStrip.
 * Maintains premium chrome (bg-white, border, shadow) across all viewports.
 */
export function ProgrammeCard({
  programme,
  action = "quiet",
  className,
}: {
  programme: Programme;
  index?: number;
  action?: "solid" | "ghost" | "quiet";
  className?: string;
}) {
  const isForeign = programme.destination !== "Local";
  const depthRef = useCardDepth<HTMLAnchorElement>(2.25);

  return (
    <Link
      ref={depthRef}
      to={`/programmes/${programme.slug}`}
      data-programme-card
      className={cn(
        "group relative block overflow-hidden bg-white border border-line rounded-panel p-4 sm:p-5 shadow-crisp transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-forest-600/40 hover:shadow-card",
        className
      )}
    >
      {/* Meta line */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="card-eyebrow">{programme.category}</span>
        {isForeign && (
          <>
            <span className="meta text-muted/70" aria-hidden="true">
              ·
            </span>
            <span className="meta text-gold-700">{programme.destination} Hub</span>
          </>
        )}
      </div>

      {/* Primary Identity */}
      <div className="mt-2.5">
        <h3 className="card-title">{programme.title}</h3>
        <p className="mt-1 font-serif text-[12px] tracking-[0.04em] text-gold-700">
          {programme.code}
        </p>
      </div>

      {/* Responsive Body: Compact metadata on mobile/tablet, streamlined on desktop */}
      <div className="mt-3 space-y-3 lg:hidden">
        <div className="flex items-start gap-2.5">
          <UsersIcon className="relative top-[2.5px] h-3.5 w-3.5 shrink-0 text-muted" />
          <div className="min-w-0">
            <p className="text-[13px] leading-snug tracking-[-0.005em] text-ink/90 line-clamp-2">
              <span className="font-semibold text-ink/50 text-[11px] uppercase tracking-wider block mb-0.5">Target Cohort</span>
              {programme.targetAudience}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <CalendarIcon className="relative top-[2.5px] h-3.5 w-3.5 shrink-0 text-muted" />
          <div className="min-w-0">
            <p className="text-[13px] leading-snug tracking-[-0.005em] text-ink">
              <span className="font-semibold text-ink/50 text-[11px] uppercase tracking-wider block mb-0.5">Schedule &amp; Duration</span>
              {programme.schedule}
              {programme.duration ? (
                <span className="text-muted"> · {programme.duration}</span>
              ) : null}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop-only simplified body (hidden on mobile/tablet) */}
      <div className="hidden lg:block mt-3.5">
        <p className="text-[13px] leading-snug tracking-[-0.005em] text-ink">
          {programme.schedule}
          {programme.duration ? (
            <span className="text-muted"> · {programme.duration}</span>
          ) : null}
        </p>
      </div>

      {/* Unified Footer: Tuition + Action */}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-line/70 pt-3 transition-colors duration-150 group-hover:border-forest-600/35">
        <div className="min-w-0 shrink">
          <span className="card-field-label">Standard Tuition</span>
          <span className="mt-0.5 block font-serif text-[17px] font-normal tabular-nums tracking-tight text-ink sm:text-[18px]">
            {programme.fees}
          </span>
        </div>

        <span
          className={cn(
            "card-action",
            action === "solid" && "card-action-solid",
            action === "ghost" && "card-action-ghost",
            action === "quiet" && "card-action-quiet"
          )}
        >
          <span className="hidden sm:inline">View details</span>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

/* ---------- Editorial image card (research / insights) ---------- */

export function EditorialCard({
  to,
  image,
  alt,
  tag,
  meta,
  title,
  excerpt,
  cta = "Read",
}: {
  to: string;
  image: string;
  alt: string;
  tag: string;
  meta?: string;
  title: string;
  excerpt: string;
  cta?: string;
}) {
  const depthRef = useCardDepth<HTMLAnchorElement>(2.25);
  return (
    <Link
      ref={depthRef}
      to={to}
      className="group block card-depth card-spot rounded-panel bg-white p-4 shadow-card transition-all duration-300 hover:shadow-card-strong max-w-card mx-auto lg:mx-0"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xs shadow-crisp">
        <img
          {...imageSet(image)}
          alt={alt}
          loading="lazy"
          decoding="async"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-forest-900/20 transition-colors duration-300 group-hover:bg-forest-900/10" />
        <div className="absolute inset-0 ring-1 ring-inset ring-ink/10" />
        <div className="film-grain" aria-hidden="true" />
      </div>
      <div className="mt-5 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.12em] sm:text-[12px]">
        <span className="text-forest-600">{tag}</span>
        {meta && (
          <>
            <span className="h-px w-4 bg-gold-500" />
            <span className="text-muted">{meta}</span>
          </>
        )}
      </div>
      <h3 className="type-h3 mt-3 text-ink transition-colors duration-200 group-hover:text-forest-700">{title}</h3>
      <p className="mt-3 type-body text-muted line-clamp-3 max-w-prose">{excerpt}</p>
      <span className="card-action card-action-quiet mt-4">
        {cta}
        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

/* ---------- Theme card (typographic, no image) ---------- */

export function ThemeCard({
  title,
  blurb,
}: {
  title: string;
  blurb: string;
}) {
  return (
    <div className="flex h-full flex-col border-t rule pt-6">
      <h3 className="display-serif text-xl leading-snug text-ink">{title}</h3>
      <p className="mt-3 type-body text-muted">{blurb}</p>
    </div>
  );
}

/* ---------- FAQ accordion (native, keyboard accessible) ---------- */

export function FaqAccordion({
  items,
  className,
}: {
  items: { q: string; a: ReactNode }[];
  className?: string;
}) {
  return (
    <div className={cn("border-t rule", className)}>
      {items.map((item, i) => (
        <details key={i} className="group border-b rule">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest-600 rounded-xs [&::-webkit-details-marker]:hidden">
            <span className="display-serif text-lg leading-snug text-ink sm:text-xl">{item.q}</span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 group-open:border-forest-600 group-open:bg-forest-600 group-open:text-ivory">
              <PlusIcon className="h-4 w-4 transition-transform duration-300 group-open:rotate-45" />
            </span>
          </summary>
          <div className="pb-7 pr-14 type-body text-muted">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
