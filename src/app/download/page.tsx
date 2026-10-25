import Link from "next/link";
import { DownloadPanel } from "@/components/download-panel";
import { Icon } from "@/components/icon";
import { OverviewTrigger } from "@/components/overview";
import { PageHeading } from "@/components/sections";
import { releases } from "@/lib/product";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Download Praxis",
  "Find Praxis release availability, supported platforms, version details, and installation information.",
  "/download",
);

export default function DownloadPage() {
  const publicReleases = releases.map((release) => ({
    ...release,
    evidence: undefined,
  }));
  return (
    <>
      <PageHeading
        eyebrow="Download Praxis"
        title={
          <>
            Your next browser.
            <br />
            <span>Your next possibility.</span>
          </>
        }
        description="Make room for a browser that brings the web and Xasri AI together."
      />
      <section
        className="container download-page-content"
        aria-label="Praxis release availability"
      >
        <DownloadPanel releases={publicReleases} />
        <div className="download-help">
          <div>
            <Icon name="play" size={24} />
            <h2>Get to know Praxis.</h2>
            <p>See how the browser and Xasri AI fit together.</p>
            <OverviewTrigger className="text-link" />
          </div>
          <div>
            <Icon name="info" size={24} />
            <h2>A question before you start?</h2>
            <p>
              Find answers about availability, context, and supported actions.
            </p>
            <Link className="text-link" href="/support">
              Support & FAQ
              <Icon name="arrowRight" size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
