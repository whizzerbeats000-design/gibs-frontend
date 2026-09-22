import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PageHero } from "../components/PageHero";
import { BtnLink, ClosingImmersive, DataNote } from "../components/ui";
import { Reveal } from "../components/motion";
import { Diamond, MapPinIcon, ArrowUpRight } from "../components/icons";
import { Link } from "../lib/router";
import { useSeo } from "../lib/router";
import { CAMPUS_FACILITIES, IMAGES } from "../lib/data";

const ENVIRONMENTS = [
  { img: IMAGES.library, title: "The Library", note: "Collections, reading rooms and research space" },
  { img: IMAGES.lecture, title: "Case rooms", note: "Where discussion becomes method" },
  { img: IMAGES.colonnade, title: "Cloisters & quadrangles", note: "The unhurried space between sessions" },
  { img: IMAGES.boardroom, title: "Convening rooms", note: "Executives, boards and public dialogue" },
];

export default function Campus() {
  useSeo({
    title: "Campus — GIBS",
    description:
      "The GIBS campus: modern classicism in stone and light, with libraries, case rooms, gardens and residential quarters.",
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
        imageAlt="Sunlight through the sandstone colonnade of the GIBS campus"
        eyebrow="The Campus"
        title="Built in"
        italic="stone and light."
        intro="A campus designed for the two moments a school exists for: deep private study, and the unhurried conversation that follows a seminar."
        breadcrumbs={[{ label: "Campus" }]}
      />

      {/* Architectural statement */}
      <section className="bg-paper">
        <div className="container-x grid gap-12 py-20 sm:py-24 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow">Modern Classicism</p>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal delay={0.08}>
              <p className="display-serif type-h3 text-ink">
                Travertine and forest-green steel, oak and brushed brass. The
                campus is built from materials chosen to weather beautifully.
                It is permanent from the first visit, and only more so on the
                hundredth.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-8 max-w-2xl type-body">
                Pavilions are arranged around cloisters, gardens and reflecting
                water. Case rooms open onto quadrangles, the library sits at
                the heart of the school, and residences keep the fellows on
                site. The place is built to slow thinking down.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Full-bleed library */}
      <section ref={ref} className="relative h-[56vh] min-h-[360px] overflow-hidden bg-forest-950">
        <motion.img
          style={{ y }}
          src={IMAGES.library}
          alt="The GIBS library with oak shelving, brass lamps and green leather chairs"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-[112%] w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,32,9,0.75),transparent_60%)]" />
        <div className="container-x absolute inset-x-0 bottom-0 pb-12 text-ivory">
          <Reveal>
            <p className="eyebrow-light">The Heart of the School</p>
            <h2 className="display-serif type-h2 mt-3 max-w-xl">
              The Library, built for long afternoons
            </h2>
          </Reveal>
        </div>
      </section>

      {/* Facilities index */}
      <section className="bg-white">
        <div className="container-x grid gap-12 py-20 sm:py-24 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow">Facilities</p>
              <h2 className="display-serif type-h2 mt-5 text-ink">
                What the campus holds
              </h2>
              <p className="mt-5 type-body">
                Every facility serves teaching, study or the civic life of the
                institution. Capacities are published with the official campus
                record.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-8">
            <ul className="border-t rule">
              {CAMPUS_FACILITIES.map((f) => (
                <li
                  key={f.name}
                  className="grid min-w-0 grid-cols-[auto_1fr] items-baseline gap-4 border-b rule py-5 sm:grid-cols-[auto_1fr_auto]"
                >
                  <Diamond className="h-2 w-2 shrink-0 text-gold-600" />
                  <span className="display-serif type-h3 min-w-0 break-words text-ink">{f.name}</span>
                  <span className="col-start-2 min-w-0 break-words text-[12px] uppercase tracking-[0.14em] text-muted sm:col-start-auto">
                    {f.note}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Environment grid */}
      <section className="paper-grain border-y border-line bg-paper">
        <div className="container-x py-20 sm:py-24">
          <Reveal>
            <p className="eyebrow">Environments</p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {ENVIRONMENTS.map((env, i) => (
              <Reveal key={env.title} delay={i * 0.06}>
                <figure className="group">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={env.img}
                      alt={env.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-forest-900/25" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-ink/10" />
                  </div>
                  <figcaption className="mt-4 flex min-w-0 items-baseline justify-between gap-4">
                    <span className="display-serif min-w-0 break-words text-lg text-ink">{env.title}</span>
                    <span className="min-w-0 break-words text-[12px] uppercase tracking-[0.14em] text-muted">{env.note}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Location + visit */}
      <section className="bg-white">
        <div className="container-x grid gap-12 py-20 sm:py-24 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">Location & Visits</p>
              <h2 className="display-serif type-h2 mt-5 text-ink">
                Arrange a visit
              </h2>
              <div className="mt-7 space-y-6">
                <div className="flex items-start gap-4">
                  <MapPinIcon className="mt-1 h-5 w-5 shrink-0 text-forest-600" />
                  <div>
                    <p className="text-[14px] font-bold text-ink">Campus address</p>
                    <p className="mt-1 text-[14px] italic leading-relaxed text-muted">To be published</p>
                  </div>
                </div>
                <DataNote label="Address, directions and open days to be published">
                  The Concierge coordinates individual visits and group tours;
                  scheduled open-day dates appear on the Events calendar once
                  confirmed.
                </DataNote>
              </div>
              <div className="mt-9 flex flex-wrap gap-3">
                <BtnLink to="/contact?type=Campus+visits+%26+events" variant="primary" size="lg">
                  Arrange a visit
                </BtnLink>
                <BtnLink to="/concierge" variant="outline-ink" size="lg">
                  Ask the Concierge
                </BtnLink>
              </div>
            </Reveal>
          </div>
          <Reveal y={36} className="lg:col-span-7">
            <div className="relative aspect-[16/11] overflow-hidden">
              <img
                src={IMAGES.city}
                alt="The GIBS campus — sandstone pavilions and open sky"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-forest-900/20" />
              <div className="absolute inset-0 ring-1 ring-inset ring-ink/10" />
            </div>
            <Link to="/events" className="group link-underline mt-5 inline-flex text-sm font-semibold text-forest-700">
              Open days & events
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      <ClosingImmersive
        image={IMAGES.hero}
        alt="The GIBS campus, reflecting pool and pavilions at golden hour"
        eyebrow="The Campus"
        title="Come and see it"
        italic="in person."
        body="The institution is best understood on the ground: walking the cloisters, sitting in the library, joining a conversation."
        actions={
          <>
            <BtnLink to="/contact?type=Campus+visits+%26+events" variant="gold" size="lg">
              Book a visit
            </BtnLink>
            <BtnLink to="/events" variant="outline-light" size="lg">
              Open days
            </BtnLink>
          </>
        }
      />
    </>
  );
}
