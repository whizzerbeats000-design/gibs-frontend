import { motion } from "framer-motion";
import { Link } from "../lib/router";
import { PROGRAMMES, HOME_PROGRAMME_BANDS } from "../lib/data";
import { Reveal, Stagger, staggerItem } from "../components/motion";
import { Eyebrow } from "../components/ui";
import { ArrowUpRight } from "../components/icons";

function ProgrammePanel({ slug }: { slug: string }) {
  const p = PROGRAMMES.find((x) => x.slug === slug);
  if (!p) return null;
  const description = p.tagline || p.summary;
  const audienceText = p.audience?.[0] || p.targetAudience;
  return (
    <Link
      to={`/programmes/${p.slug}`}
      className="group grid grid-cols-[1fr_auto] items-start gap-x-6 gap-y-2 border-t rule py-8 sm:py-10 first:border-t-0 sm:gap-x-10 text-left"
    >
      <div className="min-w-0">
        <p className="eyebrow text-forest-600 mb-2">
          {p.category}
        </p>
        <h3 className="type-h3 mt-0 sm:mt-2 text-ink transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5">
          {p.title}
        </h3>
        {description && <p className="mt-3 max-w-xl type-body text-muted/80 lg:text-muted leading-relaxed sm:line-clamp-none">{description}</p>}
        {audienceText && (
          <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-muted line-clamp-2">
            <span className="hidden sm:inline font-semibold text-ink/60 uppercase tracking-wider text-[11px] mr-1">For</span> {audienceText.charAt(0).toLowerCase() + audienceText.slice(1)}
          </p>
        )}
      </div>
      <span className="mt-8 flex h-9 w-9 shrink-0 items-center justify-center text-forest-700 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
        <ArrowUpRight className="h-5 w-5" />
      </span>
    </Link>
  );
}

export default function ProgrammeDiscovery() {
  return (
    <section id="programmes" className="cv-auto relative bg-white px-6 md:px-12 lg:px-16">
      <div className="container-x mx-auto section-y grid lg:grid-cols-12 text-left">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow>Programme Discovery</Eyebrow>
          </Reveal>
          <Reveal delay={0.08} y={28}>
            <h2 className="type-h2 mt-5 text-ink">
              A sample of the 2026 catalogue
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.16} className="lg:col-span-7 lg:pl-8">
          <p className="max-w-prose type-body">
            The full calendar lists 135 programmes in management, finance, executive training and international practice, for senior and middle-level managers, executive officers, legislators and administrators.
          </p>
        </Reveal>
      </div>

      {/* Editorial category bands */}
      <Stagger className="mt-14 space-y-16 sm:mt-16 lg:space-y-0">
        {HOME_PROGRAMME_BANDS.map((band) => (
          <motion.section
            key={band.band}
            variants={staggerItem}
            className="grid gap-6 lg:grid-cols-12 lg:gap-8 last:mb-0 text-left"
          >
            <div className="lg:col-span-4">
              <p className="eyebrow text-forest-600 font-bold tracking-wide uppercase">
                {band.band}
              </p>
              <p className="mt-3 max-w-prose text-[13.5px] leading-relaxed text-muted lg:pr-2">
                {band.note}
              </p>
            </div>
            <div className="lg:col-span-8 lg:pl-4">
              {band.slugs.map((slug) => (
                <ProgrammePanel key={slug} slug={slug} />
              ))}
            </div>
          </motion.section>
        ))}
      </Stagger>

      <div className="mt-14 flex flex-wrap items-center justify-start gap-x-9 gap-y-4 border-t rule pt-8">
        <Link to="/programmes" className="btn btn-primary btn-lg">
          Explore Programmes
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        <Link to="/executive-education" className="group link-underline text-sm font-semibold text-forest-700">
          Executive education for organizations
        </Link>
      </div>
    </section>
  );
}
