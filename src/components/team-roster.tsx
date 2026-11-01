"use client";

import { useMemo, useState } from "react";
import { Cover } from "@/components/cover";
import { Stagger, StaggerItem } from "@/components/motion";
import { pick, type Copy, type TeamDepartment, type TeamMember } from "@/content/types";

const departmentOrder: TeamDepartment[] = [
  "sales",
  "engineering",
  "research",
  "support",
];

export function TeamRoster({
  locale,
  departments,
  members,
  title,
  signal,
}: {
  locale: string;
  departments: Record<TeamDepartment, Copy>;
  members: TeamMember[];
  title: string;
  signal: boolean;
}) {
  const visible = members.filter((member) => member.visible);
  const [active, setActive] = useState<TeamDepartment>("sales");

  const counts = useMemo(() => {
    const map = Object.fromEntries(departmentOrder.map((key) => [key, 0])) as Record<
      TeamDepartment,
      number
    >;
    for (const member of visible) {
      map[member.department] += 1;
    }
    return map;
  }, [visible]);

  const filtered = visible.filter((member) => member.department === active);

  return (
    <>
      <div
        className="mt-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label={title}
      >
        {departmentOrder.map((department) => {
          const selected = active === department;
          const label = pick(departments[department], locale);
          return (
            <button
              key={department}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(department)}
              className={`shrink-0 border px-4 py-2 text-sm transition-colors duration-200 ${
                signal ? "rounded-none" : "rounded-full"
              } ${
                selected
                  ? "border-accent bg-accent text-on-accent"
                  : "border-line bg-transparent text-ink hover:border-accent"
              }`}
            >
              {label}
              <span className="ms-2 opacity-70">{counts[department]}</span>
            </button>
          );
        })}
      </div>

      <Stagger className="mt-8 grid gap-3" key={active}>
        {filtered.map((member) => (
          <StaggerItem key={member.id}>
            <article
              className={`flex gap-4 border border-line bg-card p-4 ${
                signal ? "rounded-none" : "rounded-[1.75rem]"
              }`}
            >
              <Cover
                src={member.image}
                alt={pick(member.name, locale)}
                sizes="96px"
                className={`size-16 shrink-0 sm:size-20 ${
                  signal ? "rounded-none" : "rounded-2xl"
                }`}
              />
              <div className="min-w-0">
                <h3 className="text-lg font-medium tracking-tight">
                  {pick(member.name, locale)}
                </h3>
                <p className="mt-1 text-sm text-accent">{pick(member.role, locale)}</p>
                <p className="mt-2 text-sm leading-7 text-muted-fg">
                  {pick(member.bio, locale)}
                </p>
              </div>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </>
  );
}
