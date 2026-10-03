"use client";

import { useEffect, useRef } from "react";
import type { BufferGeometry, PointsMaterial, WebGLRenderer } from "three";

export function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas || narrow || reduce) return;

    let stopped = false;
    let frame = 0;
    let renderer: WebGLRenderer | null = null;
    let geometry: BufferGeometry | null = null;
    let material: PointsMaterial | null = null;

    void import("three").then((THREE) => {
      if (stopped || !canvasRef.current) return;
      const parent = canvasRef.current.parentElement;
      const width = parent?.clientWidth ?? 800;
      const height = parent?.clientHeight ?? 640;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, width / Math.max(height, 1), 0.1, 20);
      camera.position.z = 4.2;

      const count = 80;
      const positions = new Float32Array(count * 3);
      for (let index = 0; index < count; index += 1) {
        positions[index * 3] = (Math.random() - 0.5) * 7;
        positions[index * 3 + 1] = (Math.random() - 0.5) * 4.5;
        positions[index * 3 + 2] = (Math.random() - 0.5) * 2.5;
      }

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      material = new THREE.PointsMaterial({
        color: 0x2563eb,
        size: 0.045,
        transparent: true,
        opacity: 0.7,
      });
      const points = new THREE.Points(geometry, material);
      scene.add(points);

      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: false,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);

      const draw = () => {
        points.rotation.y += 0.0011;
        points.rotation.x += 0.00035;
        renderer?.render(scene, camera);
        frame = requestAnimationFrame(draw);
      };
      draw();
    });

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      geometry?.dispose();
      material?.dispose();
      renderer?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 -z-10 hidden h-full w-full md:block"
      aria-hidden="true"
    />
  );
}
