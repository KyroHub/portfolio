"use client";

import type { ReactNode } from "react";
import { cx } from "@/lib/classes";
import { ExerciseForm } from "./ExerciseForm";
import { Footnote } from "./Footnote";
import {
  GrammarLessonCard,
  GrammarLessonSection,
  GrammarLessonTable,
} from "./GrammarLessonPrimitives";
import { getLessonQuestions } from "@/features/grammar/lib/lessonExercises";
import type { Language } from "@/types/i18n";

type Localized<T> = Record<Language, T>;

type VocabularyRow = {
  masculineWord: string;
  masculineMeaning: Localized<string>;
  feminineWord: string;
  feminineMeaning: Localized<string>;
};

type SignificantLetterGroup = {
  label: Localized<ReactNode>;
  letters: ReadonlyArray<
    | {
        glyph: string;
        sound: string;
      }
    | null
  >;
};

type DeterminerRow = {
  type: Localized<string>;
  cells: Localized<readonly ReactNode[]>;
};

type Example = {
  coptic: ReactNode;
  translation: Localized<ReactNode>;
};

type PronounChip = {
  coptic: string;
  gender: Localized<string>;
  meaning: Localized<string>;
};

type AbbreviationPhrase = {
  abbreviation: string;
  expansion: string;
  meaning: Localized<string>;
};

type AbbreviationRow = {
  fullWord: Localized<ReactNode>;
  abbreviation: string;
  meaning: Localized<ReactNode>;
};

type Lesson01ContentProps = {
  language: Language;
};

const localized = <T,>(en: T, nl: T): Localized<T> => ({ en, nl });

type SmallCapsProps = {
  children: ReactNode;
  as?: "span" | "sup";
  className?: string;
};

function SmallCaps({
  children,
  as = "span",
  className,
}: SmallCapsProps) {
  const Component = as;

  return <Component className={cx("small-caps", className)}>{children}</Component>;
}

const vocabularyRows: readonly VocabularyRow[] = [
  {
    masculineWord: "Ⲣⲱⲙⲓ",
    masculineMeaning: localized("“man, human”", "“man, mens”"),
    feminineWord: "Ⲥ̀ϩⲓⲙⲓ",
    feminineMeaning: localized("“woman, wife”", "“vrouw, echtgenote”"),
  },
  {
    masculineWord: "Ⲓⲱⲧ",
    masculineMeaning: localized("“father”", "“vader”"),
    feminineWord: "Ⲙⲁⲩ",
    feminineMeaning: localized("“mother”", "“moeder”"),
  },
  {
    masculineWord: "Ⲥⲟⲛ",
    masculineMeaning: localized("“brother”", "“broer”"),
    feminineWord: "Ⲥⲱⲛⲓ",
    feminineMeaning: localized("“sister”", "“zus”"),
  },
  {
    masculineWord: "Ϣⲏⲣⲓ",
    masculineMeaning: localized("“son”", "“zoon”"),
    feminineWord: "Ϣⲉⲣⲓ",
    feminineMeaning: localized("“daughter”", "“dochter”"),
  },
  {
    masculineWord: "Ⲕⲁϩⲓ",
    masculineMeaning: localized("“earth”", "“aarde”"),
    feminineWord: "Ⲫⲉ",
    feminineMeaning: localized("“heaven, sky”", "“hemel”"),
  },
  {
    masculineWord: "Ⲁⲅⲓⲟⲥ",
    masculineMeaning: localized("“saint”", "“heilige, sint”"),
    feminineWord: "Ⲉⲕⲕ̀ⲗⲏⲥⲓⲁ̀",
    feminineMeaning: localized("“church”", "“kerk”"),
  },
  {
    masculineWord: "Ϯⲙⲓ",
    masculineMeaning: localized("“village”", "“dorp”"),
    feminineWord: "Ⲡⲟⲗⲓⲥ",
    feminineMeaning: localized("“city”", "“stad”"),
  },
] as const;

const significantLetterGroups: readonly SignificantLetterGroup[] = [
  {
    label: localized(
      <>
        Masculine <SmallCaps>m</SmallCaps>:
      </>,
      <>
        Mannelijk <SmallCaps>m</SmallCaps>:
      </>
    ),
    letters: [
      { glyph: "ⲡ", sound: "/p/" },
      { glyph: "ⲫ", sound: "/pʰ/" },
      { glyph: "ϥ", sound: "/f/" },
    ],
  },
  {
    label: localized(
      <>
        Feminine <SmallCaps>f</SmallCaps>:
      </>,
      <>
        Vrouwelijk <SmallCaps>v</SmallCaps>:
      </>
    ),
    letters: [
      { glyph: "ⲧ", sound: "/t/" },
      { glyph: "ⲑ", sound: "/tʰ/" },
      { glyph: "ⲥ", sound: "/s/" },
    ],
  },
  {
    label: localized(
      <>
        Plural <SmallCaps>p</SmallCaps>
        <Footnote
          number={1}
          align="left"
          content={
            <>
              <SmallCaps>p</SmallCaps> stands for plural.
            </>
          }
        />
        :
      </>,
      <>
        Meervoud <SmallCaps>p</SmallCaps>
        <Footnote
          number={1}
          align="left"
          content={
            <>
              <SmallCaps>p</SmallCaps> voor pluralis (meervoud).
            </>
          }
        />
        :
      </>
    ),
    letters: [{ glyph: "ⲛ", sound: "/n/" }, null, { glyph: "ⲟⲩ", sound: "/u, w/" }],
  },
] as const;

