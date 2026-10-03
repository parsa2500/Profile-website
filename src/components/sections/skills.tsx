import { getLocale } from "next-intl/server";
import { Stagger, StaggerItem } from "@/components/motion";
import { Reveal } from "@/components/reveal";
import { getContent } from "@/content/store";
import { pick, type SkillSpan } from "@/content/types";

const spanClass: Record<SkillSpan, string> = {
  feature: "sm:col-span-2 sm:row-span-2",
  wide: "sm:col-span-2",
  normal: "",
};

export async function Skills() {
  const locale = await getLocale();
  const skills = (await getContent()).skills;
  const items = skills.items.filter((item) => item.visible);
  const linear = (await getContent()).template === "signal";

  return (
    <section id="skills" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <p className="text-sm text-accent">{pick(skills.eyebrow, locale)}</p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
            {pick(skills.title, locale)}
          </h2>
          <div className="mt-10">
          <Stagger className={linear ? "mt-10 grid" : "grid grid-cols-1 gap-3 sm:grid-cols-4"}>
            {items.map((skill) => (
              <StaggerItem key={skill.id} className={linear ? "" : spanClass[skill.span]}>
                <article
                  className={
                    linear
                      ? "surface-card border-b border-line bg-card px-0 py-4"
                      : "surface-card h-full rounded-3xl border border-line bg-card p-5 transition-transform duration-200 hover:-translate-y-0.5"
                  }
                >
                  <h3 className="text-lg">{pick(skill.name, locale)}</h3>
                  <p className="mt-3 max-w-sm leading-7 text-muted-fg">
                    {pick(skill.detail, locale)}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
