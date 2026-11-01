import { getContent } from "@/content/store";
import { pick } from "@/content/types";
import { absoluteUrl, getSiteUrl, localePath } from "@/lib/site";

export async function JsonLd({ locale }: { locale: string }) {
  const content = await getContent();
  const name = pick(content.hero.name, locale);
  const description = pick(content.meta.description, locale);
  const siteUrl = getSiteUrl();
  const pageUrl = absoluteUrl(localePath(locale));
  const sameAs = [
    content.githubUrl,
    ...content.socials.filter((link) => link.visible && link.url.trim()).map((link) => link.url),
  ].filter(Boolean);

  const members = content.team.members
    .filter((member) => member.visible)
    .map((member) => ({
      "@type": "Person",
      name: pick(member.name, locale),
      jobTitle: pick(member.role, locale),
      description: pick(member.bio, locale),
      image: absoluteUrl(member.image),
      department: pick(content.team.departments[member.department], locale),
    }));

  const organization = {
    "@type": "Organization",
    name,
    url: pageUrl,
    description,
    image: absoluteUrl(content.hero.image),
    address: {
      "@type": "PostalAddress",
      addressLocality: pick(content.hero.location, locale),
    },
    sameAs,
    ...(content.contact.email.trim() ? { email: content.contact.email.trim() } : {}),
    ...(members.length > 0 ? { member: members } : {}),
  };

  const website = {
    "@type": "WebSite",
    name: pick(content.meta.title, locale),
    url: siteUrl,
    description,
    inLanguage: locale === "en" ? "en" : "fa",
    publisher: { "@type": "Organization", name },
  };

  const payload = {
    "@context": "https://schema.org",
    "@graph": [organization, website],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
