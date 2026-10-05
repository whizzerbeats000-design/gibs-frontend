import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "../components/motion";
import { ArrowTextLink } from "../components/ui";
import { IMAGES } from "../lib/data";

const PERSPECTIVES = [
  {
    k: "Nigeria",
    v: "Trained in Ilorin since 2014, with centres in Abuja and Ibafo, for the public and private sectors of the country.",
  },
  {
    k: "Abroad",
    v: "Overseas hubs in Miami, Houston, London, Dubai, Cape Town, Durban, Kigali, the Netherlands and Ghana.",
  },
  {
    k: "Technical partner",
    v: "Pacific Institute of Technology, Georgia, United States.",
  },
];

export default function GlobalPerspective() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={ref} className="cv-auto relative overflow-hidden bg-forest-900 text-ivory">
      <div className="grid lg:grid-cols-12">
        {/* Full-bleed image half */}
        <div className="relative min-h-[300px] overflow-hidden lg:col-span-6 lg:min-h-[640px]">
          <motion.img
            style={{ y: imgY }}
            src={IMAGES.city}
            alt="The GIBS campus, open sky and sandstone architecture"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-[110%] w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,32,9,0.35),rgba(0,32,9,0.15))] lg:bg-[linear-gradient(90deg,rgba(0,32,9,0.05),rgba(0,32,9,0.55))]" />
        </div>

        {/* Statement half */}
        <div className="relative flex items-center lg:col-span-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_80%_at_100%_0%,rgba(235,211,117,0.1),transparent_55%)]" />
          <div className="w-full px-6 py-20 sm:px-12 sm:py-24 lg:px-16">
            <Reveal>
              <p className="eyebrow-light">Global Perspective</p>
            </Reveal>
            <Reveal delay={0.08} y={28}>
              <h2 className="type-h2 mt-2">
                Where GIBS trains
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 max-w-prose type-body text-ivory/85">
                GIBS trains executives for the organisations they work in, at home
                in Nigeria and in nine countries overseas.
              </p>
            </Reveal>

            <div className="mt-12 border-t rule-light">
              {PERSPECTIVES.map((p) => (
                <Reveal key={p.k} delay={0.1}>
                  <div className="grid grid-cols-1 gap-1 border-b rule-light py-6 sm:grid-cols-[11rem_1fr] sm:gap-8">
                    <p className="eyebrow-light">
                      {p.k}
                    </p>
                    <p className="type-body text-ivory/85">{p.v}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <div className="mt-10">
                <ArrowTextLink to="/about" light>
                  How GIBS sees the world
                </ArrowTextLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
