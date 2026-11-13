import { syncRouteMetadata } from "./seoMetadata";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type MouseEvent,
  type Ref,
} from "react";

/*
 * Minimal dependency-free hash router.
 * Hash routing keeps in-app navigation independent of server rewrites;
 * clean entry paths are adopted from the generated SEO shells on load.
 */

export type RouteState = {
  path: string;
  query: URLSearchParams;
};

/*
 * ENTRY-PATH ADOPTION
 * -------------------
 * Vercel serves generated HTML shells for valid clean paths as well as "/",
 * so https://host/programmes returns a fully working page. Previously an
 * empty hash was forced to "#/", which meant a shared clean URL silently
 * rendered the homepage with nothing to indicate that the route was lost.
 *
 * Now the served path is adopted as the route when there is no hash, and
 * mirrored back into the fragment with replaceState. Two properties matter:
 *
 *   1. replaceState REPLACES the current history entry instead of pushing a
 *      new one, so Back/Forward are unaffected by the adoption.
 *   2. The hash remains the single source of truth. Every in-site link still
 *      emits "#/…", so this is a one-time normalisation at entry, not a second
 *      routing system.
 *
 * Because the adopted path is folded into the fragment and the pathname is
 * reset to "/", every reachable URL has the same shape ("/#/route"), which is
 * what the canonical/og:url strategy in index.html assumes.
 *
 * Unknown-route behavior differs by URL form. An unknown hash route (for
 * example, /#/not-a-page) reaches the client router and renders NotFound. An
 * unknown clean path currently receives Vercel's platform-level HTTP 404 before
 * this app runs, so the client router cannot replace that response. Preserve
 * this observed distinction; do not assume unknown clean paths reach the SPA.
 */

// Paths that are the served document itself rather than a route. A direct hit
// on /index.html must not be mistaken for a route called "index.html".
const DOCUMENT_PATHS = new Set(["/", "/index.html", "/index.htm", "/index.php"]);

function normalizePath(raw: string): string {
  if (DOCUMENT_PATHS.has(raw.toLowerCase())) return "/";
  const trimmed = raw.replace(/\/+$/, "");
  return trimmed || "/";
}

/**
 * Can `window.location.pathname` be trusted as a route?
 *
 * Only over http(s). Vite emits separate root-relative assets, so opening the
 * production artifact under file:// is not a supported deployment mode. This
 * guard also prevents a local filesystem path from being mistaken for a
 * client route.
 */
function canAdoptPathname(): boolean {
  return (
    typeof window !== "undefined" &&
    window.location.protocol !== "file:" &&
    !DOCUMENT_PATHS.has(window.location.pathname.toLowerCase())
  );
}

function readRoute(): RouteState {
  const raw = window.location.hash.replace(/^#/, "");

  if (!raw && canAdoptPathname()) {
    const [pathPart, qs] = `${window.location.pathname}${window.location.search}`.split("?");
    const path = normalizePath(pathPart ?? "/");
    window.history.replaceState(null, "", `/#${path}${qs ? `?${qs}` : ""}`);
    return { path, query: new URLSearchParams(qs ?? "") };
  }

  const [pathPart, qs] = raw.split("?");
  return {
    path: normalizePath(pathPart ?? "/"),
    query: new URLSearchParams(qs ?? ""),
  };
}

const RouterContext = createContext<RouteState>({ path: "/", query: new URLSearchParams() });

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<RouteState>(() =>
    typeof window === "undefined" ? { path: "/", query: new URLSearchParams() } : readRoute()
  );

  useEffect(() => {
    const onChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", onChange);
    // Adopt the served path on first paint for deep links that arrive without
    // a fragment. readRoute() has already mirrored it into the hash by the
    // time this effect runs, so there is nothing to rewrite here.
    if (!window.location.hash) setRoute(readRoute());
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return <RouterContext.Provider value={route}>{children}</RouterContext.Provider>;
}

export function useRoute() {
  return useContext(RouterContext);
}

export function navigate(to: string) {
  const target = to.startsWith("#") ? to : `#${to}`;
  if (window.location.hash === target) {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  } else {
    window.location.hash = target;
  }
}

export function hrefFor(to: string) {
  return to.startsWith("#") ? to : `#${to}`;
}

type LinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  ref?: Ref<HTMLAnchorElement>;
  "aria-label"?: string;
  "aria-current"?: boolean | "page";
};

export function Link({ to, children, className, onClick, ref, ...rest }: LinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onClick?.();
    navigate(to);
  };
  return (
    <a ref={ref} href={hrefFor(to)} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

/** Match a pattern like "/programmes/:slug" against a path. */
export function matchRoute(pattern: string, path: string): Record<string, string> | null {
  const p = pattern.split("/").filter(Boolean);
  const a = path.split("/").filter(Boolean);
  if (p.length !== a.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(":")) {
      // The URL is user-controlled, so a malformed escape sequence such as
      // "%E0%A4%A" must not throw a URIError out of route matching — that
      // would surface the ErrorBoundary instead of the not-found page.
      let decoded: string;
      try {
        decoded = decodeURIComponent(a[i]);
      } catch {
        return null;
      }
      params[p[i].slice(1)] = decoded;
    } else if (p[i] !== a[i]) return null;
  }
  return params;
}

export function ScrollManager() {
  const { path } = useRoute();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [path]);
  return null;
}

/**
 * Keep the static shell's route metadata in sync during client-side navigation.
 *
 * `canonicalPath` overrides the path used for the canonical and og:url tags.
 * It exists for routes that can be reached through more than one URL: a
 * programme resolves by slug, by id, by code and by slug suffix, so
 * `/programmes/<id>` and `/programmes/<code>` render the same page as the
 * canonical slug. Without the override each of those URLs would declare
 * itself canonical and the same content would be published at several
 * addresses. The override is the resolved programme's own slug, so the
 * canonical address always names the one URL that the sitemap lists.
 */
export function useSeo(meta: {
  title: string;
  description?: string;
  canonicalPath?: string;
}) {
  const { path } = useRoute();
  useEffect(() => {
    syncRouteMetadata(
      document,
      meta.canonicalPath ?? path,
      meta.title,
      meta.description
    );
  }, [path, meta.canonicalPath, meta.title, meta.description]);
}
