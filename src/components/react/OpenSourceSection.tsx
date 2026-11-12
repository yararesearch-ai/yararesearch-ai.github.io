// src/components/react/OpenSourceSection.tsx
// Section 7 on Homepage: Open research. Reproducible engineering.

const REPOSITORIES = [
  {
    name: 'beyond-agentic-benchmarks',
    category: 'Benchmarks',
    description: 'Comparative evaluation harness for deterministic workflows vs autonomous agent loops on structured enterprise tasks.',
    status: 'In Development',
    statusType: 'active',
    language: 'Python',
    license: 'Apache-2.0',
    link: 'https://github.com/yararesearch-ai',
  },
  {
    name: 'lightweight-ai-runtime',
    category: 'Research Frameworks',
    description: 'Experimental modular execution runtime providing state-machine orchestration, permission boundaries, and context efficiency.',
    status: 'Initial Prototype',
    statusType: 'active',
    language: 'TypeScript / Rust',
    license: 'MIT',
    link: 'https://github.com/yararesearch-ai',
  },
  {
    name: 'local-intelligence-toolkit',
    category: 'Research Utilities',
    description: 'Reference implementations for quantized local model routing, adaptive context selection, and constrained decoding.',
    status: 'Planned',
    statusType: 'proposed',
    language: 'Python / C++',
    license: 'Apache-2.0',
    link: 'https://github.com/yararesearch-ai',
  },
];

export default function OpenSourceSection() {
  return (
    <section className="opensource-section" aria-labelledby="os-section-heading">
      <div className="os-container">
        {/* Section Header */}
        <div className="os-header-row">
          <div className="os-header-text">
            <span className="research-id">Open Source</span>
            <h2 id="os-section-heading" className="os-headline">
              Open research. Reproducible engineering.
            </h2>
            <p className="os-subtext">
              We publish code, benchmarks, and experimental environments alongside our research.
              True scientific progress requires that every claim can be independently tested,
              replicated, and inspected.
            </p>
          </div>
          <a
            href="/open-source"
            className="os-view-all-link"
          >
            Explore all repositories →
          </a>
        </div>

        {/* Repository Cards Grid */}
        <div className="os-grid" role="list">
          {REPOSITORIES.map((repo) => (
            <article key={repo.name} className="os-card" role="listitem">
              <div className="os-card-header">
                <span className="os-category-tag">{repo.category}</span>
                <span className={`status-badge status-${repo.statusType}`}>
                  {repo.status}
                </span>
              </div>

              <h3 className="os-repo-title">
                <a
                  href={repo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="os-repo-link"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="os-gh-icon">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  {repo.name}
                </a>
              </h3>

              <p className="os-repo-desc">{repo.description}</p>

              <div className="os-card-footer">
                <span className="os-tech-stack">
                  <span className="os-tech-dot" aria-hidden="true"></span>
                  {repo.language}
                </span>
                <span className="os-license-badge">
                  {repo.license}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Commitment note */}
        <div className="os-footer-note">
          <span className="os-note-prefix">No metric inflation:</span> Repository metrics, stars, and contribution statistics are sourced directly from verified releases. We do not invent engagement figures.
        </div>
      </div>

      <style>{`
        .opensource-section {
          padding-block: var(--space-section);
          background: var(--color-graphite);
          border-top: 1px solid var(--color-border);
        }

        .os-container {
          max-width: var(--max-width-content);
          margin-inline: auto;
          padding-inline: var(--space-container);
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .os-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .os-header-text {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-width: 58ch;
        }

        .os-headline {
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: var(--color-text-primary);
        }

        .os-subtext {
          font-size: 1rem;
          line-height: 1.65;
          color: var(--color-text-secondary);
        }

        .os-view-all-link {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          color: var(--color-electric-blue);
          text-decoration: none;
          transition: opacity 0.2s;
          white-space: nowrap;
        }

        .os-view-all-link:hover {
          opacity: 0.8;
        }

        .os-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        .os-card {
          padding: 1.75rem;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: border-color 0.2s, background 0.2s;
        }

        .os-card:hover {
          border-color: rgba(91, 156, 255, 0.3);
          background: var(--color-elevated);
        }

        .os-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .os-category-tag {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-text-muted);
        }

        .os-repo-title {
          font-family: var(--font-mono);
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        .os-repo-link {
          color: var(--color-text-primary);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: color 0.2s;
        }

        .os-repo-link:hover {
          color: var(--color-electric-blue);
        }

        .os-gh-icon {
          color: var(--color-text-muted);
          flex-shrink: 0;
        }

        .os-repo-desc {
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--color-text-secondary);
          flex: 1;
        }

        .os-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid var(--color-border-subtle);
          font-family: var(--font-mono);
          font-size: 0.6875rem;
        }

        .os-tech-stack {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--color-text-muted);
        }

        .os-tech-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-intelligence-cyan);
        }

        .os-license-badge {
          color: var(--color-text-muted);
          background: rgba(255, 255, 255, 0.04);
          padding: 0.15rem 0.4rem;
          border-radius: 2px;
          border: 1px solid var(--color-border-subtle);
        }

        .os-footer-note {
          font-size: 0.8125rem;
          line-height: 1.6;
          color: var(--color-text-muted);
          padding: 0.875rem 1.25rem;
          background: rgba(255, 255, 255, 0.02);
          border-left: 2px solid var(--color-border);
          border-radius: 0 3px 3px 0;
          max-width: 64ch;
        }

        .os-note-prefix {
          font-family: var(--font-mono);
          font-weight: 600;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          font-size: 0.6875rem;
          letter-spacing: 0.05em;
        }

        @media (max-width: 1024px) {
          .os-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
