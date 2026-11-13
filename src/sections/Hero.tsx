import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Link } from "../lib/router";
import { ArrowUpRight } from "../components/icons";
import { EASE_KINETIC } from "../components/motion";
import { gibsResponsiveImage } from "../lib/gibsResponsiveImages";

const line = {
  hidden: { y: "110%", opacity: 0.3, filter: "blur(6px)" },
  visible: (delay: number) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.68, ease: EASE_KINETIC, delay },
  }),
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Layered spatial parallax on scroll (compositor-only translateY: zero scale re-rasterization)
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.3]);

  return (
    <section
      ref={ref}
      id="home-hero"
      className="relative isolate h-[84svh] min-h-[500px] max-h-[880px] overflow-hidden bg-forest-950 lg:h-[74svh] xl:h-[72svh]"
    >
      {/* 3D Perspective Stage */}
      <div className="perspective-hero relative h-full w-full">
        {/* Deep background plane; clean GPU transform layer */}
        <div className="layer-z-deep absolute inset-0">
          <motion.div
            style={shouldReduceMotion ? undefined : { y: bgY }}
            className="absolute inset-0 will-change-transform"
          >
            {/* Fallback wash */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 90% at 22% 18%, #0d3a19 0%, #072a11 42%, #04170a 74%, #031107 100%)",
              }}
              aria-hidden="true"
            />
            <div className="kenburns absolute inset-0">
              <img
                {...gibsResponsiveImage("/images/gibs-hero-branded.webp")}
                alt="Goshen International Business School building in Ilorin, with blue-framed windows, palm trees, landscaped entrance and paved forecourt"
                className="absolute inset-0 h-full w-full object-cover object-[28%_50%] sm:object-[42%_50%] lg:object-[50%_42%]"
                style={{ filter: "saturate(0.9)", aspectRatio: "16/9" }}
                sizes="100vw"
                fetchPriority="high"
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="film-grain" aria-hidden="true" />
          </motion.div>
        </div>

        {/*
          Architectural lighting overlays — consolidated two-pass gradient:
          Pass 1 (horizontal reading protection): deep forest green gradient anchoring the text zone
          Pass 2 (vertical atmospheric blend): smooth edge transition into section boundary
        */}
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background:
              "linear-gradient(95deg, rgba(0,20,9,0.86) 0%, rgba(0,26,11,0.68) 32%, rgba(0,26,11,0.24) 62%, transparent 82%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,20,9,0.15) 0%, transparent 40%, rgba(0,18,7,0.35) 75%, rgba(0,18,7,0.92) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Foreground Spatial Content Plane (Z: 40px) */}
        <div className="layer-z-fore relative z-40 container-x flex h-full flex-col">
          {/* Spacer to keep text positioned cleanly in the lower third */}
          <div className="flex-1" />

          {/* Main Headline & CTAs */}
          <motion.div
            style={shouldReduceMotion ? undefined : { y: textY, opacity: textOpacity }}
            className="max-w-editorial pb-8 sm:pb-12 lg:pb-16"
          >
            {/* Micro-eyebrow metadata */}
            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_KINETIC, delay: 0.18 }}
              className="mb-4 font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.14em] text-ivory/80"
            >
              Accredited Executive Education · RC 1178333
            </motion.p>

            <h1
              className="type-hero"
              aria-label="Goshen International Business School"
            >
              <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <motion.span
                  custom={0.28}
                  variants={line}
                  initial={shouldReduceMotion ? "visible" : "hidden"}
                  animate="visible"
                  className="hero-title-white"
                  aria-hidden="true"
                >
                  Goshen International
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <motion.span
                  custom={0.38}
                  variants={line}
                  initial={shouldReduceMotion ? "visible" : "hidden"}
                  animate="visible"
                  className="hero-title-gold"
                  aria-hidden="true"
                >
                  Business School
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE_KINETIC, delay: 0.52 }}
              className="mt-5 max-w-prose text-[clamp(0.95rem,1.2vw,1.0625rem)] leading-[1.6] text-white/90"
              style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.4)" }}
            >
              Executive training in Nigeria and four international hubs, for the people who run public and private organisations.
            </motion.p>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_KINETIC, delay: 0.65 }}
              className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10 sm:gap-6"
            >
              <Link
                to="/programmes"
                className="btn btn-primary btn-lg text-ivory border border-white/20 transition-[transform,background-color,box-shadow] duration-200 ease-out hover:bg-forest-700 hover:border-white/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-gold-300 focus-visible:outline-offset-2"
              >
                <span className="max-w-prose">Explore programmes</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-white/25">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                to="/about"
                className="inline-flex min-h-[44px] items-center gap-1.5 text-[15px] font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline-2 focus-visible:outline-gold-300 focus-visible:outline-offset-2 rounded-xs"
              >
                About GIBS
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
