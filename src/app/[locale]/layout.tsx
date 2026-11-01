import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";
import { ThemeProvider } from "@/components/theme-provider";
import { getContent } from "@/content/store";
import { pick } from "@/content/types";
import { isLocale, routing } from "@/i18n/routing";
import { absoluteUrl, getSiteUrl, localePath } from "@/lib/site";
import "../globals.css";

const spaceGrotesk = localFont({
  src: "../../fonts/space-grotesk-latin-wght-normal.woff2",
  variable: "--font-latin",
  weight: "300 700",
  display: "swap",
});

const vazirmatn = localFont({
  src: [
    {
      path: "../../fonts/vazirmatn-arabic-wght-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../fonts/vazirmatn-latin-wght-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-persian",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }
  const content = await getContent();
  const title = pick(content.meta.title, locale);
  const description = pick(content.meta.description, locale);
  const canonical = absoluteUrl(localePath(locale));
  const ogImage = absoluteUrl(content.hero.image);

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    icons: {
      icon: [{ url: "/brand/mark.svg", type: "image/svg+xml" }],
      apple: [{ url: "/brand/logo.png" }],
    },
    alternates: {
      canonical,
      languages: {
        fa: absoluteUrl(localePath("fa")),
        en: absoluteUrl(localePath("en")),
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "fa_IR",
      url: canonical,
      title,
      description,
      siteName: pick(content.hero.name, locale),
      images: [{ url: ogImage, alt: pick(content.hero.name, locale) }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const content = await getContent();
  const dir = locale === "fa" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      data-template={content.template}
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${vazirmatn.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full">
        {/*
          THESIS: Auto team profile reads as one cinematic mobile scroll — brand first, then proof — not a personal resume stack.
          OWN-WORLD: four templates (editorial paper, studio full-bleed film, signal sharp glow, cinematic scroll cinema) with large type, full-bleed sections, sparse chrome.
          STORY: visitor learns who Auto team is, what it ships, who works here, and how to reach them.
          FIRST VIEWPORT: team name as hero brand, one role line, one summary, products+contact CTAs, one dominant image plane.
          FORM: Apple-like scroll cinema on existing template tokens; seed auto-team-redesign.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
        */}
        <JsonLd locale={locale} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
