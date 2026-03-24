import { describe, expect, it } from "vitest";
import {
  getGrammarApiConceptById,
  getGrammarApiIndex,
  getGrammarApiLessonBySlug,
  getGrammarApiManifest,
  getGrammarApiSourceById,
  isGrammarLessonStatus,
  listGrammarApiConcepts,
  listGrammarApiExamples,
  listGrammarApiExercises,
  listGrammarApiFootnotes,
  listGrammarApiLessons,
  listGrammarApiSources,
  resolveGrammarLessonFilter,
} from "./grammarApi";

describe("grammar API helpers", () => {
  it("returns the canonical manifest for API consumers", () => {
    const manifest = getGrammarApiManifest();

    expect(manifest.datasetVersion).toBe("2026-03-22");
    expect(manifest.lessons.map((lesson) => lesson.slug)).toEqual(["lesson-1"]);
  });

  it("filters lesson index results by status", () => {
    const publishedLessons = listGrammarApiLessons();

    expect(publishedLessons).toMatchObject({
      schemaVersion: "1.0.0",
      datasetVersion: "2026-03-22",
      data: [
        {
          slug: "lesson-1",
          status: "published",
        },
      ],
    });
  });

  it("resolves lesson filters from either slug or canonical lesson id", () => {
    expect(resolveGrammarLessonFilter("lesson-1")).toBe("grammar.lesson.01");
    expect(resolveGrammarLessonFilter("grammar.lesson.01")).toBe("grammar.lesson.01");
    expect(resolveGrammarLessonFilter("lesson-2")).toBeNull();
    expect(resolveGrammarLessonFilter("missing-lesson")).toBeNull();
  });

  it("validates supported lesson statuses for route parsing", () => {
    expect(isGrammarLessonStatus("published")).toBe(true);
    expect(isGrammarLessonStatus("draft")).toBe(false);
    expect(isGrammarLessonStatus("archived")).toBe(false);
    expect(isGrammarLessonStatus("preview")).toBe(false);
    expect(isGrammarLessonStatus(null)).toBe(false);
  });

  it("builds a versioned lesson bundle for a lesson slug", () => {
    const lessonBundle = getGrammarApiLessonBySlug("lesson-1");

    expect(lessonBundle).not.toBeNull();
    expect(lessonBundle?.data.lesson.slug).toBe("lesson-1");
    expect(lessonBundle?.data.concepts).toHaveLength(9);
    expect(lessonBundle?.data.examples).toHaveLength(12);
    expect(lessonBundle?.data.footnotes).toHaveLength(5);
    expect(lessonBundle?.data.sources).toHaveLength(1);
    expect(lessonBundle?.data.lesson.rights).toMatchObject({
      author: "Kyrillos Wannes",
      copyrightHolder: "Kyrillos Wannes",
      license: "all-rights-reserved",
    });
    expect(getGrammarApiLessonBySlug("lesson-2")).toBeNull();
  });

  it("filters examples, exercises, and footnotes by lesson", () => {
    const lessonId = resolveGrammarLessonFilter("lesson-1");

    expect(lessonId).toBe("grammar.lesson.01");
    expect(listGrammarApiExamples(lessonId ?? undefined).data).toHaveLength(12);
    expect(listGrammarApiExercises(lessonId ?? undefined).data.map((exercise) => exercise.id)).toEqual([
      "grammar.exercise.lesson01.001",
    ]);
    expect(listGrammarApiFootnotes(lessonId ?? undefined).data).toHaveLength(5);
  });

  it("returns concept and source collections for lesson-level consumers", () => {
    const lessonId = resolveGrammarLessonFilter("lesson-1");

    expect(listGrammarApiConcepts(lessonId ?? undefined).data.map((concept) => concept.id)).toEqual([
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
    expect(listGrammarApiSources(lessonId ?? undefined).data.map((source) => source.id)).toEqual([
      "grammar.source.basisgrammatica-bohairisch-koptisch",
    ]);
  });

  it("returns detail records for canonical concept and source ids", () => {
    expect(
      getGrammarApiConceptById("grammar.concept.significant-letters"),
    )?.toMatchObject({
      data: {
        id: "grammar.concept.significant-letters",
        title: {
          en: "Significant Letters",
        },
      },
    });

    expect(
      getGrammarApiSourceById(
        "grammar.source.basisgrammatica-bohairisch-koptisch",
      ),
    )?.toMatchObject({
      data: {
        id: "grammar.source.basisgrammatica-bohairisch-koptisch",
        title: "Inleiding tot het Bohairisch Koptisch: Basisgrammatica",
      },
    });

    expect(getGrammarApiConceptById("grammar.concept.missing")).toBeNull();
    expect(getGrammarApiSourceById("grammar.source.missing")).toBeNull();
  });

  it("describes the public API surface for outside developers", () => {
    const apiIndex = getGrammarApiIndex();

    expect(apiIndex).toMatchObject({
      apiBasePath: "/api/v1/grammar",
      staticDataBasePath: "/data/grammar/v1",
      schemaVersion: "1.0.0",
      datasetVersion: "2026-03-22",
      rights: {
        author: "Kyrillos Wannes",
        copyrightHolder: "Kyrillos Wannes",
        license: "all-rights-reserved",
      },
      lessonCounts: {
        published: 1,
        draft: 0,
        archived: 0,
        total: 1,
      },
    });
    expect(apiIndex.endpoints.map((endpoint) => endpoint.path)).toEqual([
      "/api/v1/grammar/manifest",
      "/api/v1/grammar/lessons",
      "/api/v1/grammar/lessons/[slug]",
      "/api/v1/grammar/examples",
      "/api/v1/grammar/exercises",
      "/api/v1/grammar/concepts",
      "/api/v1/grammar/concepts/[id]",
      "/api/v1/grammar/footnotes",
      "/api/v1/grammar/sources",
      "/api/v1/grammar/sources/[id]",
    ]);
    expect(apiIndex.examples.map((example) => example.path)).toEqual(
      expect.arrayContaining([
        "/api/v1/grammar/lessons/lesson-1",
        "/api/v1/grammar/concepts/grammar.concept.significant-letters",
        "/api/v1/grammar/footnotes?lesson=grammar.lesson.01",
        "/api/v1/grammar/sources/grammar.source.basisgrammatica-bohairisch-koptisch",
        "/data/grammar/v1/manifest.json",
      ]),
    );
  });
});
