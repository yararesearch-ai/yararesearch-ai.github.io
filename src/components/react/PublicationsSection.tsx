// src/components/react/PublicationsSection.tsx
// Publications section with honest empty state

export default function PublicationsSection() {
  return (
    <section className="publications" aria-labelledby="publications-heading">
      <div className="pub-container">
        {/* Header */}
        <div className="pub-header-row">
          <div className="pub-header-text">
            <span className="research-id">Publications</span>
            <h2 id="publications-heading" className="pub-headline">
              Ideas become knowledge when they can be examined.
            </h2>
          </div>
          <a href="/publications" className="pub-view-all">
            View all publications →
          </a>
        </div>

        {/* Empty state — honest, well-designed */}
        <div className="pub-empty" aria-label="No publications available yet">
          <div className="pub-empty-visual" aria-hidden="true">
            <div className="pub-empty-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
          </div>

          <div className="pub-empty-content">
            <h3 className="pub-empty-title">Research in progress.</h3>
            <p className="pub-empty-body">
              YARA Research follows a rigorous publication lifecycle. Research papers,
              technical reports and working papers will appear here as projects progress
              through experimentation, review and publication approval.
            </p>
            <p className="pub-empty-body">
              We will not publish preliminary claims as completed research. Quality
              and reproducibility take precedence over velocity.
            </p>
          </div>

          {/* Publication types that will be supported */}
          <div className="pub-types">
            {[
              { label: 'Research Papers', desc: 'Peer-reviewed findings' },
              { label: 'Technical Reports', desc: 'Detailed experimental accounts' },
              { label: 'Working Papers', desc: 'Preliminary findings for review' },
              { label: 'Research Notes', desc: 'Observations and experiments' },
            ].map((type) => (
              <div key={type.label} className="pub-type">
                <span className="pub-type-label">{type.label}</span>
                <span className="pub-type-desc">{type.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .publications {
          padding-block: var(--space-section);
          background: var(--color-midnight-navy);
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }

        .pub-container {
          max-width: var(--max-width-content);
          margin-inline: auto;
          padding-inline: var(--space-container);
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .pub-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .pub-header-text {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .pub-headline {
          font-size: clamp(1.5rem, 2.5vw, 2.25rem);
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: var(--color-text-primary);
          max-width: 32ch;
        }

        .pub-view-all {
          font-size: 0.875rem;
          color: var(--color-electric-blue);
          text-decoration: none;
          white-space: nowrap;
          transition: opacity 0.2s;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }

        .pub-view-all:hover {
          opacity: 0.8;
        }

        /* Empty state */
        .pub-empty {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2rem;
          padding: 3rem;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          background: rgba(255,255,255,0.015);
        }

        .pub-empty-visual {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .pub-empty-icon {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          color: var(--color-text-muted);
          background: rgba(255,255,255,0.025);
        }

        .pub-empty-content {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-width: 58ch;
        }

        .pub-empty-title {
          font-family: var(--font-display);
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-text-primary);
          letter-spacing: -0.015em;
        }

        .pub-empty-body {
          font-size: 0.9375rem;
          line-height: 1.65;
          color: var(--color-text-secondary);
        }

        /* Publication type grid */
        .pub-types {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: var(--color-border);
          border: 1px solid var(--color-border);
          border-radius: 3px;
          overflow: hidden;
          width: 100%;
          max-width: 36rem;
        }

        .pub-type {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          padding: 1rem 1.25rem;
          background: var(--color-surface);
        }

        .pub-type-label {
          font-family: var(--font-display);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-primary);
          letter-spacing: -0.01em;
        }

        .pub-type-desc {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          font-family: var(--font-mono);
        }

        @media (max-width: 640px) {
          .pub-empty {
            padding: 2rem;
          }

          .pub-types {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
