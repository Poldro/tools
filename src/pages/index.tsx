import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { ICON_MAP } from "../components/toolIcons";
import { categories, navigation } from "../utils/const";
import { groupTools } from "../utils/tools";

type Tool = (typeof navigation)[number];

const SEARCH_SHORTCUT = "/";

const isTyping = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

const ToolCard = ({ tool }: { tool: Tool }) => {
  const Icon = ICON_MAP[tool.icon];
  return (
    <Link
      href={tool.href}
      className="group flex h-full items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-primary/40 hover:bg-white/10 focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/60"
    >
      {Icon && (
        <div className="mt-0.5 bg-primary/10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-primary transition-colors group-hover:bg-primary/20">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-100 group-hover:text-white">
          {tool.name}
        </p>
        <p className="mt-1 text-sm leading-snug text-gray-400">
          {tool.description}
        </p>
      </div>
      <span
        aria-hidden="true"
        className="mt-1 flex-shrink-0 text-gray-500 transition-all group-hover:translate-x-0.5 group-hover:text-primary"
      >
        →
      </span>
    </Link>
  );
};

const Home: NextPage = () => {
  const router = useRouter();
  const search = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const groups = useMemo(
    () => groupTools(navigation, categories, query),
    [query]
  );
  const firstMatch = groups[0]?.tools[0];

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if (event.key !== SEARCH_SHORTCUT || isTyping(event.target)) return;
      event.preventDefault();
      search.current?.focus();
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const openFirstMatch = (event: React.FormEvent) => {
    event.preventDefault();
    // Nothing to open while the box is empty: the first tool would be an arbitrary pick.
    if (query.trim() && firstMatch) void router.push(firstMatch.href);
  };

  return (
    <>
      <Head>
        <title>Dev Tools</title>
        <meta
          name="description"
          content="A collection of web development tools"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-dark-secondary via-dark to-dark">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-14 sm:py-20">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
              <span className="text-primary">Dev</span> Tools
            </h1>
            <p className="mt-3 text-gray-400">
              A small collection of everyday utilities for developers.
            </p>
          </div>

          <form
            role="search"
            onSubmit={openFirstMatch}
            className="relative mx-auto w-full max-w-xl"
          >
            <label htmlFor="tool-search" className="sr-only">
              Search the tools
            </label>
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
            />
            <input
              ref={search}
              id="tool-search"
              type="text"
              inputMode="search"
              enterKeyHint="go"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setQuery("");
              }}
              placeholder="Search: json, time, encode…"
              autoComplete="off"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-14 text-gray-100 placeholder:text-gray-500 focus:border-primary focus:bg-white/10 focus:ring-2 focus:ring-primary/40"
            />
            <kbd
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded border border-white/15 px-1.5 font-mono text-xs text-gray-500 sm:block"
            >
              {SEARCH_SHORTCUT}
            </kbd>
          </form>

          <p className="sr-only" role="status">
            {groups.reduce((count, group) => count + group.tools.length, 0)}{" "}
            tools shown
          </p>

          {groups.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/15 px-6 py-12 text-center">
              <p className="text-gray-300">
                No tool matches “{query.trim()}”.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  search.current?.focus();
                }}
                className="mt-3 text-primary hover:underline"
              >
                Show all the tools
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {groups.map((group) => (
                <section key={group.id} aria-labelledby={`category-${group.id}`}>
                  <div className="flex items-center gap-4">
                    <h2
                      id={`category-${group.id}`}
                      className="font-mono text-xs uppercase tracking-[0.2em] text-primary"
                    >
                      {group.name}
                    </h2>
                    <span className="h-px flex-1 bg-white/10" />
                    <span className="font-mono text-xs tabular-nums text-gray-500">
                      {String(group.tools.length).padStart(2, "0")}
                    </span>
                  </div>
                  <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {group.tools.map((tool) => (
                      <li key={tool.href}>
                        <ToolCard tool={tool} />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
