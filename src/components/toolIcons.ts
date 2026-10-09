import {
  ArrowsRightLeftIcon,
  Bars3BottomLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  CodeBracketIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  KeyIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";

/** Icons for the entries of `navigation`, looked up by their `icon` name. */
export const ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  DocumentTextIcon,
  SwatchIcon,
  CodeBracketIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  Bars3BottomLeftIcon,
  KeyIcon,
  ArrowsRightLeftIcon,
  LinkIcon,
  DocumentDuplicateIcon,
  CalendarDaysIcon,
};
