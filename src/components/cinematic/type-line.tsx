"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function TypeLine({
  text,
  className = "",
  as: Tag = "p",
  delayMs = 0,
  charMs = 22,
  active = true,
}: {
  text: string;
  className?: string;
  as?: "p" | "h2" | "h3" | "span";
  delayMs?: number;
  charMs?: number;
  active?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [shown, setShown] = useState(reduce ? text : "");

  useEffect(() => {
    if (reduce || !active || !inView) return;
    let index = 0;
    let timer = 0;
    const start = window.setTimeout(() => {
      timer = window.setInterval(() => {
        index += 1;
        setShown(text.slice(0, index));
        if (index >= text.length) window.clearInterval(timer);
      }, charMs);
    }, delayMs);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer);
    };
  }, [active, charMs, delayMs, inView, reduce, text]);

  const content = reduce ? text : active ? shown : "";

  return (
    <Tag ref={ref as never} className={className}>
      {content}
      {!reduce && active && inView && shown.length < text.length ? (
        <span className="ms-0.5 inline-block w-[0.45ch] animate-pulse bg-current align-baseline opacity-60">
          &nbsp;
        </span>
      ) : null}
    </Tag>
  );
}
