import {
  AgenticSection,
  AssistantSection,
  BrowserIntroduction,
  ControlSection,
  DownloadSection,
  Hero,
  HomeFaq,
  VerifiedFeatureSections,
} from "@/components/sections";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Your browser. Ready to do more.",
  "Explore the web, understand what matters, and turn instructions into supported browser actions with Praxis and Xasri AI.",
  "/",
);

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrowserIntroduction />
      <AgenticSection />
      <AssistantSection />
      <VerifiedFeatureSections />
      <ControlSection />
      <HomeFaq />
      <DownloadSection />
    </>
  );
}
