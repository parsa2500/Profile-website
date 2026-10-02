export const githubUrl = "https://github.com/parsa2500";
export const githubHandle = "parsa2500";

export const skills = [
  { id: "python", className: "sm:col-span-2 sm:row-span-2" },
  { id: "web", className: "sm:col-span-2" },
  { id: "wordpress", className: "" },
  { id: "bootstrap", className: "" },
  { id: "photoshop", className: "" },
  { id: "icdl", className: "" },
  { id: "english", className: "sm:col-span-2" },
] as const;

export const experiences = ["webIntern", "seo"] as const;

export const resumeProjects = ["pythonGame", "wordpress", "htmlSite"] as const;
export const recentProjects = ["cafePos", "rag", "movahed"] as const;

export const navItems = [
  { id: "about", href: "#about" },
  { id: "skills", href: "#skills" },
  { id: "experience", href: "#experience" },
  { id: "projects", href: "#projects" },
  { id: "contact", href: "#contact" },
] as const;
