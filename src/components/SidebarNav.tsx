import Link from "next/link";

import { categories, navigation } from "../utils/const";
import { groupTools } from "../utils/tools";
import { ICON_MAP } from "./toolIcons";

const groups = groupTools(navigation, categories);

interface SidebarNavProps {
  /** Path of the page being shown, to mark its entry. */
  pathname: string;
  /** Larger text for the drawer, where the entries are tapped. */
  large?: boolean;
  className?: string;
}

/** The tools, listed under their categories. */
export const SidebarNav = ({
  pathname,
  large = false,
  className = "",
}: SidebarNavProps) => (
  <nav className={`space-y-5 px-2 ${className}`}>
    {groups.map((group) => (
      <div key={group.id}>
        <h2 className="px-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-gray-500">
          {group.name}
        </h2>
        <ul className="mt-1.5 space-y-0.5">
          {group.tools.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const current = item.href === pathname;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={`group flex items-center gap-3 rounded-md px-2 py-2 font-medium ${
                    large ? "text-base" : "text-sm"
                  } ${
                    current
                      ? "bg-gradient-to-r from-primary to-dark text-white"
                      : "text-gray-300 hover:bg-dark hover:text-white"
                  }`}
                >
                  {Icon && <Icon className="h-5 w-5 flex-shrink-0 opacity-75" />}
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    ))}
  </nav>
);
