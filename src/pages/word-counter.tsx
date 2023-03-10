import { type NextPage } from "next";
import { useState } from "react";
import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import Head from "next/head";
import Layout from "../containers/layout";

const CountWords: NextPage = () => {
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);

  const [selectedWordCount, setSelectedWordCount] = useState(0);
  const [selectedCharacterCount, setSelectedCharacterCount] = useState(0);
  const [selectedSentenceCount, setSelectedSentenceCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWordCount(
      e.target.value.split(" ").filter((word) => word.length > 0).length
    );
    setCharacterCount(e.target.value.length);
    setSentenceCount(e.target.value.split(/[.!?]+/g).length - 1);
  };

  const handleSelection = () => {
    const selection = window.getSelection() || "";
    setSelectedWordCount(
      selection.toString().split(/\s+/g).filter(Boolean).length
    );
    setSelectedCharacterCount(selection.toString().length);
    setSelectedSentenceCount(selection.toString().split(/[.!?]+/g).length - 1);
  };

  return (
    <>
      <Head>
        <title>Word Counter</title>
        <meta
          name="description"
          content="A simple free word counter, integrated with Grammarly to check english grammar."
        />
      </Head>
      <Layout>
        <div className="flex flex-1 w-full flex-col items-center justify-center">
          <div className="my-5 flex flex-col flex-1 w-full max-w-3xl divide-y divide-gray-200 rounded-lg bg-white shadow lg:my-8">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-center text-lg md:text-3xl font-semibold">
                Word Counter
              </h1>
            </div>
            <div className="flex-1 px-4 py-4 sm:px-6">
              <GrammarlyEditorPlugin clientId="client_2QNNYPesdJhwfCszntmPA6">
                <textarea
                  onChange={handleChange}
                  onSelect={handleSelection}
                  placeholder="Copy paste your text to count words, characters and sentences. You can select a particular piece of text to count it."
                  className="focus-ring-0 block h-full w-full resize-none border-0 p-2 focus:outline-0 sm:text-sm"
                ></textarea>
              </GrammarlyEditorPlugin>
            </div>
          </div>
          <div className="w-full max-w-3xl">
            <dl className="my-4 grid grid-cols-3 gap-4">
              <div className="flex flex-col justify-between rounded-lg bg-white px-4 py-5 text-center shadow sm:p-6">
                <dt className="text-sm font-medium text-gray-500">
                  {selectedWordCount !== 0 && "Selected"} Words
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {selectedWordCount === 0 ? wordCount : selectedWordCount}
                </dd>
              </div>

              <div className="flex flex-col justify-between overflow-hidden rounded-lg bg-white px-4 py-5 text-center shadow sm:p-6">
                <dt className="text-sm font-medium text-gray-500">
                  {selectedCharacterCount !== 0 && "Selected"} Characters
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {selectedCharacterCount === 0
                    ? characterCount
                    : selectedCharacterCount}
                </dd>
              </div>

              <div className="flex flex-col justify-between overflow-hidden rounded-lg bg-white px-4 py-5 text-center shadow sm:p-6">
                <dt className="text-sm font-medium text-gray-500">
                  {selectedSentenceCount !== 0 && "Selected"} Sentences
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {selectedSentenceCount === 0
                    ? sentenceCount
                    : selectedSentenceCount}
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