const determinerRows: readonly DeterminerRow[] = [
  {
    type: localized("Indefinite", "Onbepaald"),
    cells: {
      en: [
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲟⲩ</strong>ⲥⲟⲛ
          </span>
          <Footnote
            number={2}
            content={
              <>
                <span className="font-coptic">Ⲟⲩ-</span> comes from{" "}
                <span className="font-coptic">ⲟⲩⲁⲓ</span> (the number “one”). Compare with
                French un/une (articles), but also: un, deux, trois, ... (numbers).
              </>
            }
          />{" "}
          “a brother”
        </>,
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲟⲩ</strong>ⲥⲱⲛⲓ
          </span>{" "}
          “a sister”
        </>,
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ϩⲁⲛ</strong>ⲥⲱⲛⲓ
          </span>
          <Footnote
            number={3}
            content={
              <>
                <span className="font-coptic">Ϩⲁⲛ-</span> comes from{" "}
                <span className="font-coptic">ϩⲟⲓ̈ⲛⲉ</span> “some”. There is no direct English
                equivalent for the indefinite plural article{" "}
                <span className="font-coptic">ϩⲁⲛ-</span>.
              </>
            }
          />{" "}
          “sisters”
        </>,
      ],
      nl: [
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲟⲩ</strong>ⲥⲟⲛ
          </span>
          <Footnote
            number={2}
            content={
              <>
                <span className="font-coptic">Ⲟⲩ-</span> &lt;{" "}
                <span className="font-coptic">ⲟⲩⲁⲓ</span> (het getal “een”). Vgl. Frans un/une
                (lidwoorden), maar ook: un, deux, trois, ... (getallen).
              </>
            }
          />{" "}
          “een broer”
        </>,
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲟⲩ</strong>ⲥⲱⲛⲓ
          </span>{" "}
          “een zus”
        </>,
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ϩⲁⲛ</strong>ⲥⲱⲛⲓ
          </span>
          <Footnote
            number={3}
            content={
              <>
                <span className="font-coptic">Ϩⲁⲛ-</span> &lt;{" "}
                <span className="font-coptic">ϩⲟⲓ̈ⲛⲉ</span> “sommige”. Er is geen Nederlands
                equivalent voor het onbepaald meervoud lidwoord{" "}
                <span className="font-coptic">ϩⲁⲛ-</span>.
              </>
            }
          />{" "}
          “zussen”
        </>,
      ],
    },
  },
  {
    type: localized("Definite (long)", "Bepaald (lang)"),
    cells: {
      en: [
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲡⲓ</strong>ⲥⲟⲛ
          </span>{" "}
          “the brother”
        </>,
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ϯ</strong>ⲥⲱⲛⲓ
          </span>
          <Footnote
            number={4}
            content={
              <>
                <span className="font-coptic">Ⲧ + ⲓ = ϯ</span>. Therefore:{" "}
                <span className="font-coptic">ϯⲥⲱⲛⲓ</span>.
              </>
            }
          />{" "}
          “the sister”
        </>,
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲛⲓ</strong>ⲥⲱⲛⲓ
          </span>{" "}
          “the sisters”
        </>,
      ],
      nl: [
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲡⲓ</strong>ⲥⲟⲛ
          </span>{" "}
          “de broer”
        </>,
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ϯ</strong>ⲥⲱⲛⲓ
          </span>
          <Footnote
            number={4}
            content={
              <>
                <span className="font-coptic">Ⲧ + ⲓ = ϯ</span>. Dus:{" "}
                <span className="font-coptic">ϯⲥⲱⲛⲓ</span>.
              </>
            }
          />{" "}
          “de zus”
        </>,
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲛⲓ</strong>ⲥⲱⲛⲓ
          </span>{" "}
          “de zussen”
        </>,
      ],
    },
  },
  {
    type: localized("Definite (short)", "Bepaald (kort)"),
    cells: {
      en: [
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲡ̀</strong>ⲥⲟⲛ
          </span>{" "}
          “the brother”
        </>,
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲧ̀</strong>ⲥⲱⲛⲓ
          </span>{" "}
          “the sister”
        </>,
        <span key="no-short-form-en" className="italic text-stone-500">
          (No short form)
        </span>,
      ],
      nl: [
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲡ̀</strong>ⲥⲟⲛ
          </span>{" "}
          “de broer”
        </>,
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲧ̀</strong>ⲥⲱⲛⲓ
          </span>{" "}
          “de zus”
        </>,
        <span key="no-short-form-nl" className="italic text-stone-500">
          (Geen korte vorm)
        </span>,
      ],
    },
  },
  {
    type: localized("Possessive", "Bezittelijk"),
    cells: {
      en: [
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲡⲁ</strong>ⲥⲟⲛ
          </span>{" "}
          “my brother”
        </>,
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲧⲁ</strong>ⲥⲱⲛⲓ
          </span>{" "}
          “my sister”
        </>,
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲛⲁ</strong>ⲥⲱⲛⲓ
          </span>{" "}
          “my sisters”
        </>,
      ],
      nl: [
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲡⲁ</strong>ⲥⲟⲛ
          </span>{" "}
          “mijn broer”
        </>,
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲧⲁ</strong>ⲥⲱⲛⲓ
          </span>{" "}
          “mijn zus”
        </>,
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲛⲁ</strong>ⲥⲱⲛⲓ
          </span>{" "}
          “mijn zussen”
        </>,
      ],
    },
  },
  {
    type: localized("Demonstrative", "Aanwijzend"),
    cells: {
      en: [
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲡⲁⲓ</strong>ⲥⲟⲛ
          </span>{" "}
          “this brother”
        </>,
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲧⲁⲓ</strong>ⲥⲱⲛⲓ
          </span>{" "}
          “this sister”
        </>,
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲛⲁⲓ</strong>ⲥⲱⲛⲓ
          </span>{" "}
          “these sisters”
        </>,
      ],
      nl: [
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲡⲁⲓ</strong>ⲥⲟⲛ
          </span>{" "}
          “deze broer”
        </>,
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲧⲁⲓ</strong>ⲥⲱⲛⲓ
          </span>{" "}
          “deze zus”
        </>,
        <>
          <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">
            <strong className="font-bold">Ⲛⲁⲓ</strong>ⲥⲱⲛⲓ
          </span>{" "}
          “deze zussen”
        </>,
      ],
    },
  },
] as const;

