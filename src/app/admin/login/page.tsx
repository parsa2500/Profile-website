import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "./form";

export default async function LoginPage() {
  if (await isAdmin()) {
    redirect("/admin");
  }

  return (
    <main className="grid min-h-full place-items-center px-5 py-16">
      <LoginForm />
    </main>
  );
}
