import { getLocale } from "next-intl/server";
import { getContent } from "@/content/store";
import { pick } from "@/content/types";

export async function Stats() {
  const locale = await getLocale();
  const items = (await getContent()).stats.filter((item) => item.visible && item.value.trim());
  if (items.length === 0) return null;

  return (
    <section id="stats" className="scroll-mt-24 border-t border-line">
      <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-3 px-5 py-12 md:grid-cols-4 md:px-8">
        {items.map((item) => (
          <div key={item.id} className="surface-card rounded-3xl border border-line bg-card p-5">
            <dd className="text-3xl font-medium tracking-tight">{item.value}</dd>
            <dt className="mt-2 text-sm text-muted-fg">{pick(item.label, locale)}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
