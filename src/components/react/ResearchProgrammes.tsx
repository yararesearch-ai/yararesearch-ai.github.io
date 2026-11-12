'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { RESEARCH_PROGRAMMES } from '../../data/research';

const ACCENT_STYLES = {
  blue: {
    border: 'rgba(91, 156, 255, 0.25)',
    bg: 'rgba(91, 156, 255, 0.05)',
    text: '#5B9CFF',
    glow: 'rgba(91, 156, 255, 0.12)',
  },
  cyan: {
    border: 'rgba(86, 217, 232, 0.25)',
    bg: 'rgba(86, 217, 232, 0.05)',
    text: '#56D9E8',
    glow: 'rgba(86, 217, 232, 0.08)',
  },
  violet: {
    border: 'rgba(139, 131, 255, 0.25)',
    bg: 'rgba(139, 131, 255, 0.05)',
    text: '#8B83FF',
    glow: 'rgba(139, 131, 255, 0.08)',
  },
};

const ICONS: Record<string, JSX.Element> = {
  brain: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.16z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.16z"/>
    </svg>
  ),
  network: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="5" r="2"/><circle cx="19" cy="17" r="2"/><circle cx="5" cy="17" r="2"/>
      <path d="M12 7v4M5.5 15.5l5-3M18.5 15.5l-5-3"/>
    </svg>
  ),
  code: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  cpu: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/>
      <path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2"/>
    </svg>
  ),
  database: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
    </svg>
  ),
  shield: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
};

export default function ResearchProgrammes() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="programmes" aria-labelledby="programmes-heading">
      <div className="programmes-container">
        {/* Header */}
        <div className="programmes-header">
          <span className="research-id">Research Programmes</span>
          <h2 id="programmes-heading" className="programmes-headline">
            Six research directions.{' '}
            <span className="programmes-headline-dim">One research mission.</span>
          </h2>
          <p className="programmes-subheadline">
            YARA Research investigates AI through six interlocking programmes,
            each exploring a distinct dimension of intelligent systems.
          </p>
        </div>

        {/* Landscape grid */}
        <div className="programmes-grid" role="list">
          {RESEARCH_PROGRAMMES.map((prog, index) => {
            const accent = ACCENT_STYLES[prog.accent];
            const isHovered = hoveredId === prog.id;

            return (
              <motion.article
                key={prog.id}
                className="programme-card"
                role="listitem"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
                onMouseEnter={() => setHoveredId(prog.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(prog.id)}
                onBlur={() => setHoveredId(null)}
                style={{
                  borderColor: isHovered ? accent.border : 'var(--color-border)',
                  background: isHovered
                    ? `linear-gradient(135deg, ${accent.bg}, transparent)`
                    : 'var(--color-surface)',
                  boxShadow: isHovered ? `0 0 32px ${accent.glow}` : 'none',
                }}
              >
                {/* Programme ID */}
                <div className="programme-meta">
                  <span
                    className="programme-id"
                    style={{ color: accent.text }}
                  >
                    {prog.id}
                  </span>
                  <span
                    className="programme-status"
                    style={{ color: accent.text, borderColor: accent.border, background: accent.bg }}
                  >
                    ● {prog.status}
                  </span>
                </div>

                {/* Icon + Title */}
                <div className="programme-title-row">
                  <span
                    className="programme-icon"
                    style={{ color: accent.text }}
                  >
                    {ICONS[prog.icon]}
                  </span>
                  <h3 className="programme-title">{prog.shortTitle}</h3>
                </div>

                {/* Description */}
                <p className="programme-description">{prog.description}</p>

                {/* Research areas */}
                <ul className="programme-areas" aria-label="Research areas">
                  {prog.researchAreas.slice(0, 3).map((area) => (
                    <li key={area} className="programme-area">
                      <span className="programme-area-dot" style={{ color: accent.text }}>·</span>
                      {area}
                    </li>
                  ))}
                  {prog.researchAreas.length > 3 && (
                    <li className="programme-area programme-area--more">
                      +{prog.researchAreas.length - 3} more
                    </li>
                  )}
                </ul>

                {/* Link */}
                <a
                  href={`/research/programmes/${prog.slug}`}
                  className="programme-link"
                  style={{ color: accent.text }}
                  aria-label={`Explore ${prog.title} research programme`}
                >
                  Explore programme
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </motion.article>
            );
          })}
        </div>

        {/* View all link */}
        <div className="programmes-footer">
          <a href="/research/programmes" className="btn-secondary-sm">
            View all research programmes
          </a>
        </div>
      </div>

      <style>{`
        .programmes {
          padding-block: var(--space-section);
          background: var(--color-graphite);
        }

        .programmes-container {
          max-width: var(--max-width-content);
          margin-inline: auto;
          padding-inline: var(--space-container);
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .programmes-header {
          max-width: 54ch;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .programmes-headline {
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: var(--color-text-primary);
        }

        .programmes-headline-dim {
          color: var(--color-text-muted);
          font-weight: 400;
        }

        .programmes-subheadline {
          font-size: 1rem;
          line-height: 1.65;
          color: var(--color-text-secondary);
        }

        /* Grid — 3 columns on desktop */
        .programmes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--color-border);
          border: 1px solid var(--color-border);
          border-radius: 4px;
          overflow: hidden;
        }

        .programme-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.75rem;
          background: var(--color-surface);
          transition: background 0.25s ease,
                      border-color 0.25s ease,
                      box-shadow 0.25s ease;
          cursor: default;
        }

        .programme-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .programme-id {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.1em;
        }

        .programme-status {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.2rem 0.5rem;
          border: 1px solid;
          border-radius: 2px;
        }

        .programme-title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .programme-icon {
          flex-shrink: 0;
        }

        .programme-title {
          font-family: var(--font-display);
          font-size: 1.0625rem;
          font-weight: 600;
          letter-spacing: -0.015em;
          color: var(--color-text-primary);
          line-height: 1.25;
        }

        .programme-description {
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--color-text-secondary);
          flex: 1;
        }

        .programme-areas {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .programme-area {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          font-size: 0.8125rem;
          color: var(--color-text-muted);
          font-family: var(--font-mono);
        }

        .programme-area-dot {
          font-size: 1rem;
          line-height: 1;
        }

        .programme-area--more {
          color: var(--color-text-muted);
          opacity: 0.6;
        }

        .programme-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          font-weight: 500;
          margin-top: auto;
          transition: gap 0.2s ease;
          text-decoration: none;
        }

        .programme-link:hover {
          gap: 0.75rem;
        }

        .programmes-footer {
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

        @media (max-width: 1024px) {
          .programmes-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .programmes-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
