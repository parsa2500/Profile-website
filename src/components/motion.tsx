"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Children, useRef, type ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent rtl:origin-right"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

export function Sequence({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
      }}
    >
      {Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 28 },
            show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

export function MaskReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      transition={{ duration: 1.05, ease, delay: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export function Float({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}

const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

export function ExperienceTrack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"],
  });
  const items = Children.toArray(children);

  return (
    <div ref={ref} className="relative mt-10">
      <div className="absolute inset-y-0 start-3 w-px overflow-hidden bg-line" aria-hidden="true">
        {reduce ? null : (
          <motion.div
            className="h-full w-full origin-top bg-accent"
            style={{ scaleY: scrollYProgress }}
          />
        )}
      </div>
      <div className="grid gap-4">
        {items.map((child, index) =>
          reduce ? (
            <div key={index} className="ps-8">
              {child}
            </div>
          ) : (
            <motion.div
              key={index}
              className="ps-8"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease }}
            >
              {child}
            </motion.div>
          ),
        )}
      </div>
    </div>
  );
}

export function Parallax({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  if (reduce) return <div className={`relative overflow-hidden ${className ?? ""}`}>{children}</div>;

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div style={{ y }} className="absolute inset-x-0 -top-[8%] h-[116%]">
        {children}
      </motion.div>
    </div>
  );
}

export function Marquee({ text }: { text: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  const line = `${text}  ·  `;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-8 overflow-hidden" aria-hidden="true">
      <motion.div
        className="flex w-max text-6xl font-medium whitespace-nowrap text-ink/10 md:text-8xl"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        <span>{line.repeat(6)}</span>
        <span>{line.repeat(6)}</span>
      </motion.div>
    </div>
  );
}
