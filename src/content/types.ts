export type ExternalLink = {
  label: string;
  href: string;
  kind: "email" | "github" | "linkedin" | "leetcode" | "resume" | "demo" | "case-study";
};

export type Metric = {
  label: string;
  value: string;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  status: "live" | "in-progress" | "archived";
  role: string;
  timeframe: string;
  summary: string;
  problem: string;
  solution: string;
  impact: string[];
  metrics: Metric[];
  tech: string[];
  links: ExternalLink[];
  visual?: {
    src: string;
    alt: string;
  };
};

export type Experience = {
  role: string;
  organization: string;
  timeframe: string;
  summary: string;
  bullets: string[];
};

export type SkillGroup = {
  label: string;
  items: string[];
};

export type PortfolioContent = {
  profile: {
    name: string;
    eyebrow: string;
    credential: string;
    headline: string;
    summary: string;
    location: string;
    availability: string;
    headshot: {
      src: string;
      alt: string;
    };
  };
  nav: Array<{ href: string; label: string }>;
  links: ExternalLink[];
  heroMetrics: Metric[];
  projects: Project[];
  experience: Experience[];
  skills: SkillGroup[];
  resume: {
    path: string;
    updated: string;
    highlights: string[];
  };
  contact: {
    headline: string;
    summary: string;
  };
};
