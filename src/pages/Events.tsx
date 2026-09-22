import { useMemo, useState } from "react";
import { PageHero } from "../components/PageHero";
import { BtnLink, EmptyState } from "../components/ui";
import { Reveal } from "../components/motion";
import { useSeo } from "../lib/router";
import { cn } from "../utils/cn";
import { EVENTS, IMAGES } from "../lib/data";
import type { GIBS_EVENT } from "../lib/data";
import { ClockIcon, MapPinIcon } from "../components/icons";

/* =========================================================================
   EVENTS
   The data lives in src/lib/data.ts (EVENTS + GIBS_EVENT). No events are
   fabricated; the calendar ships in its official-data pending state and the
   interface activates the moment official events are supplied.
   ========================================================================== */
const CATEGORIES = [
  "All",
  "Public Lecture",
  "Conference",
  "Executive Session",
  "Open Day",
  "Research",
] as const;

function EventRow({ event }: { event: GIBS_EVENT }) {
  const d = new Date(event.date);
  const valid = !Number.isNaN(d.getTime());
  return (
    <article className="group grid gap-5 border-b rule py-8 sm:grid-cols-[9rem_1fr_auto] sm:items-center sm:gap-10">
      <div className="border-l-2 border-gold-500 pl-4">
        <p className="display-serif text-xl text-ink">
          {valid ? d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : event.date}
        </p>
        <p className="meta mt-1">
          {valid ? d.toLocaleDateString("en-GB", { year: "numeric" }) : "Date to confirm"}
        </p>
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-forest-600">
          {event.category}
        </p>
        <h3 className="display-serif type-h3 mt-2 text-ink">{event.title}</h3>
        <p className="mt-2 max-w-2xl type-body">{event.excerpt}</p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-[12.5px] text-muted">
          <span className="inline-flex items-center gap-2">
            <ClockIcon className="h-3.5 w-3.5" /> {event.time}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPinIcon className="h-3.5 w-3.5" /> {event.location}
          </span>
        </div>
      </div>
      <BtnLink
        to={event.status === "upcoming" ? "/contact?type=Campus+visits+%26+events" : "/research-insights"}
        variant="outline-ink"
        size="md"
        className="sm:self-center"
      >
        {event.status === "upcoming" ? "Register interest" : "View recording"}
      </BtnLink>
    </article>
  );
}

export default function Events() {
  useSeo({
    title: "Events — GIBS",
    description:
      "GIBS public lectures, open days, executive convenings and research seminars. The official events calendar will be published here.",
  });

  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");

  const upcoming = useMemo(
    () =>
      EVENTS.filter(
        (e) => e.status === "upcoming" && (category === "All" || e.category === category)
      ),
    [category]
  );
  const past = useMemo(
    () =>
      EVENTS.filter((e) => e.status === "past" && (category === "All" || e.category === category)),
    [category]
  );

  return (
    <>
      <PageHero
        image={IMAGES.seminar}
        imageAlt="A GIBS convening in a modern hall"
        eyebrow="Events"
        title="Where the institution"
        italic="meets the public."
        intro="Public lectures, open days, executive convenings and research seminars, published the moment official dates are confirmed."
        breadcrumbs={[{ label: "Events" }]}
      />

      <section className="bg-white">
        <div className="container-x py-16 sm:py-20">
          {/* Filters */}
          <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter events by category">
            {CATEGORIES.map((cat) => (
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

          {/* Calendar */}
          <Reveal>
            <h2 className="display-serif type-h3 mt-12 text-ink">Upcoming</h2>
          </Reveal>
          {upcoming.length > 0 ? (
            <div className="mt-4 border-t rule">
              {upcoming.map((e) => (
                <EventRow key={e.slug} event={e} />
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState
                title="The official calendar opens soon"
                body="Dates, locations and registration appear here as they are confirmed by the events office."
                action={
                  <div className="flex flex-wrap justify-center gap-3">
                    <BtnLink to="/contact?type=Campus+visits+%26+events" variant="primary" size="md">
                      Register your interest
                    </BtnLink>
                    <BtnLink to="/concierge" variant="outline-ink" size="md">
                      Ask the Concierge
                    </BtnLink>
                  </div>
                }
              />
            </div>
          )}

          <Reveal>
            <h2 className="display-serif type-h3 mt-16 text-ink">Past events</h2>
          </Reveal>
          {past.length > 0 ? (
            <div className="mt-4 border-t rule">
              {past.map((e) => (
                <EventRow key={e.slug} event={e} />
              ))}
            </div>
          ) : (
            <p className="mt-5 max-w-xl border-l-2 border-line pl-4 type-body">
              Recordings and proceedings of past lectures will be archived
              alongside Research &amp; Insights after the inaugural season.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
