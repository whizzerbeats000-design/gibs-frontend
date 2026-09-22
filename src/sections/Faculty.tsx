import { motion } from "framer-motion";
import { Reveal, stagger, staggerItem } from "../components/motion";
import { ThemeCard } from "../components/cards";
import { ArrowTextLink, DataNote } from "../components/ui";
import { RESEARCH_THEMES, IMAGES } from "../lib/data";

export default function FacultyScholarship() {
  return (
    <section id="faculty" className="cv-auto relative bg-white">
      <div className="container-x py-20 sm:py-24">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow">Faculty &amp; Scholarship</p>
            </Reveal>
            <Reveal delay={0.08} y={28}>
              <h2 className="display-serif type-h2 mt-5 text-ink">
                The scholarship, and the
                <br />
                people behind <em className="italic text-forest-700">it.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-7 max-w-md type-body">
                GIBS faculty move between the academy and the institutions
                their scholarship describes. Their work is organized around
                four research themes.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <div className="mt-8 max-w-md">
                <DataNote label="Faculty directory in preparation">
                  Named faculty profiles, biographies and publication records
                  will be published as official appointments are confirmed.
                </DataNote>
              </div>
            </Reveal>
            <Reveal delay={0.28}>
              <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3">
                <ArrowTextLink to="/faculty">Faculty &amp; research</ArrowTextLink>
                <ArrowTextLink to="/research-insights">Research &amp; insights</ArrowTextLink>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="relative mt-12 aspect-[5/3] overflow-hidden">
                <img
                  src={IMAGES.lecture}
                  alt="The GIBS library — where scholarship and study meet"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-forest-900/25" />
              </div>
            </Reveal>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10% 0px" }}
            className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:col-span-7"
          >
            {RESEARCH_THEMES.map((theme, i) => (
              <motion.div key={theme.title} variants={staggerItem}>
                <ThemeCard
                  number={String(i + 1).padStart(2, "0")}
                  title={theme.title}
                  blurb={theme.blurb}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
