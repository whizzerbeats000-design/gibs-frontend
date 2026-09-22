import { PageHero } from "../components/PageHero";
import { BtnLink, MeridianRule } from "../components/ui";
import { ConciergeConversation, useConcierge } from "../components/Concierge";
import { Reveal } from "../components/motion";
import { ChatIcon } from "../components/icons";
import { useSeo } from "../lib/router";

const TOPICS = [
  { title: "Programmes", body: "MBA, Executive MBA, doctorate, executive and undergraduate pathways." },
  { title: "Admissions", body: "The six-step journey, requirements, dates and supporting materials." },
  { title: "Executive Education", body: "Open programmes and custom leadership journeys for organizations." },
  { title: "Campus experience", body: "The learning environments, facilities and arranging a visit." },
  { title: "Speak with admissions", body: "When a human answer is better, the Concierge routes you directly." },
];

export default function ConciergePage() {
  useSeo({
    title: "GIBS Concierge — Guided assistance",
    description:
      "The GIBS Concierge is a guided admissions desk for programmes, admissions, executive education, the campus and contact.",
  });
  const { setOpen } = useConcierge();

  return (
    <>
      <PageHero
        eyebrow="GIBS Concierge"
        title="A digital admissions"
        italic="desk."
        intro="A routing service for the admissions desk: programmes, admissions, the campus. It answers instantly, or hands you on."
        breadcrumbs={[{ label: "Concierge" }]}
      />

      <section className="bg-white">
        <div className="container-x grid gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-12">
          {/* LEFT — identity and topics */}
          <div className="order-2 lg:order-1 lg:col-span-5">
            <Reveal>
              <div className="border-t-2 border-forest-600 bg-paper p-8 sm:p-10">
                <span className="flex h-12 w-12 items-center justify-center rounded-pill bg-forest-700 text-gold-300">
                  <ChatIcon className="h-5 w-5" />
                </span>
                <h2 className="display-serif type-h2 mt-6 text-ink">
                  Welcome to GIBS Concierge. How can we help you find your way?
                </h2>
                <p className="mt-4 type-body">
                  A guided, rule-based assistant. It answers common questions
                  instantly and routes anything official or personal to the
                  right human team.
                </p>
              </div>

              <MeridianRule at="14%" className="my-10" />

              <p className="eyebrow">Suggested topics</p>
              <ul className="mt-5 border-t rule">
                {TOPICS.map((t) => (
                  <li key={t.title} className="border-b rule py-4">
                    <p className="display-serif type-h3 text-ink">{t.title}</p>
                    <p className="mt-1 type-body">{t.body}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-wrap gap-3">
                <button type="button" onClick={() => setOpen(true)} className="btn btn-outline-ink btn-md">
                  Open the floating Concierge
                </button>
                <BtnLink to="/contact" variant="outline-ink" size="md">
                  Contact GIBS directly
                </BtnLink>
              </div>
            </Reveal>
          </div>

          {/* RIGHT — conversation */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <Reveal y={28}>
              <div className="flex h-[640px] flex-col overflow-hidden border border-line shadow-crisp sm:h-[700px]">
                <div className="flex items-center justify-between gap-3 bg-forest-800 px-6 py-4 text-ivory">
                  <div>
                    <p className="flex items-center gap-2.5 font-serif text-[15px] font-semibold">
                      <span className="relative flex h-2 w-2">
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-300" />
                      </span>
                      GIBS Concierge
                    </p>
                    <p className="mt-0.5 text-[11px] text-ivory/75">
                      Guided assistance · typically replies instantly
                    </p>
                  </div>
                  <span className="hidden rounded-pill border border-ivory/25 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ivory/90 sm:block">
                    Frontend demo assistant
                  </span>
                </div>
                <div className="min-h-0 flex-1">
                  <ConciergeConversation controls />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
