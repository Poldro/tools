import { describe, expect, it } from "vitest";
import { diffStats, diffText } from "./text-diff";

describe("diffText: lines", () => {
  it("marks changed lines and keeps the rest", () => {
    expect(diffText("a\nb\nc\n", "a\nB\nc\n", "lines")).toEqual([
      { kind: "same", text: "a\n" },
      { kind: "removed", text: "b\n" },
      { kind: "added", text: "B\n" },
      { kind: "same", text: "c\n" },
    ]);
  });

  it("does not report a missing final newline as a change", () => {
    const parts = diffText("a\nb", "a\nb\n", "lines");
    expect(parts.every((part) => part.kind === "same")).toBe(true);
  });

  it("returns nothing to show for two empty texts", () => {
    expect(diffText("", "", "lines")).toEqual([]);
  });
});

describe("diffText: words", () => {
  it("marks changed words inside a line", () => {
    const parts = diffText("the quick fox", "the slow fox", "words");
    expect(
      parts.filter((part) => part.kind === "removed").map((p) => p.text.trim())
    ).toEqual(["quick"]);
    expect(
      parts.filter((part) => part.kind === "added").map((p) => p.text.trim())
    ).toEqual(["slow"]);
    expect(
      parts
        .filter((p) => p.kind !== "removed")
        .map((p) => p.text)
        .join("")
    ).toBe("the slow fox");
  });
});

describe("diffStats", () => {
  it("counts added and removed lines", () => {
    const parts = diffText("a\nb\nc\n", "a\nx\ny\nz\n", "lines");
    expect(diffStats(parts, "lines")).toEqual({ added: 3, removed: 2 });
  });

  it("counts added and removed words", () => {
    const parts = diffText("one two three", "one 2 three four five", "words");
    expect(diffStats(parts, "words")).toEqual({ added: 3, removed: 1 });
  });

  it("is zero for identical texts", () => {
    expect(diffStats(diffText("same", "same", "lines"), "lines")).toEqual({
      added: 0,
      removed: 0,
    });
  });
});

describe("diffText: words with accents and punctuation", () => {
  it("treats an accented word as one token", () => {
    const parts = diffText("il caffè è buono", "il caffé è buono", "words");
    expect(
      parts.filter((p) => p.kind === "removed").map((p) => p.text)
    ).toEqual(["caffè"]);
    expect(parts.filter((p) => p.kind === "added").map((p) => p.text)).toEqual([
      "caffé",
    ]);
  });

  it("keeps punctuation apart from the word it follows", () => {
    const parts = diffText("Hello, world", "Hello; world", "words");
    expect(
      parts.filter((p) => p.kind === "removed").map((p) => p.text)
    ).toEqual([","]);
    expect(diffStats(parts, "words")).toEqual({ added: 0, removed: 0 });
  });

  it("rebuilds both texts from the parts", () => {
    const before = "one  two\nthree";
    const after = "one two\nthree four";
    const parts = diffText(before, after, "words");
    expect(
      parts
        .filter((p) => p.kind !== "added")
        .map((p) => p.text)
        .join("")
    ).toBe(before);
    expect(
      parts
        .filter((p) => p.kind !== "removed")
        .map((p) => p.text)
        .join("")
    ).toBe(after);
  });
});
