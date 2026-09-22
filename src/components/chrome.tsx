import { Component, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, navigate, useRoute } from "../lib/router";
import { useBodyScrollLock, useEscape, useFocusTrap } from "../lib/hooks";
import { HexMark } from "./Logo";
import { MenuIcon, CloseIcon, SearchIcon, ChatIcon, ArrowUpRight } from "./icons";
import { MeridianRule } from "./ui";
import { NAV_LINKS } from "../lib/data";
import { EASE } from "./motion";
import { cn } from "../utils/cn";

/* ---------------- Skip link ---------------- */

export function SkipLink() {
  return (
    <a
      href="#main"
      onClick={(e) => {
        e.preventDefault();
        const main = document.getElementById("main");
        main?.focus();
        main?.scrollIntoView();
      }}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-panel focus:bg-forest-600 focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-ivory"
    >
      Skip to content
    </a>
  );
}

/* ---------------- Header ---------------- */

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
}

export function Header({
  menuOpen,
  onOpenMenu,
  onOpenSearch,
  onOpenConcierge,
}: {
  menuOpen: boolean;
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  onOpenConcierge: () => void;
}) {
  const scrolled = useScrolled();
  const { path } = useRoute();

  const isActive = (to: string) =>
    to === "/" ? path === "/" : path === to || path.startsWith(to + "/");

  return (
    <header className="fixed inset-x-0 top-0 z-[var(--z-header)]">
      {/* Primary bar — the single sanctioned glass treatment */}
      <div
        className={cn(
          "border-b transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled
            ? "border-ink/10 bg-ivory/90 shadow-[0_2px_20px_-14px_rgba(0,32,9,0.4)] backdrop-blur-xl"
            : "border-transparent bg-ivory/72 backdrop-blur-md"
        )}
      >
      <div className="container-x flex h-[72px] min-w-0 items-center justify-between gap-4">
        <Link to="/" className="flex min-w-0 shrink-0 items-center gap-3" aria-label="GIBS home">
          <HexMark compact className="h-11 w-11 shrink-0" />
          <span className="hidden leading-tight lg:block">
            <span className="block font-serif text-[14px] font-semibold tracking-wide text-forest-900">
              Goshen International
            </span>
            <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-forest-600">
              Business School
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-7 xl:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              aria-current={isActive(link.to) ? "page" : undefined}
              className={cn(
                "relative py-2 text-[13.5px] font-semibold tracking-[-0.01em] transition-colors duration-200",
                isActive(link.to) ? "text-forest-700" : "text-ink/75 hover:text-forest-700"
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute inset-x-0 -bottom-0.5 h-[2px] origin-left bg-gold-500 transition-transform duration-300",
                  isActive(link.to) ? "scale-x-100" : "scale-x-0"
                )}
              />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search GIBS"
            className="flex h-11 w-11 items-center justify-center rounded-pill text-forest-800 transition-colors hover:bg-forest-50"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onOpenConcierge}
            className="hidden items-center gap-2 rounded-pill border border-forest-700/25 px-4 py-2.5 text-[13px] font-bold text-forest-700 transition-colors hover:border-forest-600 hover:bg-forest-50 md:inline-flex"
          >
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-500" />
            </span>
            Concierge
          </button>
          <Link to="/admissions" className="btn btn-primary btn-md hidden xl:inline-flex">
            Apply Now
          </Link>
          <Link to="/admissions" className="btn btn-primary btn-sm xl:hidden">
            Apply
          </Link>
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="flex h-11 w-11 items-center justify-center rounded-pill border border-forest-700/25 text-forest-800 transition-colors hover:border-forest-600 hover:bg-forest-600 hover:text-ivory xl:hidden"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      </div>
    </header>
  );
}

/* ---------------- Mobile / tablet navigation ---------------- */

const MOBILE_PRIMARY = [
  { n: "01", label: "Programmes", to: "/programmes" },
  { n: "02", label: "Executive Education", to: "/executive-education" },
  { n: "03", label: "Faculty & Research", to: "/faculty" },
  { n: "04", label: "About GIBS", to: "/about" },
  { n: "05", label: "Admissions", to: "/admissions" },
];
const MOBILE_SECONDARY = [
  { n: "06", label: "News & Insights", to: "/research-insights" },
  { n: "07", label: "Events", to: "/events" },
  { n: "08", label: "Campus Life", to: "/campus" },
  { n: "09", label: "Gallery", to: "/gallery" },
  { n: "10", label: "Contact", to: "/contact" },
];

function isActiveRoute(to: string, path: string) {
  return path === to || path.startsWith(to + "/");
}

