import { getLocale } from "next-intl/server";
import { Cover } from "@/components/cover";
import { Reveal } from "@/components/reveal";
import { getContent } from "@/content/store";
import { pick } from "@/content/types";

export async function CustomSections() {
  const locale = await getLocale();
  const sections = (await getContent()).customSections.filter((item) => item.visible);
  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24 border-t border-line">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            {section.image ? (
              <Cover
                src={section.image}
                alt={pick(section.title, locale)}
                sizes="(min-width: 1024px) 36vw, 100vw"
                className="min-h-56 rounded-[2rem]"
              />
            ) : null}
            <Reveal>
              <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
                {pick(section.title, locale)}
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-fg">
                {pick(section.body, locale)}
              </p>
            </Reveal>
          </div>
        </section>
      ))}
    </>
  );
}
