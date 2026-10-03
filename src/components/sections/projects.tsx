import { getLocale } from "next-intl/server";
import { Cover } from "@/components/cover";
import { Parallax } from "@/components/motion";
import { Reveal } from "@/components/reveal";
import { getContent } from "@/content/store";
import { pick } from "@/content/types";

function ProjectCard({
  title,
  meta,
  summary,
  url,
  image,
  featured = false,
  film = false,
}: {
  title: string;
  meta: string;
  summary: string;
  url: string;
  image: string;
  featured?: boolean;
  film?: boolean;
}) {
  const heading = url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
      {title}
    </a>
  ) : (
    title
  );

  return (
    <article
      className={`surface-card group overflow-hidden rounded-3xl border border-line bg-card ${
        film ? "min-w-72 shrink-0" : featured ? "sm:col-span-2" : ""
      }`}
    >
      <Parallax className={film ? "aspect-[3/4]" : "aspect-[16/10]"}>
        <Cover
          src={image}
          alt={title}
          sizes={featured ? "(min-width: 640px) 66vw, 100vw" : "(min-width: 640px) 33vw, 100vw"}
          className="h-full"
        />
      </Parallax>
      <div className="p-5">
        <p className="text-xs text-muted-fg">{meta}</p>
        <h3 className="mt-3 text-xl">{heading}</h3>
        <p className="mt-3 leading-7 text-muted-fg">{summary}</p>
      </div>
    </article>
  );
}

export async function Projects() {
  const locale = await getLocale();
  const projects = (await getContent()).projects;
  const film = (await getContent()).template === "studio";
  const visible = projects.items.filter((item) => item.visible);
  const resume = visible.filter((item) => item.group === "resume");
  const recent = visible.filter((item) => item.group === "recent");

  return (
    <section id="projects" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <p className="text-sm text-accent">{pick(projects.eyebrow, locale)}</p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
            {pick(projects.title, locale)}
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-muted-fg">{pick(projects.intro, locale)}</p>

          <h3 className="mt-10 text-sm text-muted-fg">{pick(projects.resumeGroup, locale)}</h3>
          <div className={film ? "mt-4 flex gap-4 overflow-x-auto pb-3" : "mt-4 grid gap-3 sm:grid-cols-2"}>
            {resume.map((item, index) => (
              <ProjectCard
                key={item.id}
                featured={!film && index === 0}
                film={film}
                title={pick(item.title, locale)}
                meta={pick(item.meta, locale)}
                summary={pick(item.summary, locale)}
                url={item.url}
                image={item.image}
              />
            ))}
          </div>

          <h3 className="mt-10 text-sm text-muted-fg">{pick(projects.recentGroup, locale)}</h3>
          <div className={film ? "mt-4 flex gap-4 overflow-x-auto pb-3" : "mt-4 grid gap-3 sm:grid-cols-3"}>
            {recent.map((item) => (
              <ProjectCard
                key={item.id}
                film={film}
                title={pick(item.title, locale)}
                meta={pick(item.meta, locale)}
                summary={pick(item.summary, locale)}
                url={item.url}
                image={item.image}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
