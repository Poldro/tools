export interface RegexMatch {
  text: string;
  index: number;
  groups: string[];
}

export interface RegexResult {
  valid: boolean;
  error?: string;
  matches: RegexMatch[];
}

export function testRegex(pattern: string, flags: string, text: string): RegexResult {
  if (!pattern) {
    return { valid: true, matches: [] };
  }
  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch (e) {
    return {
      valid: false,
      error: e instanceof Error ? e.message : "Invalid regex",
      matches: [],
    };
  }

  const matches: RegexMatch[] = [];
  let match: RegExpExecArray | null;

  if (flags.includes("g")) {
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        text: match[0],
        index: match.index,
        groups: match.slice(1).map((g) => g ?? ""),
      });
      // Prevent infinite loop on zero-length matches
      if (match[0].length === 0) {
        regex.lastIndex++;
      }
    }
  } else {
    match = regex.exec(text);
    if (match) {
      matches.push({
        text: match[0],
        index: match.index,
        groups: match.slice(1).map((g) => g ?? ""),
      });
    }
  }

  return { valid: true, matches };
}