export function MobileNav({
  open,
  onClose,
  onOpenSearch,
  onOpenConcierge,
}: {
  open: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  onOpenConcierge: () => void;
}) {
  useBodyScrollLock(open);
  useEscape(open, onClose);
  const ref = useFocusTrap<HTMLDivElement>(open);
  const { path: routePath } = useRoute();

  // Reopening the sheet always starts from the top of the list.
  useEffect(() => {
    if (!open) return;
    const node = document.getElementById("mobile-navigation");
    if (node) node.scrollTop = 0;
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="mobile-nav-sheet paper-grain overflow-y-auto overscroll-contain bg-paper z-[var(--z-nav)]"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <div className="container-x flex min-h-full flex-col pb-10 pt-[92px]">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="fixed right-5 top-[18px] z-10 flex h-[52px] w-[52px] items-center justify-center rounded-pill bg-stone text-ink transition-colors hover:bg-forest-600 hover:text-ivory"
            >
              <CloseIcon className="h-5 w-5" />
            </button>

            <div className="grid flex-1 gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-forest-600">
                  GIBS / Navigation
                </p>
                <h2 className="mt-6 font-baskerville text-[38px] leading-[0.95] tracking-[-0.02em] text-ink">
                  Explore
                  <br />
                  <em className="italic text-forest-600">Goshen.</em>
                </h2>
                <p className="mt-5 max-w-md text-[14px] leading-[1.55] text-muted">
                  Move through the institution, programmes, campus and admissions,
                  or ask the Concierge to guide you.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSearch();
                    }}
                    className="inline-flex items-center gap-2.5 rounded-full border border-ink/20 px-5 py-3 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-forest-600 hover:text-ivory"
                  >
                    <SearchIcon className="h-4 w-4" />
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenConcierge();
                    }}
                    className="inline-flex items-center gap-2.5 rounded-full border border-ink/20 px-5 py-3 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-forest-600 hover:text-ivory"
                  >
                    <ChatIcon className="h-4 w-4" />
                    Concierge
                  </button>
                </div>
              </div>

              <nav className="border-t rule lg:col-span-7" aria-label="Mobile primary">
                <ul>
                  {MOBILE_PRIMARY.map((link, i) => (
                    <motion.li
                      key={link.n}
                      className="border-b rule"
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, ease: EASE, delay: 0.12 + i * 0.05 }}
                    >
                      <Link
                        to={link.to}
                        onClick={onClose}
                        aria-current={isActiveRoute(link.to, routePath) ? "page" : undefined}
                        className="group flex items-center gap-5 py-5 sm:gap-8 sm:py-6"
                      >
                        <span className="w-[30px] shrink-0 text-[11px] font-bold tracking-[0.16em] text-forest-600">
                          {link.n}
                        </span>
                        <span
                          className={cn(
                            "font-baskerville text-[27px] leading-none tracking-[-0.01em] text-ink transition-transform duration-300 group-hover:translate-x-2",
                            isActiveRoute(link.to, routePath) && "text-forest-700"
                          )}
                        >
                          {link.label}
                        </span>
                        <ArrowUpRight className="ml-auto h-5 w-5 text-ink/60 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-forest-600" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                  More from GIBS
                </p>
                <ul className="mt-3">
                  {MOBILE_SECONDARY.map((link, i) => (
                    <motion.li
                      key={link.n}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE, delay: 0.4 + i * 0.05 }}
                    >
                      <Link
                        to={link.to}
                        onClick={onClose}
                        aria-current={isActiveRoute(link.to, routePath) ? "page" : undefined}
                        className="group -mx-2 flex items-center gap-4 rounded-panel px-2 py-3"
                      >
                        <span className="text-[11px] font-bold tracking-[0.16em] text-forest-600">
                          {link.n}
                        </span>
                        <span
                          className={cn(
                            "text-[15px] font-bold text-ink/75 transition-colors group-hover:text-forest-700",
                            isActiveRoute(link.to, routePath) && "text-forest-700"
                          )}
                        >
                          {link.label}
                        </span>
                        <ArrowUpRight className="ml-auto h-4 w-4 text-ink/40 transition-all group-hover:text-forest-600" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <Link to="/admissions" onClick={onClose} className="btn btn-primary btn-lg mt-8 w-full">
                  Apply Now
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </nav>
            </div>

            <div className="mt-12 border-t rule pt-6">
              <p className="meta">Goshen International Business School</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Footer ---------------- */

const FOOTER_COLUMNS = [
  {
    title: "Study",
    links: [
      { label: "Programmes", to: "/programmes" },
      { label: "MBA", to: "/programmes/mba" },
      { label: "Executive MBA", to: "/programmes/executive-mba" },
      { label: "Executive Education", to: "/executive-education" },
      { label: "Admissions", to: "/admissions" },
    ],
  },
  {
    title: "Institution",
    links: [
      { label: "About GIBS", to: "/about" },
      { label: "Faculty & Research", to: "/faculty" },
      { label: "Research & Insights", to: "/research-insights" },
      { label: "Campus", to: "/campus" },
      { label: "Gallery", to: "/gallery" },
      { label: "Events", to: "/events" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact", to: "/contact" },
      { label: "GIBS Concierge", to: "/concierge" },
      { label: "Custom programmes", to: "/programmes/custom-programmes" },
      { label: "Visit the campus", to: "/campus" },
    ],
  },
];

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [validationError, setValidationError] = useState("");

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setValidationError("Please enter a valid email address.");
      return;
    }
    setValidationError("");
    setStatus("submitting");
    /*
     * FRONTEND PROTOTYPE — newsletter service not yet connected.
     * Replace the timeout below with a POST to the mailing-list provider
     * when the backend integration phase begins.
     */
    window.setTimeout(() => {
      // Simulate a successful registration intent (no data sent yet)
      setStatus("success");
    }, 600);
  };

  if (status === "success") {
    return (
      <div className="mt-9 max-w-md border-l-2 border-gold-400 pl-4">
        <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-gold-300">Noted.</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ivory/70">
          Your interest is recorded. You will be among the first to receive the
          GIBS Brief once the newsletter service launches.
        </p>
      </div>
    );
  }

  return (
    <form
      className="mt-9 max-w-md"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Register interest in the GIBS Brief"
    >
      <label htmlFor="footer-email" className="eyebrow-light">
        The GIBS Brief, monthly
      </label>
      <div className="mt-3 flex items-center gap-3 border-b border-ivory/25 pb-3 transition-colors focus-within:border-gold-300">
        <input
          id="footer-email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (validationError) setValidationError("");
            if (status === "error") setStatus("idle");
          }}
          placeholder="Your email address"
          aria-invalid={validationError ? "true" : undefined}
          aria-describedby={validationError ? "footer-email-error" : undefined}
          className="h-11 w-full bg-transparent text-base text-ivory placeholder:text-ivory/55 focus:outline-none sm:text-sm"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          aria-label="Register interest"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-gold-300 text-forest-950 transition-colors hover:bg-gold-400 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-gold-300"
        >
          {status === "submitting" ? (
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-forest-950/30 border-t-forest-950"
              aria-hidden="true"
            />
          ) : (
            <ArrowUpRight className="h-4 w-4" />
          )}
        </button>
      </div>
      {validationError && (
        <p id="footer-email-error" role="alert" className="mt-2 text-[12px] text-gold-300">
          {validationError}
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="mt-2 text-[12px] text-gold-300">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}

export function GlobalFooter() {
  return (
    <footer className="relative border-t-2 border-gold-500/30 bg-forest-950 text-ivory">
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden sm:block">
        <div className="container-x py-0">
          <MeridianRule light at="86%" />
        </div>
      </div>
      <div className="container-x py-20 sm:py-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-panel bg-ivory p-1.5 shadow-lift">
                <HexMark compact className="h-full w-full" />
              </span>
              <div className="leading-tight">
                <p className="fraunces font-semibold text-base text-ivory">Goshen International</p>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold-300">
                  Business School
                </p>
              </div>
            </div>
            <p className="mt-7 max-w-sm type-body text-ivory/85">
              An international business school of scholarship and practice, for
              the leaders and institutions of the Global Africa.
            </p>
            <p className="mt-5 text-[11.5px] leading-relaxed text-ivory/60">
              Institutional address and contact details: to be published
            </p>
            <Newsletter />
          </div>

          <div className="grid grid-cols-1 gap-10 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:col-span-7 lg:pl-10">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold-300">
                  {col.title}
                </p>
                <ul className="mt-5 space-y-3.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="group inline-flex items-center gap-1.5 text-[14px] text-ivory/65 transition-colors hover:text-ivory"
                      >
                        <span className="h-px w-0 bg-gold-300 transition-all duration-300 group-hover:w-4" />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 select-none overflow-hidden border-t rule-light pt-10">
          <p className="display-serif type-extrude-ink bg-[linear-gradient(180deg,rgba(245,245,240,0.16),rgba(245,245,240,0.03))] bg-clip-text text-[clamp(4.5rem,17vw,15rem)] leading-[0.85] text-transparent">
            GIBS
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 text-[11px] uppercase tracking-[0.16em] text-ivory/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Goshen International Business School</p>
          <p className="text-ivory/60" title="Official social channels to be confirmed">
            LinkedIn · Instagram · YouTube, channels to be confirmed
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-2 border-t rule-light pt-6 text-[11px] text-ivory/60 sm:flex-row sm:items-center sm:justify-between">
          <p>Privacy policy · Terms of use · Accessibility statement. Documents pending publication.</p>
          <p>All institutional facts remain subject to official GIBS confirmation.</p>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Error boundary ---------------- */

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Surfaced for operators; no third-party telemetry is shipped.
    console.error("GIBS runtime error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-paper px-6">
          <div className="max-w-md text-center">
            <HexMark compact className="mx-auto h-16 w-16" />
            <h1 className="display-serif mt-6 text-3xl text-ink">The page encountered a problem</h1>
            <p className="mt-4 type-body text-muted">
              An unexpected error interrupted this page. You can return to the
              homepage or retry. Nothing you entered elsewhere has been lost
              from your browser.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => this.setState({ hasError: false })}
                className="btn btn-outline-ink btn-md"
              >
                Try again
              </button>
              <button type="button" onClick={() => navigate("/")} className="btn btn-primary btn-md">
                Return home
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
