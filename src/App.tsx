import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { RouterProvider, ScrollManager, matchRoute, useRoute } from "./lib/router";
import { ConciergeProvider, ConciergeLauncher, ConciergeDialog, useConcierge } from "./components/Concierge";
import { Header, MobileNav, GlobalFooter, SkipLink, ErrorBoundary } from "./components/chrome";
import { SearchModal } from "./components/Search";

import Home from "./pages/Home";
import Programmes from "./pages/Programmes";
import ProgrammeDetail from "./pages/ProgrammeDetail";
import ExecutiveEducation from "./pages/ExecutiveEducation";
import Admissions from "./pages/Admissions";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import ConciergePage from "./pages/ConciergePage";
import NotFound from "./pages/NotFound";

/**
 * Resolves a path to a page.
 *
 * `path` arrives as a prop rather than being read from the router context.
 * AnimatePresence keeps an exiting child mounted for the length of its exit
 * animation, and any context read below it would re-render that still-mounted
 * subtree with the *incoming* path — so the new page would fade out and the
 * outgoing one would never be seen. Reading the path from props lets React
 * bail out of the untouched exiting subtree instead.
 */
function RouteView({ path }: { path: string }) {
  const programme = matchRoute("/programmes/:slug", path);
  if (programme?.slug) return <ProgrammeDetail slug={programme.slug} />;

  switch (path) {
    case "/":
      return <Home />;
    case "/programmes":
      return <Programmes />;
    case "/executive-education":
      return <ExecutiveEducation />;
    case "/admissions":
      return <Admissions />;
    case "/about":
      return <About />;
    case "/gallery":
      return <Gallery />;
    case "/contact":
      return <Contact />;
    case "/concierge":
      return <ConciergePage />;
    default:
      return <NotFound />;
  }
}

function Chrome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { setOpen: setConciergeOpen } = useConcierge();

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const openConcierge = useCallback(() => setConciergeOpen(true), [setConciergeOpen]);

  // Global keyboard shortcut: Cmd/Ctrl + K opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <SkipLink />
      <ScrollManager />
      <Header
        menuOpen={menuOpen}
        onOpenMenu={() => setMenuOpen(true)}
        onOpenSearch={openSearch}
        onOpenConcierge={openConcierge}
      />
      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenSearch={openSearch}
        onOpenConcierge={openConcierge}
      />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ConciergeLauncher suppressed={searchOpen || menuOpen} />
      <ConciergeDialog />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <RouterProvider>
          <ConciergeProvider>
            <Chrome />
            <main id="main" tabIndex={-1} className="outline-none">
              <AnimatedRoutes />
            </main>
            <GlobalFooter />
          </ConciergeProvider>
        </RouterProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}

/** Restrained cross-fade between routes; transform/opacity only. */
function AnimatedRoutes() {
  const { path } = useRoute();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={path}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <RouteView path={path} />
      </motion.div>
    </AnimatePresence>
  );
}
