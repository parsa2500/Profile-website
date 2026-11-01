"use client";

import Link from "next/link";
import {
  BarChart3,
  Blocks,
  Briefcase,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  FolderKanban,
  Info,
  LayoutDashboard,
  Link2,
  LogOut,
  Mail,
  Package,
  Palette,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import type {
  Copy,
  ExperienceItem,
  ProductItem,
  ProjectItem,
  SiteContent,
  SkillItem,
  TeamDepartment,
  TeamMember,
} from "@/content/types";
import { logout, updateContent, uploadImage } from "./actions";

type PanelId =
  | "overview"
  | "template"
  | "identity"
  | "hero"
  | "about"
  | "products"
  | "team"
  | "skills"
  | "experience"
  | "projects"
  | "stats"
  | "custom"
  | "links"
  | "contact"
  | "preview";

const panels: { id: PanelId; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "نمای کلی", icon: LayoutDashboard },
  { id: "template", label: "قالب", icon: Palette },
  { id: "identity", label: "هویت", icon: UserRound },
  { id: "hero", label: "معرفی", icon: Sparkles },
  { id: "about", label: "درباره", icon: Info },
  { id: "products", label: "محصولات", icon: Package },
  { id: "team", label: "تیم", icon: Users },
  { id: "skills", label: "مهارت‌ها", icon: Wrench },
  { id: "experience", label: "تجربه", icon: Briefcase },
  { id: "projects", label: "پروژه‌ها", icon: FolderKanban },
  { id: "stats", label: "آمار", icon: BarChart3 },
  { id: "custom", label: "بخش سفارشی", icon: Blocks },
  { id: "links", label: "لینک‌ها", icon: Link2 },
  { id: "contact", label: "تماس", icon: Mail },
  { id: "preview", label: "پیش‌نمایش", icon: Eye },
];

function emptyCopy(): Copy {
  return { fa: "", en: "" };
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return items;
  const next = items.slice();
  const [item] = next.splice(index, 1);
  next.splice(nextIndex, 0, item);
  return next;
}

