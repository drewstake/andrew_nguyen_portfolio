import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { portfolioContent } from "./content/portfolio";
import type { ExternalLink, Metric, Project } from "./content/types";

const statusLabels: Record<Project["status"], string> = {
  live: "Live",
  "in-progress": "In progress",
  archived: "Archived",
};

function getLinkTarget(link: ExternalLink): string | undefined {
  return link.href.startsWith("http") ? "_blank" : undefined;
}

function getLinkRel(link: ExternalLink): string | undefined {
  return link.href.startsWith("http") ? "noreferrer" : undefined;
}

function Section({
  id,
  label,
  title,
  intro,
  children,
}: {
  id: string;
  label: string;
  title: string;
  intro?: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <section id={id} className="section-shell reveal-section" data-reveal>
      <div className="section-heading">
        <p className="eyebrow">{label}</p>
        <h2>{title}</h2>
        {intro ? <p>{intro}</p> : null}
      </div>
      {children}
    </section>
  );
}

function MetricGrid({ metrics }: { metrics: Metric[] }): JSX.Element {
  return (
    <div className="metric-grid">
      {metrics.map((metric) => (
        <div className="metric-card" key={`${metric.label}-${metric.value}`}>
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
        </div>
      ))}
    </div>
  );
}

function LinkButton({
  link,
  variant = "secondary",
}: {
  link: ExternalLink;
  variant?: "primary" | "secondary" | "inline";
}): JSX.Element {
  const className = variant === "primary" ? "button button-primary" : variant === "inline" ? "text-link" : "button";

  return (
    <a href={link.href} target={getLinkTarget(link)} rel={getLinkRel(link)} className={className}>
      {link.label}
    </a>
  );
}

