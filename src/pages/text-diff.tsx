import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { Notice } from "../components/Notice";
import { Title } from "../components/Title";
import { ToggleGroup } from "../components/ToggleGroup";
import Layout from "../containers/layout";
import {
  diffStats,
  diffText,
  type DiffMode,
  type DiffPart,
} from "../utils/text-diff";

const MODES = [
  { value: "lines", label: "By line" },
  { value: "words", label: "By word" },
] as const;

const UNIT: Record<DiffMode, [string, string]> = {
  lines: ["line", "lines"],
  words: ["word", "words"],
};

const PART_CLASS: Record<DiffPart["kind"], string> = {
  added: "bg-primary/25 text-green-200",
  removed: "bg-red-500/25 text-red-200 line-through decoration-red-300/60",
  same: "text-gray-300",
};

const PART_LABEL: Record<DiffPart["kind"], string> = {
  added: "Added: ",
  removed: "Removed: ",
  same: "",
};

const TEXTAREA_CLASS =
  "h-64 w-full resize-none rounded-md border border-gray-600 bg-dark/50 p-3 font-mono text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary";

const plural = (count: number, mode: DiffMode): string =>
  `${count} ${UNIT[mode][count === 1 ? 0 : 1]}`;

const TextDiff: NextPage = () => {
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");
  const [mode, setMode] = useState<DiffMode>("lines");

  const hasInput = before.length > 0 || after.length > 0;
  const parts = diffText(before, after, mode);
  const stats = diffStats(parts, mode);
  const identical = hasInput && stats.added === 0 && stats.removed === 0;

  return (
    <>
      <Head>
        <title>Text Diff</title>
        <meta
          name="description"
          content="Compare two texts in your browser and highlight what was added or removed, line by line or word by word."
        />
      </Head>
      <Layout>
        <Title title="Text Diff" />

        <div className="mb-4">
          <ToggleGroup
            label="Compare"
            options={MODES}
            value={mode}
            onChange={setMode}
          />
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="diff-before"
              className="text-sm font-medium text-gray-300"
            >
              Original
            </label>
            <textarea
              id="diff-before"
              value={before}
              onChange={(e) => setBefore(e.target.value)}
              placeholder="Paste the original text here..."
              spellCheck={false}
              className={TEXTAREA_CLASS}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="diff-after"
              className="text-sm font-medium text-gray-300"
            >
              Changed
            </label>
            <textarea
              id="diff-after"
              value={after}
              onChange={(e) => setAfter(e.target.value)}
              placeholder="Paste the changed text here..."
              spellCheck={false}
              className={TEXTAREA_CLASS}
            />
          </div>
        </div>

        {identical && (
          <Notice tone="success">The two texts are identical</Notice>
        )}
        {hasInput && !identical && (
          <Notice tone="warning">
            {plural(stats.added, mode)} added, {plural(stats.removed, mode)}{" "}
            removed
          </Notice>
        )}

        {hasInput && (
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-gray-300">Differences</h2>
            <pre
              tabIndex={0}
              aria-label="Differences"
              className="max-h-[32rem] w-full overflow-auto whitespace-pre-wrap break-words rounded-md border border-gray-600 bg-dark/50 p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {parts.map((part, index) => (
                <span key={index} className={PART_CLASS[part.kind]}>
                  {part.kind !== "same" && (
                    <span className="sr-only">{PART_LABEL[part.kind]}</span>
                  )}
                  {part.text}
                </span>
              ))}
            </pre>
          </div>
        )}
      </Layout>
    </>
  );
};

export default TextDiff;
