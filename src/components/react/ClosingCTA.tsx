'use client';
import { useEffect, useRef, useState } from 'react';
import IntelligenceField from '../visualisations/IntelligenceField';

interface ClosingCTAProps {
  reducedMotion?: boolean;
}

export default function ClosingCTA({ reducedMotion = false }: ClosingCTAProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="closing" aria-label="Closing statement and call to action">
      {/* Background Intelligence Field — mini variant */}
      <div className="closing-field" aria-hidden="true">
        {mounted && (
          <IntelligenceField
            className="closing-canvas"
            reducedMotion={reducedMotion}
            variant="section"
          />
        )}
        <div className="closing-overlay" />
      </div>

      <div className="closing-content">
        <div className="closing-inner">
          <span className="closing-eyebrow research-id">The Intelligence Frontier</span>
          <h2 className="closing-headline">
            The frontier is not a destination.
            <br />
            <span className="closing-headline-dim">It is a question.</span>
          </h2>
          <p className="closing-body">
            We explore the questions that shape the next generation of intelligent systems.
            Independent research. Open science. Reproducible knowledge.
          </p>
          <div className="closing-ctas">
            <a href="/research" className="btn-primary-lg">
              Explore the Research Agenda
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="/about/charter" className="btn-ghost">
              Read the Founding Charter
            </a>
          </div>
        </div>

        {/* Decorative coordinates */}
        <div className="closing-coords" aria-hidden="true">
          <span>YR · P01–P06</span>
          <span>EST. 2026</span>
          <span>INDIA → GLOBAL</span>
        </div>
      </div>

      <style>{`
        .closing {
          position: relative;
          padding-block: calc(var(--space-section) * 1.5);
          background: var(--color-midnight-navy);
          border-top: 1px solid var(--color-border);
          overflow: hidden;
          text-align: center;
        }

        .closing-field {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0.6;
        }

        .closing-canvas {
          width: 100%;
          height: 100%;
        }

        .closing-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            transparent 0%,
            var(--color-midnight-navy) 80%
          );
        }

        .closing-content {
          position: relative;
          z-index: 1;
          max-width: var(--max-width-content);
          margin-inline: auto;
          padding-inline: var(--space-container);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2.5rem;
        }

        .closing-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          max-width: 46ch;
        }

        .closing-eyebrow {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          color: var(--color-electric-blue);
          text-transform: uppercase;
        }

        .closing-headline {
          font-size: clamp(2rem, 4.5vw, 3.5rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.15;
          color: var(--color-text-primary);
          text-align: center;
        }

        .closing-headline-dim {
          color: var(--color-electric-blue);
          font-weight: 700;
        }

        .closing-body {
          font-size: 1.0625rem;
          line-height: 1.65;
          color: var(--color-text-secondary);
          text-align: center;
        }

        .closing-ctas {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }

        .btn-primary-lg {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--color-electric-blue);
          color: #FFFFFF !important;
          font-family: var(--font-display);
          font-size: 0.9375rem;
          font-weight: 700;
          padding: 0.875rem 1.75rem;
          border-radius: 3px;
          letter-spacing: -0.01em;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(29, 78, 216, 0.25);
        }

        .btn-primary-lg:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(29, 78, 216, 0.4);
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-display);
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--color-text-primary);
          padding: 0.875rem 1.75rem;
          border-radius: 3px;
          border: 1px solid var(--color-border);
          background: var(--color-surface);
          letter-spacing: -0.01em;
          transition: all 0.2s ease;
          text-decoration: none;
          box-shadow: var(--shadow-card);
        }

        .btn-ghost:hover {
          border-color: var(--color-electric-blue);
          color: var(--color-electric-blue);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(29, 78, 216, 0.15);
        }
          transition: color 0.2s, border-color 0.2s, background 0.2s;
          text-decoration: none;
        }

        .btn-ghost:hover {
          color: var(--color-text-primary);
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.04);
        }

        .closing-coords {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          font-family: var(--font-mono);
          font-size: 0.6rem;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          opacity: 0.5;
        }

        @media (max-width: 640px) {
          .closing-coords {
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.75rem;
          }
        }
      `}</style>
    </section>
  );
}
