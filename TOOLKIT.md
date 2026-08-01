# The Straatpreneur production toolkit

Everything needed to produce one accurate weekly issue in a half-day, with
on-brand visuals and zero fabrication. Four tools plus the accuracy gate.

## The half-day cadence, in order

1. **Gather** (20 min): `npm run gather` builds a dated research dossier in
   `research/<date>/` from the curated source registry. Anything the gatherer
   cannot reach is listed in `_fetch-manually.md`; fill those with Claude's
   web search or a browser. Now you have real source text to draft from.
2. **Draft** (about 2 hours): Claude drafts each slot from the templates in
   `templates/_TEMPLATES.md`, using only figures found in the dossier, each
   pinned to a source URL. Fixed shape, fixed lengths.
3. **Fact-check and edit** (about 1.5 hours): you verify every number against
   its source. This is the human job the brand depends on.
4. **Illustrate** (20 min): leave heroes to the generator, or run
   `npm run image` for a photo where a real scene beats an abstract cover.
5. **Ship** (10 min): `npm run build` runs the accuracy gate automatically. If
   it passes, commit and push (or just Save in Pages CMS). Live in a minute.

## Tool 1: the accuracy gate (`npm run check`)

Runs automatically before every build. It cannot know a number is false, but
it makes fabrication hard and sourcing mandatory. It STOPS the build on:

- an em-dash or en-dash-as-punctuation anywhere in an article;
- `verified: true` with no sources;
- a rand amount or percentage in the body with no sources listed;
- a Money Line stat with no caption;
- more than one `featured` article.

It WARNS (but allows) on draft articles still marked unverified, thin sourcing
on Ledger and Winners pieces, and a Money Line figure that never appears in the
body. Treat every warning as a task before you publish.

## Tool 2: the source gatherer (`npm run gather [sections]`)

Pulls `data/source-registry.json` into `research/<date>/`. The registry is
curated: primary sources (Treasury, eTenders, the AG, SEDFA, NYDA, IDC, TIA,
the competition bodies) and established journalism (Daily Maverick, Moneyweb,
TechCentral and others). Rules baked into the registry: never draft a number
from an aggregator, and corroborate journalism against a primary source before
publishing a figure. `npm run gather ledger capital` limits to those sections.

## Tool 3: the image fetcher (`npm run image <slug> "<query>" [--no-people]`)

Searches Pexels, Pixabay and Unsplash (all free, all licence-clean for
editorial use), shows a shortlist, downloads your pick to
`public/photos/<slug>.jpg`, and records the credit in
`data/image-credits.json`, which renders as a photo credit under the hero.
Point the article's `heroImage` at that path to use it.

Setup: copy `.env.example` to `.env` and add at least one free API key (links
in that file). Queries are biased to the South African context automatically.

**The libel-safety rule, enforced:** never put a stock photo of an identifiable
person on a story about a named person or about wrongdoing. That is a
defamation risk separate from copyright. Use `--no-people` on those stories and
the fetcher biases to buildings, money, documents and cityscapes and rejects
portraits. For a Winners profile, use the winner's own or officially published
photo, or the generated cover, never a stock stand-in.

## Tool 4: the art generator (automatic)

For any article without a photo, the build generates an on-brand SVG cover from
its headline, section and Money Line. Covered in `PUBLISHING.md`. This is the
copyright backstop: every image on the site is either generated in-house or a
licence-clean stock photo with its credit recorded. Nothing is at risk of a
takedown.

## The visual decision, per article

- **Data or explainer piece** (a chart, a comparison, a process): generated SVG,
  because a real chart of verified numbers beats any photo.
- **Scene-setting piece** (a place, an industry, an object): a stock photo via
  `npm run image`, with `--no-people` unless a crowd or hands genuinely fit and
  the story is not about a named individual.
- **Winner profile**: the winner's own or officially published photo, or the
  generated cover. Never a stock person.
- **Anything about wrongdoing**: generated SVG or an abstract photo of a
  building or documents. Never a face.

## The non-negotiables (why the brand survives)

One invented statistic in a procurement briefing ends the brand. So: no number
without a source, ever; the gate blocks unsourced figures and the human check
catches wrong ones; kill any piece that will not verify and log it in
`killed-articles.md`; a shorter true issue always beats a fatter invented one.
