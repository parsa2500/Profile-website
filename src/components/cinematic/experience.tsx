"use client";

import { ArrowUpRight, Mail } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { BrandMark } from "@/components/brand-mark";
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
import { CitySlot, CountUpValue } from "./stat-motion";
import { TypeLine } from "./type-line";

function subscribeNarrow(onChange: () => void) {
  const media = window.matchMedia("(max-width: 767px)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function useNarrowViewport() {
  return useSyncExternalStore(
    subscribeNarrow,
    () => window.matchMedia("(max-width: 767px)").matches,
    () => false,
  );
}

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

function DoorLogoHalf({ side }: { side: "left" | "right" }) {
  // Clipped to the door's center edge so both halves meet on the viewport midline.
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute top-1/2 z-10 overflow-hidden ${
        side === "left"
          ? "right-0 h-[var(--hero-logo)] w-[calc(var(--hero-logo)/2)] -translate-y-1/2"
          : "left-0 h-[var(--hero-logo)] w-[calc(var(--hero-logo)/2)] -translate-y-1/2"
      }`}
      style={{ ["--hero-logo" as string]: "clamp(7rem, 18vw, 9rem)" }}
    >
      <div
        className={`absolute top-0 h-[var(--hero-logo)] w-[var(--hero-logo)] ${
          side === "left" ? "left-0" : "right-0"
        }`}
      >
        <BrandMark className="!size-[var(--hero-logo)] !rounded-[0.9rem]" />
      </div>
    </div>
  );
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
  const narrow = useNarrowViewport();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Logo visible → center seam drops → doors + logo halves open slower → copy reveals.
  // On narrow viewports, reveal copy earlier so short scrolls still feel alive.
  const logoOpacity = useTransform(scrollYProgress, [0, 0.06, 0.14], [0, 1, 1]);
  const seamScale = useTransform(scrollYProgress, [0.08, 0.2], [0, 1]);
  const doorAmount = useTransform(scrollYProgress, [0.18, 0.65], [0, 1]);
  const doorL = useTransform(doorAmount, (v) => `${-v * 52}vw`);
  const doorR = useTransform(doorAmount, (v) => `${v * 52}vw`);
  const doorFade = useTransform(scrollYProgress, [0.55, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.18, 0.75], [1.45, 1]);
  const blur = useTransform(scrollYProgress, [0.18, 0.42, 0.75], [8, 2, 0]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  const narrowRef = useRef(narrow);
  narrowRef.current = narrow;
  const textOpacity = useTransform(scrollYProgress, (v) => {
    const start = narrowRef.current ? 0.34 : 0.48;
    const end = narrowRef.current ? 0.58 : 0.72;
    if (v <= start) return 0;
    if (v >= end) return 1;
    return (v - start) / (end - start);
  });
  const textY = useTransform(scrollYProgress, (v) => {
    const start = narrowRef.current ? 0.34 : 0.48;
    const end = narrowRef.current ? 0.58 : 0.72;
    if (v <= start) return 28;
    if (v >= end) return 0;
    return 28 * (1 - (v - start) / (end - start));
  });
  const veil = useTransform(scrollYProgress, [0.18, 0.65], [0.72, 0.28]);

  const name = t(hero.name, locale);

  if (reduce) {
    return (
      <section
        id="top"
        className="relative min-h-[var(--cinematic-remaining)] overflow-hidden"
      >
        <Cover
          src={hero.image}
          alt={name}
          priority
          sizes="100vw"
          className="absolute inset-0 min-h-full rounded-none"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="cinematic-band relative z-10 mx-auto flex w-full max-w-6xl flex-col justify-end px-5 md:px-8">
          <p className="text-sm tracking-[0.22em] text-accent uppercase">
            {t(hero.eyebrow, locale)}
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-medium leading-[0.95] tracking-tight text-white md:mt-4 md:text-8xl">
            {name}
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/90 md:mt-6 md:text-xl">
            {t(hero.role, locale)}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75 md:mt-4 md:text-base md:leading-8">
            {t(hero.summary, locale)}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
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
    <section id="top" ref={ref} className="relative h-[230vh]">
      <div className="sticky top-[var(--header-h)] z-10 h-[var(--cinematic-remaining)] overflow-hidden bg-black touch-pan-y">
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
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-1/2 border-r border-white/10 bg-[#0a0a0a] will-change-transform"
          style={{ x: doorL, opacity: doorFade }}
        >
          <motion.div style={{ opacity: logoOpacity }}>
            <DoorLogoHalf side="left" />
          </motion.div>
          <motion.div
            className="absolute inset-y-0 right-0 w-px origin-top bg-gradient-to-b from-transparent via-accent/70 to-transparent"
            style={{ scaleY: seamScale }}
          />
        </motion.div>
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-1/2 border-l border-white/10 bg-[#0a0a0a] will-change-transform"
          style={{ x: doorR, opacity: doorFade }}
        >
          <motion.div style={{ opacity: logoOpacity }}>
            <DoorLogoHalf side="right" />
          </motion.div>
          <motion.div
            className="absolute inset-y-0 left-0 w-px origin-top bg-gradient-to-b from-transparent via-accent/70 to-transparent"
            style={{ scaleY: seamScale }}
          />
        </motion.div>
        <motion.div
          className="cinematic-band relative z-30 mx-auto flex w-full max-w-6xl flex-col justify-end px-5 md:px-8"
          style={{ opacity: textOpacity, y: textY }}
        >
          <p className="text-sm tracking-[0.22em] text-accent uppercase">
            {t(hero.eyebrow, locale)}
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-medium leading-[0.95] tracking-tight text-white md:mt-4 md:text-8xl">
            {name}
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/90 md:mt-6 md:text-2xl">
            {t(hero.role, locale)}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75 md:mt-4 md:text-lg md:leading-8">
            {t(hero.summary, locale)}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
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
    <section id="stats" className="scroll-mt-[var(--header-h)] border-t border-line">
      <div className="cinematic-flow mx-auto grid w-full max-w-6xl grid-cols-2 content-center gap-4 px-5 md:grid-cols-4 md:px-8">
        {items.map((item) => {
          const isCity = item.id === "city" || !/^-?\d+(\.\d+)?$/.test(item.value.trim());
          return (
            <FadeRise key={item.id}>
              <div className="liquid-glass p-6">
                {isCity ? (
                  <CitySlot
                    locale={locale}
                    finalValue={item.value}
                    className="text-5xl font-medium tracking-tight md:text-6xl"
                  />
                ) : (
                  <CountUpValue
                    value={item.value}
                    className="text-5xl font-medium tracking-tight md:text-6xl"
                  />
                )}
                <p className="mt-3 text-sm text-muted-fg">{t(item.label, locale)}</p>
              </div>
            </FadeRise>
          );
        })}
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
  const narrow = useNarrowViewport();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const doorAmount = useTransform(scrollYProgress, [0.06, 0.52], [0, 1]);
  const doorL = useTransform(doorAmount, (v) => `${-v * 52}vw`);
  const doorR = useTransform(doorAmount, (v) => `${v * 52}vw`);
  const doorFade = useTransform(scrollYProgress, [0.42, 0.58], [1, 0]);
  const markOpacity = useTransform(scrollYProgress, [0, 0.08, 0.28, 0.42], [1, 1, 0.35, 0]);
  const markScale = useTransform(scrollYProgress, [0, 0.35], [1, 1.12]);
  const stageFade = useTransform(scrollYProgress, [0.82, 1], [1, 0]);
  const narrowRef = useRef(narrow);
  narrowRef.current = narrow;
  const copyReady = useTransform(scrollYProgress, (v) => {
    const threshold = narrowRef.current ? 0.32 : 0.42;
    return v >= threshold ? 1 : 0;
  });
  const [typing, setTyping] = useState(false);

  useLayoutEffect(() => {
    const unsub = copyReady.on("change", (v) => {
      if (v >= 1) setTyping(true);
    });
    return () => unsub();
  }, [copyReady]);

  const facts = [
    { label: t(hero.locationLabel, locale), value: t(hero.location, locale) },
    { label: t(hero.focusLabel, locale), value: t(hero.focus, locale) },
    { label: t(hero.baseLabel, locale), value: t(hero.base, locale) },
  ];
  const title = t(about.title, locale);
  const body = t(about.body, locale);
  const eyebrow = t(about.eyebrow, locale);

  if (reduce) {
    return (
      <section id="about" className="scroll-mt-[var(--header-h)] border-t border-line">
        <div className="cinematic-flow mx-auto grid max-w-6xl gap-8 px-5 md:px-8 lg:grid-cols-2">
          <Cover
            src={about.image}
            alt={title}
            sizes="50vw"
            className="min-h-80 rounded-none"
          />
          <div>
            <p className="text-sm text-accent">{eyebrow}</p>
            <h2 className="mt-3 text-4xl font-medium md:text-5xl">{title}</h2>
            <p className="mt-5 text-lg leading-8">{body}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" ref={ref} className="relative z-10 h-[240vh] scroll-mt-[var(--header-h)]">
      <div className="sticky top-[var(--header-h)] flex h-[var(--cinematic-remaining)] items-center overflow-hidden bg-black touch-pan-y">
        <motion.div className="absolute inset-0" style={{ opacity: stageFade }}>
          <div className="absolute inset-0">
            <Cover
              src={about.image}
              alt={title}
              sizes="100vw"
              className="absolute inset-0 min-h-full rounded-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />
          </div>

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-1/2 bg-[#0a0a0a] will-change-transform"
            style={{ x: doorL, opacity: doorFade }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-1/2 bg-[#0a0a0a] will-change-transform"
            style={{ x: doorR, opacity: doorFade }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
            style={{ opacity: markOpacity, scale: markScale }}
          >
            <span className="text-[clamp(4.5rem,22vw,14rem)] font-medium leading-none text-accent">
              ?
            </span>
          </motion.div>

          <div className="cinematic-band relative z-10 mx-auto flex w-full max-w-6xl flex-col justify-center px-5 md:px-8">
            <p
              className="text-sm tracking-[0.22em] text-accent uppercase"
              style={{ opacity: typing ? 1 : 0 }}
            >
              {eyebrow}
            </p>
            <TypeLine
              as="h2"
              text={title}
              active={typing}
              delayMs={80}
              charMs={28}
              className="mt-3 max-w-3xl text-3xl font-medium tracking-tight text-white md:mt-4 md:text-6xl"
            />
            <TypeLine
              text={body}
              active={typing}
              delayMs={Math.min(900, title.length * 28 + 160)}
              charMs={14}
              className="mt-4 max-w-2xl text-base leading-7 text-white/80 md:mt-5 md:text-lg md:leading-8"
            />
            <dl className="mt-6 grid gap-3 sm:grid-cols-3 md:mt-8">
              {facts.map((fact, index) => (
                <motion.div
                  key={fact.label}
                  className="liquid-glass-sm px-4 py-4"
                  initial={{ opacity: 0, y: 24 }}
                  animate={typing ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                  transition={{
                    delay: 0.55 + index * 0.18,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <dt className="text-xs text-white/60">{fact.label}</dt>
                  <dd className="mt-2 text-sm leading-6 text-white">{fact.value}</dd>
                </motion.div>
              ))}
            </dl>
          </div>
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
  const trackRef = useRef<HTMLDivElement>(null);
  const shift = useMotionValue(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const xShift = useTransform([scrollYProgress, shift], ([progress, max]) => {
    const p = progress as number;
    const m = max as number;
    return rtl ? p * m : -p * m;
  });
  const linkLabel = locale === "en" ? "Open product →" : "مشاهده محصول ←";

  useLayoutEffect(() => {
    if (reduce) return;
    const measure = () => {
      const track = trackRef.current;
      const stage = track?.parentElement;
      if (!track || !stage) return;
      const max = Math.max(0, track.scrollWidth - stage.clientWidth);
      shift.set(max);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (trackRef.current?.parentElement) ro.observe(trackRef.current.parentElement);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduce, shift, visible.length, rtl]);

  if (visible.length === 0) return null;

  if (reduce) {
    return (
      <section id="products" className="cinematic-flow scroll-mt-[var(--header-h)] border-t border-line">
        <ScrollHeadline
          eyebrow={t(products.eyebrow, locale)}
          title={t(products.title, locale)}
          intro={t(products.intro, locale)}
        />
        <div className="mx-auto mt-10 grid max-w-6xl gap-4 px-5 md:grid-cols-2 md:px-8">
          {visible.map((item) => (
            <article key={item.id} className="liquid-glass overflow-hidden">
              <div className="relative">
                <Cover
                  src={item.image}
                  alt={t(item.name, locale)}
                  sizes="50vw"
                  className="aspect-[3/4] max-h-[min(calc(var(--cinematic-band)*0.55),22rem)] rounded-none"
                />
                <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/55 to-transparent px-5 pb-5 pt-16">
                  <p className="text-xs tracking-wide text-accent">{t(item.tagline, locale)}</p>
                  <h3 className="mt-2 text-2xl font-medium text-white">{t(item.name, locale)}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-fg">{t(item.summary, locale)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="products"
      ref={ref}
      className="relative z-20 h-[280vh] scroll-mt-[var(--header-h)] border-t border-line"
    >
      <div className="sticky top-[var(--header-h)] flex h-[var(--cinematic-remaining)] flex-col overflow-hidden bg-[var(--color-bg)] touch-pan-y">
        <div className="cinematic-band flex min-h-0 flex-col justify-center">
          <ScrollHeadline
            eyebrow={t(products.eyebrow, locale)}
            title={t(products.title, locale)}
            intro={t(products.intro, locale)}
          />
          <motion.div
            ref={trackRef}
            className="mt-6 flex min-h-0 w-max flex-1 gap-5 px-5 md:mt-10 md:px-8"
            style={{ x: xShift }}
          >
            {visible.map((item) => {
              const name = t(item.name, locale);
              const href = item.url.trim();
              return (
                <article
                  key={item.id}
                  className="liquid-glass w-[min(78vw,24rem)] shrink-0 overflow-hidden"
                >
                  <div className="relative max-h-[min(calc(var(--cinematic-band)*0.55),22rem)]">
                    <Cover
                      src={item.image}
                      alt={name}
                      sizes="24rem"
                      className="aspect-[3/4] max-h-[min(calc(var(--cinematic-band)*0.55),22rem)] rounded-none"
                    />
                    <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/55 to-transparent px-5 pb-5 pt-16">
                      <p className="text-xs tracking-wide text-accent">{t(item.tagline, locale)}</p>
                      <h3 className="mt-2 text-2xl font-medium text-white md:text-3xl">{name}</h3>
                    </div>
                  </div>
                  <div className="p-5 md:p-6">
                    <p className="text-sm leading-7 text-muted-fg">{t(item.summary, locale)}</p>
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
    <section id="projects" className="scroll-mt-[var(--header-h)] border-t border-line">
      <div className="cinematic-flow mx-auto max-w-6xl px-5 md:px-8">
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
      className={`liquid-glass grid overflow-hidden md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] ${
        index % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
      }`}
    >
      <Cover
        src={item.image}
        alt={title}
        sizes="50vw"
        className="aspect-[16/11] rounded-none md:aspect-auto md:min-h-[22rem]"
      />
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
              <li key={tech} className="liquid-glass-chip px-2.5 py-1 text-xs text-muted-fg">
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
        <section id="team" className="scroll-mt-[var(--header-h)] border-t border-line">
          <div className="cinematic-flow mx-auto max-w-6xl px-5 md:px-8">
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

      <section id="skills" className="scroll-mt-[var(--header-h)] border-t border-line">
        <div className="cinematic-flow mx-auto max-w-6xl px-5 md:px-8">
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

      <section id="experience" className="scroll-mt-[var(--header-h)] border-t border-line">
        <div className="cinematic-flow mx-auto max-w-6xl px-5 md:px-8">
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
              <article key={item.id} className="liquid-glass p-6 md:p-8">
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
        <section
          key={section.id}
          id={section.id}
          className="scroll-mt-[var(--header-h)] border-t border-line"
        >
          <div className="cinematic-flow mx-auto grid max-w-6xl gap-8 px-5 md:px-8 lg:grid-cols-2">
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

      <section id="contact" className="scroll-mt-[var(--header-h)] border-t border-line">
        <div className="cinematic-flow mx-auto max-w-6xl px-5 md:px-8">
          <div className="liquid-glass relative overflow-hidden px-6 py-12 md:px-12 md:py-16">
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
                      ? "liquid-glass-chip inline-flex h-12 items-center gap-2 px-5 text-sm hover:border-accent"
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
