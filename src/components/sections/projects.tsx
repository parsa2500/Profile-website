import { getLocale } from "next-intl/server";
import { Cover } from "@/components/cover";
import { Parallax } from "@/components/motion";
import { Reveal } from "@/components/reveal";
import { getContent } from "@/content/store";
import { pick, type Copy } from "@/content/types";

function ProjectCard({
  title,
  meta,
  summary,
  stack,
  highlights,
  url,
  image,
  featured = false,
  film = false,
  signal = false,
  linkLabel,
}: {
  title: string;
  meta: string;
  summary: string;
  stack: string[];
  highlights: string[];
  url: string;
  image: string;
  featured?: boolean;
  film?: boolean;
  signal?: boolean;
  linkLabel: string;
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
      className={`surface-card group overflow-hidden border border-line bg-card ${
        signal ? "rounded-none" : "rounded-3xl"
      } ${film ? "min-w-72 shrink-0" : featured ? "sm:col-span-2" : ""}`}
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
        {stack.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {stack.map((tech) => (
              <li key={tech} className="border border-line px-2.5 py-1 text-xs text-muted-fg">
                {tech}
              </li>
            ))}
          </ul>
        ) : null}
        {highlights.length > 0 ? (
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-ink">
            {highlights.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex text-sm text-accent hover:opacity-80"
          >
            {linkLabel}
          </a>
        ) : null}
      </div>
    </article>
  );
}

function highlightLines(highlights: Copy[] | undefined, locale: string) {
  return (highlights ?? [])
    .map((entry) => pick(entry, locale).trim())
    .filter(Boolean);
}

export async function Projects() {
  const locale = await getLocale();
  const content = await getContent();
  const projects = content.projects;
  const film = content.template === "studio";
  const signal = content.template === "signal";
  const visible = projects.items.filter((item) => item.visible);
  const featured = visible.filter((item) => item.group === "featured");
  const recent = visible.filter((item) => item.group === "recent");
  const linkLabel = locale === "en" ? "Open project →" : "مشاهده پروژه ←";

  return (
    <section id="projects" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <p className="text-sm text-accent">{pick(projects.eyebrow, locale)}</p>
          <h2 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">
            {pick(projects.title, locale)}
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-muted-fg">{pick(projects.intro, locale)}</p>

          <h3 className="mt-10 text-sm text-muted-fg">{pick(projects.featuredGroup, locale)}</h3>
          <div
            className={
              film
                ? "mt-4 flex gap-4 overflow-x-auto pb-3"
                : "mt-4 grid gap-3 sm:grid-cols-2"
            }
          >
            {featured.map((item, index) => (
              <ProjectCard
                key={item.id}
                featured={!film && index === 0}
                film={film}
                signal={signal}
                title={pick(item.title, locale)}
                meta={pick(item.meta, locale)}
                summary={pick(item.summary, locale)}
                stack={item.stack ?? []}
                highlights={highlightLines(item.highlights, locale)}
                url={item.url.trim()}
                image={item.image}
                linkLabel={linkLabel}
              />
            ))}
          </div>

          <h3 className="mt-10 text-sm text-muted-fg">{pick(projects.recentGroup, locale)}</h3>
          <div
            className={
              film
                ? "mt-4 flex gap-4 overflow-x-auto pb-3"
                : "mt-4 grid gap-3 sm:grid-cols-3"
            }
          >
            {recent.map((item) => (
              <ProjectCard
                key={item.id}
                film={film}
                signal={signal}
                title={pick(item.title, locale)}
                meta={pick(item.meta, locale)}
                summary={pick(item.summary, locale)}
                stack={item.stack ?? []}
                highlights={highlightLines(item.highlights, locale)}
                url={item.url.trim()}
                image={item.image}
                linkLabel={linkLabel}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
