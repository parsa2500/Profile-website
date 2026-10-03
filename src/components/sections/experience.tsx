import { getLocale } from "next-intl/server";
import { ExperienceTrack } from "@/components/motion";
import { Reveal } from "@/components/reveal";
import { getContent } from "@/content/store";
import { pick } from "@/content/types";

export async function Experience() {
  const locale = await getLocale();
  const experience = (await getContent()).experience;
  const items = experience.items.filter((item) => item.visible);

  return (
    <section id="experience" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <p className="text-sm text-accent">{pick(experience.eyebrow, locale)}</p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
            {pick(experience.title, locale)}
          </h2>
          <ExperienceTrack>
            {items.map((item) => (
              <article key={item.id} className="surface-card rounded-3xl border border-line bg-card p-6 md:p-8">
                <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                  <h3 className="text-xl">{pick(item.role, locale)}</h3>
                  <p className="text-sm text-muted-fg">
                    {pick(item.place, locale)} · {pick(item.period, locale)}
                  </p>
                </div>
                <ul className="mt-5 grid gap-2 text-muted-fg">
                  {item.points.map((point, index) => (
                    <li key={`${item.id}-${index}`} className="leading-7">
                      {pick(point, locale)}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </ExperienceTrack>
        </Reveal>
      </div>
    </section>
  );
}
