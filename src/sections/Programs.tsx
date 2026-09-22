import { motion } from "framer-motion";
import { Link } from "../lib/router";
import { PROGRAMMES, HOME_PROGRAMME_BANDS } from "../lib/data";
import { Reveal, stagger, staggerItem } from "../components/motion";
import { Eyebrow } from "../components/ui";
import { ArrowUpRight, Diamond } from "../components/icons";

function ProgrammePanel({ slug }: { slug: string }) {
  const p = PROGRAMMES.find((x) => x.slug === slug);
  if (!p) return null;
  return (
    <Link
      to={`/programmes/${p.slug}`}
      className="group grid grid-cols-[1fr_auto] items-start gap-4 border-t rule py-6 first:border-t-0"
    >
      <div>
        <h3 className="display-serif type-h3 text-ink transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5">
          {p.title}
        </h3>
        <p className="mt-1.5 type-body">{p.tagline}.</p>
        <p className="mt-2.5 text-[13px] font-semibold text-forest-600">{p.category}</p>
      </div>
      <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink/70 transition-all duration-300 group-hover:border-forest-600 group-hover:bg-forest-600 group-hover:text-ivory">
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
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
                <div className="flex items-center gap-3">
                  <Diamond className="h-2 w-2 shrink-0 text-gold-600" />
                  <span className="h-px w-10 bg-gold-500/70" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-forest-600">
                    {String(i + 1).padStart(2, "0")} · {band.band}
                  </span>
                </div>
                <p className="mt-4 max-w-[18rem] type-body lg:pl-5">
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
