export type LanguageBadge = "COP" | "NL" | "EN";
export type PublicationSchemaType = "Book" | "ScholarlyArticle" | "CreativeWork";

export interface Publication {
  id: string;
  title: string;
  subtitle?: string;
  lang: LanguageBadge;
  image?: string;
  link?: string;
  comingSoon?: boolean;
  schemaType: PublicationSchemaType;
}

export const publications: Publication[] = [
  {
    id: "holy-bible-coptic",
    title: "The Holy Bible in Coptic",
    lang: "COP",
    image: "/publications/holy-bible-coptic.png",
    link: "https://www.amazon.com/dp/B0CBSKX4CZ",
    comingSoon: false,
    schemaType: "Book",
  },
  {
    id: "basisgrammatica-bohairisch-koptisch",
    title: "Inleiding tot het Bohairisch Koptisch: Basisgrammatica",
    subtitle: "Deel I (3 delen)",
    lang: "NL",
    comingSoon: true,
    schemaType: "Book",
  },
  {
    id: "bohairisch-nederlands-woordenboek",
    title: "Bohairisch–Nederlands Woordenboek: Een Beknopt Lexicon van het Koptisch",
    lang: "NL",
    comingSoon: true,
    schemaType: "Book",
  },
  {
    id: "complex-verb-constructions-coptic",
    title: "Complex Verb Constructions in Coptic: Lexical and Morphological Perspectives from Bohairic and Sahidic",
    lang: "EN",
    comingSoon: true,
    schemaType: "ScholarlyArticle",
  },
  {
    id: "parallel-paradigms-coptic",
    title: "Parallel Paradigms of Bohairic and Sahidic Coptic",
    lang: "EN",
    comingSoon: true,
    schemaType: "ScholarlyArticle",
  },
  {
    id: "tales-and-legends-reader",
    title: "Tales and Legends: A Bohairic Coptic Reader",
    subtitle: "Vol. I",
    lang: "EN",
    comingSoon: true,
    schemaType: "Book",
  },
  {
    id: "speak-with-us-coptic-curriculum",
    title: "Speak with Us: A Bohairic Coptic Curriculum",
    subtitle: "Translated by Kyrillos Wannes",
    lang: "EN",
    comingSoon: true,
    schemaType: "Book",
  },
];