const zeroDeterminationExamples: readonly Example[] = [
  {
    coptic: (
      <>
        <sup className="text-sm font-semibold">Ø</sup>-<span className="font-coptic text-lg">ⲣⲱⲙⲓ ⲛⲓⲃⲉⲛ</span>
      </>
    ),
    translation: localized("“every man”", "“iedere mens”"),
  },
  {
    coptic: (
      <>
        <sup className="text-sm font-semibold">Ø</sup>-<span className="font-coptic text-lg">ⲥ̀ϩⲓⲙⲓ ⲛⲓⲃⲉⲛ</span>
      </>
    ),
    translation: localized("“every woman”", "“elke vrouw”"),
  },
  {
    coptic: (
      <>
        <sup className="text-sm font-semibold">Ø</sup>-<span className="font-coptic text-lg">ⲁⲅⲓⲟⲥ ⲛⲓⲃⲉⲛ</span>
      </>
    ),
    translation: localized("“every saint”", "“iedere heilige”"),
  },
  {
    coptic: (
      <>
        <sup className="text-sm font-semibold">Ø</sup>-<span className="font-coptic text-lg">ⲉⲕⲕ̀ⲗⲏⲥⲓⲁ̀ ⲛⲓⲃⲉⲛ</span>
      </>
    ),
    translation: localized("“every church”", "“iedere kerk”"),
  },
] as const;

const nexusPronouns: readonly PronounChip[] = [
  {
    coptic: "ⲡⲉ",
    gender: localized("m", "m"),
    meaning: localized("“he, it”", "“hij, het”"),
  },
  {
    coptic: "ⲧⲉ",
    gender: localized("f", "v"),
    meaning: localized("“she, it”", "“zij, het”"),
  },
  {
    coptic: "ⲛⲉ",
    gender: localized("p", "p"),
    meaning: localized("“they”", "“zij, het”"),
  },
] as const;

const nominalSentenceExamples: readonly Example[] = [
  { coptic: <span className="font-coptic text-xl">Ⲟⲩⲓⲱⲧ ⲡⲉ.</span>, translation: localized("“He is a father.”", "“Hij is een vader.”") },
  { coptic: <span className="font-coptic text-xl">Ⲡⲁⲓⲱⲧ ⲡⲉ.</span>, translation: localized("“He is my father.”", "“Hij is mijn vader.”") },
  { coptic: <span className="font-coptic text-xl">Ⲡⲁⲓⲓⲱⲧ ⲡⲉ.</span>, translation: localized("“It is this father.”", "“Het is deze vader.”") },
  { coptic: <span className="font-coptic text-xl">Ⲧⲁⲙⲁⲩ ⲧⲉ.</span>, translation: localized("“She is my mother.”", "“Zij is mijn moeder.”") },
  { coptic: <span className="font-coptic text-xl">Ⲟⲩⲥ̀ϩⲓⲙⲓ ⲧⲉ.</span>, translation: localized("“She is a woman.”", "“Zij is een vrouw.”") },
  { coptic: <span className="font-coptic text-xl">Ϩⲁⲛⲥⲱⲛⲓ ⲛⲉ.</span>, translation: localized("“They are sisters.”", "“Zij zijn zussen.”") },
  { coptic: <span className="font-coptic text-xl">Ϩⲁⲛⲣⲱⲙⲓ ⲛⲉ.</span>, translation: localized("“They are men.”", "“Het zijn mannen.”") },
  { coptic: <span className="font-coptic text-xl">Ⲛⲓⲁⲅⲓⲟⲥ ⲛⲉ.</span>, translation: localized("“They are the saints.”", "“Het zijn de heiligen.”") },
] as const;

const independentPronouns: readonly PronounChip[] = [
  {
    coptic: "Ⲛ̀ⲑⲟϥ",
    gender: localized("m", "m"),
    meaning: localized("“he, it”", "“hij, het”"),
  },
  {
    coptic: "Ⲛ̀ⲑⲟⲥ",
    gender: localized("f", "v"),
    meaning: localized("“she, it”", "“zij, het”"),
  },
  {
    coptic: "Ⲛ̀ⲑⲱⲟⲩ",
    gender: localized("p", "p"),
    meaning: localized("“they”", "“zij, het”"),
  },
] as const;

const independentExamples: readonly Example[] = [
  {
    coptic: (
      <>
        <span className="font-coptic text-xl">Ⲛ̀ⲑⲟ<span className="underline decoration-2 underline-offset-4">ϥ</span></span>,{" "}
        <span className="font-coptic text-lg">
          <span className="underline decoration-2 underline-offset-4">ⲡ</span>ⲁⲓⲱⲧ{" "}
          <span className="underline decoration-2 underline-offset-4">ⲡ</span>ⲉ.
        </span>
      </>
    ),
    translation: localized("“He is my father.”", "“Hij is mijn vader.”"),
  },
  {
    coptic: (
      <>
        <span className="font-coptic text-xl">Ⲛ̀ⲑⲟ<span className="underline decoration-2 underline-offset-4">ⲥ</span></span>,{" "}
        <span className="font-coptic text-lg">
          <span className="underline decoration-2 underline-offset-4">ⲧ</span>ⲁⲙⲁⲩ{" "}
          <span className="underline decoration-2 underline-offset-4">ⲧ</span>ⲉ.
        </span>
      </>
    ),
    translation: localized("“She is my mother.”", "“Zij is mijn moeder.”"),
  },
  {
    coptic: (
      <>
        <span className="font-coptic text-xl">Ⲛ̀ⲑⲱ<span className="underline decoration-2 underline-offset-4">ⲟⲩ</span></span>,{" "}
        <span className="font-coptic text-lg">
          <span className="underline decoration-2 underline-offset-4">ⲛ</span>ⲁⲥⲱⲛⲓ{" "}
          <span className="underline decoration-2 underline-offset-4">ⲛ</span>ⲉ.
        </span>
      </>
    ),
    translation: localized("“They are my sisters.”", "“Zij zijn mijn zussen.”"),
  },
] as const;

