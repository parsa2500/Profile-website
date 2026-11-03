"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

export function PinStage({
  heightClass = "h-[220vh]",
  children,
  className = "",
}: {
  heightClass?: string;
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <div className={`relative ${heightClass}`}>
      <div
        className={`sticky top-[var(--header-h)] flex h-[var(--cinematic-remaining)] items-center overflow-hidden ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

export function ScrollHeadline({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
      <p className="text-sm tracking-[0.22em] text-accent uppercase">{eyebrow}</p>
      <h2 className="mt-4 max-w-4xl text-4xl font-medium tracking-tight md:text-6xl">{title}</h2>
      {intro ? (
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-fg">{intro}</p>
      ) : null}
    </div>
  );
}

export function FadeRise({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "start 45%"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [48, 0]);

  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div ref={ref} className={className} style={{ opacity, y }}>
      {children}
    </motion.div>
  );
}
