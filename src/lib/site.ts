export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  if (process.env.URL) {
    return process.env.URL.replace(/\/$/, "");
  }
  if (process.env.DEPLOY_PRIME_URL) {
    return process.env.DEPLOY_PRIME_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `http://localhost:3000${basePath}`;
}

export function localePath(locale: string) {
  return `/${locale}`;
}

export function absoluteUrl(path: string) {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
