import { getLocale } from "next-intl/server";
import { Cover } from "@/components/cover";
import { Reveal } from "@/components/reveal";
import { getContent } from "@/content/store";
import { pick } from "@/content/types";

export async function About() {
  const locale = await getLocale();
  const about = (await getContent()).about;

  return (
    <section id="about" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-20 md:px-8 md:py-28">
        <Reveal className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Cover
            src={about.image}
            alt={pick(about.title, locale)}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="min-h-64 rounded-[2rem] lg:min-h-[28rem]"
          />
          <div>
            <p className="text-sm text-accent">{pick(about.eyebrow, locale)}</p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
              {pick(about.title, locale)}
            </h2>
            <p className="mt-5 text-lg leading-8 text-ink">{pick(about.body, locale)}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <article className="surface-card rounded-3xl border border-line bg-card p-5">
                <h3 className="text-sm text-muted-fg">{pick(about.educationTitle, locale)}</h3>
                <p className="mt-3 leading-7">{pick(about.educationBody, locale)}</p>
              </article>
              <article className="rounded-3xl border border-line bg-muted p-5">
                <h3 className="text-sm text-muted-fg">{pick(about.englishTitle, locale)}</h3>
                <p className="mt-3 leading-7">{pick(about.englishBody, locale)}</p>
              </article>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
