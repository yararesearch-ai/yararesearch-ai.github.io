'use client';
import { useEffect, useRef, useState } from 'react';
import IntelligenceField from '../visualisations/IntelligenceField';

interface HeroProps {
  reducedMotion?: boolean;
}

const META_TAGS = ['INDEPENDENT RESEARCH', 'AI SYSTEMS', 'OPEN COLLABORATION'];

export default function Hero({ reducedMotion = false }: HeroProps) {
  const [mounted, setMounted] = useState(false);
  const [visibleTag, setVisibleTag] = useState(0);

  useEffect(() => {
    setMounted(true);

    if (reducedMotion) return;

    const id = setInterval(() => {
      setVisibleTag((v) => (v + 1) % META_TAGS.length);
    }, 2800);

    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <section className="hero" aria-label="YARA Research introduction">
      {/* Intelligence Field canvas — full viewport background */}
      <div className="hero-field" aria-hidden="true">
        {mounted && (
          <IntelligenceField
            className="hero-canvas"
            nodeCount={65}
            reducedMotion={reducedMotion}
            variant="hero"
          />
        )}
        {/* Gradient overlays to blend field into page */}
        <div className="hero-field-overlay hero-field-overlay--bottom" />
        <div className="hero-field-overlay hero-field-overlay--left" />
      </div>

      {/* Content */}
      <div className="hero-content">
        {/* Research coordinate + status */}
        <div className="hero-meta" aria-label="Organisation metadata">
          <span className="hero-coord">YR · 2026 · EST.</span>
          <span className="hero-sep" aria-hidden="true">·</span>
          <span className="hero-rotating-tag" aria-live="polite" aria-atomic="true">
            {META_TAGS[visibleTag]}
          </span>
        </div>

        {/* Headline */}
        <h1 className="hero-headline">
          Exploring the next generation
          <br />
          <span className="hero-headline-accent">of intelligent systems.</span>
        </h1>

        {/* Supporting text */}
        <p className="hero-body">
          YARA Research is an independent AI research and engineering initiative
          exploring the foundations, architectures and emerging possibilities of
          intelligent systems.
        </p>

        {/* CTAs */}
        <div className="hero-ctas">
          <a href="/research" className="btn-primary">
            Explore Research
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a href="/open-source" className="btn-secondary">
            Discover Open Source
          </a>
        </div>

        {/* Programme count — honest, no fake metrics */}
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">6</span>
            <span className="hero-stat-label">Research Programmes</span>
          </div>
          <div className="hero-stat-sep" aria-hidden="true"/>
          <div className="hero-stat">
            <span className="hero-stat-value">3</span>
            <span className="hero-stat-label">Flagship Projects</span>
          </div>
          <div className="hero-stat-sep" aria-hidden="true"/>
          <div className="hero-stat">
            <span className="hero-stat-value">Open</span>
            <span className="hero-stat-label">Collaboration</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll" aria-hidden="true">
        <div className="hero-scroll-line" />
        <span className="hero-scroll-label">scroll</span>
      </div>

      <style>{`
        .hero {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: var(--color-graphite);
          padding-top: var(--nav-height);
        }

        /* Intelligence Field */
        .hero-field {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero-canvas {
          width: 100%;
          height: 100%;
        }

        .hero-field-overlay {
          position: absolute;
          pointer-events: none;
        }

        .hero-field-overlay--bottom {
          bottom: 0;
          left: 0;
          right: 0;
          height: 40%;
          background: linear-gradient(to top, var(--color-graphite) 0%, transparent 100%);
        }

        .hero-field-overlay--left {
          top: 0;
          bottom: 0;
          left: 0;
          width: 35%;
          background: linear-gradient(to right, var(--color-hero-overlay) 0%, transparent 100%);
        }

        /* Content */
        .hero-content {
          position: relative;
          z-index: 1;
          max-width: var(--max-width-content);
          margin-inline: auto;
          padding-inline: var(--space-container);
          padding-block: 5rem 6rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.75rem;
          max-width: 56rem;
        }

        /* Meta row */
        .hero-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .hero-coord {
          color: var(--color-text-muted);
        }

        .hero-sep {
          color: var(--color-border);
        }

        .hero-rotating-tag {
          color: var(--color-electric-blue);
          transition: opacity 0.4s ease;
        }

        /* Headline */
        .hero-headline {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 700;
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: var(--color-text-primary);
          max-width: 16ch;
        }

        .hero-headline-accent {
          color: var(--color-electric-blue);
        }

        /* Body */
        .hero-body {
          font-size: clamp(1rem, 1.5vw, 1.125rem);
          line-height: 1.7;
          color: var(--color-text-secondary);
          max-width: 50ch;
        }

        /* CTAs */
        .hero-ctas {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--color-electric-blue);
          color: #090B10;
          font-family: var(--font-display);
          font-size: 0.9375rem;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 3px;
          letter-spacing: -0.01em;
          transition: background var(--duration-fast),
                      transform var(--duration-fast),
                      box-shadow var(--duration-fast);
          text-decoration: none;
        }

        .btn-primary:hover {
          background: #7ab0ff;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(91, 156, 255, 0.3);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-display);
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          padding: 0.75rem 1.5rem;
          border-radius: 3px;
          border: 1px solid var(--color-border);
          letter-spacing: -0.01em;
          transition: color var(--duration-fast),
                      border-color var(--duration-fast),
                      background var(--duration-fast);
          text-decoration: none;
        }

        .btn-secondary:hover {
          color: var(--color-text-primary);
          border-color: rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.04);
        }

        /* Stats */
        .hero-stats {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding-top: 0.5rem;
        }

        .hero-stat {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .hero-stat-value {
          font-family: var(--font-display);
          font-size: 1.375rem;
          font-weight: 700;
          color: var(--color-text-primary);
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .hero-stat-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-text-muted);
        }

        .hero-stat-sep {
          width: 1px;
          height: 2.5rem;
          background: var(--color-border);
          flex-shrink: 0;
        }

        /* Scroll indicator */
        .hero-scroll {
          position: absolute;
          bottom: 2rem;
          right: var(--space-container);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          z-index: 1;
        }

        .hero-scroll-line {
          width: 1px;
          height: 3rem;
          background: linear-gradient(
            to bottom,
            transparent,
            var(--color-electric-blue) 50%,
            transparent
          );
          animation: scrollPulse 2s ease-in-out infinite;
        }

        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
          50% { opacity: 1; transform: scaleY(1); }
        }

        .hero-scroll-label {
          font-family: var(--font-mono);
          font-size: 0.5625rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          writing-mode: vertical-rl;
        }

        @media (max-width: 768px) {
          .hero-content {
            gap: 1.25rem;
            padding-block: 3.5rem 5rem;
          }

          .hero-scroll {
            display: none;
          }

          .hero-stats {
            gap: 1rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-scroll-line {
            animation: none;
            opacity: 0.5;
          }
        }
      `}</style>
    </section>
  );
}
