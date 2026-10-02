import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/reveal";

export async function Hero() {
  const t = await getTranslations("hero");

  const facts = [
    { label: t("locationLabel"), value: t("location") },
    { label: t("focusLabel"), value: t("focus") },
    { label: t("studyLabel"), value: t("study") },
  ];

  return (
    <section id="top" className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 md:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)] md:px-8 md:py-24">
      <Reveal>
        <p className="text-sm text-accent">{t("eyebrow")}</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl">
          {t("name")}
        </h1>
        <p className="mt-6 max-w-xl text-xl text-ink md:text-2xl">{t("role")}</p>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted-fg md:text-lg">
          {t("summary")}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="inline-flex h-11 cursor-pointer items-center rounded-full bg-accent px-5 text-sm text-on-accent transition-opacity duration-200 hover:opacity-90"
          >
            {t("projects")}
          </a>
          <a
            href="#contact"
            className="inline-flex h-11 cursor-pointer items-center rounded-full border border-line px-5 text-sm transition-colors duration-200 hover:border-accent"
          >
            {t("contact")}
          </a>
        </div>
      </Reveal>
      <Reveal className="grid content-end gap-3">
        {facts.map((fact) => (
          <div key={fact.label} className="rounded-3xl border border-line bg-card p-5">
            <p className="text-xs text-muted-fg">{fact.label}</p>
            <p className="mt-2 text-lg">{fact.value}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
