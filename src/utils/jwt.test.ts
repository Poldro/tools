import { describe, expect, it } from "vitest";
import { decodeJwt, describeExpiry, readTimeClaims } from "./jwt";

const encode = (value: unknown): string =>
  Buffer.from(JSON.stringify(value)).toString("base64url");
const token = (
  payload: unknown,
  header: unknown = { alg: "HS256", typ: "JWT" }
) => `${encode(header)}.${encode(payload)}.c2lnbmF0dXJl`;

describe("decodeJwt", () => {
  it("decodes header, payload and signature", () => {
    const result = decodeJwt(token({ sub: "42", name: "Zoë ✓" }));
    expect(result).toEqual({
      valid: true,
      header: { alg: "HS256", typ: "JWT" },
      payload: { sub: "42", name: "Zoë ✓" },
      signature: "c2lnbmF0dXJl",
    });
  });

  it("accepts surrounding whitespace and a Bearer prefix", () => {
    const result = decodeJwt(`  Bearer ${token({ sub: "1" })}\n`);
    expect(result.valid).toBe(true);
  });

  it("rejects a token without three parts", () => {
    const result = decodeJwt("abc.def");
    expect(result).toMatchObject({ valid: false });
    expect(!result.valid && result.error).toContain("three parts");
  });

  it("names the part that fails to decode", () => {
    const result = decodeJwt(`${encode({ alg: "none" })}.not-json.sig`);
    expect(!result.valid && result.error).toContain("payload");
  });

  it("rejects a payload that is not an object", () => {
    const result = decodeJwt(token(["a"]));
    expect(!result.valid && result.error).toContain("not a JSON object");
  });
});

describe("describeExpiry", () => {
  const now = new Date("2026-01-01T00:00:00Z");
  const seconds = (iso: string) => Date.parse(iso) / 1000;

  it("reports no expiry when exp is missing", () => {
    expect(describeExpiry({}, now)).toEqual({ status: "none" });
  });

  it("reports an active token", () => {
    const exp = seconds("2026-01-02T00:00:00Z");
    expect(describeExpiry({ exp }, now)).toEqual({
      status: "active",
      at: new Date("2026-01-02T00:00:00Z"),
    });
  });

  it("reports an expired token, including at the exact expiry second", () => {
    expect(
      describeExpiry({ exp: seconds("2025-12-31T00:00:00Z") }, now).status
    ).toBe("expired");
    expect(
      describeExpiry({ exp: seconds("2026-01-01T00:00:00Z") }, now).status
    ).toBe("expired");
  });

  it("reports a token that is not valid yet", () => {
    const nbf = seconds("2026-06-01T00:00:00Z");
    expect(describeExpiry({ nbf, exp: nbf + 60 }, now).status).toBe(
      "not-yet-valid"
    );
  });

  it("ignores a non-numeric exp", () => {
    expect(describeExpiry({ exp: "tomorrow" }, now)).toEqual({
      status: "none",
    });
  });
});

describe("readTimeClaims", () => {
  it("lists only the time claims that are present", () => {
    expect(readTimeClaims({ iat: 0, exp: 60, sub: "x" })).toEqual([
      { claim: "iat", at: new Date(0) },
      { claim: "exp", at: new Date(60_000) },
    ]);
  });
});
