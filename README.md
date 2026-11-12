# YARA Research - The Intelligence Frontier

> **Independent AI Research & Engineering**  
> *Exploring the foundations and future of intelligent systems.*  
> **Official Website:** [yararesearch.com](https://yararesearch.com)

---

## Overview

YARA Research is an independent AI research and engineering laboratory originating in India, operating with a global research outlook. This repository contains the source code for the official digital identity and publication platform of YARA Research.

Built with **Astro + React + TypeScript + Tailwind CSS**, the website features an editorial, research-laboratory aesthetic and introduces the signature **YARA Intelligence Field** interactive canvas experience.

---

## Founding Principles

1. **Research over hype:** No claims without verifiable evidence.
2. **Independence:** Research agenda remains strictly separate from commercial imperatives.
3. **Reproducibility:** Methodologies, experimental runbooks, datasets, and code are made available for independent audit.
4. **Transparency:** Negative results and critical limitations are published alongside breakthroughs.
5. **Open science:** Peer review, preprints, and permissive open-source distribution.

---

## Architecture & Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Astro](https://astro.build/) (Static Site Generation) |
| **Interactive Components** | [React](https://react.dev/) Islands (`client:load`, `client:visible`) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict mode) |
| **Styling & Design Tokens** | [Tailwind CSS](https://tailwindcss.com/) + CSS Custom Properties |
| **Interactive Visualisation** | Canvas-based YARA Intelligence Field (dynamic particle & node simulation) |
| **Typography** | Space Grotesk (Headings), Inter (Body), IBM Plex Mono (Technical Metadata) |
| **Hosting & CI/CD** | GitHub Pages via GitHub Actions workflow + Custom Domain (`yararesearch.com`) |

---

## Information Architecture & Routes

```text
/                               — Homepage (Hero with Intelligence Field, Philosophy, Programmes, Projects, Lifecycle, Closing)
├── /research                   — Research overview and complete agenda
│   ├── /research/programmes    — Six founding research programmes index
│   │   └── /[slug]             — Programme details (e.g. Intelligence & Reasoning, Local AI)
│   └── /research/projects      — Flagship research initiatives index
│       └── /[slug]             — Project details (YR-001 Beyond Agentic AI, YR-002 Lightweight Runtime, YR-003 Local Intelligence)
├── /publications               — Scientific papers, technical reports, working papers (editorial empty state)
├── /open-source                — Open source repositories, benchmarks, and licensing principles
├── /community                  — Contributor tracks (Observer, Contributor, Fellow, Lead, Reviewer)
└── /about                      — Laboratory mission and founding principles
    ├── /about/charter          — Official YARA Research Founding Charter v1.0
    ├── /about/governance       — Governance framework, roles, review cycle, and policies
    └── /about/people           — Founder-led leadership and community transparency
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.14.1 (Node 22 LTS recommended)
- **npm** >= 9.0.0

### Local Development

```bash
# Clone the repository
git clone https://github.com/yararesearch-ai/yara-research.github.io.git
cd yara-research.github.io

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` in your browser.

### Building for Production

```bash
# Compile static build to dist/
npm run build

# Preview static build locally
npm run preview
```

---

## Content Management: How to Extend

All programmatic content is strongly typed in TypeScript to guarantee build-time integrity:

### 1. Adding or Modifying a Research Programme
Edit `src/data/research.ts` in the `RESEARCH_PROGRAMMES` array:
```typescript
{
  id: 'P07',
  slug: 'neuro-symbolic-reasoning',
  title: 'Neuro-Symbolic Reasoning',
  shortTitle: 'Neuro-Symbolic',
  description: 'Combining neural perception with formal verification...',
  researchAreas: ['Constraint satisfaction', 'Proof verification'],
  questions: ['Can formal solvers constrain generative model outputs?'],
  accent: 'blue',
  status: 'proposed',
  icon: 'brain',
}
```
A static page `/research/programmes/neuro-symbolic-reasoning` will automatically be generated during the build.

### 2. Adding a Research Project
Edit `src/data/research.ts` in the `RESEARCH_PROJECTS` array:
```typescript
{
  id: 'YR-004',
  slug: 'deterministic-planning-eval',
  title: 'Deterministic Planning Evaluation',
  subtitle: 'Benchmarking state machine harnesses against iterative agent loops',
  programme: 'P02',
  programmeSlug: 'agentic-agentless-systems',
  status: 'proposed',
  description: '...',
  problemStatement: '...',
  researchQuestions: [...],
  expectedOutputs: [...],
  startedDate: null,
}
```

---

## Deployment

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`. When code is pushed to `main`, GitHub Pages automatically compiles the static site and publishes it to `https://yararesearch.com`.

---

## License & Attribution

- Site content and research designs: © 2026 YARA Research.
- Source code: Distributed under the [MIT License](LICENSE) (or Apache-2.0 where specified).
