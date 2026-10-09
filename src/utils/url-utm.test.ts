import { describe, expect, it } from "vitest";
import { buildUtmUrl, parseUrl } from "./url-utm";

describe("parseUrl", () => {
  it("splits a URL and decodes its parameters", () => {
    expect(
      parseUrl(
        "https://example.com:8080/a/b?q=caff%C3%A8+latte&utm_source=x&q=2#top"
      )
    ).toEqual({
      valid: true,
      protocol: "https",
      host: "example.com:8080",
      path: "/a/b",
      hash: "top",
      params: [
        { key: "q", value: "caffè latte" },
        { key: "utm_source", value: "x" },
        { key: "q", value: "2" },
      ],
    });
  });

  it("reads a URL without a scheme as https", () => {
    expect(parseUrl("  example.com/page ")).toMatchObject({
      valid: true,
      protocol: "https",
      host: "example.com",
      path: "/page",
      params: [],
    });
  });

  it("rejects empty input and plain words", () => {
    expect(parseUrl("").valid).toBe(false);
    expect(parseUrl("hello").valid).toBe(false);
    expect(parseUrl("not a url").valid).toBe(false);
  });

  it("accepts localhost", () => {
    expect(parseUrl("http://localhost:3000/x").valid).toBe(true);
  });
});

describe("buildUtmUrl", () => {
  it("appends the filled-in fields in a fixed order", () => {
    expect(
      buildUtmUrl("https://example.com/landing", {
        utm_campaign: "spring sale",
        utm_source: "newsletter",
        utm_medium: " email ",
        utm_term: "",
      })
    ).toBe(
      "https://example.com/landing?utm_source=newsletter&utm_medium=email&utm_campaign=spring+sale"
    );
  });

  it("keeps other parameters and the hash, and replaces existing UTM values", () => {
    expect(
      buildUtmUrl(
        "https://example.com/?id=7&utm_source=old&utm_medium=cpc#buy",
        {
          utm_source: "new",
        }
      )
    ).toBe("https://example.com/?id=7&utm_source=new&utm_medium=cpc#buy");
  });

  it("returns null for an invalid base URL", () => {
    expect(buildUtmUrl("", { utm_source: "x" })).toBeNull();
    expect(buildUtmUrl("nope", { utm_source: "x" })).toBeNull();
  });
});
