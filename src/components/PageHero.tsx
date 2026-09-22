import type { ReactNode } from "react";
import { Breadcrumbs } from "./ui";
import { Reveal } from "./motion";

export function PageHero({
  eyebrow,
  title,
  italic,
  intro,
  breadcrumbs,
  image,
  imageAlt,
  meta,
}: {
  eyebrow: string;
  title: ReactNode;
  italic?: ReactNode;
  intro?: ReactNode;
  breadcrumbs?: { label: string; to?: string }[];
  image?: string;
  imageAlt?: string;
  meta?: ReactNode;
}) {
  if (image) {
    return (
      <section className="relative overflow-hidden bg-forest-950 text-ivory">
        <div className="absolute inset-0">
          <img
            src={image}
            alt={imageAlt ?? ""}
            className="h-full w-full object-cover"
            decoding="async"
          />
          <div className="film-grain" aria-hidden="true" />
          <div className="absolute inset-0 bg-[linear-gradient(95deg,rgba(0,32,9,0.82)_0%,rgba(0,40,14,0.55)_45%,rgba(0,32,9,0.30)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,32,9,0.72),transparent_50%)]" />
        </div>
        <div className="container-x relative pb-16 pt-[120px] sm:pb-24 sm:pt-[148px] xl:pt-[148px]">
          {breadcrumbs && (
            <div className="text-ivory/70 [&_a]:text-ivory/70 [&_a:hover]:text-gold-300">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          )}
          <Reveal>
            <p className="eyebrow-light">{eyebrow}</p>
          </Reveal>
          <Reveal delay={0.08} y={28}>
            <h1 className="display-serif type-h1 type-extrude-ivory mt-5 max-w-4xl">
              {title} {italic && <em className="text-gold-300">{italic}</em>}
            </h1>
          </Reveal>
          {intro && (
            <Reveal delay={0.16} y={20}>
              <p className="mt-7 max-w-2xl type-body text-ivory/85">
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
      <div className="container-x pb-14 pt-[120px] sm:pb-20 sm:pt-[142px] xl:pt-[148px]">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
        <Reveal delay={0.08} y={28}>
          <h1 className="display-serif type-h1 mt-5 max-w-4xl text-ink">
            {title} {italic && <em className="text-forest-700">{italic}</em>}
          </h1>
        </Reveal>
        {intro && (
          <Reveal delay={0.16} y={20}>
            <p className="mt-7 max-w-2xl type-body text-muted">{intro}</p>
          </Reveal>
        )}
        {meta && <Reveal delay={0.22}><div className="mt-8">{meta}</div></Reveal>}
      </div>
    </section>
  );
}
