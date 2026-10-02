import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/reveal";
import { githubHandle, githubUrl } from "@/content/profile";

export async function Contact() {
  const t = await getTranslations("contact");

  return (
    <section id="contact" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <Reveal className="rounded-[2rem] border border-line bg-card px-6 py-10 md:px-10 md:py-14">
          <p className="text-sm text-accent">{t("eyebrow")}</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-medium tracking-tight md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-muted-fg">{t("body")}</p>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-accent px-5 text-sm text-on-accent transition-opacity duration-200 hover:opacity-90"
          >
            {t("action")}
            <span className="text-on-accent/80">{githubHandle}</span>
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
