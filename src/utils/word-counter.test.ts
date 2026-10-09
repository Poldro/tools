import { describe, expect, it } from "vitest";
import { calculateCounts } from "./word-counter";

describe("calculateCounts", () => {
  it("is all zeros for empty or blank text", () => {
    expect(calculateCounts("")).toEqual({
      wordCount: 0,
      characterCount: 0,
      sentenceCount: 0,
    });
    expect(calculateCounts("  \n ")).toMatchObject({
      wordCount: 0,
      sentenceCount: 0,
    });
  });

  it("counts words, characters and sentences", () => {
    expect(calculateCounts("Hello world. How are you?  Fine!")).toEqual({
      wordCount: 6,
      characterCount: 32,
      sentenceCount: 3,
    });
  });

  it("does not count stray punctuation as a sentence", () => {
    expect(calculateCounts("Wait... what?!").sentenceCount).toBe(2);
  });
});
