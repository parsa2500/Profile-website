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

  const studio = content.template === "studio";
  const signal = content.template === "signal";

  return (
    <section
      id="top"
      className={
        studio
          ? "relative mx-auto grid min-h-[100svh] w-full max-w-6xl items-end px-5 pb-16 pt-28 md:px-8"
          : signal
            ? "relative mx-auto grid min-h-[100svh] w-full max-w-5xl content-start gap-10 px-5 pb-16 pt-28 md:content-center md:px-8 md:py-28"
            : "relative mx-auto grid min-h-[100svh] w-full max-w-6xl content-start items-end gap-10 px-5 pb-16 pt-28 md:px-8 md:py-24 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] lg:content-center"
      }
    >
      {signal ? null : <HeroField />}
      <Sequence>
        <p className="text-sm tracking-wide text-accent">{pick(hero.eyebrow, locale)}</p>
        <h1 className="mt-4 max-w-3xl text-6xl font-medium leading-[0.98] tracking-tight md:text-8xl">
          {name}
        </h1>
        <p className="mt-6 max-w-xl text-xl text-ink md:text-2xl">{pick(hero.role, locale)}</p>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted-fg md:text-lg">
          {pick(hero.summary, locale)}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#products"
            className={`inline-flex h-12 cursor-pointer items-center bg-accent px-6 text-sm text-on-accent transition-opacity duration-200 hover:opacity-90 ${
              signal ? "rounded-none" : "rounded-full"
            }`}
          >
            {pick(hero.projects, locale)}
          </a>
          <a
            href="#contact"
            className={`inline-flex h-12 cursor-pointer items-center border border-line px-6 text-sm transition-colors duration-200 hover:border-accent ${
              signal ? "rounded-none" : "rounded-full"
            }`}
          >
            {pick(hero.contact, locale)}
          </a>
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
      ) : signal ? (
        <MaskReveal className="min-h-72 overflow-hidden rounded-none border border-line sm:min-h-[28rem]">
          <Cover
            src={hero.image}
            alt={name}
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="h-full min-h-72 rounded-none sm:min-h-[28rem]"
          />
        </MaskReveal>
      ) : (
        <>
          <MaskReveal className="min-h-56 overflow-hidden rounded-[1.75rem] sm:min-h-72 md:hidden">
            <Cover
              src={hero.image}
              alt={name}
              priority
              sizes="100vw"
              className="h-full min-h-56 rounded-[1.75rem] sm:min-h-72"
            />
          </MaskReveal>
          <div className="hidden grid-cols-[minmax(0,1.35fr)_minmax(0,0.75fr)] gap-3 md:grid">
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
        </>
      )}
    </section>
  );
}
