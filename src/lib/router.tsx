import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type MouseEvent,
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

function parseHash(): RouteState {
  const raw = window.location.hash.replace(/^#/, "");
  const [path, qs] = raw.split("?");
  return {
    path: path && path !== "/" ? path.replace(/\/$/, "") || "/" : "/",
    query: new URLSearchParams(qs ?? ""),
  };
}

const RouterContext = createContext<RouteState>({ path: "/", query: new URLSearchParams() });

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<RouteState>(() =>
    typeof window === "undefined" ? { path: "/", query: new URLSearchParams() } : parseHash()
  );

  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onChange);
    if (!window.location.hash) window.location.hash = "#/";
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
  "aria-label"?: string;
  "aria-current"?: boolean | "page";
};

export function Link({ to, children, className, onClick, ...rest }: LinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onClick?.();
    navigate(to);
  };
  return (
    <a href={hrefFor(to)} className={className} onClick={handleClick} {...rest}>
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
    if (p[i].startsWith(":")) params[p[i].slice(1)] = decodeURIComponent(a[i]);
    else if (p[i] !== a[i]) return null;
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
