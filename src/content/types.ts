export type Copy = {
  fa: string;
  en: string;
};

export function pick(copy: Copy, locale: string) {
  return locale === "en" ? copy.en : copy.fa;
}

export type SkillSpan = "feature" | "wide" | "normal";
export type ProjectGroup = "resume" | "recent";

export type SkillItem = {
  id: string;
  visible: boolean;
  span: SkillSpan;
  name: Copy;
  detail: Copy;
};

export type ExperienceItem = {
  id: string;
  visible: boolean;
  role: Copy;
  place: Copy;
  period: Copy;
  points: Copy[];
};

export type ProjectItem = {
  id: string;
  visible: boolean;
  group: ProjectGroup;
  title: Copy;
  meta: Copy;
  summary: Copy;
  url: string;
  image: string;
};

export type StatItem = {
  id: string;
  visible: boolean;
  value: string;
  label: Copy;
};

export type CustomSection = {
  id: string;
  visible: boolean;
  title: Copy;
  body: Copy;
  image: string;
};

export type SocialKind =
  | "linkedin"
  | "instagram"
  | "telegram"
  | "youtube"
  | "website"
  | "custom";

export type SocialLink = {
  id: string;
  kind: SocialKind;
  visible: boolean;
  label: Copy;
  url: string;
};

export type SiteTemplate = "editorial" | "studio" | "signal";

export type SiteContent = {
  template: SiteTemplate;
  githubUrl: string;
  githubHandle: string;
  meta: { title: Copy; description: Copy };
  nav: {
    home: Copy;
    menu: Copy;
    skip: Copy;
    about: Copy;
    skills: Copy;
    experience: Copy;
    projects: Copy;
    contact: Copy;
  };
  theme: { toDark: Copy; toLight: Copy };
  locale: { switchToEn: Copy; switchToFa: Copy };
  hero: {
    eyebrow: Copy;
    name: Copy;
    role: Copy;
    summary: Copy;
    projects: Copy;
    contact: Copy;
    locationLabel: Copy;
    location: Copy;
    focusLabel: Copy;
    focus: Copy;
    studyLabel: Copy;
    study: Copy;
    image: string;
    detailImage: string;
    accentImage: string;
  };
  about: {
    image: string;
    eyebrow: Copy;
    title: Copy;
    body: Copy;
    educationTitle: Copy;
    educationBody: Copy;
    englishTitle: Copy;
    englishBody: Copy;
  };
  skills: { eyebrow: Copy; title: Copy; items: SkillItem[] };
  experience: { eyebrow: Copy; title: Copy; items: ExperienceItem[] };
  projects: {
    eyebrow: Copy;
    title: Copy;
    intro: Copy;
    resumeGroup: Copy;
    recentGroup: Copy;
    items: ProjectItem[];
  };
  contact: { eyebrow: Copy; title: Copy; body: Copy; action: Copy };
  footer: { note: Copy };
  stats: StatItem[];
  customSections: CustomSection[];
  socials: SocialLink[];
};
