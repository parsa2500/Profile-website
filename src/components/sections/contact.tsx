import { ArrowUpRight } from "lucide-react";
import { getLocale } from "next-intl/server";
import { Marquee } from "@/components/motion";
import { SocialLinks } from "@/components/social-links";
import { getContent } from "@/content/store";
import { pick } from "@/content/types";

export async function Contact() {
  const locale = await getLocale();
  const content = await getContent();
  const contact = content.contact;

  return (
    <section id="contact" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="surface-card relative overflow-hidden rounded-[2rem] border border-line bg-card px-6 py-10 md:px-10 md:py-14">
          <Marquee text={pick(contact.title, locale)} />
          <div className="relative">
            <p className="text-sm text-accent">{pick(contact.eyebrow, locale)}</p>
            <h2 className="mt-3 max-w-2xl text-4xl font-medium tracking-tight md:text-5xl">
              {pick(contact.title, locale)}
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-muted-fg">{pick(contact.body, locale)}</p>
            <a
              href={content.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-accent px-5 text-sm text-on-accent transition-opacity duration-200 hover:opacity-90"
            >
              {pick(contact.action, locale)}
              <span className="text-on-accent/80">{content.githubHandle}</span>
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
            <div className="mt-6">
              <SocialLinks links={content.socials} locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
