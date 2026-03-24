import type { MetadataRoute } from "next";
import { getDictionary } from "@/features/dictionary/lib/dictionary";
import { listPublishedGrammarLessons } from "@/features/grammar/lib/grammarDataset";
import { getGrammarLessonPath } from "@/features/grammar/lib/grammarPaths";
import {
  getPublicationPath,
  publications,
} from "@/features/publications/lib/publications";
import {
  getDictionaryPath,
  getEntryPath,
  getGrammarPath,
  getLocalizedHomePath,
  getPublicationsPath,
  PUBLIC_LOCALES,
} from "@/lib/locale";
import { getLatestProjectFileMtime } from "@/lib/server/projectFiles";
import { siteConfig } from "@/lib/site";
import type { Language } from "@/types/i18n";

export const runtime = "nodejs";

type LocalizedStaticRouteConfig = {
  getRoute: (locale: Language) => string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
  sourcePaths: readonly string[];
};

type StaticRouteConfig = {
  route: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
  sourcePaths: readonly string[];
};

const localizedStaticRoutes: readonly LocalizedStaticRouteConfig[] = [
  {
    getRoute: getLocalizedHomePath,
    changeFrequency: "weekly",
    priority: 1,
    sourcePaths: [
      "src/app/(site)/[locale]/page.tsx",
      "src/app/(site)/[locale]/layout.tsx",
      "src/features/home/components/HomePageClient.tsx",
      "src/lib/site.ts",
    ],
  },
  {
    getRoute: getDictionaryPath,
    changeFrequency: "weekly",
    priority: 0.9,
    sourcePaths: [
      "src/app/(site)/[locale]/dictionary/page.tsx",
      "public/data/dictionary.json",
      "public/data/woordenboek.json",
    ],
  },
  {
    getRoute: getGrammarPath,
    changeFrequency: "weekly",
    priority: 0.8,
    sourcePaths: [
      "src/app/(site)/[locale]/grammar/page.tsx",
      "public/data/grammar/v1/manifest.json",
    ],
  },
  {
    getRoute: getPublicationsPath,
    changeFrequency: "monthly",
    priority: 0.8,
    sourcePaths: [
      "src/app/(site)/[locale]/publications/page.tsx",
      "src/features/publications/lib/publications.ts",
    ],
  },
];

// Keep the sitemap focused on the strongest public landing pages.
const staticRoutes: readonly StaticRouteConfig[] = [];

export default function sitemap(): MetadataRoute.Sitemap {
  const dictionary = getDictionary();
  const dictionaryLastModified = getLatestProjectFileMtime([
    "public/data/dictionary.json",
    "public/data/woordenboek.json",
  ]);
  const publicationsLastModified = getLatestProjectFileMtime([
    "src/features/publications/lib/publications.ts",
    "src/app/(site)/[locale]/publications/[id]/page.tsx",
    "src/features/publications/components/PublicationDetailPageClient.tsx",
  ]);
  const grammarLessonPages = PUBLIC_LOCALES.flatMap((locale) =>
    listPublishedGrammarLessons().map((lesson) => {
      const lastModified = getLatestProjectFileMtime([
        "src/app/(site)/[locale]/grammar/[slug]/page.tsx",
        `public/data/grammar/v1/lessons/${lesson.slug}.json`,
        "public/data/grammar/v1/manifest.json",
      ]);

      return {
        url: `${siteConfig.liveUrl}${getGrammarLessonPath(lesson.slug, locale)}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: "monthly" as const,
        priority: 0.78,
      };
    }),
  );

  const localizedStaticPages = PUBLIC_LOCALES.flatMap((locale) =>
    localizedStaticRoutes.map((route) => {
      const lastModified = getLatestProjectFileMtime(route.sourcePaths);

      return {
        url: `${siteConfig.liveUrl}${route.getRoute(locale)}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      };
    }),
  ) satisfies MetadataRoute.Sitemap;

  const staticPages = staticRoutes.map((route) => {
    const lastModified = getLatestProjectFileMtime([
      ...route.sourcePaths,
    ]);

    return {
      url: `${siteConfig.liveUrl}${route.route}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    };
  }) satisfies MetadataRoute.Sitemap;

  const entryPages = PUBLIC_LOCALES.flatMap((locale) =>
    dictionary.map((entry) => ({
      url: `${siteConfig.liveUrl}${getEntryPath(entry.id, locale)}`,
      ...(dictionaryLastModified ? { lastModified: dictionaryLastModified } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  );

  const publicationPages = PUBLIC_LOCALES.flatMap((locale) =>
    publications
      .filter((publication) => publication.status === "published")
      .map((publication) => ({
        url: `${siteConfig.liveUrl}${getPublicationPath(publication.id, locale)}`,
        ...(publicationsLastModified ? { lastModified: publicationsLastModified } : {}),
        changeFrequency: "monthly" as const,
        priority: 0.75,
      })),
  );

  return [
    ...localizedStaticPages,
    ...staticPages,
    ...entryPages,
    ...publicationPages,
    ...grammarLessonPages,
  ];
}
