import en from "../../messages/en.json";
import fa from "../../messages/fa.json";
import type {
  Copy,
  ExperienceItem,
  ProductItem,
  ProjectGroup,
  ProjectItem,
  SiteContent,
  SkillItem,
  SkillSpan,
  TeamDepartment,
  TeamMember,
} from "./types";

function copy(faText: string, enText: string): Copy {
  return { fa: faText, en: enText };
}

const skillSpans: Record<string, SkillSpan> = {
  product: "feature",
  web: "wide",
  ai: "wide",
};

const skillOrder = [
  "product",
  "web",
  "ai",
  "research",
  "sales",
  "care",
  "ops",
] as const;

const experienceOrder = ["formed", "products", "delivery"] as const;

const projectOrder: {
  id: keyof typeof fa.projects.items;
  group: ProjectGroup;
  image: string;
}[] = [
  { id: "cafePos", group: "featured", image: "/templates/cafe-pos.jpg" },
  { id: "rag", group: "featured", image: "/templates/rag-chat.jpg" },
  { id: "movahed", group: "featured", image: "/templates/movahed.jpg" },
  { id: "wordpress", group: "recent", image: "/templates/wordpress.jpg" },
  { id: "htmlSite", group: "recent", image: "/templates/html-site.jpg" },
  { id: "pythonGame", group: "recent", image: "/templates/python-game.jpg" },
];

const productOrder: {
  id: keyof typeof fa.products.items;
  image: string;
}[] = [
  { id: "pulse", image: "/templates/hero.jpg" },
  { id: "relay", image: "/templates/cafe-pos.jpg" },
  { id: "lens", image: "/templates/rag-chat.jpg" },
  { id: "harbor", image: "/templates/about.jpg" },
];

const productHighlights: Record<string, Copy[]> = {
  pulse: [
    copy("وضعیت تحویل در یک نگاه.", "Delivery status at a glance."),
    copy("سیگنال پشتیبانی کنار پیشرفت اسپرینت.", "Support signals beside sprint progress."),
  ],
  relay: [
    copy("پیگیری مشترک فروش و مراقبت.", "Shared sales and care follow-up."),
    copy("یادداشت‌های زنده روی هر سرنخ.", "Live notes on every lead."),
  ],
  lens: [
    copy("بانک بینش قابل جستجو.", "Searchable insight bank."),
    copy("آزمایش فرضیه با ریتم کوتاه.", "Short-cycle hypothesis tests."),
  ],
  harbor: [
    copy("اولویت‌بندی شفاف تیکت‌ها.", "Clear ticket prioritization."),
    copy("دانشنامه داخلی تیم.", "Internal team knowledge base."),
  ],
};

