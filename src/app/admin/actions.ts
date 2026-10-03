"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { saveContent } from "@/content/store";
import type { SiteContent } from "@/content/types";
import { createSessionToken, credentialsMatch, isAdmin, sessionCookie } from "@/lib/auth";

export async function login(
  _state: { error: string },
  formData: FormData,
): Promise<{ error: string }> {
  const inputUsername = String(formData.get("username") ?? "");
  const inputPassword = String(formData.get("password") ?? "");
  if (!credentialsMatch(inputUsername, inputPassword)) {
    return { error: "نام کاربری یا رمز نادرست است." };
  }

  const cookie = sessionCookie();
  (await cookies()).set(cookie.name, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: cookie.maxAge,
    secure: process.env.NODE_ENV === "production",
  });
  redirect("/admin");
}

export async function logout() {
  const cookie = sessionCookie();
  (await cookies()).delete(cookie.name);
  redirect("/admin/login");
}

export async function updateContent(content: SiteContent) {
  if (!(await isAdmin())) {
    return { ok: false as const, error: "نشست تمام شده. دوباره وارد شوید." };
  }

  await saveContent(content);
  revalidatePath("/", "layout");
  revalidatePath("/en", "layout");
  return { ok: true as const };
}
