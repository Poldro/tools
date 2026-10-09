import { type NextPage } from "next";
import Head from "next/head";
import { useCallback, useState } from "react";
import { Title } from "../components/Title";
import Layout from "../containers/layout";
import { testRegex } from "../utils/regex-matcher";

const RegexTester: NextPage = () => {
  const [pattern, setPattern] = useState("");
  const [testText, setTestText] = useState("");
  const [flagG, setFlagG] = useState(true);
  const [flagI, setFlagI] = useState(false);
  const [flagM, setFlagM] = useState(false);

  const flags = `${flagG ? "g" : ""}${flagI ? "i" : ""}${flagM ? "m" : ""}`;
  const result = testRegex(pattern, flags, testText);

  const hasGroups = result.matches.some((m) => m.groups.length > 0);

  const handlePatternChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPattern(e.target.value);
    },
    []
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTestText(e.target.value);
    },
    []
  );

  return (
    <>
      <Head>
        <title>Regex Tester</title>
        <meta
          name="description"
          content="Test JavaScript regular expressions live and inspect every match, index, and capture group."
        />
      </Head>
      <Layout>
        <Title title="Regex Tester" />

        <div className="space-y-6">
          {/* Pattern input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">
              Regular Expression
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xl text-gray-400">/</span>
              <input
                type="text"
                value={pattern}
                onChange={handlePatternChange}
                placeholder="e.g. \d{3}-\d{4}"
                className={`flex-1 rounded-md border bg-dark/50 px-3 py-2 font-mono text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary ${
                  !result.valid ? "border-red-500" : "border-gray-600"
                }`}
              />
              <span className="text-xl text-gray-400">/{flags}</span>
            </div>
            {!result.valid && (
              <p className="text-sm text-red-400">{result.error}</p>
            )}
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={flagG}
                onChange={(e) => setFlagG(e.target.checked)}
                className="rounded border-gray-600 bg-dark accent-primary"
              />
              <span>
                <code className="text-primary">g</code> Global
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={flagI}
                onChange={(e) => setFlagI(e.target.checked)}
                className="rounded border-gray-600 bg-dark accent-primary"
              />
              <span>
                <code className="text-primary">i</code> Case Insensitive
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={flagM}
                onChange={(e) => setFlagM(e.target.checked)}
                className="rounded border-gray-600 bg-dark accent-primary"
              />
              <span>
                <code className="text-primary">m</code> Multiline
              </span>
            </label>
          </div>

          {/* Test text */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">
              Test Text
            </label>
            <textarea
              value={testText}
              onChange={handleTextChange}
              placeholder="Enter the text to test your regex against..."
              className="h-40 w-full resize-none rounded-md border border-gray-600 bg-dark/50 p-3 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Results */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-300">Matches</span>
              {result.valid && pattern && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    result.matches.length > 0
                      ? "bg-primary/20 text-primary"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {result.matches.length} found
                </span>
              )}
            </div>

            {result.valid && result.matches.length > 0 && (
              <div className="overflow-x-auto rounded-md border border-gray-700">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-700 bg-dark/50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">
                        #
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">
                        Match
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">
                        Index
                      </th>
                      {hasGroups && (
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">
                          Groups
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {result.matches.map((match, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-800 last:border-0"
                      >
                        <td className="px-4 py-2 text-gray-500">{idx + 1}</td>
                        <td className="px-4 py-2">
                          <code className="rounded bg-primary/20 px-1 py-0.5 text-primary">
                            {match.text}
                          </code>
                        </td>
                        <td className="px-4 py-2 text-gray-400">
                          {match.index}
                        </td>
                        {hasGroups && (
                          <td className="px-4 py-2 text-gray-400">
                            {match.groups.length > 0
                              ? match.groups.map((g, i) => (
                                  <code
                                    key={i}
                                    className="mr-1 rounded bg-gray-700 px-1 py-0.5"
                                  >
                                    {g || (
                                      <em className="text-gray-500">
                                        undefined
                                      </em>
                                    )}
                                  </code>
                                ))
                              : "—"}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {result.valid && pattern && result.matches.length === 0 && (
              <p className="text-sm text-gray-500">No matches found.</p>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default RegexTester;
