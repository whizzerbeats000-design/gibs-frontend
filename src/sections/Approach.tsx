import { motion } from "framer-motion";
import { Reveal, stagger, staggerItem, staggerSlow } from "../components/motion";
import { ArrowTextLink, MeridianRule } from "../components/ui";

const COMMITMENTS = [
  {
    n: "01",
    title: "Scholarship grounded in practice",
    body: "Research-led teaching, continually tested against live markets and working institutions.",
  },
  {
    n: "02",
    title: "Leadership as a craft",
    body: "Character, judgment and communication developed through deliberate, repeated practice.",
  },
  {
    n: "03",
    title: "A network without borders",
    body: "A lifelong community of founders, executives and scholars across continents and industries.",
  },
];

export default function Perspective() {
  return (
    <section id="perspective" className="paper-grain cv-auto relative bg-paper">
      <div className="container-x py-20 sm:py-24 lg:py-36">
        <Reveal>
          <MeridianRule at="18%" className="mb-14" />
        </Reveal>
        <Reveal>
          <p className="eyebrow">The GIBS Perspective</p>
        </Reveal>

        <div className="mt-8 max-w-4xl sm:mt-10">
          <h2 className="display-serif type-h2 text-ink">
            A school built for the institutions
            <br className="hidden sm:block" />{" "}
            of <em className="text-forest-700">tomorrow.</em>
          </h2>
        </div>

        <div className="mt-14 grid gap-12 sm:mt-20 lg:grid-cols-12 lg:gap-10">
          <motion.div
            variants={staggerSlow}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10% 0px" }}
            className="lg:col-span-4"
          >
            <motion.p variants={staggerItem} className="mt-6 max-w-md type-body">
              GIBS pairs rigorous scholarship with the lived practice of
              leaders working across African markets and the world.
            </motion.p>
            <motion.div variants={staggerItem} className="mt-8">
              <ArrowTextLink to="/about">Read the institution's story</ArrowTextLink>
            </motion.div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-8% 0px" }}
            className="lg:col-span-8 lg:pl-10"
          >
            {COMMITMENTS.map((c) => (
              <motion.div
                key={c.n}
                variants={staggerItem}
                className="grid grid-cols-[auto_1fr] gap-x-6 border-t rule py-8 first:border-t-0 first:pt-0 sm:grid-cols-[5rem_1fr] sm:gap-x-10 sm:py-9 sm:first:pt-0"
              >
                <span className="pt-1.5 text-xs font-medium tracking-[0.14em] text-muted">{c.n}</span>
                <div>
                  <h3 className="display-serif type-h3 text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-3 max-w-xl type-body">{c.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
