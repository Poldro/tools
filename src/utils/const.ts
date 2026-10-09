/** The shelves the tools are sorted onto, in the order they are shown. */
export const categories = [
  { id: "text", name: "Text" },
  { id: "data", name: "Data & code" },
  { id: "web", name: "Web & design" },
  { id: "time", name: "Time & scheduling" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

interface NavigationItem {
  name: string;
  href: string;
  category: CategoryId;
  current: boolean;
  description: string;
  icon: string;
}

export const navigation: readonly NavigationItem[] = [
  {
    name: "Word Counter",
    href: "/word-counter",
    category: "text",
    current: false,
    description:
      "Count words, characters, and sentences. Select a passage for a partial count.",
    icon: "DocumentTextIcon",
  },
  {
    name: "Text Unwrapper",
    href: "/text-unwrapper",
    category: "text",
    current: false,
    description:
      "Reflow hard-wrapped console text: rejoin broken lines while keeping bullets and paragraphs.",
    icon: "Bars3BottomLeftIcon",
  },
  {
    name: "Text Diff",
    href: "/text-diff",
    category: "text",
    current: false,
    description:
      "Compare two versions of a text and see what was added or removed, by line or by word.",
    icon: "DocumentDuplicateIcon",
  },
  {
    name: "JSON Formatter",
    href: "/json-formatter",
    category: "data",
    current: false,
    description:
      "Validate, format, or minify JSON with instant syntax-error feedback.",
    icon: "CodeBracketIcon",
  },
  {
    name: "Regex Tester",
    href: "/regex-tester",
    category: "data",
    current: false,
    description:
      "Test regular expressions live and inspect every match, index, and capture group.",
    icon: "MagnifyingGlassIcon",
  },
  {
    name: "JWT Decoder",
    href: "/jwt-decoder",
    category: "data",
    current: false,
    description:
      "Read a token's header, claims, and expiry. Decoded in your browser, never sent anywhere.",
    icon: "KeyIcon",
  },
  {
    name: "Encode / Decode",
    href: "/encode-decode",
    category: "data",
    current: false,
    description:
      "Base64, URL, and HTML-entity encoding in both directions, plus a SHA-256 hash.",
    icon: "ArrowsRightLeftIcon",
  },
  {
    name: "Color Converter",
    href: "/color-converter",
    category: "web",
    current: false,
    description:
      "Convert colors between HEX, RGB, HSL, and CMYK with a live visual picker.",
    icon: "SwatchIcon",
  },
  {
    name: "URL & UTM Builder",
    href: "/url-utm-builder",
    category: "web",
    current: false,
    description:
      "Break a URL into its parameters and build campaign links with UTM tags.",
    icon: "LinkIcon",
  },
  {
    name: "Timestamp Converter",
    href: "/timestamp-converter",
    category: "time",
    current: false,
    description:
      "Convert Unix timestamps to ISO 8601, RFC 2822, local time, and more — and back.",
    icon: "ClockIcon",
  },
  {
    name: "Cron Explainer",
    href: "/cron-explainer",
    category: "time",
    current: false,
    description:
      "Translate a cron expression into plain words and list its next run times.",
    icon: "CalendarDaysIcon",
  },
];

export const SITE_URL = "https://tools.poldro.eu";
