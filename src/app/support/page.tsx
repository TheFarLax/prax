import Link from "next/link";
import { FaqList } from "@/components/faq";
import { Icon } from "@/components/icon";
import { PageHeading } from "@/components/sections";
import { faqs } from "@/content/faq";
import { product } from "@/lib/product";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Support & FAQ",
  "Answers to your questions about Praxis, Xasri AI, agentic browsing, platform availability, and privacy information.",
  "/support",
);

export default function SupportPage() {
  return (
    <>
      <PageHeading
        eyebrow="Support & FAQ"
        title={
          <>
            Good questions.
            <br />
            <span>Clear answers.</span>
          </>
        }
        description="A place to get to know Praxis, Xasri AI, and what to expect from an agentic browser."
      />
      <section
        className="container support-content"
        aria-label="Frequently asked questions"
      >
        <FaqList items={faqs} searchable />
        <div className="support-bottom">
          <Icon name="info" size={25} />
          <div>
            <h2>Looking for a release?</h2>
            <p>
              Check the download page for platform availability and installation
              details.
            </p>
            <Link className="text-link" href="/download">
              Download Praxis
              <Icon name="arrowRight" size={18} />
            </Link>
            {product.support.url && (
              <a
                href={product.support.url}
                className="text-link"
                rel="noopener noreferrer"
                target="_blank"
              >
                Contact support
                <Icon name="arrowUpRight" size={18} />
              </a>
            )}
            {product.support.email && (
              <a href={`mailto:${product.support.email}`} className="text-link">
                Email support
                <Icon name="arrowUpRight" size={18} />
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
