import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/reveal";
import { skills } from "@/content/profile";

export async function Skills() {
  const t = await getTranslations("skills");

  return (
    <section id="skills" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <p className="text-sm text-accent">{t("eyebrow")}</p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
            {t("title")}
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-4">
            {skills.map((skill) => (
              <article
                key={skill.id}
                className={`rounded-3xl border border-line bg-card p-5 transition-transform duration-200 hover:-translate-y-0.5 ${skill.className}`}
              >
                <h3 className="text-lg">{t(`items.${skill.id}.name`)}</h3>
                <p className="mt-3 max-w-sm leading-7 text-muted-fg">
                  {t(`items.${skill.id}.detail`)}
                </p>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
