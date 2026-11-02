"use client";

import { useEffect, useSyncExternalStore } from "react";

function subscribeSoftCursor(onStoreChange: () => void) {
  const coarse = window.matchMedia("(pointer: coarse)");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  coarse.addEventListener("change", onStoreChange);
  reduce.addEventListener("change", onStoreChange);
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-template"],
  });
  return () => {
    coarse.removeEventListener("change", onStoreChange);
    reduce.removeEventListener("change", onStoreChange);
    observer.disconnect();
  };
}

function getSoftCursorSnapshot() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return document.documentElement.getAttribute("data-template") === "cinematic";
}

export function SoftCursor() {
  const enabled = useSyncExternalStore(
    subscribeSoftCursor,
    getSoftCursorSnapshot,
    () => false,
  );

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("soft-cursor");
    const node = document.getElementById("soft-cursor-dot");
    if (!node) return;

    const onMove = (event: PointerEvent) => {
      node.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.documentElement.classList.remove("soft-cursor");
      window.removeEventListener("pointermove", onMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      id="soft-cursor-dot"
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[80] size-8 will-change-transform"
      style={{ transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)" }}
    />
  );
}
