import { motion } from "framer-motion";
import { Reveal, Stagger, staggerItem } from "../components/motion";
import { ArrowTextLink, BtnLink, EmptyState } from "../components/ui";
import { Link } from "../lib/router";
import { ArrowUpRight } from "../components/icons";
import { ARTICLES, imageSet } from "../lib/data";
import { cn } from "../utils/cn";

export default function InsightsTeaser() {
  const [featured, ...others] = ARTICLES;

  // No articles yet: keep the section and its rhythm rather than silently
  // dropping the whole block from the homepage.
  if (!featured) {
    return (
      <section id="insights" className="paper-grain cv-auto relative bg-paper">
        <div className="container-x section-y">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">News &amp; Insights</p>
              <h2 className="type-h2 mt-5 text-ink">
                The GIBS journal
              </h2>
            </div>
            <ArrowTextLink to="/research-insights">Enter the journal</ArrowTextLink>
          </div>
          <div className="mt-14">
            <EmptyState
              title="The first edition is in preparation"
              body="Research essays, case studies and faculty perspectives will appear here once it publishes."
              action={
                <BtnLink to="/research-insights" variant="outline-ink" size="md">
                  Visit the journal
                </BtnLink>
              }
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="insights" className="paper-grain cv-auto relative bg-paper">
      <div className="container-x section-y">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="eyebrow">News &amp; Insights</p>
            </Reveal>
            <Reveal delay={0.08} y={28}>
              <h2 className="type-h2 mt-5 text-ink">
                The GIBS journal
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16}>
            <ArrowTextLink to="/research-insights">Enter the journal</ArrowTextLink>
          </Reveal>
        </div>

        {/* Featured — asymmetric editorial spread with tactile depth */}
        <Reveal delay={0.1} y={36} className="mt-14">
          <Link
            to={`/research-insights/${featured.slug}`}
            className="group grid gap-8 rounded-panel border border-line bg-white p-6 shadow-card transition-all duration-300 hover:shadow-card-strong lg:grid-cols-12 lg:gap-8 lg:p-6"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-xs shadow-crisp lg:col-span-7">
              <img
                {...imageSet(featured.image)}
                alt={featured.alt}
                loading="lazy"
                decoding="async"
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-forest-950/20 transition-colors duration-300 group-hover:bg-forest-950/10" />
              <div className="absolute inset-0 ring-1 ring-inset ring-ink/10" />
            </div>
            <div className="flex flex-col justify-center lg:col-span-5">
              <div className="flex items-center gap-2">
                <span className="card-eyebrow">{featured.category}</span>
                <span className="meta text-muted/70" aria-hidden="true">
                  ·
                </span>
                <span className="meta">{featured.status}</span>
              </div>
              <h3 className="type-h3 mt-4 text-ink transition-colors group-hover:text-forest-800">
                {featured.title}
              </h3>
              <p className="mt-4 max-w-md type-body">{featured.dek}</p>
              <span className="card-action card-action-quiet mt-6">
                Read the editorial preview
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </Reveal>

        {/* Secondary — editorial rows with subtle surface elevation */}
        {others.length > 0 && (
          <Stagger
            className={cn(
              "mt-12 grid gap-6",
              others.length > 1 ? "lg:grid-cols-2" : "grid-cols-1"
            )}
          >
            {others.slice(0, 2).map((post) => (
              <motion.article
                key={post.slug}
                variants={staggerItem}
                className="card-lift group relative rounded-panel border border-line bg-white p-7 shadow-crisp focus-within:ring-2 focus-within:ring-forest-600/45 focus-within:ring-offset-2 sm:p-8"
              >
                <p className="eyebrow text-forest-600">{post.category}</p>
                <h3 className="type-h3 mt-3 text-ink transition-colors group-hover:text-forest-800">
                  <Link
                    to={`/research-insights/${post.slug}`}
                    className="after:absolute after:inset-0 after:content-['']"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-3 type-body line-clamp-2">{post.dek}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[12.5px] font-bold text-forest-700">
                  Follow the research
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </motion.article>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
