export type JwtJson = Record<string, unknown>;

export type JwtResult =
  | { valid: true; header: JwtJson; payload: JwtJson; signature: string }
  | { valid: false; error: string };

export type JwtExpiry =
  | { status: "none" }
  | { status: "active" | "expired" | "not-yet-valid"; at: Date };

function decodeBase64Url(segment: string): string {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function decodeSegment(segment: string, name: string): JwtJson {
  let parsed: unknown;
  try {
    parsed = JSON.parse(decodeBase64Url(segment));
  } catch {
    throw new Error(`The ${name} is not valid Base64URL-encoded JSON`);
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error(`The ${name} is not a JSON object`);
  }
  return parsed as JwtJson;
}

/** Decodes a JWT without verifying its signature. */
export function decodeJwt(input: string): JwtResult {
  const token = input.trim().replace(/^Bearer\s+/i, "");
  const parts = token.split(".");
  if (parts.length !== 3) {
    return {
      valid: false,
      error:
        "A JWT has three parts separated by dots: header.payload.signature",
    };
  }
  const [header = "", payload = "", signature = ""] = parts;
  try {
    return {
      valid: true,
      header: decodeSegment(header, "header"),
      payload: decodeSegment(payload, "payload"),
      signature,
    };
  } catch (e) {
    return {
      valid: false,
      error: e instanceof Error ? e.message : "Invalid token",
    };
  }
}

const toDate = (seconds: unknown): Date | null =>
  typeof seconds === "number" && Number.isFinite(seconds)
    ? new Date(seconds * 1000)
    : null;

/** Reads the `nbf` and `exp` claims against the given moment. */
export function describeExpiry(payload: JwtJson, now: Date): JwtExpiry {
  const notBefore = toDate(payload.nbf);
  if (notBefore && notBefore.getTime() > now.getTime()) {
    return { status: "not-yet-valid", at: notBefore };
  }
  const expiresAt = toDate(payload.exp);
  if (!expiresAt) {
    return { status: "none" };
  }
  return {
    status: expiresAt.getTime() <= now.getTime() ? "expired" : "active",
    at: expiresAt,
  };
}

/** Claims that hold a Unix time, paired with their readable date. */
export function readTimeClaims(
  payload: JwtJson
): { claim: string; at: Date }[] {
  return ["iat", "nbf", "exp", "auth_time"].flatMap((claim) => {
    const at = toDate(payload[claim]);
    return at ? [{ claim, at }] : [];
  });
}
