// src/data/site.ts
// Global site metadata

export const SITE = {
  name: 'YARA Research',
  descriptor: 'Independent AI Research & Engineering',
  tagline: 'Exploring the foundations and future of intelligent systems.',
  creativeDirection: 'The Intelligence Frontier',
  url: 'https://yararesearch.com',
  github: 'https://github.com/yararesearch-ai',
  email: 'founder@yararesearch.com',
  founded: '2026',
  origin: 'India',
  mission:
    'Advance the science and engineering of intelligent systems through independent research, rigorous experimentation, open collaboration and reproducible innovation.',
};

export const NAV_LINKS = [
  { label: 'Research', href: '/research' },
  { label: 'Publications', href: '/publications' },
  { label: 'Open Source', href: '/open-source' },
  { label: 'Community', href: '/community' },
  { label: 'About', href: '/about' },
] as const;

export const FOUNDING_PRINCIPLES = [
  {
    id: '01',
    title: 'Research before assumptions.',
    description:
      'Every investigation begins with evidence, not intuition. We examine the literature, establish baselines, and design experiments before forming conclusions.',
  },
  {
    id: '02',
    title: 'Experimentation before claims.',
    description:
      'We validate hypotheses through reproducible experiments. Findings are reported with their limitations, negative results and open questions intact.',
  },
  {
    id: '03',
    title: 'Reproducibility before recognition.',
    description:
      'Research that cannot be independently verified is not complete. We publish methodologies, code and datasets alongside our findings.',
  },
] as const;
