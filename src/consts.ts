// Site-wide constants. Update ISSUE_NUMBER and ISSUE_DATE once per weekly issue.

export const SITE_TITLE = 'Straat Mag';
export const SITE_DESCRIPTION =
  'A weekly online intelligence magazine for South African entrepreneurs: public procurement money flows, government and private funding, entrepreneurship competitions, and capital-raising strategy.';

export const ISSUE_NUMBER = '001';
export const ISSUE_DATE = 'Week of 6 July 2026';

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
