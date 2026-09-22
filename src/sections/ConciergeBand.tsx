import { Reveal } from "../components/motion";
import { Link } from "../lib/router";
import { ChatIcon, ArrowUpRight } from "../components/icons";
import { useConcierge } from "../components/Concierge";
import { MeridianRule } from "../components/ui";

export default function ConciergeBand() {
  const { setOpen } = useConcierge();

  return (
    <section className="cv-auto relative border-t border-line bg-white">
      <div className="container-x py-20 sm:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          {/* Editorial copy */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">GIBS Concierge</p>
              <h2 className="type-h2 mt-5 text-ink">
                The digital
                <br />
                <em className="italic text-forest-700">admissions desk.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-xl type-body">
                The GIBS Concierge answers questions directly, or hands you to
                a colleague who can.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <button type="button" onClick={() => setOpen(true)} className="btn btn-primary btn-lg">
                  Open the Concierge
                </button>
                <Link to="/concierge" className="group link-underline text-sm font-semibold text-forest-700">
                  Concierge page
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Quote card — the single green moment of this section */}
          <Reveal delay={0.16} y={36} className="lg:col-span-5">
            <figure className="relative bg-forest-800 p-9 text-ivory shadow-lift sm:p-12">
              <MeridianRule light at="82%" className="absolute inset-x-9 top-7 w-auto sm:inset-x-12" />
              <span className="mt-4 flex h-12 w-12 items-center justify-center rounded-pill bg-gold-300 text-forest-950">
                <ChatIcon className="h-5 w-5" />
              </span>
              <blockquote className="display-serif mt-7 text-[1.55rem] leading-[1.4]">
                “Welcome to GIBS Concierge. How can we help you find your way?”
              </blockquote>
              <figcaption className="mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-ivory/55">
                Guided assistance · not an AI service
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
