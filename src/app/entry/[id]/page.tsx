import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { LexicalEntry } from '../../../../scripts/parseExcel';
import DictionaryEntryCard from '@/components/DictionaryEntry';
import Link from 'next/link';

// Read JSON data from the file system (this runs on the server)
async function getDictionary(): Promise<LexicalEntry[]> {
  const filePath = path.join(process.cwd(), 'public/data/dictionary.json');
  if (!fs.existsSync(filePath)) return [];
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

// Generate static params so the pages are pre-rendered at build time
export async function generateStaticParams() {
  const dictionary = await getDictionary();
  return dictionary.map(entry => ({
    id: entry.id,
  }));
}

export default async function EntryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const dictionary = await getDictionary();
  const entry = dictionary.find(e => e.id === resolvedParams.id);

  if (!entry) {
    notFound();
  }

  return (
    <main className="min-h-screen relative overflow-hidden pb-20 pt-16 px-6">
      
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
        
        <DictionaryEntryCard entry={entry} />
      </div>
    </main>
  );
}