function ProjectCard({ project }: { project: Project }): JSX.Element {
  return (
    <article className="project-card">
      <div className="project-visual">
        {project.visual ? (
          <img src={project.visual.src} alt={project.visual.alt} loading="lazy" />
        ) : (
          <div className="project-visual-fallback" aria-hidden="true">
            <span>{project.name}</span>
            <small>{project.role}</small>
          </div>
        )}
      </div>

      <div className="project-body">
        <div className="project-topline">
          <span>{statusLabels[project.status]}</span>
          <span>{project.timeframe}</span>
        </div>
        <h3>{project.name}</h3>
        <p className="project-tagline">{project.tagline}</p>
        <p className="project-summary">{project.summary}</p>

        <MetricGrid metrics={project.metrics} />

        <div className="project-columns">
          <div>
            <h4>Problem</h4>
            <p>{project.problem}</p>
          </div>
          <div>
            <h4>Solution</h4>
            <p>{project.solution}</p>
          </div>
        </div>

        <div>
          <h4>Impact</h4>
          <ul className="check-list">
            {project.impact.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="chip-row" aria-label={`${project.name} technology stack`}>
          {project.tech.map((item) => (
            <span className="chip" key={item}>
              {item}
            </span>
          ))}
        </div>

        {project.links.length > 0 ? (
          <div className="project-links">
            {project.links.map((link) => (
              <LinkButton key={`${project.slug}-${link.label}`} link={link} />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function useSmoothScroll(): void {
  useEffect(() => {
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reduceMotionQuery.matches) {
      return;
    }

    const lenis = new Lenis({
      anchors: {
        duration: 1.05,
        offset: -92,
      },
      autoRaf: true,
      duration: 1.15,
      easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
      prevent: (node) => node.hasAttribute("data-lenis-prevent") || Boolean(node.closest("[data-lenis-prevent]")),
      smoothWheel: true,
      stopInertiaOnNavigate: true,
      touchMultiplier: 1.05,
      wheelMultiplier: 0.88,
    });

    return () => {
      lenis.destroy();
    };
  }, []);
}

function App(): JSX.Element {
  useSmoothScroll();

  const { profile, nav, links, heroMetrics, projects, experience, skills, resume, contact } = portfolioContent;
  const resumeLink = links.find((link) => link.kind === "resume") ?? {
    label: "Resume",
    href: resume.path,
    kind: "resume" as const,
  };
  const socialLinks = links.filter((link) => ["github", "linkedin", "leetcode"].includes(link.kind));
  const contactLinks = links.filter((link) => link.kind !== "resume");

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Andrew Nguyen home">
          <span>{profile.name}</span>
          <small>{profile.location}</small>
        </a>

        <nav aria-label="Primary navigation">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <LinkButton link={resumeLink} variant="primary" />
      </header>

      <main id="main-content">
        <section id="top" className="hero section-shell reveal-section is-visible" data-reveal>
          <div className="hero-copy">
            <p className="eyebrow">{profile.eyebrow}</p>
            <h1>{profile.headline}</h1>
            <p className="hero-credential">{profile.credential}</p>
            <p>{profile.summary}</p>

            <div className="hero-actions">
              <LinkButton link={resumeLink} variant="primary" />
              <a className="button" href="#projects">
                View projects
              </a>
              <a className="button" href="#contact">
                Contact
              </a>
            </div>

            <div className="hero-social-links" aria-label="Profile links">
              {socialLinks.map((link) => (
                <LinkButton key={link.kind} link={link} variant="inline" />
              ))}
            </div>
          </div>

          <aside className="profile-panel" aria-label="Profile snapshot">
            <img src={profile.headshot.src} alt={profile.headshot.alt} />
            <div>
              <p className="eyebrow">Currently</p>
              <h2>{profile.availability}</h2>
            </div>
            <MetricGrid metrics={heroMetrics} />
          </aside>
        </section>

        <Section
          id="projects"
          label="Featured work"
          title="Project case studies"
          intro="Professional client work and independent builds with the clearest engineering story and product relevance."
        >
          <div className="project-list">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Section>

        <Section
          id="experience"
          label="Experience"
          title="Work history"
          intro="Roles tied to software delivery, automation, review loops, and data quality."
        >
          <div className="timeline">
            {experience.map((item) => (
              <article className="timeline-item" key={`${item.role}-${item.organization}`}>
                <div>
                  <p className="timeline-date">{item.timeframe}</p>
                  <h3>{item.role}</h3>
                  <p className="organization">{item.organization}</p>
                </div>
                <div>
                  <p>{item.summary}</p>
                  <ul className="check-list">
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section
          id="skills"
          label="Capabilities"
          title="Technical stack"
          intro="The tools I use most often across production web, mobile, backend, and delivery work."
        >
          <div className="skill-grid">
            {skills.map((group) => (
              <article className="skill-card" key={group.label}>
                <h3>{group.label}</h3>
                <div className="chip-row">
                  {group.items.map((item) => (
                    <span className="chip" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section
          id="resume"
          label="Resume"
          title="Readable, downloadable, and current"
          intro={`Last updated ${resume.updated}. The PDF remains the source of truth for formal applications.`}
        >
          <div className="resume-layout">
            <article className="resume-card">
              <h3>Resume highlights</h3>
              <ul className="check-list">
                {resume.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <div className="resume-actions">
                <a className="button button-primary" href={resume.path} download>
                  Download PDF
                </a>
                <a className="button" href={resume.path} target="_blank" rel="noreferrer">
                  Open in browser
                </a>
              </div>
            </article>

            <object
              className="resume-preview"
              data={`${resume.path}#view=FitH`}
              data-lenis-prevent
              type="application/pdf"
            >
              <p>
                Resume preview unavailable. <a href={resume.path}>Open the PDF instead.</a>
              </p>
            </object>
          </div>
        </Section>

        <Section id="contact" label="Contact" title={contact.headline} intro={contact.summary}>
          <div className="contact-panel">
            {contactLinks.map((link) => (
              <LinkButton key={link.kind} link={link} variant={link.kind === "email" ? "primary" : "secondary"} />
            ))}
          </div>
        </Section>
      </main>

      <footer className="site-footer">
        <span>{profile.name}</span>
        <span>Portfolio template refreshed {resume.updated}</span>
      </footer>
    </div>
  );
}

export default App;
