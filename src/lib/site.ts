import type { Metadata } from "next";
import { mainTour, product, releases, screenshot } from "./product";

function confirmedOrigin(): string | null {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (!value) return null;
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      /localhost|example\.(com|org)|your-confirmed-domain/.test(url.hostname)
    )
      return null;
    return url.origin;
  } catch {
    return null;
  }
}

export const siteOrigin = confirmedOrigin();
export const allowIndexing = Boolean(
  siteOrigin &&
  process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true" &&
  releases.length &&
  mainTour &&
  screenshot("home-desktop") &&
  product.legal.privacy &&
  product.legal.terms,
);

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title: { absolute: `${title} | PRAXIS` },
    description,
    alternates: siteOrigin ? { canonical: `${siteOrigin}${path}` } : undefined,
    openGraph: {
      title: `${title} | PRAXIS`,
      description,
      type: "website",
      siteName: "Praxis, from Xasri",
      ...(siteOrigin ? { url: `${siteOrigin}${path}` } : {}),
      images: [
        {
          url: "/images/social-preview.png",
          width: 1200,
          height: 630,
          alt: "PRAXIS. Your browser. Ready to do more. From Xasri.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | PRAXIS`,
      description,
      images: ["/images/social-preview.png"],
    },
  };
}
