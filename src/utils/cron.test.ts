import { describe, expect, it } from "vitest";
import { explainCron } from "./cron";

const options = { from: new Date("2026-01-01T00:00:00Z"), timeZone: "UTC" };
const iso = (dates: Date[]) => dates.map((date) => date.toISOString());

describe("explainCron", () => {
  it("describes an expression and lists the next runs", () => {
    const result = explainCron("*/15 9-17 * * 1-5", { ...options, count: 3 });
    expect(result).toMatchObject({
      valid: true,
      description:
        "Every 15 minutes, between 09:00 and 17:59, Monday through Friday",
    });
    expect(result.valid && iso(result.nextRuns)).toEqual([
      "2026-01-01T09:00:00.000Z",
      "2026-01-01T09:15:00.000Z",
      "2026-01-01T09:30:00.000Z",
    ]);
  });

  it("lists five runs by default and tolerates extra whitespace", () => {
    const result = explainCron("  0   0 * * *  ", options);
    expect(result.valid && result.nextRuns).toHaveLength(5);
    expect(result.valid && iso(result.nextRuns)[0]).toBe(
      "2026-01-02T00:00:00.000Z"
    );
  });

  it("reads the expression in the given time zone", () => {
    const result = explainCron("0 9 * * *", {
      ...options,
      timeZone: "Europe/Rome",
      count: 1,
    });
    expect(result.valid && iso(result.nextRuns)).toEqual([
      "2026-01-01T08:00:00.000Z",
    ]);
  });

  it("accepts macros such as @daily", () => {
    const result = explainCron("@daily", options);
    expect(result).toMatchObject({ valid: true, description: "At 00:00" });
  });

  it("reports an out-of-range field without the library prefix", () => {
    expect(explainCron("60 * * * *", options)).toEqual({
      valid: false,
      error: "minutes part must be >= 0 and <= 59",
    });
  });

  it("reports too few fields and empty input", () => {
    expect(explainCron("* * * *", options).valid).toBe(false);
    expect(explainCron("   ", options)).toEqual({
      valid: false,
      error: "Enter a cron expression",
    });
  });

  it("describes a date that never occurs, with no runs", () => {
    const result = explainCron("0 0 31 2 *", options);
    expect(result).toMatchObject({ valid: true, nextRuns: [] });
  });
});
