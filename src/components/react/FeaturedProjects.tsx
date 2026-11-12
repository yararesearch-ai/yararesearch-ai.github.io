// src/components/react/FeaturedProjects.tsx
import { motion } from 'framer-motion';
import { RESEARCH_PROJECTS } from '../../data/research';

const STATUS_LABELS: Record<string, string> = {
  proposed: 'Proposed',
  active: 'Active',
  'in-review': 'In Review',
  published: 'Published',
  completed: 'Completed',
  archived: 'Archived',
};

export default function FeaturedProjects() {
  return (
    <section className="projects" aria-labelledby="projects-heading">
      <div className="projects-container">
        {/* Header */}
        <div className="projects-header">
          <span className="research-id">Featured Research Projects</span>
          <h2 id="projects-heading" className="projects-headline">
            Flagship research initiatives.
          </h2>
          <p className="projects-subtext">
            Three initial research projects investigating the architecture of
            next-generation intelligent systems. Each project follows the YARA
            research lifecycle: from hypothesis through experimentation to
            reproducible publication.
          </p>
        </div>

        {/* Projects list — editorial layout */}
        <ol className="projects-list" aria-label="Research projects">
          {RESEARCH_PROJECTS.map((project, i) => (
            <motion.li
              key={project.id}
              className="project-item"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: 'easeOut' }}
            >
              <div className="project-index-col">
                <span className="project-index">{String(i + 1).padStart(2, '0')}</span>
                <div className="project-spine" aria-hidden="true" />
              </div>

              <article className="project-content">
                <div className="project-meta-row">
                  <div className="project-meta-left">
                    <span className="project-id">{project.id}</span>
                    <span className={`status-badge status-${project.status}`}>
                      {STATUS_LABELS[project.status]}
                    </span>
                  </div>
                  <span className="project-programme-tag">
                    Programme {project.programme}
                  </span>
                </div>

                <h3 className="project-title">
                  <a href={`/research/projects/${project.slug}`} className="project-title-link">
                    {project.title}
                  </a>
                </h3>
                <p className="project-subtitle">{project.subtitle}</p>
                <p className="project-description">{project.description}</p>

                {/* Research questions preview */}
                {project.researchQuestions.length > 0 && (
                  <div className="project-questions">
                    <span className="project-questions-label">Key questions</span>
                    <ul className="project-questions-list">
                      {project.researchQuestions.slice(0, 2).map((q) => (
                        <li key={q} className="project-question">{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <a
                  href={`/research/projects/${project.slug}`}
                  className="project-link"
                  aria-label={`Read more about ${project.title}`}
                >
                  Read research brief
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </article>
            </motion.li>
          ))}
        </ol>

        <div className="projects-footer">
          <a href="/research/projects" className="btn-secondary-sm">
            View all projects
          </a>
        </div>
      </div>

      <style>{`
        .projects {
          padding-block: var(--space-section);
          background: var(--color-midnight-navy);
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }

        .projects-container {
          max-width: var(--max-width-content);
          margin-inline: auto;
          padding-inline: var(--space-container);
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
        }

        .projects-header {
          max-width: 54ch;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .projects-headline {
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: var(--color-text-primary);
        }

        .projects-subtext {
          font-size: 1rem;
          line-height: 1.65;
          color: var(--color-text-secondary);
        }

        /* List */
        .projects-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--color-border);
        }

        .project-item {
          display: grid;
          grid-template-columns: 4rem 1fr;
          gap: 0;
          border-bottom: 1px solid var(--color-border);
        }

        /* Index column */
        .project-index-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 2rem;
          padding-bottom: 2rem;
          gap: 0.75rem;
        }

        .project-index {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: var(--color-text-muted);
        }

        .project-spine {
          flex: 1;
          width: 1px;
          background: linear-gradient(
            to bottom,
            rgba(91, 156, 255, 0.2),
            transparent
          );
        }

        /* Content */
        .project-content {
          padding: 2rem 0 2rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border-left: 1px solid var(--color-border);
        }

        .project-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .project-meta-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .project-id {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--color-electric-blue);
        }

        .project-programme-tag {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          padding: 0.2rem 0.5rem;
          border: 1px solid var(--color-border);
          border-radius: 2px;
        }

        .project-title {
          font-family: var(--font-display);
          font-size: 1.375rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .project-title-link {
          color: var(--color-text-primary);
          text-decoration: none;
          transition: color 0.2s;
        }

        .project-title-link:hover {
          color: var(--color-electric-blue);
        }

        .project-subtitle {
          font-size: 0.9375rem;
          color: var(--color-text-muted);
          font-style: italic;
        }

        .project-description {
          font-size: 0.9375rem;
          line-height: 1.65;
          color: var(--color-text-secondary);
          max-width: 64ch;
        }

        .project-questions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem 1.25rem;
          background: rgba(255,255,255,0.025);
          border-left: 2px solid rgba(91, 156, 255, 0.3);
          border-radius: 0 2px 2px 0;
        }

        .project-questions-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-electric-blue);
        }

        .project-questions-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .project-question {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          padding-left: 1rem;
          position: relative;
        }

        .project-question::before {
          content: '?';
          position: absolute;
          left: 0;
          color: var(--color-text-muted);
          font-family: var(--font-mono);
          font-size: 0.75rem;
        }

        .project-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-electric-blue);
          text-decoration: none;
          margin-top: 0.25rem;
          transition: gap 0.2s ease;
        }

        .project-link:hover {
          gap: 0.75rem;
        }

        .projects-footer {
          display: flex;
          justify-content: center;
        }

        .btn-secondary-sm {
          display: inline-flex;
          align-items: center;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          padding: 0.625rem 1.25rem;
          border-radius: 3px;
          border: 1px solid var(--color-border);
          transition: color 0.2s, border-color 0.2s, background 0.2s;
          text-decoration: none;
        }

        .btn-secondary-sm:hover {
          color: var(--color-text-primary);
          border-color: rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.04);
        }

        @media (max-width: 640px) {
          .project-item {
            grid-template-columns: 2.5rem 1fr;
          }

          .project-content {
            padding: 1.5rem 0 1.5rem 1rem;
          }
        }
      `}</style>
    </section>
  );
}
