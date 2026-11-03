"use client";

import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { BrandMark } from "./brand-mark";
import { LocaleSwitcher } from "./locale-switcher";

export type NavItem = {
  id: string;
  href: string;
  label: string;
};

export function Header({
  home,
  menu,
  items,
  localeLabel,
  nextLocale,
}: {
  home: string;
  menu: string;
  items: NavItem[];
  localeLabel: string;
  nextLocale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[var(--header-bg)] backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-5 md:h-16 md:px-8">
        <a href="#top" className="flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <BrandMark className="size-8" priority spin />
          <span className="truncate text-sm font-medium tracking-tight">{home}</span>
        </a>

        <nav
          aria-label={menu}
          className="ms-2 hidden min-w-0 flex-1 items-center justify-center gap-5 text-sm text-muted-fg lg:flex"
        >
          {items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="shrink-0 transition-colors duration-200 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-1.5 sm:gap-2">
          <LocaleSwitcher label={localeLabel} nextLocale={nextLocale} />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent lg:hidden"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={menu}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id={panelId}
          className="border-t border-line bg-[var(--color-bg)] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={menu}
        >
          <nav className="mx-auto grid max-h-[min(70vh,28rem)] w-full max-w-6xl gap-1 overflow-y-auto px-5 py-4 md:px-8">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="rounded-2xl px-3 py-3 text-base text-ink transition-colors hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
