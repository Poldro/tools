import { type NextPage } from "next";
import Head from "next/head";
import { useCallback, useState } from "react";
import { CopyOnClick } from "../components/ClickToCopy";
import { Title } from "../components/Title";
import Layout from "../containers/layout";
import { unwrapText } from "../utils/text-unwrapper";

const TextUnwrapper: NextPage = () => {
  const [input, setInput] = useState("");

  const output = unwrapText(input);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const inputLines = input.trim() ? input.trim().split("\n").length : 0;
  const outputLines = output ? output.split("\n").length : 0;
  const joinedLines = Math.max(0, inputLines - outputLines);

  return (
    <>
      <Head>
        <title>Text Unwrapper</title>
        <meta
          name="description"
          content="Reflow hard-wrapped text copied from a terminal or console: rejoin broken lines while keeping paragraphs, bullets, and numbered lists."
        />
      </Head>
      <Layout>
        <Title title="Text Unwrapper" />

        <p className="mb-4 max-w-3xl text-sm text-gray-400">
          Paste text copied from a terminal or console. Lines broken by the
          terminal width are rejoined, while paragraphs, headings, bullets, and
          numbered lists are preserved.
        </p>

        {joinedLines > 0 && (
          <div className="mb-4 rounded-md border border-primary bg-primary/10 px-4 py-2 text-sm text-primary">
            {joinedLines} wrapped {joinedLines === 1 ? "line" : "lines"}{" "}
            rejoined
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Input</label>
            <textarea
              value={input}
              onChange={handleInput}
              placeholder="Paste your hard-wrapped console text here..."
              className="h-96 w-full resize-none rounded-md border border-gray-600 bg-dark/50 p-3 font-mono text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Output</label>
            <CopyOnClick
              copyText={output}
              allClickable={false}
              className="top-1 right-1"
            >
              <div className="relative">
                <textarea
                  readOnly
                  value={output}
                  placeholder="Reflowed text will appear here"
                  className="h-96 w-full resize-none rounded-md border border-gray-600 bg-dark/50 p-3 font-mono text-sm text-gray-100 focus:outline-none"
                />
              </div>
            </CopyOnClick>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default TextUnwrapper;
