import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PageHero } from "../components/PageHero";
import { BtnLink, ClosingImmersive } from "../components/ui";
import { Reveal } from "../components/motion";
import { MapPinIcon } from "../components/icons";
import { useSeo } from "../lib/router";
import { CAMPUSES, CAPACITY, IMAGES, INSTITUTION } from "../lib/data";

export default function Campus() {
  useSeo({
    title: `Campuses — ${INSTITUTION.abbreviation}`,
    description: `Official campuses of ${INSTITUTION.legalName} in Ilorin, Abuja, and Ibafo (Ogun State).`,
  });

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <>
      <PageHero
        image={IMAGES.colonnade}
        imageAlt="The GIBS learning facilities"
        eyebrow="Our Campuses"
        title="Institutional"
        italic="Campuses & Facilities."
        intro="GIBS operates dedicated campuses in Ilorin Headquarters, Abuja, and Ibafo (Ogun State), fully equipped for executive and professional capacity building."
        breadcrumbs={[{ label: "Campuses" }]}
      />

      {/* Campus Locations Grid */}
      <section className="bg-paper py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Campus Directory</p>
            <h2 className="display-serif type-h2 mt-4 text-ink">
              Official GIBS <em className="text-forest-700">Campuses</em>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-3">
            {CAMPUSES.map((campus) => (
              <Reveal key={campus.id}>
                <div className="border border-line bg-white p-8 h-full flex flex-col justify-between shadow-card">
                  <div>
                    <span className="chip border-forest-600/30 bg-forest-50 text-forest-800 font-medium text-[12px] px-3 py-1">
                      {campus.type}
                    </span>
                    <h3 className="display-serif type-h3 mt-4 text-ink">{campus.name}</h3>
                    <p className="mt-3 flex items-start gap-2 text-[13.5px] leading-relaxed text-muted">
                      <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" />
                      <span>{campus.address}</span>
                    </p>

                    <div className="mt-6 border-t rule pt-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-forest-700 mb-3">
                        Facilities
                      </p>
                      <ul className="space-y-2">
                        {campus.facilities.map((fac) => (
                          <li key={fac} className="flex items-center gap-2 text-[13px] text-ink/80">
                            <span className="h-1.5 w-1.5 rounded-full bg-forest-600 shrink-0" />
                            {fac}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Parallax Feature Section */}
      <section ref={ref} className="relative h-[50vh] min-h-[360px] overflow-hidden bg-forest-950">
        <motion.img
          style={{ y }}
          src={IMAGES.library}
          alt="GIBS learning environments"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-[112%] w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,32,9,0.8),transparent_60%)]" />
        <div className="container-x absolute inset-x-0 bottom-0 pb-12 text-ivory">
          <Reveal>
            <p className="eyebrow-light">Capacity & Scale</p>
            <h2 className="display-serif type-h2 mt-3 max-w-2xl">
              Capacity for up to 500 candidates per campus
            </h2>
          </Reveal>
        </div>
      </section>

      {/* Capacity & Off-Campus Locations */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">Training Capacity</p>
              <h2 className="display-serif type-h2 mt-4 text-ink">
                Accommodating <em className="text-forest-700">Cohorts</em>
              </h2>
              <div className="mt-6 space-y-4 type-body">
                <p>
                  <strong className="text-ink">Workshop/Seminar Format:</strong> {CAPACITY.workshopFormat}
                </p>
                <p>
                  <strong className="text-ink">Large Class Format:</strong> {CAPACITY.largeClassFormat}
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <p className="eyebrow">Off-Campus Locations</p>
              <h2 className="display-serif type-h2 mt-4 text-ink">
                Approved Off-Campus Training Cities
              </h2>
              <p className="mt-3 type-body text-muted">
                In addition to our permanent campuses, GIBS conducts executive workshops and capacity-building programs in approved locations across Nigeria:
              </p>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {CAPACITY.offCampusApprovedLocations.map((city) => (
                  <div key={city} className="border border-line bg-paper p-4 text-center">
                    <p className="display-serif font-semibold text-ink">{city}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <ClosingImmersive
        image={IMAGES.hero}
        alt="The GIBS campus Facilities"
        eyebrow="Campus Enquiries"
        title="Arrange a visit or"
        italic="book facilities."
        body="Contact the administration team to schedule campus visits or discuss facility bookings for executive sessions."
        actions={
          <>
            <BtnLink to="/contact?type=Campus+visits+%26+events" variant="gold" size="lg">
              Book a Visit
            </BtnLink>
            <BtnLink to="/contact" variant="outline-light" size="lg">
              Contact Us
            </BtnLink>
          </>
        }
      />
    </>
  );
}
