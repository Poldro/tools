import { type NextPage } from "next";
import { useState, useCallback } from "react";
import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import Head from "next/head";
import Layout from "../containers/layout";
import TextAreaInput from "../components/TextAreaInput";
import { Title } from "../components/Title";

// Helper function to calculate word, character, and sentence count

function calculateCounts(text: string) {
  const words = text.trim().split(/\s+/g).filter(Boolean);
  const characters = text.length;
  const sentences = text
    .split(/[.?!]/g)
    .filter((sentence) => /\w/.test(sentence)).length;

  return {
    wordCount: words.length,
    characterCount: characters,
    sentenceCount: sentences,
  };
}

const CountWords: NextPage = () => {
  const [text, setText] = useState(""); // New state variable

  const [counts, setCounts] = useState({
    wordCount: 0,
    characterCount: 0,
    sentenceCount: 0,
  });

  const [selectedCounts, setSelectedCounts] = useState({
    wordCount: 0,
    characterCount: 0,
    sentenceCount: 0,
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value;
      setText(newText); // Update text state variable
      setCounts(calculateCounts(newText));
    },
    []
  );

  const handleSelection = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textareaElement = event.target;
    const selection = textareaElement.value.substring(
      textareaElement.selectionStart,
      textareaElement.selectionEnd
    );
    setSelectedCounts(calculateCounts(selection));
  };
  return (
    <>
      <Head>
        <title>Word Counter</title>
        <meta
          name="description"
          content="A simple free word counter, integrated with Grammarly to check English grammar."
        />
      </Head>
      <Layout>
        <div className="flex w-full flex-col items-center justify-start space-y-4 lg:space-y-6">
          <Title title="Word Counter" />

          <div className="w-full max-w-3xl rounded-md bg-white/10 shadow">
            <div className="overflow-hidden px-4 py-4 sm:px-6">
              <GrammarlyEditorPlugin clientId="client_2QNNYPesdJhwfCszntmPA6">
                <TextAreaInput
                  value={text}
                  placeholder="Copy paste your text to count words, characters and sentences. You can select a particular piece of text to count it."
                  onChange={handleChange}
                  onSelect={handleSelection}
                />
              </GrammarlyEditorPlugin>
            </div>
          </div>
          <div className="w-full max-w-3xl">
            <dl className="grid grid-cols-3 gap-4">
              <div className="flex flex-col justify-between rounded-md bg-white/10 px-4 py-5 text-center shadow sm:p-6">
                <dt className="text-sm font-medium text-gray-400">
                  {(selectedCounts.wordCount !== 0 && "Selected") || ""} Words
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-50">
                  {selectedCounts.wordCount || counts.wordCount}
                </dd>
              </div>

              <div className="flex flex-col justify-between overflow-hidden rounded-md bg-white/10 px-4 py-5 text-center shadow sm:p-6">
                <dt className="text-sm font-medium text-gray-400">
                  {(selectedCounts.characterCount !== 0 && "Selected") || ""}{" "}
                  Characters
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-50">
                  {selectedCounts.characterCount || counts.characterCount}
                </dd>
              </div>

              <div className="flex flex-col justify-between overflow-hidden rounded-md bg-white/10 px-4 py-5 text-center shadow sm:p-6">
                <dt className="text-sm font-medium text-gray-400">
                  {(selectedCounts.sentenceCount !== 0 && "Selected") || ""}{" "}
                  Sentences
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-50">
                  {selectedCounts.sentenceCount || counts.sentenceCount}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CountWords;
