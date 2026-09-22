import { motion } from "framer-motion";
import { Link } from "../lib/router";
import { PROGRAMMES, HOME_PROGRAMME_BANDS } from "../lib/data";
import { Reveal, stagger, staggerItem } from "../components/motion";
import { Eyebrow } from "../components/ui";
import { ArrowUpRight } from "../components/icons";

function ProgrammePanel({ slug }: { slug: string }) {
  const p = PROGRAMMES.find((x) => x.slug === slug);
  if (!p) return null;
  const audience = p.audience?.[0];
  return (
    <Link
      to={`/programmes/${p.slug}`}
      className="group grid grid-cols-[1fr_auto] items-start gap-x-6 gap-y-1 border-t rule py-7 first:border-t-0 sm:gap-x-10"
    >
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-forest-600">
          {p.category}
        </p>
        <h3 className="display-serif type-h3 mt-2 text-ink transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5">
          {p.title}
        </h3>
        <p className="mt-2 max-w-xl type-body">{p.tagline}.</p>
        {audience && (
          <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-muted">
            For {audience.charAt(0).toLowerCase() + audience.slice(1)}
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
    <section id="programmes" className="cv-auto relative bg-white">
      <div className="container-x py-20 sm:py-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <Eyebrow>Programme Discovery</Eyebrow>
            </Reveal>
            <Reveal delay={0.08} y={28}>
              <h2 className="display-serif type-h2 mt-5 text-ink">
                Programmes designed to
                <br />
                <em className="italic text-forest-700">change what you decide.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16} className="lg:col-span-4">
            <p className="max-w-sm type-body">
              Four ways into GIBS, from a first degree to custom executive work
              for a single institution.
            </p>
          </Reveal>
        </div>

        {/* Editorial category bands */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="mt-16 space-y-14 sm:mt-20"
        >
          {HOME_PROGRAMME_BANDS.map((band, i) => (
            <motion.section
              key={band.band}
              variants={staggerItem}
              className="grid gap-6 lg:grid-cols-12 lg:gap-10"
            >
              <div className="lg:col-span-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-forest-600">
                  {String(i + 1).padStart(2, "0")} — {band.band}
                </p>
                <p className="mt-3 max-w-[17rem] text-[13.5px] leading-relaxed text-muted lg:pr-2">
                  {band.note}
                </p>
              </div>
              <div className="lg:col-span-8 lg:pl-6">
                {band.slugs.map((slug) => (
                  <ProgrammePanel key={slug} slug={slug} />
                ))}
              </div>
            </motion.section>
          ))}
        </motion.div>

        <div className="mt-16 flex flex-wrap items-center gap-x-9 gap-y-4 border-t rule pt-9">
          <Link to="/programmes" className="btn btn-primary btn-lg">
            Explore Programmes
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link to="/executive-education" className="group link-underline text-sm font-semibold text-forest-700">
            Executive education for organizations
          </Link>
        </div>
      </div>
    </section>
  );
}
