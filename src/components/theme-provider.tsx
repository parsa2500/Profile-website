"use client";

import { createContext, useContext, useLayoutEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const storageKey = "theme";
const listeners = new Set<() => void>();

function preferredTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readTheme(): Theme {
  const stored = localStorage.getItem(storageKey);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return preferredTheme();
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    if (!localStorage.getItem(storageKey)) {
      applyTheme(preferredTheme());
    }
    listener();
  };
  media.addEventListener("change", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", onChange);
    window.removeEventListener("storage", onChange);
  };
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function setTheme(theme: Theme) {
  localStorage.setItem(storageKey, theme);
  applyTheme(theme);
  emit();
}

const ThemeContext = createContext<Theme>("light");

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore<Theme>(
    subscribe,
    readTheme,
    () => "light",
  );

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
