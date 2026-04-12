import { type NextPage } from "next";
import { useCallback, useState } from "react";
import { CopyOnClick } from "../components/ClickToCopy";
import { Title } from "../components/Title";
import Layout from "../containers/layout";
import { parseJson } from "../utils/json-formatter";

type Mode = "format" | "minify";

const JsonFormatter: NextPage = () => {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("format");

  const result = parseJson(input);
  const output = result.valid
    ? mode === "format"
      ? result.formatted ?? ""
      : result.minified ?? ""
    : "";

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const showError = input.trim().length > 0 && !result.valid;
  const showValid = input.trim().length > 0 && result.valid;

  return (
    <Layout>
      <Title title="JSON Formatter & Validator" />

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setMode("format")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            mode === "format"
              ? "bg-primary text-white"
              : "border border-gray-600 text-gray-300 hover:border-primary"
          }`}
        >
          Format
        </button>
        <button
          onClick={() => setMode("minify")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            mode === "minify"
              ? "bg-primary text-white"
              : "border border-gray-600 text-gray-300 hover:border-primary"
          }`}
        >
          Minify
        </button>
      </div>

      {showError && (
        <div className="mb-4 rounded-md border border-red-500 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {result.error}
        </div>
      )}
      {showValid && (
        <div className="mb-4 rounded-md border border-primary bg-primary/10 px-4 py-2 text-sm text-primary">
          Valid JSON
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Input</label>
          <textarea
            value={input}
            onChange={handleInput}
            placeholder='Paste your JSON here... e.g. {"name": "world"}'
            className={`h-80 w-full resize-none rounded-md border bg-dark/50 p-3 font-mono text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary ${
              showError ? "border-red-500" : "border-gray-600"
            }`}
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
                placeholder="Formatted output will appear here"
                className={`h-80 w-full resize-none rounded-md border bg-dark/50 p-3 font-mono text-sm text-gray-100 focus:outline-none ${
                  showValid ? "border-primary" : "border-gray-600"
                }`}
              />
            </div>
          </CopyOnClick>
        </div>
      </div>
    </Layout>
  );
};

export default JsonFormatter;
