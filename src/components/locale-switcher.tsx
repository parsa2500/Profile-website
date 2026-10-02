"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("locale");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const next: Locale = locale === "fa" ? "en" : "fa";
  const label = next === "en" ? t("switchToEn") : t("switchToFa");

  return (
    <button
      type="button"
      className="inline-flex h-10 cursor-pointer items-center rounded-full border border-line bg-card px-3 text-sm text-ink transition-colors duration-200 hover:border-accent"
      onClick={() => router.replace(pathname, { locale: next })}
    >
      {label}
    </button>
  );
}
