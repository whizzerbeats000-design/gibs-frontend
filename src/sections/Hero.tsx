import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "../lib/router";
import { ArrowUpRight } from "../components/icons";
import { EASE_KINETIC } from "../components/motion";

const line = {
  hidden: { y: "112%" },
  visible: (delay: number) => ({
    y: 0,
    transition: { duration: 0.62, ease: EASE_KINETIC, delay },
  }),
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "9%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0.4]);

  return (
    <section
      ref={ref}
      id="home-hero"
      className="relative isolate h-[82svh] min-h-[480px] max-h-[860px] overflow-hidden bg-forest-950 lg:h-[72svh] xl:h-[70svh]"
    >
      <motion.div style={{ y, scale }} className="absolute inset-0 will-change-transform">
        <div className="kenburns absolute inset-0">
          <img
            src="/images/hero-campus.jpg"
            alt="The GIBS campus at golden hour, sandstone pavilions and reflecting pool with members of the school community walking the promenade"
            className="h-full w-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="film-grain" aria-hidden="true" />
      </motion.div>

      {/*
        Four-layer cinematic overlay — GIBS green is integrated into the
        photograph's lighting rather than placed on top of it.

        Layer 1 (text zone)   hard-edged dark anchor left→centre so the headline
                              stays legible at every breakpoint without crushing
                              the full frame.
        Layer 2 (green light) a top-to-bottom multiply wash — nearly clear across
                              the upper photograph (faces, architecture, sky stay
                              photographic), deepening only toward the base so the
                              green reads as light falling through the scene.
        Layer 3 (temperature) a soft-light spill that warms the shadows green and
                              lifts highlights without shearing skin tones.
        Layer 4 (grounding)   bottom vignette anchors the foreground and hands the
                              hero off to the section below; a faint top sheen and
                              a forest aura behind the type plane add dimension.
      */}
      {/* Layer 1 — text legibility zone */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(95deg, rgba(0,20,9,0.88) 0%, rgba(0,26,11,0.72) 28%, rgba(0,26,11,0.30) 52%, transparent 68%)",
        }}
        aria-hidden="true"
      />
      {/* Layer 2 — green architectural light (gradient multiply, top clear) */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,40,16,0.05) 0%, rgba(0,40,16,0.16) 45%, rgba(0,48,18,0.30) 100%)",
          mixBlendMode: "multiply",
        }}
        aria-hidden="true"
      />
      {/* Layer 3 — temperature spill (soft-light keeps skin tones natural) */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: "rgba(0, 64, 26, 0.20)",
          mixBlendMode: "soft-light",
        }}
        aria-hidden="true"
      />
      {/* Layer 4 — top sheen + bottom ground anchor */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 26%), linear-gradient(0deg, rgba(0,15,7,0.60) 0%, rgba(0,15,7,0.18) 22%, transparent 42%)",
        }}
        aria-hidden="true"
      />
      {/* Forest aura behind the type plane — dimension, not darkness */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(760px 430px at 14% 64%, rgba(0, 70, 26, 0.32), transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Type plane — counter-parallax separates foreground from photograph */}
      <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-10 container-x flex h-full flex-col">
        <div className="flex-1" />

        <div className="max-w-[600px] pb-8 sm:pb-11">
          <h1
            className="hero-title"
            aria-label="Goshen International Business School"
          >
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <motion.span
                custom={0.3}
                variants={line}
                initial="hidden"
                animate="visible"
                className="hero-title-white"
                aria-hidden="true"
              >
                Goshen International
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <motion.span
                custom={0.42}
                variants={line}
                initial="hidden"
                animate="visible"
                className="hero-title-gold"
                aria-hidden="true"
              >
                Business School
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_KINETIC, delay: 0.62 }}
            className="mt-5 max-w-xl text-[clamp(0.95rem,1.5vw,1.125rem)] leading-[1.55] text-white/85"
            style={{ textShadow: "0 4px 12px rgba(0, 0, 0, 0.35)" }}
          >
            A business school for the people and institutions building the Global Africa.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_KINETIC, delay: 0.75 }}
            className="mt-9 flex flex-wrap items-center gap-4 sm:mt-10 sm:gap-6"
          >
            <Link
              to="/programmes"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#006837] px-7 py-4 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition-all duration-300 hover:bg-[#005a2f] hover:shadow-[0_6px_18px_rgba(0,0,0,0.3)] hover:-translate-y-0.5"
            >
              Explore programmes
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-[15px] font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
            >
              Our story
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}