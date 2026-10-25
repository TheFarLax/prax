import type { MetadataRoute } from "next";
import { allowIndexing, siteOrigin } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(allowIndexing ? { allow: "/" } : { disallow: "/" }),
    },
    ...(allowIndexing && siteOrigin
      ? { sitemap: `${siteOrigin}/sitemap.xml`, host: siteOrigin }
      : {}),
  };
}
