import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isStatic = process.env.STATIC_EXPORT === "1";
const basePath = isStatic ? "/Profile-website" : "";

const nextConfig: NextConfig = {
  ...(isStatic
    ? {
        output: "export" as const,
        basePath,
        assetPrefix: basePath || undefined,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default withNextIntl(nextConfig);
