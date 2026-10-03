import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";
import "./admin.css";

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

export const metadata = {
  title: "پنل پروفایل",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      data-shell="admin"
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper text-ink">
        <ThemeProvider>
          <div className="admin-shell">
            <div className="admin-mesh" aria-hidden="true" />
            <div className="relative z-10">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
