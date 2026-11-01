"use client";

import { ArrowUpRight, Mail } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { Cover } from "@/components/cover";
import { ExperienceTrack, Marquee } from "@/components/motion";
import { SocialLinks } from "@/components/social-links";
import { TeamRoster } from "@/components/team-roster";
import type {
  Copy,
  CustomSection,
  ExperienceItem,
  ProductItem,
  ProjectItem,
  SiteContent,
  SkillItem,
  StatItem,
  TeamMember,
} from "@/content/types";
import { pick } from "@/content/types";
import { PuffBurst } from "./puff-burst";
import { FadeRise, ScrollHeadline } from "./scroll-kit";

export type CinematicPayload = {
  locale: string;
  rtl: boolean;
  hero: SiteContent["hero"];
  about: SiteContent["about"];
  products: { eyebrow: Copy; title: Copy; intro: Copy; items: ProductItem[] };
  projects: SiteContent["projects"];
  team: SiteContent["team"];
  skills: { eyebrow: Copy; title: Copy; items: SkillItem[] };
  experience: { eyebrow: Copy; title: Copy; items: ExperienceItem[] };
  contact: SiteContent["contact"];
  stats: StatItem[];
  customSections: CustomSection[];
  socials: SiteContent["socials"];
  githubUrl: string;
  githubHandle: string;
  members: TeamMember[];
};

function t(copy: Copy, locale: string) {
  return pick(copy, locale);
}

