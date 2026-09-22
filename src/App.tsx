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
import Faculty from "./pages/Faculty";
import ResearchInsights from "./pages/ResearchInsights";
import ArticleDetail from "./pages/ArticleDetail";
import CampusPage from "./pages/Campus";
import Gallery from "./pages/Gallery";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Contact from "./pages/Contact";
import ConciergePage from "./pages/ConciergePage";
import NotFound from "./pages/NotFound";

function CurrentRoute() {
  const { path } = useRoute();

  const programme = matchRoute("/programmes/:slug", path);
  if (programme?.slug) return <ProgrammeDetail slug={programme.slug} />;

  const article = matchRoute("/research-insights/:slug", path);
  if (article?.slug) return <ArticleDetail slug={article.slug} />;

  const event = matchRoute("/events/:slug", path);
  if (event?.slug) return <EventDetail slug={event.slug} />;

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
    case "/faculty":
      return <Faculty />;
    case "/research-insights":
      return <ResearchInsights />;
    case "/campus":
      return <CampusPage />;
    case "/gallery":
      return <Gallery />;
    case "/events":
      return <Events />;
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
        <CurrentRoute />
      </motion.div>
    </AnimatePresence>
  );
}
