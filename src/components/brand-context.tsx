"use client";

import { createContext, useContext } from "react";
import type { BrandSettings } from "@/content/types";

export const DEFAULT_BRAND_LOGO = "/brand/mark.svg";

const defaultBrand: BrandSettings = {
  logo: DEFAULT_BRAND_LOGO,
  logo3d: "",
  enable3d: true,
};

const BrandContext = createContext<BrandSettings>(defaultBrand);

export function BrandProvider({
  brand,
  children,
}: {
  brand: BrandSettings;
  children: React.ReactNode;
}) {
  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>;
}

export function useBrand() {
  return useContext(BrandContext);
}
