import { describe, expect, it } from "vitest";
import { getGrammarDatasetSnapshot } from "./registry.ts";

const copticCharacterPattern = /\p{Script=Coptic}/u;

type PlainTextCopticIssue = {
  location: string;
  text: string;
  reason: string;
};

function collectUnexpectedPlainTextCopticNodes() {
  const snapshot = getGrammarDatasetSnapshot();
  const issues: PlainTextCopticIssue[] = [];

  function visitNode(
    node: unknown,
    location: string,
    insideCopticContext = false,
  ) {
    if (Array.isArray(node)) {
      node.forEach((child, index) => {
        visitNode(child, `${location}[${index}]`, insideCopticContext);
      });
      return;
    }

    if (!node || typeof node !== "object") {
      return;
    }

    const typedNode = node as {
      type?: string;
      text?: string;
    };

    if (
      typedNode.type === "text" &&
      typeof typedNode.text === "string" &&
      copticCharacterPattern.test(typedNode.text) &&
      !insideCopticContext
    ) {
      issues.push({
        location,
        text: typedNode.text,
        reason: "plain-text-coptic",
      });
    }

    if (
      typeof typedNode.text === "string" &&
      typedNode.text.includes("≡") &&
      insideCopticContext
    ) {
      issues.push({
        location,
        text: typedNode.text,
        reason: "enclitic-marker-inside-coptic-context",
      });
    }

    const nextInsideCopticContext =
      insideCopticContext ||
      typedNode.type === "coptic" ||
      typedNode.type === "copticSpan";

    Object.entries(node).forEach(([key, value]) => {
      if (key === "type") {
        return;
      }

      visitNode(value, `${location}.${key}`, nextInsideCopticContext);
    });
  }

  snapshot.lessons.forEach((lesson) => {
    visitNode(lesson, `lesson:${lesson.id}`);
  });
  snapshot.concepts.forEach((concept) => {
    visitNode(concept, `concept:${concept.id}`);
  });
  snapshot.examples.forEach((example) => {
    visitNode(example, `example:${example.id}`);
  });
  snapshot.exercises.forEach((exercise) => {
    visitNode(exercise, `exercise:${exercise.id}`);
  });
  snapshot.footnotes.forEach((footnote) => {
    visitNode(footnote, `footnote:${footnote.id}`);
  });

  return issues;
}

describe("grammar content validation", () => {
  it("keeps Coptic inline content wrapped in explicit Coptic nodes", () => {
    expect(collectUnexpectedPlainTextCopticNodes()).toEqual([]);
  });
});
