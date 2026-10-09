export type Codec = "base64" | "url" | "html";
export type Direction = "encode" | "decode";

export type CodecResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const HTML_NAMED: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  copy: "©",
  reg: "®",
  euro: "€",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  laquo: "«",
  raquo: "»",
};

function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""));
}

function decodeBase64(text: string): string {
  // Accept the URL-safe alphabet and missing padding too.
  const base64 = text.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

const encodeHtml = (text: string): string =>
  text.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);

function decodeCodePoint(code: number, fallback: string): string {
  return Number.isInteger(code) && code >= 0 && code <= 0x10ffff
    ? String.fromCodePoint(code)
    : fallback;
}

const decodeHtml = (text: string): string =>
  text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, body: string) => {
    if (body.startsWith("#x") || body.startsWith("#X")) {
      return decodeCodePoint(parseInt(body.slice(2), 16), entity);
    }
    if (body.startsWith("#")) {
      return decodeCodePoint(parseInt(body.slice(1), 10), entity);
    }
    return HTML_NAMED[body.toLowerCase()] ?? entity;
  });

const TRANSFORMS: Record<Codec, Record<Direction, (text: string) => string>> = {
  base64: { encode: encodeBase64, decode: decodeBase64 },
  url: { encode: encodeURIComponent, decode: decodeURIComponent },
  html: { encode: encodeHtml, decode: decodeHtml },
};

const DECODE_ERRORS: Record<Codec, string> = {
  base64: "This is not valid Base64 text",
  url: "This is not valid URL-encoded text",
  html: "This is not valid HTML-encoded text",
};

export function transform(
  codec: Codec,
  direction: Direction,
  text: string
): CodecResult {
  try {
    return { ok: true, value: TRANSFORMS[codec][direction](text) };
  } catch {
    return { ok: false, error: DECODE_ERRORS[codec] };
  }
}

/** SHA-256 of the UTF-8 text, as lowercase hex. */
export async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}
