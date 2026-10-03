import { cache } from "react";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { createSeed } from "./seed";
import type {
  Copy,
  ExperienceItem,
  ProjectGroup,
  ProjectItem,
  SiteContent,
  SkillItem,
  SkillSpan,
} from "./types";

const contentPath = path.join(process.cwd(), "data", "content.json");

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asCopy(value: unknown): Copy {
  if (!isRecord(value)) return { fa: "", en: "" };
  return {
    fa: typeof value.fa === "string" ? value.fa : "",
    en: typeof value.en === "string" ? value.en : "",
  };
}

function asSpan(value: unknown): SkillSpan {
  return value === "feature" || value === "wide" ? value : "normal";
}

function asGroup(value: unknown): ProjectGroup {
  return value === "recent" ? "recent" : "resume";
}

function asId(value: unknown, fallback: string) {
  const id = typeof value === "string" ? value.trim() : "";
  return id || fallback;
}

function asTemplate(value: unknown): SiteContent["template"] {
  return value === "studio" || value === "signal" ? value : "editorial";
}

function normalize(value: unknown): SiteContent {
  const seed = createSeed();
  if (!isRecord(value)) return seed;

  const skills = isRecord(value.skills) ? value.skills : {};
  const experience = isRecord(value.experience) ? value.experience : {};
  const projects = isRecord(value.projects) ? value.projects : {};

  const skillItems = Array.isArray(skills.items) ? skills.items : seed.skills.items;
  const experienceItems = Array.isArray(experience.items)
    ? experience.items
    : seed.experience.items;
  const projectItems = Array.isArray(projects.items) ? projects.items : seed.projects.items;

  return {
    template: asTemplate(value.template),
    githubUrl: typeof value.githubUrl === "string" ? value.githubUrl : seed.githubUrl,
    githubHandle:
      typeof value.githubHandle === "string" ? value.githubHandle : seed.githubHandle,
    meta: {
      title: asCopy(isRecord(value.meta) ? value.meta.title : seed.meta.title),
      description: asCopy(isRecord(value.meta) ? value.meta.description : seed.meta.description),
    },
    nav: {
      home: asCopy(isRecord(value.nav) ? value.nav.home : seed.nav.home),
      menu: asCopy(isRecord(value.nav) ? value.nav.menu : seed.nav.menu),
      skip: asCopy(isRecord(value.nav) ? value.nav.skip : seed.nav.skip),
      about: asCopy(isRecord(value.nav) ? value.nav.about : seed.nav.about),
      skills: asCopy(isRecord(value.nav) ? value.nav.skills : seed.nav.skills),
      experience: asCopy(isRecord(value.nav) ? value.nav.experience : seed.nav.experience),
      projects: asCopy(isRecord(value.nav) ? value.nav.projects : seed.nav.projects),
      contact: asCopy(isRecord(value.nav) ? value.nav.contact : seed.nav.contact),
    },
    theme: {
      toDark: asCopy(isRecord(value.theme) ? value.theme.toDark : seed.theme.toDark),
      toLight: asCopy(isRecord(value.theme) ? value.theme.toLight : seed.theme.toLight),
    },
    locale: {
      switchToEn: asCopy(isRecord(value.locale) ? value.locale.switchToEn : seed.locale.switchToEn),
      switchToFa: asCopy(isRecord(value.locale) ? value.locale.switchToFa : seed.locale.switchToFa),
    },
    hero: normalizeHero(value.hero, seed),
    about: normalizeAbout(value.about, seed),
    skills: {
      eyebrow: asCopy(skills.eyebrow),
      title: asCopy(skills.title),
      items: skillItems.map((item, index) => normalizeSkill(item, index)),
    },
    experience: {
      eyebrow: asCopy(experience.eyebrow),
      title: asCopy(experience.title),
      items: experienceItems.map((item, index) => normalizeExperience(item, index)),
    },
    projects: {
      eyebrow: asCopy(projects.eyebrow),
      title: asCopy(projects.title),
      intro: asCopy(projects.intro),
      resumeGroup: asCopy(projects.resumeGroup),
      recentGroup: asCopy(projects.recentGroup),
      items: projectItems.map((item, index) => normalizeProject(item, index)),
    },
    contact: {
      eyebrow: asCopy(isRecord(value.contact) ? value.contact.eyebrow : seed.contact.eyebrow),
      title: asCopy(isRecord(value.contact) ? value.contact.title : seed.contact.title),
      body: asCopy(isRecord(value.contact) ? value.contact.body : seed.contact.body),
      action: asCopy(isRecord(value.contact) ? value.contact.action : seed.contact.action),
    },
    footer: {
      note: asCopy(isRecord(value.footer) ? value.footer.note : seed.footer.note),
    },
    stats: Array.isArray(value.stats) ? value.stats.map(normalizeStat) : seed.stats,
    customSections: Array.isArray(value.customSections)
      ? value.customSections.map(normalizeCustom)
      : seed.customSections,
    socials: Array.isArray(value.socials) ? value.socials.map(normalizeSocial) : seed.socials,
  };
}

