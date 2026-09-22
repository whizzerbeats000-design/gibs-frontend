type LogoProps = {
  className?: string;
  title?: string;
  /** Accepted for call-site compatibility; the official logo carries its own
   *  wordmark, so no variant is drawn. */
  compact?: boolean;
};

/**
 * GIBS official logo — served from /images/gibs-logo.png. Replaces the
 * hand-drawn SVG seal. Kept as a component so call sites (header, footer,
 * error boundary) share one surface. object-contain preserves the logo's
 * aspect ratio inside whichever box a call site supplies.
 */
export function HexMark({
  className = "h-11 w-11",
  title = "GIBS — Goshen International Business School",
}: LogoProps) {
  return (
    <img
      src="/images/gibs-logo.png"
      alt={title}
      width={1310}
      height={1200}
      className={`${className} object-contain`}
    />
  );
}