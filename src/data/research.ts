// src/data/research.ts
// Authoritative source of truth for research programmes and projects
// Content drawn strictly from the YARA Research Founding Blueprint

export const RESEARCH_PROGRAMMES = [
  {
    id: 'P01',
    slug: 'intelligence-reasoning',
    title: 'Intelligence & Reasoning',
    shortTitle: 'Intelligence & Reasoning',
    description:
      'Investigating the nature, architectures and mechanisms of machine intelligence, from reasoning and inference to model architecture and knowledge representation.',
    researchAreas: [
      'LLM reasoning and inference-time scaling',
      'Small language models',
      'Multimodal intelligence',
      'Model architecture and adaptation',
      'Synthetic data and knowledge representation',
    ],
    questions: [
      'How do language models perform multi-step reasoning?',
      'What scaling laws apply at inference time?',
      'Can smaller models reason more reliably through specialisation?',
    ],
    accent: 'blue' as const,
    status: 'active' as const,
    icon: 'brain',
  },
  {
    id: 'P02',
    slug: 'agentic-agentless-systems',
    title: 'Agentic & Agentless Systems',
    shortTitle: 'Agentic & Agentless',
    description:
      'Investigating autonomous and non-autonomous approaches to intelligent task execution, comparing agent architectures, agentless alternatives, and hybrid strategies.',
    researchAreas: [
      'Agent architectures',
      'Agentless intelligence',
      'Multi-agent coordination',
      'Planning and orchestration',
      'Tool use and execution systems',
    ],
    questions: [
      'When do deterministic workflows outperform autonomous agents?',
      'What are the reliability trade-offs between agentic and agentless systems?',
      'Can hybrid architectures achieve both reliability and flexibility?',
    ],
    accent: 'cyan' as const,
    status: 'active' as const,
    icon: 'network',
  },
  {
    id: 'P03',
    slug: 'ai-engineering-software-systems',
    title: 'AI Engineering & Software Systems',
    shortTitle: 'AI Engineering',
    description:
      'Researching how AI transforms software engineering and development infrastructure, from coding agents to AI-native software development lifecycles.',
    researchAreas: [
      'Coding agent architectures',
      'AI-native SDLC',
      'Specification-driven development',
      'Automated testing and verification',
      'AI-assisted software architecture',
    ],
    questions: [
      'How can AI agents reliably write, test and review production code?',
      'What does an AI-native software development lifecycle look like?',
      'Can specification-driven development improve AI coding accuracy?',
    ],
    accent: 'violet' as const,
    status: 'active' as const,
    icon: 'code',
  },
  {
    id: 'P04',
    slug: 'local-ai-efficient-intelligence',
    title: 'Local AI & Efficient Intelligence',
    shortTitle: 'Local AI',
    description:
      'Making AI more efficient, accessible and independent of centralised infrastructure, through local inference, model optimisation and resource-aware computing.',
    researchAreas: [
      'Local model inference',
      'Quantisation and optimisation',
      'SLMs and specialised models',
      'Model routing',
      'Edge AI and resource-aware computing',
    ],
    questions: [
      'What performance is achievable from quantised models on consumer hardware?',
      'How should local AI systems route between models based on task requirements?',
      'Can edge-deployed models match cloud performance on specialised tasks?',
    ],
    accent: 'blue' as const,
    status: 'active' as const,
    icon: 'cpu',
  },
  {
    id: 'P05',
    slug: 'knowledge-context-memory',
    title: 'Knowledge, Context & Memory',
    shortTitle: 'Knowledge & Memory',
    description:
      'Understanding how intelligent systems acquire, retain, retrieve and use information, from context engineering to persistent knowledge architectures.',
    researchAreas: [
      'Context engineering',
      'Long-term memory architectures',
      'Knowledge graphs',
      'Retrieval-augmented generation',
      'Persistent knowledge systems',
    ],
    questions: [
      'How should intelligent systems manage context across long interactions?',
      'What persistent memory architectures improve reasoning over time?',
      'Can knowledge graphs improve factual grounding in LLM outputs?',
    ],
    accent: 'cyan' as const,
    status: 'active' as const,
    icon: 'database',
  },
  {
    id: 'P06',
    slug: 'ai-safety-evaluation-governance',
    title: 'AI Safety, Evaluation & Governance',
    shortTitle: 'Safety & Evaluation',
    description:
      'Ensuring intelligent systems are reliable, secure, measurable and accountable, through rigorous evaluation, guardrails and responsible AI practices.',
    researchAreas: [
      'AI evaluations and benchmarks',
      'Agent security',
      'Guardrails and policy enforcement',
      'Interpretability and observability',
      'Responsible AI and governance',
    ],
    questions: [
      'How should autonomous agents be evaluated for safety and reliability?',
      'What security vulnerabilities exist in tool-using agent systems?',
      'How can AI systems be made more interpretable without sacrificing performance?',
    ],
    accent: 'violet' as const,
    status: 'active' as const,
    icon: 'shield',
  },
] as const;

