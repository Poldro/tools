// Reflows hard-wrapped text (e.g. copied from a terminal) by rejoining lines
// that were broken by the wrap width, while preserving blank lines, bullets
// and numbered lists. No AI involved: relies on the greedy-wrap invariant —
// a line was wrapped only if the next word did not fit within the wrap width.

const BLOCK_START = /^([-*•]\s+|\d+[.)]\s+)/;
const STARTS_LOWERCASE = /^[a-zà-öø-ÿ]/;
const ENDS_SENTENCE = /[.!?:]$/;

// Below this width the input is likely not terminal-wrapped, so never join.
const MIN_WRAP_WIDTH = 40;

interface LogicalLine {
  indent: string;
  text: string;
  lastRawLength: number;
}

function collapseSpaces(text: string) {
  return text.replace(/ {2,}/g, " ");
}

export function unwrapText(input: string): string {
  const rawLines = input
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/\t/g, "  ")
    .split("\n")
    .map((line) => line.replace(/\s+$/g, ""));

  const nonEmpty = rawLines.filter((line) => line.trim().length > 0);
  if (nonEmpty.length === 0) return "";

  const wrapWidth = Math.max(...nonEmpty.map((line) => line.length));
  const commonIndent = Math.min(
    ...nonEmpty.map((line) => (/^ */.exec(line) as RegExpExecArray)[0].length)
  );

  const output: (LogicalLine | null)[] = []; // null = blank line
  let current: LogicalLine | null = null;

  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim();

    if (trimmed.length === 0) {
      if (current) output.push(current);
      current = null;
      if (output.length > 0 && output[output.length - 1] !== null) {
        output.push(null);
      }
      continue;
    }

    const firstWord = trimmed.split(/\s+/)[0] ?? "";
    const wrappedAtWidth =
      current !== null &&
      current.lastRawLength + 1 + firstWord.length > wrapWidth;
    const looksLikeContinuation =
      current !== null &&
      STARTS_LOWERCASE.test(trimmed) &&
      !ENDS_SENTENCE.test(current.text);

    const joins =
      current !== null &&
      wrapWidth >= MIN_WRAP_WIDTH &&
      !BLOCK_START.test(trimmed) &&
      (wrappedAtWidth || looksLikeContinuation);

    if (joins && current) {
      current = {
        indent: current.indent,
        text: `${current.text} ${collapseSpaces(trimmed)}`,
        lastRawLength: rawLine.length,
      };
      continue;
    }

    if (current) output.push(current);
    const indentSize = (/^ */.exec(rawLine) as RegExpExecArray)[0].length;
    current = {
      indent: " ".repeat(Math.max(0, indentSize - commonIndent)),
      text: collapseSpaces(trimmed),
      lastRawLength: rawLine.length,
    };
  }
  if (current) output.push(current);

  while (output[output.length - 1] === null) output.pop();

  return output
    .map((line) => (line === null ? "" : `${line.indent}${line.text}`))
    .join("\n");
}
