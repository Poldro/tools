const TONES = {
  error: "border-red-500 bg-red-500/10 text-red-400",
  success: "border-primary bg-primary/10 text-primary",
  warning: "border-yellow-500 bg-yellow-500/10 text-yellow-400",
} as const;

export const Notice = ({
  tone,
  children,
}: {
  tone: keyof typeof TONES;
  children: React.ReactNode;
}) => {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`mb-4 rounded-md border px-4 py-2 text-sm ${TONES[tone]}`}
    >
      {children}
    </div>
  );
};