export const RESEARCH_PROJECTS = [
  {
    id: 'YR-001',
    slug: 'beyond-agentic-ai',
    title: 'Beyond Agentic AI',
    subtitle: 'Investigating Agentless and Hybrid Intelligence Architectures',
    programme: 'P02',
    programmeSlug: 'agentic-agentless-systems',
    status: 'active' as const,
    description:
      'Exploring the boundaries between deterministic, agent-based and hybrid approaches to intelligent problem solving. Can we achieve reliable and efficient task execution through deterministic workflows, structured reasoning and selective autonomy?',
    problemStatement:
      'Current autonomous agent architectures often sacrifice reliability for flexibility. This research investigates whether deterministic, agentless or hybrid approaches can achieve comparable or superior results on specific classes of tasks.',
    researchQuestions: [
      'Which tasks actually benefit from autonomous agents?',
      'Where do deterministic systems perform better?',
      'What are the trade-offs in latency, cost and reliability?',
      'Can hybrid architectures improve performance?',
      'How should agentless systems be evaluated?',
    ],
    expectedOutputs: [
      'Research paper or technical report',
      'Open-source benchmark',
      'Reference implementation',
      'Experimental dataset',
    ],
    startedDate: '2026-11',
  },
  {
    id: 'YR-002',
    slug: 'lightweight-ai-runtime',
    title: 'Lightweight AI Runtime',
    subtitle: 'Researching Modular Execution Architectures for Intelligent Systems',
    programme: 'P02',
    programmeSlug: 'agentic-agentless-systems',
    status: 'active' as const,
    description:
      'Investigating the architecture and engineering principles behind lightweight, modular intelligent runtimes. Can we develop a modular AI runtime that provides essential orchestration without depending on heavyweight agent frameworks?',
    problemStatement:
      'Existing AI agent frameworks carry significant runtime complexity, hidden dependencies and unpredictable execution behaviour. This research investigates minimal, modular runtime alternatives.',
    researchQuestions: [
      'Can we develop a modular AI runtime with essential orchestration capabilities?',
      'What are the core primitives required for a lightweight agent runtime?',
      'How should execution state, tool invocation and context management be architected?',
      'What observability and failure recovery mechanisms are needed?',
    ],
    expectedOutputs: [
      'Technical architecture paper',
      'Open-source runtime prototype',
      'Comparative benchmark',
      'Design principles',
    ],
    startedDate: '2026-11',
  },
  {
    id: 'YR-003',
    slug: 'efficient-local-intelligence',
    title: 'Efficient Local Intelligence',
    subtitle: 'Exploring Small Models, Local Inference and Context Efficiency',
    programme: 'P04',
    programmeSlug: 'local-ai-efficient-intelligence',
    status: 'proposed' as const,
    description:
      'Investigating how small language models, local inference, retrieval and intelligent context selection can be combined to deliver efficient AI systems on resource-constrained hardware.',
    problemStatement:
      'Large cloud-dependent AI models create cost, privacy and latency barriers for many use cases. This research investigates whether smaller, locally-deployed models can achieve practical intelligence with appropriate engineering.',
    researchQuestions: [
      'What performance is achievable from quantised small models on consumer hardware?',
      'How can retrieval and context engineering compensate for reduced model capacity?',
      'What hybrid local/cloud routing strategies optimise cost and performance?',
    ],
    expectedOutputs: [
      'Benchmark comparing local vs cloud inference on representative tasks',
      'Context efficiency evaluation methodology',
      'Open-source local inference toolkit',
    ],
    startedDate: null,
  },
] as const;

export const PUBLICATIONS = [
  {
    id: 'YR-WP-2026-001',
    slug: 'beyond-agentic-ai-architectures',
    title: 'Beyond Agentic AI: Exploring Deterministic, Agent-Based, and Hybrid Intelligence Architectures',
    subtitle: 'A Comparative Research Agenda on Reliability, Latency, and Cost Trade-offs',
    type: 'Working Paper',
    status: 'active' as const,
    programme: 'P02',
    programmeSlug: 'agentic-agentless-systems',
    date: 'November 2026',
    authors: [
      { name: 'Aditya Padwal', role: 'Lead Investigator', affiliation: 'YARA Research' }
    ],
    abstract:
      'As large language models are increasingly integrated into automated systems, contemporary architectures default almost universally to autonomous agent loops. However, iterative agent execution introduces unpredictable latency, compounding failure modes, and high token overhead. This working paper formulates a structured research agenda investigating when deterministic state machines, specialized tool callers, and hybrid architectures outperform unbounded agentic loops on representative enterprise tasks. We outline the theoretical trade-offs, evaluation metrics, and initial experimental methodology for the YR-001 research project.',
    doi: null,
    arxiv: null,
    zenodo: null,
    pdfUrl: null,
    github: 'https://github.com/yararesearch-ai',
    keywords: ['Agentic AI', 'Agentless Systems', 'Reliability Benchmarking', 'LLM Architectures', 'Deterministic Workflows'],
    citationBibtex: `@techreport{padwal2026beyondagentic,
  title={Beyond Agentic AI: Exploring Deterministic, Agent-Based, and Hybrid Intelligence Architectures},
  author={Padwal, Aditya},
  institution={YARA Research},
  year={2026},
  number={YR-WP-2026-001},
  url={https://yararesearch.com/publications/beyond-agentic-ai-architectures}
}`,
  },
] as const;

export type ResearchProgramme = typeof RESEARCH_PROGRAMMES[number];
export type ResearchProject = typeof RESEARCH_PROJECTS[number];
export type Publication = typeof PUBLICATIONS[number];
export type ProgrammeAccent = 'blue' | 'cyan' | 'violet';
export type ProjectStatus = 'proposed' | 'active' | 'in-review' | 'published' | 'completed' | 'archived';
