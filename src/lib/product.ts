import data from "@/content/product.json";

export type Platform = "windows" | "macos" | "linux" | "android" | "ios";

export interface Release {
  id: string;
  platform: Platform;
  platformLabel: string;
  architecture: string;
  version: string;
  publishedAt: string;
  url: string;
  fileName: string;
  fileSize: string;
  sha256?: string;
  requirements: string;
  installation: string[];
  verified: true;
  evidence: string;
}

export interface ProductScreenshot {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  platform: Platform;
  build: string;
  capturedAt: string;
  evidence: string;
  authentic: true;
  theme?: "light" | "dark";
}

export interface ProductVideo {
  id: string;
  title: string;
  src: string;
  type: "video/mp4" | "video/webm";
  poster: string;
  width: number;
  height: number;
  captions: string;
  transcript: string;
  duration: number;
  editedForLength: boolean;
  build: string;
  evidence: string;
  authentic: true;
}

export type FeatureId =
  | "page-context"
  | "tab-context"
  | "voice"
  | "workflows"
  | "essentials"
  | "developer-tools"
  | "privacy-controls"
  | "personalisation";

export interface ProductFeature {
  id: FeatureId;
  title: string;
  description: string;
  items: string[];
  platforms: Platform[];
  limitations: string[];
  screenshotIds: string[];
  videoId?: string;
  verified: true;
  evidence: string;
}

export interface LegalDocument {
  title: string;
  effectiveDate: string;
  approvedBy: string;
  source: string;
  sections: { heading: string; paragraphs: string[] }[];
}

interface ProductContent {
  name: string;
  wordmark: string;
  company: string;
  assistant: string;
  assistantAction: string;
  releases: Release[];
  screenshots: ProductScreenshot[];
  videos: ProductVideo[];
  features: ProductFeature[];
  legal: { privacy: LegalDocument | null; terms: LegalDocument | null };
  support: { url: string | null; email: string | null };
  social: { name: string; url: string }[];
}

export const product = data as ProductContent;
export const releases = product.releases.filter(
  (release) => release.verified && release.evidence,
);
export const screenshots = product.screenshots.filter(
  (shot) => shot.authentic && shot.evidence,
);
export const videos = product.videos.filter(
  (video) => video.authentic && video.evidence,
);
export const features = product.features.filter(
  (feature) => feature.verified && feature.evidence,
);
export const mainTour = videos.find((video) => video.id === "product-tour");
export const heroLoop = videos.find((video) => video.id === "hero-loop");

export function screenshot(id: string) {
  return screenshots.find((shot) => shot.id === id);
}

export const featureOrder: FeatureId[] = [
  "page-context",
  "tab-context",
  "voice",
  "workflows",
  "essentials",
  "developer-tools",
  "privacy-controls",
  "personalisation",
];
