import { getLocale } from "next-intl/server";
import { StickyReveal } from "@/components/motion";
import { getContent } from "@/content/store";
import { pick } from "@/content/types";

export async function Stats() {
  const locale = await getLocale();
  const content = await getContent();
  const items = content.stats.filter((item) => item.visible && item.value.trim());
  const signal = content.template === "signal";
  if (items.length === 0) return null;

  return (
    <section id="stats" className="scroll-mt-24 border-t border-line" aria-label="stats">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-3 px-5 py-14 md:grid-cols-4 md:px-8 md:py-16">
        {items.map((item) => (
          <StickyReveal key={item.id}>
            <div
              className={`surface-card border border-line bg-card p-5 md:p-6 ${
                signal ? "rounded-none" : "rounded-3xl"
              }`}
            >
              <p className="text-4xl font-medium tracking-tight md:text-5xl">{item.value}</p>
              <p className="mt-3 text-sm text-muted-fg">{pick(item.label, locale)}</p>
            </div>
          </StickyReveal>
        ))}
      </div>
    </section>
  );
}
