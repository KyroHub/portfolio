import type { MetadataRoute } from "next";
import { getDictionary } from "@/lib/dictionary";
import { siteConfig } from "@/lib/site";

const staticRoutes = [
  "",
  "/dictionary",
  "/analytics",
  "/grammar",
  "/grammar/lesson-1",
  "/publications",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const dictionary = getDictionary();

  const staticPages = staticRoutes.map((route) => ({
    url: `${siteConfig.liveUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/dictionary" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/dictionary" ? 0.9 : 0.7,
  })) satisfies MetadataRoute.Sitemap;

  const entryPages = dictionary.map((entry) => ({
    url: `${siteConfig.liveUrl}/entry/${entry.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...entryPages];
}
