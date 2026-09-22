import { motion } from "framer-motion";
import { Reveal, stagger, staggerItem } from "../components/motion";
import { ArrowTextLink } from "../components/ui";
import { Link } from "../lib/router";
import { ArrowUpRight } from "../components/icons";
import { ARTICLES } from "../lib/data";

export default function InsightsTeaser() {
  const [featured, second, third] = ARTICLES;

  return (
    <section id="insights" className="paper-grain cv-auto relative bg-paper">
      <div className="container-x py-20 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="eyebrow">News &amp; Insights</p>
            </Reveal>
            <Reveal delay={0.08} y={28}>
              <h2 className="display-serif type-h2 mt-5 text-ink">
                The journal, <em className="italic text-forest-700">in formation.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16}>
            <ArrowTextLink to="/research-insights">Enter the journal</ArrowTextLink>
          </Reveal>
        </div>

        {/* Featured — asymmetric editorial spread */}
        <Reveal delay={0.1} y={36} className="mt-14">
          <Link
            to={`/research-insights/${featured.slug}`}
            className="group grid gap-8 lg:grid-cols-12 lg:gap-12"
          >
            <div className="relative aspect-[16/10] overflow-hidden lg:col-span-7">
              <img
                src={featured.image}
                alt={featured.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-forest-950/20" />
              <div className="absolute inset-0 ring-1 ring-inset ring-ink/10" />
            </div>
            <div className="flex flex-col justify-center lg:col-span-5">
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em]">
                <span className="text-forest-600">{featured.category}</span>
                <span className="text-muted/70">·</span>
                <span className="text-muted">{featured.status}</span>
              </div>
              <h3 className="display-serif type-h3 mt-5 text-ink transition-colors group-hover:text-forest-800">
                {featured.title}
              </h3>
              <p className="mt-5 max-w-md type-body">{featured.dek}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-[13px] font-bold text-forest-700">
                Read the editorial preview
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </Reveal>

        {/* Secondary — editorial rows, not identical cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="mt-16 grid gap-px overflow-hidden border border-line bg-line lg:grid-cols-2"
        >
          {[second, third].map((post) => (
            <motion.article key={post.slug} variants={staggerItem} className="bg-paper p-8 sm:p-10">
              <Link to={`/research-insights/${post.slug}`} className="group block">
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-forest-600">
                  {post.category}
                </p>
                <h3 className="display-serif type-h3 mt-4 text-ink transition-colors group-hover:text-forest-800">
                  {post.title}
                </h3>
                <p className="mt-3 type-body">{post.dek}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[12.5px] font-bold text-forest-700">
                  Follow the research
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
