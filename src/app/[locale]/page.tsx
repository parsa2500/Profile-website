import { notFound } from "next/navigation";
import { getLocale, setRequestLocale } from "next-intl/server";
import { Atmosphere } from "@/components/atmosphere";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ScrollProgress } from "@/components/motion";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { CustomSections } from "@/components/sections/custom-sections";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Stats } from "@/components/sections/stats";
import { getContent } from "@/content/store";
import { pick } from "@/content/types";
import { isLocale, type Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const activeLocale = await getLocale();
  const content = await getContent();
  const nextLocale: Locale = activeLocale === "fa" ? "en" : "fa";

  return (
    <>
      <Atmosphere />
      <ScrollProgress />
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
      >
        {pick(content.nav.skip, activeLocale)}
      </a>
      <Header
        home={pick(content.nav.home, activeLocale)}
        menu={pick(content.nav.menu, activeLocale)}
        labels={{
          about: pick(content.nav.about, activeLocale),
          skills: pick(content.nav.skills, activeLocale),
          experience: pick(content.nav.experience, activeLocale),
          projects: pick(content.nav.projects, activeLocale),
          contact: pick(content.nav.contact, activeLocale),
        }}
        localeLabel={
          nextLocale === "en"
            ? pick(content.locale.switchToEn, activeLocale)
            : pick(content.locale.switchToFa, activeLocale)
        }
        nextLocale={nextLocale}
        toDark={pick(content.theme.toDark, activeLocale)}
        toLight={pick(content.theme.toLight, activeLocale)}
      />
      <main className="relative z-10">
        <Hero />
        <Stats />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <CustomSections />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
