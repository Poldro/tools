export interface TextCounts {
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
}

/** Counts the words, characters and sentences of a text. */
export function calculateCounts(text: string): TextCounts {
  const words = text.trim().split(/\s+/g).filter(Boolean);
  const sentences = text
    .split(/[.?!]/g)
    .filter((sentence) => /\w/.test(sentence));

  return {
    wordCount: words.length,
    characterCount: text.length,
    sentenceCount: sentences.length,
  };
}