function HeroOpen({
  locale,
  hero,
  productsLabel,
  contactLabel,
}: {
  locale: string;
  hero: SiteContent["hero"];
  productsLabel: string;
  contactLabel: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Start closed. Scroll opens both panels fully past the edges, then the pin releases softly.
  const doorAmount = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const doorL = useTransform(doorAmount, (v) => `${-v * 55}vw`);
  const doorR = useTransform(doorAmount, (v) => `${v * 55}vw`);
  const doorFade = useTransform(scrollYProgress, [0.34, 0.42], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.55], [1.45, 1]);
  const blur = useTransform(scrollYProgress, [0, 0.25, 0.55], [8, 2, 0]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  const textOpacity = useTransform(scrollYProgress, [0.2, 0.45], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.2, 0.45], [36, 0]);
  const veil = useTransform(scrollYProgress, [0, 0.4], [0.72, 0.28]);

  const name = t(hero.name, locale);

  if (reduce) {
    return (
      <section id="top" className="relative min-h-[100svh] overflow-hidden">
        <Cover
          src={hero.image}
          alt={name}
          priority
          sizes="100vw"
          className="absolute inset-0 min-h-full rounded-none"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8">
          <p className="text-sm tracking-[0.22em] text-accent uppercase">
            {t(hero.eyebrow, locale)}
          </p>
          <h1 className="mt-4 max-w-4xl text-6xl font-medium leading-[0.95] tracking-tight text-white md:text-8xl">
            {name}
          </h1>
          <p className="mt-6 max-w-xl text-xl text-white/90">{t(hero.role, locale)}</p>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/75">
            {t(hero.summary, locale)}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#products"
              className="inline-flex h-12 items-center rounded-full bg-accent px-6 text-sm text-on-accent"
            >
              {productsLabel}
            </a>
            <a
              href="#contact"
              className="inline-flex h-12 items-center rounded-full border border-white/30 px-6 text-sm text-white"
            >
              {contactLabel}
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="top" ref={ref} className="relative h-[165vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-black">
        <motion.div className="absolute inset-0" style={{ scale, filter }}>
          <Cover
            src={hero.image}
            alt={name}
            priority
            sizes="100vw"
            className="absolute inset-0 min-h-full rounded-none"
          />
        </motion.div>
        <motion.div className="absolute inset-0 bg-black" style={{ opacity: veil }} />
        <PuffBurst progress={scrollYProgress} />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[52%] border-r border-white/10 bg-[#0a0a0a] will-change-transform"
          style={{ x: doorL, opacity: doorFade }}
        >
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-accent/70 to-transparent" />
        </motion.div>
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-[52%] border-l border-white/10 bg-[#0a0a0a] will-change-transform"
          style={{ x: doorR, opacity: doorFade }}
        >
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-accent/70 to-transparent" />
        </motion.div>
        <motion.div
          className="relative z-30 mx-auto flex h-full w-full max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8"
          style={{ opacity: textOpacity, y: textY }}
        >
          <p className="text-sm tracking-[0.22em] text-accent uppercase">
            {t(hero.eyebrow, locale)}
          </p>
          <h1 className="mt-4 max-w-4xl text-6xl font-medium leading-[0.95] tracking-tight text-white md:text-8xl">
            {name}
          </h1>
          <p className="mt-6 max-w-xl text-xl text-white/90 md:text-2xl">
            {t(hero.role, locale)}
          </p>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/75 md:text-lg">
            {t(hero.summary, locale)}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#products"
              className="inline-flex h-12 items-center rounded-full bg-accent px-6 text-sm text-on-accent transition-opacity hover:opacity-90"
            >
              {productsLabel}
            </a>
            <a
              href="#contact"
              className="inline-flex h-12 items-center rounded-full border border-white/30 px-6 text-sm text-white transition-colors hover:border-accent"
            >
              {contactLabel}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatsReel({ locale, stats }: { locale: string; stats: StatItem[] }) {
  const items = stats.filter((item) => item.visible && item.value.trim());
  if (items.length === 0) return null;
  return (
    <section id="stats" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-4 px-5 py-16 md:grid-cols-4 md:px-8 md:py-24">
        {items.map((item) => (
          <FadeRise key={item.id}>
            <div className="border border-line bg-card/60 p-6 backdrop-blur-sm">
              <p className="text-5xl font-medium tracking-tight md:text-6xl">{item.value}</p>
              <p className="mt-3 text-sm text-muted-fg">{t(item.label, locale)}</p>
            </div>
          </FadeRise>
        ))}
      </div>
    </section>
  );
}

function AboutWipe({
  locale,
  about,
  hero,
}: {
  locale: string;
  about: SiteContent["about"];
  hero: SiteContent["hero"];
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const clip = useTransform(
    scrollYProgress,
    [0, 0.55],
    ["inset(0 42% 0 42%)", "inset(0 0% 0 0%)"],
  );
  const textOpacity = useTransform(scrollYProgress, [0.35, 0.7], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.35, 0.7], [36, 0]);

  const facts = [
    { label: t(hero.locationLabel, locale), value: t(hero.location, locale) },
    { label: t(hero.focusLabel, locale), value: t(hero.focus, locale) },
    { label: t(hero.baseLabel, locale), value: t(hero.base, locale) },
  ];

  if (reduce) {
    return (
      <section id="about" className="scroll-mt-24 border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-2">
          <Cover
            src={about.image}
            alt={t(about.title, locale)}
            sizes="50vw"
            className="min-h-80 rounded-none"
          />
          <div>
            <p className="text-sm text-accent">{t(about.eyebrow, locale)}</p>
            <h2 className="mt-3 text-4xl font-medium md:text-5xl">{t(about.title, locale)}</h2>
            <p className="mt-5 text-lg leading-8">{t(about.body, locale)}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" ref={ref} className="relative h-[220vh] scroll-mt-24">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
            <Cover
              src={about.image}
              alt={t(about.title, locale)}
              sizes="100vw"
              className="absolute inset-0 min-h-full rounded-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />
          </motion.div>
        </div>
        <motion.div
          className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-8"
          style={{ opacity: textOpacity, y: textY }}
        >
          <p className="text-sm tracking-[0.22em] text-accent uppercase">
            {t(about.eyebrow, locale)}
          </p>
          <h2 className="mt-4 max-w-3xl text-4xl font-medium tracking-tight text-white md:text-6xl">
            {t(about.title, locale)}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
            {t(about.body, locale)}
          </p>
          <dl className="mt-8 grid gap-3 sm:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.label} className="border border-white/20 bg-black/35 px-4 py-4 backdrop-blur-sm">
                <dt className="text-xs text-white/60">{fact.label}</dt>
                <dd className="mt-2 text-sm leading-6 text-white">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}

function ProductRail({
  locale,
  rtl,
  products,
}: {
  locale: string;
  rtl: boolean;
  products: CinematicPayload["products"];
}) {
  const visible = products.items.filter((item) => item.visible);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const end = rtl ? "55%" : "-55%";
  const x = useTransform(scrollYProgress, [0, 1], ["0%", end]);
  const linkLabel = locale === "en" ? "Open product →" : "مشاهده محصول ←";

  if (visible.length === 0) return null;

  if (reduce) {
    return (
      <section id="products" className="scroll-mt-24 border-t border-line py-20">
        <ScrollHeadline
          eyebrow={t(products.eyebrow, locale)}
          title={t(products.title, locale)}
          intro={t(products.intro, locale)}
        />
        <div className="mx-auto mt-10 grid max-w-6xl gap-4 px-5 md:grid-cols-2 md:px-8">
          {visible.map((item) => (
            <article key={item.id} className="overflow-hidden border border-line bg-card">
              <Cover src={item.image} alt={t(item.name, locale)} sizes="50vw" className="aspect-[16/11]" />
              <div className="p-6">
                <h3 className="text-2xl font-medium">{t(item.name, locale)}</h3>
                <p className="mt-3 text-muted-fg">{t(item.summary, locale)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="products" ref={ref} className="relative h-[280vh] scroll-mt-24 border-t border-line">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <ScrollHeadline
          eyebrow={t(products.eyebrow, locale)}
          title={t(products.title, locale)}
          intro={t(products.intro, locale)}
        />
        <motion.div className="mt-10 flex w-max gap-5 px-5 md:px-8" style={{ x }}>
          {visible.map((item) => {
            const name = t(item.name, locale);
            const href = item.url.trim();
            return (
              <article
                key={item.id}
                className="w-[min(85vw,28rem)] shrink-0 overflow-hidden border border-line bg-card"
              >
                <Cover src={item.image} alt={name} sizes="28rem" className="aspect-[4/5]" />
                <div className="p-6">
                  <p className="text-xs tracking-wide text-accent">{t(item.tagline, locale)}</p>
                  <h3 className="mt-3 text-2xl font-medium">{name}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-fg">{t(item.summary, locale)}</p>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex text-sm text-accent hover:opacity-80"
                    >
                      {linkLabel}
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function ProjectStack({
  locale,
  projects,
}: {
  locale: string;
  projects: SiteContent["projects"];
}) {
  const visible = projects.items.filter((item) => item.visible);
  const linkLabel = locale === "en" ? "Open project →" : "مشاهده پروژه ←";
  if (visible.length === 0) return null;

  return (
    <section id="projects" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <FadeRise>
          <p className="text-sm tracking-[0.22em] text-accent uppercase">
            {t(projects.eyebrow, locale)}
          </p>
          <h2 className="mt-4 text-4xl font-medium tracking-tight md:text-6xl">
            {t(projects.title, locale)}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-fg">
            {t(projects.intro, locale)}
          </p>
        </FadeRise>
        <div className="mt-12 grid gap-6">
          {visible.map((item, index) => (
            <ProjectCard
              key={item.id}
              locale={locale}
              item={item}
              index={index}
              linkLabel={linkLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  locale,
  item,
  index,
  linkLabel,
}: {
  locale: string;
  item: ProjectItem;
  index: number;
  linkLabel: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "start 40%"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.45, 1]);
  const title = t(item.title, locale);
  const href = item.url.trim();

  const body = (
    <article
      ref={ref}
      className={`grid overflow-hidden border border-line bg-card md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] ${
        index % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
      }`}
    >
      <Cover src={item.image} alt={title} sizes="50vw" className="aspect-[16/11] md:aspect-auto md:min-h-[22rem]" />
      <div className="flex flex-col justify-center p-6 md:p-10">
        <p className="text-xs text-muted-fg">{t(item.meta, locale)}</p>
        <h3 className="mt-3 text-2xl font-medium md:text-3xl">
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        <p className="mt-4 leading-7 text-muted-fg">{t(item.summary, locale)}</p>
        {item.stack.length > 0 ? (
          <ul className="mt-5 flex flex-wrap gap-2">
            {item.stack.map((tech) => (
              <li key={tech} className="border border-line px-2.5 py-1 text-xs text-muted-fg">
                {tech}
              </li>
            ))}
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

  if (reduce) return body;
  return (
    <motion.div style={{ scale, opacity }}>{body}</motion.div>
  );
}

export function CinematicExperience(props: CinematicPayload) {
  const { locale, rtl } = props;
  const showTeam = props.members.some((m) => m.visible);
  const skills = props.skills.items.filter((i) => i.visible);
  const experience = props.experience.items.filter((i) => i.visible);
  const customs = props.customSections.filter((s) => s.visible);
  const email = props.contact.email.trim();

  return (
    <>
      <HeroOpen
        locale={locale}
        hero={props.hero}
        productsLabel={t(props.hero.projects, locale)}
        contactLabel={t(props.hero.contact, locale)}
      />
      <StatsReel locale={locale} stats={props.stats} />
      <AboutWipe locale={locale} about={props.about} hero={props.hero} />
      <ProductRail locale={locale} rtl={rtl} products={props.products} />
      <ProjectStack locale={locale} projects={props.projects} />

      {showTeam ? (
        <section id="team" className="scroll-mt-24 border-t border-line">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <FadeRise>
              <p className="text-sm tracking-[0.22em] text-accent uppercase">
                {t(props.team.eyebrow, locale)}
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl font-medium tracking-tight md:text-6xl">
                {t(props.team.title, locale)}
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-fg">
                {t(props.team.intro, locale)}
              </p>
            </FadeRise>
            <TeamRoster
              locale={locale}
              departments={props.team.departments}
              members={props.members}
              title={t(props.team.title, locale)}
              signal={false}
            />
          </div>
        </section>
      ) : null}

      <section id="skills" className="scroll-mt-24 border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <FadeRise>
            <p className="text-sm tracking-[0.22em] text-accent uppercase">
              {t(props.skills.eyebrow, locale)}
            </p>
            <h2 className="mt-4 text-4xl font-medium tracking-tight md:text-6xl">
              {t(props.skills.title, locale)}
            </h2>
          </FadeRise>
          <ol className="mt-12 divide-y divide-line border-y border-line">
            {skills.map((skill, index) => (
              <FadeRise key={skill.id}>
                <li className="grid gap-3 py-6 md:grid-cols-[4rem_minmax(0,0.9fr)_minmax(0,1.2fr)] md:items-baseline">
                  <span className="text-sm text-muted-fg">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl font-medium md:text-2xl">{t(skill.name, locale)}</h3>
                  <p className="leading-7 text-muted-fg">{t(skill.detail, locale)}</p>
                </li>
              </FadeRise>
            ))}
          </ol>
        </div>
      </section>

      <section id="experience" className="scroll-mt-24 border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <FadeRise>
            <p className="text-sm tracking-[0.22em] text-accent uppercase">
              {t(props.experience.eyebrow, locale)}
            </p>
            <h2 className="mt-4 text-4xl font-medium tracking-tight md:text-6xl">
              {t(props.experience.title, locale)}
            </h2>
          </FadeRise>
          <ExperienceTrack>
            {experience.map((item) => (
              <article key={item.id} className="border border-line bg-card/70 p-6 backdrop-blur-sm md:p-8">
                <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                  <h3 className="text-xl">{t(item.role, locale)}</h3>
                  <p className="text-sm text-muted-fg">
                    {t(item.place, locale)} · {t(item.period, locale)}
                  </p>
                </div>
                <ul className="mt-5 grid gap-2 text-muted-fg">
                  {item.points.map((point, index) => (
                    <li key={`${item.id}-${index}`} className="leading-7">
                      {t(point, locale)}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </ExperienceTrack>
        </div>
      </section>

      {customs.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24 border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-2">
            {section.image ? (
              <FadeRise>
                <Cover
                  src={section.image}
                  alt={t(section.title, locale)}
                  sizes="50vw"
                  className="min-h-64 rounded-none"
                />
              </FadeRise>
            ) : null}
            <FadeRise>
              <h2 className="text-3xl font-medium tracking-tight md:text-5xl">
                {t(section.title, locale)}
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted-fg">{t(section.body, locale)}</p>
            </FadeRise>
          </div>
        </section>
      ))}

      <section id="contact" className="scroll-mt-24 border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="relative overflow-hidden border border-line bg-card px-6 py-12 md:px-12 md:py-16">
            <Marquee text={t(props.contact.title, locale)} />
            <div className="relative">
              <p className="text-sm tracking-[0.22em] text-accent uppercase">
                {t(props.contact.eyebrow, locale)}
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl font-medium tracking-tight md:text-6xl">
                {t(props.contact.title, locale)}
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-muted-fg">
                {t(props.contact.body, locale)}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-5 text-sm text-on-accent hover:opacity-90"
                  >
                    <Mail className="size-4" aria-hidden="true" />
                    {t(props.contact.emailAction, locale)}
                  </a>
                ) : null}
                <a
                  href={props.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    email
                      ? "inline-flex h-12 items-center gap-2 rounded-full border border-line px-5 text-sm hover:border-accent"
                      : "inline-flex h-12 items-center gap-2 rounded-full bg-accent px-5 text-sm text-on-accent hover:opacity-90"
                  }
                >
                  {t(props.contact.action, locale)}
                  <span className="opacity-70">{props.githubHandle}</span>
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </div>
              <div className="mt-6">
                <SocialLinks links={props.socials} locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
