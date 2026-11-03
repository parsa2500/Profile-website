"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { assetPath } from "@/lib/asset";
import { useBrand } from "./brand-context";
import { BrandMark3D } from "./brand-mark-3d";

export function BrandMark({
  className = "size-8",
  spin = false,
}: {
  className?: string;
  priority?: boolean;
  spin?: boolean;
}) {
  const brand = useBrand();
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    const sync = () => setCoarse(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const logoSrc = assetPath(brand.logo || "/brand/mark.svg");
  const gyro = spin && brand.enable3d && !reduce && !coarse;

  if (!gyro) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoSrc}
        alt=""
        width={64}
        height={64}
        className={`shrink-0 rounded-[0.65rem] object-contain ${className}`}
        decoding="async"
      />
    );
  }

  return (
    <span
      className={`relative inline-flex shrink-0 ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <BrandMark3D
        className="size-full"
        faceForward={hover}
        logo={brand.logo}
        modelUrl={brand.logo3d}
      />
    </span>
  );
}
