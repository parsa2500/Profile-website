"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";
import { useMotionValueEvent } from "motion/react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
};

export function PuffBurst({
  progress,
  className = "",
}: {
  progress: MotionValue<number>;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const intensity = useRef(0);

  useMotionValueEvent(progress, "change", (value) => {
    // Peak puff around mid-open of the doors.
    const peak = 1 - Math.abs(value - 0.21) / 0.22;
    intensity.current = Math.max(0, Math.min(1, peak));
  });

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas || narrow || reduce) return;

    let frame = 0;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      const width = parent?.clientWidth ?? 800;
      const height = parent?.clientHeight ?? 640;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (count: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.4 + Math.random() * 2.2;
        particles.current.push({
          x: width * 0.5 + (Math.random() - 0.5) * 40,
          y: height * 0.58 + (Math.random() - 0.5) * 24,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.8,
          life: 0.55 + Math.random() * 0.7,
          size: 1.5 + Math.random() * 4,
        });
      }
      if (particles.current.length > 180) {
        particles.current.splice(0, particles.current.length - 180);
      }
    };

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);
      const power = intensity.current;
      if (power > 0.08) {
        spawn(Math.ceil(power * 6));
      }
      particles.current = particles.current
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy - 0.015,
          life: p.life - 0.012,
          size: p.size * 0.992,
        }))
        .filter((p) => p.life > 0);

      for (const p of particles.current) {
        const alpha = Math.min(0.55, p.life) * (0.35 + power * 0.65);
        ctx.beginPath();
        ctx.fillStyle = `rgba(232, 196, 124, ${alpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 hidden md:block ${className}`}
      aria-hidden="true"
    />
  );
}
