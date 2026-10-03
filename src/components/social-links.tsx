import { pick, type SocialKind, type SocialLink } from "@/content/types";

function Icon({ kind }: { kind: SocialKind | "github" }) {
  const common = { viewBox: "0 0 24 24", className: "size-4", "aria-hidden": true as const, fill: "none", stroke: "currentColor", strokeWidth: 1.8 };
  if (kind === "github") {
    return (
      <svg {...common}>
        <path d="M9 19c-4 1.5-4-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3 0 6-1.4 6-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.3 1.3a11.6 11.6 0 0 0-6 0C6.3 2.8 5.3 3.1 5.3 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 3 6 6 6a3.4 3.4 0 0 0-.9 2.6V22" />
      </svg>
    );
  }
  if (kind === "linkedin") {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 11v5M8 8h.01M12 16v-3a2 2 0 0 1 4 0v3" />
      </svg>
    );
  }
  if (kind === "instagram") {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (kind === "youtube") {
    return (
      <svg {...common}>
        <rect x="3" y="7" width="18" height="10" rx="3" />
        <path d="m11 10 4 2-4 2z" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (kind === "telegram") {
    return (
      <svg {...common}>
        <path d="m21 5-9 16-3-7-7-3z" />
      </svg>
    );
  }
  if (kind === "website") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M4 12h16M12 4c2 2.5 2 13.5 0 16M12 4c-2 2.5-2 13.5 0 16" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7L12.7 18" />
    </svg>
  );
}

export function SocialLinks({
  links,
  locale,
  githubUrl,
  githubHandle,
}: {
  links: SocialLink[];
  locale: string;
  githubUrl?: string;
  githubHandle?: string;
}) {
  const items = [
    ...(githubUrl
      ? [
          {
            id: "github",
            kind: "github" as const,
            label: githubHandle || "GitHub",
            url: githubUrl,
          },
        ]
      : []),
    ...links
      .filter((link) => link.visible && link.url.trim())
      .map((link) => ({
        id: link.id,
        kind: link.kind,
        label: pick(link.label, locale) || link.kind,
        url: link.url,
      })),
  ];

  if (items.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => {
        return (
          <li key={item.id}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-line bg-card px-3 text-sm transition-colors duration-200 hover:border-accent"
            >
              <Icon kind={item.kind} />
              <span>{item.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
