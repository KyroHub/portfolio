import Link from 'next/link';
import { antinoou } from '@/lib/fonts';
import { LexicalEntry } from '../../scripts/parseExcel';
import HighlightText from './HighlightText';

export default function DictionaryEntryCard({ entry, query = "", selectedDialect = "ALL" }: { entry: LexicalEntry, query?: string, selectedDialect?: string }) {
  let primaryDialectKey = 'S';
  
  if (selectedDialect !== "ALL" && entry.dialects[selectedDialect]) {
    primaryDialectKey = selectedDialect;
  } else if (!entry.dialects['S']) {
    primaryDialectKey = Object.keys(entry.dialects)[0];
  }

  let headerSpelling = entry.headword;
  if (primaryDialectKey && entry.dialects[primaryDialectKey]) {
      const forms = entry.dialects[primaryDialectKey];
      const parts = [];
      if (forms.absolute) parts.push(forms.absolute);
      else parts.push(entry.headword);
      
      const bound = [];
      if (forms.nominal) bound.push(forms.nominal);
      if (forms.pronominal) bound.push(forms.pronominal);
      
      if (bound.length > 0) parts.push(bound.join('/'));
      if (forms.stative) parts.push(forms.stative);
      
      headerSpelling = parts.join(' ');
  }

  const remainingDialects = Object.entries(entry.dialects).filter(([dialect]) => dialect !== primaryDialectKey);

  return (
    <div className="group relative rounded-2xl bg-white/70 dark:bg-stone-900/50 backdrop-blur-md border border-stone-200 dark:border-stone-800 p-6 shadow-md dark:shadow-lg dark:shadow-black/20 hover:border-stone-300 dark:hover:border-stone-700 hover:bg-white dark:hover:bg-stone-800/50 transition-all duration-300">
      
      {/* Top Banner: Headword and Main Badges */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <Link href={`/entry/${entry.id}`} prefetch={false} className="inline-block">
            <h2 className={`${antinoou.className} text-4xl text-sky-600 dark:text-sky-400 tracking-wider drop-shadow-sm hover:text-sky-500 dark:hover:text-sky-300 transition-colors cursor-pointer`}>
              <HighlightText text={headerSpelling} query={query} />
            </h2>
          </Link>
        </div>
        
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="px-3 py-1 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full text-stone-600 dark:text-stone-300">
            {entry.pos}
          </span>
          {entry.gender && (
            <span className={`px-3 py-1 rounded-full border ${entry.gender === 'F' ? 'bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-900/50 text-pink-600 dark:text-pink-300' : 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-300'}`}>
              Gender: {entry.gender}
            </span>
          )}
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-stone-200 dark:from-stone-800 via-stone-300 dark:via-stone-700 to-stone-200 dark:to-stone-800 mb-5"></div>

      {/* Translations */}
      <div className="mb-6 space-y-2">
        <h3 className="text-sm text-stone-500 dark:text-stone-400 uppercase tracking-widest font-semibold mb-2">Translation</h3>
        <ul className="space-y-1 text-stone-800 dark:text-stone-200 text-lg list-disc ml-5 marker:text-sky-500">
          {entry.english_meanings.map((meaning, idx) => (
            <li key={idx} className="leading-relaxed pl-1">
              <HighlightText text={meaning} query={query} emphasizeLeadingLabel />
            </li>
          ))}
        </ul>
        {entry.greek_equivalents.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            <span className="text-sm text-stone-500 font-medium">Greek Equivalents:</span>
            <div className="flex flex-wrap gap-2">
              {entry.greek_equivalents.map((gr, idx) => (
                <span key={idx} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-md text-sm font-medium">
                  <HighlightText text={gr} query={query} />
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dialect Variations */}
      {remainingDialects.length > 0 && (
        <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800/50">
          <h4 className="text-xs text-stone-500 uppercase tracking-widest mb-3">Dialect Forms</h4>
          <div className="flex flex-wrap gap-3">
            {remainingDialects.map(([dialect, forms], index) => {
              const parts = [];
              if (forms.absolute) parts.push(forms.absolute);
              
              const bound = [];
              if (forms.nominal) bound.push(forms.nominal);
              if (forms.pronominal) bound.push(forms.pronominal);
              
              if (bound.length > 0) parts.push(bound.join('/'));
              if (forms.stative) parts.push(forms.stative);
              
              const spelling = parts.join(' ');
              
              return (
              <div key={index} className="flex items-center space-x-2 bg-stone-50 dark:bg-stone-950/50 px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-800/60">
                <span className="text-[10px] bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 px-1.5 rounded-sm font-bold uppercase">{dialect}</span>
                <span className={`${antinoou.className} text-stone-800 dark:text-stone-300 text-lg`}>
                  <HighlightText text={spelling} query={query} />
                </span>
              </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
