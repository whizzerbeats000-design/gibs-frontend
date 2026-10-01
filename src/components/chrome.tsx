import {
  Component,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, navigate, useRoute } from "../lib/router";
import { useBodyScrollLock, useEscape, useFocusTrap } from "../lib/hooks";
import { HexMark } from "./Logo";
import { MenuIcon, CloseIcon, SearchIcon, ChatIcon, ArrowUpRight } from "./icons";
import { NAV_LINKS, NAV_SECONDARY } from "../lib/data";
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
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--z-skip)] focus:rounded-panel focus:bg-forest-600 focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-ivory"
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

/* ---------------- Desktop Explore disclosure ---------------- */

/**
 * Carries NAV_SECONDARY in the header at >= lg.
 *
 * A disclosure rather than a permanent second row: the primary bar keeps its
 * single-line rhythm, and the six secondary destinations stay one click away
 * instead of being dropped. Follows the WAI-ARIA disclosure pattern —
 * aria-expanded on the trigger, Escape and outside-click to dismiss, focus
 * returned to the trigger on Escape.
 */
function DesktopExplore({
  path,
  isActive,
}: {
  path: string;
  isActive: (to: string) => boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEscape(open, () => {
    setOpen(false);
    triggerRef.current?.focus();
  });

  useEffect(() => {
    if (!open) return;
    const onDown = (e: globalThis.MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !wrapRef.current) return;
      const focusable = wrapRef.current.querySelectorAll<HTMLElement>("a[href]");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      // Wrap focus inside the panel so tabbing never escapes into the page
      // behind an open menu.
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Navigating should never leave the panel hanging open.
  useEffect(() => {
    setOpen(false);
  }, [path]);

  const anyActive = NAV_SECONDARY.some((l) => isActive(l.to));

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="nav-explore"
        className={cn(
          "relative flex items-center gap-1.5 py-2 text-[13.5px] font-semibold tracking-[-0.01em] transition-colors duration-200",
          anyActive || open ? "text-forest-700" : "text-ink/75 hover:text-forest-700"
        )}
      >
        Explore
        <span
          aria-hidden="true"
          className={cn(
            "text-[9px] leading-none transition-transform duration-300",
            open ? "rotate-180" : ""
          )}
        >
          ▼
        </span>
        <span
          className={cn(
            "absolute inset-x-0 -bottom-0.5 h-[2px] origin-left bg-gold-500 transition-transform duration-300",
            anyActive ? "scale-x-100" : "scale-x-0"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="nav-explore"
            key="panel"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24, ease: EASE }}
            className="absolute right-0 top-[calc(100%+10px)] z-50 w-[420px] border border-line bg-ivory shadow-[0_24px_60px_-30px_rgba(0,32,9,0.5)]"
          >
            <ul className="divide-y divide-ink/8">
              {NAV_SECONDARY.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(link.to) ? "page" : undefined}
                    className="group flex min-h-[56px] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-forest-50"
                  >
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block text-[14.5px] font-semibold transition-colors group-hover:text-forest-700",
                          isActive(link.to) ? "text-forest-700" : "text-ink"
                        )}
                      >
                        {link.label}
                      </span>
                      <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">
                        {link.note}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-ink/45 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-forest-600"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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
      <div className="container-x flex h-[var(--header-height)] min-w-0 items-center justify-between gap-4">
        <Link to="/" className="flex min-w-0 shrink-0 items-center gap-3" aria-label="GIBS home">
          <HexMark compact className="h-11 w-11 shrink-0" />
          <span className="hidden leading-tight xl:block">
            <span className="block font-serif text-[14px] font-semibold tracking-wide text-forest-900">
              Goshen International
            </span>
            <span className="block eyebrow text-forest-600">
              Business School
            </span>
          </span>
        </Link>

        {/* Desktop nav — primary bar plus an Explore disclosure carrying
            NAV_SECONDARY, so no public section is lost at wider breakpoints. */}
        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex xl:gap-7">
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
          <DesktopExplore path={path} isActive={isActive} />
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
            aria-label="Open GIBS AI"
            className="hidden items-center gap-2 rounded-pill border border-forest-700/25 px-4 py-2.5 text-[13px] font-bold text-forest-700 transition-colors hover:border-forest-600 hover:bg-forest-50 xl:inline-flex"
          >
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-500" />
            </span>
            GIBS AI
          </button>
          <Link to="/admissions" className="btn btn-primary btn-md hidden lg:inline-flex">
            Subscribe
          </Link>
          <Link to="/admissions" className="btn btn-primary btn-sm lg:hidden">
            Subscribe
          </Link>
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="flex h-11 w-11 items-center justify-center rounded-pill border border-forest-700/25 text-forest-800 transition-colors hover:border-forest-600 hover:bg-forest-600 hover:text-ivory lg:hidden"
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

const MOBILE_PRIMARY = NAV_LINKS.map((l) =>
  l.to === "/programmes" ? { ...l, label: "All Programmes" } : l
);
// Subscription already has its own "Subscribe to a Programme" button at the
// foot of the sheet, so it is dropped from the secondary list to avoid showing
// the same destination twice.
const MOBILE_SECONDARY = NAV_SECONDARY.filter((l) => l.to !== "/admissions").map(
  ({ label, to }) => ({ label, to })
);

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

  // Rotating a tablet or resizing a narrow window past the `lg` breakpoint
  // swaps the burger for the desktop bar, so the sheet must leave with it —
  // otherwise it lingers as a full-screen modal over a layout it cannot close.
  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    if (desktop.matches) {
      onClose();
      return;
    }
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) onClose();
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, [open, onClose]);

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
                <p className="eyebrow text-forest-600">
                  GIBS / Navigation
                </p>
                <h2 className="mt-6 font-baskerville text-[38px] leading-[0.95] tracking-[-0.02em] text-ink">
                  Explore
                  <br />
                  <em className="italic text-forest-600">Goshen.</em>
                </h2>
                <p className="mt-5 max-w-md text-[14px] leading-[1.55] text-muted">
                  Explore the 2026 Training Calendar of 113 Local and 22 Foreign
                  Executive Programmes, campuses in Ilorin, Abuja & Ibafo, or ask
                  GIBS AI to guide you.
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
                    GIBS AI
                  </button>
                </div>
              </div>

              <nav className="border-t rule lg:col-span-7" aria-label="Mobile primary">
                <ul>
                  {MOBILE_PRIMARY.map((link, i) => (
                    <motion.li
                      key={link.to}
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

                <p className="mt-8 meta">
                  More from GIBS
                </p>
                <ul className="mt-3">
                  {MOBILE_SECONDARY.map((link, i) => (
                    <motion.li
                      key={link.to}
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
                        <span
                          className={cn(
                            "text-[15px] font-bold text-ink/75 transition-colors group-hover:text-forest-700",
                            isActiveRoute(link.to, routePath) && "text-forest-700"
                          )}
                        >
                          {link.label}
                        </span>
                        <ArrowUpRight className="ml-auto h-4 w-4 text-ink/60 transition-all group-hover:text-forest-600" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <Link to="/admissions" onClick={onClose} className="btn btn-primary btn-lg mt-8 w-full">
                  Subscribe to a Programme
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </nav>
            </div>

            <div className="mt-12 border-t rule pt-6">
              <p className="meta">Goshen International Business School Limited · RC 1178333</p>
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
    title: "Programmes",
    links: [
      { label: "2026 Training Calendar", to: "/programmes" },
      { label: "Foreign Training Hubs", to: "/executive-education" },
      { label: "In-Plant Workshops", to: "/executive-education" },
      { label: "Programme Subscription", to: "/admissions" },
    ],
  },
  {
    title: "Institution",
    links: [
      { label: "About GIBS", to: "/about" },
      { label: "Governance & Faculty", to: "/faculty" },
      { label: "Research & Insights", to: "/research-insights" },
      { label: "Campuses & Facilities", to: "/campus" },
      { label: "Campus Gallery", to: "/gallery" },
      { label: "Conferences & Events", to: "/events" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact Registry", to: "/contact" },
      { label: "GIBS AI", to: "/concierge" },
      { label: "Ilorin Headquarters", to: "/campus" },
      { label: "Abuja Center", to: "/campus" },
      { label: "Ibafo Center", to: "/campus" },
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
    window.setTimeout(() => {
      setStatus("success");
    }, 600);
  };

  if (status === "success") {
    return (
      <div className="mt-9 max-w-md border-l-2 border-gold-400 pl-4">
        <p className="eyebrow-light">Thank you.</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ivory/70">
          This site does not send the address you entered anywhere. To join the executive calendar mailing list, email the registry at{" "}
          <a href="mailto:gibsilorin@gmail.com" className="text-gold-300 underline underline-offset-2">
            gibsilorin@gmail.com
          </a>{" "}
          and ask to be added.
        </p>
      </div>
    );
  }

  return (
    <form
      className="mt-9 max-w-md"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Register interest in GIBS Executive Calendar Updates"
    >
      <label htmlFor="footer-email" className="eyebrow-light">
        GIBS Executive Bulletin & Calendar Updates
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
          placeholder="Your official email address"
          aria-invalid={validationError ? "true" : undefined}
          aria-describedby={validationError ? "footer-email-error" : undefined}
          className="h-11 w-full bg-transparent text-base text-ivory placeholder:text-ivory/55 focus:outline-none sm:text-sm"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          aria-label="Subscribe"
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
      <div className="container-x band-y">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-panel bg-ivory p-1.5 shadow-lift">
                <HexMark compact className="h-full w-full" />
              </span>
              <div className="leading-tight">
                <p className="fraunces font-semibold text-base text-ivory">Goshen International</p>
                <p className="eyebrow-light">
                  Business School
                </p>
              </div>
            </div>
            <p className="mt-5 text-[13px] font-serif italic text-gold-300">
              “Take advantage of us, so that no one takes advantage of you”
            </p>
            <p className="mt-4 max-w-sm type-body text-ivory/85">
              An outfit committed to manpower development and capacity-building.
            </p>
            <div className="mt-5 space-y-1.5 text-[12px] leading-relaxed text-ivory/75">
              <p className="font-semibold text-ivory">Headquarters (Ilorin):</p>
              <p>No 81, Olorunsogo Street, Off Agbabiaka Road, Upper Gaa - Akanbi, Ilorin, Kwara State</p>
              <p className="pt-1"><span className="text-gold-300">Emails:</span> gibsilorin@gmail.com · goshenibs22@gmail.com</p>
              <p><span className="text-gold-300">Phones:</span> 08160010401 · 08033429427 · 08186464474</p>
              <p><span className="text-gold-300">Postal:</span> P.O. Box 63, Ilorin General Post Office, Kwara State</p>
              <p><span className="text-gold-300">Web:</span> www.gibs.com.ng</p>
            </div>
            <Newsletter />
          </div>

          <div className="grid grid-cols-1 gap-10 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:col-span-7 lg:pl-10">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="eyebrow-light">
                  {col.title}
                </p>
                <ul className="mt-5 space-y-3.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="group inline-flex min-h-[44px] items-center gap-1.5 py-2.5 text-[14px] text-ivory/65 transition-colors hover:text-ivory"
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

        <div className="mt-10 flex flex-col gap-4 text-[11px] font-medium uppercase tracking-[0.12em] text-ivory/60 sm:flex-row sm:items-center sm:justify-between sm:text-[12px]">
          <p>© {new Date().getFullYear()} Goshen International Business School Limited (RC 1178333)</p>
          <p className="text-ivory/60">
            Accreditations: CAC · CMD · ITF Compliant · NSTIF
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-2 border-t rule-light pt-6 text-[11px] text-ivory/60 sm:flex-row sm:items-center sm:justify-between">
          <p>Technical Academic Partner: Pacific Institute of Technology, Georgia, USA</p>
          <p>Overseas Hubs: Kigali · Dubai · London · Houston · Miami · Cape Town · Durban · Ghana</p>
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