const memberOrder: {
  id: keyof typeof fa.team.members;
  department: TeamDepartment;
  image: string;
}[] = [
  { id: "sara", department: "sales", image: "/templates/hero-detail.jpg" },
  { id: "nima", department: "sales", image: "/templates/hero-accent.jpg" },
  { id: "arya", department: "engineering", image: "/templates/hero.jpg" },
  { id: "leila", department: "engineering", image: "/templates/about.jpg" },
  { id: "omid", department: "engineering", image: "/templates/html-site.jpg" },
  { id: "mina", department: "research", image: "/templates/rag-chat.jpg" },
  { id: "reza", department: "research", image: "/templates/movahed.jpg" },
  { id: "hana", department: "support", image: "/templates/wordpress.jpg" },
  { id: "pouya", department: "support", image: "/templates/python-game.jpg" },
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

const projectStacks: Record<string, string[]> = {
  pythonGame: ["Python"],
  wordpress: ["WordPress", "PHP", "CSS"],
  htmlSite: ["HTML", "CSS"],
  cafePos: ["TypeScript", "React", "Node.js"],
  rag: ["Python", "RAG", "LLMs"],
  movahed: ["Mobile", "Web"],
};

const projectHighlights: Record<string, Copy[]> = {
  pythonGame: [
    copy("منطق بازی و حلقه رویداد با پایتون.", "Game logic and event loop in Python."),
    copy("نمونه آموزشی از ایده تا اجرا.", "Teaching sample from idea to playable build."),
  ],
  wordpress: [
    copy("راه‌اندازی سایت مؤسسه روی وردپرس.", "Launched an institute site on WordPress."),
    copy("قالب و محتوای قابل ویرایش.", "Configured theme and editable content."),
  ],
  htmlSite: [
    copy("فرانت استاتیک تمیز.", "Clean static front end."),
    copy("تمرکز روی ساختار HTML/CSS.", "Focused on clean HTML/CSS structure."),
  ],
  cafePos: [
    copy("جریان فروش، صندوق و سفارش کافه.", "Sales, register, and cafe order flow."),
    copy("رابط برای کار روزمره پرسنل.", "UI shaped for day-to-day staff use."),
  ],
  rag: [
    copy("پاسخ‌گویی با بازیابی از اسناد.", "Answers grounded in retrieved documents."),
    copy("خط لوله ingest → retrieve → reply.", "Simple ingest → retrieve → reply pipeline."),
  ],
  movahed: [
    copy("کار روی اپلیکیشن موحد.", "Work on the Movahed application."),
    copy("هماهنگی وب و تجربه کاربری.", "Coordinated web pieces and UX."),
  ],
};

function projects(): ProjectItem[] {
  return projectOrder.map(({ id, group, image }) => ({
    id,
    visible: true,
    group,
    title: copy(fa.projects.items[id].title, en.projects.items[id].title),
    meta: copy(fa.projects.items[id].meta, en.projects.items[id].meta),
    summary: copy(fa.projects.items[id].summary, en.projects.items[id].summary),
    stack: projectStacks[id] ?? [],
    highlights: projectHighlights[id] ?? [],
    url: "",
    image,
  }));
}

function products(): ProductItem[] {
  return productOrder.map(({ id, image }) => ({
    id,
    visible: true,
    name: copy(fa.products.items[id].name, en.products.items[id].name),
    tagline: copy(fa.products.items[id].tagline, en.products.items[id].tagline),
    summary: copy(fa.products.items[id].summary, en.products.items[id].summary),
    highlights: productHighlights[id] ?? [],
    image,
    url: "",
  }));
}

function members(): TeamMember[] {
  return memberOrder.map(({ id, department, image }) => ({
    id,
    visible: true,
    department,
    name: copy(fa.team.members[id].name, en.team.members[id].name),
    role: copy(fa.team.members[id].role, en.team.members[id].role),
    bio: copy(fa.team.members[id].bio, en.team.members[id].bio),
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
      products: copy(fa.nav.products, en.nav.products),
      team: copy(fa.nav.team, en.nav.team),
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
      baseLabel: copy(fa.hero.baseLabel, en.hero.baseLabel),
      base: copy(fa.hero.base, en.hero.base),
      image: "/templates/hero.jpg",
      detailImage: "/templates/hero-detail.jpg",
      accentImage: "/templates/hero-accent.jpg",
    },
    about: {
      image: "/templates/about.jpg",
      eyebrow: copy(fa.about.eyebrow, en.about.eyebrow),
      title: copy(fa.about.title, en.about.title),
      body: copy(fa.about.body, en.about.body),
      valueOneTitle: copy(fa.about.valueOneTitle, en.about.valueOneTitle),
      valueOneBody: copy(fa.about.valueOneBody, en.about.valueOneBody),
      valueTwoTitle: copy(fa.about.valueTwoTitle, en.about.valueTwoTitle),
      valueTwoBody: copy(fa.about.valueTwoBody, en.about.valueTwoBody),
    },
    products: {
      eyebrow: copy(fa.products.eyebrow, en.products.eyebrow),
      title: copy(fa.products.title, en.products.title),
      intro: copy(fa.products.intro, en.products.intro),
      items: products(),
    },
    team: {
      eyebrow: copy(fa.team.eyebrow, en.team.eyebrow),
      title: copy(fa.team.title, en.team.title),
      intro: copy(fa.team.intro, en.team.intro),
      departments: {
        sales: copy(fa.team.departments.sales, en.team.departments.sales),
        engineering: copy(fa.team.departments.engineering, en.team.departments.engineering),
        research: copy(fa.team.departments.research, en.team.departments.research),
        support: copy(fa.team.departments.support, en.team.departments.support),
      },
      members: members(),
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
      featuredGroup: copy(fa.projects.featuredGroup, en.projects.featuredGroup),
      recentGroup: copy(fa.projects.recentGroup, en.projects.recentGroup),
      items: projects(),
    },
    contact: {
      eyebrow: copy(fa.contact.eyebrow, en.contact.eyebrow),
      title: copy(fa.contact.title, en.contact.title),
      body: copy(fa.contact.body, en.contact.body),
      action: copy(fa.contact.action, en.contact.action),
      emailAction: copy("ارسال ایمیل", "Send email"),
      email: "",
    },
    footer: {
      note: copy(fa.footer.note, en.footer.note),
    },
    stats: [
      { id: "members", visible: true, value: "9", label: copy("اعضا", "Members") },
      { id: "depts", visible: true, value: "4", label: copy("دپارتمان", "Departments") },
      { id: "products", visible: true, value: "4", label: copy("محصول", "Products") },
      { id: "city", visible: true, value: "تهران", label: copy("شهر", "City") },
    ],
    customSections: [],
    socials: [
      { id: "linkedin", kind: "linkedin", visible: false, label: copy("لینکدین", "LinkedIn"), url: "" },
      { id: "instagram", kind: "instagram", visible: false, label: copy("اینستاگرام", "Instagram"), url: "" },
      { id: "telegram", kind: "telegram", visible: false, label: copy("تلگرام", "Telegram"), url: "" },
      { id: "youtube", kind: "youtube", visible: false, label: copy("یوتیوب", "YouTube"), url: "" },
      { id: "website", kind: "website", visible: false, label: copy("وب‌سایت", "Website"), url: "" },
    ],
  };
}
