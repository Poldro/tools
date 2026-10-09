import { describe, expect, it } from "vitest";
import { categories, navigation } from "./const";
import { groupTools } from "./tools";

const groups = [
  { id: "text", name: "Text" },
  { id: "time", name: "Time" },
] as const;

const tools = [
  { name: "Word Counter", href: "/word-counter", category: "text", description: "Count words and sentences." },
  { name: "Cron Explainer", href: "/cron-explainer", category: "time", description: "Translate a cron expression." },
  { name: "Text Diff", href: "/text-diff", category: "text", description: "Compare two versions." },
];

describe("groupTools", () => {
  it("groups the tools by category, in the order of the categories", () => {
    const result = groupTools(tools, groups);
    expect(result.map((group) => group.name)).toEqual(["Text", "Time"]);
    expect(result[0]?.tools.map((tool) => tool.name)).toEqual([
      "Word Counter",
      "Text Diff",
    ]);
  });

  it("keeps only the tools matching the query, and drops empty categories", () => {
    const result = groupTools(tools, groups, "cron");
    expect(result).toHaveLength(1);
    expect(result[0]?.tools.map((tool) => tool.name)).toEqual(["Cron Explainer"]);
  });

  it("matches on description and category name, whatever the case and spacing", () => {
    expect(groupTools(tools, groups, "  SENTENCES ")[0]?.tools).toHaveLength(1);
    expect(groupTools(tools, groups, "time")[0]?.tools[0]?.name).toBe(
      "Cron Explainer"
    );
  });

  it("needs every word of the query to match", () => {
    expect(groupTools(tools, groups, "text compare")[0]?.tools).toHaveLength(1);
    expect(groupTools(tools, groups, "text nothing")).toEqual([]);
  });

  it("does not mutate what it is given", () => {
    const before = JSON.stringify(tools);
    groupTools(tools, groups, "text");
    expect(JSON.stringify(tools)).toBe(before);
  });
});

describe("navigation", () => {
  it("files every tool under a known category, and leaves no category empty", () => {
    const ids = categories.map((category) => category.id);
    for (const tool of navigation) expect(ids, tool.name).toContain(tool.category);
    expect(groupTools(navigation, categories)).toHaveLength(categories.length);
  });
});
