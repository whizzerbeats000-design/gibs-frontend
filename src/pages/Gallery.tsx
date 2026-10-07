import { useState, useCallback, useRef } from "react";
import { Breadcrumbs } from "../components/ui";
import { Reveal } from "../components/motion";
import { useSeo } from "../lib/router";
import { useBodyScrollLock, useEscape, useFocusTrap } from "../lib/hooks";
import { CloseIcon, ArrowLeft, ArrowRight } from "../components/icons";

type GalleryItem = {
  id: string;
  category: string;
  title: string;
  caption: string;
  image: string;
  alt: string;
  aspect: string;
};

function GalleryFrame({
  item,
  className = "",
  loading = "lazy",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: {
  item: GalleryItem;
  className?: string;
  loading?: "eager" | "lazy";
  sizes?: string;
}) {
  const frameClass = `relative ${className || item.aspect} w-full overflow-hidden`;

  return (
    <div className={frameClass}>
      <img
        src={item.image}
        alt={item.alt}
        loading={loading}
        decoding="async"
        sizes={sizes}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-forest-950/10 group-hover:bg-forest-950/5" />
      <div className="absolute inset-0 ring-1 ring-inset ring-ink/10" />
    </div>
  );
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "arch-1",
    category: "Architecture",
    title: "GIBS campus building",
    caption: "A view of the GIBS building and its landscaped entrance in Ilorin.",
    image: "/images/gibs-hero-branded.jpg",
    alt: "Goshen International Business School building in Ilorin, with blue-framed windows and a landscaped entrance",
    aspect: "aspect-[16/9]",
  },
  {
    id: "arch-2",
    category: "Architecture",
    title: "GIBS headquarters",
    caption: "The headquarters building and its front entrance.",
    image: "/images/gibs-hq-architecture-edited-branded.jpg",
    alt: "GIBS headquarters building with signage and blue-framed windows",
    aspect: "aspect-[4/3]",
  },
  {
    id: "arch-3",
    category: "Architecture",
    title: "Ibafo training facility",
    caption: "Exterior view of the GIBS Ibafo facility.",
    image: "/images/gibs-ibafo-architecture-branded.jpg",
    alt: "GIBS Ibafo facility exterior, with a glass-fronted upper level",
    aspect: "aspect-[4/3]",
  },
  {
    id: "arch-4",
    category: "Architecture",
    title: "Ibafo front gate",
    caption: "The entrance to the GIBS Ibafo facility.",
    image: "/images/gibs-ibafo-front-gate-branded.jpg",
    alt: "GIBS Ibafo front gate with the Goshen International Business School sign",
    aspect: "aspect-[16/9]",
  },
  {
    id: "fac-reception",
    category: "Facilities",
    title: "Headquarters reception",
    caption: "Reception room at GIBS headquarters.",
    image: "/images/gibs-hq-reception-room-branded.jpg",
    alt: "GIBS headquarters reception room with lounge seating and an interior balcony",
    aspect: "aspect-[4/3]",
  },
  {
    id: "class-1",
    category: "Classrooms",
    title: "Case rooms",
    caption: "Case rooms built for discussion rather than lectures.",
    image: "/images/gibs-hq-classroom-branded.jpg",
    alt: "GIBS headquarters classroom arranged around a central training table, with a projector and whiteboard",
    aspect: "aspect-[4/3]",
  },
  {
    id: "class-2",
    category: "Classrooms",
    title: "Learning studios",
    caption: "Case rooms, group work and practice spaces.",
    image: "/images/gibs-hq-classroom-branded.jpg",
    alt: "GIBS headquarters classroom arranged around a central training table, with a projector and whiteboard",
    aspect: "aspect-[3/4]",
  },
  {
    id: "life-2",
    category: "Student Life",
    title: "Residences and common rooms",
    caption: "For residential fellows and executives.",
    image: "/images/gibs-hq-guest-residence-branded.jpg",
    alt: "GIBS headquarters guest residence building",
    aspect: "aspect-[4/3]",
  },
];

const CATEGORIES = ["All", "Architecture", "Classrooms", "Facilities", "Student Life"] as const;

