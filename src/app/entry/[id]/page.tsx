import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DictionaryEntryCard from '@/components/DictionaryEntry';
import StructuredData from '@/components/StructuredData';
import Link from 'next/link';
import { getDictionary } from '@/lib/dictionary';
import { buildPageTitle, siteConfig } from '@/lib/site';
import {
  buildEntryDescription,
  createDefinedTermStructuredData,
  toPlainText,
} from '@/lib/structuredData';

// Generate static params so the pages are pre-rendered at build time
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
    <main className="min-h-screen relative overflow-hidden pb-20 pt-16 px-6">
      <StructuredData data={createDefinedTermStructuredData(entry)} />
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-sky-900/10 rounded-b-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/dictionary" className="inline-flex items-center text-stone-400 hover:text-sky-400 transition-colors bg-stone-900/50 px-4 py-2 rounded-lg border border-stone-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dictionary Search
          </Link>
        </div>
        
        <DictionaryEntryCard entry={entry} headingLevel="h1" linkHeadword={false} />
      </div>
    </main>
  );
}