const abbreviationPhrases: readonly AbbreviationPhrase[] = [
  {
    abbreviation: "ⲕ̅ⲉ̅",
    expansion: "ⲕⲩⲣⲓⲉ̀ ⲉⲗⲏⲥⲟⲛ",
    meaning: localized("“Lord have mercy”", "“heer ontferm U”"),
  },
  {
    abbreviation: "ⲭ︦ⲉ︦",
    expansion: "ⲭⲉⲣⲉ ⲛⲉ Ⲙⲁⲣⲓⲁ",
    meaning: localized("“Hail Mary”", "“wees gegroet Maria”"),
  },
  {
    abbreviation: "ⲛ︦ⲧ︦ⲉ︦ϥ︦",
    expansion: "ⲛ̀ⲧⲉϥⲭⲁ ⲛⲉⲛⲛⲟⲃⲓⲛⲁⲛ ⲉ̀ⲃⲟⲗ",
    meaning: localized("“to forgive us our sins”", "“om onze zonden te vergeven”"),
  },
  {
    abbreviation: "ⲧ︦ⲱ︦ⲃ︦",
    expansion: "ⲧⲱⲃϩ ⲙ̀Ⲡ̀ϭⲱⲓⲥ ⲉ̀ϩ̀ⲣⲏⲓ ⲉ̀ϫⲱⲛ",
    meaning: localized("“pray to the Lord for us”", "“bid tot de Heer voor ons”"),
  },
] as const;

const abbreviationRows: readonly AbbreviationRow[] = [
  {
    fullWord: localized(
      <span className="font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲁⲗⲗⲏⲗⲟⲩⲓⲁ̀</span>,
      <span className="font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲁⲗⲗⲏⲗⲟⲩⲓⲁ̀</span>
    ),
    abbreviation: "ⲁ̅ⲗ̅",
    meaning: localized("“hallelujah”", "“halleluja”"),
  },
  {
    fullWord: localized(
      <span className="font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲁ̀ⲙⲏⲛ</span>,
      <span className="font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲁ̀ⲙⲏⲛ</span>
    ),
    abbreviation: "ⲁ̅ⲙ̅",
    meaning: localized("“amen”", "“amen”"),
  },
  {
    fullWord: localized(
      <>
        <span className="font-coptic text-xl">Ⲥⲱⲧⲏⲣ</span>{" "}
        <SmallCaps>m</SmallCaps>
      </>,
      <>
        <span className="font-coptic text-xl">Ⲥⲱⲧⲏⲣ</span>{" "}
        <SmallCaps>m</SmallCaps>
      </>
    ),
    abbreviation: "ⲥ̅ⲱ̅ⲣ̅, ⲥ̅ⲣ̅",
    meaning: localized("“savior”", "“verlosser”"),
  },
  {
    fullWord: localized(
      <>
        <span className="font-coptic text-xl">Ϭⲱⲓⲥ</span>{" "}
        <SmallCaps>m</SmallCaps>
        <Footnote
          number={6}
          content={
            <>
              In older church books and presentations, this is often archaically written as{" "}
              <span className="font-coptic">ϭⲟⲓⲥ</span>. The standard modern Bohairic spelling is{" "}
              <span className="font-coptic">ϭⲱⲓⲥ</span>.
            </>
          }
        />
      </>,
      <>
        <span className="font-coptic text-xl">Ϭⲱⲓⲥ</span>{" "}
        <SmallCaps>m</SmallCaps>
        <Footnote
          number={6}
          content={
            <>
              In kerkelijke boeken en presentaties wordt dit vaak verouderd geschreven als{" "}
              <span className="font-coptic">ϭⲟⲓⲥ</span>. De standaard Bohairische spelling is{" "}
              <span className="font-coptic">ϭⲱⲓⲥ</span>.
            </>
          }
        />
      </>
    ),
    abbreviation: "͞⳪̅, ϭ̅ⲥ̅",
    meaning: localized("“lord, lady”", "“heer, dame”"),
  },
  {
    fullWord: localized(
      <>
        <span className="font-coptic text-xl">Ⲕⲩⲣⲓⲟⲥ (-ⲉ̀)</span>{" "}
        <SmallCaps>m</SmallCaps>
      </>,
      <>
        <span className="font-coptic text-xl">Ⲕⲩⲣⲓⲟⲥ (-ⲉ̀)</span>{" "}
        <SmallCaps>m</SmallCaps>
      </>
    ),
    abbreviation: "ⲕ̅ⲉ̅",
    meaning: localized("“lord”", "“heer”"),
  },
  {
    fullWord: localized(
      <span className="font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲭⲉⲣⲉ</span>,
      <span className="font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲭⲉⲣⲉ</span>
    ),
    abbreviation: "ⲭ̅ⲉ̅",
    meaning: localized("“hail / greetings”", "“gegroet”"),
  },
  {
    fullWord: localized(
      <>
        <span className="font-coptic text-xl">Ⲓⲏⲥⲟⲩⲥ</span>{" "}
        <span>
          N
          <SmallCaps as="sup" className="italic">
            m
          </SmallCaps>
        </span>
        <Footnote
          number={7}
          content={
            <>
              N
              <SmallCaps as="sup" className="italic">
                m
              </SmallCaps>{" "}
              is the abbreviation/symbol for a Nomen (proper noun/name).
            </>
          }
        />
      </>,
      <>
        <span className="font-coptic text-xl">Ⲓⲏⲥⲟⲩⲥ</span>{" "}
        <span>
          N
          <SmallCaps as="sup" className="italic">
            m
          </SmallCaps>
        </span>
        <Footnote
          number={7}
          content={
            <>
              N
              <SmallCaps as="sup" className="italic">
                m
              </SmallCaps>{" "}
              is de afkorting/symbool voor een Nomen (eigennaam).
            </>
          }
        />
      </>
    ),
    abbreviation: "Ⲓⲏ̅ⲥ̅, Ⲓⲥ̅, Ⲓ᷍ⲥ",
    meaning: localized(<i>Jesus</i>, <i>Jezus</i>),
  },
  {
    fullWord: localized(
      <>
        <span className="font-coptic text-xl">Ⲡⲓⲭⲣⲓⲥⲧⲟⲥ</span>{" "}
        <span>
          N
          <SmallCaps as="sup" className="italic">
            m
          </SmallCaps>
        </span>
      </>,
      <>
        <span className="font-coptic text-xl">Ⲡⲓⲭⲣⲓⲥⲧⲟⲥ</span>{" "}
        <span>
          N
          <SmallCaps as="sup" className="italic">
            m
          </SmallCaps>
        </span>
      </>
    ),
    abbreviation: "Ⲡⲭ̅ⲥ̅, Ⲡⲭ᷍ⲥ",
    meaning: localized(<i>Christ</i>, <i>Christus</i>),
  },
  {
    fullWord: localized(
      <>
        <span className="font-coptic text-xl">Ⲡ̀ⲛⲉⲩⲙⲁ</span>{" "}
        <SmallCaps>m</SmallCaps>
      </>,
      <>
        <span className="font-coptic text-xl">Ⲡ̀ⲛⲉⲩⲙⲁ</span>{" "}
        <SmallCaps>m</SmallCaps>
      </>
    ),
    abbreviation: "ⲡ̅ⲛ̅ⲁ̅",
    meaning: localized("“spirit”", "“geest”"),
  },
  {
    fullWord: localized(
      <span className="font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲉ̀ⲑⲟⲩⲁⲃ</span>,
      <span className="font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲉ̀ⲑⲟⲩⲁⲃ</span>
    ),
    abbreviation: "ⲉ̅ⲑ̅ⲩ̅, ⲉ̅ⲑ̅",
    meaning: localized("“holy”", "“heilig”"),
  },
  {
    fullWord: localized(
      <span className="font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲫ̀ⲛⲟⲩϯ</span>,
      <span className="font-coptic text-xl text-emerald-600 dark:text-emerald-400">Ⲫ̀ⲛⲟⲩϯ</span>
    ),
    abbreviation: "ⲫ︦ϯ︦, ⲫ᷍ϯ, ⲫ̀ϯ",
    meaning: localized("“(the) God”", "“(de) God”"),
  },
] as const;

