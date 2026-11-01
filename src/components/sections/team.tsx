import { getLocale } from "next-intl/server";
import { Reveal } from "@/components/reveal";
import { TeamRoster } from "@/components/team-roster";
import { getContent } from "@/content/store";
import { pick } from "@/content/types";

export async function Team() {
  const locale = await getLocale();
  const content = await getContent();
  const team = content.team;
  const visible = team.members.filter((member) => member.visible);

  if (visible.length === 0) return null;

  return (
    <section id="team" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <p className="text-sm text-accent">{pick(team.eyebrow, locale)}</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-medium tracking-tight md:text-5xl">
            {pick(team.title, locale)}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-fg">
            {pick(team.intro, locale)}
          </p>
        </Reveal>

        <TeamRoster
          locale={locale}
          departments={team.departments}
          members={team.members}
          title={pick(team.title, locale)}
          signal={content.template === "signal"}
        />
      </div>
    </section>
  );
}
