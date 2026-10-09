import { diffArrays, diffLines } from "diff";

export type DiffMode = "lines" | "words";

export interface DiffPart {
  kind: "added" | "removed" | "same";
  text: string;
}

export interface DiffStats {
  added: number;
  removed: number;
}

// Words, runs of whitespace, and single punctuation marks.
const TOKEN = /\s+|[\p{L}\p{N}_]+|[^\s\p{L}\p{N}_]/gu;

const tokenize = (text: string): string[] => text.match(TOKEN) ?? [];

const toKind = (change: {
  added?: boolean;
  removed?: boolean;
}): DiffPart["kind"] =>
  change.added ? "added" : change.removed ? "removed" : "same";

/** Compares two texts line by line or word by word. */
export function diffText(
  before: string,
  after: string,
  mode: DiffMode
): DiffPart[] {
  if (mode === "lines") {
    return diffLines(before, after, { ignoreNewlineAtEof: true }).map(
      (change) => ({ kind: toKind(change), text: change.value })
    );
  }
  // The library's own word diff builds a regex that Next 13's minifier breaks.
  return diffArrays(tokenize(before), tokenize(after)).map((change) => ({
    kind: toKind(change),
    text: change.value.join(""),
  }));
}

function countUnits(text: string, mode: DiffMode): number {
  return mode === "lines"
    ? text.replace(/\n$/, "").split("\n").length
    : text.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
}

/** How many lines (or words) were added and removed. */
export function diffStats(
  parts: readonly DiffPart[],
  mode: DiffMode
): DiffStats {
  const count = (kind: DiffPart["kind"]): number =>
    parts
      .filter((part) => part.kind === kind)
      .reduce((total, part) => total + countUnits(part.text, mode), 0);

  return { added: count("added"), removed: count("removed") };
}
