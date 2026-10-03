"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { setTheme, useTheme } from "./theme-provider";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ThemeToggle({
  toDark,
  toLight,
}: {
  toDark: string;
  toLight: string;
}) {
  const theme = useTheme();
  const mounted = useIsClient();
  const isDark = mounted && theme === "dark";
  const label = isDark ? toLight : toDark;

  return (
    <button
      type="button"
      className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-line bg-card text-ink transition-colors duration-200 hover:border-accent"
      aria-label={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
