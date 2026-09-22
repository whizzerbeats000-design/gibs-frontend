import { BtnLink, ArrowTextLink } from "../components/ui";
import { useSeo } from "../lib/router";

export default function NotFound() {
  useSeo({
    title: "Page not found — GIBS",
    description: "The page you are looking for could not be found.",
  });

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-forest-900 text-ivory">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_120%_at_85%_-10%,rgba(235,211,117,0.14),transparent_55%)]" />
      <div className="container-x relative pb-20 pt-[140px]">
        <p className="eyebrow-light">Error 404</p>
        <h1 className="type-h1 mt-6 max-w-3xl">
          This corridor
          <br />
          <em className="text-gold-300">doesn't exist.</em>
        </h1>
        <p className="mt-7 max-w-lg type-body text-ivory/85">
          The page may have moved, or the address may be incomplete. Let us
          guide you back to the institution's main thoroughfares.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <BtnLink to="/" variant="gold" size="lg">
            Return home
          </BtnLink>
          <BtnLink to="/programmes" variant="outline-light" size="lg">
            Browse programmes
          </BtnLink>
        </div>
        <div className="mt-14 border-t rule-light pt-6">
          <ArrowTextLink to="/concierge" light>
            Or ask the GIBS Concierge to find your way
          </ArrowTextLink>
        </div>
      </div>
    </section>
  );
}
