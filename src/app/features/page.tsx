import Link from "next/link";
import { BrandScene } from "@/components/brand";
import { Icon } from "@/components/icon";
import {
  DownloadSection,
  PageHeading,
  VerifiedFeatureSections,
} from "@/components/sections";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "The browser, with more possibility",
  "Get to know Praxis: everyday browsing, the Xasri AI assistant, and supported browser actions in one experience.",
  "/features",
);

export default function FeaturesPage() {
  return (
    <>
      <PageHeading
        eyebrow="The Praxis browser"
        title={
          <>
            Familiar at first.
            <br />
            <span>More as you go.</span>
          </>
        }
        description="Everyday browsing, with an assistant for what comes next. Get to know the idea behind Praxis."
      />
      <div className="container feature-banner">
        <BrandScene compact />
      </div>
      <section
        className="container section feature-stories"
        aria-label="The Praxis experience"
      >
        <article data-reveal>
          <Icon name="browser" size={32} />
          <div>
            <h2>Your place on the web.</h2>
            <p>
              Praxis starts with the browser. It brings the web and your
              assistant into the same experience, with a clear distinction
              between browsing and asking for help.
            </p>
          </div>
          <Link className="text-link" href="/#browser">
            Meet Praxis
            <Icon name="arrowRight" size={18} />
          </Link>
        </article>
        <article data-reveal>
          <Icon name="sparkle" size={32} />
          <div>
            <h2>A question is a good start.</h2>
            <p>
              Xasri AI is the assistant inside Praxis. It is designed to
              understand browsing context and help turn an instruction into a
              supported next step.
            </p>
          </div>
          <Link className="text-link" href="/xasri-ai">
            Explore Xasri AI
            <Icon name="arrowRight" size={18} />
          </Link>
        </article>
        <article data-reveal>
          <Icon name="cursor" size={32} />
          <div>
            <h2>Know what your browser can do.</h2>
            <p>
              Agentic features depend on the release, the website, and the task.
              Review the version and its supported actions before relying on a
              workflow.
            </p>
          </div>
          <Link className="text-link" href="/download">
            Release availability
            <Icon name="arrowRight" size={18} />
          </Link>
        </article>
      </section>
      <VerifiedFeatureSections />
      <DownloadSection />
    </>
  );
}
