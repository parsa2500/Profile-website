import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/reveal";

export async function About() {
  const t = await getTranslations("about");

  return (
    <section id="about" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-20 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:px-8 md:py-28">
        <Reveal>
          <p className="text-sm text-accent">{t("eyebrow")}</p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
            {t("title")}
          </h2>
        </Reveal>
        <Reveal className="grid gap-4">
          <p className="text-lg leading-8 text-ink">{t("body")}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-3xl border border-line bg-card p-5">
              <h3 className="text-sm text-muted-fg">{t("educationTitle")}</h3>
              <p className="mt-3 leading-7">{t("educationBody")}</p>
            </article>
            <article className="rounded-3xl border border-line bg-muted p-5">
              <h3 className="text-sm text-muted-fg">{t("englishTitle")}</h3>
              <p className="mt-3 leading-7">{t("englishBody")}</p>
            </article>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
