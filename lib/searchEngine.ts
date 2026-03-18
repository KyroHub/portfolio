import { LexicalEntry } from '../scripts/parseExcel';

/**
 * Strips Coptic combining characters (supralinear strokes, jinkims, diaereses)
 * so that we can do broad fuzzy matching.
 */
export function normalizeCoptic(text: string): string {
  if (!text) return "";
  // NFD decomposition separates base characters from combining characters
  // Then we strip the combining characters range.
  return text.normalize('NFD')
    .replace(/[\u0300-\u036f\uFE20-\uFE2F\u0483-\u0489]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Perform a search on the dictionary array
 */
export function searchDictionary(query: string, dictionary: LexicalEntry[]): LexicalEntry[] {
  if (!query || query.trim().length === 0) return [];
  
  const normalizedQuery = normalizeCoptic(query);

  return dictionary.filter(entry => {
    // 1. Check headword
    if (normalizeCoptic(entry.headword).includes(normalizedQuery)) return true;

    // 2. Check dialect spellings
    for (const dialect in entry.dialects) {
      const forms = entry.dialects[dialect];
      const combinedForms = [forms.absolute, forms.nominal, forms.pronominal, forms.stative].filter(Boolean).join(' ');
      if (normalizeCoptic(combinedForms).includes(normalizedQuery)) return true;
    }

    // 3. Check English meanings
    for (const m of entry.english_meanings) {
      if (m.toLowerCase().includes(normalizedQuery)) return true;
    }

    // 4. Check Greek equivalents
    for (const g of entry.greek_equivalents) {
      if (g.toLowerCase().includes(normalizedQuery)) return true;
    }

    return false;
  });
}
