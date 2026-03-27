import type { Metadata } from "next";
import StructuredData from "@/components/StructuredData";
import GrammarHubPageClient from "@/features/grammar/components/GrammarHubPageClient";
import { listGrammarLessons } from "@/features/grammar/lib/grammarDataset";
import { getTranslation } from "@/lib/i18n";
import { createLocalizedPageMetadata } from "@/lib/metadata";
import { getGrammarPath, getLocalizedHomePath } from "@/lib/locale";
import { resolvePublicLocale } from "@/lib/publicLocaleRouting";
import {
  createBreadcrumbStructuredData,
  createGrammarHubStructuredData,
} from "@/lib/structuredData";

function buildGrammarDescription(locale: "en" | "nl") {
  return locale === "nl"
    ? "Bestudeer gepubliceerde lessen Koptische grammatica met oefeningen, begrippenlijsten en bronverwijzingen voor gestructureerd leren."
    : "Study published Coptic grammar lessons with exercises, concept glossaries, and source notes designed for structured learning.";
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
        ? "Lessen Koptische Grammatica"
        : "Coptic Grammar Lessons",
    description: buildGrammarDescription(resolvedLocale),
    path: "/grammar",
    locale: resolvedLocale,
  });
}

export default async function GrammarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolvePublicLocale(locale);
  const lessons = listGrammarLessons();

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
              name: getTranslation(resolvedLocale, "nav.grammar"),
              path: getGrammarPath(resolvedLocale),
            },
          ]),
          ...createGrammarHubStructuredData(lessons, resolvedLocale),
        ]}
      />
      <GrammarHubPageClient lessons={lessons} />
    </>
  );
}
