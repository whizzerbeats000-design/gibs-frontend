import { PageHero } from "../components/PageHero";
import { BtnLink, ClosingImmersive } from "../components/ui";
import { Reveal } from "../components/motion";
import { Diamond, MapPinIcon, CheckIcon } from "../components/icons";
import { useSeo } from "../lib/router";
import { CAMPUS_LOCATIONS, CAMPUS_CAPACITY, CAMPUS_FACILITIES, IMAGES } from "../lib/data";

export default function Campus() {
  useSeo({
    title: "Campuses & Facilities (Ilorin HQ, Abuja, Ibafo) — GIBS",
    description:
      "Explore GIBS campus facilities across Ilorin Main Headquarters, Abuja Center, Ibafo Center, and off-campus executive venues across Nigeria.",
  });

  return (
    <>
      <PageHero
        image={IMAGES.colonnade}
        imageAlt="GIBS Campus and training facilities"
        eyebrow="Campuses & Infrastructure"
        title="Three training centres"
        intro="Lecture rooms, conference halls, syndicate rooms and guest facilities in Ilorin, Abuja and Ibafo, Ogun State."
        breadcrumbs={[{ label: "Campuses" }]}
      />

      {/* 3 Permanent Centers */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Permanent Centers</p>
            <h2 className="type-h2 mt-4 text-ink">
              Three strategic <em className="italic text-forest-700">training hubs.</em>
            </h2>
          </Reveal>

          <div className="mt-12 space-y-12">
            {CAMPUS_LOCATIONS.map((campus, idx) => (
              <Reveal key={campus.id} delay={idx * 0.08}>
                <div className="surface-depth-2 rounded-panel p-8 sm:p-10">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b rule pb-6">
                    <div>
                      <span className="eyebrow text-forest-600">
                        Center 0{idx + 1}
                      </span>
                      <h3 className="display-serif mt-1 text-2xl text-ink sm:text-3xl">
                        {campus.name}
                      </h3>
                    </div>
                    <span className="rounded-pill bg-forest-600 px-4 py-1.5 text-[12px] font-bold text-ivory">
                      Active Training Center
                    </span>
                  </div>

                  <div className="mt-6 flex items-start gap-3 text-[14.5px] text-ink/90">
                    <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-forest-600" />
                    <p className="font-semibold">{campus.address}</p>
                  </div>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div className="rounded-panel bg-white p-6 shadow-crisp">
                      <p className="eyebrow text-forest-700">Academic & Conference Facilities</p>
                      <p className="mt-2 text-[14px] leading-relaxed text-ink/80">
                        {campus.academicFacilities}
                      </p>
                    </div>

                    {campus.recreationalFacilities && (
                      <div className="rounded-panel bg-white p-6 shadow-crisp">
                        <p className="eyebrow text-gold-700">Recreational & Logistics Support</p>
                        <p className="mt-2 text-[14px] leading-relaxed text-ink/80">
                          {campus.recreationalFacilities}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 border-t rule pt-6">
                    <p className="meta mb-3">Facility Highlights</p>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {campus.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-2 text-[13.5px] text-muted">
                          <Diamond className="h-1.5 w-1.5 shrink-0 text-forest-600" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Capacity & Off-Campus Logistics */}
      <section className="border-y border-line bg-forest-900 py-20 text-ivory">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <Reveal>
                <p className="eyebrow-light">Training Capacity &amp; Logistics</p>
                <h2 className="type-h2 mt-4">
                  Capacity built for both intensive syndicates &amp; large assemblies
                </h2>
                <p className="mt-6 text-[15px] leading-relaxed text-ivory/85">
                  {CAMPUS_CAPACITY.regularCapacity}
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-6">
              <div className="border border-ivory/20 bg-forest-950/60 p-8 sm:p-10">
                <p className="eyebrow-light text-gold-300">Off-Campus Domestic Executive Cities</p>
                <p className="mt-3 text-[14px] text-ivory/75">
                  GIBS delivers regular scheduled workshops in premium executive partner venues across:
                </p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {CAMPUS_CAPACITY.offCampusCities.map((city) => (
                    <span
                      key={city}
                      className="inline-flex items-center gap-2 rounded-pill bg-ivory/10 px-4 py-2 text-[13px] font-bold text-ivory"
                    >
                      <CheckIcon className="h-3.5 w-3.5 text-gold-300" />
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Standard Facilities Grid */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Infrastructure Overview</p>
            <h2 className="type-h2 mt-4 text-ink">
              Comprehensive learning environment
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CAMPUS_FACILITIES.map((f) => (
              <div key={f.name} className="border border-line bg-paper p-6 shadow-crisp">
                <Diamond className="h-2 w-2 text-forest-600" />
                <h3 className="display-serif mt-3 text-lg text-ink">{f.name}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{f.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ClosingImmersive
        image={IMAGES.hero}
        alt="GIBS Campus Headquarters"
        eyebrow="Visit GIBS"
        title="Book a campus visit"
        body="See the lecture rooms, conference halls and guest lodge in Ilorin, Abuja or Ibafo before you commit a team to a programme."
        actions={
          <>
            <BtnLink to="/contact?type=Campus+Facility+Booking+%26+Enquiries" variant="gold" size="lg">
              Book a Visit
            </BtnLink>
            <BtnLink to="/programmes" variant="outline-light" size="lg">
              2026 Training Calendar
            </BtnLink>
          </>
        }
      />
    </>
  );
}
