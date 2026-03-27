import type { Metadata } from "next";
import AnalyticsPageClient from "@/features/analytics/components/AnalyticsPageClient";
import { createAnalyticsSnapshots } from "@/features/analytics/lib/analytics";
import { getDictionary } from "@/features/dictionary/lib/dictionary";
import { createLocalizedPageMetadata } from "@/lib/metadata";
import { resolvePublicLocale } from "@/lib/publicLocaleRouting";

function buildAnalyticsDescription(locale: "en" | "nl") {
  return locale === "nl"
    ? "Verken statistieken voor het Koptische woordenboek, waaronder woordsoorten, geslachten van zelfstandige naamwoorden en andere lexicale verdelingen."
    : "Explore analytics for the Coptic dictionary, including parts of speech, noun genders, and other lexical distribution patterns.";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = resolvePublicLocale(locale);

  return createLocalizedPageMetadata({
    title: resolvedLocale === "nl" ? "Woordenboekstatistieken" : "Dictionary Analytics",
    description: buildAnalyticsDescription(resolvedLocale),
    path: "/analytics",
    locale: resolvedLocale,
  });
}

export default function AnalyticsPage() {
  return (
    <AnalyticsPageClient snapshots={createAnalyticsSnapshots(getDictionary())} />
  );
}
