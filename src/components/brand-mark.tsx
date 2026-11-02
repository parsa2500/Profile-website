"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { assetPath } from "@/lib/asset";
import { BrandMark3D } from "./brand-mark-3d";

export function BrandMark({
  className = "size-8",
  spin = false,
}: {
  className?: string;
  priority?: boolean;
  spin?: boolean;
}) {
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

  const gyro = spin && !reduce && !coarse;

  if (!gyro) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={assetPath("/brand/mark.svg")}
        alt=""
        width={64}
        height={64}
        className={`shrink-0 rounded-[0.65rem] ${className}`}
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
      <BrandMark3D className="size-full" faceForward={hover} />
    </span>
  );
}
