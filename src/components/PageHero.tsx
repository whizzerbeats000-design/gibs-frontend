import type { ReactNode } from "react";
import { Breadcrumbs } from "./ui";
import { Reveal } from "./motion";
import { gibsResponsiveImage } from "../lib/gibsResponsiveImages";

type PageHeroProps = {
  eyebrow?: string;
  title: ReactNode;
  italic?: ReactNode;
  intro?: ReactNode;
  breadcrumbs?: { label: string; to?: string }[];
  meta?: ReactNode;
} & ({ image: string; imageAlt: string } | { image?: never; imageAlt?: never });

export function PageHero(props: PageHeroProps) {
  const { eyebrow, title, italic, intro, breadcrumbs, meta } = props;

  if (props.image) {
    return (
      <section className="relative overflow-hidden bg-forest-950 text-ivory">
        <div className="absolute inset-0">
          <img
            {...gibsResponsiveImage(props.image)}
            alt={props.imageAlt}
            sizes="100vw"
            className="h-full w-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
          <div className="film-grain" aria-hidden="true" />
          <div className="absolute inset-0 bg-[linear-gradient(95deg,rgba(0,32,9,0.82)_0%,rgba(0,40,14,0.55)_45%,rgba(0,32,9,0.30)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,32,9,0.72),transparent_50%)]" />
        </div>
        <div className="container-x relative pb-16 pt-[var(--pt-hero)] sm:pb-24 sm:pt-[var(--pt-hero-lg)] xl:pt-[var(--pt-hero-lg)]">
          {breadcrumbs && (
            <div className="text-ivory/70 [&_a]:text-ivory/70 [&_a:hover]:text-gold-300">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          )}
          {eyebrow && (
            <Reveal>
              <p className="eyebrow-light">{eyebrow}</p>
            </Reveal>
          )}
          <Reveal delay={0.08} y={28}>
            <h1 className="type-h1 type-extrude-ivory mt-5 max-w-editorial">
              {title} {italic && <em className="text-gold-300">{italic}</em>}
            </h1>
          </Reveal>
          {intro && (
            <Reveal delay={0.16} y={20}>
              <p className="mt-7 max-w-prose type-body text-ivory/85">
                {intro}
              </p>
            </Reveal>
          )}
          {meta && <Reveal delay={0.22}><div className="mt-8">{meta}</div></Reveal>}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-paper">
      <div className="container-x pb-14 pt-[var(--pt-hero)] sm:pb-20 sm:pt-[var(--pt-hero-sm)] xl:pt-[var(--pt-hero-lg)]">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        {eyebrow && (
          <Reveal>
            <p className="eyebrow">{eyebrow}</p>
          </Reveal>
        )}
        <Reveal delay={0.08} y={28}>
          <h1 className="type-h1 mt-5 max-w-editorial text-ink">
            {title} {italic && <em className="text-forest-700">{italic}</em>}
          </h1>
        </Reveal>
        {intro && (
          <Reveal delay={0.16} y={20}>
            <p className="mt-7 max-w-prose type-body text-muted">{intro}</p>
          </Reveal>
        )}
        {meta && <Reveal delay={0.22}><div className="mt-8">{meta}</div></Reveal>}
      </div>
    </section>
  );
}
