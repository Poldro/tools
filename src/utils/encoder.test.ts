import { describe, expect, it } from "vitest";
import { sha256Hex, transform } from "./encoder";

describe("transform: base64", () => {
  it("round-trips UTF-8 text", () => {
    const encoded = transform("base64", "encode", "Perché ✓ 日本");
    expect(encoded).toEqual({ ok: true, value: "UGVyY2jDqSDinJMg5pel5pys" });
    expect(transform("base64", "decode", "UGVyY2jDqSDinJMg5pel5pys")).toEqual({
      ok: true,
      value: "Perché ✓ 日本",
    });
  });

  it("decodes URL-safe, unpadded and line-wrapped input", () => {
    expect(transform("base64", "decode", "aGVsbG8")).toEqual({
      ok: true,
      value: "hello",
    });
    expect(transform("base64", "decode", "Pz8_\nPz8-")).toEqual({
      ok: true,
      value: "?????>",
    });
  });

  it("reports invalid input", () => {
    expect(transform("base64", "decode", "@@@")).toEqual({
      ok: false,
      error: "This is not valid Base64 text",
    });
  });

  it("reports bytes that are not UTF-8", () => {
    expect(transform("base64", "decode", "//8=").ok).toBe(false);
  });
});

describe("transform: url", () => {
  it("encodes reserved characters", () => {
    expect(transform("url", "encode", "a b&c=d/é")).toEqual({
      ok: true,
      value: "a%20b%26c%3Dd%2F%C3%A9",
    });
  });

  it("decodes, and reports a malformed escape", () => {
    expect(transform("url", "decode", "a%20b%26c")).toEqual({
      ok: true,
      value: "a b&c",
    });
    expect(transform("url", "decode", "100%").ok).toBe(false);
  });
});

describe("transform: html", () => {
  it("escapes the five special characters", () => {
    expect(
      transform("html", "encode", `<a href="x">Tom & 'Jerry'</a>`)
    ).toEqual({
      ok: true,
      value: "&lt;a href=&quot;x&quot;&gt;Tom &amp; &#39;Jerry&#39;&lt;/a&gt;",
    });
  });

  it("decodes named and numeric entities", () => {
    expect(
      transform("html", "decode", "&lt;p&gt;&copy; &#233; &#x1F600; &AMP;")
    ).toEqual({
      ok: true,
      value: "<p>© é 😀 &",
    });
  });

  it("leaves unknown or out-of-range entities untouched", () => {
    expect(transform("html", "decode", "&bogus; &#99999999; a & b")).toEqual({
      ok: true,
      value: "&bogus; &#99999999; a & b",
    });
  });
});

describe("sha256Hex", () => {
  it("hashes the empty string and UTF-8 text", async () => {
    expect(await sha256Hex("")).toBe(
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    );
    expect(await sha256Hex("abc")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    );
  });
});
