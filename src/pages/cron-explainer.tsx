import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Notice } from "../components/Notice";
import { Title } from "../components/Title";
import Layout from "../containers/layout";
import { explainCron } from "../utils/cron";

const EXAMPLES = [
  { expression: "*/15 * * * *", label: "Every 15 minutes" },
  { expression: "0 9 * * 1-5", label: "Weekdays at 9" },
  { expression: "0 0 1 * *", label: "First of the month" },
  { expression: "30 2 * * 0", label: "Sundays at 2:30" },
] as const;

const FIELDS = ["minute", "hour", "day of month", "month", "day of week"];

const CronExplainer: NextPage = () => {
  const [expression, setExpression] = useState("*/15 9-17 * * 1-5");
  // Set after mount, so the server-rendered page does not depend on the clock.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, [expression]);

  const result = now ? explainCron(expression, { from: now }) : null;
  const timeZone = now ? Intl.DateTimeFormat().resolvedOptions().timeZone : "";

  return (
    <>
      <Head>
        <title>Cron Expression Explainer</title>
        <meta
          name="description"
          content="Translate a cron expression into plain English and see its next run times in your time zone."
        />
      </Head>
      <Layout>
        <Title title="Cron Explainer" />

        <div className="mb-2 flex flex-col gap-2">
          <label
            htmlFor="cron-input"
            className="text-sm font-medium text-gray-300"
          >
            Cron expression
          </label>
          <input
            id="cron-input"
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="* * * * *"
            spellCheck={false}
            autoComplete="off"
            aria-describedby="cron-fields"
            className={`w-full rounded-md border bg-dark/50 p-3 font-mono text-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary ${
              result && !result.valid ? "border-red-500" : "border-gray-600"
            }`}
          />
          <p id="cron-fields" className="text-xs text-gray-400">
            Fields: {FIELDS.join(" · ")}. An optional sixth field in front sets
            the seconds.
          </p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example.expression}
              type="button"
              onClick={() => setExpression(example.expression)}
              className="rounded-md border border-gray-600 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:border-primary"
            >
              {example.label}
            </button>
          ))}
        </div>

        {result && !result.valid && (
          <Notice tone="error">{result.error}</Notice>
        )}

        {result?.valid && (
          <>
            <p className="mb-6 rounded-md border border-primary bg-primary/10 px-4 py-3 text-lg text-gray-50">
              {result.description}
            </p>

            <h2 className="mb-2 text-sm font-medium text-gray-300">
              Next runs{timeZone && ` (${timeZone})`}
            </h2>
            {result.nextRuns.length > 0 ? (
              <ol className="max-w-xl divide-y divide-gray-700 text-sm">
                {result.nextRuns.map((run) => (
                  <li key={run.getTime()} className="py-2 text-gray-200">
                    {run.toLocaleString(undefined, {
                      dateStyle: "full",
                      timeStyle: "medium",
                    })}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-gray-400">
                No upcoming runs could be calculated for this expression.
              </p>
            )}
          </>
        )}
      </Layout>
    </>
  );
};

export default CronExplainer;
