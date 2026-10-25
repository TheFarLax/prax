import Link from "next/link";
import { product } from "@/lib/product";
import { Icon } from "./icon";
import { PageHeading } from "./sections";

export function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const document = product.legal[kind];
  if (document)
    return (
      <>
        <PageHeading
          title={document.title}
          description={`Effective ${document.effectiveDate}`}
        />
        <article className="container legal-content">
          {document.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </article>
      </>
    );

  return (
    <>
      <PageHeading
        eyebrow="Good to know"
        title={
          kind === "privacy" ? (
            <>
              Privacy.
              <br />
              <span>Start with clarity.</span>
            </>
          ) : (
            <>
              Terms.
              <br />
              <span>Before you begin.</span>
            </>
          )
        }
        description={
          kind === "privacy"
            ? "Privacy information for this website and the Praxis browser."
            : "Availability of terms for the Praxis browser."
        }
      />
      <article className="container legal-content">
        <section>
          <h2>{kind === "privacy" ? "The Praxis browser" : "Browser terms"}</h2>
          <p>
            {kind === "privacy"
              ? "The Praxis browser’s privacy notice is not yet available on this site. This page does not make claims about browser data retention, AI providers, tracking protection, or encryption."
              : "The Praxis browser’s terms have not been published on this site. No browser licence or service agreement is provided by this page."}
          </p>
          <p>
            Review the published release information and its accompanying
            documents before downloading or using the browser.
          </p>
          <Link className="text-link" href="/download">
            Release availability
            <Icon name="arrowRight" size={18} />
          </Link>
        </section>
        {kind === "privacy" && (
          <section>
            <h2>This website</h2>
            <p>
              The website stores a light or dark theme preference on your device
              when you change the website theme. This preference is stored in
              your browser’s local storage.
            </p>
            <p>
              The website source does not include analytics, advertising
              scripts, sign-in, or a form that collects personal information.
              Product media and fonts are served locally. These details describe
              this website, not data handling in the Praxis browser.
            </p>
          </section>
        )}
        <section>
          <h2>Questions about Praxis?</h2>
          <p>
            Read the FAQ for information about Xasri AI, context, supported
            actions, and release availability.
          </p>
          <Link className="text-link" href="/support">
            Support & FAQ
            <Icon name="arrowRight" size={18} />
          </Link>
        </section>
      </article>
    </>
  );
}
