import { getLocale } from "next-intl/server";
import { SocialLinks } from "@/components/social-links";
import { getContent } from "@/content/store";
import { pick } from "@/content/types";

export async function Footer() {
  const locale = await getLocale();
  const content = await getContent();

  return (
    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-muted-fg md:flex-row md:items-center md:justify-between md:px-8">
        <p>{pick(content.footer.note, locale)}</p>
        <SocialLinks
          links={content.socials}
          locale={locale}
          githubUrl={content.githubUrl}
          githubHandle={content.githubHandle}
        />
      </div>
    </footer>
  );
}
