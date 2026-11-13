import { motion } from "framer-motion";
import { Stagger, StaggerSlow, staggerItem } from "../components/motion";
import { ArrowTextLink } from "../components/ui";
import { cn } from "../utils/cn";

const COMMITMENTS = [
  {
    title: "Four words we work by",
    body: "Thoroughness. Fair. Firm. Forthright. GIBS lists these as its guiding principles, and they set the standard the school expects to be held to.",
  },
  {
    title: "Registered, and answerable",
    body: "Incorporated in 2014 with the Corporate Affairs Commission (RC 1178333), and registered with the Centre for Management Development, the Industrial Training Fund and NSTIF.",
  },
  {
    title: "A catalogue with real range",
    body: "The 2026 calendar carries 113 local and 22 foreign executive programmes, from two-week certificates to in-plant programmes written for a single organisation.",
  },
];

export default function Perspective() {
  return (
    <section id="perspective" className="paper-grain relative bg-paper border-b border-line/60">
      <div className="container-x section-y grid gap-10 lg:grid-cols-12 lg:gap-14">
        <StaggerSlow className="lg:col-span-5">
          <motion.p variants={staggerItem} className="eyebrow mb-3">
            Institutional Principles
          </motion.p>
          <motion.h2 variants={staggerItem} className="type-h2 text-ink">
            What we ask of ourselves
          </motion.h2>
          <motion.p variants={staggerItem} className="mt-5 max-w-prose type-body text-ink/85">
            GIBS has trained in Ilorin since 2014. It now runs centres in Ilorin,
            Abuja and Ibafo, and runs foreign executive programmes in Kigali,
            Dubai, London and Houston.
          </motion.p>
          <motion.div variants={staggerItem} className="mt-8">
            <ArrowTextLink to="/about">Institutional profile & governance</ArrowTextLink>
          </motion.div>
        </StaggerSlow>

        <Stagger className="lg:col-span-7 lg:mt-0">
          {COMMITMENTS.map((c, i) => (
            <motion.div
              key={c.title}
              variants={staggerItem}
              className={cn(
                "group py-5 sm:py-7 first:pt-0 transition-colors duration-200",
                i !== 0 && "border-t border-line/70"
              )}
            >
              <h3 className="type-h3 text-ink transition-colors duration-200 group-hover:text-forest-800">
                {c.title}
              </h3>
              <p className="mt-2.5 max-w-prose type-body text-ink/80">{c.body}</p>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
