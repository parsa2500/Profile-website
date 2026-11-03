import { notFound } from "next/navigation";
import { getLocale, setRequestLocale } from "next-intl/server";
import { Atmosphere } from "@/components/atmosphere";
import { Footer } from "@/components/footer";
import { Header, type NavItem } from "@/components/header";
import { ScrollProgress } from "@/components/motion";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { CustomSections } from "@/components/sections/custom-sections";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Products } from "@/components/sections/products";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Stats } from "@/components/sections/stats";
import { CinematicHome } from "@/components/cinematic/home";
import { SoftCursor } from "@/components/soft-cursor";
import { Team } from "@/components/sections/team";
import { getContent } from "@/content/store";
import { pick } from "@/content/types";
import { isLocale, type Locale } from "@/i18n/routing";

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

  const showStats = content.stats.some((item) => item.visible && item.value.trim());
  const showProducts = content.products.items.some((item) => item.visible);
  const showTeam = content.team.members.some((member) => member.visible);
  const customNav = content.customSections
    .filter((section) => section.visible)
    .map((section) => ({
      id: section.id,
      href: `#${section.id}`,
      label: pick(section.title, activeLocale) || section.id,
    }));

  const fullNav: NavItem[] = [
    { id: "about", href: "#about", label: pick(content.nav.about, activeLocale) },
    ...(showStats
      ? [
          {
            id: "stats",
            href: "#stats",
            label: activeLocale === "en" ? "Highlights" : "نمای کلی",
          },
        ]
      : []),
    ...(showProducts
      ? [
          {
            id: "products",
            href: "#products",
            label: pick(content.nav.products, activeLocale),
          },
        ]
      : []),
    { id: "projects", href: "#projects", label: pick(content.nav.projects, activeLocale) },
    ...(showTeam
      ? [{ id: "team", href: "#team", label: pick(content.nav.team, activeLocale) }]
      : []),
    { id: "skills", href: "#skills", label: pick(content.nav.skills, activeLocale) },
    {
      id: "experience",
      href: "#experience",
      label: pick(content.nav.experience, activeLocale),
    },
    ...customNav,
    { id: "contact", href: "#contact", label: pick(content.nav.contact, activeLocale) },
  ];
  const cinematicNav: NavItem[] = [
    { id: "about", href: "#about", label: pick(content.nav.about, activeLocale) },
    ...(showProducts
      ? [
          {
            id: "products",
            href: "#products",
            label: pick(content.nav.products, activeLocale),
          },
        ]
      : []),
    { id: "projects", href: "#projects", label: pick(content.nav.projects, activeLocale) },
    ...(showTeam
      ? [{ id: "team", href: "#team", label: pick(content.nav.team, activeLocale) }]
      : []),
    { id: "contact", href: "#contact", label: pick(content.nav.contact, activeLocale) },
  ];
  const navItems = content.template === "cinematic" ? cinematicNav : fullNav;

  return (
    <>
      {content.template === "cinematic" ? <SoftCursor /> : null}
      <Atmosphere />
      <ScrollProgress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
      >
        {pick(content.nav.skip, activeLocale)}
      </a>
      <Header
        home={pick(content.nav.home, activeLocale)}
        menu={pick(content.nav.menu, activeLocale)}
        items={navItems}
        localeLabel={
          nextLocale === "en"
            ? pick(content.locale.switchToEn, activeLocale)
            : pick(content.locale.switchToFa, activeLocale)
        }
        nextLocale={nextLocale}
      />
      <main id="main" className="relative z-10">
        {content.template === "cinematic" ? (
          <CinematicHome />
        ) : (
          <>
            <Hero />
            <Stats />
            <About />
            <Products />
            <Projects />
            <Team />
            <Skills />
            <Experience />
            <CustomSections />
            <Contact />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
