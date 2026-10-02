import { PageHero } from "../components/PageHero";
import { BtnLink } from "../components/ui";
import { ConciergeConversation, useConcierge } from "../components/Concierge";
import { Reveal } from "../components/motion";
import { ChatIcon } from "../components/icons";
import { useSeo } from "../lib/router";

const TOPICS = [
  { title: "Programmes & Training", body: "113 Local / Open training courses and 22 Foreign executive training programmes across Kigali, Dubai, London, and Houston." },
  { title: "Programme Subscription & Enquiries", body: "Programme selection, corporate nomination process, published fee schedules, and registration details." },
  { title: "Executive Education", body: "Overseas training hubs (Kigali, Dubai, London, Houston) and customized in-plant workshops." },
  { title: "Campuses & Facilities", body: "Ilorin Headquarters, Abuja Center, Ibafo (Ogun State) Center, and off-campus domestic venues." },
  { title: "Institutional Team", body: "Governing Council, 20 Advisors and subject matter experts, and Pacific Institute of Technology technical partnership." },
];

export default function ConciergePage() {
  useSeo({
    title: "GIBS AI — Ask about programmes and campuses",
    description:
      "GIBS AI provides guided assistance for exploring our 113 local programmes, 22 foreign executive programmes, campus facilities, and subscription enquiries.",
  });
  const { setOpen } = useConcierge();

  return (
    <>
      <PageHero
        title="Find the right programme"
        intro="Ask about the 2026 training catalogue, overseas destinations, campus facilities or how to subscribe."
        breadcrumbs={[{ label: "GIBS AI" }]}
      />

      <section className="bg-white">
        <div className="container-x section-y grid gap-12 lg:grid-cols-12 lg:gap-12">
          {/* LEFT — identity and topics */}
          <div className="order-2 lg:order-1 lg:col-span-5">
            <Reveal>
              <div className="border-t-2 border-forest-600 bg-paper p-8 sm:p-10 max-w-editorial">
                <span className="flex h-12 w-12 items-center justify-center rounded-pill bg-forest-700 text-gold-300">
                  <ChatIcon className="h-5 w-5" />
                </span>
                <h2 className="type-h2 mt-6 text-ink">
                  Welcome to GIBS AI. How can we help?
                </h2>
                <p className="mt-4 max-w-prose type-body">
                  A programme guide built on GIBS’ published records. It answers common
                  questions instantly.
                </p>
              </div>

              <p className="eyebrow mt-12">Suggested topics</p>
              <ul className="mt-5 border-t rule">
                {TOPICS.map((t) => (
                  <li key={t.title} className="border-b rule py-4">
                    <p className="type-h3 text-ink">{t.title}</p>
                    <p className="mt-1 max-w-prose type-body">{t.body}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-wrap gap-3">
                <button type="button" onClick={() => setOpen(true)} className="btn btn-outline-ink btn-md">
                  Open floating GIBS AI
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
              <div className="flex h-[640px] max-h-[85dvh] flex-col overflow-hidden border border-line shadow-crisp sm:h-[700px] sm:max-h-[85dvh]">
                <div className="flex items-center justify-between gap-3 bg-forest-800 px-6 py-4 text-ivory">
                  <div>
                    <p className="flex items-center gap-2.5 font-serif text-[15px] font-semibold">
                      <span className="relative flex h-2 w-2">
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-300" />
                      </span>
                      GIBS AI
                    </p>
                    <p className="mt-0.5 text-[11px] text-ivory/75">
                      Programme and enquiry guide
                    </p>
                  </div>
                  <span className="pill pill-ivory hidden sm:block">
                    Official Guide
                  </span>
                </div>
                <div className="min-h-0 flex-1">
                  <ConciergeConversation controls label="GIBS AI conversation on this page" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
