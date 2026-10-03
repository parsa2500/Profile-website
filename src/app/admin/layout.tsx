import localFont from "next/font/local";
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

export const metadata = {
  title: "پنل پروفایل",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper text-ink">{children}</body>
    </html>
  );
}
