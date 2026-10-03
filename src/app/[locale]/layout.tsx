import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/theme-provider";
import { getContent } from "@/content/store";
import { pick } from "@/content/types";
import { isLocale, routing } from "@/i18n/routing";
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

export const dynamic = "force-dynamic";

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

  return {
    title: pick(content.meta.title, locale),
    description: pick(content.meta.description, locale),
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
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
