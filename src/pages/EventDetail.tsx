import { PageHero } from "../components/PageHero";
import { BtnLink, EmptyState } from "../components/ui";
import { useSeo } from "../lib/router";
import { EVENTS } from "../lib/data";

export default function EventDetail({ slug }: { slug: string }) {
  const event = EVENTS.find((e) => e.slug === slug);

  useSeo({
    title: event ? `${event.title} — GIBS` : "Event — GIBS",
    description: event
      ? event.excerpt
      : "GIBS public lectures, open days and executive convenings.",
  });

  /* ── No matching event ────────────────────────────────────────────── */
  if (!event) {
    return (
      <>
        <PageHero
          eyebrow="Events"
          title="This event is not yet"
          italic="published."
          intro="The events calendar is being prepared. Confirmations will appear here with full detail and registration as dates are announced."
          breadcrumbs={[{ label: "Events", to: "/events" }, { label: "Event" }]}
        />
        <section className="bg-white">
          <div className="container-x py-16 sm:py-24">
            <EmptyState
              headingLevel={2}
              title="No official event found"
              body={`Event reference "${slug}" has no published record yet. Register your interest and receive the official programme the moment it is confirmed.`}
              action={
                <div className="flex flex-wrap justify-center gap-3">
                  <BtnLink to="/contact?type=Campus+visits+%26+events" variant="primary" size="md">
                    Register interest
                  </BtnLink>
                  <BtnLink to="/events" variant="outline-ink" size="md">
                    Back to events
                  </BtnLink>
                </div>
              }
            />
          </div>
        </section>
      </>
    );
  }

  /* ── Found event ──────────────────────────────────────────────────── */
  const d = new Date(event.date);
  const validDate = !Number.isNaN(d.getTime());

  return (
    <>
      <PageHero
        eyebrow={event.category}
        title={event.title}
        intro={event.excerpt}
        breadcrumbs={[{ label: "Events", to: "/events" }, { label: event.title }]}
      />
      <section className="bg-white">
        <div className="container-x py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <dl className="border-t rule">
                <div className="grid grid-cols-[8rem_1fr] gap-4 border-b rule py-4">
                  <dt className="meta">Date</dt>
                  <dd className="text-[14px] text-ink">
                    {validDate
                      ? d.toLocaleDateString("en-GB", {
                          weekday: "long",
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : event.date}
                  </dd>
                </div>
                <div className="grid grid-cols-[8rem_1fr] gap-4 border-b rule py-4">
                  <dt className="meta">Time</dt>
                  <dd className="text-[14px] text-ink">{event.time}</dd>
                </div>
                <div className="grid grid-cols-[8rem_1fr] gap-4 border-b rule py-4">
                  <dt className="meta">Location</dt>
                  <dd className="text-[14px] text-ink">{event.location}</dd>
                </div>
                <div className="grid grid-cols-[8rem_1fr] gap-4 border-b rule py-4">
                  <dt className="meta">Category</dt>
                  <dd className="text-[14px] text-ink">{event.category}</dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-5">
              <div className="border border-line bg-paper p-7">
                <p className="eyebrow">
                  {event.status === "upcoming" ? "Register interest" : "This event has passed"}
                </p>
                {event.status === "upcoming" ? (
                  <>
                    <p className="mt-4 type-body">
                      To attend or register your interest, contact the events team directly.
                    </p>
                    <BtnLink
                      to="/contact?type=Campus+visits+%26+events"
                      variant="primary"
                      size="lg"
                      className="mt-6 w-full"
                    >
                      Register interest
                    </BtnLink>
                  </>
                ) : (
                  <p className="mt-4 type-body">
                    Recordings and proceedings of past events are archived alongside
                    Research &amp; Insights after each season.
                  </p>
                )}
                <BtnLink to="/events" variant="outline-ink" size="md" className="mt-3 w-full">
                  Back to events
                </BtnLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
