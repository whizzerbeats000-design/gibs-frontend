import { Reveal } from "../components/motion";
import { Link } from "../lib/router";
import { ArrowUpRight } from "../components/icons";
import { useConcierge } from "../components/Concierge";

export default function ConciergeBand() {
  const { setOpen } = useConcierge();

  return (
    <section className="cv-auto relative border-t border-line bg-white">
      <div className="container-x band-y">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Editorial copy */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">GIBS AI</p>
              <h2 className="type-h2 mt-5 text-ink">
                The digital
                <br />
                <em className="italic text-forest-700">programme guide.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-xl type-body">
                GIBS AI answers questions directly about the 2026 programme catalogue,
                overseas training hubs, and campus facilities.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <button type="button" onClick={() => setOpen(true)} className="btn btn-primary btn-lg">
                  Open GIBS AI
                </button>
                <Link to="/concierge" className="group link-underline text-sm font-semibold text-forest-700">
                  GIBS AI page
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Quote card — the single green moment of this section */}
          <Reveal delay={0.16} y={36} className="lg:col-span-5">
            <figure className="relative bg-forest-800 p-8 text-ivory shadow-card sm:p-10">
              <blockquote className="display-serif mt-10 text-[1.55rem] leading-[1.4]">
                “Welcome to GIBS AI. How can we help you find your way?”
              </blockquote>
              <figcaption className="mt-6 text-[11px] font-medium uppercase tracking-[0.12em] text-ivory/70">
                Programme and enquiry guide
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
