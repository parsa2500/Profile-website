import { redirect } from "next/navigation";
import { getContent } from "@/content/store";
import { isAdmin } from "@/lib/auth";
import { Editor } from "./editor";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  const content = await getContent();
  return <Editor initial={content} />;
}