function PanelCard({
  title,
  action,
  children,
  hint,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <section className="admin-panel grid gap-5 rounded-[1.75rem] p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-medium tracking-tight">{title}</h2>
          {hint ? <p className="mt-1 text-sm leading-7 text-muted-fg">{hint}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function BilingualField({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: Copy;
  onChange: (value: Copy) => void;
  multiline?: boolean;
}) {
  return (
    <fieldset className="grid gap-2">
      <legend className="text-sm text-muted-fg">{label}</legend>
      <div className="grid gap-2 md:grid-cols-2">
        {multiline ? (
          <>
            <textarea
              className="admin-field min-h-28"
              dir="rtl"
              rows={4}
              value={value.fa}
              aria-label={`${label} فارسی`}
              onChange={(event) => onChange({ ...value, fa: event.target.value })}
            />
            <textarea
              className="admin-field min-h-28"
              dir="ltr"
              rows={4}
              value={value.en}
              aria-label={`${label} English`}
              onChange={(event) => onChange({ ...value, en: event.target.value })}
            />
          </>
        ) : (
          <>
            <input
              className="admin-field"
              dir="rtl"
              value={value.fa}
              aria-label={`${label} فارسی`}
              onChange={(event) => onChange({ ...value, fa: event.target.value })}
            />
            <input
              className="admin-field"
              dir="ltr"
              value={value.en}
              aria-label={`${label} English`}
              onChange={(event) => onChange({ ...value, en: event.target.value })}
            />
          </>
        )}
      </div>
    </fieldset>
  );
}

function RowActions({
  index,
  length,
  onMove,
  onRemove,
}: {
  index: number;
  length: number;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      <button
        type="button"
        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl border border-line bg-card text-muted-fg disabled:opacity-40"
        disabled={index === 0}
        aria-label="بالا"
        onClick={() => onMove(-1)}
      >
        <ChevronUp className="size-4" />
      </button>
      <button
        type="button"
        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl border border-line bg-card text-muted-fg disabled:opacity-40"
        disabled={index === length - 1}
        aria-label="پایین"
        onClick={() => onMove(1)}
      >
        <ChevronDown className="size-4" />
      </button>
      <button
        type="button"
        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl border border-line bg-card text-[color:var(--admin-danger)]"
        aria-label="حذف"
        onClick={onRemove}
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-line bg-muted px-3 text-sm text-ink transition-colors hover:border-accent"
    >
      <Plus className="size-4" />
      {label}
    </button>
  );
}

function ItemCard({ children }: { children: ReactNode }) {
  return <article className="grid gap-3 rounded-2xl border border-line bg-paper/50 p-4">{children}</article>;
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadImage(formData);
    setUploading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onChange(result.path);
  }

  return (
    <label className="grid gap-2 text-sm">
      {label}
      <input
        className="admin-field"
        dir="ltr"
        value={value}
        placeholder="/templates/... or /uploads/..."
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-line bg-muted px-3 text-sm">
          <Upload className="size-4" />
          {uploading ? "در حال آپلود…" : "آپلود تصویر"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={uploading}
            onChange={(event) => {
              void onFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-10 w-16 rounded-lg border border-line object-cover" />
        ) : null}
      </div>
      {error ? <p className="text-sm text-[color:var(--admin-danger)]">{error}</p> : null}
    </label>
  );
}

export function Editor({ initial }: { initial: SiteContent }) {
  const [draft, setDraft] = useState<SiteContent>({
    ...initial,
    stats: initial.stats ?? [],
    customSections: initial.customSections ?? [],
    socials: initial.socials ?? [],
    contact: {
      ...initial.contact,
      email: initial.contact.email ?? "",
      emailAction: initial.contact.emailAction ?? emptyCopy(),
    },
  });
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const [panel, setPanel] = useState<PanelId>("overview");
  const [previewLocale, setPreviewLocale] = useState<"fa" | "en">("fa");
  const [previewKey, setPreviewKey] = useState(0);

  function patch(partial: Partial<SiteContent>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  function updateSkill(index: number, partial: Partial<SkillItem>) {
    const items = draft.skills.items.slice();
    items[index] = { ...items[index], ...partial };
    patch({ skills: { ...draft.skills, items } });
  }

  function updateExperience(index: number, partial: Partial<ExperienceItem>) {
    const items = draft.experience.items.slice();
    items[index] = { ...items[index], ...partial };
    patch({ experience: { ...draft.experience, items } });
  }

  function updateProject(index: number, partial: Partial<ProjectItem>) {
    const items = draft.projects.items.slice();
    items[index] = { ...items[index], ...partial };
    patch({ projects: { ...draft.projects, items } });
  }

  function updateProduct(index: number, partial: Partial<ProductItem>) {
    const items = draft.products.items.slice();
    items[index] = { ...items[index], ...partial };
    patch({ products: { ...draft.products, items } });
  }

  function updateMember(index: number, partial: Partial<TeamMember>) {
    const members = draft.team.members.slice();
    members[index] = { ...members[index], ...partial };
    patch({ team: { ...draft.team, members } });
  }

  async function onSave() {
    setPending(true);
    setStatus("");
    const result = await updateContent(draft);
    setPending(false);
    setStatus(result.ok ? "ذخیره شد." : result.error);
    if (result.ok) {
      setPreviewKey((current) => current + 1);
    }
  }

  const active = panels.find((item) => item.id === panel) ?? panels[0];

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-e border-line bg-[color:var(--admin-sidebar)]/90 p-4 backdrop-blur-md md:flex md:flex-col">
        <div className="mb-6 px-2">
          <p className="text-xs tracking-[0.18em] text-muted-fg uppercase">Studio</p>
          <p className="mt-1 text-lg font-medium">پنل پروفایل</p>
        </div>
        <nav className="grid gap-1">
          {panels.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              data-active={panel === id}
              onClick={() => setPanel(id)}
              className="admin-nav-item"
            >
              <Icon className="size-4 shrink-0 opacity-80" aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto grid gap-2 border-t border-line pt-4">
          <ThemeToggle toDark="حالت تیره" toLight="حالت روشن" />
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-line text-sm"
          >
            <ExternalLink className="size-4" />
            دیدن سایت
          </Link>
        </div>
      </aside>

      <div className="mx-auto grid w-full max-w-4xl content-start gap-5 px-4 py-6 md:px-6 md:py-8">
        <label className="grid gap-2 text-sm md:hidden">
          بخش
          <select
            className="admin-field"
            value={panel}
            onChange={(event) => setPanel(event.target.value as PanelId)}
          >
            {panels.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <header className="admin-panel sticky top-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] px-4 py-3 backdrop-blur-xl">
          <div>
            <p className="admin-chip mb-2 md:hidden">{active.label}</p>
            <h1 className="text-2xl font-medium tracking-tight md:text-3xl">ویرایشگر محتوا</h1>
            <p className="mt-1 text-sm text-muted-fg">ستون راست فارسی است و ستون چپ انگلیسی.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="md:hidden">
              <ThemeToggle toDark="حالت تیره" toLight="حالت روشن" />
            </div>
            <Link
              href="/"
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-3 text-sm md:hidden"
            >
              سایت
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-line px-3 text-sm"
              >
                <LogOut className="size-4" />
                خروج
              </button>
            </form>
            <button
              type="button"
              onClick={onSave}
              disabled={pending}
              className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-medium text-on-accent disabled:opacity-60"
            >
              <Save className="size-4" />
              {pending ? "در حال ذخیره" : "ذخیره"}
            </button>
          </div>
        </header>

        {status ? (
          <p
            className={`rounded-2xl px-4 py-3 text-sm ${
              status === "ذخیره شد."
                ? "border border-[color:var(--admin-success)]/30 bg-[color:var(--admin-success)]/10 text-[color:var(--admin-success)]"
                : "border border-[color:var(--admin-danger)]/30 bg-[color:var(--admin-danger)]/10 text-[color:var(--admin-danger)]"
            }`}
          >
            {status}
          </p>
        ) : null}

        {panel === "overview" ? (
          <PanelCard
            title="نمای کلی"
            hint="از نوار کناری یک بخش را باز کنید. در پایان یک‌بار ذخیره کافی است."
          >
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {(
                [
                  ["مهارت", draft.skills.items.length],
                  ["تجربه", draft.experience.items.length],
                  ["پروژه", draft.projects.items.length],
                  ["آمار", draft.stats.length],
                  ["بخش سفارشی", draft.customSections.length],
                  ["لینک فعال", draft.socials.filter((link) => link.url.trim()).length],
                ] as const
              ).map(([label, count]) => (
                <div key={label} className="rounded-2xl border border-line bg-paper/60 p-4">
                  <dt className="text-sm text-muted-fg">{label}</dt>
                  <dd className="mt-2 text-2xl font-medium tracking-tight">{count}</dd>
                </div>
              ))}
            </dl>
          </PanelCard>
        ) : null}

        {panel === "template" ? (
          <PanelCard title="قالب" hint="ظاهر کلی سایت عمومی را انتخاب کنید.">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  ["editorial", "تحریریه", "عکس کنار نام و کارت‌های نرم"],
                  ["studio", "استودیو", "هیرو تمام‌عرض و ردیف عکس"],
                  ["signal", "سیگنال", "گوشه تیز و فهرست خطی"],
                  ["cinematic", "سینمایی", "اسکرول پین‌شده و باز شدن صحنه"],
                ] as const
              ).map(([id, title, detail]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => patch({ template: id })}
                  className={`cursor-pointer rounded-2xl border px-4 py-4 text-start transition-colors ${
                    draft.template === id
                      ? "border-accent bg-muted"
                      : "border-line bg-paper/40 hover:border-accent/50"
                  }`}
                >
                  <span className="block text-base font-medium">{title}</span>
                  <span className="mt-1 block text-sm leading-6 text-muted-fg">{detail}</span>
                </button>
              ))}
            </div>
          </PanelCard>
        ) : null}

        {panel === "identity" ? (
          <PanelCard title="هویت و گیت‌هاب">
            <label className="grid gap-2 text-sm">
              نام کاربری
              <input
                className="admin-field"
                dir="ltr"
                value={draft.githubHandle}
                onChange={(event) => patch({ githubHandle: event.target.value })}
              />
            </label>
            <label className="grid gap-2 text-sm">
              لینک
              <input
                className="admin-field"
                dir="ltr"
                value={draft.githubUrl}
                onChange={(event) => patch({ githubUrl: event.target.value })}
              />
            </label>
            <BilingualField
              label="عنوان صفحه"
              value={draft.meta.title}
              onChange={(title) => patch({ meta: { ...draft.meta, title } })}
            />
            <BilingualField
              label="توضیح صفحه"
              value={draft.meta.description}
              multiline
              onChange={(description) => patch({ meta: { ...draft.meta, description } })}
            />
            <BilingualField
              label="نام در نوار"
              value={draft.nav.home}
              onChange={(home) => patch({ nav: { ...draft.nav, home } })}
            />
            <BilingualField
              label="یادداشت پاورقی"
              value={draft.footer.note}
              onChange={(note) => patch({ footer: { note } })}
            />
          </PanelCard>
        ) : null}

        {panel === "hero" ? (
          <PanelCard title="معرفی">
            {(
              [
                ["eyebrow", "برچسب"],
                ["name", "نام"],
                ["role", "نقش"],
                ["projects", "دکمه پروژه‌ها"],
                ["contact", "دکمه تماس"],
                ["locationLabel", "برچسب شهر"],
                ["location", "شهر"],
                ["focusLabel", "برچسب تمرکز"],
                ["focus", "تمرکز"],
                ["baseLabel", "برچسب پایگاه"],
                ["base", "پایگاه"],
              ] as const
            ).map(([key, label]) => (
              <BilingualField
                key={key}
                label={label}
                value={draft.hero[key]}
                onChange={(value) => patch({ hero: { ...draft.hero, [key]: value } })}
              />
            ))}
            <BilingualField
              label="خلاصه"
              multiline
              value={draft.hero.summary}
              onChange={(summary) => patch({ hero: { ...draft.hero, summary } })}
            />
            <ImageField
              label="عکس اصلی"
              value={draft.hero.image}
              onChange={(image) => patch({ hero: { ...draft.hero, image } })}
            />
            <ImageField
              label="عکس کوچک بالا"
              value={draft.hero.detailImage}
              onChange={(detailImage) => patch({ hero: { ...draft.hero, detailImage } })}
            />
            <ImageField
              label="عکس کوچک پایین"
              value={draft.hero.accentImage}
              onChange={(accentImage) => patch({ hero: { ...draft.hero, accentImage } })}
            />
          </PanelCard>
        ) : null}

        {panel === "about" ? (
          <PanelCard title="درباره و ناوبری">
            {(
              [
                ["about", "درباره"],
                ["products", "محصولات"],
                ["team", "تیم"],
                ["skills", "مهارت‌ها"],
                ["experience", "تجربه"],
                ["projects", "پروژه‌ها"],
                ["contact", "تماس"],
              ] as const
            ).map(([key, label]) => (
              <BilingualField
                key={key}
                label={`منو: ${label}`}
                value={draft.nav[key]}
                onChange={(value) => patch({ nav: { ...draft.nav, [key]: value } })}
              />
            ))}
            <ImageField
              label="عکس درباره"
              value={draft.about.image}
              onChange={(image) => patch({ about: { ...draft.about, image } })}
            />
            <BilingualField
              label="عنوان درباره"
              value={draft.about.title}
              onChange={(title) => patch({ about: { ...draft.about, title } })}
            />
            <BilingualField
              label="متن درباره"
              multiline
              value={draft.about.body}
              onChange={(body) => patch({ about: { ...draft.about, body } })}
            />
            <BilingualField
              label="عنوان ارزش ۱"
              value={draft.about.valueOneTitle}
              onChange={(valueOneTitle) => patch({ about: { ...draft.about, valueOneTitle } })}
            />
            <BilingualField
              label="متن ارزش ۱"
              multiline
              value={draft.about.valueOneBody}
              onChange={(valueOneBody) => patch({ about: { ...draft.about, valueOneBody } })}
            />
            <BilingualField
              label="عنوان ارزش ۲"
              value={draft.about.valueTwoTitle}
              onChange={(valueTwoTitle) => patch({ about: { ...draft.about, valueTwoTitle } })}
            />
            <BilingualField
              label="متن ارزش ۲"
              multiline
              value={draft.about.valueTwoBody}
              onChange={(valueTwoBody) => patch({ about: { ...draft.about, valueTwoBody } })}
            />
          </PanelCard>
        ) : null}

        {panel === "products" ? (
          <PanelCard
            title="محصولات"
            action={
              <AddButton
                label="افزودن محصول"
                onClick={() =>
                  patch({
                    products: {
                      ...draft.products,
                      items: [
                        ...draft.products.items,
                        {
                          id: `product-${crypto.randomUUID()}`,
                          visible: true,
                          name: emptyCopy(),
                          tagline: emptyCopy(),
                          summary: emptyCopy(),
                          highlights: [emptyCopy()],
                          image: "",
                          url: "",
                        },
                      ],
                    },
                  })
                }
              />
            }
          >
            <BilingualField
              label="عنوان بخش"
              value={draft.products.title}
              onChange={(title) => patch({ products: { ...draft.products, title } })}
            />
            <BilingualField
              label="مقدمه"
              multiline
              value={draft.products.intro}
              onChange={(intro) => patch({ products: { ...draft.products, intro } })}
            />
            {draft.products.items.map((item, index) => (
              <ItemCard key={item.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.visible}
                      onChange={(event) => updateProduct(index, { visible: event.target.checked })}
                    />
                    نمایش
                  </label>
                  <RowActions
                    index={index}
                    length={draft.products.items.length}
                    onMove={(direction) =>
                      patch({
                        products: {
                          ...draft.products,
                          items: moveItem(draft.products.items, index, direction),
                        },
                      })
                    }
                    onRemove={() =>
                      patch({
                        products: {
                          ...draft.products,
                          items: draft.products.items.filter((_, itemIndex) => itemIndex !== index),
                        },
                      })
                    }
                  />
                </div>
                <label className="grid gap-2 text-sm">
                  لینک
                  <input
                    className="admin-field"
                    dir="ltr"
                    value={item.url}
                    onChange={(event) => updateProduct(index, { url: event.target.value })}
                  />
                </label>
                <ImageField
                  label="تصویر"
                  value={item.image}
                  onChange={(image) => updateProduct(index, { image })}
                />
                <BilingualField
                  label="نام"
                  value={item.name}
                  onChange={(name) => updateProduct(index, { name })}
                />
                <BilingualField
                  label="شعار"
                  value={item.tagline}
                  onChange={(tagline) => updateProduct(index, { tagline })}
                />
                <BilingualField
                  label="خلاصه"
                  multiline
                  value={item.summary}
                  onChange={(summary) => updateProduct(index, { summary })}
                />
                {item.highlights.map((highlight, highlightIndex) => (
                  <div key={`${item.id}-highlight-${highlightIndex}`} className="grid gap-2">
                    <BilingualField
                      label={`نکته برجسته ${highlightIndex + 1}`}
                      value={highlight}
                      onChange={(nextHighlight) => {
                        const highlights = item.highlights.slice();
                        highlights[highlightIndex] = nextHighlight;
                        updateProduct(index, { highlights });
                      }}
                    />
                    <button
                      type="button"
                      className="cursor-pointer justify-self-start text-sm text-[color:var(--admin-danger)]"
                      onClick={() =>
                        updateProduct(index, {
                          highlights: item.highlights.filter((_, current) => current !== highlightIndex),
                        })
                      }
                    >
                      حذف نکته
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="cursor-pointer justify-self-start text-sm text-accent"
                  onClick={() =>
                    updateProduct(index, { highlights: [...item.highlights, emptyCopy()] })
                  }
                >
                  افزودن نکته برجسته
                </button>
              </ItemCard>
            ))}
          </PanelCard>
        ) : null}

        {panel === "team" ? (
          <PanelCard
            title="تیم"
            action={
              <AddButton
                label="افزودن عضو"
                onClick={() =>
                  patch({
                    team: {
                      ...draft.team,
                      members: [
                        ...draft.team.members,
                        {
                          id: `member-${crypto.randomUUID()}`,
                          visible: true,
                          department: "engineering",
                          name: emptyCopy(),
                          role: emptyCopy(),
                          bio: emptyCopy(),
                          image: "",
                        },
                      ],
                    },
                  })
                }
              />
            }
          >
            <BilingualField
              label="عنوان بخش"
              value={draft.team.title}
              onChange={(title) => patch({ team: { ...draft.team, title } })}
            />
            <BilingualField
              label="مقدمه"
              multiline
              value={draft.team.intro}
              onChange={(intro) => patch({ team: { ...draft.team, intro } })}
            />
            {(
              [
                ["sales", "فروش"],
                ["engineering", "مهندسی"],
                ["research", "تحقیق و توسعه"],
                ["support", "پشتیبانی"],
              ] as const
            ).map(([key, label]) => (
              <BilingualField
                key={key}
                label={`برچسب بخش: ${label}`}
                value={draft.team.departments[key]}
                onChange={(value) =>
                  patch({
                    team: {
                      ...draft.team,
                      departments: { ...draft.team.departments, [key]: value },
                    },
                  })
                }
              />
            ))}
            {draft.team.members.map((item, index) => (
              <ItemCard key={item.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.visible}
                      onChange={(event) => updateMember(index, { visible: event.target.checked })}
                    />
                    نمایش
                  </label>
                  <RowActions
                    index={index}
                    length={draft.team.members.length}
                    onMove={(direction) =>
                      patch({
                        team: {
                          ...draft.team,
                          members: moveItem(draft.team.members, index, direction),
                        },
                      })
                    }
                    onRemove={() =>
                      patch({
                        team: {
                          ...draft.team,
                          members: draft.team.members.filter((_, itemIndex) => itemIndex !== index),
                        },
                      })
                    }
                  />
                </div>
                <label className="grid gap-2 text-sm">
                  بخش
                  <select
                    className="admin-field"
                    value={item.department}
                    onChange={(event) =>
                      updateMember(index, {
                        department: event.target.value as TeamDepartment,
                      })
                    }
                  >
                    <option value="sales">فروش</option>
                    <option value="engineering">مهندسی</option>
                    <option value="research">تحقیق و توسعه</option>
                    <option value="support">پشتیبانی</option>
                  </select>
                </label>
                <ImageField
                  label="تصویر"
                  value={item.image}
                  onChange={(image) => updateMember(index, { image })}
                />
                <BilingualField
                  label="نام"
                  value={item.name}
                  onChange={(name) => updateMember(index, { name })}
                />
                <BilingualField
                  label="نقش"
                  value={item.role}
                  onChange={(role) => updateMember(index, { role })}
                />
                <BilingualField
                  label="بیو"
                  multiline
                  value={item.bio}
                  onChange={(bio) => updateMember(index, { bio })}
                />
              </ItemCard>
            ))}
          </PanelCard>
        ) : null}

        {panel === "skills" ? (
          <PanelCard
            title="مهارت‌ها"
            action={
              <AddButton
                label="افزودن مهارت"
                onClick={() =>
                  patch({
                    skills: {
                      ...draft.skills,
                      items: [
                        ...draft.skills.items,
                        {
                          id: `skill-${crypto.randomUUID()}`,
                          visible: true,
                          span: "normal",
                          name: emptyCopy(),
                          detail: emptyCopy(),
                        },
                      ],
                    },
                  })
                }
              />
            }
          >
            <BilingualField
              label="عنوان بخش"
              value={draft.skills.title}
              onChange={(title) => patch({ skills: { ...draft.skills, title } })}
            />
            {draft.skills.items.map((item, index) => (
              <ItemCard key={item.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.visible}
                      onChange={(event) => updateSkill(index, { visible: event.target.checked })}
                    />
                    نمایش
                  </label>
                  <RowActions
                    index={index}
                    length={draft.skills.items.length}
                    onMove={(direction) =>
                      patch({
                        skills: {
                          ...draft.skills,
                          items: moveItem(draft.skills.items, index, direction),
                        },
                      })
                    }
                    onRemove={() =>
                      patch({
                        skills: {
                          ...draft.skills,
                          items: draft.skills.items.filter((_, itemIndex) => itemIndex !== index),
                        },
                      })
                    }
                  />
                </div>
                <label className="grid gap-2 text-sm">
                  اندازه کارت
                  <select
                    className="admin-field"
                    value={item.span}
                    onChange={(event) =>
                      updateSkill(index, { span: event.target.value as SkillItem["span"] })
                    }
                  >
                    <option value="feature">بزرگ</option>
                    <option value="wide">پهن</option>
                    <option value="normal">معمولی</option>
                  </select>
                </label>
                <BilingualField
                  label="نام"
                  value={item.name}
                  onChange={(name) => updateSkill(index, { name })}
                />
                <BilingualField
                  label="توضیح"
                  value={item.detail}
                  onChange={(detail) => updateSkill(index, { detail })}
                />
              </ItemCard>
            ))}
          </PanelCard>
        ) : null}

        {panel === "experience" ? (
          <PanelCard
            title="تجربه"
            action={
              <AddButton
                label="افزودن تجربه"
                onClick={() =>
                  patch({
                    experience: {
                      ...draft.experience,
                      items: [
                        ...draft.experience.items,
                        {
                          id: `experience-${crypto.randomUUID()}`,
                          visible: true,
                          role: emptyCopy(),
                          place: emptyCopy(),
                          period: emptyCopy(),
                          points: [emptyCopy()],
                        },
                      ],
                    },
                  })
                }
              />
            }
          >
            <BilingualField
              label="عنوان بخش"
              value={draft.experience.title}
              onChange={(title) => patch({ experience: { ...draft.experience, title } })}
            />
            {draft.experience.items.map((item, index) => (
              <ItemCard key={item.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.visible}
                      onChange={(event) =>
                        updateExperience(index, { visible: event.target.checked })
                      }
                    />
                    نمایش
                  </label>
                  <RowActions
                    index={index}
                    length={draft.experience.items.length}
                    onMove={(direction) =>
                      patch({
                        experience: {
                          ...draft.experience,
                          items: moveItem(draft.experience.items, index, direction),
                        },
                      })
                    }
                    onRemove={() =>
                      patch({
                        experience: {
                          ...draft.experience,
                          items: draft.experience.items.filter(
                            (_, itemIndex) => itemIndex !== index,
                          ),
                        },
                      })
                    }
                  />
                </div>
                <BilingualField
                  label="نقش"
                  value={item.role}
                  onChange={(role) => updateExperience(index, { role })}
                />
                <BilingualField
                  label="مکان"
                  value={item.place}
                  onChange={(place) => updateExperience(index, { place })}
                />
                <BilingualField
                  label="بازه"
                  value={item.period}
                  onChange={(period) => updateExperience(index, { period })}
                />
                {item.points.map((point, pointIndex) => (
                  <div key={`${item.id}-point-${pointIndex}`} className="grid gap-2">
                    <BilingualField
                      label={`نکته ${pointIndex + 1}`}
                      value={point}
                      onChange={(nextPoint) => {
                        const points = item.points.slice();
                        points[pointIndex] = nextPoint;
                        updateExperience(index, { points });
                      }}
                    />
                    <button
                      type="button"
                      className="cursor-pointer justify-self-start text-sm text-[color:var(--admin-danger)]"
                      onClick={() =>
                        updateExperience(index, {
                          points: item.points.filter((_, current) => current !== pointIndex),
                        })
                      }
                    >
                      حذف نکته
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="cursor-pointer justify-self-start text-sm text-accent"
                  onClick={() => updateExperience(index, { points: [...item.points, emptyCopy()] })}
                >
                  افزودن نکته
                </button>
              </ItemCard>
            ))}
          </PanelCard>
        ) : null}

        {panel === "projects" ? (
          <PanelCard
            title="پروژه‌ها"
            action={
              <AddButton
                label="افزودن پروژه"
                onClick={() =>
                  patch({
                    projects: {
                      ...draft.projects,
                      items: [
                        ...draft.projects.items,
                        {
                          id: `project-${crypto.randomUUID()}`,
                          visible: true,
                          group: "recent",
                          title: emptyCopy(),
                          meta: emptyCopy(),
                          summary: emptyCopy(),
                          stack: [],
                          highlights: [emptyCopy()],
                          url: "",
                          image: "/templates/html-site.jpg",
                        },
                      ],
                    },
                  })
                }
              />
            }
          >
            <BilingualField
              label="عنوان بخش"
              value={draft.projects.title}
              onChange={(title) => patch({ projects: { ...draft.projects, title } })}
            />
            <BilingualField
              label="مقدمه"
              multiline
              value={draft.projects.intro}
              onChange={(intro) => patch({ projects: { ...draft.projects, intro } })}
            />
            <BilingualField
              label="عنوان گروه ویژه"
              value={draft.projects.featuredGroup}
              onChange={(featuredGroup) => patch({ projects: { ...draft.projects, featuredGroup } })}
            />
            <BilingualField
              label="عنوان کارهای اخیر"
              value={draft.projects.recentGroup}
              onChange={(recentGroup) => patch({ projects: { ...draft.projects, recentGroup } })}
            />
            {draft.projects.items.map((item, index) => (
              <ItemCard key={item.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.visible}
                      onChange={(event) => updateProject(index, { visible: event.target.checked })}
                    />
                    نمایش
                  </label>
                  <RowActions
                    index={index}
                    length={draft.projects.items.length}
                    onMove={(direction) =>
                      patch({
                        projects: {
                          ...draft.projects,
                          items: moveItem(draft.projects.items, index, direction),
                        },
                      })
                    }
                    onRemove={() =>
                      patch({
                        projects: {
                          ...draft.projects,
                          items: draft.projects.items.filter((_, itemIndex) => itemIndex !== index),
                        },
                      })
                    }
                  />
                </div>
                <label className="grid gap-2 text-sm">
                  گروه
                  <select
                    className="admin-field"
                    value={item.group}
                    onChange={(event) =>
                      updateProject(index, { group: event.target.value as ProjectItem["group"] })
                    }
                  >
                    <option value="featured">ویژه</option>
                    <option value="recent">اخیر</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm">
                  لینک
                  <input
                    className="admin-field"
                    dir="ltr"
                    value={item.url}
                    onChange={(event) => updateProject(index, { url: event.target.value })}
                  />
                </label>
                <ImageField
                  label="تصویر"
                  value={item.image}
                  onChange={(image) => updateProject(index, { image })}
                />
                <BilingualField
                  label="عنوان"
                  value={item.title}
                  onChange={(title) => updateProject(index, { title })}
                />
                <BilingualField
                  label="متا"
                  value={item.meta}
                  onChange={(meta) => updateProject(index, { meta })}
                />
                <BilingualField
                  label="خلاصه"
                  multiline
                  value={item.summary}
                  onChange={(summary) => updateProject(index, { summary })}
                />
                <label className="grid gap-2 text-sm">
                  تکنولوژی‌ها (با ویرگول)
                  <input
                    className="admin-field"
                    dir="ltr"
                    value={(item.stack ?? []).join(", ")}
                    placeholder="Python, React"
                    onChange={(event) =>
                      updateProject(index, {
                        stack: event.target.value
                          .split(",")
                          .map((entry) => entry.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </label>
                {(item.highlights ?? []).map((highlight, highlightIndex) => (
                  <div key={`${item.id}-highlight-${highlightIndex}`} className="grid gap-2">
                    <BilingualField
                      label={`نکته برجسته ${highlightIndex + 1}`}
                      value={highlight}
                      onChange={(nextHighlight) => {
                        const highlights = (item.highlights ?? []).slice();
                        highlights[highlightIndex] = nextHighlight;
                        updateProject(index, { highlights });
                      }}
                    />
                    <button
                      type="button"
                      className="cursor-pointer justify-self-start text-sm text-[color:var(--admin-danger)]"
                      onClick={() =>
                        updateProject(index, {
                          highlights: (item.highlights ?? []).filter(
                            (_, current) => current !== highlightIndex,
                          ),
                        })
                      }
                    >
                      حذف نکته
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="cursor-pointer justify-self-start text-sm text-accent"
                  onClick={() =>
                    updateProject(index, {
                      highlights: [...(item.highlights ?? []), emptyCopy()],
                    })
                  }
                >
                  افزودن نکته برجسته
                </button>
              </ItemCard>
            ))}
          </PanelCard>
        ) : null}

        {panel === "stats" ? (
          <PanelCard
            title="آمار"
            hint="عدد و برچسب فارسی/انگلیسی. فقط ردیف‌های نمایش‌دار روی سایت می‌آیند."
            action={
              <AddButton
                label="افزودن آمار"
                onClick={() =>
                  patch({
                    stats: [
                      ...draft.stats,
                      {
                        id: `stat-${crypto.randomUUID()}`,
                        visible: true,
                        value: "۱",
                        label: emptyCopy(),
                      },
                    ],
                  })
                }
              />
            }
          >
            {draft.stats.map((item, index) => (
              <ItemCard key={item.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.visible}
                      onChange={(event) => {
                        const stats = draft.stats.slice();
                        stats[index] = { ...item, visible: event.target.checked };
                        patch({ stats });
                      }}
                    />
                    نمایش
                  </label>
                  <RowActions
                    index={index}
                    length={draft.stats.length}
                    onMove={(direction) => patch({ stats: moveItem(draft.stats, index, direction) })}
                    onRemove={() =>
                      patch({
                        stats: draft.stats.filter((_, itemIndex) => itemIndex !== index),
                      })
                    }
                  />
                </div>
                <label className="grid gap-2 text-sm">
                  عدد
                  <input
                    className="admin-field"
                    value={item.value}
                    onChange={(event) => {
                      const stats = draft.stats.slice();
                      stats[index] = { ...item, value: event.target.value };
                      patch({ stats });
                    }}
                  />
                </label>
                <BilingualField
                  label="برچسب"
                  value={item.label}
                  onChange={(label) => {
                    const stats = draft.stats.slice();
                    stats[index] = { ...item, label };
                    patch({ stats });
                  }}
                />
              </ItemCard>
            ))}
          </PanelCard>
        ) : null}

        {panel === "custom" ? (
          <PanelCard
            title="بخش سفارشی"
            hint="بعد از پروژه‌ها روی سایت دیده می‌شود."
            action={
              <AddButton
                label="افزودن بخش"
                onClick={() =>
                  patch({
                    customSections: [
                      ...draft.customSections,
                      {
                        id: `section-${crypto.randomUUID()}`,
                        visible: true,
                        title: emptyCopy(),
                        body: emptyCopy(),
                        image: "",
                      },
                    ],
                  })
                }
              />
            }
          >
            {draft.customSections.length === 0 ? (
              <p className="text-sm text-muted-fg">هنوز بخش سفارشی ندارید.</p>
            ) : null}
            {draft.customSections.map((item, index) => (
              <ItemCard key={item.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.visible}
                      onChange={(event) => {
                        const customSections = draft.customSections.slice();
                        customSections[index] = { ...item, visible: event.target.checked };
                        patch({ customSections });
                      }}
                    />
                    نمایش
                  </label>
                  <RowActions
                    index={index}
                    length={draft.customSections.length}
                    onMove={(direction) =>
                      patch({
                        customSections: moveItem(draft.customSections, index, direction),
                      })
                    }
                    onRemove={() =>
                      patch({
                        customSections: draft.customSections.filter(
                          (_, itemIndex) => itemIndex !== index,
                        ),
                      })
                    }
                  />
                </div>
                <BilingualField
                  label="عنوان"
                  value={item.title}
                  onChange={(title) => {
                    const customSections = draft.customSections.slice();
                    customSections[index] = { ...item, title };
                    patch({ customSections });
                  }}
                />
                <BilingualField
                  label="متن"
                  multiline
                  value={item.body}
                  onChange={(body) => {
                    const customSections = draft.customSections.slice();
                    customSections[index] = { ...item, body };
                    patch({ customSections });
                  }}
                />
                <ImageField
                  label="تصویر"
                  value={item.image}
                  onChange={(image) => {
                    const customSections = draft.customSections.slice();
                    customSections[index] = { ...item, image };
                    patch({ customSections });
                  }}
                />
              </ItemCard>
            ))}
          </PanelCard>
        ) : null}

        {panel === "links" ? (
          <PanelCard
            title="لینک‌ها"
            hint="فقط لینک‌هایی که آدرس دارند روی سایت دیده می‌شوند."
            action={
              <AddButton
                label="افزودن لینک شخصی"
                onClick={() =>
                  patch({
                    socials: [
                      ...draft.socials,
                      {
                        id: `link-${crypto.randomUUID()}`,
                        kind: "custom",
                        visible: true,
                        label: emptyCopy(),
                        url: "",
                      },
                    ],
                  })
                }
              />
            }
          >
            {draft.socials.map((item, index) => (
              <ItemCard key={item.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.visible}
                      onChange={(event) => {
                        const socials = draft.socials.slice();
                        socials[index] = { ...item, visible: event.target.checked };
                        patch({ socials });
                      }}
                    />
                    نمایش
                  </label>
                  <RowActions
                    index={index}
                    length={draft.socials.length}
                    onMove={(direction) =>
                      patch({ socials: moveItem(draft.socials, index, direction) })
                    }
                    onRemove={() =>
                      patch({
                        socials: draft.socials.filter((_, itemIndex) => itemIndex !== index),
                      })
                    }
                  />
                </div>
                <label className="grid gap-2 text-sm">
                  نوع
                  <select
                    className="admin-field"
                    value={item.kind}
                    onChange={(event) => {
                      const socials = draft.socials.slice();
                      socials[index] = {
                        ...item,
                        kind: event.target.value as typeof item.kind,
                      };
                      patch({ socials });
                    }}
                  >
                    <option value="linkedin">لینکدین</option>
                    <option value="instagram">اینستاگرام</option>
                    <option value="telegram">تلگرام</option>
                    <option value="youtube">یوتیوب</option>
                    <option value="website">وب‌سایت</option>
                    <option value="custom">شخصی</option>
                  </select>
                </label>
                <BilingualField
                  label="نام"
                  value={item.label}
                  onChange={(label) => {
                    const socials = draft.socials.slice();
                    socials[index] = { ...item, label };
                    patch({ socials });
                  }}
                />
                <label className="grid gap-2 text-sm">
                  آدرس
                  <input
                    className="admin-field"
                    dir="ltr"
                    value={item.url}
                    placeholder="https://"
                    onChange={(event) => {
                      const socials = draft.socials.slice();
                      socials[index] = { ...item, url: event.target.value };
                      patch({ socials });
                    }}
                  />
                </label>
              </ItemCard>
            ))}
          </PanelCard>
        ) : null}

        {panel === "contact" ? (
          <PanelCard
            title="تماس"
            hint="ایمیل را پر کنید تا دکمه ارسال ایمیل روی سایت نمایش داده شود. لینک‌های خالی سوشال مخفی می‌مانند."
          >
            <BilingualField
              label="عنوان"
              value={draft.contact.title}
              onChange={(title) => patch({ contact: { ...draft.contact, title } })}
            />
            <BilingualField
              label="متن"
              multiline
              value={draft.contact.body}
              onChange={(body) => patch({ contact: { ...draft.contact, body } })}
            />
            <label className="grid gap-2 text-sm">
              ایمیل
              <input
                className="admin-field"
                dir="ltr"
                type="email"
                value={draft.contact.email ?? ""}
                placeholder="you@example.com"
                onChange={(event) =>
                  patch({ contact: { ...draft.contact, email: event.target.value } })
                }
              />
            </label>
            <BilingualField
              label="دکمه ایمیل"
              value={draft.contact.emailAction}
              onChange={(emailAction) => patch({ contact: { ...draft.contact, emailAction } })}
            />
            <BilingualField
              label="دکمه گیت‌هاب"
              value={draft.contact.action}
              onChange={(action) => patch({ contact: { ...draft.contact, action } })}
            />
          </PanelCard>
        ) : null}

        {panel === "preview" ? (
          <PanelCard
            title="پیش‌نمایش سایت"
            hint="بعد از ذخیره، پیش‌نمایش به‌روز می‌شود. تغییرات ذخیره‌نشده اینجا دیده نمی‌شوند."
            action={
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`inline-flex h-10 cursor-pointer items-center rounded-full border px-3 text-sm ${
                    previewLocale === "fa" ? "border-accent bg-accent text-on-accent" : "border-line"
                  }`}
                  onClick={() => setPreviewLocale("fa")}
                >
                  فارسی
                </button>
                <button
                  type="button"
                  className={`inline-flex h-10 cursor-pointer items-center rounded-full border px-3 text-sm ${
                    previewLocale === "en" ? "border-accent bg-accent text-on-accent" : "border-line"
                  }`}
                  onClick={() => setPreviewLocale("en")}
                >
                  English
                </button>
              </div>
            }
          >
            <iframe
              key={`${previewLocale}-${previewKey}`}
              title="Site preview"
              src={previewLocale === "fa" ? "/" : "/en"}
              className="h-[70vh] w-full rounded-2xl border border-line bg-paper"
            />
          </PanelCard>
        ) : null}
      </div>
    </div>
  );
}
