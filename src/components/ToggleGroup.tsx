interface ToggleGroupProps<T extends string> {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export const ToggleGroup = <T extends string>({
  label,
  options,
  value,
  onChange,
}: ToggleGroupProps<T>) => {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            option.value === value
              ? "bg-primary text-white"
              : "border border-gray-600 text-gray-300 hover:border-primary"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
