export interface UrlParam {
  key: string;
  value: string;
}

export type ParsedUrl =
  | {
      valid: true;
      protocol: string;
      host: string;
      path: string;
      hash: string;
      params: UrlParam[];
    }
  | { valid: false; error: string };

export const UTM_FIELDS = [
  { key: "utm_source", label: "Source", hint: "newsletter, google" },
  { key: "utm_medium", label: "Medium", hint: "email, cpc" },
  { key: "utm_campaign", label: "Campaign", hint: "spring_sale" },
  { key: "utm_term", label: "Term", hint: "running shoes" },
  { key: "utm_content", label: "Content", hint: "header_link" },
] as const;

export type UtmKey = (typeof UTM_FIELDS)[number]["key"];
export type UtmValues = Readonly<Partial<Record<UtmKey, string>>>;

const HAS_SCHEME = /^[a-z][a-z\d+.-]*:\/\//i;
const INVALID: ParsedUrl = {
  valid: false,
  error: "This is not a valid URL",
};

function toUrl(input: string): URL | null {
  const text = input.trim();
  if (!text) return null;
  try {
    // A bare "example.com/page" is read as https.
    const url = new URL(HAS_SCHEME.test(text) ? text : `https://${text}`);
    return url.hostname.includes(".") || url.hostname === "localhost"
      ? url
      : null;
  } catch {
    return null;
  }
}

/** Splits a URL into its parts and its decoded query parameters. */
export function parseUrl(input: string): ParsedUrl {
  const url = toUrl(input);
  if (!url) return INVALID;
  return {
    valid: true,
    protocol: url.protocol.replace(/:$/, ""),
    host: url.host,
    path: url.pathname,
    hash: url.hash.replace(/^#/, ""),
    params: Array.from(url.searchParams, ([key, value]) => ({ key, value })),
  };
}

/**
 * Adds the UTM parameters to a URL. Other parameters and the hash are kept;
 * a UTM field left blank leaves any existing value of that parameter alone.
 */
export function buildUtmUrl(base: string, utm: UtmValues): string | null {
  const url = toUrl(base);
  if (!url) return null;
  for (const { key } of UTM_FIELDS) {
    const value = utm[key]?.trim();
    if (value) {
      url.searchParams.set(key, value);
    }
  }
  return url.href;
}
