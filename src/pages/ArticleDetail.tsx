import { BtnLink, Breadcrumbs, MeridianRule } from "../components/ui";
import { EditorialCard } from "../components/cards";
import { Reveal } from "../components/motion";
import { Link, useSeo } from "../lib/router";
import { getArticle, relatedArticles, ARTICLES } from "../lib/data";
import { ArrowLeft, ArrowUpRight } from "../components/icons";
import NotFound from "./NotFound";

export default function ArticleDetail({ slug }: { slug: string }) {
  const article = getArticle(slug);

  useSeo({
    title: article ? `${article.title} — GIBS Journal` : "Article not found — GIBS",
    description: article?.dek ?? "",
  });

  if (!article) return <NotFound />;

  const related = relatedArticles(slug, 2);

  return (
    <>
      {/* Article masthead */}
      <section className="bg-paper">
        <div className="container-x pb-12 pt-[120px] sm:pb-14 sm:pt-[142px] xl:pt-[148px]">
          <Breadcrumbs
            items={[
              { label: "Research & Insights", to: "/research-insights" },
              { label: article.category },
            ]}
          />
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Reveal>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="rounded-pill border border-gold-600/50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-gold-700">
                    {article.status}
                  </span>
                  <span className="meta text-forest-600">{article.kicker}</span>
                  <span className="meta">{article.category}</span>
                </div>
                <h1 className="type-h1 mt-6 text-ink">
                  {article.title}
                </h1>
                <p className="type-body mt-6 max-w-2xl">{article.dek}</p>
              </Reveal>
            </div>
            <div className="lg:col-span-4 lg:pt-2">
              <Reveal delay={0.12}>
                <dl className="border-l-2 border-forest-600 pl-6 text-[13px] leading-relaxed text-muted">
                  <dt className="meta">Publication date</dt>
                  <dd className="mt-1 italic">To be confirmed at launch</dd>
                  <dt className="meta mt-5">Reading time</dt>
                  <dd className="mt-1 italic">To be published</dd>
                </dl>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Figure */}
      <section className="bg-paper">
        <div className="container-x">
          <Reveal y={30}>
            <figure>
              <div className="relative aspect-[21/9] overflow-hidden">
                <img
                  src={article.image}
                  alt={article.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-forest-950/20" />
                <div className="absolute inset-0 ring-1 ring-inset ring-ink/10" />
              </div>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Body — editorial measure */}
      <article className="bg-paper">
        <div className="container-x py-16 sm:py-24">
          <div className="mx-auto max-w-[68ch]">
            <Reveal>
              <div className="border-l-2 border-gold-500 bg-ivory/60 px-6 py-5 text-[14px] leading-[1.8] text-muted">
                <strong className="font-bold text-forest-800">Editorial preview.</strong> This piece
                is forthcoming. The argument is in formation and nothing is
                shown until verified.
              </div>
            </Reveal>

            <div className="prose-editorial mt-12">
              {article.blocks.map((block, i) => {
                if (block.type === "h2")
                  return (
                    <h2 key={i} id={`section-${i}`}>
                      {block.text}
                    </h2>
                  );
                if (block.type === "quote") return <blockquote key={i}>{block.text}</blockquote>;
                return <p key={i}>{block.text}</p>;
              })}
            </div>

            <MeridianRule at="50%" className="my-14" />

            {/* Author pending */}
            <Reveal>
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <p className="meta">Written by</p>
                  <p className="display-serif mt-2 text-xl text-ink">
                    GIBS faculty, attribution to be confirmed
                  </p>
                </div>
                <BtnLink
                  to="/contact?type=Media+%26+partnerships"
                  variant="outline-ink"
                  size="md"
                >
                  Request on publication
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </BtnLink>
              </div>
            </Reveal>
          </div>
        </div>
      </article>

      {/* Related reading */}
      <section className="border-t border-line bg-white">
        <div className="container-x py-16 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="type-h3 text-ink">Continue reading</h2>
            <Link
              to="/research-insights"
              className="group inline-flex items-center gap-2 text-sm font-bold text-forest-700"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              All insights
            </Link>
          </div>
          <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-10">
            {related.map((post) => (
              <EditorialCard
                key={post.slug}
                to={`/research-insights/${post.slug}`}
                image={post.image}
                alt={post.alt}
                tag={post.category}
                meta="Forthcoming"
                title={post.title}
                excerpt={post.dek}
                cta="Read the preview"
              />
            ))}
          </div>
          {ARTICLES.length > 0 && related.length < 2 && (
            <p className="sr-only">{ARTICLES.length} insights in the journal.</p>
          )}
        </div>
      </section>
    </>
  );
}
