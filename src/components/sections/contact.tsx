import { ArrowUpRight, Mail } from "lucide-react";
import { getLocale } from "next-intl/server";
import { Marquee } from "@/components/motion";
import { SocialLinks } from "@/components/social-links";
import { getContent } from "@/content/store";
import { pick } from "@/content/types";

export async function Contact() {
  const locale = await getLocale();
  const content = await getContent();
  const contact = content.contact;
  const email = contact.email.trim();
  const signal = content.template === "signal";
  const round = signal ? "rounded-none" : "rounded-full";
  const panel = signal ? "rounded-none" : "rounded-[2rem]";

  return (
    <section id="contact" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div
          className={`surface-card relative overflow-hidden border border-line bg-card px-6 py-10 md:px-10 md:py-14 ${panel}`}
        >
          <Marquee text={pick(contact.title, locale)} />
          <div className="relative">
            <p className="text-sm text-accent">{pick(contact.eyebrow, locale)}</p>
            <h2 className="mt-3 max-w-2xl text-4xl font-medium tracking-tight md:text-5xl">
              {pick(contact.title, locale)}
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-muted-fg">{pick(contact.body, locale)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className={`inline-flex h-12 cursor-pointer items-center gap-2 bg-accent px-5 text-sm text-on-accent transition-opacity duration-200 hover:opacity-90 ${round}`}
                >
                  <Mail className="size-4" aria-hidden="true" />
                  {pick(contact.emailAction, locale)}
                </a>
              ) : null}
              <a
                href={content.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  email
                    ? `inline-flex h-12 cursor-pointer items-center gap-2 border border-line px-5 text-sm transition-colors duration-200 hover:border-accent ${round}`
                    : `inline-flex h-12 cursor-pointer items-center gap-2 bg-accent px-5 text-sm text-on-accent transition-opacity duration-200 hover:opacity-90 ${round}`
                }
              >
                {pick(contact.action, locale)}
                <span className={email ? "text-muted-fg" : "text-on-accent/80"}>
                  {content.githubHandle}
                </span>
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>
            <div className="mt-6">
              <SocialLinks links={content.socials} locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
