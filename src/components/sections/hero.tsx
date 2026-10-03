import { getLocale } from "next-intl/server";
import { Cover } from "@/components/cover";
import { HeroField } from "@/components/hero-field";
import { Float, MaskReveal, Sequence } from "@/components/motion";
import { getContent } from "@/content/store";
import { pick } from "@/content/types";

export async function Hero() {
  const locale = await getLocale();
  const content = await getContent();
  const hero = content.hero;
  const name = pick(hero.name, locale);
  const facts = [
    { label: pick(hero.locationLabel, locale), value: pick(hero.location, locale) },
    { label: pick(hero.focusLabel, locale), value: pick(hero.focus, locale) },
    { label: pick(hero.studyLabel, locale), value: pick(hero.study, locale) },
  ];

  const studio = content.template === "studio";
  const signal = content.template === "signal";

  return (
    <section
      id="top"
      className={
        studio
          ? "relative mx-auto grid min-h-[88vh] w-full max-w-6xl items-end px-5 py-16 md:px-8"
          : signal
            ? "relative mx-auto grid w-full max-w-4xl gap-8 px-5 py-16 md:px-8"
            : "relative mx-auto grid w-full max-w-6xl items-end gap-10 px-5 py-12 md:px-8 md:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]"
      }
    >
      <HeroField />
      <Sequence>
        <p className="text-sm text-accent">{pick(hero.eyebrow, locale)}</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl">
          {name}
        </h1>
        <p className="mt-6 max-w-xl text-xl text-ink md:text-2xl">{pick(hero.role, locale)}</p>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted-fg md:text-lg">
          {pick(hero.summary, locale)}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="inline-flex h-11 cursor-pointer items-center rounded-full bg-accent px-5 text-sm text-on-accent transition-opacity duration-200 hover:opacity-90"
          >
            {pick(hero.projects, locale)}
          </a>
          <a
            href="#contact"
            className="inline-flex h-11 cursor-pointer items-center rounded-full border border-line px-5 text-sm transition-colors duration-200 hover:border-accent"
          >
            {pick(hero.contact, locale)}
          </a>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="surface-card rounded-3xl border border-line bg-card p-4">
              <p className="text-xs text-muted-fg">{fact.label}</p>
              <p className="mt-2 text-base">{fact.value}</p>
            </div>
          ))}
        </div>
      </Sequence>
      {studio ? (
        <Cover
          src={hero.image}
          alt=""
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10 min-h-full rounded-none"
        />
      ) : (
        <div className="grid grid-cols-[minmax(0,1.35fr)_minmax(0,0.75fr)] gap-3">
        <MaskReveal className="row-span-2 min-h-80 rounded-[2rem] sm:min-h-[34rem]">
          <Cover
            src={hero.image}
            alt={name}
            priority
            sizes="(min-width: 1024px) 34vw, 70vw"
            className="h-full min-h-80 rounded-[2rem] sm:min-h-[34rem]"
          />
        </MaskReveal>
        <Float className="h-full" delay={0.2}>
          <Cover
            src={hero.detailImage}
            alt=""
            sizes="18vw"
            className="h-full min-h-36 rounded-3xl"
          />
        </Float>
        <Float className="h-full" delay={0.8}>
          <Cover
            src={hero.accentImage}
            alt=""
            sizes="18vw"
            className="h-full min-h-36 rounded-3xl"
          />
        </Float>
        </div>
      )}
    </section>
  );
}
