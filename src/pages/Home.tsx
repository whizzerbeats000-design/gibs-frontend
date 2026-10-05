import Hero from "../sections/Hero";
import Perspective from "../sections/Approach";
import ProgrammeDiscovery from "../sections/Programs";
import GlobalPerspective from "../sections/Institution";
import ConciergeBand from "../sections/ConciergeBand";
import AdmissionsTeaser from "../sections/Journey";
import { useSeo } from "../lib/router";

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
      <ProgrammeDiscovery />
      <GlobalPerspective />
      <ConciergeBand />
      <AdmissionsTeaser />
    </>
  );
}
