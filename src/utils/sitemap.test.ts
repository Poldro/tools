import { describe, expect, it } from "vitest";
import { buildSitemap } from "./sitemap";

describe("buildSitemap", () => {
  it("lists every path as an absolute URL", () => {
    const xml = buildSitemap("https://tools.example", ["/", "/word-counter"]);
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("<url><loc>https://tools.example/</loc></url>");
    expect(xml).toContain(
      "<url><loc>https://tools.example/word-counter</loc></url>"
    );
    expect(xml.match(/<url>/g)).toHaveLength(2);
  });

  it("escapes XML special characters", () => {
    expect(buildSitemap("https://tools.example", ["/a?b=1&c=2"])).toContain(
      "<loc>https://tools.example/a?b=1&amp;c=2</loc>"
    );
  });
});
