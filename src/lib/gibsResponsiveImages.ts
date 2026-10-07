const APPROVED_GIBS_IMAGES: Record<string, { width: number; height: number }> = {
  "/images/gibs-hero-branded.webp": { width: 1050, height: 750 },
  "/images/gibs-hq-architecture-edited-branded.webp": { width: 1484, height: 1060 },
  "/images/gibs-hq-guest-residence-branded.webp": { width: 1484, height: 1060 },
  "/images/gibs-hq-classroom-branded.webp": { width: 1484, height: 1060 },
  "/images/gibs-hq-reception-room-branded.webp": { width: 1485, height: 1059 },
  "/images/gibs-ibafo-architecture-branded.webp": { width: 1485, height: 1059 },
  "/images/gibs-ibafo-front-gate-branded.webp": { width: 1672, height: 941 },
};

export function gibsResponsiveImage(src: string) {
  const dimensions = APPROVED_GIBS_IMAGES[src];
  if (!dimensions) return { src };

  return {
    src,
    srcSet: `${src.replace(/\.webp$/, "-640.webp")} 640w, ${src} ${dimensions.width}w`,
    width: dimensions.width,
    height: dimensions.height,
  };
}
