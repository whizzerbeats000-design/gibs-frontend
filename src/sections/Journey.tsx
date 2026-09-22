import { Reveal } from "../components/motion";
import { BtnLink, DataNote } from "../components/ui";
import { ArrowUpRight } from "../components/icons";
import { ADMISSIONS_STEPS } from "../lib/data";

export default function AdmissionsTeaser() {
  return (
    <section id="admissions" className="cv-auto relative overflow-hidden bg-forest-800 text-ivory">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_120%_at_88%_-20%,rgba(235,211,117,0.16),transparent_50%)]" />
      <div className="container-x relative py-20 sm:py-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow-light">Admissions</p>
            </Reveal>
            <Reveal delay={0.08} y={28}>
              <h2 className="display-serif type-h2 mt-5">
                The journey,
                <br />
                <em className="italic text-gold-300">step by step.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-7 max-w-lg type-body text-ivory/85">
                Every candidate is guided personally by the admissions office —
                no portals, no unanswered emails.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-10">
                <BtnLink to="/admissions" variant="gold" size="lg">
                  Apply Now
                  <ArrowUpRight className="h-4 w-4" />
                </BtnLink>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="lg:col-span-7 lg:pl-8">
            <ol className="border-t rule-light">
              {ADMISSIONS_STEPS.map((step) => (
                <li
                  key={step.n}
                  className="grid grid-cols-[3rem_1fr] items-baseline gap-x-5 border-b rule-light py-5 sm:grid-cols-[4rem_1fr] sm:gap-x-8"
                >
                  <span className="text-[12px] font-medium tracking-[0.14em] text-gold-300">{step.n}</span>
                  <h3 className="display-serif type-h3 text-ivory">{step.title}</h3>
                </li>
              ))}
            </ol>
            <div className="mt-7">
              <DataNote light label="Intake calendar to be published">
                Deadlines, decision dates and tuition from the registrar.
              </DataNote>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
