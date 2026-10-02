import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/reveal";
import { experiences } from "@/content/profile";

export async function Experience() {
  const t = await getTranslations("experience");

  return (
    <section id="experience" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <p className="text-sm text-accent">{t("eyebrow")}</p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
            {t("title")}
          </h2>
          <ol className="mt-10 grid gap-4">
            {experiences.map((id) => {
              const points = t.raw(`items.${id}.points`) as string[];

              return (
                <li key={id} className="rounded-3xl border border-line bg-card p-6 md:p-8">
                  <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                    <h3 className="text-xl">{t(`items.${id}.role`)}</h3>
                    <p className="text-sm text-muted-fg">
                      {t(`items.${id}.place`)} · {t(`items.${id}.period`)}
                    </p>
                  </div>
                  <ul className="mt-5 grid gap-2 text-muted-fg">
                    {points.map((point) => (
                      <li key={point} className="leading-7">
                        {point}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
