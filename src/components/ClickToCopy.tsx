import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

export const CopyOnClick = ({
  children,
  copyText,
  className,
  iconHover = true,
  toastCheck = true,
  allClickable = true,
}: {
  children: React.ReactNode;
  copyText: string;
  className?: string;
  iconHover?: boolean;
  toastCheck?: boolean;
  allClickable?: boolean;
}) => {
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    void navigator.clipboard
      .writeText(copyText)
      .then(() => {
        toastCheck &&
          toast("Copied to clipboard", {
            icon: "✂️",
          });
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <div
      className={`group relative ${allClickable ? "cursor-copy" : ""}`}
      onClick={allClickable ? handleCopy : undefined}
    >
      <div
        className={`${className ?? ""} absolute z-50 block ${
          iconHover ? "lg:hidden lg:group-hover:block" : ""
        } rounded-md border border-gray-300 bg-dark p-1  shadow-md lg:p-2 ${
          allClickable ? "" : "cursor-copy"
        }`}
        onClick={allClickable ? undefined : handleCopy}
      >
        <ClipboardDocumentIcon className="h-4 w-4 text-gray-300" />
      </div>
      {children}
    </div>
  );
};
