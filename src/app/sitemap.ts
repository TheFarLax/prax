import type { MetadataRoute } from "next";
import { allowIndexing, siteOrigin } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteOrigin || !allowIndexing) return [];
  return [
    "",
    "/features",
    "/xasri-ai",
    "/download",
    "/support",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${siteOrigin}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : path === "/download" ? 0.9 : 0.7,
  }));
}
