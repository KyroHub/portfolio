import type { GrammarFootnoteDocument } from "../../schema.ts";
import {
  grammarLesson01Id,
  grammarLesson01SourceIds,
} from "../lesson-01-ids.ts";

const lessonId = grammarLesson01Id;

export const grammarLesson01CoreFootnotes: readonly GrammarFootnoteDocument[] = [
  {
    id: "grammar.footnote.lesson01.002",
    lessonId,
    content: {
      en: [
        {
          type: "paragraph",
          content: [
            { type: "coptic", text: "Ⲟⲩ-" },
            { type: "text", text: " comes from " },
            { type: "coptic", text: "ⲟⲩⲁⲓ" },
            {
              type: "text",
              text: " (the number “one”). Compare with French un/une (articles), but also: un, deux, trois, ... (numbers).",
            },
          ],
        },
      ],
      nl: [
        {
          type: "paragraph",
          content: [
            { type: "coptic", text: "Ⲟⲩ-" },
            { type: "text", text: " < " },
            { type: "coptic", text: "ⲟⲩⲁⲓ" },
            {
              type: "text",
              text: " (het getal “een”). Vgl. Frans un/une (lidwoorden), maar ook: un, deux, trois, ... (getallen).",
            },
          ],
        },
      ],
    },
    sourceRefs: [grammarLesson01SourceIds.forthcomingBasisgrammatica],
  },
  {
    id: "grammar.footnote.lesson01.003",
    lessonId,
    content: {
      en: [
        {
          type: "paragraph",
          content: [
            { type: "coptic", text: "Ϩⲁⲛ-" },
            { type: "text", text: " comes from " },
            { type: "coptic", text: "ϩⲟⲓ̈ⲛⲉ" },
            {
              type: "text",
              text: " “some”. There is no direct English equivalent for the indefinite plural article ",
            },
            { type: "coptic", text: "ϩⲁⲛ-" },
            { type: "text", text: "." },
          ],
        },
      ],
      nl: [
        {
          type: "paragraph",
          content: [
            { type: "coptic", text: "Ϩⲁⲛ-" },
            { type: "text", text: " < " },
            { type: "coptic", text: "ϩⲟⲓ̈ⲛⲉ" },
            {
              type: "text",
              text: " “sommige”. Er is geen Nederlands equivalent voor het onbepaald meervoud lidwoord ",
            },
            { type: "coptic", text: "ϩⲁⲛ-" },
            { type: "text", text: "." },
          ],
        },
      ],
    },
    sourceRefs: [grammarLesson01SourceIds.forthcomingBasisgrammatica],
  },
  {
    id: "grammar.footnote.lesson01.004",
    lessonId,
    content: {
      en: [
        {
          type: "paragraph",
          content: [
            { type: "coptic", text: "Ⲧ + ⲓ = ϯ" },
            { type: "text", text: ". Therefore: " },
            { type: "coptic", text: "ϯⲥⲱⲛⲓ" },
            { type: "text", text: "." },
          ],
        },
      ],
      nl: [
        {
          type: "paragraph",
          content: [
            { type: "coptic", text: "Ⲧ + ⲓ = ϯ" },
            { type: "text", text: ". Dus: " },
            { type: "coptic", text: "ϯⲥⲱⲛⲓ" },
            { type: "text", text: "." },
          ],
        },
      ],
    },
    sourceRefs: [grammarLesson01SourceIds.forthcomingBasisgrammatica],
  },
  {
    id: "grammar.footnote.lesson01.005",
    lessonId,
    content: {
      en: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "In Coptic, there is no specific word for the neuter “it”.",
            },
          ],
        },
      ],
      nl: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "In het Koptisch is er geen specifiek woord voor “het”.",
            },
          ],
        },
      ],
    },
    sourceRefs: [grammarLesson01SourceIds.forthcomingBasisgrammatica],
  },
  {
    id: "grammar.footnote.lesson01.006",
    lessonId,
    content: {
      en: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "In older church books and presentations, this is often archaically written as ",
            },
            { type: "coptic", text: "ϭⲟⲓⲥ" },
            { type: "text", text: ". The standard modern Bohairic spelling is " },
            { type: "coptic", text: "ϭⲱⲓⲥ" },
            { type: "text", text: "." },
          ],
        },
      ],
      nl: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "In kerkelijke boeken en presentaties wordt dit vaak verouderd geschreven als ",
            },
            { type: "coptic", text: "ϭⲟⲓⲥ" },
            { type: "text", text: ". De standaard Bohairische spelling is " },
            { type: "coptic", text: "ϭⲱⲓⲥ" },
            { type: "text", text: "." },
          ],
        },
      ],
    },
    sourceRefs: [grammarLesson01SourceIds.forthcomingBasisgrammatica],
  },
] as const;
