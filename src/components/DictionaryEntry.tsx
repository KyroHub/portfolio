"use client";

import Link from 'next/link';
import { antinoou } from '@/lib/fonts';
import type { LexicalEntry } from '@/lib/dictionaryTypes';
import HighlightText from './HighlightText';
import DialectSiglum from './DialectSiglum';
import { useLanguage } from '@/components/LanguageProvider';

type DictionaryEntryCardProps = {
  entry: LexicalEntry;
  query?: string;
  selectedDialect?: string;
  headingLevel?: 'h1' | 'h2';
  linkHeadword?: boolean;
};

export default function DictionaryEntryCard({
  entry,
  query = "",
  selectedDialect = "ALL",
  headingLevel = "h2",
  linkHeadword = true,
}: DictionaryEntryCardProps) {
  const { t } = useLanguage();
  const isDetailView = headingLevel === "h1";
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
  const HeadingTag = headingLevel;
  const headingClassName = `${antinoou.className} ${
    isDetailView ? "text-5xl md:text-6xl" : "text-4xl"
  } text-sky-600 dark:text-sky-400 tracking-wider drop-shadow-sm transition-colors ${
    linkHeadword
      ? 'hover:text-sky-500 dark:hover:text-sky-300 cursor-pointer'
      : ''
  }`;
  const headingContent = (
    <HeadingTag className={headingClassName}>
      <HighlightText text={headerSpelling} query={query} />
    </HeadingTag>
  );

  return (
    <article className={`group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-stone-900/50 backdrop-blur-md border border-stone-200 dark:border-stone-800 shadow-md dark:shadow-lg dark:shadow-black/20 transition-all duration-300 ${
      linkHeadword
        ? "hover:border-stone-300 dark:hover:border-stone-700 hover:bg-white dark:hover:bg-stone-800/50"
        : ""
    } ${isDetailView ? "p-8 md:p-10" : "p-6 md:p-7"}`}>
      <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 bg-sky-500/10 dark:bg-sky-500/10 rounded-full blur-3xl opacity-70" />

      <div className="relative flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
        <div>
          {linkHeadword ? (
            <Link href={`/entry/${entry.id}`} prefetch={false} className="inline-block">
              {headingContent}
            </Link>
          ) : (
            headingContent
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="px-3 py-1 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full text-stone-600 dark:text-stone-300">
            {entry.pos}
          </span>
          {entry.gender && (
            <span className={`px-3 py-1 rounded-full border ${
              entry.gender === 'F'
                ? 'bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-900/50 text-pink-600 dark:text-pink-300'
                : 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-900/50 text-sky-600 dark:text-sky-300'
            }`}>
              {t("entry.gender")}: {entry.gender}
            </span>
          )}
          {primaryDialectKey && (
            <span className="inline-flex min-h-8 items-center px-3.5 py-2 rounded-full border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
              <DialectSiglum siglum={primaryDialectKey} />
            </span>
          )}
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-stone-200 dark:from-stone-800 via-stone-300 dark:via-stone-700 to-stone-200 dark:to-stone-800 mb-6" />

      <div className="mb-6 space-y-3">
        <h3 className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-widest font-semibold">{t("entry.translation")}</h3>
        <ul className={`space-y-2 text-stone-800 dark:text-stone-200 list-disc ml-5 marker:text-sky-500 ${
          isDetailView ? "text-lg md:text-xl" : "text-lg"
        }`}>
          {entry.english_meanings.map((meaning, idx) => (
            <li key={idx} className="leading-relaxed pl-1">
              <HighlightText text={meaning} query={query} emphasizeLeadingLabel />
            </li>
          ))}
        </ul>
        {entry.greek_equivalents.length > 0 && (
          <div className="mt-5 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold">{t("entry.greekEquivalents")}</span>
            <div className="flex flex-wrap gap-2">
              {entry.greek_equivalents.map((gr, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-medium">
                  <HighlightText text={gr} query={query} />
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {remainingDialects.length > 0 && (
        <div className="mt-7 pt-5 border-t border-stone-200 dark:border-stone-800/50">
          <h4 className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-widest font-semibold mb-3">{t("entry.dialectForms")}</h4>
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
              <div key={index} className="flex items-center space-x-3 bg-stone-50/90 dark:bg-stone-950/50 px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800/60">
                <span className="inline-flex min-h-7 items-center text-[10px] bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 px-2.5 py-2 rounded-md font-bold">
                  <DialectSiglum siglum={dialect} />
                </span>
                <span className={`${antinoou.className} text-stone-800 dark:text-stone-300 text-lg`}>
                  <HighlightText text={spelling} query={query} />
                </span>
              </div>
              );
            })}
          </div>
        </div>
      )}

    </article>
  );
}
