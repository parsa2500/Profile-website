import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

const isStatic = process.env.STATIC_EXPORT === "1";

export default function RootPage() {
  if (isStatic) {
    const href = `./${routing.defaultLocale}/`;
    return (
      <html lang={routing.defaultLocale}>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="refresh" content={`0;url=${href}`} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Auto team</title>
          <link rel="canonical" href={href} />
        </head>
        <body>
          <p>
            <a href={href}>Auto team</a>
          </p>
        </body>
      </html>
    );
  }

  redirect(`/${routing.defaultLocale}`);
}
