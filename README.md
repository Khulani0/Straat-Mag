# Phanda Mag

A weekly online intelligence magazine for South African entrepreneurs: public procurement money flows, government and private funding, entrepreneurship competitions, and capital-raising strategy.

## Stack

- [Astro](https://astro.build) static site, deployed on Vercel
- Content collections: one markdown file per article in `src/content/articles/`
- Google Fonts (Space Grotesk + Newsreader), Beehiiv email embed
- No paid services

## Commands

Run these from the project folder in a normal terminal (cmd on Windows):

| Command           | Action                                       |
| ----------------- | -------------------------------------------- |
| `npm install`     | Install dependencies (first time only)       |
| `npm run dev`     | Start the local dev server at localhost:4321 |
| `npm run build`   | Build the production site into `dist/`       |
| `npm run preview` | Preview the production build locally         |

## Editorial rules

1. Zero fabrication: every factual claim is verified against a public source before publication.
2. The Kill Rule: if the core facts of an article cannot be verified, the article is killed and logged in `killed-articles.md`.
3. No invented people, quotes, or success stories.
4. No stock photos of people: all artwork is original SVG illustration, charts of verified data, or typographic covers.
5. No em-dashes in article or interface copy.
6. British/South African English throughout.

## Structure

- `src/content/articles/`: article markdown files (frontmatter: title, dek, section, date, readingTime, verified, sources, heroSvg, moneyLineStat, moneyLineCaption)
- `src/pages/`: home (current issue), section pages, article pages, about, subscribe
- `data/`: reusable research datasets (competition calendar, funding programmes)
