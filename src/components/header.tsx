"use client";

import type { Locale } from "@/i18n/routing";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

const navHrefs = [
  { id: "about", href: "#about" },
  { id: "skills", href: "#skills" },
  { id: "experience", href: "#experience" },
  { id: "projects", href: "#projects" },
  { id: "contact", href: "#contact" },
] as const;

export function Header({
  home,
  menu,
  labels,
  localeLabel,
  nextLocale,
  toDark,
  toLight,
}: {
  home: string;
  menu: string;
  labels: Record<(typeof navHrefs)[number]["id"], string>;
  localeLabel: string;
  nextLocale: Locale;
  toDark: string;
  toLight: string;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[var(--header-bg)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3 md:px-8">
        <a href="#top" className="text-sm font-medium tracking-tight">
          {home}
        </a>
        <nav
          aria-label={menu}
          className="order-3 flex w-full gap-4 overflow-x-auto text-sm text-muted-fg md:order-none md:w-auto md:flex-1"
        >
          {navHrefs.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="shrink-0 transition-colors duration-200 hover:text-ink"
            >
              {labels[item.id]}
            </a>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <LocaleSwitcher label={localeLabel} nextLocale={nextLocale} />
          <ThemeToggle toDark={toDark} toLight={toLight} />
        </div>
      </div>
    </header>
  );
}
