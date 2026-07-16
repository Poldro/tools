import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  Bars3BottomLeftIcon,
  ClockIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";

import { navigation } from "../utils/const";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  DocumentTextIcon,
  SparklesIcon,
  SwatchIcon,
  CodeBracketIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  Bars3BottomLeftIcon,
};

const Home: NextPage = () => {
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
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-dark-secondary via-dark to-dark">
        <div className="container flex flex-col items-center justify-center gap-10 px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
              <span className="text-primary">Dev</span> Tools
            </h1>
            <p className="mt-3 text-gray-400">
              A small collection of everyday utilities for developers.
            </p>
          </div>

          <div className="grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
            {navigation.map((item) => {
              const Icon = ICON_MAP[item.icon];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-primary/40 hover:bg-white/10"
                >
                  {Icon && (
                    <div className="bg-primary/15 mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-primary transition-colors group-hover:bg-primary/25">
                      <Icon className="h-5 w-5" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-100 group-hover:text-white">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm leading-snug text-gray-400">
                      {item.description}
                    </p>
                  </div>
                  <span className="mt-1 flex-shrink-0 text-gray-500 transition-colors group-hover:text-primary">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
