import type { Metadata } from "next";
import StructuredData from "@/components/StructuredData";
import HomePageClient from "@/features/home/components/HomePageClient";
import { createLocalizedPageMetadata } from "@/lib/metadata";
import { resolvePublicLocale } from "@/lib/publicLocaleRouting";
import { siteConfig } from "@/lib/site";
import { createWebSiteStructuredData } from "@/lib/structuredData";

function buildHomeDescription(locale: "en" | "nl") {
  if (locale === "nl") {
    return siteConfig.dictionaryEntryCount
      ? `Verken ${siteConfig.dictionaryEntryCount.toLocaleString()} Koptische woordenboeklemma's, grammaticahandleidingen, publicaties en digitale onderzoekstools van Kyrillos Wannes.`
      : "Verken Koptische woordenboeklemma's, grammaticahandleidingen, publicaties en digitale onderzoekstools van Kyrillos Wannes.";
  }

  return siteConfig.dictionaryEntryCount
    ? `Explore ${siteConfig.dictionaryEntryCount.toLocaleString()} Coptic dictionary entries, grammar lessons, publications, and digital humanities tools by Kyrillos Wannes.`
    : "Explore Coptic dictionary entries, grammar lessons, publications, and digital humanities tools by Kyrillos Wannes.";
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
        ? "Koptisch Woordenboek, Grammatica en Publicaties"
        : "Coptic Dictionary, Grammar, and Publications",
    description: buildHomeDescription(resolvedLocale),
    path: "/",
    locale: resolvedLocale,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolvePublicLocale(locale);

  return (
    <>
      <StructuredData data={createWebSiteStructuredData(resolvedLocale)} />
      <HomePageClient />
    </>
  );
}
