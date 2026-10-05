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
 * Hash routing is used deliberately so the single-file production build
 * works when opened directly or hosted without server rewrites.
 */

export type RouteState = {
  path: string;
  query: URLSearchParams;
};

/*
 * ENTRY-PATH ADOPTION
 * -------------------
 * Vercel's catch-all rewrite serves index.html for clean paths as well as for
 * "/", so https://host/programmes returns a fully working page. Previously an
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
 * Known limitation, not fixable from the client: Vercel answers unknown clean
 * paths with index.html and HTTP 200, so an unknown route renders our NotFound
 * page as a "soft 404". Returning a real 404 status needs a server-side check,
 * which is a deployment decision, not an app one.
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
 * Only over http(s). The single-file build is also meant to work when opened
 * straight off disk, where the pathname is the full filesystem path to
 * index.html ("/home/user/dist/index.html"). Adopting that would 404 a build
 * that currently works, so file:// keeps the previous hash-only behaviour.
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

/** Per-route document metadata (SPA SEO baseline; SSR recommended at scale). */
export function useSeo(meta: { title: string; description?: string }) {
  useEffect(() => {
    document.title = meta.title;
    if (meta.description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", meta.description);
    }
  }, [meta.title, meta.description]);
}
