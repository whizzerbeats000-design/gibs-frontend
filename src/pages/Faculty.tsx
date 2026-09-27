import { PageHero } from "../components/PageHero";
import { BtnLink, ClosingQuiet } from "../components/ui";
import { Reveal } from "../components/motion";
import { useSeo } from "../lib/router";
import { FACULTY_ADVISORS, GOVERNANCE_INFO, INSTITUTIONAL_DATA, IMAGES } from "../lib/data";
import { CheckIcon } from "../components/icons";

export default function Faculty() {
  useSeo({
    title: "Governance & Faculty Advisory Structure — GIBS",
    description:
      "Governing Council of 4 Directors, Management Team of 20 Advisors & Experts, Academic Board, and Technical Partnerships.",
  });

  return (
    <>
      <PageHero
        image={IMAGES.library}
        imageAlt="The GIBS academic and governance board"
        eyebrow="Governance & Faculty"
        title="Who governs and teaches here"
        intro="The Governing Council, management advisors and academic coordinators responsible for manpower development in Nigeria and the overseas hubs."
        breadcrumbs={[{ label: "Faculty & Governance" }]}
      />

      {/* Governing Council & Board Summary */}
      <section className="border-b border-line bg-white">
        <div className="container-x py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow">Governing Council & Management</p>
                <h2 className="type-h2 mt-4 text-ink">
                  Institutional governance &amp; management structure
                </h2>
                <p className="mt-5 text-[16px] leading-relaxed text-ink/85">
                  {GOVERNANCE_INFO.councilSummary}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-pill bg-forest-50 px-4 py-1.5 text-[12.5px] font-bold text-forest-800">
                    Governing Council: 4 Directors
                  </span>
                  <span className="rounded-pill bg-stone px-4 py-1.5 text-[12.5px] font-bold text-ink">
                    Management Team: 20 Advisors &amp; Experts
                  </span>
                  <span className="rounded-pill bg-gold-100 px-4 py-1.5 text-[12.5px] font-bold text-gold-800">
                    Chairman of the Council
                  </span>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <div className="border border-line bg-paper p-8 shadow-card">
                <p className="eyebrow text-forest-700">Academic Technical Partner</p>
                <h3 className="display-serif mt-3 text-xl text-ink">
                  {INSTITUTIONAL_DATA.technicalPartner}
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
                  Technical collaboration ensuring global curriculum standards across international executive programmes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Faculty / Advisors Designation Structure */}
      <section className="paper-grain bg-paper py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Academic Board &amp; Advisory Structure</p>
            <h2 className="type-h2 mt-4 text-ink">
              14 Functional <em className="italic text-forest-700">Designations.</em>
            </h2>
            <p className="mt-3 max-w-2xl type-body">
              The operational governance framework coordinating academic activities, curriculum development, inter-agency relations, and international partnerships.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {FACULTY_ADVISORS.map((advisor) => (
              <Reveal key={advisor.id} delay={advisor.id * 0.03}>
                <div className="border-t rule pt-5">
                  <h3 className="text-[15px] font-bold text-ink">{advisor.designation}</h3>
                  <p className="mt-1 type-body text-muted">{advisor.category}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditations Banner */}
      <section className="border-t border-line bg-white py-16">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-4">
              <p className="eyebrow">Compliance & Recognition</p>
              <h3 className="display-serif mt-2 text-2xl text-ink">Statutory Accreditations</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
              {INSTITUTIONAL_DATA.accreditations.map((acc) => (
                <div key={acc} className="flex items-start gap-3 border border-line bg-paper p-4">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" />
                  <span className="text-[13.5px] font-semibold text-ink">{acc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ClosingQuiet
        eyebrow="Faculty & Advisory"
        title="Talk to the Academic Board"
        body="Ask about capacity needs, a custom in-plant programme, or technical partnerships abroad."
        actions={
          <>
            <BtnLink to="/programmes" variant="primary" size="lg">
              2026 Training Calendar
            </BtnLink>
            <BtnLink to="/contact?type=Institutional+Partnership+%26+Accreditation" variant="outline-ink" size="lg">
              Partnership Enquiries
            </BtnLink>
          </>
        }
      />
    </>
  );
}
