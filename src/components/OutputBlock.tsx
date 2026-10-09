import { CopyOnClick } from "./ClickToCopy";

/** A read-only, copyable block of monospace text. */
export const OutputBlock = ({
  label,
  text,
  placeholder = "",
  className = "",
}: {
  label: string;
  text: string;
  placeholder?: string;
  className?: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-300">{label}</span>
      <CopyOnClick
        copyText={text}
        allClickable={false}
        className="top-1 right-1"
      >
        <pre
          aria-label={label}
          tabIndex={0}
          className={`w-full overflow-auto whitespace-pre-wrap break-all rounded-md border border-gray-600 bg-dark/50 p-3 pr-12 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
            text ? "text-gray-100" : "text-gray-500"
          } ${className}`}
        >
          {text || placeholder}
        </pre>
      </CopyOnClick>
    </div>
  );
};
