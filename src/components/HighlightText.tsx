import React, { ReactNode } from 'react';

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

function renderWithSuperscript(text: string): ReactNode {
  if (!text.includes('†')) return text;
  
  const parts = text.split('†');
  const result: ReactNode[] = [];
  
  parts.forEach((part, i) => {
    result.push(part);
    if (i < parts.length - 1) {
      result.push(<sup key={`dagger-${i}`} className="opacity-75">†</sup>);
    }
  });
  
  return <>{result}</>;
}

export default function HighlightText({ text, query, className = "" }: { text: string, query: string, className?: string }) {
  const safeText = text.replace(/<[^>]+>/g, '');

  if (!query) {
    return <span className={className}>{renderWithSuperscript(safeText)}</span>;
  }

  const regex = buildRegexFromQuery(query);
  if (!regex) {
    return <span className={className}>{renderWithSuperscript(safeText)}</span>;
  }

  const parts = safeText.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-sky-200 dark:bg-sky-500/40 text-sky-900 dark:text-sky-100 rounded-[2px] px-[1px] font-bold">
            {renderWithSuperscript(part)}
          </mark>
        ) : (
          <span key={i}>{renderWithSuperscript(part)}</span>
        )
      )}
    </span>
  );
}
