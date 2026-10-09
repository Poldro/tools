import { CronExpressionParser } from "cron-parser";
import cronstrue from "cronstrue";

export type CronResult =
  | { valid: true; description: string; nextRuns: Date[] }
  | { valid: false; error: string };

export interface CronOptions {
  /** The moment the next runs are counted from. */
  from: Date;
  /** How many upcoming runs to list. */
  count?: number;
  /** IANA time zone the expression is read in; defaults to the local one. */
  timeZone?: string;
}

const DEFAULT_RUN_COUNT = 5;

function describe(expression: string): string {
  try {
    return cronstrue.toString(expression, { use24HourTimeFormat: true });
  } catch (e) {
    // cronstrue throws plain strings such as "Error: minutes part must be...".
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(message.replace(/^Error:\s*/, ""));
  }
}

function listRuns(expression: string, options: CronOptions): Date[] {
  try {
    return CronExpressionParser.parse(expression, {
      currentDate: options.from,
      tz: options.timeZone,
    })
      .take(options.count ?? DEFAULT_RUN_COUNT)
      .map((run) => run.toDate());
  } catch {
    // Describable but never due (31 February) or outside the parser's dialect.
    return [];
  }
}

/** Explains a cron expression in words and lists when it runs next. */
export function explainCron(input: string, options: CronOptions): CronResult {
  const expression = input.trim().replace(/\s+/g, " ");
  if (!expression) {
    return { valid: false, error: "Enter a cron expression" };
  }
  try {
    return {
      valid: true,
      description: describe(expression),
      nextRuns: listRuns(expression, options),
    };
  } catch (e) {
    return {
      valid: false,
      error: e instanceof Error ? e.message : "Invalid cron expression",
    };
  }
}
