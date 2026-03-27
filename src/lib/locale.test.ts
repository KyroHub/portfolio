import { describe, expect, it } from "vitest";
import { appendSearchAndHash } from "./locale";

describe("appendSearchAndHash", () => {
  it("preserves both query strings and hashes", () => {
    expect(appendSearchAndHash("/nl/grammar/lesson-1", "?q=test", "#section-2")).toBe(
      "/nl/grammar/lesson-1?q=test#section-2",
    );
  });

  it("normalizes search and hash fragments when prefixes are omitted", () => {
    expect(appendSearchAndHash("nl/grammar/lesson-1", "q=test", "section-2")).toBe(
      "/nl/grammar/lesson-1?q=test#section-2",
    );
  });

  it("returns the pathname unchanged when search and hash are empty", () => {
    expect(appendSearchAndHash("/en/grammar")).toBe("/en/grammar");
  });
});
