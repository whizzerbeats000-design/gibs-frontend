import { useEffect, useState } from "react";
import { Link } from "../lib/router";
import { cn } from "../utils/cn";
import { ArrowUpRight } from "./icons";

export type ProgrammeSection = {
  id: string;
  label: string;
};

/**
 * Sticky in-page programme navigation.
 * Desktop: horizontal hairline bar with scroll-spy.
 * Mobile: compact native selector that jumps to the chosen section.
 */
export function ProgrammeNav({ sections }: { sections: ProgrammeSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-150px 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const sticky = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--sticky-top") || "72",
      10
    );
    const offset = (Number.isNaN(sticky) ? 72 : sticky) + 64;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setActive(id);
    // Move focus to the target section so keyboard/screen-reader users
    // land in the right place after using the select control.
    // tabIndex={-1} makes non-focusable elements programmably focusable
    // without inserting them into the natural tab order.
    const focusTarget = el.querySelector<HTMLElement>("h2, h3, [tabindex]") ?? el;
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    window.setTimeout(() => {
      focusTarget.focus({ preventScroll: true });
    }, 350); // wait for smooth scroll to settle
  };

  return (
    <div className="sticky z-30 border-b border-line bg-paper/92 backdrop-blur-md" style={{ top: "var(--sticky-top, 72px)" }}>
      <div className="container-x flex items-center gap-4 py-3 xl:pt-3">
        {/* Mobile / tablet compact selector */}
        <div className="flex w-full items-center gap-3 lg:hidden">
          <label htmlFor="programme-section-select" className="sr-only">
            Jump to a programme section
          </label>
          <select
            id="programme-section-select"
            value={active}
            onChange={(e) => go(e.target.value)}
            className="w-full appearance-none rounded-panel border border-ink/20 bg-white px-4 py-3 text-sm font-bold text-ink focus:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
          >
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <Link to="/admissions" className="btn btn-primary btn-md shrink-0">
            Apply
          </Link>
        </div>

        {/* Desktop scroll-spy navigation */}
        <nav aria-label="Programme sections" className="hidden w-full items-center justify-between gap-6 lg:flex">
          <ul className="flex items-center gap-1 overflow-x-auto">
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => go(s.id)}
                  aria-current={active === s.id ? "true" : undefined}
                  className={cn(
                    "relative whitespace-nowrap px-3.5 py-2 text-[12.5px] font-bold uppercase tracking-[0.12em] transition-colors duration-200",
                    active === s.id ? "text-forest-700" : "text-muted hover:text-ink"
                  )}
                >
                  {s.label}
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-[1px] h-[2px] bg-gold-500 transition-transform duration-300",
                      active === s.id ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex shrink-0 items-center gap-3">
            <Link to="/concierge" className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-forest-700 hover:underline">
              Ask the Concierge
            </Link>
            <Link to="/admissions" className="btn btn-primary btn-md">
              Apply Now
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