function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[index];
  useBodyScrollLock(true);
  useEscape(true, onClose);
  const ref = useFocusTrap<HTMLDivElement>(true);

  // Touch swipe support (C-07)
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 48) {
      dx < 0 ? onNext() : onPrev();
    }
    touchStartX.current = null;
  };

  return (
    <div className="fixed inset-0 z-[var(--z-lightbox)] flex items-center justify-center bg-ink/90 p-3 backdrop-blur-sm sm:p-8">
      {/* Backdrop close */}
      <button
        type="button"
        aria-label="Close gallery"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={`${item.title} — ${item.category}`}
        className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-panel bg-paper shadow-lift"
        style={{ maxHeight: "min(90vh, 90dvh)" }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-3 sm:px-5">
          <div>
            <p className="eyebrow text-forest-600">{item.category}</p>
            <h2 className="display-serif text-base text-ink sm:text-lg">{item.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close lightbox"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-ivory transition-colors hover:bg-forest-800"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Image area — C-09 landscape fix: use dvh-aware max-height */}
        <div
          className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-stone"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <img
            src={item.image}
            alt={item.alt}
            sizes="100vw"
            className="max-h-[55vh] w-full object-contain"
            style={{ maxHeight: "min(55vh, 55dvh)" }}
          />
          {/* Prev — C-06: use ArrowLeft */}
          <button
            type="button"
            onClick={onPrev}
            aria-label={`Previous image (${((index - 1 + items.length) % items.length) + 1} of ${items.length})`}
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 text-ink shadow-crisp transition-colors hover:bg-ivory sm:left-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          {/* Next — C-06: use ArrowRight */}
          <button
            type="button"
            onClick={onNext}
            aria-label={`Next image (${((index + 1) % items.length) + 1} of ${items.length})`}
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 text-ink shadow-crisp transition-colors hover:bg-ivory sm:right-4"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Caption */}
        <div className="shrink-0 border-t border-line bg-white px-4 py-3 sm:px-5 sm:py-4">
          <p className="text-[13px] leading-relaxed text-muted sm:text-[14px]">{item.caption}</p>
          <p className="mt-1 meta">
            {index + 1} of {items.length} — {item.category}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  useSeo({
    title: "Gallery — GIBS",
    description: "Photographs of GIBS headquarters architecture, training rooms, guest residence and the Ibafo facility.",
  });

  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeCategory === "All" ? GALLERY_ITEMS : GALLERY_ITEMS.filter((i) => i.category === activeCategory);

  const openLightbox = useCallback((idx: number) => setLightboxIndex(idx), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(() => {
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
  }, [lightboxIndex, filtered.length]);
  const next = useCallback(() => {
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex + 1) % filtered.length);
  }, [lightboxIndex, filtered.length]);

  return (
    <>
      {/* Editorial intro */}
      <section className="bg-paper">
        <div className="container-x pb-12 pt-[var(--pt-page)] sm:pb-16 sm:pt-[var(--pt-page-sm)] lg:pb-20 lg:pt-[var(--pt-page-lg)] grid lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Breadcrumbs items={[{ label: "Gallery" }]} />
            <Reveal>
              <p className="eyebrow mt-6">Gallery</p>
            </Reveal>
            <Reveal delay={0.06} y={20}>
              <h1 className="type-h1 mt-4 max-w-editorial text-ink">
                The GIBS campus
              </h1>
            </Reveal>
            <Reveal delay={0.12} y={16}>
              <p className="mt-6 max-w-prose type-body">
                Photographs of GIBS headquarters architecture, classroom, reception and guest residence, and the Ibafo facility.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-10 h-px w-full bg-line" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[var(--sticky-top)] z-[var(--z-sticky-panel)] border-y border-line bg-white/95 backdrop-blur-md">
        <div className="container-x flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`chip shrink-0 whitespace-nowrap ${activeCategory === cat ? "border-forest-600 bg-forest-600 text-ivory" : "border-ink/20 text-ink/70 hover:border-forest-600 hover:text-forest-700"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Editorial image layouts */}
      <section className="bg-white">
        <div className="container-x band-y">
          {/* Sophisticated editorial layouts: mix of full-bleed, two-col, asymmetrical */}
          <div className="grid gap-6 sm:gap-8">
            {/* Feature: full-bleed architecture */}
            {filtered.length > 0 && (
              <Reveal>
                <button
                  type="button"
                  onClick={() => openLightbox(0)}
                  aria-label={`View ${filtered[0].title} — opens in lightbox`}
                  className="group relative block w-full overflow-hidden text-left"
                >
                  <GalleryFrame item={filtered[0]} className={filtered[0].aspect} loading="eager" sizes="(min-width: 1024px) 50vw, 100vw" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent p-6 sm:p-8">
                    <p className="eyebrow-light">{filtered[0].category}</p>
                    <h2 className="type-h3 mt-2 text-ivory">{filtered[0].title}</h2>
                    <p className="mt-1 max-w-xl text-[13px] text-ivory/80">{filtered[0].caption}</p>
                  </div>
                </button>
              </Reveal>
            )}

            {/* Two-column: classrooms + facilities */}
            {filtered.length > 1 && (
              <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                {filtered.slice(1, 3).map((item, i) => (
                  <Reveal key={item.id} delay={i * 0.06}>
                    <button type="button" onClick={() => openLightbox(1 + i)} aria-label={`View ${item.title} — opens in lightbox`} className="group block w-full text-left">
                      <GalleryFrame item={item} />
                      <div className="mt-4">
                        <p className="eyebrow text-forest-600">{item.category}</p>
                        <h3 className="display-serif mt-1 text-lg text-ink">{item.title}</h3>
                        <p className="mt-1 text-[13px] text-muted">{item.caption}</p>
                      </div>
                    </button>
                  </Reveal>
                ))}
              </div>
            )}

            {/* Asymmetrical: large + stacked */}
            {filtered.length > 3 && (
              <div className="grid gap-6 sm:gap-8 lg:grid-cols-12">
                <Reveal className="lg:col-span-7">
                  <button type="button" onClick={() => openLightbox(3)} className="group block w-full text-left">
                    <GalleryFrame item={filtered[3]} className={`${filtered[3].aspect} lg:aspect-[4/3]`} sizes="(min-width: 1024px) 55vw, 100vw" />
                    <div className="mt-4">
                      <p className="eyebrow text-forest-600">{filtered[3].category}</p>
                      <h3 className="display-serif mt-1 text-lg text-ink">{filtered[3].title}</h3>
                      <p className="mt-1 text-[13px] text-muted">{filtered[3].caption}</p>
                    </div>
                  </button>
                </Reveal>
                <div className="grid gap-6 lg:col-span-5">
                  {filtered.slice(4, 6).map((item, i) => (
                    <Reveal key={item.id} delay={i * 0.06}>
                      <button type="button" onClick={() => openLightbox(4 + i)} aria-label={`View ${item.title} — opens in lightbox`} className="group block w-full text-left">
                        <GalleryFrame item={item} sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw" />
                        <div className="mt-3">
                          <p className="eyebrow text-forest-600">{item.category}</p>
                          <h3 className="display-serif mt-1 text-base text-ink">{item.title}</h3>
                        </div>
                      </button>
                    </Reveal>
                  ))}
                </div>
              </div>
            )}

            {/* Remaining items: masonry-like but editorial */}
            {filtered.length > 6 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
                {filtered.slice(6).map((item, i) => (
                  <Reveal key={item.id} delay={i * 0.05}>
                    <button type="button" onClick={() => openLightbox(6 + i)} className="group block w-full text-left">
                      <GalleryFrame item={item} />
                      <div className="mt-4">
                        <p className="eyebrow text-forest-600">{item.category}</p>
                        <h3 className="display-serif mt-1 text-lg text-ink">{item.title}</h3>
                        <p className="mt-1 text-[13px] text-muted">{item.caption}</p>
                      </div>
                    </button>
                  </Reveal>
                ))}
              </div>
            )}
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-muted">No images in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox items={filtered} index={lightboxIndex} onClose={closeLightbox} onPrev={prev} onNext={next} />
      )}
    </>
  );
}