const copy = {
  definitionsTitle: localized("Definitions", "Definities"),
  definitionItems: localized(
    [
      <>
        <strong>A bare noun</strong> is a base word without any form of determination
        (definiteness), which often takes the form of prefixes.
      </>,
      <>
        <strong>A determined (definite) noun</strong> is provided with a determiner,
        frequently in the form of a prefix.
      </>,
    ],
    [
      <>
        <strong>Een kaal substantief</strong> (zelfstandig naamwoord) is een basiswoord
        zonder enige vorm van determinatie (bepaaldheid), vaak in de vorm van prefixen
        (voorvoegsels).
      </>,
      <>
        <strong>Een gedetermineerd (bepaald) substantief</strong> is voorzien van een
        determinator (bepaler), vaak in de vorm van een voorvoegsel.
      </>,
    ]
  ),
  vocabularyTitle: localized(
    "Vocabulary: Bare Nouns",
    "Woordenschat: Kale zelfstandige naamwoorden"
  ),
  significantLettersTitle: localized("Significant Letters", "Significante letters"),
  significantLettersIntro: localized(
    "These letters are called significant because they keep recurring throughout Coptic grammar and often form the basis of Coptic pattern grammar. The next section on determiners already offers a first practical application of them.",
    "Deze letters heten significant omdat ze voortdurend terugkeren in de Koptische grammatica en vaak de basis vormen van de Koptische patroongrammatica. De volgende paragraaf over de determinatoren toont meteen een eerste concrete toepassing."
  ),
  determinerTitle: localized(
    "Determiner Selection (Prefixes)",
    "Selectie determinators (bepalers of voorvoegsels)"
  ),
  determinerExampleWords: localized(
    "Example words:",
    "Voorbeeldwoorden:"
  ),
  determinerNote: localized(
    <>
      Note: <span className="font-coptic">ⲡⲓ-</span> and <span className="font-coptic">ⲡ̀-</span> are
      synonyms. We refer to them as long vs. short definite articles.
    </>,
    <>
      Opmerking: <span className="font-coptic">ⲡⲓ-</span> en{" "}
      <span className="font-coptic">ⲡ̀-</span> zijn synoniemen. We spreken van lange vs. kort
      bepaalde lidwoorden.
    </>
  ),
  zeroDeterminationTitle: localized("Zero-Determination", "Nul-determinatie"),
  zeroDeterminationIntro: localized(
    <>
      Coptic is a highly determined language. Often (90% of the time), nouns are provided
      with a determiner (prefix). However, there are a few exceptions where nouns can
      appear without a determiner. This occurs, for example, with the quantifier{" "}
      <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">ⲛⲓⲃⲉⲛ</span>{" "}
      “every/each”.
    </>,
    <>
      Het Koptisch is een hoog-gedetermineerde taal. Vaak (90% van de gevallen) worden
      zelfstandige naamwoorden dus van een determinator (voorvoegsel) voorzien. Er zijn
      enkele uitzonderingen waar zelfstandige naamwoorden toch zonder determinator kunnen
      voorkomen. Dit doet zich bijvoorbeeld voor met het hoeveelheidswoord{" "}
      <span className="font-coptic text-lg text-emerald-600 dark:text-emerald-400">ⲛⲓⲃⲉⲛ</span>{" "}
      “elk/ieder”.
    </>
  ),
  nominalSentenceTitle: localized(
    "Bipartite Nominal Sentence (Predicate + Subject)",
    "Tweeledige nominale zin (gezegde + onderwerp)"
  ),
  nominalSentenceIntro: localized(
    <>
      There are three nexus pronouns in Coptic. They only appear after the first word
      (or the first phrase) of the sentence. We call these words postpositive (placed
      after) or enclitic (leaning on the preceding word), which means that in writing they
      can also be attached as a single unit to the preceding word. We mark these with the
      symbol ‘≡’.
    </>,
    <>
      Er zijn drie verbindingsvoornaamwoorden in het Koptisch. Ze verschijnen pas na het
      eerste woord (of de eerste woordgroep) van de zin. We noemen deze woorden
      postpositief (achter geplaatst) of enclitisch (aanleunend tegen het voorgaande
      woord), wat betekent dat ze in de schrijfwijze ook als een geheel aan het voorgaande
      woord vast kunnen staan. We markeren deze met het symbool ‘≡’.
    </>
  ),
  nominalSentenceNote: localized(
    <>
      By convention, we usually leave a space before them, even though they may also be
      written together with the previous word. So{" "}
      <span className="font-coptic">ⲟⲩⲓⲱⲧ ⲡⲉ</span> and{" "}
      <span className="font-coptic">ⲟⲩⲓⲱⲧⲡⲉ</span> mean the same thing.
    </>,
    <>
      Volgens de conventie laten we er meestal een spatie voor staan, ook al kunnen ze
      ook direct aan het vorige woord vast geschreven worden. Dus{" "}
      <span className="font-coptic">ⲟⲩⲓⲱⲧ ⲡⲉ</span> en{" "}
      <span className="font-coptic">ⲟⲩⲓⲱⲧⲡⲉ</span> betekenen hetzelfde.
    </>
  ),
  applicationsTitle: localized("Applications", "Toepassingen"),
  applicationsIntro: localized(
    "In Coptic (just like in Semitic languages such as Hebrew or Arabic), there is no verb ‘to be’ in the present tense. However, in English, we are required to use it, otherwise the translation is incorrect.",
    "In het Koptisch (net zoals in Semitische talen zoals Hebreeuws of Arabisch) is er geen werkwoord ‘zijn’. Maar in het Nederlands zijn we verplicht om het te gebruiken, anders is de vertaling fout."
  ),
  independentPronounsTitle: localized(
    "Independent Personal Pronouns",
    "Onafhankelijke persoonlijke voornaamwoorden"
  ),
  independentPronounsIntro: localized(
    "Besides the nexus pronouns, there are also independent personal pronouns. In a bipartite nominal sentence, using the nexus pronouns is the standard (mandatory) rule. To emphasize such nominal sentences, one can also incorporate the independent personal pronouns. These are prepositive (placed before):",
    "Naast de verbindingsvoornaamwoorden bestaan er ook de onafhankelijke persoonlijke voornaamwoorden. Bij de tweeledige nominale zin is het gebruik van de verbindingsvoornaamwoorden de standaard (verplicht). Voor het benadrukken van zulke nominale zinnen kan men ook de onafhankelijke persoonlijke voornaamwoorden inschakelen. Deze zijn prepositief:"
  ),
  exampleLabel: localized("Examples", "Voorbeelden"),
  independentPronounNote: localized(
    "The underlined letters are significant letters.",
    "De onderlijnde letters zijn significante letters."
  ),
  abbreviationsTitle: localized("Abbreviations", "Afkortingen"),
  abbreviationsIntro: localized(
    "In Coptic literature, several common abbreviations are used, mostly to indicate holy names (‘nomina sacra’). The conventional way to represent abbreviations in Coptic is by placing a horizontal line above the abbreviated word.",
    "In de Koptische literatuur worden enkele veelvoorkomende afkortingen gebruikt, meestal om heilige namen (‘nomina sacra’). De conventionele manier om afkortingen in het Koptisch weer te geven, is door een horizontale lijn boven het afgekorte woord te plaatsen."
  ),
  abbreviationsContext: localized(
    "In a liturgical context, word abbreviations can also sometimes refer to common phrases:",
    "In een liturgische context kunnen woordafkortingen ook soms naar veelvoorkomende zinnen verwijzen:"
  ),
  exerciseTitle: localized("Exercise 01", "Oefeningen"),
  exercisePrompt: localized(
    "Translate the following nominal expressions into Coptic (one solution is sufficient).",
    "Vertaal de volgende nominale uitdrukkingen in het Koptisch (een oplossing is voldoende)."
  ),
} as const;

