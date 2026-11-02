"use client";

import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function CountUpValue({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const numeric = Number(value.replace(/[^\d.-]/g, ""));
  const isNumber = Number.isFinite(numeric) && /^-?\d+(\.\d+)?$/.test(value.trim());
  const [display, setDisplay] = useState(reduce || !isNumber ? value : "0");

  useEffect(() => {
    if (!isNumber || reduce || !inView) return;
    const controls = animate(0, numeric, {
      duration: 1.05,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(String(Math.round(latest))),
    });
    return () => controls.stop();
  }, [inView, isNumber, numeric, reduce]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

const CITY_SPIN_FA = ["اصفهان", "گیلان", "تبریز", "مشهد", "شیراز", "تهران"];
const CITY_SPIN_EN = ["Isfahan", "Gilan", "Tabriz", "Mashhad", "Shiraz", "Tehran"];

export function CitySlot({
  locale,
  finalValue,
  className = "",
}: {
  locale: string;
  finalValue: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.55 });
  const cities = locale === "en" ? CITY_SPIN_EN : CITY_SPIN_FA;
  const line = 1.15;

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {finalValue}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ height: `${line}em` }}
      aria-label={finalValue}
    >
      <motion.div
        aria-hidden="true"
        className="flex flex-col"
        initial={{ y: 0 }}
        animate={inView ? { y: `-${(cities.length - 1) * line}em` } : { y: 0 }}
        transition={{ duration: 0.85, ease: [0.15, 0.85, 0.25, 1] }}
      >
        {cities.map((city) => (
          <span
            key={city}
            className="block shrink-0 leading-none"
            style={{ height: `${line}em`, lineHeight: `${line}em` }}
          >
            {city}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
