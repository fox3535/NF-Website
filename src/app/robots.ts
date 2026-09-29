import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/vendors" },
    sitemap: "https://nostalgiafest.ca/sitemap.xml",
  };
}
