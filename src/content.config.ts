import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One markdown file per article in src/content/articles/.
// Frontmatter contract for every article, per the editorial rules:
// every factual article must be verified and must list its sources.
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    // One-sentence standfirst under the headline.
    dek: z.string(),
    section: z.enum(['ledger', 'capital', 'winners', 'playbook', 'wire']),
    date: z.coerce.date(),
    // e.g. "6 min read"
    readingTime: z.string(),
    // Only true once every factual claim has been checked against sources.
    verified: z.boolean(),
    // URLs of the sources cited at the bottom of the article.
    sources: z.array(z.string().url()).default([]),
    // Path to the article's SVG hero illustration, e.g. /heroes/sefa-map.svg
    heroSvg: z.string().optional(),
    // The Money Line: the lead verified figure (or key date) and its one-line explanation.
    // Optional in the schema so drafts can compile, but every published article gets one.
    moneyLineStat: z.string().optional(),
    moneyLineCaption: z.string().optional(),
  }),
});

export const collections = { articles };
