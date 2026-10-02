import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/reveal";
import { recentProjects, resumeProjects } from "@/content/profile";

function ProjectCard({
  id,
  title,
  meta,
  summary,
  featured = false,
}: {
  id: string;
  title: string;
  meta: string;
  summary: string;
  featured?: boolean;
}) {
  return (
    <article
      key={id}
      className={`rounded-3xl border border-line bg-card p-5 transition-transform duration-200 hover:-translate-y-0.5 ${
        featured ? "sm:col-span-2" : ""
      }`}
    >
      <p className="text-xs text-muted-fg">{meta}</p>
      <h3 className="mt-3 text-xl">{title}</h3>
      <p className="mt-3 leading-7 text-muted-fg">{summary}</p>
    </article>
  );
}

export async function Projects() {
  const t = await getTranslations("projects");

  return (
    <section id="projects" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <p className="text-sm text-accent">{t("eyebrow")}</p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-muted-fg">{t("intro")}</p>

          <h3 className="mt-10 text-sm text-muted-fg">{t("resumeGroup")}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {resumeProjects.map((id, index) => (
              <ProjectCard
                key={id}
                id={id}
                featured={index === 0}
                title={t(`items.${id}.title`)}
                meta={t(`items.${id}.meta`)}
                summary={t(`items.${id}.summary`)}
              />
            ))}
          </div>

          <h3 className="mt-10 text-sm text-muted-fg">{t("recentGroup")}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {recentProjects.map((id) => (
              <ProjectCard
                key={id}
                id={id}
                title={t(`items.${id}.title`)}
                meta={t(`items.${id}.meta`)}
                summary={t(`items.${id}.summary`)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
