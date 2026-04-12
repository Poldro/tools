import RandExp from "randexp";
import { useState } from "react";
import {
  type FieldValues,
  useForm,
  type UseFormRegister,
} from "react-hook-form";
import { Input } from "../../components/Input";
import TextAreaInput from "../../components/TextAreaInput";
import { CopyOnClick } from "../../components/ClickToCopy";
import PrimaryButton from "../../components/PrimaryButton";

interface PhoneFormData {
  phoneToGenerate: number;
  phoneFormat: string;
}

export const DummyPhone = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneFormData>();

  const [randomNumbers, setRandomNumbers] = useState<string>(
    new RandExp(/^\+39\s\d{10}$/).gen()
  );

  const onSubmit = (data: PhoneFormData) => {
    let result = "";
    for (let i = 0; i < data.phoneToGenerate; i++) {
      result += substituteRandomNumbers(data.phoneFormat) + "\n";
    }
    setRandomNumbers(result);
  };

  return (
    <>
      {" "}
      <div className="text-center">
        <form
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <span>
              <Input
                type={"text"}
                label={"Format for Phone Numbers"}
                name={"phoneFormat"}
                defaultValue={"+39 ##########"}
                errors={errors}
                errorsType={{
                  required: true,
                }}
                register={register as UseFormRegister<FieldValues>}
              />
              <p className="mt-1 text-xs text-gray-500">
                Es: (#####) ### #### or 570-###-###
              </p>
            </span>
            <span className="mt-4 md:mt-0">
              <Input
                type={"number"}
                label={"Quantity of Phone Numbers"}
                name={"phoneToGenerate"}
                defaultValue={5}
                errors={errors}
                errorsType={{
                  required: true,
                  max: 100,
                  min: 0,
                }}
                register={register as UseFormRegister<FieldValues>}
              />
            </span>
          </div>
          <PrimaryButton type="submit" text="Generate" />
        </form>
      </div>
      <CopyOnClick
        copyText={randomNumbers}
        allClickable={false}
        className="top-1 right-1"
      >
        <div className="relative">
          <TextAreaInput
            value={randomNumbers}
            onChange={(e) => setRandomNumbers(e.target.value)}
          />
        </div>
      </CopyOnClick>
    </>
  );
};

function substituteRandomNumbers(formatString: string) {
  return formatString.replace(/#/g, () =>
    Math.floor(Math.random() * 10).toString()
  );
}
