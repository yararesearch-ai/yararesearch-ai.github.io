'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RESEARCH_PROGRAMMES, RESEARCH_PROJECTS, PUBLICATIONS } from '../../data/research';

type NodeType = 'all' | 'programmes' | 'projects' | 'publications' | 'code';

export default function ResearchAtlas() {
  const [selectedType, setSelectedType] = useState<NodeType>('all');
  const [activeNode, setActiveNode] = useState<string | null>('YR-001');

  // Related node mapping
  const connections: Record<string, { title: string; type: string; url: string; relatesTo: string[] }> = {
    'P01': { title: 'Intelligence & Reasoning', type: 'Programme', url: '/research/programmes/intelligence-reasoning', relatesTo: ['YR-001'] },
    'P02': { title: 'Agentic & Agentless Systems', type: 'Programme', url: '/research/programmes/agentic-agentless-systems', relatesTo: ['YR-001', 'YR-002', 'YR-WP-2026-001', 'repo-benchmarks', 'repo-runtime'] },
    'P03': { title: 'AI Engineering & Software Systems', type: 'Programme', url: '/research/programmes/ai-engineering-software-systems', relatesTo: ['YR-002'] },
    'P04': { title: 'Local AI & Efficient Intelligence', type: 'Programme', url: '/research/programmes/local-ai-efficient-intelligence', relatesTo: ['YR-003', 'repo-local'] },
    'P05': { title: 'Knowledge, Context & Memory', type: 'Programme', url: '/research/programmes/knowledge-context-memory', relatesTo: ['YR-002', 'YR-003'] },
    'P06': { title: 'AI Safety, Evaluation & Governance', type: 'Programme', url: '/research/programmes/ai-safety-evaluation-governance', relatesTo: ['YR-001', 'repo-benchmarks'] },

    'YR-001': { title: 'Beyond Agentic AI', type: 'Project', url: '/research/projects/beyond-agentic-ai', relatesTo: ['P02', 'P06', 'YR-WP-2026-001', 'repo-benchmarks'] },
    'YR-002': { title: 'Lightweight AI Runtime', type: 'Project', url: '/research/projects/lightweight-ai-runtime', relatesTo: ['P02', 'P03', 'P05', 'repo-runtime'] },
    'YR-003': { title: 'Efficient Local Intelligence', type: 'Project', url: '/research/projects/efficient-local-intelligence', relatesTo: ['P04', 'P05', 'repo-local'] },

    'YR-WP-2026-001': { title: 'Beyond Agentic AI (Working Paper)', type: 'Publication', url: '/publications/beyond-agentic-ai-architectures', relatesTo: ['YR-001', 'P02'] },

    'repo-benchmarks': { title: 'beyond-agentic-benchmarks', type: 'Repository', url: 'https://github.com/yararesearch-ai', relatesTo: ['YR-001', 'P02', 'P06'] },
    'repo-runtime': { title: 'lightweight-ai-runtime', type: 'Repository', url: 'https://github.com/yararesearch-ai', relatesTo: ['YR-002', 'P02', 'P03'] },
    'repo-local': { title: 'local-intelligence-toolkit', type: 'Repository', url: 'https://github.com/yararesearch-ai', relatesTo: ['YR-003', 'P04'] },
  };

  const activeRelations = activeNode ? connections[activeNode]?.relatesTo || [] : [];

  return (
    <div className="atlas-root" aria-label="Interactive YARA Research Atlas">
      {/* Controls & Filter */}
      <div className="atlas-toolbar">
        <div className="atlas-intro">
          <span className="research-id">Visual Network</span>
          <h3 className="atlas-heading">The Research Atlas</h3>
        </div>
        <div className="atlas-filter-pills" role="tablist" aria-label="Filter node types">
          {(['all', 'programmes', 'projects', 'publications', 'code'] as NodeType[]).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={selectedType === tab}
              className={`atlas-pill ${selectedType === tab ? 'atlas-pill--active' : ''}`}
              onClick={() => setSelectedType(tab)}
            >
              <span className="atlas-pill-label">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
              {selectedType === tab && (
                <motion.div
                  layoutId="atlas-pill-active-indicator"
                  className="atlas-pill-active-indicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Nodes Landscape Grid */}
      <div className="atlas-landscape">
        <div className="atlas-nodes-grid">
          <AnimatePresence mode="popLayout">
            {Object.entries(connections)
              .filter(([id, item]) => {
                if (selectedType === 'programmes') return item.type === 'Programme';
                if (selectedType === 'projects') return item.type === 'Project';
                if (selectedType === 'publications') return item.type === 'Publication';
                if (selectedType === 'code') return item.type === 'Repository';
                return true;
              })
              .map(([id, item]) => {
                const isSelected = activeNode === id;
                const isRelated = activeRelations.includes(id);

                return (
                  <motion.button
                    key={id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    type="button"
                    onClick={() => setActiveNode(id)}
                    className={`atlas-node-card ${isSelected ? 'atlas-node--selected' : ''} ${isRelated ? 'atlas-node--related' : ''}`}
                    aria-pressed={isSelected}
                  >
                    <div className="node-badge-row">
                      <span className="node-type-label">{item.type}</span>
                      <span className="node-id-label">{id}</span>
                    </div>
                    <div className="node-title">{item.title}</div>
                    {isSelected && (
                      <span className="node-active-indicator">Focused Node</span>
                    )}
                    {isRelated && !isSelected && (
                      <span className="node-related-indicator">Connected</span>
                    )}
                  </motion.button>
                );
              })}
          </AnimatePresence>
        </div>

        {/* Selected Node Details Panel */}
        <AnimatePresence mode="wait">
          {activeNode && connections[activeNode] && (
            <motion.aside
              key={activeNode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
              className="atlas-inspector"
              aria-label="Selected node details"
            >
            <div className="inspector-header">
              <span className="inspector-type">{connections[activeNode].type}</span>
              <span className="inspector-id">{activeNode}</span>
            </div>
            <h4 className="inspector-title">{connections[activeNode].title}</h4>

            <div className="inspector-relations">
              <span className="relations-label">Connected Research Entities:</span>
              <div className="relations-tags">
                {connections[activeNode].relatesTo.map((relId) => {
                  const rel = connections[relId];
                  if (!rel) return null;
                  return (
                    <button
                      key={relId}
                      type="button"
                      onClick={() => setActiveNode(relId)}
                      className="relation-pill"
                    >
                      <span className="rel-type">{rel.type}:</span> {rel.title}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="inspector-actions">
              <a
                href={connections[activeNode].url}
                className="inspector-explore-btn"
                target={connections[activeNode].url.startsWith('http') ? '_blank' : undefined}
                rel={connections[activeNode].url.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                Inspect Documentation →
              </a>
            </div>
          </motion.aside>
        )}
        </AnimatePresence>
      </div>

      <style>{`
        .atlas-root {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 2rem;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 4px;
        }

        .atlas-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          flex-wrap: wrap;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--color-border);
        }

        .atlas-intro {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .atlas-heading {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .atlas-filter-pills {
          display: flex;
          gap: 0.35rem;
          flex-wrap: wrap;
        }

        .atlas-pill {
          position: relative;
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0.35rem 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--color-border);
          border-radius: 2px;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: color 0.2s;
          overflow: hidden;
        }

        .atlas-pill-label {
          position: relative;
          z-index: 2;
        }

        .atlas-pill-active-indicator {
          position: absolute;
          inset: 0;
          background: rgba(91, 156, 255, 0.12);
          border: 1px solid rgba(91, 156, 255, 0.5);
          border-radius: 2px;
          z-index: 1;
          pointer-events: none;
        }

        .atlas-pill:hover {
          color: var(--color-text-primary);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .atlas-pill--active {
          color: var(--color-electric-blue);
          border-color: transparent;
        }

        .atlas-landscape {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 1.5rem;
          align-items: start;
        }

        .atlas-nodes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }

        .atlas-node-card {
          padding: 1rem;
          background: var(--color-midnight-navy);
          border: 1px solid var(--color-border);
          border-radius: 3px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }

        .atlas-node-card:hover {
          border-color: rgba(91, 156, 255, 0.3);
          background: var(--color-elevated);
        }

        .atlas-node--selected {
          border-color: var(--color-electric-blue) !important;
          background: rgba(91, 156, 255, 0.08) !important;
          box-shadow: 0 0 16px rgba(91, 156, 255, 0.15);
        }

        .atlas-node--related {
          border-color: rgba(86, 217, 232, 0.4);
          background: rgba(86, 217, 232, 0.04);
        }

        .node-badge-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .node-type-label {
          font-family: var(--font-mono);
          font-size: 0.5625rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-muted);
        }

        .node-id-label {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          font-weight: 600;
          color: var(--color-electric-blue);
        }

        .node-title {
          font-family: var(--font-display);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-primary);
          line-height: 1.3;
        }

        .node-active-indicator {
          font-family: var(--font-mono);
          font-size: 0.5625rem;
          color: var(--color-electric-blue);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .node-related-indicator {
          font-family: var(--font-mono);
          font-size: 0.5625rem;
          color: var(--color-intelligence-cyan);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* Inspector */
        .atlas-inspector {
          padding: 1.25rem;
          background: var(--color-midnight-navy);
          border: 1px solid var(--color-border);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .inspector-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .inspector-type {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          text-transform: uppercase;
          color: var(--color-text-muted);
          letter-spacing: 0.08em;
        }

        .inspector-id {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-electric-blue);
        }

        .inspector-title {
          font-family: var(--font-display);
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-text-primary);
          line-height: 1.25;
        }

        .inspector-relations {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .relations-label {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          text-transform: uppercase;
          color: var(--color-text-muted);
          letter-spacing: 0.08em;
        }

        .relations-tags {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .relation-pill {
          display: block;
          padding: 0.4rem 0.6rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--color-border);
          border-radius: 2px;
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          text-align: left;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }

        .relation-pill:hover {
          background: rgba(86, 217, 232, 0.08);
          border-color: rgba(86, 217, 232, 0.3);
          color: var(--color-text-primary);
        }

        .rel-type {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          color: var(--color-text-muted);
        }

        .inspector-actions {
          padding-top: 0.5rem;
          border-top: 1px solid var(--color-border-subtle);
        }

        .inspector-explore-btn {
          font-family: var(--font-display);
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-electric-blue);
          text-decoration: none;
          display: inline-block;
          transition: opacity 0.2s;
        }

        .inspector-explore-btn:hover {
          opacity: 0.85;
        }

        @media (max-width: 1024px) {
          .atlas-landscape {
            grid-template-columns: 1fr;
          }
          .atlas-nodes-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .atlas-nodes-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
