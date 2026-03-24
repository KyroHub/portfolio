import { describe, expect, it } from "vitest";
import { createGrammarExportSnapshot } from "./build";
import {
  getGrammarDatasetSnapshot,
  getGrammarLessonDocumentBySlug,
  getGrammarManifest,
} from "./registry";

describe("grammar content registry", () => {
  it("indexes lessons by slug", () => {
    const lesson = getGrammarLessonDocumentBySlug("lesson-1");

    expect(lesson?.id).toBe("grammar.lesson.01");
    expect(lesson?.sections).toHaveLength(9);
  });

  it("keeps manifest lessons aligned with canonical lesson documents", () => {
    const manifest = getGrammarManifest();
    const snapshot = getGrammarDatasetSnapshot();

    expect(manifest.lessons).toHaveLength(snapshot.lessons.length);
    expect(manifest.lessons.map((lesson) => lesson.slug)).toEqual(
      snapshot.lessons.map((lesson) => lesson.slug),
    );
  });

  it("ensures section ids are unique within a lesson", () => {
    const snapshot = getGrammarDatasetSnapshot();

    snapshot.lessons.forEach((lesson) => {
      const sectionIds = lesson.sections.map((section) => section.id);
      expect(new Set(sectionIds).size).toBe(sectionIds.length);
      expect(lesson.sectionOrder).toEqual(sectionIds);
    });
  });

  it("ensures lesson exercise references resolve in the export snapshot", () => {
    const exportSnapshot = createGrammarExportSnapshot();
    const lessonBundle = exportSnapshot.lessons["lesson-1"];

    expect(lessonBundle.lesson.exerciseRefs).toContain("grammar.exercise.lesson01.001");
    expect(lessonBundle.exercises.map((exercise) => exercise.id)).toContain(
      "grammar.exercise.lesson01.001",
    );
  });

  it("ensures lesson example references resolve in the export snapshot", () => {
    const exportSnapshot = createGrammarExportSnapshot();
    const lessonBundle = exportSnapshot.lessons["lesson-1"];
    const zeroDeterminationSection = lessonBundle.lesson.sections.find(
      (section) => section.slug === "zero-determination",
    );

    expect(zeroDeterminationSection?.exampleRefs).toEqual([
      "grammar.example.lesson01.zero-determination.001",
      "grammar.example.lesson01.zero-determination.002",
      "grammar.example.lesson01.zero-determination.003",
      "grammar.example.lesson01.zero-determination.004",
    ]);
    expect(lessonBundle.examples.map((example) => example.id)).toEqual(
      expect.arrayContaining(zeroDeterminationSection?.exampleRefs ?? []),
    );
  });

  it("includes nominal-sentence examples and core footnotes in the lesson bundle", () => {
    const exportSnapshot = createGrammarExportSnapshot();
    const lessonBundle = exportSnapshot.lessons["lesson-1"];
    const nominalSentenceSection = lessonBundle.lesson.sections.find(
      (section) => section.slug === "bipartite-nominal-sentence",
    );

    expect(nominalSentenceSection?.exampleRefs).toEqual([
      "grammar.example.lesson01.nominal-sentence.001",
      "grammar.example.lesson01.nominal-sentence.002",
      "grammar.example.lesson01.nominal-sentence.003",
      "grammar.example.lesson01.nominal-sentence.004",
      "grammar.example.lesson01.nominal-sentence.005",
      "grammar.example.lesson01.nominal-sentence.006",
      "grammar.example.lesson01.nominal-sentence.007",
      "grammar.example.lesson01.nominal-sentence.008",
    ]);
    expect(lessonBundle.footnotes.map((footnote) => footnote.id)).toEqual(
      expect.arrayContaining([
        "grammar.footnote.lesson01.002",
        "grammar.footnote.lesson01.003",
        "grammar.footnote.lesson01.004",
        "grammar.footnote.lesson01.005",
        "grammar.footnote.lesson01.006",
      ]),
    );
  });

  it("includes canonical concepts and sources in the lesson bundle", () => {
    const exportSnapshot = createGrammarExportSnapshot();
    const lessonBundle = exportSnapshot.lessons["lesson-1"];

    expect(lessonBundle.lesson.conceptRefs).toEqual([
      "grammar.concept.bare-noun",
      "grammar.concept.determined-noun",
      "grammar.concept.significant-letters",
      "grammar.concept.determiner-selection",
      "grammar.concept.zero-determination",
      "grammar.concept.nexus-pronouns",
      "grammar.concept.bipartite-nominal-sentence",
      "grammar.concept.independent-personal-pronouns",
      "grammar.concept.nomina-sacra",
    ]);
    expect(lessonBundle.concepts.map((concept) => concept.id)).toEqual(
      lessonBundle.lesson.conceptRefs,
    );
    expect(lessonBundle.sources.map((source) => source.id)).toEqual([
      "grammar.source.basisgrammatica-bohairisch-koptisch",
    ]);
    expect(lessonBundle.lesson.rights).toMatchObject({
      author: "Kyrillos Wannes",
      copyrightHolder: "Kyrillos Wannes",
      license: "all-rights-reserved",
    });
  });

  it("wires concept and source references into examples and footnotes", () => {
    const snapshot = getGrammarDatasetSnapshot();
    const zeroDeterminationExample = snapshot.examples.find(
      (example) => example.id === "grammar.example.lesson01.zero-determination.001",
    );
    const nominalSentenceExample = snapshot.examples.find(
      (example) => example.id === "grammar.example.lesson01.nominal-sentence.001",
    );
    const orthographyFootnote = snapshot.footnotes.find(
      (footnote) => footnote.id === "grammar.footnote.lesson01.006",
    );

    expect(zeroDeterminationExample?.conceptRefs).toEqual([
      "grammar.concept.zero-determination",
    ]);
    expect(nominalSentenceExample?.conceptRefs).toEqual([
      "grammar.concept.bipartite-nominal-sentence",
      "grammar.concept.nexus-pronouns",
    ]);
    expect(orthographyFootnote?.sourceRefs).toEqual([
      "grammar.source.basisgrammatica-bohairisch-koptisch",
    ]);
  });
});
