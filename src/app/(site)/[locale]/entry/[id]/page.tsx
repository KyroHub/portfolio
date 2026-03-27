import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EntryPageHeader from '@/features/dictionary/components/EntryPageHeader';
import EntryPageClient from '@/features/dictionary/components/EntryPageClient';
import { PageShell, pageShellAccents } from '@/components/PageShell';
import StructuredData from '@/components/StructuredData';
import {
  buildEntryDescription,
  toPlainText,
} from '@/features/dictionary/lib/entryText';
import {
  getDictionary,
  getDictionaryEntryRelations,
} from '@/features/dictionary/lib/dictionary';
import { listPublishedGrammarLessonsForEntry } from '@/features/grammar/lib/grammarContentGraph';
import {
  createLanguageAlternates,
  getDictionaryPath,
  getEntryPath,
  getLocalizedHomePath,
  getOpenGraphLocale,
} from '@/lib/locale';
import { getTranslation } from '@/lib/i18n';
import { buildPageTitle, siteConfig } from '@/lib/site';
import { resolvePublicLocale } from '@/lib/publicLocaleRouting';
import {
  createBreadcrumbStructuredData,
  createDefinedTermStructuredData,
} from '@/lib/structuredData';

// Render dictionary entries on demand so the deployment stays within output
// size limits while preserving stable, crawlable metadata per entry.
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvePublicLocale(resolvedParams.locale);
  const dictionary = getDictionary();
  const entry = dictionary.find((item) => item.id === resolvedParams.id);

  if (!entry) {
    return {
      title: locale === "nl" ? "Lemma niet gevonden" : "Entry Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const headword = toPlainText(entry.headword);
  const title =
    locale === "nl"
      ? `${headword} (${entry.pos}) - Koptisch Woordenboek`
      : `${headword} (${entry.pos}) - Coptic Dictionary`;
  const description = buildEntryDescription(entry, locale);
  const path = getEntryPath(entry.id, locale);

  return {
    metadataBase: new URL(siteConfig.liveUrl),
    title,
    description,
    alternates: {
      canonical: path,
      languages: createLanguageAlternates(`/entry/${entry.id}`),
    },
    openGraph: {
      title: buildPageTitle(title),
      description,
      url: `${siteConfig.liveUrl}${path}`,
      locale: getOpenGraphLocale(locale),
    },
    twitter: {
      title: buildPageTitle(title),
      description,
    },
  };
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvePublicLocale(resolvedParams.locale);
  const dictionary = getDictionary();
  const entry = dictionary.find(e => e.id === resolvedParams.id);

  if (!entry) {
    notFound();
  }

  const { parentEntry, relatedEntries } = getDictionaryEntryRelations(
    entry,
    dictionary,
  );
  const headword = toPlainText(entry.headword);
  const relatedGrammarLessons = listPublishedGrammarLessonsForEntry(entry.id);

  return (
    <PageShell
      className="min-h-screen px-6 pb-20 pt-16"
      contentClassName="max-w-4xl mx-auto"
      accents={[
        pageShellAccents.heroSkyArc,
        pageShellAccents.topRightEmeraldOrbOffset,
      ]}
    >
      <StructuredData
        data={[
          createBreadcrumbStructuredData([
            { name: getTranslation(locale, "nav.home"), path: getLocalizedHomePath(locale) },
            { name: getTranslation(locale, "nav.dictionary"), path: getDictionaryPath(locale) },
            { name: headword, path: getEntryPath(entry.id, locale) },
          ]),
          createDefinedTermStructuredData(entry, locale),
        ]}
      />

      <EntryPageHeader entryLabel={headword} />
      <EntryPageClient
        initialEntry={entry}
        initialParentEntry={parentEntry}
        initialRelatedEntries={relatedEntries}
        relatedGrammarLessons={relatedGrammarLessons}
      />
    </PageShell>
  );
}
