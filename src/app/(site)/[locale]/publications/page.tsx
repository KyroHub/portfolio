import type { Metadata } from "next";
import StructuredData from "@/components/StructuredData";
import PublicationsPageClient from "@/features/publications/components/PublicationsPageClient";
import { publications } from "@/features/publications/lib/publications";
import { getTranslation } from "@/lib/i18n";
import { createLocalizedPageMetadata } from "@/lib/metadata";
import { getLocalizedHomePath, getPublicationsPath } from "@/lib/locale";
import { resolvePublicLocale } from "@/lib/publicLocaleRouting";
import {
  createBreadcrumbStructuredData,
  createPublicationsStructuredData,
} from "@/lib/structuredData";

function buildPublicationsDescription(locale: "en" | "nl") {
  return locale === "nl"
    ? "Blader door boeken, naslagwerken en onderzoeksprojecten over de Koptische taal en taalkunde van Kyrillos Wannes."
    : "Browse books, reference works, and research projects on Coptic language and linguistics by Kyrillos Wannes.";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = resolvePublicLocale(locale);

  return createLocalizedPageMetadata({
    title:
      resolvedLocale === "nl"
        ? "Koptische Publicaties en Onderzoek"
        : "Coptic Publications and Research",
    description: buildPublicationsDescription(resolvedLocale),
    path: "/publications",
    locale: resolvedLocale,
  });
}

export default async function PublicationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolvePublicLocale(locale);

  return (
    <>
      <StructuredData
        data={[
          createBreadcrumbStructuredData([
            {
              name: getTranslation(resolvedLocale, "nav.home"),
              path: getLocalizedHomePath(resolvedLocale),
            },
            {
              name: getTranslation(resolvedLocale, "nav.publications"),
              path: getPublicationsPath(resolvedLocale),
            },
          ]),
          ...createPublicationsStructuredData(publications, resolvedLocale),
        ]}
      />
      <PublicationsPageClient />
    </>
  );
}
