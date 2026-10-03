"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export function LocaleSwitcher({
  label,
  nextLocale,
}: {
  label: string;
  nextLocale: Locale;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <button
      type="button"
      className="inline-flex h-10 cursor-pointer items-center rounded-full border border-line bg-card px-3 text-sm text-ink transition-colors duration-200 hover:border-accent"
      onClick={() => router.replace(pathname, { locale: nextLocale })}
    >
      {label}
    </button>
  );
}