function renderLocalized<T>(language: Language, value: Localized<T>) {
  return value[language];
}

function renderSignificantLetterCard(
  letter: { glyph: string; sound: string } | null,
  key: string
) {
  if (!letter) {
    return (
      <div
        key={key}
        className="rounded-lg border border-dashed border-stone-200 bg-white/50 px-3 py-2 text-center dark:border-stone-800 dark:bg-stone-950/30"
      >
        <div className="text-2xl text-stone-400 dark:text-stone-500">-</div>
        <div className="mt-1 text-sm text-stone-400 dark:text-stone-500">no form</div>
      </div>
    );
  }

  return (
    <div
      key={key}
      className="rounded-lg border border-stone-200 bg-white/70 px-3 py-2 text-center dark:border-stone-800 dark:bg-stone-950/40"
    >
      <div className="font-coptic text-2xl text-emerald-600 dark:text-emerald-400">
        {letter.glyph}
      </div>
      <div className="mt-1 text-sm text-stone-500 dark:text-stone-400">{letter.sound}</div>
    </div>
  );
}

function renderPronounChip(language: Language, item: PronounChip) {
  return (
    <li
      key={item.coptic}
      className="rounded-lg bg-stone-100 px-4 py-2 dark:bg-stone-800"
    >
      <span className="font-coptic text-xl text-emerald-600 dark:text-emerald-400">
        {item.coptic}
      </span>{" "}
      <SmallCaps>{renderLocalized(language, item.gender)}</SmallCaps>{" "}
      {renderLocalized(language, item.meaning)}
    </li>
  );
}

