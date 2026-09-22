import Hero from "../sections/Hero";
import Perspective from "../sections/Approach";
import ProgrammeDiscovery from "../sections/Programs";
import Experience from "../sections/Campus";
import GlobalPerspective from "../sections/Institution";
import FacultyScholarship from "../sections/Faculty";
import InsightsTeaser from "../sections/Insights";
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
      <Experience />
      <GlobalPerspective />
      <FacultyScholarship />
      <InsightsTeaser />
      <ConciergeBand />
      <AdmissionsTeaser />
    </>
  );
}
