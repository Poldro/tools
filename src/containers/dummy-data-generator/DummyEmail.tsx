import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Input } from "../../components/Input";
import { CopyOnClick } from "../../components/ClickToCopy";
import TextAreaInput from "../../components/TextAreaInput";
import PrimaryButton from "../../components/PrimaryButton";

interface EmailFormData {
  emailToGenerate: number;
}

interface RandomUserResult {
  results: Array<{ email: string }>;
}

export const DummyEmail = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>();

  const [randomEmails, setRandomEmails] = useState<string>(
    "user-fake@example.com"
  );
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    setRandomEmails("");
    try {
      const response = await fetch(
        `https://randomuser.me/api/?inc=email&results=${data.emailToGenerate}`
      );
      const result = (await response.json()) as RandomUserResult;
      setRandomEmails(result.results.map((i) => i.email + "\n").join(""));
    } catch {
      toast.error("Failed to generate emails. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <form
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
          className="space-y-4"
        >
          <Input
            type={"number"}
            label={"Number of emails to generate"}
            name={"emailToGenerate"}
            defaultValue={5}
            errors={errors}
            errorsType={{
              required: true,
              max: 100,
              min: 0,
            }}
            register={register}
          />
          <PrimaryButton
            type="submit"
            text={isLoading ? "Generating..." : "Generate"}
            disabled={isLoading}
          />
        </form>
      </div>
      <CopyOnClick
        copyText={randomEmails}
        allClickable={false}
        className="top-1 right-1"
      >
        <div className="relative">
          <TextAreaInput
            value={randomEmails}
            onChange={(e) => setRandomEmails(e.target.value)}
          />
        </div>
      </CopyOnClick>
    </>
  );
};
