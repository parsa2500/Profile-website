import { getTranslations } from "next-intl/server";
import { githubHandle, githubUrl } from "@/content/profile";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-muted-fg md:flex-row md:items-center md:justify-between md:px-8">
        <p>{t("note")}</p>
        <a
          href={githubUrl}
          className="transition-colors duration-200 hover:text-ink"
          target="_blank"
          rel="noopener noreferrer"
        >
          {githubHandle}
        </a>
      </div>
    </footer>
  );
}
