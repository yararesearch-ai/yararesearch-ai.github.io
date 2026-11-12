// src/components/react/ResearchPhilosophy.tsx
import { FOUNDING_PRINCIPLES } from '../../data/site';

export default function ResearchPhilosophy() {
  return (
    <section className="philosophy" aria-labelledby="philosophy-heading">
      <div className="philosophy-container">
        {/* Editorial header — asymmetric layout */}
        <div className="philosophy-header">
          <div className="philosophy-label-col">
            <span className="philosophy-label research-id">Research Philosophy</span>
          </div>
          <div className="philosophy-heading-col">
            <h2 id="philosophy-heading" className="philosophy-headline">
              Understanding intelligence.{' '}
              <span className="philosophy-headline-secondary">
                Engineering what comes next.
              </span>
            </h2>
          </div>
        </div>

        {/* Body text */}
        <div className="philosophy-body-row">
          <div className="philosophy-body-spacer" />
          <div className="philosophy-body-text">
            <p>
              YARA Research investigates the fundamental principles and practical
              engineering of intelligent systems. We approach AI through the lens of
              rigorous research: forming hypotheses, designing experiments, publishing
              findings and releasing reproducible implementations.
            </p>
            <p>
              Our independence from commercial constraints allows us to explore questions
              that matter for the long-term development of AI, not only the ones that
              are immediately profitable.
            </p>
          </div>
        </div>

        {/* Three principles — editorial layout, not a card grid */}
        <div className="philosophy-principles" aria-label="Founding principles">
          {FOUNDING_PRINCIPLES.map((principle, i) => (
            <div key={principle.id} className="principle">
              <div className="principle-index">
                <span className="principle-number">{principle.id}</span>
                <div className="principle-line" aria-hidden="true" />
              </div>
              <div className="principle-content">
                <h3 className="principle-title">{principle.title}</h3>
                <p className="principle-description">{principle.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .philosophy {
          background: var(--color-midnight-navy);
          padding-block: var(--space-section);
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }

        .philosophy-container {
          max-width: var(--max-width-content);
          margin-inline: auto;
          padding-inline: var(--space-container);
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        /* Asymmetric header */
        .philosophy-header {
          display: grid;
          grid-template-columns: 160px 1fr;
          gap: 3rem;
          align-items: start;
        }

        .philosophy-label-col {
          padding-top: 0.5rem;
        }

        .philosophy-label {
          display: block;
        }

        .philosophy-headline {
          font-size: clamp(1.75rem, 3.5vw, 2.75rem);
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: var(--color-text-primary);
        }

        .philosophy-headline-secondary {
          color: var(--color-text-secondary);
          font-weight: 400;
        }

        /* Body text row — offset to match heading */
        .philosophy-body-row {
          display: grid;
          grid-template-columns: 160px 1fr;
          gap: 3rem;
        }

        .philosophy-body-spacer {
          /* intentional empty cell for alignment */
        }

        .philosophy-body-text {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 58ch;
        }

        .philosophy-body-text p {
          font-size: 1rem;
          line-height: 1.75;
          color: var(--color-text-secondary);
        }

        /* Principles */
        .philosophy-principles {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          border-top: 1px solid var(--color-border);
          margin-top: 1rem;
        }

        .principle {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 2.5rem 2rem 2.5rem 0;
          border-right: 1px solid var(--color-border);
        }

        .principle:last-child {
          border-right: none;
          padding-right: 0;
        }

        .principle:not(:first-child) {
          padding-left: 2rem;
        }

        .principle-index {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .principle-number {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: var(--color-electric-blue);
        }

        .principle-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(
            to right,
            rgba(91, 156, 255, 0.4),
            transparent
          );
        }

        .principle-title {
          font-family: var(--font-display);
          font-size: 1.125rem;
          font-weight: 600;
          letter-spacing: -0.015em;
          color: var(--color-text-primary);
          line-height: 1.3;
        }

        .principle-description {
          font-size: 0.9375rem;
          line-height: 1.65;
          color: var(--color-text-secondary);
        }

        @media (max-width: 1024px) {
          .philosophy-header,
          .philosophy-body-row {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .philosophy-body-spacer {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .philosophy-principles {
            grid-template-columns: 1fr;
          }

          .principle {
            border-right: none;
            border-bottom: 1px solid var(--color-border);
            padding: 2rem 0;
          }

          .principle:last-child {
            border-bottom: none;
          }

          .principle:not(:first-child) {
            padding-left: 0;
          }
        }
      `}</style>
    </section>
  );
}
