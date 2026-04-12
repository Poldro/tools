import RandExp from "randexp";
import { useState } from "react";
import { loremIpsumData } from "../../utils/dummy-data";
import TextAreaInput from "../../components/TextAreaInput";
import { CopyOnClick } from "../../components/ClickToCopy";
import PrimaryButton from "../../components/PrimaryButton";

export const DummyText = () => {
  const [randomString, setRandomString] = useState(
    new RandExp(loremIpsumData).gen()
  );

  function createRandomString() {
    setRandomString(new RandExp(loremIpsumData).gen());
  }

  return (
    <>
      <div className="text-center">
        <PrimaryButton text="Generate" onClick={() => createRandomString()} />
      </div>
      <CopyOnClick
        copyText={randomString}
        allClickable={false}
        className="top-1 right-1"
      >
        <div className="relative">
          <TextAreaInput
            value={randomString}
            onChange={(e) => setRandomString(e.target.value)}
          />
        </div>
      </CopyOnClick>
    </>
  );
};
