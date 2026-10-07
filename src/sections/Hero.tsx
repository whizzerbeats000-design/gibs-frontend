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

  // Layered spatial parallax on scroll (compositor-only transforms)
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-7%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.35]);

  return (
    <section
      ref={ref}
      id="home-hero"
      className="relative isolate h-[84svh] min-h-[500px] max-h-[880px] overflow-hidden bg-forest-950 lg:h-[74svh] xl:h-[72svh]"
    >
      {/* 3D Perspective Stage */}
      <div className="perspective-hero relative h-full w-full">
        {/* Deep background plane; the plain wrapper keeps the Z offset separate
            from the transform written by Framer Motion. */}
        <div className="layer-z-deep absolute inset-0">
          <motion.div
            style={{ y: bgY, scale: bgScale }}
            className="absolute inset-0 will-change-transform"
          >
            {/* Fallback wash: shows through only if the photograph fails to
                decode, so a dead asset never presents as a blank green void. */}
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
                src="/images/gibs-hero-branded.jpg"
                alt="Goshen International Business School building in Ilorin, with blue-framed windows, palm trees, landscaped entrance and paved forecourt"
                className="h-full w-full object-cover object-[28%_50%] sm:object-[42%_50%] lg:object-[50%_42%]"
                width={1050}
                height={750}
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <div className="film-grain" aria-hidden="true" />
          </motion.div>
        </div>

        {/*
          Architectural lighting overlays — preserves natural GIBS photography
          Layer 1 (text zone)   anchor left→centre so headline stays legible at all breakpoints.
          Layer 2 (green light) top-to-bottom wash deepening towards base.
          Layer 3 (temperature) soft-light spill keeping skin tones natural.
          Layer 4 (grounding)   bottom vignette and top sheen.
        */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(95deg, rgba(0,20,9,0.72) 0%, rgba(0,26,11,0.52) 28%, rgba(0,26,11,0.18) 52%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(0,15,7,0.08) 58%, rgba(0,15,7,0.32) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Foreground Spatial Content Plane (Z: 28px) */}
        <div className="layer-z-fore relative z-10 container-x flex h-full flex-col">
          {/* Spacer to keep text positioned cleanly in the lower third */}
          <div className="flex-1" />

          {/* Main Headline & CTAs */}
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className="max-w-editorial pb-8 sm:pb-12 lg:pb-16"
          >
            <h1
              className="type-hero"
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
              className="mt-5 max-w-prose text-[clamp(0.95rem,1.2vw,1.0625rem)] leading-[1.55] text-white/90"
              style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.4)" }}
            >
              Executive training in Nigeria and nine countries overseas, for the people who run public and private organisations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_KINETIC, delay: 0.75 }}
              className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10 sm:gap-6"
            >
              <Link
                to="/programmes"
                className="group inline-flex items-center gap-3 rounded-full bg-forest-600 pl-7 pr-5 py-3.5 text-[15px] font-semibold text-ivory shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_14px_rgba(0,20,5,0.35),0_12px_24px_-6px_rgba(0,32,9,0.4)] transition-[transform,background-color,box-shadow] duration-200 ease-out hover:bg-forest-700 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_6px_20px_rgba(0,20,5,0.4),0_16px_32px_-8px_rgba(0,32,9,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985] focus-visible:outline-gold-300"
              >
                <span className="max-w-prose">Explore programmes</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-white/25">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                to="/about"
                className="inline-flex min-h-[24px] items-center gap-1.5 text-[15px] font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline-gold-300"
              >
                Our story
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
