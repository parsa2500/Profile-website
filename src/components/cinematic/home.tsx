import { getLocale } from "next-intl/server";
import { getContent } from "@/content/store";
import { CinematicExperience } from "./experience";

export async function CinematicHome() {
  const locale = await getLocale();
  const content = await getContent();

  return (
    <CinematicExperience
      locale={locale}
      rtl={locale === "fa"}
      hero={content.hero}
      about={content.about}
      products={content.products}
      projects={content.projects}
      team={content.team}
      skills={content.skills}
      experience={content.experience}
      contact={content.contact}
      stats={content.stats}
      customSections={content.customSections}
      socials={content.socials}
      githubUrl={content.githubUrl}
      githubHandle={content.githubHandle}
      members={content.team.members}
    />
  );
}
