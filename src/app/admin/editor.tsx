"use client";

import Link from "next/link";
import { useState } from "react";
import { logout, updateContent } from "./actions";
import type { Copy, ExperienceItem, ProjectItem, SiteContent, SkillItem } from "@/content/types";

const fieldClass =
  "w-full rounded-2xl border border-line bg-paper px-3 py-2 text-sm text-ink";

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
  const shared = {
    className: fieldClass,
  };

  return (
    <fieldset className="grid gap-2">
      <legend className="text-sm text-muted-fg">{label}</legend>
      <div className="grid gap-2 md:grid-cols-2">
        {multiline ? (
          <>
            <textarea
              {...shared}
              dir="rtl"
              rows={4}
              value={value.fa}
              aria-label={`${label} فارسی`}
              onChange={(event) => onChange({ ...value, fa: event.target.value })}
            />
            <textarea
              {...shared}
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
              {...shared}
              dir="rtl"
              value={value.fa}
              aria-label={`${label} فارسی`}
              onChange={(event) => onChange({ ...value, fa: event.target.value })}
            />
            <input
              {...shared}
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
    <div className="flex flex-wrap gap-2">
      <button type="button" className="cursor-pointer text-sm" disabled={index === 0} onClick={() => onMove(-1)}>
        بالا
      </button>
      <button
        type="button"
        className="cursor-pointer text-sm"
        disabled={index === length - 1}
        onClick={() => onMove(1)}
      >
        پایین
      </button>
      <button type="button" className="cursor-pointer text-sm text-red-600" onClick={onRemove}>
        حذف
      </button>
    </div>
  );
}

export function Editor({ initial }: { initial: SiteContent }) {
  const [draft, setDraft] = useState(initial);
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const [panel, setPanel] = useState<
    | "overview"
    | "template"
    | "identity"
    | "hero"
    | "about"
    | "skills"
    | "experience"
    | "projects"
    | "stats"
    | "custom"
    | "links"
    | "contact"
  >("overview");

  const panels = [
    ["overview", "نمای کلی"],
    ["template", "قالب"],
    ["identity", "هویت"],
    ["hero", "معرفی"],
    ["about", "درباره"],
    ["skills", "مهارت‌ها"],
    ["experience", "تجربه"],
    ["projects", "پروژه‌ها"],
    ["stats", "آمار"],
    ["custom", "بخش سفارشی"],
    ["links", "لینک‌ها"],
    ["contact", "تماس"],
  ] as const;

  function patch(partial: Partial<SiteContent>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  async function onSave() {
    setPending(true);
    setStatus("");
    const result = await updateContent(draft);
    setPending(false);
    setStatus(result.ok ? "ذخیره شد." : result.error);
  }

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 overflow-y-auto border-e border-line bg-card p-4 md:block">
        <p className="mb-4 text-sm font-medium">بخش‌ها</p>
        <nav className="grid gap-1">
          {panels.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setPanel(id)}
              className={`cursor-pointer rounded-xl px-3 py-2 text-start text-sm ${
                panel === id ? "bg-muted text-ink" : "text-muted-fg"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>
      <div className="mx-auto grid w-full max-w-4xl gap-6 px-5 py-8">
        <label className="grid gap-2 text-sm md:hidden">
          بخش
          <select
            className={fieldClass}
            value={panel}
            onChange={(event) => setPanel(event.target.value as typeof panel)}
          >
            {panels.map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-medium">پنل پروفایل</h1>
          <p className="mt-2 text-sm text-muted-fg">ستون راست فارسی است و ستون چپ انگلیسی.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm">
            دیدن سایت
          </Link>
          <form action={logout}>
            <button type="submit" className="cursor-pointer text-sm">
              خروج
            </button>
          </form>
          <button
            type="button"
            onClick={onSave}
            disabled={pending}
            className="h-10 cursor-pointer rounded-full bg-accent px-4 text-sm text-on-accent disabled:opacity-60"
          >
            {pending ? "در حال ذخیره" : "ذخیره"}
          </button>
        </div>
      </header>
      {status ? <p className="text-sm">{status}</p> : null}

      {panel === "overview" ? (
        <section className="grid gap-4 rounded-3xl border border-line bg-card p-5">
          <h2 className="text-xl">نمای کلی</h2>
          <p className="text-sm leading-7 text-muted-fg">
            از نوار کناری یک بخش را باز کنید. فارسی سمت راست است و انگلیسی سمت چپ. در پایان ذخیره را بزنید.
          </p>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(
              [
                ["مهارت", draft.skills.items.length],
                ["تجربه", draft.experience.items.length],
                ["پروژه", draft.projects.items.length],
                ["آمار", draft.stats.length],
                ["بخش سفارشی", draft.customSections.length],
                ["لینک", draft.socials.filter((link) => link.url.trim()).length],
              ] as const
            ).map(([label, count]) => (
              <div key={label} className="rounded-2xl border border-line p-4">
                <dt className="text-sm text-muted-fg">{label}</dt>
                <dd className="mt-2 text-2xl">{count}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section className={panel === "template" ? "grid gap-3 rounded-3xl border border-line bg-card p-5" : "hidden"}>
        <h2 className="text-xl">قالب</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {(
            [
              ["editorial", "تحریریه", "عکس کنار نام و کارت‌های نرم"],
              ["studio", "استودیو", "هیرو تمام‌عرض و ردیف عکس"],
              ["signal", "سیگنال", "گوشه تیز و فهرست خطی"],
            ] as const
          ).map(([id, title, detail]) => (
            <button
              key={id}
              type="button"
              onClick={() => patch({ template: id })}
              className={`cursor-pointer rounded-2xl border px-4 py-3 text-start ${
                draft.template === id ? "border-accent bg-muted" : "border-line"
              }`}
            >
              <span className="block text-base">{title}</span>
              <span className="mt-1 block text-sm text-muted-fg">{detail}</span>
            </button>
          ))}
        </div>
      </section>

      <section className={panel === "identity" ? "grid gap-4 rounded-3xl border border-line bg-card p-5" : "hidden"}>
        <h2 className="text-xl">هویت و گیت‌هاب</h2>
        <label className="grid gap-2 text-sm">
          نام کاربری
          <input
            className={fieldClass}
            dir="ltr"
            value={draft.githubHandle}
            onChange={(event) => patch({ githubHandle: event.target.value })}
          />
        </label>
        <label className="grid gap-2 text-sm">
          لینک
          <input
            className={fieldClass}
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
      </section>

      <section className={panel === "hero" ? "grid gap-4 rounded-3xl border border-line bg-card p-5" : "hidden"}>
        <h2 className="text-xl">معرفی</h2>
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
            ["studyLabel", "برچسب تحصیلات"],
            ["study", "تحصیلات"],
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
        <label className="grid gap-2 text-sm">
          عکس اصلی
          <input
            className={fieldClass}
            dir="ltr"
            value={draft.hero.image}
            onChange={(event) => patch({ hero: { ...draft.hero, image: event.target.value } })}
          />
        </label>
        <label className="grid gap-2 text-sm">
          عکس کوچک بالا
          <input
            className={fieldClass}
            dir="ltr"
            value={draft.hero.detailImage}
            onChange={(event) =>
              patch({ hero: { ...draft.hero, detailImage: event.target.value } })
            }
          />
        </label>
        <label className="grid gap-2 text-sm">
          عکس کوچک پایین
          <input
            className={fieldClass}
            dir="ltr"
            value={draft.hero.accentImage}
            onChange={(event) =>
              patch({ hero: { ...draft.hero, accentImage: event.target.value } })
            }
          />
        </label>
      </section>

      <section className={panel === "about" ? "grid gap-4 rounded-3xl border border-line bg-card p-5" : "hidden"}>
        <h2 className="text-xl">درباره و ناوبری</h2>
        {(
          [
            ["about", "درباره"],
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
        <label className="grid gap-2 text-sm">
          عکس درباره
          <input
            className={fieldClass}
            dir="ltr"
            value={draft.about.image}
            onChange={(event) => patch({ about: { ...draft.about, image: event.target.value } })}
          />
        </label>
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
          label="عنوان تحصیلات"
          value={draft.about.educationTitle}
          onChange={(educationTitle) => patch({ about: { ...draft.about, educationTitle } })}
        />
        <BilingualField
          label="متن تحصیلات"
          multiline
          value={draft.about.educationBody}
          onChange={(educationBody) => patch({ about: { ...draft.about, educationBody } })}
        />
        <BilingualField
          label="عنوان انگلیسی"
          value={draft.about.englishTitle}
          onChange={(englishTitle) => patch({ about: { ...draft.about, englishTitle } })}
        />
        <BilingualField
          label="متن انگلیسی"
          multiline
          value={draft.about.englishBody}
          onChange={(englishBody) => patch({ about: { ...draft.about, englishBody } })}
        />
      </section>

      <section className={panel === "skills" ? "grid gap-4 rounded-3xl border border-line bg-card p-5" : "hidden"}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl">مهارت‌ها</h2>
          <button
            type="button"
            className="cursor-pointer text-sm"
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
          >
            افزودن مهارت
          </button>
        </div>
        <BilingualField
          label="عنوان بخش"
          value={draft.skills.title}
          onChange={(title) => patch({ skills: { ...draft.skills, title } })}
        />
        {draft.skills.items.map((item, index) => (
          <article key={item.id} className="grid gap-3 rounded-2xl border border-line p-4">
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
                    skills: { ...draft.skills, items: moveItem(draft.skills.items, index, direction) },
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
                className={fieldClass}
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
          </article>
        ))}
      </section>

      <section className={panel === "experience" ? "grid gap-4 rounded-3xl border border-line bg-card p-5" : "hidden"}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl">تجربه</h2>
          <button
            type="button"
            className="cursor-pointer text-sm"
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
          >
            افزودن تجربه
          </button>
        </div>
        <BilingualField
          label="عنوان بخش"
          value={draft.experience.title}
          onChange={(title) => patch({ experience: { ...draft.experience, title } })}
        />
        {draft.experience.items.map((item, index) => (
          <article key={item.id} className="grid gap-3 rounded-2xl border border-line p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={item.visible}
                  onChange={(event) => updateExperience(index, { visible: event.target.checked })}
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
                      items: draft.experience.items.filter((_, itemIndex) => itemIndex !== index),
                    },
                  })
                }
              />
            </div>
            <BilingualField label="نقش" value={item.role} onChange={(role) => updateExperience(index, { role })} />
            <BilingualField label="مکان" value={item.place} onChange={(place) => updateExperience(index, { place })} />
            <BilingualField label="بازه" value={item.period} onChange={(period) => updateExperience(index, { period })} />
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
                  className="cursor-pointer justify-self-start text-sm text-red-600"
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
              className="cursor-pointer justify-self-start text-sm"
              onClick={() => updateExperience(index, { points: [...item.points, emptyCopy()] })}
            >
              افزودن نکته
            </button>
          </article>
        ))}
      </section>

      <section className={panel === "projects" ? "grid gap-4 rounded-3xl border border-line bg-card p-5" : "hidden"}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl">پروژه‌ها</h2>
          <button
            type="button"
            className="cursor-pointer text-sm"
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
                      url: "",
                      image: "/templates/html-site.jpg",
                    },
                  ],
                },
              })
            }
          >
            افزودن پروژه
          </button>
        </div>
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
          label="عنوان گروه رزومه"
          value={draft.projects.resumeGroup}
          onChange={(resumeGroup) => patch({ projects: { ...draft.projects, resumeGroup } })}
        />
        <BilingualField
          label="عنوان کارهای اخیر"
          value={draft.projects.recentGroup}
          onChange={(recentGroup) => patch({ projects: { ...draft.projects, recentGroup } })}
        />
        {draft.projects.items.map((item, index) => (
          <article key={item.id} className="grid gap-3 rounded-2xl border border-line p-4">
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
                className={fieldClass}
                value={item.group}
                onChange={(event) =>
                  updateProject(index, { group: event.target.value as ProjectItem["group"] })
                }
              >
                <option value="resume">از رزومه</option>
                <option value="recent">کارهای اخیر</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              لینک
              <input
                className={fieldClass}
                dir="ltr"
                value={item.url}
                onChange={(event) => updateProject(index, { url: event.target.value })}
              />
            </label>
            <label className="grid gap-2 text-sm">
              تصویر
              <input
                className={fieldClass}
                dir="ltr"
                value={item.image}
                onChange={(event) => updateProject(index, { image: event.target.value })}
              />
            </label>
            <BilingualField label="عنوان" value={item.title} onChange={(title) => updateProject(index, { title })} />
            <BilingualField label="متا" value={item.meta} onChange={(meta) => updateProject(index, { meta })} />
            <BilingualField
              label="خلاصه"
              multiline
              value={item.summary}
              onChange={(summary) => updateProject(index, { summary })}
            />
          </article>
        ))}
      </section>

      {panel === "stats" ? (
        <section className="grid gap-4 rounded-3xl border border-line bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl">آمار</h2>
            <button
              type="button"
              className="cursor-pointer text-sm"
              onClick={() =>
                patch({
                  stats: [
                    ...draft.stats,
                    { id: `stat-${crypto.randomUUID()}`, visible: true, value: "۱", label: emptyCopy() },
                  ],
                })
              }
            >
              افزودن آمار
            </button>
          </div>
          {draft.stats.map((item, index) => (
            <article key={item.id} className="grid gap-3 rounded-2xl border border-line p-4">
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
              <label className="grid gap-2 text-sm">
                عدد
                <input
                  className={fieldClass}
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
              <button
                type="button"
                className="cursor-pointer justify-self-start text-sm text-red-600"
                onClick={() => patch({ stats: draft.stats.filter((_, itemIndex) => itemIndex !== index) })}
              >
                حذف
              </button>
            </article>
          ))}
        </section>
      ) : null}

      {panel === "custom" ? (
        <section className="grid gap-4 rounded-3xl border border-line bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl">بخش سفارشی</h2>
            <button
              type="button"
              className="cursor-pointer text-sm"
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
            >
              افزودن بخش
            </button>
          </div>
          {draft.customSections.map((item, index) => (
            <article key={item.id} className="grid gap-3 rounded-2xl border border-line p-4">
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
              <label className="grid gap-2 text-sm">
                تصویر
                <input
                  className={fieldClass}
                  dir="ltr"
                  value={item.image}
                  onChange={(event) => {
                    const customSections = draft.customSections.slice();
                    customSections[index] = { ...item, image: event.target.value };
                    patch({ customSections });
                  }}
                />
              </label>
              <button
                type="button"
                className="cursor-pointer justify-self-start text-sm text-red-600"
                onClick={() =>
                  patch({
                    customSections: draft.customSections.filter((_, itemIndex) => itemIndex !== index),
                  })
                }
              >
                حذف
              </button>
            </article>
          ))}
        </section>
      ) : null}

      {panel === "links" ? (
        <section className="grid gap-4 rounded-3xl border border-line bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl">لینک‌ها</h2>
            <button
              type="button"
              className="cursor-pointer text-sm"
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
            >
              افزودن لینک شخصی
            </button>
          </div>
          <p className="text-sm text-muted-fg">فقط لینک‌هایی که آدرس دارند روی سایت دیده می‌شوند.</p>
          {draft.socials.map((item, index) => (
            <article key={item.id} className="grid gap-3 rounded-2xl border border-line p-4">
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
              <label className="grid gap-2 text-sm">
                نوع
                <select
                  className={fieldClass}
                  value={item.kind}
                  onChange={(event) => {
                    const socials = draft.socials.slice();
                    socials[index] = { ...item, kind: event.target.value as typeof item.kind };
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
                  className={fieldClass}
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
              <button
                type="button"
                className="cursor-pointer justify-self-start text-sm text-red-600"
                onClick={() => patch({ socials: draft.socials.filter((_, itemIndex) => itemIndex !== index) })}
              >
                حذف
              </button>
            </article>
          ))}
        </section>
      ) : null}

      <section className={panel === "contact" ? "grid gap-4 rounded-3xl border border-line bg-card p-5" : "hidden"}>
        <h2 className="text-xl">تماس</h2>
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
        <BilingualField
          label="دکمه"
          value={draft.contact.action}
          onChange={(action) => patch({ contact: { ...draft.contact, action } })}
        />
      </section>
      </div>
    </div>
  );

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
}
