"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { saveContent } from "@/content/store";
import type { SiteContent } from "@/content/types";
import { createSessionToken, credentialsMatch, isAdmin, sessionCookie } from "@/lib/auth";

const uploadRoot = path.join(process.cwd(), "public", "uploads");
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxBytes = 5 * 1024 * 1024;

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

export async function uploadImage(formData: FormData) {
  if (!(await isAdmin())) {
    return { ok: false as const, error: "نشست تمام شده. دوباره وارد شوید." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false as const, error: "فایلی انتخاب نشده است." };
  }
  if (!allowedTypes.has(file.type)) {
    return { ok: false as const, error: "فقط JPG، PNG، WebP یا GIF مجاز است." };
  }
  if (file.size > maxBytes) {
    return { ok: false as const, error: "حجم فایل باید کمتر از ۵ مگابایت باشد." };
  }

  const extension =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : file.type === "image/gif"
          ? "gif"
          : "jpg";
  const safeBase = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const filename = `${Date.now()}-${safeBase || "image"}.${extension}`;

  await mkdir(uploadRoot, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadRoot, filename), buffer);

  return { ok: true as const, path: `/uploads/${filename}` };
}