export function Lesson01Content({ language }: Lesson01ContentProps) {
  return (
    <div className="space-y-10 font-sans leading-relaxed text-stone-800 dark:text-stone-200">
      <GrammarLessonSection title={renderLocalized(language, copy.definitionsTitle)}>
        <ul className="ml-5 mt-4 list-decimal list-outside space-y-3">
          {renderLocalized(language, copy.definitionItems).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </GrammarLessonSection>

      <GrammarLessonSection title={renderLocalized(language, copy.vocabularyTitle)}>
        <GrammarLessonTable>
          <thead>
            <tr className="bg-stone-100 dark:bg-stone-800">
              <th colSpan={2} className="border-b p-3 text-center font-semibold dark:border-stone-700">
                {language === "en" ? "Masculine " : "Mannelijk "}
                <SmallCaps>m</SmallCaps>
              </th>
              <th colSpan={2} className="border-b p-3 text-center font-semibold dark:border-stone-700">
                {language === "en" ? "Feminine " : "Vrouwelijk "}
                <SmallCaps>{language === "en" ? "f" : "v"}</SmallCaps>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
            {vocabularyRows.map((row) => (
              <tr
                key={`${row.masculineWord}-${row.feminineWord}`}
                className="transition-colors hover:bg-stone-50 dark:hover:bg-stone-900/50"
              >
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">
                  {row.masculineWord}
                </td>
                <td className="p-3">{renderLocalized(language, row.masculineMeaning)}</td>
                <td className="p-3 font-coptic text-xl text-emerald-600 dark:text-emerald-400">
                  {row.feminineWord}
                </td>
                <td className="p-3">{renderLocalized(language, row.feminineMeaning)}</td>
              </tr>
            ))}
          </tbody>
        </GrammarLessonTable>
      </GrammarLessonSection>

      <section>
        <GrammarLessonCard className="border-stone-200 bg-stone-100 p-6 dark:border-stone-800 dark:bg-stone-900">
          <h3 className="mb-3 text-lg font-bold">
            {renderLocalized(language, copy.significantLettersTitle)}:
          </h3>
          <p className="mb-4 text-sm text-stone-600 dark:text-stone-400">
            {renderLocalized(language, copy.significantLettersIntro)}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-separate border-spacing-y-2 text-left">
              <thead className="sr-only">
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">First significant letter</th>
                  <th scope="col">Second significant letter</th>
                  <th scope="col">Third significant letter</th>
                </tr>
              </thead>
              <tbody>
                {significantLetterGroups.map((group) => (
                  <tr key={String(group.label.en)}>
                    <th scope="row" className="w-44 pr-4 align-middle font-semibold">
                      {renderLocalized(language, group.label)}
                    </th>
                    {group.letters.map((letter, index) => (
                      <td
                        key={`${String(group.label.en)}-${index}`}
                        className={index === 0 ? "pr-2" : index === 1 ? "px-1" : "pl-2"}
                      >
                        {renderSignificantLetterCard(letter, `${String(group.label.en)}-${index}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GrammarLessonCard>
      </section>

      <GrammarLessonSection title={renderLocalized(language, copy.determinerTitle)}>
        <p className="mb-2 mt-4 italic">
          {renderLocalized(language, copy.determinerExampleWords)}{" "}
          <span className="font-coptic text-emerald-600 dark:text-emerald-400">Ⲥⲟⲛ</span>{" "}
          “brother” /{" "}
          <span className="font-coptic text-emerald-600 dark:text-emerald-400">Ⲥⲱⲛⲓ</span>{" "}
          “sister” /{" "}
          <span className="font-coptic text-emerald-600 dark:text-emerald-400">Ⲥⲱⲛⲓ</span>{" "}
          {language === "en" ? "“sisters”" : "“zussen”"}
        </p>
        <GrammarLessonTable>
          <thead>
            <tr className="bg-stone-100 dark:bg-stone-800">
              <th className="border-b p-3 font-semibold dark:border-stone-700">
                {language === "en" ? "Type" : "Type"}
              </th>
              <th className="border-b p-3 font-semibold dark:border-stone-700">
                {language === "en" ? "Masculine " : "Mannelijk "}
                <SmallCaps>m</SmallCaps>
              </th>
              <th className="border-b p-3 font-semibold dark:border-stone-700">
                {language === "en" ? "Feminine " : "Vrouwelijk "}
                <SmallCaps>{language === "en" ? "f" : "v"}</SmallCaps>
              </th>
              <th className="border-b p-3 font-semibold dark:border-stone-700">
                {language === "en" ? "Plural " : "Meervoud "}
                <SmallCaps>p</SmallCaps>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
            {determinerRows.map((row) => (
              <tr key={row.type.en} className="transition-colors hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 font-medium">{renderLocalized(language, row.type)}</td>
                {renderLocalized(language, row.cells).map((cell, index) => (
                  <td key={`${row.type.en}-${index}`} className="p-3">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </GrammarLessonTable>
        <p className="mt-3 text-sm text-stone-500">{renderLocalized(language, copy.determinerNote)}</p>
      </GrammarLessonSection>

      <GrammarLessonSection title={renderLocalized(language, copy.zeroDeterminationTitle)}>
        <p className="mb-3 mt-4">{renderLocalized(language, copy.zeroDeterminationIntro)}</p>
        <GrammarLessonCard>
          <ul className="space-y-2">
            {zeroDeterminationExamples.map((example) => (
              <li key={String(example.coptic)}>
                {example.coptic} {renderLocalized(language, example.translation)}
              </li>
            ))}
          </ul>
        </GrammarLessonCard>
      </GrammarLessonSection>

      <GrammarLessonSection title={renderLocalized(language, copy.nominalSentenceTitle)}>
        <p className="mb-3 mt-4">{renderLocalized(language, copy.nominalSentenceIntro)}</p>
        <ul className="mb-4 space-y-2 text-emerald-600 dark:text-emerald-400">
          {nexusPronouns.map((item) => (
            <li key={item.coptic}>
              ≡<span className="font-coptic text-lg">{item.coptic}</span>{" "}
              <SmallCaps>{renderLocalized(language, item.gender)}</SmallCaps>{" "}
              {renderLocalized(language, item.meaning)}
              {item.coptic === "ⲡⲉ" && (
                <Footnote
                  number={5}
                  content={
                    language === "en" ? (
                      <>In Coptic, there is no specific word for the neuter “it”.</>
                    ) : (
                      <>In het Koptisch is er geen specifiek woord voor “het”.</>
                    )
                  }
                />
              )}
            </li>
          ))}
        </ul>
        <p className="mb-4 text-sm text-stone-600 dark:text-stone-400">
          {renderLocalized(language, copy.nominalSentenceNote)}
        </p>
        <GrammarLessonCard tone="sky" className="p-5">
          <h3 className="mb-3 text-lg font-bold">{renderLocalized(language, copy.applicationsTitle)}:</h3>
          <p className="mb-4 text-sm">{renderLocalized(language, copy.applicationsIntro)}</p>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {nominalSentenceExamples.map((example) => (
              <li key={String(example.coptic)}>
                {example.coptic}
                <br />
                {renderLocalized(language, example.translation)}
              </li>
            ))}
          </ul>
        </GrammarLessonCard>
      </GrammarLessonSection>

      <GrammarLessonSection title={renderLocalized(language, copy.independentPronounsTitle)}>
        <p className="mb-3 mt-4">{renderLocalized(language, copy.independentPronounsIntro)}</p>
        <ul className="mb-6 flex flex-wrap gap-4">
          {independentPronouns.map((item) => renderPronounChip(language, item))}
        </ul>
        <GrammarLessonCard>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-stone-500">
            {renderLocalized(language, copy.exampleLabel)}
          </h3>
          <ul className="space-y-3">
            {independentExamples.map((example) => (
              <li key={String(example.coptic)}>
                {example.coptic} {renderLocalized(language, example.translation)}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-stone-500 dark:text-stone-400">
            {renderLocalized(language, copy.independentPronounNote)}
          </p>
        </GrammarLessonCard>
      </GrammarLessonSection>

      <GrammarLessonSection title={renderLocalized(language, copy.abbreviationsTitle)}>
        <p className="mb-3 mt-4">{renderLocalized(language, copy.abbreviationsIntro)}</p>
        <p className="mb-4 text-sm italic text-stone-600 dark:text-stone-400">
          {renderLocalized(language, copy.abbreviationsContext)}
        </p>
        <ul className="mb-6 space-y-2">
          {abbreviationPhrases.map((item) => (
            <li key={item.abbreviation}>
              <span className="font-coptic text-lg">{item.abbreviation}</span> ={" "}
              <span className="font-coptic text-md">{item.expansion}</span>{" "}
              {renderLocalized(language, item.meaning)}
            </li>
          ))}
        </ul>

        <GrammarLessonTable>
          <thead>
            <tr className="bg-stone-100 dark:bg-stone-800">
              <th className="border-b p-3 font-semibold dark:border-stone-700">
                {language === "en" ? "Full Word" : "Voluit"}
              </th>
              <th className="border-b p-3 font-semibold dark:border-stone-700">
                {language === "en" ? "Abbreviation" : "Afkorting"}
              </th>
              <th className="border-b p-3 font-semibold dark:border-stone-700">
                {language === "en" ? "Meaning" : "Betekenis"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
            {abbreviationRows.map((row) => (
              <tr key={row.abbreviation} className="transition-colors hover:bg-stone-50 dark:hover:bg-stone-900/50">
                <td className="p-3 text-emerald-600 dark:text-emerald-400">
                  {renderLocalized(language, row.fullWord)}
                </td>
                <td className="p-3 font-coptic text-xl">{row.abbreviation}</td>
                <td className="p-3">{renderLocalized(language, row.meaning)}</td>
              </tr>
            ))}
          </tbody>
        </GrammarLessonTable>
      </GrammarLessonSection>

      <section className="mt-10 rounded-xl border border-sky-100 bg-sky-50 p-6 dark:border-sky-900 dark:bg-sky-900/20">
        <h2 className="mb-4 text-xl font-bold text-sky-700 dark:text-sky-400">
          {renderLocalized(language, copy.exerciseTitle)}
        </h2>
        <p className="mb-4">{renderLocalized(language, copy.exercisePrompt)}</p>
        <ExerciseForm
          lessonSlug="lesson-1"
          language={language}
          questions={getLessonQuestions("lesson-1", language)}
        />
      </section>
    </div>
  );
}
