import type {
  GrammarBlock,
  GrammarConceptDocument,
  GrammarInline,
} from "../../schema.ts";
import {
  grammarLesson01ConceptIds,
  grammarLesson01Id,
  grammarLesson01SourceIds,
} from "../lesson-01-ids.ts";

const text = (value: string): GrammarInline => ({ type: "text", text: value });
const coptic = (value: string): GrammarInline => ({ type: "coptic", text: value });
const paragraph = (...content: GrammarInline[]): GrammarBlock => ({
  type: "paragraph",
  content,
});

export const grammarLesson01CoreConcepts: readonly GrammarConceptDocument[] = [
  {
    id: grammarLesson01ConceptIds.bareNoun,
    title: {
      en: "Bare Noun",
      nl: "Kaal substantief",
    },
    definition: {
      en: [
        paragraph(
          text(
            "A base noun form without an overt determiner prefix. Lesson 1 uses bare nouns as the starting lexical form before determination is added.",
          ),
        ),
      ],
      nl: [
        paragraph(
          text(
            "Een basisvorm van een zelfstandig naamwoord zonder expliciet determinerprefix. Les 1 gebruikt kale substantieven als vertrekvorm voordat determinatie wordt toegevoegd.",
          ),
        ),
      ],
    },
    tags: ["lesson-1", "nouns", "terminology"],
    relatedConceptRefs: [
      grammarLesson01ConceptIds.determinedNoun,
      grammarLesson01ConceptIds.determinerSelection,
      grammarLesson01ConceptIds.zeroDetermination,
    ],
    lessonRefs: [grammarLesson01Id],
    sourceRefs: [grammarLesson01SourceIds.forthcomingBasisgrammatica],
  },
  {
    id: grammarLesson01ConceptIds.determinedNoun,
    title: {
      en: "Determined Noun",
      nl: "Gedetermineerd substantief",
    },
    definition: {
      en: [
        paragraph(
          text(
            "A noun supplied with a determiner, usually as a prefix. In Lesson 1 this covers indefinite, definite, possessive, and demonstrative formations.",
          ),
        ),
      ],
      nl: [
        paragraph(
          text(
            "Een zelfstandig naamwoord dat voorzien is van een determinator, meestal als prefix. In Les 1 omvat dit onbepaalde, bepaalde, bezittelijke en aanwijzende vormen.",
          ),
        ),
      ],
    },
    tags: ["lesson-1", "nouns", "determiners"],
    relatedConceptRefs: [
      grammarLesson01ConceptIds.bareNoun,
      grammarLesson01ConceptIds.determinerSelection,
      grammarLesson01ConceptIds.zeroDetermination,
    ],
    lessonRefs: [grammarLesson01Id],
    sourceRefs: [grammarLesson01SourceIds.forthcomingBasisgrammatica],
  },
  {
    id: grammarLesson01ConceptIds.significantLetters,
    title: {
      en: "Significant Letters",
      nl: "Significante letters",
    },
    definition: {
      en: [
        paragraph(
          text(
            "Recurring masculine, feminine, and plural pattern letters that help predict determiner and pronoun behavior in Bohairic grammar.",
          ),
        ),
      ],
      nl: [
        paragraph(
          text(
            "Terugkerende mannelijke, vrouwelijke en meervoudige patroonletters die helpen om determinator- en voornaamwoordgedrag in de Bohairische grammatica te voorspellen.",
          ),
        ),
      ],
    },
    tags: ["lesson-1", "patterns", "letters"],
    relatedConceptRefs: [
      grammarLesson01ConceptIds.determinerSelection,
      grammarLesson01ConceptIds.independentPersonalPronouns,
    ],
    lessonRefs: [grammarLesson01Id],
    sourceRefs: [grammarLesson01SourceIds.forthcomingBasisgrammatica],
  },
  {
    id: grammarLesson01ConceptIds.determinerSelection,
    title: {
      en: "Determiner Selection",
      nl: "Determinatorkeuze",
    },
    definition: {
      en: [
        paragraph(
          text(
            "The rule-governed selection of determiner prefixes according to masculine, feminine, or plural noun forms and the intended grammatical meaning.",
          ),
        ),
      ],
      nl: [
        paragraph(
          text(
            "De regelmatige keuze van determinerprefixen volgens mannelijke, vrouwelijke of meervoudige naamwoordsvormen en de bedoelde grammaticale betekenis.",
          ),
        ),
      ],
    },
    tags: ["lesson-1", "determiners", "prefixes"],
    relatedConceptRefs: [
      grammarLesson01ConceptIds.significantLetters,
      grammarLesson01ConceptIds.zeroDetermination,
      grammarLesson01ConceptIds.determinedNoun,
    ],
    lessonRefs: [grammarLesson01Id],
    sourceRefs: [grammarLesson01SourceIds.forthcomingBasisgrammatica],
  },
  {
    id: grammarLesson01ConceptIds.zeroDetermination,
    title: {
      en: "Zero-Determination",
      nl: "Nul-determinatie",
    },
    definition: {
      en: [
        paragraph(
          text("A context in which a noun appears without an overt determiner prefix."),
          text(" Lesson 1 highlights "),
          coptic("ⲛⲓⲃⲉⲛ"),
          text(" as a common trigger for this pattern."),
        ),
      ],
      nl: [
        paragraph(
          text(
            "Een context waarin een zelfstandig naamwoord zonder expliciet determinerprefix verschijnt.",
          ),
          text(" Les 1 benadrukt "),
          coptic("ⲛⲓⲃⲉⲛ"),
          text(" als een veelvoorkomende aanleiding voor dit patroon."),
        ),
      ],
    },
    tags: ["lesson-1", "determiners", "exceptions"],
    relatedConceptRefs: [
      grammarLesson01ConceptIds.determinerSelection,
      grammarLesson01ConceptIds.bareNoun,
    ],
    lessonRefs: [grammarLesson01Id],
    sourceRefs: [grammarLesson01SourceIds.forthcomingBasisgrammatica],
  },
  {
    id: grammarLesson01ConceptIds.nexusPronouns,
    title: {
      en: "Nexus Pronouns",
      nl: "Verbindingsvoornaamwoorden",
    },
    definition: {
      en: [
        paragraph(
          text("Postpositive enclitic pronouns such as "),
          text("≡"),
          coptic("ⲡⲉ"),
          text(", "),
          text("≡"),
          coptic("ⲧⲉ"),
          text(", and "),
          text("≡"),
          coptic("ⲛⲉ"),
          text(" that structure the bipartite nominal sentence."),
        ),
      ],
      nl: [
        paragraph(
          text("Postpositieve enclitische voornaamwoorden zoals "),
          text("≡"),
          coptic("ⲡⲉ"),
          text(", "),
          text("≡"),
          coptic("ⲧⲉ"),
          text(" en "),
          text("≡"),
          coptic("ⲛⲉ"),
          text(" die de tweeledige nominale zin structureren."),
        ),
      ],
    },
    tags: ["lesson-1", "pronouns", "syntax"],
    relatedConceptRefs: [
      grammarLesson01ConceptIds.bipartiteNominalSentence,
      grammarLesson01ConceptIds.independentPersonalPronouns,
    ],
    lessonRefs: [grammarLesson01Id],
    sourceRefs: [grammarLesson01SourceIds.forthcomingBasisgrammatica],
  },
  {
    id: grammarLesson01ConceptIds.bipartiteNominalSentence,
    title: {
      en: "Bipartite Nominal Sentence",
      nl: "Tweeledige nominale zin",
    },
    definition: {
      en: [
        paragraph(
          text(
            "A nominal clause pattern that uses a predicate phrase plus a nexus pronoun rather than a present-tense verb “to be”.",
          ),
        ),
      ],
      nl: [
        paragraph(
          text(
            "Een nominaal zinsmodel dat een predicaatwoordgroep plus een verbindingsvoornaamwoord gebruikt in plaats van een tegenwoordige tijd van het werkwoord “zijn”.",
          ),
        ),
      ],
    },
    tags: ["lesson-1", "syntax", "nominal-sentence"],
    relatedConceptRefs: [
      grammarLesson01ConceptIds.nexusPronouns,
      grammarLesson01ConceptIds.independentPersonalPronouns,
    ],
    lessonRefs: [grammarLesson01Id],
    sourceRefs: [grammarLesson01SourceIds.forthcomingBasisgrammatica],
  },
  {
    id: grammarLesson01ConceptIds.independentPersonalPronouns,
    title: {
      en: "Independent Personal Pronouns",
      nl: "Onafhankelijke persoonlijke voornaamwoorden",
    },
    definition: {
      en: [
        paragraph(
          text("Prepositive pronouns such as "),
          coptic("ⲛ̀ⲑⲟϥ"),
          text(", "),
          coptic("ⲛ̀ⲑⲟⲥ"),
          text(", and "),
          coptic("ⲛ̀ⲑⲱⲟⲩ"),
          text(" that can be used for emphasis alongside the standard nexus-pronoun pattern."),
        ),
      ],
      nl: [
        paragraph(
          text("Prepositieve voornaamwoorden zoals "),
          coptic("ⲛ̀ⲑⲟϥ"),
          text(", "),
          coptic("ⲛ̀ⲑⲟⲥ"),
          text(" en "),
          coptic("ⲛ̀ⲑⲱⲟⲩ"),
          text(
            " die gebruikt kunnen worden voor nadruk naast het standaardpatroon met verbindingsvoornaamwoorden.",
          ),
        ),
      ],
    },
    tags: ["lesson-1", "pronouns", "emphasis"],
    relatedConceptRefs: [
      grammarLesson01ConceptIds.nexusPronouns,
      grammarLesson01ConceptIds.bipartiteNominalSentence,
      grammarLesson01ConceptIds.significantLetters,
    ],
    lessonRefs: [grammarLesson01Id],
    sourceRefs: [grammarLesson01SourceIds.forthcomingBasisgrammatica],
  },
  {
    id: grammarLesson01ConceptIds.nominaSacra,
    title: {
      en: "Nomina Sacra",
      nl: "Nomina sacra",
    },
    definition: {
      en: [
        paragraph(
          text(
            "Traditional abbreviations of holy names and liturgical formulas, typically marked with an overline in Coptic manuscripts and church books.",
          ),
        ),
      ],
      nl: [
        paragraph(
          text(
            "Traditionele afkortingen van heilige namen en liturgische formules, meestal gemarkeerd met een bovenstreep in Koptische handschriften en kerkboeken.",
          ),
        ),
      ],
    },
    tags: ["lesson-1", "abbreviations", "liturgical"],
    relatedConceptRefs: [],
    lessonRefs: [grammarLesson01Id],
    sourceRefs: [grammarLesson01SourceIds.forthcomingBasisgrammatica],
  },
] as const;
