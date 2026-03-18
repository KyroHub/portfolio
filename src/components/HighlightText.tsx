import React from 'react';

/**
 * Normalizes query string and builds a regex that matches characters
 * along with any following Coptic combining marks.
 */
function buildRegexFromQuery(query: string) {
  if (!query || query.trim() === '') return null;
  
  // Normalize query to prevent double combining marks if the user pasted them
  const nQuery = query.normalize('NFD').replace(/[\u0300-\u036f\uFE20-\uFE2F\u0483-\u0489]/g, "");
  if (nQuery.length === 0) return null;

  // For each character in the normalized query, allow optional combining characters after it.
  const combiningChars = "[\\u0300-\\u036f\\uFE20-\\uFE2F\\u0483-\\u0489]*";
  
  // Escape regex specials just in case the query has English or Greek symbols like ? or .
  const escapeRegex = (s: string) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

  const pattern = nQuery
    .split('')
    .map(char => escapeRegex(char) + combiningChars)
    .join('');

  return new RegExp(`(${pattern})`, 'gi');
}

export default function HighlightText({ text, query, className = "" }: { text: string, query: string, className?: string }) {
  if (!query) {
    return <span className={className}>{text}</span>;
  }

  const regex = buildRegexFromQuery(query);
  if (!regex) {
    return <span className={className}>{text}</span>;
  }

  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-sky-200 dark:bg-sky-500/40 text-sky-900 dark:text-sky-100 rounded-[2px] px-[1px] font-bold">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}
