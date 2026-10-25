import type { ReactNode } from "react";
import { Link } from "../lib/router";
import { cn } from "../utils/cn";
import { ArrowUpRight, PlusIcon, CalendarIcon, UsersIcon } from "./icons";
import { type Programme } from "../lib/data";

/* ---------- Programme card (index pages / programmes catalog) ---------- */

/** Responsive grid used by the foreign programme directory on /executive-education. */
export const DIRECTORY_GRID =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4.5 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-4 lg:gap-y-3";

/**
 * Unified ProgrammeCard renderer.
 * The default presentation retains the established card; the register option
 * presents /programmes results as a continuous editorial list.
 */
export function ProgrammeCard({
  programme,
  action = "quiet",
  presentation = "card",
  className,
}: {
  programme: Programme;
  action?: "solid" | "ghost" | "quiet";
  presentation?: "card" | "register";
  className?: string;
}) {
  const isForeign = programme.destination !== "Local";

  if (presentation === "register") {
    return (
      <Link
        to={`/programmes/${programme.slug}`}
        data-programme-card
        className={cn(
          "group block py-4 sm:py-5 focus-visible:outline-2 focus-visible:outline-forest-600 focus-visible:outline-offset-4 rounded-panel",
          className
        )}
      >
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="card-eyebrow">{programme.category}</span>
          {isForeign && (
            <>
              <span className="meta text-muted/70" aria-hidden="true">·</span>
              <span className="meta text-forest-700">{programme.destination} Hub</span>
            </>
          )}
        </div>

        <div className="mt-1.5 flex min-w-0 flex-col gap-x-4 gap-y-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h3 className="card-title min-w-0 text-[17px] sm:text-[19px]">{programme.title}</h3>
          <p className="shrink-0 font-serif text-[11px] tracking-[0.04em] text-muted">{programme.code}</p>
        </div>

        <dl className="mt-3 grid min-w-0 gap-x-8 gap-y-2 sm:grid-cols-2">
          <div className="min-w-0">
            <dt className="card-field-label">Target Cohort</dt>
            <dd className="mt-0.5 break-words text-[13px] leading-snug text-ink/85">{programme.targetAudience}</dd>
          </div>
          <div className="min-w-0">
            <dt className="card-field-label">Schedule &amp; Duration</dt>
            <dd className="mt-0.5 break-words text-[13px] leading-snug text-ink/85">
              {programme.schedule}
              {programme.duration ? <span className="text-muted"> · {programme.duration}</span> : null}
            </dd>
          </div>
        </dl>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="card-field-label">Standard Tuition</span>
            <span className="mt-0.5 block font-serif text-[16px] font-normal tabular-nums tracking-tight text-ink sm:text-[17px]">
              {programme.fees}
            </span>
          </div>
          <span className="inline-flex min-h-11 items-center gap-1.5 text-[12px] font-semibold text-forest-700 transition-colors group-hover:text-forest-900">
            View details
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
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
              <span className="font-semibold text-muted text-[11px] uppercase tracking-wider block mb-0.5">Target Cohort</span>
              {programme.targetAudience}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <CalendarIcon className="relative top-[2.5px] h-3.5 w-3.5 shrink-0 text-muted" />
          <div className="min-w-0">
            <p className="text-[13px] leading-snug tracking-[-0.005em] text-ink">
              <span className="font-semibold text-muted text-[11px] uppercase tracking-wider block mb-0.5">Schedule &amp; Duration</span>
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
