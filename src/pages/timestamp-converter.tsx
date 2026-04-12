import { type NextPage } from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import { CopyOnClick } from "../components/ClickToCopy";
import { Title } from "../components/Title";
import Layout from "../containers/layout";
import {
  fromDateString,
  fromUnix,
  getRelative,
  nowConversion,
  type DateConversion,
} from "../utils/timestamp-converter";

// ── Live clock ──────────────────────────────────────────────────────────────

function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const unix = Math.floor(now.getTime() / 1000);
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-md border border-gray-700 bg-dark/40 px-4 py-2.5 font-mono text-sm">
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
        <span className="text-gray-400">Now:</span>
      </span>
      <span className="text-gray-100">{unix}</span>
      <span className="text-gray-500">·</span>
      <span className="text-gray-300">
        {now.toLocaleTimeString("en-GB", { hour12: false })}
      </span>
      <span className="text-gray-500">·</span>
      <span className="text-gray-400">
        {now.toLocaleDateString("en-GB", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    </div>
  );
}

// ── Relative time that ticks ─────────────────────────────────────────────────

function LiveRelative({ unix }: { unix: number }) {
  const [label, setLabel] = useState(() =>
    getRelative(new Date(unix * 1000))
  );

  useEffect(() => {
    const update = () => setLabel(getRelative(new Date(unix * 1000)));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [unix]);

  return <>{label}</>;
}

// ── Output card ──────────────────────────────────────────────────────────────

interface OutputCardProps {
  label: string;
  value: string | number | React.ReactNode;
  copyText?: string;
  wide?: boolean;
  muted?: boolean;
}

function OutputCard({ label, value, copyText, wide, muted }: OutputCardProps) {
  const text = copyText ?? (typeof value === "string" || typeof value === "number" ? String(value) : "");

  const inner = (
    <div
      className={`relative rounded-md border bg-dark/50 p-3 ${
        muted ? "border-gray-800" : "border-gray-700"
      } ${wide ? "col-span-2" : ""}`}
    >
      <p className={`mb-1 text-xs font-medium ${muted ? "text-gray-600" : "text-gray-500"}`}>
        {label}
      </p>
      <p className={`font-mono text-sm break-all ${muted ? "text-gray-500" : "text-gray-100"}`}>
        {value}
      </p>
    </div>
  );

  if (!text) return inner;

  return (
    <CopyOnClick copyText={text} allClickable={false} className="top-1 right-1">
      {inner}
    </CopyOnClick>
  );
}

// ── Tab button ───────────────────────────────────────────────────────────────

type Tab = "unix-to-date" | "date-to-unix";

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-primary text-white"
          : "border border-gray-600 text-gray-300 hover:border-primary hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

const TimestampConverter: NextPage = () => {
  const [tab, setTab] = useState<Tab>("unix-to-date");
  const [unixInput, setUnixInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [result, setResult] = useState<DateConversion | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-convert on input change (debounced 200 ms)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runConvert = useCallback(
    (currentTab: Tab, unix: string, date: string) => {
      setError(null);
      if (currentTab === "unix-to-date") {
        if (!unix.trim()) { setResult(null); return; }
        const ts = Number(unix);
        if (isNaN(ts)) { setError("Enter a valid number."); return; }
        setResult(fromUnix(ts));
      } else {
        if (!date) { setResult(null); return; }
        const conv = fromDateString(date);
        if (isNaN(conv.unix)) { setError("Invalid date."); return; }
        setResult(conv);
      }
    },
    []
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runConvert(tab, unixInput, dateInput), 200);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [tab, unixInput, dateInput, runConvert]);

  const handleNow = useCallback(() => {
    setError(null);
    const now = nowConversion();
    if (tab === "unix-to-date") {
      setUnixInput(String(now.unix));
    } else {
      const d = new Date(now.unixMs);
      const pad = (n: number) => String(n).padStart(2, "0");
      setDateInput(
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
      );
    }
    setResult(now);
  }, [tab]);

  const handleTabChange = useCallback((t: Tab) => {
    setTab(t);
    setResult(null);
    setError(null);
    setUnixInput("");
    setDateInput("");
  }, []);

  // Enter key submits (for screen readers / keyboard users)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") runConvert(tab, unixInput, dateInput);
    },
    [tab, unixInput, dateInput, runConvert]
  );

  return (
    <Layout>
      <Title title="Timestamp & Date Converter" />

      {/* Live clock */}
      <div className="mt-4 mb-6">
        <LiveClock />
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-2">
        <TabBtn active={tab === "unix-to-date"} onClick={() => handleTabChange("unix-to-date")}>
          Unix → Date
        </TabBtn>
        <TabBtn active={tab === "date-to-unix"} onClick={() => handleTabChange("date-to-unix")}>
          Date → Unix
        </TabBtn>
      </div>

      <div className="space-y-4">
        {/* Input */}
        {tab === "unix-to-date" ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">
              Unix Timestamp
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={unixInput}
                onChange={(e) => setUnixInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. 1713000000"
                autoFocus
                className="flex-1 rounded-md border border-gray-600 bg-dark/50 px-3 py-2 font-mono text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleNow}
                title="Use current time"
                className="rounded-md border border-gray-600 px-3 py-2 text-sm text-gray-300 hover:border-primary hover:text-primary transition-colors"
              >
                Now
              </button>
            </div>
            <p className="text-xs text-gray-600">
              Supports seconds (10 digits) and milliseconds (13 digits) · auto-converts as you type
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">
              Date & Time (local timezone)
            </label>
            <div className="flex gap-2">
              <input
                type="datetime-local"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 rounded-md border border-gray-600 bg-dark/50 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleNow}
                title="Use current time"
                className="rounded-md border border-gray-600 px-3 py-2 text-sm text-gray-300 hover:border-primary hover:text-primary transition-colors"
              >
                Now
              </button>
            </div>
            <p className="text-xs text-gray-600">auto-converts as you type</p>
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-500 bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Output grid */}
        {result && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <OutputCard label="Unix (seconds)" value={result.unix} />
            <OutputCard label="Unix (milliseconds)" value={result.unixMs} />
            <OutputCard label="ISO 8601 (UTC)" value={result.iso8601} />
            <OutputCard label="ISO with local offset" value={result.isoWithOffset} />
            <OutputCard label="RFC 2822" value={result.rfc2822} wide />
            <OutputCard label="UTC (human)" value={result.utc} wide />
            <OutputCard label="Local" value={result.local} />
            <OutputCard
              label="Relative"
              value={<LiveRelative unix={result.unix} />}
              copyText={result.relative}
            />
            <OutputCard label="ISO week" value={`W${String(result.weekNumber).padStart(2, "0")}`} muted />
            <OutputCard label="Day of year" value={`Day ${result.dayOfYear}`} muted />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TimestampConverter;
