// src/components/react/ResearchLifecycle.tsx
// Interactive research lifecycle diagram — custom SVG/CSS implementation
// Responsive, accessible, mobile-friendly

const LIFECYCLE_STEPS = [
  { id: '01', label: 'Research Idea', desc: 'A question worth investigating' },
  { id: '02', label: 'Initial Screening', desc: 'Feasibility and alignment check' },
  { id: '03', label: 'Literature Review', desc: 'Survey of existing work' },
  { id: '04', label: 'Research Proposal', desc: 'Hypothesis and methodology' },
  { id: '05', label: 'Methodology Review', desc: 'Internal quality check' },
  { id: '06', label: 'Experimentation', desc: 'Controlled experiments' },
  { id: '07', label: 'Results & Evaluation', desc: 'Analysis and interpretation' },
  { id: '08', label: 'Reproducibility Review', desc: 'Independent verification' },
  { id: '09', label: 'Independent Review', desc: 'External technical review' },
  { id: '10', label: 'Publication Approval', desc: 'Final quality gate' },
  { id: '11', label: 'Public Release', desc: 'Open publication' },
  { id: '12', label: 'Post-publication Review', desc: 'Ongoing community review' },
] as const;

export default function ResearchLifecycle() {
  return (
    <section className="lifecycle" aria-labelledby="lifecycle-heading">
      <div className="lifecycle-container">
        <div className="lifecycle-header">
          <span className="research-id">Research Process</span>
          <h2 id="lifecycle-heading" className="lifecycle-headline">
            From idea to verified knowledge.
          </h2>
          <p className="lifecycle-subtext">
            Every YARA Research project passes through a defined lifecycle: from
            initial idea through experimentation, independent review and public release.
            Research governance ensures quality, reproducibility and integrity at each stage.
          </p>
        </div>

        {/* Desktop: horizontal serpentine / Mobile: vertical list */}
        <div className="lifecycle-diagram" role="list" aria-label="Research lifecycle stages">
          {LIFECYCLE_STEPS.map((step, i) => {
            const isLast = i === LIFECYCLE_STEPS.length - 1;
            return (
              <div key={step.id} className="lifecycle-step" role="listitem">
                {/* Node */}
                <div className="step-node" aria-label={`Step ${step.id}: ${step.label}`}>
                  <div className="step-node-inner">
                    <span className="step-number">{step.id}</span>
                  </div>
                </div>

                {/* Label */}
                <div className="step-label-block">
                  <span className="step-label">{step.label}</span>
                  <span className="step-desc">{step.desc}</span>
                </div>

                {/* Connector */}
                {!isLast && (
                  <div className="step-connector" aria-hidden="true">
                    <svg width="24" height="8" viewBox="0 0 24 8" fill="none" className="step-arrow">
                      <path d="M0 4h20M16 1l4 3-4 3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Note */}
        <p className="lifecycle-note">
          <span className="lifecycle-note-label">Note:</span>{' '}
          A project may return to experimentation if results are not reproducible.
          Negative findings and limitations are always published alongside positive results.
        </p>
      </div>

      <style>{`
        .lifecycle {
          padding-block: var(--space-section);
          background: var(--color-graphite);
        }

        .lifecycle-container {
          max-width: var(--max-width-content);
          margin-inline: auto;
          padding-inline: var(--space-container);
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .lifecycle-header {
          max-width: 54ch;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .lifecycle-headline {
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: var(--color-text-primary);
        }

        .lifecycle-subtext {
          font-size: 1rem;
          line-height: 1.65;
          color: var(--color-text-secondary);
        }

        /* Diagram — flows in a grid */
        .lifecycle-diagram {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          background: var(--color-border);
          overflow: hidden;
        }

        .lifecycle-step {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1.5rem;
          background: var(--color-surface);
          position: relative;
          transition: background 0.2s ease;
        }

        .lifecycle-step:hover {
          background: var(--color-elevated);
        }

        /* Node */
        .step-node {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(91, 156, 255, 0.08);
          border: 1px solid rgba(91, 156, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-node-inner {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(91, 156, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-number {
          font-family: var(--font-mono);
          font-size: 0.5625rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: var(--color-electric-blue);
        }

        /* Labels */
        .step-label-block {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .step-label {
          font-family: var(--font-display);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-primary);
          letter-spacing: -0.01em;
          line-height: 1.25;
        }

        .step-desc {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          line-height: 1.4;
        }

        /* Connector arrow — shows on desktop between cells */
        .step-connector {
          display: none;
        }

        /* Note */
        .lifecycle-note {
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--color-text-muted);
          padding: 1rem 1.25rem;
          background: rgba(255,255,255,0.025);
          border-left: 2px solid var(--color-border);
          border-radius: 0 2px 2px 0;
          max-width: 64ch;
        }

        .lifecycle-note-label {
          font-weight: 600;
          color: var(--color-text-secondary);
        }

        @media (max-width: 1024px) {
          .lifecycle-diagram {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 640px) {
          .lifecycle-diagram {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 400px) {
          .lifecycle-diagram {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
