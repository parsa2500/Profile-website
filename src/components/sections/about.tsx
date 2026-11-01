import { getLocale } from "next-intl/server";
import { Cover } from "@/components/cover";
import { Reveal } from "@/components/reveal";
import { getContent } from "@/content/store";
import { pick } from "@/content/types";

export async function About() {
  const locale = await getLocale();
  const content = await getContent();
  const about = content.about;
  const hero = content.hero;
  const signal = content.template === "signal";
  const facts = [
    { label: pick(hero.locationLabel, locale), value: pick(hero.location, locale) },
    { label: pick(hero.focusLabel, locale), value: pick(hero.focus, locale) },
    { label: pick(hero.baseLabel, locale), value: pick(hero.base, locale) },
  ];

  return (
    <section id="about" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-20 md:px-8 md:py-28">
        <Reveal className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Cover
            src={about.image}
            alt={pick(about.title, locale)}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className={`min-h-72 lg:min-h-[32rem] ${signal ? "rounded-none" : "rounded-[2rem]"}`}
          />
          <div>
            <p className="text-sm text-accent">{pick(about.eyebrow, locale)}</p>
            <h2 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">
              {pick(about.title, locale)}
            </h2>
            <p className="mt-5 text-lg leading-8 text-ink">{pick(about.body, locale)}</p>
            <dl className="mt-8 grid gap-3 sm:grid-cols-3">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className={`border border-line px-4 py-4 ${signal ? "" : "rounded-2xl"}`}
                >
                  <dt className="text-xs text-muted-fg">{fact.label}</dt>
                  <dd className="mt-2 text-sm leading-6">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <article
                className={`surface-card border border-line bg-card p-5 ${
                  signal ? "rounded-none" : "rounded-3xl"
                }`}
              >
                <h3 className="text-sm text-muted-fg">{pick(about.valueOneTitle, locale)}</h3>
                <p className="mt-3 leading-7">{pick(about.valueOneBody, locale)}</p>
              </article>
              <article
                className={`border border-line bg-muted p-5 ${
                  signal ? "rounded-none" : "rounded-3xl"
                }`}
              >
                <h3 className="text-sm text-muted-fg">{pick(about.valueTwoTitle, locale)}</h3>
                <p className="mt-3 leading-7">{pick(about.valueTwoBody, locale)}</p>
              </article>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
