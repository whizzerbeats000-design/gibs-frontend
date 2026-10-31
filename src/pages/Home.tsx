import { Suspense, lazy } from "react";
import Hero from "../sections/Hero";
import Perspective from "../sections/Approach";
import GlobalPerspective from "../sections/Institution";
import ConciergeBand from "../sections/ConciergeBand";
import AdmissionsTeaser from "../sections/Journey";
import { useSeo } from "../lib/router";

/* The programme catalogue (~395 KB, src/lib/data.ts) is the heaviest slice of
 * the homepage. It is lazy-loaded after the hero/mission paint so the initial
 * bundle stays small; the static shell already carries this section's HTML for
 * non-JS clients and scripts/seo-gen.mjs modulepreloads this chunk for the home
 * shell. */
const ProgrammeDiscovery = lazy(() => import("../sections/Programs"));

export default function Home() {
  useSeo({
    title: "GIBS — Goshen International Business School",
    description:
      "Goshen International Business School. A contemporary business education for leaders, entrepreneurs and organizations of the Global Africa.",
  });
  return (
    <>
      <Hero />
      <Perspective />
      <Suspense fallback={null}>
        <ProgrammeDiscovery />
      </Suspense>
      <GlobalPerspective />
      <ConciergeBand />
      <AdmissionsTeaser />
    </>
  );
}
