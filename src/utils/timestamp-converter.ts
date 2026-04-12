export interface DateConversion {
  unix: number;
  unixMs: number;
  iso8601: string;
  utc: string;
  local: string;
  relative: string;
  rfc2822: string;
  weekNumber: number;
  dayOfYear: number;
  isoWithOffset: string;
}

export function fromUnix(timestamp: number): DateConversion {
  const ms = timestamp > 1e12 ? timestamp : timestamp * 1000;
  const date = new Date(ms);
  return buildConversion(date);
}

export function fromDateString(dateString: string): DateConversion {
  const date = new Date(dateString);
  return buildConversion(date);
}

export function nowConversion(): DateConversion {
  return buildConversion(new Date());
}

function buildConversion(date: Date): DateConversion {
  const unix = Math.floor(date.getTime() / 1000);
  const unixMs = date.getTime();
  const iso8601 = date.toISOString();
  const utc = date.toUTCString();
  const local = date.toLocaleString();
  const relative = getRelative(date);
  const rfc2822 = getRfc2822(date);
  const weekNumber = getIsoWeekNumber(date);
  const dayOfYear = getDayOfYear(date);
  const isoWithOffset = getIsoWithOffset(date);

  return {
    unix,
    unixMs,
    iso8601,
    utc,
    local,
    relative,
    rfc2822,
    weekNumber,
    dayOfYear,
    isoWithOffset,
  };
}

export function getRelative(date: Date): string {
  const diffMs = date.getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const absSec = Math.abs(diffSec);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absSec < 60) return rtf.format(diffSec, "second");
  if (absSec < 3600) return rtf.format(Math.round(diffSec / 60), "minute");
  if (absSec < 86400) return rtf.format(Math.round(diffSec / 3600), "hour");
  if (absSec < 2592000) return rtf.format(Math.round(diffSec / 86400), "day");
  if (absSec < 31536000)
    return rtf.format(Math.round(diffSec / 2592000), "month");
  return rtf.format(Math.round(diffSec / 31536000), "year");
}

function getRfc2822(date: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = days[date.getUTCDay()] ?? "Sun";
  const dayNum = String(date.getUTCDate()).padStart(2, "0");
  const month = months[date.getUTCMonth()] ?? "Jan";
  const year = date.getUTCFullYear();
  const h = String(date.getUTCHours()).padStart(2, "0");
  const m = String(date.getUTCMinutes()).padStart(2, "0");
  const s = String(date.getUTCSeconds()).padStart(2, "0");
  return `${day}, ${dayNum} ${month} ${year} ${h}:${m}:${s} +0000`;
}

function getIsoWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

function getIsoWithOffset(date: Date): string {
  const offsetMin = -date.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const absMin = Math.abs(offsetMin);
  const hh = String(Math.floor(absMin / 60)).padStart(2, "0");
  const mm = String(absMin % 60).padStart(2, "0");
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}` +
    `${sign}${hh}:${mm}`
  );
}
