import type { ReactNode } from "react";
import { Link } from "../lib/router";
import { cn } from "../utils/cn";
import { ArrowUpRight, ArrowRight, PlusIcon, Diamond, CalendarIcon, UsersIcon } from "./icons";
import { useCardDepth } from "./depth";
import { type Programme } from "../lib/data";

/* ---------- Programme card (index pages / programmes catalog) ---------- */

export function ProgramRow({
  programme,
}: {
  programme: Programme;
  index?: number;
}) {
  const isForeign = programme.destination !== "Local";
  const categoryColor = isForeign ? "text-gold-700" : "text-forest-700";

  return (
    <Link
      to={`/programmes/${programme.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-[16px] bg-white p-4 sm:p-5",
        // Directional paper elevation on warm canvas (#FAF7EF)
        "shadow-[inset_1px_1px_0_#ffffff,0_1px_2px_rgba(18,18,18,0.04),2px_5px_14px_-2px_rgba(0,32,9,0.06),6px_12px_24px_-4px_rgba(18,18,18,0.035)]",
        // GPU-compositor transitions on transform & box-shadow
        "transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-[3px] hover:translate-x-[0.5px]",
        "hover:shadow-[inset_1.5px_1.5px_0_#ffffff,inset_0_0_0_1px_rgba(0,107,27,0.18),0_2px_4px_rgba(18,18,18,0.04),6px_14px_28px_-2px_rgba(0,70,20,0.14),12px_24px_38px_-8px_rgba(18,18,18,0.08)]"
      )}
    >
      {/* Top Meta Line: Brand Sector & International Hub */}
      <div className="flex items-center gap-2">
        <span className={cn("text-[10px] font-semibold uppercase tracking-[0.06em]", categoryColor)}>
          {programme.category}
        </span>
        {isForeign && (
          <>
            <span className="font-light text-stone-300" aria-hidden="true">
              /
            </span>
            <span className="inline-flex items-center rounded-[6px] border border-gold-400/60 bg-gold-100 px-1.5 py-0.5 font-serif text-[10px] font-medium text-gold-800">
              {programme.destination} Hub
            </span>
          </>
        )}
      </div>

      {/* Primary Editorial Title & Signature Gold Serif Code (aligned with Admissions step device) */}
      <div className="mt-1.5">
        <h3 className="font-serif text-[16px] font-bold leading-[1.2] tracking-[-0.01em] text-ink transition-colors duration-150 group-hover:text-forest-700 sm:text-[17px]">
          {programme.title}
        </h3>
        <p className="mt-0.5 font-serif text-[12px] font-medium tracking-wide text-gold-700">
          {programme.code}
        </p>
      </div>

      {/* Structured Metadata: Optical Alignment with Tight Enterprise Cadence */}
      <div className="mt-3.5 space-y-2.5">
        <div className="flex items-start gap-2.5">
          <UsersIcon className="relative top-[2.5px] h-3.5 w-3.5 shrink-0 text-muted" />
          <div>
            <span className="block text-[9.5px] font-semibold uppercase tracking-[0.06em] text-muted">
              Target Cohort
            </span>
            <p className="mt-0.5 text-[13px] leading-snug tracking-[-0.005em] text-ink/90 line-clamp-2">
              {programme.targetAudience}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <CalendarIcon className="relative top-[2.5px] h-3.5 w-3.5 shrink-0 text-muted" />
          <div>
            <span className="block text-[9.5px] font-semibold uppercase tracking-[0.06em] text-muted">
              Schedule &amp; Duration
            </span>
            <p className="mt-0.5 text-[13px] font-normal leading-snug tracking-[-0.005em] text-ink">
              {programme.schedule}
              {programme.duration ? (
                <span className="font-normal text-muted"> · {programme.duration}</span>
              ) : null}
            </p>
          </div>
        </div>
      </div>

      {/* Footer: Hairline Rule + Tuition Fee & Action Button */}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-line/70 pt-3">
        <div className="min-w-0 shrink">
          <span className="block text-[9.5px] font-semibold uppercase tracking-[0.06em] text-muted">
            Standard Tuition
          </span>
          <span className="display-serif font-serif text-[17px] font-semibold tracking-tight text-ink tabular-nums whitespace-nowrap sm:text-[18px]">
            {programme.fees}
          </span>
        </div>

        {/* Action Button: 10px Radius, shrink-0 */}
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] bg-forest-900 px-3.5 py-1.5 text-[12px] font-medium tracking-[0.02em] text-ivory shadow-[0_1px_2px_rgba(0,32,9,0.2),inset_0_1px_0_rgba(255,255,255,0.12)] transition-[transform,background-color,box-shadow] duration-150 ease-out group-hover:bg-forest-600 group-hover:shadow-[0_4px_12px_rgba(0,107,27,0.32),inset_0_1px_0_rgba(255,255,255,0.2)] sm:px-4 sm:py-2">
          <span>View details</span>
          <ArrowRight className="h-3 w-3 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" />
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
      className="group block card-depth card-spot"
    >
      <div className="relative aspect-[4/3] overflow-hidden shadow-card">
        <img
          src={image}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-forest-900/25 transition-colors duration-300 group-hover:bg-forest-900/15" />
        <div className="absolute inset-0 ring-1 ring-inset ring-ink/10" />
        <div className="film-grain" aria-hidden="true" />
      </div>
      <div className="mt-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em]">
        <span className="text-forest-600">{tag}</span>
        {meta && (
          <>
            <span className="h-px w-4 bg-gold-500" />
            <span className="font-semibold tracking-[0.18em] text-muted">{meta}</span>
          </>
        )}
      </div>
      <h3 className="display-serif type-h3 mt-3 text-ink">{title}</h3>
      <p className="mt-3 type-body text-muted">{excerpt}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-forest-700">
        {cta}
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

/* ---------- Theme card (typographic, no image) ---------- */

export function ThemeCard({
  number,
  title,
  blurb,
}: {
  number: string;
  title: string;
  blurb: string;
}) {
  return (
    <div className="flex h-full flex-col border-t rule pt-6">
      <span className="flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-gold-700">
        <Diamond className="h-1.5 w-1.5" />
        {number}
      </span>
      <h3 className="display-serif mt-4 text-xl leading-snug text-ink">{title}</h3>
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
