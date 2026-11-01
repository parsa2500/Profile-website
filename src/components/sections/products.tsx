import { getLocale } from "next-intl/server";
import { Cover } from "@/components/cover";
import { Reveal } from "@/components/reveal";
import { getContent } from "@/content/store";
import { pick } from "@/content/types";

export async function Products() {
  const locale = await getLocale();
  const content = await getContent();
  const products = content.products;
  const visible = products.items.filter((item) => item.visible);
  const linkLabel = locale === "en" ? "Open product →" : "مشاهده محصول ←";
  const studio = content.template === "studio";
  const signal = content.template === "signal";

  if (visible.length === 0) return null;

  return (
    <section id="products" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <p className="text-sm text-accent">{pick(products.eyebrow, locale)}</p>
          <h2 className="mt-3 max-w-xl text-4xl font-medium tracking-tight md:text-5xl">
            {pick(products.title, locale)}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-fg">
            {pick(products.intro, locale)}
          </p>
        </Reveal>

        <div
          className={
            studio
              ? "mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-5 [&::-webkit-scrollbar]:hidden"
              : "mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-2 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden"
          }
        >
          {visible.map((item) => {
            const name = pick(item.name, locale);
            const href = item.url.trim();
            return (
              <article
                key={item.id}
                className={`surface-card w-[min(100%,22rem)] shrink-0 snap-center overflow-hidden border border-line bg-card md:w-auto md:min-w-0 ${
                  signal ? "rounded-none" : "rounded-[2rem]"
                }`}
              >
                <div className="aspect-[4/5] overflow-hidden md:aspect-[16/11]">
                  <Cover
                    src={item.image}
                    alt={name}
                    sizes="(min-width: 768px) 40vw, 85vw"
                    className="h-full scale-105"
                  />
                </div>
                <div className="p-6 md:p-7">
                  <p className="text-xs tracking-wide text-accent">
                    {pick(item.tagline, locale)}
                  </p>
                  <h3 className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">{name}</h3>
                  <p className="mt-3 text-base leading-7 text-muted-fg">
                    {pick(item.summary, locale)}
                  </p>
                  {item.highlights.length > 0 ? (
                    <ul className="mt-5 grid gap-2 text-sm leading-6">
                      {item.highlights.map((line) => {
                        const text = pick(line, locale).trim();
                        if (!text) return null;
                        return (
                          <li key={text} className="flex gap-2">
                            <span
                              className="mt-2 size-1 shrink-0 rounded-full bg-accent"
                              aria-hidden="true"
                            />
                            <span>{text}</span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex text-sm text-accent hover:opacity-80"
                    >
                      {linkLabel}
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
