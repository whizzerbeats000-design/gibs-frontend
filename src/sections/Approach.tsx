import { motion } from "framer-motion";
import { stagger, staggerItem, staggerSlow } from "../components/motion";
import { ArrowTextLink } from "../components/ui";

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
    <section id="perspective" className="paper-grain cv-auto relative bg-paper">
      <div className="container-x py-20 sm:py-24 lg:py-36">
        <div className="max-w-4xl">
          <h2 className="type-h2 text-ink">What we ask of ourselves</h2>
        </div>

        <div className="mt-14 grid gap-12 sm:mt-16 lg:grid-cols-12 lg:gap-10">
          <motion.div
            variants={staggerSlow}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: "some" }}
            className="lg:col-span-4"
          >
            <motion.p variants={staggerItem} className="mt-1 max-w-md type-body">
              GIBS has taught in Ilorin since 2014. It now runs centres in Ilorin,
              Abuja and Ibafo, and sends executives to hubs in Miami, Houston,
              London, Dubai, Cape Town, Durban, Kigali, the Netherlands and Ghana.
            </motion.p>
            <motion.div variants={staggerItem} className="mt-8">
              <ArrowTextLink to="/about">Read the institution's story</ArrowTextLink>
            </motion.div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: "some" }}
            className="lg:col-span-8 lg:pl-10"
          >
            {COMMITMENTS.map((c) => (
              <motion.div
                key={c.title}
                variants={staggerItem}
                className="border-t rule py-8 first:border-t-0 first:pt-0 sm:py-9 sm:first:pt-0"
              >
                <h3 className="type-h3 text-ink">{c.title}</h3>
                <p className="mt-3 max-w-xl type-body">{c.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
