"use client";

import { useActionState } from "react";
import { login } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: "" });

  return (
    <form action={action} className="grid w-full max-w-sm gap-4 rounded-3xl border border-line bg-card p-6">
      <div>
        <h1 className="text-2xl font-medium">ورود به پنل</h1>
        <p className="mt-2 text-sm leading-6 text-muted-fg">
          نام کاربری و رمز را از فایل env وارد کنید.
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
          className="h-11 rounded-2xl border border-line bg-paper px-3 text-ink"
        />
      </label>
      <label className="grid gap-2 text-sm">
        رمز عبور
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-11 rounded-2xl border border-line bg-paper px-3 text-ink"
        />
      </label>
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="h-11 cursor-pointer rounded-full bg-accent text-sm text-on-accent disabled:opacity-60"
      >
        {pending ? "در حال ورود" : "ورود"}
      </button>
    </form>
  );
}
