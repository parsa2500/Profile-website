import en from "../../messages/en.json";
import fa from "../../messages/fa.json";
import type {
  Copy,
  ExperienceItem,
  ProjectGroup,
  ProjectItem,
  SiteContent,
  SkillItem,
  SkillSpan,
} from "./types";

function copy(faText: string, enText: string): Copy {
  return { fa: faText, en: enText };
}

const skillSpans: Record<string, SkillSpan> = {
  python: "feature",
  web: "wide",
  english: "wide",
};

const skillOrder = [
  "python",
  "web",
  "wordpress",
  "bootstrap",
  "photoshop",
  "icdl",
  "english",
] as const;

const experienceOrder = ["webIntern", "seo"] as const;

const projectOrder: {
  id: keyof typeof fa.projects.items;
  group: ProjectGroup;
  image: string;
}[] = [
  { id: "pythonGame", group: "resume", image: "/templates/python-game.jpg" },
  { id: "wordpress", group: "resume", image: "/templates/wordpress.jpg" },
  { id: "htmlSite", group: "resume", image: "/templates/html-site.jpg" },
  { id: "cafePos", group: "recent", image: "/templates/cafe-pos.jpg" },
  { id: "rag", group: "recent", image: "/templates/rag-chat.jpg" },
  { id: "movahed", group: "recent", image: "/templates/movahed.jpg" },
];

function skills(): SkillItem[] {
  return skillOrder.map((id) => ({
    id,
    visible: true,
    span: skillSpans[id] ?? "normal",
    name: copy(fa.skills.items[id].name, en.skills.items[id].name),
    detail: copy(fa.skills.items[id].detail, en.skills.items[id].detail),
  }));
}

function experience(): ExperienceItem[] {
  return experienceOrder.map((id) => ({
    id,
    visible: true,
    role: copy(fa.experience.items[id].role, en.experience.items[id].role),
    place: copy(fa.experience.items[id].place, en.experience.items[id].place),
    period: copy(fa.experience.items[id].period, en.experience.items[id].period),
    points: fa.experience.items[id].points.map((point, index) =>
      copy(point, en.experience.items[id].points[index] ?? ""),
    ),
  }));
}

function projects(): ProjectItem[] {
  return projectOrder.map(({ id, group, image }) => ({
    id,
    visible: true,
    group,
    title: copy(fa.projects.items[id].title, en.projects.items[id].title),
    meta: copy(fa.projects.items[id].meta, en.projects.items[id].meta),
    summary: copy(fa.projects.items[id].summary, en.projects.items[id].summary),
    url: "",
    image,
  }));
}

export function createSeed(): SiteContent {
  return {
    template: "editorial",
    githubUrl: "https://github.com/parsa2500",
    githubHandle: "parsa2500",
    meta: {
      title: copy(fa.meta.title, en.meta.title),
      description: copy(fa.meta.description, en.meta.description),
    },
    nav: {
      home: copy(fa.nav.home, en.nav.home),
      menu: copy(fa.nav.menu, en.nav.menu),
      skip: copy(fa.nav.skip, en.nav.skip),
      about: copy(fa.nav.about, en.nav.about),
      skills: copy(fa.nav.skills, en.nav.skills),
      experience: copy(fa.nav.experience, en.nav.experience),
      projects: copy(fa.nav.projects, en.nav.projects),
      contact: copy(fa.nav.contact, en.nav.contact),
    },
    theme: {
      toDark: copy(fa.theme.toDark, en.theme.toDark),
      toLight: copy(fa.theme.toLight, en.theme.toLight),
    },
    locale: {
      switchToEn: copy(fa.locale.switchToEn, en.locale.switchToEn),
      switchToFa: copy(fa.locale.switchToFa, en.locale.switchToFa),
    },
    hero: {
      eyebrow: copy(fa.hero.eyebrow, en.hero.eyebrow),
      name: copy(fa.hero.name, en.hero.name),
      role: copy(fa.hero.role, en.hero.role),
      summary: copy(fa.hero.summary, en.hero.summary),
      projects: copy(fa.hero.projects, en.hero.projects),
      contact: copy(fa.hero.contact, en.hero.contact),
      locationLabel: copy(fa.hero.locationLabel, en.hero.locationLabel),
      location: copy(fa.hero.location, en.hero.location),
      focusLabel: copy(fa.hero.focusLabel, en.hero.focusLabel),
      focus: copy(fa.hero.focus, en.hero.focus),
      studyLabel: copy(fa.hero.studyLabel, en.hero.studyLabel),
      study: copy(fa.hero.study, en.hero.study),
      image: "/templates/hero.jpg",
      detailImage: "/templates/hero-detail.jpg",
      accentImage: "/templates/hero-accent.jpg",
    },
    about: {
      image: "/templates/about.jpg",
      eyebrow: copy(fa.about.eyebrow, en.about.eyebrow),
      title: copy(fa.about.title, en.about.title),
      body: copy(fa.about.body, en.about.body),
      educationTitle: copy(fa.about.educationTitle, en.about.educationTitle),
      educationBody: copy(fa.about.educationBody, en.about.educationBody),
      englishTitle: copy(fa.about.englishTitle, en.about.englishTitle),
      englishBody: copy(fa.about.englishBody, en.about.englishBody),
    },
    skills: {
      eyebrow: copy(fa.skills.eyebrow, en.skills.eyebrow),
      title: copy(fa.skills.title, en.skills.title),
      items: skills(),
    },
    experience: {
      eyebrow: copy(fa.experience.eyebrow, en.experience.eyebrow),
      title: copy(fa.experience.title, en.experience.title),
      items: experience(),
    },
    projects: {
      eyebrow: copy(fa.projects.eyebrow, en.projects.eyebrow),
      title: copy(fa.projects.title, en.projects.title),
      intro: copy(fa.projects.intro, en.projects.intro),
      resumeGroup: copy(fa.projects.resumeGroup, en.projects.resumeGroup),
      recentGroup: copy(fa.projects.recentGroup, en.projects.recentGroup),
      items: projects(),
    },
    contact: {
      eyebrow: copy(fa.contact.eyebrow, en.contact.eyebrow),
      title: copy(fa.contact.title, en.contact.title),
      body: copy(fa.contact.body, en.contact.body),
      action: copy(fa.contact.action, en.contact.action),
    },
    footer: {
      note: copy(fa.footer.note, en.footer.note),
    },
    stats: [
      { id: "projects", visible: true, value: "۶", label: copy("پروژه", "Projects") },
      { id: "skills", visible: true, value: "۷", label: copy("مهارت", "Skills") },
    ],
    customSections: [],
    socials: [
      { id: "linkedin", kind: "linkedin", visible: true, label: copy("لینکدین", "LinkedIn"), url: "" },
      { id: "instagram", kind: "instagram", visible: true, label: copy("اینستاگرام", "Instagram"), url: "" },
      { id: "telegram", kind: "telegram", visible: true, label: copy("تلگرام", "Telegram"), url: "" },
      { id: "youtube", kind: "youtube", visible: true, label: copy("یوتیوب", "YouTube"), url: "" },
      { id: "website", kind: "website", visible: true, label: copy("وب‌سایت", "Website"), url: "" },
    ],
  };
}
