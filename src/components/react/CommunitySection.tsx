// src/components/react/CommunitySection.tsx

const CONTRIBUTION_PATHS = [
  {
    id: 'RO',
    title: 'Research Observer',
    commitment: 'Flexible',
    description:
      'Follow active research projects, review literature and provide feedback on published findings. Open to students and enthusiasts interested in AI research.',
    availability: 'planned' as const,
  },
  {
    id: 'RC',
    title: 'Research Contributor',
    commitment: '3–5 hrs/week',
    description:
      'Conduct experiments, implement prototypes, review code and contribute to open-source research tools. For engineers and researchers with relevant technical background.',
    availability: 'planned' as const,
  },
  {
    id: 'RF',
    title: 'Research Fellow',
    commitment: 'Project-based',
    description:
      'Take ownership of a research workstream within an active project. Requires sustained commitment and results in co-authorship of published outputs.',
    availability: 'future' as const,
  },
  {
    id: 'PL',
    title: 'Programme Lead',
    commitment: 'Programme-based',
    description:
      'Lead research direction within one of the six programmes. Senior role requiring deep domain expertise and long-term commitment.',
    availability: 'future' as const,
  },
  {
    id: 'ER',
    title: 'External Reviewer',
    commitment: 'Per review',
    description:
      'Provide independent technical and methodological review of research before publication. For experienced researchers in relevant domains.',
    availability: 'planned' as const,
  },
];

const AVAILABILITY_STYLES = {
  planned: { label: 'Planned', color: '#5B9CFF', border: 'rgba(91,156,255,0.25)', bg: 'rgba(91,156,255,0.06)' },
  future: { label: 'Future', color: '#687386', border: 'rgba(104,115,134,0.25)', bg: 'rgba(104,115,134,0.04)' },
  open: { label: 'Open', color: '#56D9E8', border: 'rgba(86,217,232,0.25)', bg: 'rgba(86,217,232,0.06)' },
};

export default function CommunitySection() {
  return (
    <section className="community" aria-labelledby="community-heading">
      <div className="community-container">
        <div className="community-header">
          <span className="research-id">Community</span>
          <h2 id="community-heading" className="community-headline">
            Intelligence advances through collaboration.
          </h2>
          <p className="community-subtext">
            YARA Research is designed to operate as a distributed, globally connected
            research community. Researchers, engineers, students and independent
            contributors are welcome, regardless of geography or institutional affiliation.
          </p>
        </div>

        {/* Contribution paths */}
        <div className="community-paths" aria-label="Contribution paths">
          {CONTRIBUTION_PATHS.map((path) => {
            const style = AVAILABILITY_STYLES[path.availability];
            return (
              <div key={path.id} className="path-item">
                <div className="path-meta">
                  <span className="path-id">{path.id}</span>
                  <span
                    className="path-availability"
                    style={{ color: style.color, borderColor: style.border, background: style.bg }}
                  >
                    {style.label}
                  </span>
                </div>
                <h3 className="path-title">{path.title}</h3>
                <div className="path-commitment">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {path.commitment}
                </div>
                <p className="path-description">{path.description}</p>
              </div>
            );
          })}
        </div>

        {/* Important disclosure */}
        <div className="community-disclosure">
          <div className="disclosure-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p className="disclosure-text">
            Contribution roles are currently in planning. These are voluntary collaboration
            roles, not employment positions. When participation opens, clear agreements
            covering IP ownership, attribution, licensing and contribution expectations
            will be published. Follow our GitHub organisation for updates.
          </p>
        </div>

        <div className="community-action">
          <a
            href="https://github.com/yararesearch-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary-sm"
          >
            Follow on GitHub
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
          <a href="/community" className="btn-secondary-sm">
            Learn more about collaboration
          </a>
        </div>
      </div>

      <style>{`
        .community {
          padding-block: var(--space-section);
          background: var(--color-graphite);
        }

        .community-container {
          max-width: var(--max-width-content);
          margin-inline: auto;
          padding-inline: var(--space-container);
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .community-header {
          max-width: 54ch;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .community-headline {
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: var(--color-text-primary);
        }

        .community-subtext {
          font-size: 1rem;
          line-height: 1.65;
          color: var(--color-text-secondary);
        }

        /* Contribution paths */
        .community-paths {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1px;
          background: var(--color-border);
          border: 1px solid var(--color-border);
          border-radius: 4px;
          overflow: hidden;
        }

        .path-item {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1.5rem;
          background: var(--color-surface);
          transition: background 0.2s;
        }

        .path-item:hover {
          background: var(--color-elevated);
        }

        .path-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .path-id {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--color-electric-blue);
        }

        .path-availability {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.2rem 0.4rem;
          border: 1px solid;
          border-radius: 2px;
        }

        .path-title {
          font-family: var(--font-display);
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--color-text-primary);
          letter-spacing: -0.015em;
          line-height: 1.25;
        }

        .path-commitment {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          color: var(--color-text-muted);
        }

        .path-description {
          font-size: 0.8125rem;
          line-height: 1.6;
          color: var(--color-text-secondary);
        }

        /* Disclosure */
        .community-disclosure {
          display: flex;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          background: rgba(255,255,255,0.025);
          border-left: 2px solid var(--color-border);
          border-radius: 0 2px 2px 0;
          max-width: 64ch;
        }

        .disclosure-icon {
          color: var(--color-text-muted);
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .disclosure-text {
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--color-text-muted);
        }

        /* Actions */
        .community-action {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-primary-sm {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(91, 156, 255, 0.12);
          color: var(--color-electric-blue);
          border: 1px solid rgba(91, 156, 255, 0.3);
          font-family: var(--font-display);
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.625rem 1.25rem;
          border-radius: 3px;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s;
        }

        .btn-primary-sm:hover {
          background: rgba(91, 156, 255, 0.18);
          border-color: rgba(91, 156, 255, 0.5);
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

        @media (max-width: 1200px) {
          .community-paths {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .community-paths {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .community-paths {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
