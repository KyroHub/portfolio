import { LexicalEntry } from "../../scripts/parseExcel";
import { Publication } from "@/lib/publications";
import { siteConfig } from "@/lib/site";

type JsonLd = Record<string, unknown>;

const dictionaryUrl = absoluteUrl("/dictionary");
const dictionarySetId = `${dictionaryUrl}#defined-term-set`;
const websiteId = `${absoluteUrl("/")}#website`;
const publicationsPageId = `${absoluteUrl("/publications")}#collection-page`;
const publicationsListId = `${absoluteUrl("/publications")}#item-list`;
const entryLeadIns = [
  "intr",
  "tr",
  "auxil",
  "qual",
  "vb",
  "nn",
  "adj",
  "adv",
  "prep",
  "conj",
  "interj",
  "imperative",
  "interrog",
  "neg",
  "obj",
  "dat",
  "ethic",
  "ethical",
  "suff",
  "pref",
  "pronom",
  "subj",
  "nom",
  "acc",
  "gen",
  "pl",
  "sg",
  "art",
  "def",
  "indef",
  "poss",
  "rel",
  "pron",
  "gk",
  "esp",
  "lit",
  "caus",
  "sim",
  "prob",
  "rare",
  "constr",
  "vbal",
  "p.c.",
  "p c",
  "m",
  "f",
];

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.liveUrl).toString();
}

export function toPlainText(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function stripLeadIn(value: string) {
  let cleaned = toPlainText(value.replace(/\[[^\]]+\]/g, ""))
    .replace(/^[|―—–-]+\s*/, "")
    .trim();

  while (cleaned) {
    const lowered = cleaned.toLowerCase();
    const matchedLeadIn = entryLeadIns.find(
      (leadIn) =>
        lowered === leadIn ||
        lowered.startsWith(`${leadIn}:`) ||
        lowered.startsWith(`${leadIn},`) ||
        lowered.startsWith(`${leadIn} `)
    );

    if (!matchedLeadIn) {
      break;
    }

    cleaned = cleaned
      .slice(matchedLeadIn.length)
      .replace(/^[:.,;)\]\s-]+/, "")
      .trim();
  }

  return cleaned;
}

function isPureGrammarLeadIn(value: string) {
  if (!value) {
    return true;
  }

  return (
    /^[(?[a-z]\)?.,\s:-]+$/i.test(value) &&
    !/[\u03e2-\u03ef\u2c80-\u2cff]/i.test(value) &&
    value.split(/\s+/).length <= 4
  );
}

export function getEntrySummary(entry: LexicalEntry) {
  for (const meaning of entry.english_meanings) {
    const candidate = stripLeadIn(meaning);
    if (candidate && !isPureGrammarLeadIn(candidate)) {
      return candidate;
    }
  }

  return "";
}

export function buildEntryDescription(entry: LexicalEntry) {
  const headword = toPlainText(entry.headword);
  const firstMeaning = getEntrySummary(entry);

  return firstMeaning
    ? `${headword} (${entry.pos}) in the Coptic dictionary. ${firstMeaning}.`
    : `${headword} (${entry.pos}) in the Coptic dictionary by Kyrillos Wannes.`;
}

function languageCode(lang: Publication["lang"]) {
  switch (lang) {
    case "COP":
      return "cop";
    case "NL":
      return "nl";
    case "EN":
      return "en";
    default:
      return "en";
  }
}

export function createWebSiteStructuredData(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    url: absoluteUrl("/"),
    name: siteConfig.name,
    alternateName: "Kyrillos Wannes",
    description: siteConfig.description,
    inLanguage: ["en", "nl", "cop"],
    publisher: {
      "@type": "Person",
      name: siteConfig.author.name,
      sameAs: [siteConfig.author.github],
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${dictionaryUrl}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function createDictionaryPageStructuredData(): JsonLd[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${dictionaryUrl}#collection-page`,
      url: dictionaryUrl,
      name: "Coptic Dictionary",
      description:
        "Search the Coptic-English dictionary by Coptic, English, or Greek, with dialect filters, grammatical detail, and a built-in virtual keyboard.",
      isPartOf: {
        "@id": websiteId,
      },
      mainEntity: {
        "@id": dictionarySetId,
      },
      about: [
        {
          "@type": "Language",
          name: "Coptic",
          alternateName: "cop",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      "@id": dictionarySetId,
      url: dictionaryUrl,
      name: "Coptic-English Dictionary",
      description:
        "A digital Coptic dictionary with English and Greek glosses, dialect forms, and grammatical annotations.",
      creator: {
        "@type": "Person",
        name: siteConfig.author.name,
      },
      inLanguage: ["cop", "en", "nl", "el"],
    },
  ];
}

export function createDefinedTermStructuredData(entry: LexicalEntry): JsonLd {
  const headword = toPlainText(entry.headword);
  const alternateNames = Array.from(
    new Set(
      Object.values(entry.dialects)
        .flatMap((forms) => Object.values(forms))
        .map((form) => toPlainText(form))
        .filter(Boolean)
    )
  );
  const additionalProperty = [
    {
      "@type": "PropertyValue",
      name: "Part of speech",
      value: entry.pos,
    },
    entry.gender
      ? {
          "@type": "PropertyValue",
          name: "Gender",
          value: entry.gender,
        }
      : null,
    entry.greek_equivalents.length > 0
      ? {
          "@type": "PropertyValue",
          name: "Greek equivalents",
          value: entry.greek_equivalents.join("; "),
        }
      : null,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": `${absoluteUrl(`/entry/${entry.id}`)}#defined-term`,
    url: absoluteUrl(`/entry/${entry.id}`),
    name: headword,
    alternateName: alternateNames,
    description: buildEntryDescription(entry),
    termCode: entry.id,
    inDefinedTermSet: {
      "@id": dictionarySetId,
    },
    inLanguage: "cop",
    mainEntityOfPage: absoluteUrl(`/entry/${entry.id}`),
    additionalProperty,
  };
}

export function createPublicationsStructuredData(publications: Publication[]): JsonLd[] {
  const works = publications.map((publication) => {
    const anchorUrl = `${absoluteUrl("/publications")}#${publication.id}`;

    return {
      "@context": "https://schema.org",
      "@type": publication.schemaType,
      "@id": anchorUrl,
      url: anchorUrl,
      name: publication.title,
      ...(publication.subtitle
        ? {
            alternativeHeadline: publication.subtitle,
          }
        : {}),
      author: {
        "@type": "Person",
        name: siteConfig.author.name,
      },
      inLanguage: languageCode(publication.lang),
      ...(publication.image
        ? {
            image: absoluteUrl(publication.image),
          }
        : {}),
      ...(publication.link
        ? {
            sameAs: publication.link,
          }
        : {}),
      ...(publication.comingSoon
        ? {
            creativeWorkStatus: "In preparation",
          }
        : {}),
      isPartOf: {
        "@id": publicationsPageId,
      },
    };
  });

  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": publicationsPageId,
      url: absoluteUrl("/publications"),
      name: "Publications",
      description:
        "Books, reference works, and research projects by Kyrillos Wannes, including published and forthcoming Coptic language materials.",
      isPartOf: {
        "@id": websiteId,
      },
      mainEntity: {
        "@id": publicationsListId,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": publicationsListId,
      url: absoluteUrl("/publications"),
      name: "Publications by Kyrillos Wannes",
      itemListElement: works.map((work, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: work.url,
        item: {
          "@id": work["@id"],
        },
      })),
    },
    ...works,
  ];
}
