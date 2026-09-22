import { PageHero } from "../components/PageHero";
import { BtnLink, ClosingQuiet, DataNote, EmptyState } from "../components/ui";
import { Reveal } from "../components/motion";
import { useSeo } from "../lib/router";
import { IMAGES } from "../lib/data";

const VALUES = [
  {
    n: "01",
    title: "Authority, quietly held",
    body: "Expertise that earns attention without performing for it, seriousness without self-importance.",
  },
  {
    n: "02",
    title: "Scholarship in service of practice",
    body: "Knowledge judged by whether it changes what a leader can do with a real organization.",
  },
  {
    n: "03",
    title: "Global and African",
    body: "Measured against the world's best institutions, rooted in the continent's questions and possibilities.",
  },
  {
    n: "04",
    title: "Craft and permanence",
    body: "A belief that institutions, like buildings, are made to outlast their founders.",
  },
];

const CHAPTERS = [
  {
    chapter: "Chapter I",
    title: "The founding idea",
    body: "GIBS begins with a conviction: that the institutions of the Global Africa deserve a business school built to the same standard as the world's most enduring seats of management learning, unapologetically rooted in African realities.",
  },
  {
    chapter: "Chapter II",
    title: "The curriculum",
    body: "GIBS builds its own curriculum around the questions its fellows will actually face: building institutions, leading across borders, allocating capital under uncertainty, and governing with integrity.",
  },
  {
    chapter: "Chapter III",
    title: "A campus made of stone",
    body: "The physical school is designed as modern classicism: travertine, oak, brass and forest-green steel, an architecture of permanence.",
  },
  {
    chapter: "Chapter IV",
    title: "What comes next",
    body: "Faculty appointments, research centres, executive partnerships and the public programme are being assembled deliberately.",
  },
];

export default function About() {
  useSeo({
    title: "About GIBS — Goshen International Business School",
    description:
      "The identity, vision, mission and values of Goshen International Business School.",
  });

  return (
    <>
      <PageHero
        image={IMAGES.hero}
        imageAlt="The GIBS campus with members of the school community on the promenade"
        eyebrow="About GIBS"
        title="An institution built to"
        italic="endure."
        intro="An international business school for the leaders and institutions of the Global Africa."
        breadcrumbs={[{ label: "About GIBS" }]}
      />

      {/* Identity statement */}
      <section className="bg-paper">
        <div className="container-x grid gap-12 py-20 sm:py-24 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow">Identity</p>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal delay={0.08}>
              <p className="display-serif type-h3 text-ink">
                We educate the leaders, entrepreneurs and organizations who
                will build the institutions of the Global Africa. These are
                people who move between worlds with confidence and treat
                permanence as a{" "}
                <em className="text-forest-700">responsibility.</em>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Vision & mission */}
      <section className="border-y border-line bg-white">
        <div className="container-x grid gap-px overflow-hidden bg-line lg:grid-cols-2">
          {[
            {
              label: "Vision",
              text: "To be recognized as one of the defining business schools of the next global century, an African institution whose ideas, leaders and standards shape world business.",
            },
            {
              label: "Mission",
              text: "To deliver a contemporary business education that unites rigorous scholarship with the practice of leadership, for the people and institutions of the Global Africa.",
            },
          ].map((block) => (
            <div key={block.label} className="bg-white p-10 sm:p-14">
              <Reveal>
                <p className="eyebrow">{block.label}</p>
                <p className="display-serif type-h3 mt-6 text-ink">
                  {block.text}
                </p>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="paper-grain bg-paper">
        <div className="container-x py-20 sm:py-24">
          <Reveal>
            <p className="eyebrow">Values</p>
            <h2 className="display-serif type-h2 mt-5 max-w-3xl text-ink">
              What the institution
              <em className="text-forest-700"> will not compromise.</em>
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {VALUES.map((v) => (
              <Reveal key={v.n} delay={0.05 * Number(v.n)} className="flex gap-6">
                <div>
                  <h3 className="display-serif type-h3 text-ink">{v.title}</h3>
                  <p className="mt-3 type-body">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Story chapters */}
      <section className="border-y border-line bg-white">
        <div className="container-x py-20 sm:py-24">
          <Reveal>
            <p className="eyebrow">Our Story</p>
            <h2 className="display-serif type-h2 mt-5 text-ink">
              The story <em className="text-forest-700">so far.</em>
            </h2>
          </Reveal>
          <ol className="mt-14 border-t rule">
            {CHAPTERS.map((c) => (
              <li
                key={c.chapter}
                className="grid gap-4 border-b rule py-9 sm:grid-cols-[10rem_1fr] sm:gap-10"
              >
                <p className="meta pt-1.5 text-gold-700">{c.chapter}</p>
                <div>
                  <h3 className="display-serif type-h3 text-ink">{c.title}</h3>
                  <p className="mt-3 max-w-2xl type-body">{c.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8 max-w-2xl">
            <DataNote label="Founding dates, governance and accreditation to be published">
              Dates, governance and accreditation are published as official
              records are confirmed. Nothing here is invented.
            </DataNote>
          </div>
        </div>
      </section>

      {/* Global perspective — image-led */}
      <section className="border-y border-line bg-forest-900 text-ivory">
        <div className="grid lg:grid-cols-2">
          <Reveal y={32} className="order-2 lg:order-1 lg:flex">
            <div className="relative h-72 w-full lg:h-auto lg:flex-1">
              <img
                src={IMAGES.city}
                alt="The GIBS campus from above — open sky and sandstone pavilions"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-forest-950/25" />
            </div>
          </Reveal>
          <div className="order-1 flex items-center p-8 sm:p-14 lg:p-20">
            <Reveal>
              <p className="eyebrow-light">Global Perspective</p>
              <h2 className="display-serif type-h2 mt-6">
                A school for the Global Africa
              </h2>
              <p className="mt-5 max-w-lg type-body text-ivory/85">
                GIBS prepares leaders who move comfortably between continents.
                The institution's next chapter is deliberate: appointed
                faculty, research centres, executive partnerships and a public
                programme, assembled in order and announced once confirmed.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                <BtnLink to="/campus" variant="gold" size="md">
                  Visit the campus
                </BtnLink>
                <BtnLink to="/contact" variant="outline-light" size="md">
                  Contact / Visit
                </BtnLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Leadership — honest pending state */}
      <section className="bg-paper">
        <div className="container-x py-20 sm:py-24">
          <Reveal>
            <p className="eyebrow">Leadership</p>
            <h2 className="display-serif type-h2 mt-5 text-ink">
              The people behind the institution
            </h2>
          </Reveal>
          <div className="mt-10">
            <EmptyState
              title="Leadership directory in preparation"
              body="Profiles of the founding dean, faculty chairs and governing board are published once appointments are official. No names are shown speculatively."
              action={
                <BtnLink to="/contact?type=Media+%26+partnerships" variant="outline-ink" size="md">
                  Enquire about leadership
                </BtnLink>
              }
            />
          </div>
        </div>
      </section>

      <ClosingQuiet
        eyebrow="Continue"
        title="From identity to"
        italic="institution."
        body="Move from what GIBS believes to how it teaches, who teaches it, and the ground it is taught on."
        actions={
          <>
            <BtnLink to="/programmes" variant="primary" size="lg">Explore programmes</BtnLink>
            <BtnLink to="/campus" variant="outline-ink" size="lg">Visit the campus</BtnLink>
          </>
        }
      />
    </>
  );
}
