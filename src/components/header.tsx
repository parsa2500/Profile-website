"use client";

import { useTranslations } from "next-intl";
import { navItems } from "@/content/profile";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[var(--header-bg)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3 md:px-8">
        <a href="#top" className="text-sm font-medium tracking-tight">
          {t("home")}
        </a>
        <nav aria-label={t("menu")} className="order-3 flex w-full gap-4 overflow-x-auto text-sm text-muted-fg md:order-none md:w-auto md:flex-1">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="shrink-0 transition-colors duration-200 hover:text-ink"
            >
              {t(item.id)}
            </a>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
