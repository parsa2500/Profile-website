"use client";

import { useActionState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { login } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: "" });

  return (
    <div className="grid w-full max-w-md gap-4">
      <div className="flex justify-end">
        <ThemeToggle toDark="حالت تیره" toLight="حالت روشن" />
      </div>
      <form action={action} className="admin-panel grid gap-5 rounded-[1.75rem] p-7">
        <div>
          <p className="admin-chip mb-3">پنل مدیریت</p>
          <h1 className="text-3xl font-medium tracking-tight">ورود به پنل</h1>
          <p className="mt-2 text-sm leading-7 text-muted-fg">
            نام کاربری و رمز را از فایل env وارد کنید. تم روشن و تیره از همین‌جا عوض می‌شود.
          </p>
        </div>
        <label className="grid gap-2 text-sm">
          نام کاربری
          <input
            name="username"
            type="text"
            required
            autoFocus
            autoComplete="username"
            className="admin-field h-11"
          />
        </label>
        <label className="grid gap-2 text-sm">
          رمز عبور
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="admin-field h-11"
          />
        </label>
        {state.error ? (
          <p className="rounded-2xl border border-[color:var(--admin-danger)]/30 bg-[color:var(--admin-danger)]/10 px-3 py-2 text-sm text-[color:var(--admin-danger)]">
            {state.error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="h-11 cursor-pointer rounded-full bg-accent text-sm font-medium text-on-accent transition-opacity disabled:opacity-60"
        >
          {pending ? "در حال ورود" : "ورود"}
        </button>
      </form>
    </div>
  );
}
