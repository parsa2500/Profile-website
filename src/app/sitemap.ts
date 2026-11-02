import type { MetadataRoute } from "next";
import { absoluteUrl, localePath } from "@/lib/site";
import { routing } from "@/i18n/routing";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routing.locales.map((locale) => ({
    url: absoluteUrl(localePath(locale)),
    lastModified: now,
    changeFrequency: "monthly",
    priority: locale === "fa" ? 1 : 0.8,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((entry) => [entry, absoluteUrl(localePath(entry))]),
      ),
    },
  }));
}
