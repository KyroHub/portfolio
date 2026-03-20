import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DictionaryEntryCard from '@/features/dictionary/components/DictionaryEntry';
import EntryPageHeader from '@/features/dictionary/components/EntryPageHeader';
import { PageShell, pageShellAccents } from '@/components/PageShell';
import StructuredData from '@/components/StructuredData';
import { getDictionary } from '@/features/dictionary/lib/dictionary';
import { buildPageTitle, siteConfig } from '@/lib/site';
import {
  buildEntryDescription,
  createDefinedTermStructuredData,
  toPlainText,
} from '@/lib/structuredData';

// Dictionary entries are fully pre-rendered so lookups stay fast and every
// entry gets stable SEO metadata at build time.
export async function generateStaticParams() {
  const dictionary = getDictionary();
  return dictionary.map(entry => ({
    id: entry.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const dictionary = getDictionary();
  const entry = dictionary.find((item) => item.id === resolvedParams.id);

  if (!entry) {
    return {
      title: "Entry Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const headword = toPlainText(entry.headword);
  const description = buildEntryDescription(entry);

  return {
    title: headword,
    description,
    alternates: {
      canonical: `/entry/${entry.id}`,
    },
    openGraph: {
      title: buildPageTitle(headword),
      description,
      url: `${siteConfig.liveUrl}/entry/${entry.id}`,
    },
    twitter: {
      title: buildPageTitle(headword),
      description,
    },
  };
}

export default async function EntryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const dictionary = getDictionary();
  const entry = dictionary.find(e => e.id === resolvedParams.id);

  if (!entry) {
    notFound();
  }

  return (
    <PageShell
      className="min-h-screen px-6 pb-20 pt-16"
      contentClassName="max-w-4xl mx-auto"
      accents={[
        pageShellAccents.heroSkyArc,
        pageShellAccents.topRightEmeraldOrbOffset,
      ]}
    >
      <StructuredData data={createDefinedTermStructuredData(entry)} />

      <EntryPageHeader />
      <DictionaryEntryCard entry={entry} headingLevel="h1" linkHeadword={false} />
    </PageShell>
  );
}
