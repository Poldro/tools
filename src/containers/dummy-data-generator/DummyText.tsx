import { ClipboardDocumentIcon, ClipboardIcon, ScissorsIcon } from "@heroicons/react/24/outline";
import RandExp from "randexp";
import { useState } from "react";
import { toast } from "react-toastify";
import { loremIpsumData } from "../../utils/dummy-data";

export const DummyText = () => {
  const [randomString, setRandomString] = useState(new RandExp(loremIpsumData).gen());

  function createRandomString() {
    setRandomString(new RandExp(loremIpsumData).gen());
  }

  return (
    <div className="flex flex-col flex-1 divide-y divide-gray-200  rounded-lg bg-white shadow">
      <div className="px-4 py-5 text-center sm:px-6">
        <button
          onClick={() => createRandomString()}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Generate
        </button>
      </div>
      <div className="relative flex-1 p-4 sm:p-6">
        <div
          className="absolute top-1 right-1 cursor-copy rounded-md border bg-white p-2 shadow-md transition hover:bg-gray-100"
          onClick={() => {
            void navigator.clipboard.writeText(randomString)
              .then(() => {
                toast("Copied to clipboard", {
                  icon: "✂️",
                });
              })
              .catch((error) => {
                console.error("Failed to copy to clipboard", error);
              });
          }}

        >
          <ClipboardDocumentIcon className="h-5 w-5 text-gray-500" />
        </div>

        <textarea
          placeholder=""
          className="scrollbar-hide border-box focus-ring-0 w-full h-full resize-none border-0 p-2 focus:outline-0 sm:text-sm"
          value={randomString}
          onChange={(e) => setRandomString(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};

