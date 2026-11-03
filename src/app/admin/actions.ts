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
const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);
const allowedModelTypes = new Set([
  "model/gltf-binary",
  "model/gltf+json",
  "application/octet-stream",
]);
const maxBytes = 5 * 1024 * 1024;
const maxModelBytes = 15 * 1024 * 1024;

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
  revalidatePath("/fa", "layout");
  revalidatePath("/en", "layout");
  return { ok: true as const };
}

function safeUploadName(fileName: string, fallback: string) {
  return (
    fileName
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || fallback
  );
}

export async function uploadImage(formData: FormData) {
  if (!(await isAdmin())) {
    return { ok: false as const, error: "نشست تمام شده. دوباره وارد شوید." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false as const, error: "فایلی انتخاب نشده است." };
  }
  if (!allowedImageTypes.has(file.type)) {
    return { ok: false as const, error: "فقط JPG، PNG، WebP، GIF یا SVG مجاز است." };
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
          : file.type === "image/svg+xml"
            ? "svg"
            : "jpg";
  const filename = `${Date.now()}-${safeUploadName(file.name, "image")}.${extension}`;

  await mkdir(uploadRoot, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadRoot, filename), buffer);

  return { ok: true as const, path: `/uploads/${filename}` };
}

export async function uploadModel(formData: FormData) {
  if (!(await isAdmin())) {
    return { ok: false as const, error: "نشست تمام شده. دوباره وارد شوید." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false as const, error: "فایلی انتخاب نشده است." };
  }

  const lower = file.name.toLowerCase();
  const isGlb = lower.endsWith(".glb");
  const isGltf = lower.endsWith(".gltf");
  if (!isGlb && !isGltf) {
    return { ok: false as const, error: "فقط فایل GLB یا GLTF مجاز است." };
  }
  if (!allowedModelTypes.has(file.type) && file.type !== "") {
    // Some browsers send empty or generic MIME for .glb — extension check above is enough.
    if (file.type && !file.type.includes("octet") && !file.type.includes("gltf")) {
      return { ok: false as const, error: "نوع فایل مدل معتبر نیست." };
    }
  }
  if (file.size > maxModelBytes) {
    return { ok: false as const, error: "حجم مدل باید کمتر از ۱۵ مگابایت باشد." };
  }

  const extension = isGlb ? "glb" : "gltf";
  const filename = `${Date.now()}-${safeUploadName(file.name, "logo3d")}.${extension}`;

  await mkdir(uploadRoot, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadRoot, filename), buffer);

  return { ok: true as const, path: `/uploads/${filename}` };
}
