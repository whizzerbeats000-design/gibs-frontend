import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, Stagger, staggerItem } from "../components/motion";
import { Diamond, ArrowUpRight } from "../components/icons";
import { Link } from "../lib/router";
import { CAMPUS_FACILITIES, IMAGES } from "../lib/data";

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bigY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const smallY = useTransform(scrollYProgress, [0, 1], ["6%", "-8%"]);

  return (
    <section id="campus-experience" ref={ref} className="paper-grain cv-auto relative overflow-hidden bg-paper">
      <div className="container-x section-y">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5 lg:pt-4">
            <Reveal>
              <p className="eyebrow">The GIBS Experience</p>
            </Reveal>
            <Reveal delay={0.08} y={30}>
              <h2 className="type-h2 mt-5 text-ink">
                Stone, light and
                <br />
                quiet <em className="text-forest-700">intention.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-7 max-w-md type-body">
                A piece of modern classicism: travertine, brass, oak and
                forest-green steel, chosen to weather beautifully.
              </p>
            </Reveal>

            <Stagger as="ul" className="mt-10 border-t rule">
              {CAMPUS_FACILITIES.slice(0, 4).map((f) => (
                <motion.li
                  key={f.name}
                  variants={staggerItem}
                  className="flex items-baseline gap-4 border-b rule py-4.5"
                >
                  <Diamond className="h-2 w-2 shrink-0 text-gold-600" />
                  <span className="type-h3 text-ink">{f.name}</span>
                </motion.li>
              ))}
            </Stagger>

            <Reveal delay={0.1}>
              <Link
                to="/campus"
                className="group link-underline mt-9 text-sm font-semibold text-forest-700"
              >
                Explore the campus
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>

          <div className="perspective-stage relative lg:col-span-7">
            {/* Base Architectural Photograph (Z: 0 — the stage baseline) */}
            <Reveal y={40} className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xs sm:aspect-[16/18] lg:aspect-[4/4.4] shadow-card">
                <motion.img
                  style={{ y: bigY }}
                  src={IMAGES.colonnade}
                  alt="Sunlight through the sandstone colonnade of the GIBS campus"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-[108%] w-full object-cover"
                />
                <div className="absolute inset-0 bg-forest-900/15" />
                <div className="absolute inset-0 ring-1 ring-inset ring-ink/10" />
              </div>
            </Reveal>

            {/*
              Elevated Foreground Photo Card (Z: 28px).
              Plain wrapper carries the Z offset; the inner Reveal owns the
              animation, so framer-motion's inline transform can't clobber it.
            */}
            <div className="layer-z-fore relative z-10 -mt-16 ml-auto mr-2 w-[62%] sm:mr-8 sm:w-[52%] lg:-mt-24">
              <Reveal delay={0.18} y={48}>
                <div className="rounded-panel border-[6px] border-paper bg-white p-0.5 shadow-spatial">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xs">
                    <motion.img
                      style={{ y: smallY }}
                      src={IMAGES.library}
                      alt="The library with oak shelving, brass lamps and green leather chairs"
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-[112%] w-full object-cover"
                    />
                    <div className="film-grain" aria-hidden="true" />
                    <div className="absolute inset-0 bg-forest-900/20" />
                  </div>
                </div>
                <p className="mt-3 text-right font-serif text-sm italic text-ink/70">The Library</p>
              </Reveal>
            </div>

            {/* Floating Dialogue Badge (Z: 44px) */}
            <div className="layer-z-top absolute -left-1 top-8 hidden max-w-[230px] rounded-panel border border-gold-400/30 bg-forest-900/95 px-6 py-5 text-ivory shadow-lift backdrop-blur-[6px] sm:block lg:left-0">
              <Reveal delay={0.35} y={24}>
                <p className="eyebrow-light leading-relaxed">
                  A campus built for
                  <br /> study and dialogue
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-ivory/75">
                  Corners for quiet work and for conversation.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
