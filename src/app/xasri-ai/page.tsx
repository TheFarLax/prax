import Link from "next/link";
import { AgenticWalkthrough } from "@/components/agentic-walkthrough";
import { Icon } from "@/components/icon";
import {
  AssistantSection,
  DownloadSection,
  PageHeading,
  VerifiedFeatureSections,
} from "@/components/sections";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Meet Xasri AI",
  "Meet the assistant inside Praxis. Understand how context, questions, and supported actions come together in an agentic browser.",
  "/xasri-ai",
);

export default function XasriPage() {
  return (
    <>
      <PageHeading
        eyebrow="Xasri AI, inside Praxis"
        title={
          <>
            Your next question.
            <br />
            <span>A new possibility.</span>
          </>
        }
        description="An assistant for the moment you need a little more from your browser. Meet Xasri AI."
      />
      <AssistantSection />
      <section
        className="section dark-section"
        aria-labelledby="ai-how-heading"
      >
        <div className="container">
          <div className="section-heading">
            <h2 id="ai-how-heading">
              Beyond the answer.
              <br />
              Into the next step.
            </h2>
            <p>
              An answer explains something. An agentic action uses supported
              tools to take a step in the browser. Explore the concept below.
            </p>
          </div>
          <AgenticWalkthrough />
          <div className="ai-limits">
            <Icon name="info" size={20} />
            <p>
              This is an explanation of agentic browsing, not a recording of the
              Praxis app. Available actions, context selection, and confirmation
              flows depend on the verified product build.
            </p>
          </div>
        </div>
      </section>
      <VerifiedFeatureSections />
      <section
        className="section container ai-identity"
        aria-labelledby="identity-heading"
      >
        <h2 id="identity-heading">
          One browser.
          <br />
          One clear distinction.
        </h2>
        <div>
          <div>
            <span>PRAXIS</span>
            <p>The browser you use to explore the web.</p>
          </div>
          <div>
            <span>Xasri AI</span>
            <p>The assistant you ask for help with supported requests.</p>
          </div>
          <div>
            <span>Ask Xasri</span>
            <p>The action label for starting with your assistant.</p>
          </div>
          <Link className="text-link" href="/support">
            More about Xasri AI
            <Icon name="arrowRight" size={18} />
          </Link>
        </div>
      </section>
      <DownloadSection />
    </>
  );
}