function normalizeHero(value: unknown, seed: SiteContent): SiteContent["hero"] {
  const hero = isRecord(value) ? value : {};
  return {
    eyebrow: asCopy(hero.eyebrow ?? seed.hero.eyebrow),
    name: asCopy(hero.name ?? seed.hero.name),
    role: asCopy(hero.role ?? seed.hero.role),
    summary: asCopy(hero.summary ?? seed.hero.summary),
    projects: asCopy(hero.projects ?? seed.hero.projects),
    contact: asCopy(hero.contact ?? seed.hero.contact),
    locationLabel: asCopy(hero.locationLabel ?? seed.hero.locationLabel),
    location: asCopy(hero.location ?? seed.hero.location),
    focusLabel: asCopy(hero.focusLabel ?? seed.hero.focusLabel),
    focus: asCopy(hero.focus ?? seed.hero.focus),
    studyLabel: asCopy(hero.studyLabel ?? seed.hero.studyLabel),
    study: asCopy(hero.study ?? seed.hero.study),
    image: asImage(hero.image, seed.hero.image),
    detailImage: asImage(hero.detailImage, seed.hero.detailImage),
    accentImage: asImage(hero.accentImage, seed.hero.accentImage),
  };
}

function normalizeAbout(value: unknown, seed: SiteContent): SiteContent["about"] {
  const about = isRecord(value) ? value : {};
  return {
    image: asImage(about.image, seed.about.image),
    eyebrow: asCopy(about.eyebrow ?? seed.about.eyebrow),
    title: asCopy(about.title ?? seed.about.title),
    body: asCopy(about.body ?? seed.about.body),
    educationTitle: asCopy(about.educationTitle ?? seed.about.educationTitle),
    educationBody: asCopy(about.educationBody ?? seed.about.educationBody),
    englishTitle: asCopy(about.englishTitle ?? seed.about.englishTitle),
    englishBody: asCopy(about.englishBody ?? seed.about.englishBody),
  };
}

function normalizeSkill(value: unknown, index: number): SkillItem {
  const item = isRecord(value) ? value : {};
  return {
    id: asId(item.id, `skill-${index + 1}`),
    visible: item.visible !== false,
    span: asSpan(item.span),
    name: asCopy(item.name),
    detail: asCopy(item.detail),
  };
}

function normalizeExperience(value: unknown, index: number): ExperienceItem {
  const item = isRecord(value) ? value : {};
  const points = Array.isArray(item.points) ? item.points.map(asCopy) : [];
  return {
    id: asId(item.id, `experience-${index + 1}`),
    visible: item.visible !== false,
    role: asCopy(item.role),
    place: asCopy(item.place),
    period: asCopy(item.period),
    points,
  };
}

function asKind(value: unknown): SiteContent["socials"][number]["kind"] {
  const kinds = ["linkedin", "instagram", "telegram", "youtube", "website", "custom"] as const;
  return kinds.find((kind) => kind === value) ?? "custom";
}

function normalizeStat(value: unknown, index: number) {
  const item = isRecord(value) ? value : {};
  return {
    id: asId(item.id, `stat-${index + 1}`),
    visible: item.visible !== false,
    value: typeof item.value === "string" ? item.value : "",
    label: asCopy(item.label),
  };
}

function normalizeCustom(value: unknown, index: number) {
  const item = isRecord(value) ? value : {};
  return {
    id: asId(item.id, `section-${index + 1}`),
    visible: item.visible !== false,
    title: asCopy(item.title),
    body: asCopy(item.body),
    image: typeof item.image === "string" ? item.image : "",
  };
}

function normalizeSocial(value: unknown, index: number) {
  const item = isRecord(value) ? value : {};
  return {
    id: asId(item.id, `link-${index + 1}`),
    kind: asKind(item.kind),
    visible: item.visible !== false,
    label: asCopy(item.label),
    url: typeof item.url === "string" ? item.url : "",
  };
}

function asImage(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeProject(value: unknown, index: number): ProjectItem {
  const item = isRecord(value) ? value : {};
  const id = asId(item.id, `project-${index + 1}`);
  const seeded = createSeed().projects.items.find((project) => project.id === id);
  return {
    id,
    visible: item.visible !== false,
    group: asGroup(item.group),
    title: asCopy(item.title),
    meta: asCopy(item.meta),
    summary: asCopy(item.summary),
    url: typeof item.url === "string" ? item.url : "",
    image: asImage(item.image, seeded?.image ?? "/templates/html-site.jpg"),
  };
}

export const getContent = cache(async (): Promise<SiteContent> => {
  try {
    const raw = await readFile(contentPath, "utf8");
    return normalize(JSON.parse(raw));
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT" && !(error instanceof SyntaxError)) {
      throw error;
    }
  }

  return createSeed();
});

export async function saveContent(content: unknown) {
  const next = normalize(content);
  await mkdir(path.dirname(contentPath), { recursive: true });
  await writeFile(contentPath, JSON.stringify(next, null, 2), "utf8");
  return next;
}
