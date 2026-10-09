import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Notice } from "../components/Notice";
import { OutputBlock } from "../components/OutputBlock";
import { Title } from "../components/Title";
import { ToggleGroup } from "../components/ToggleGroup";
import Layout from "../containers/layout";
import {
  sha256Hex,
  transform,
  type Codec,
  type Direction,
} from "../utils/encoder";

const CODECS = [
  { value: "base64", label: "Base64" },
  { value: "url", label: "URL" },
  { value: "html", label: "HTML entities" },
] as const;

const DIRECTIONS = [
  { value: "encode", label: "Encode" },
  { value: "decode", label: "Decode" },
] as const;

const EncodeDecode: NextPage = () => {
  const [input, setInput] = useState("");
  const [codec, setCodec] = useState<Codec>("base64");
  const [direction, setDirection] = useState<Direction>("encode");
  const [hash, setHash] = useState("");

  const result = transform(codec, direction, input);

  useEffect(() => {
    let current = true;
    if (!input) {
      setHash("");
      return;
    }
    sha256Hex(input)
      .then((value) => current && setHash(value))
      .catch(() => current && setHash(""));
    return () => {
      current = false;
    };
  }, [input]);

  return (
    <>
      <Head>
        <title>Encode / Decode: Base64, URL, HTML, SHA-256</title>
        <meta
          name="description"
          content="Encode and decode Base64, URL-encoded text, and HTML entities, and get the SHA-256 hash of any text. Runs in your browser."
        />
      </Head>
      <Layout>
        <Title title="Encode / Decode" />

        <div className="mb-4 flex flex-wrap gap-x-8 gap-y-2">
          <ToggleGroup
            label="Format"
            options={CODECS}
            value={codec}
            onChange={setCodec}
          />
          <ToggleGroup
            label="Direction"
            options={DIRECTIONS}
            value={direction}
            onChange={setDirection}
          />
        </div>

        {input && !result.ok && <Notice tone="error">{result.error}</Notice>}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="encode-input"
              className="text-sm font-medium text-gray-300"
            >
              Input
            </label>
            <textarea
              id="encode-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or paste text here..."
              spellCheck={false}
              className={`h-72 w-full resize-none rounded-md border bg-dark/50 p-3 font-mono text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary ${
                input && !result.ok ? "border-red-500" : "border-gray-600"
              }`}
            />
          </div>

          <OutputBlock
            label="Output"
            text={result.ok ? result.value : ""}
            placeholder="The result will appear here"
            className="h-72"
          />
        </div>

        <div className="mt-4">
          <OutputBlock
            label="SHA-256 of the input"
            text={hash}
            placeholder="The hash will appear here"
          />
        </div>
      </Layout>
    </>
  );
};

export default EncodeDecode;
