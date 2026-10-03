"use client";

import { useEffect, useRef } from "react";

export function Atmosphere() {
  const light = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = light.current;
    if (!node) return;
    const desktop = window.matchMedia("(min-width: 768px)");
    if (!desktop.matches) return;

    const move = (event: PointerEvent) => {
      node.style.setProperty("--lx", `${event.clientX}px`);
      node.style.setProperty("--ly", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <div className="atmosphere-grid absolute inset-0" />
      <div className="glow-a absolute -top-24 start-[-12%] h-80 w-80 rounded-full bg-[var(--glow-a)] blur-3xl" />
      <div className="glow-b absolute end-[-10%] bottom-[-8%] h-96 w-96 rounded-full bg-[var(--glow-b)] blur-3xl" />
      <div ref={light} className="pointer-light absolute inset-0 hidden md:block" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.18] mix-blend-overlay">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}
