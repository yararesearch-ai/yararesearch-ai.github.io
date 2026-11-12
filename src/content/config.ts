import { defineCollection, z } from 'astro:content';

const programmesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    shortTitle: z.string(),
    description: z.string(),
    researchAreas: z.array(z.string()),
    questions: z.array(z.string()),
    accent: z.enum(['blue', 'cyan', 'violet']),
    status: z.enum(['proposed', 'active', 'in-review', 'completed', 'archived']),
    icon: z.string(),
  }),
});

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string(),
    programme: z.string(),
    status: z.enum(['proposed', 'active', 'in-review', 'published', 'completed', 'archived']),
    problemStatement: z.string(),
    researchQuestions: z.array(z.string()),
    expectedOutputs: z.array(z.string()),
    startedDate: z.string().nullable().optional(),
  }),
});

const publicationsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string().optional(),
    type: z.enum(['Research Paper', 'Technical Report', 'Working Paper', 'Research Note']),
    status: z.enum(['proposed', 'active', 'in-review', 'published', 'completed', 'archived']),
    programme: z.string(),
    date: z.string(),
    authors: z.array(z.object({
      name: z.string(),
      role: z.string(),
      affiliation: z.string(),
    })),
    abstract: z.string(),
    doi: z.string().nullable().optional(),
    arxiv: z.string().nullable().optional(),
    zenodo: z.string().nullable().optional(),
    pdfUrl: z.string().nullable().optional(),
    github: z.string().optional(),
    keywords: z.array(z.string()),
    citationBibtex: z.string().optional(),
  }),
});

export const collections = {
  programmes: programmesCollection,
  projects: projectsCollection,
  publications: publicationsCollection,
};
