import type { MetadataRoute } from "next";

// Public marketing routes only. The Vendor Network is deliberately absent
// until it is ready to be promoted.
const ROUTES = [
  "/",
  "/events/expo-2026",
  "/events/halloween-2026",
  "/club",
  "/privacy",
  "/terms",
  "/refunds",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({ url: `https://nostalgiafest.ca${path}` }));
}
