import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  ClockIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  SwatchIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { navigation } from "../utils/const";
import { useRouter } from "next/router";
import Link from "next/link";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  DocumentTextIcon,
  SparklesIcon,
  SwatchIcon,
  CodeBracketIcon,
  MagnifyingGlassIcon,
  ClockIcon,
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function LayoutCountWords({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gradient-to-r from-dark-secondary to-dark">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-0 flex-1 overflow-y-auto py-6">
                    <div className="flex flex-shrink-0 items-center px-4">
                      <img
                        className="h-12 w-auto"
                        src="/poldro-logo.png"
                        alt="Your Company"
                      />
                    </div>
                    <nav className="mt-5 space-y-1 px-2">
                      {navigation.map((item) => {
                        const Icon = ICON_MAP[item.icon];
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.href === router.pathname
                                ? "bg-gradient-to-r from-primary to-dark text-white"
                                : "text-gray-300 hover:bg-dark hover:text-white",
                              "group flex items-center gap-3 rounded-md px-2 py-2 text-base font-medium"
                            )}
                          >
                            {Icon && (
                              <Icon className="h-5 w-5 flex-shrink-0 opacity-75" />
                            )}
                            {item.name}
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-r from-dark-secondary to-dark">
            <div className="flex flex-1 flex-col overflow-y-auto py-6">
              <div className="flex flex-shrink-0 items-center px-4">
                <Link href="/">
                  <img
                    className="h-10 w-auto"
                    src="/poldro-logo.png"
                    alt="Your Company"
                  />
                </Link>
              </div>
              <nav className="mt-5 flex-1 space-y-1 px-2">
                {navigation.map((item) => {
                  const Icon = ICON_MAP[item.icon];
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.href === router.pathname
                          ? "bg-gradient-to-r from-primary to-dark text-white"
                          : "text-gray-300 hover:bg-dark hover:text-white",
                        "group flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium"
                      )}
                    >
                      {Icon && (
                        <Icon className="h-5 w-5 flex-shrink-0 opacity-75" />
                      )}
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
        <div className="flex h-screen flex-col lg:pl-64">
          <div className="sticky top-0 z-10 bg-dark pl-1 pt-1 sm:pl-3 sm:pt-3 lg:hidden">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-300 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <main className="flex flex-1 bg-dark">
            <div className="flex flex-1 py-4 lg:py-6">
              <div className="mx-auto flex max-w-7xl flex-1 flex-col px-4 sm:px-6 lg:px-8 ">
                {children}
                <div className="mt-4 text-center">
                  <Link
                    className=" text-primary hover:underline"
                    href="https://github.com/Poldro/tools"
                    target="_blank"
                  >
                    Repository GitHub
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
