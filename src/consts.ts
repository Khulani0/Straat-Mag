// Site-wide constants. The issue number and date live in data/settings.json
// so they can be updated from the CMS without touching code.
import settings from '../data/settings.json';

export const SITE_TITLE = 'Phanda Mag';
export const SITE_DESCRIPTION =
  'A weekly online intelligence magazine for South African entrepreneurs: public procurement money flows, government and private funding, entrepreneurship competitions, and capital-raising strategy.';

export const ISSUE_NUMBER = settings.issueNumber;
export const ISSUE_DATE = settings.issueDate;

// The five fixed sections. Every article belongs to exactly one of these.
export const SECTIONS = [
  {
    slug: 'ledger',
    name: 'The Ledger',
    description:
      'Public procurement intelligence. Where government money moved this period: notable tender awards, big contracts, sector patterns.',
  },
  {
    slug: 'capital',
    name: 'Capital',
    description:
      'Funding intelligence. Government grants and DFIs, bank and private SMME funds. What is open, what closed, what changed.',
  },
  {
    slug: 'winners',
    name: 'Winners',
    description:
      'Verified stories of real entrepreneurs who won real competitions or secured real funding. Named people, sourced facts only.',
  },
  {
    slug: 'playbook',
    name: 'The Playbook',
    description:
      'Evergreen strategy. How to raise, how to pitch, how to get bid-ready, how competitions actually judge.',
  },
  {
    slug: 'wire',
    name: 'The Wire',
    description:
      'One-paragraph briefs. Deadlines opening and closing in the next 30 days, quick funding news, one procurement stat of the week.',
  },
] as const;

export type SectionSlug = (typeof SECTIONS)[number]['slug'];

export function sectionBySlug(slug: string) {
  return SECTIONS.find((s) => s.slug === slug);
}

// Live builds show only published articles. Local preview (npm run dev) shows
// drafts too, so you can review a new article, with its images, before it goes
// live. This is the review-before-publish gate.
export function isVisible(data: { status?: string }) {
  if (import.meta.env.DEV) return true;
  return data.status === 'published';
}
