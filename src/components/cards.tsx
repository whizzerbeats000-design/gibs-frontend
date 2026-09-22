import type { ReactNode } from "react";
import { Link } from "../lib/router";
import { cn } from "../utils/cn";
import { ArrowUpRight, PlusIcon, Diamond } from "./icons";
import { DATA_REQUIRED, type Programme } from "../lib/data";

/* ---------- Programme row (index pages / homepage) ---------- */

export function ProgramRow({
  programme,
  index,
}: {
  programme: Programme;
  index: number;
}) {
  return (
    <Link
      to={`/programmes/${programme.slug}`}
      className="group grid grid-cols-[2.25rem_1fr] gap-x-4 border-b rule py-8 sm:grid-cols-[4.5rem_1fr_auto] sm:items-center sm:gap-x-10 sm:py-8"
    >
      <span className="pt-1 text-[11px] font-bold tracking-[0.16em] text-forest-600">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span>
        <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span
            className="block type-h3 text-ink transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2"
            style={{
              fontWeight: 400,
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              textRendering: "optimizeLegibility" as const,
            }}
          >
            {programme.title}
          </span>
          <span
            className="text-gold-700"
            style={{
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
              lineHeight: 1.5,
              textTransform: "uppercase" as const,
              fontWeight: 400,
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
            }}
          >
            {programme.category}
          </span>
        </span>
        <span
          className="mt-3 block max-w-2xl type-body"
          style={{
            fontSize: "1.05rem",
            color: "#2D2D2D",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            textRendering: "optimizeLegibility" as const,
          }}
        >
          {programme.tagline}
        </span>
        {programme.duration === DATA_REQUIRED && (
          <span
            className="mt-3 block uppercase text-muted"
            style={{
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
              lineHeight: 1.5,
              fontWeight: 400,
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
            }}
          >
            Duration &amp; intake: to be published
          </span>
        )}
      </span>
      <span className="col-start-2 mt-5 flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 text-ink/70 transition-all duration-300 sm:col-start-auto sm:mt-0 group-hover:border-forest-600 group-hover:bg-forest-600 group-hover:text-ivory">
        <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
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
  return (
    <Link to={to} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-forest-900/25 transition-colors duration-300 group-hover:bg-forest-900/15" />
        <div className="absolute inset-0 ring-1 ring-inset ring-ink/10" />
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
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
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
