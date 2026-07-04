# Straat Mag weekly production SOP

The repeatable process for producing one weekly issue in a half-day session. Follow it in order. The editorial rules (zero fabrication, the Kill Rule, no invented people, no stock photos of people, no em-dashes, free stack only, SA English) apply to every step.

## 0. Session setup (5 minutes)

1. Open the repo in Claude Code (or locally: `npm install` once, then `npm run dev` in a cmd window to preview at localhost:4321).
2. Bump the issue: edit `src/consts.ts`, increment `ISSUE_NUMBER` and set `ISSUE_DATE` to "Week of [Monday's date]".
3. Skim `article-tracker.md` and `data/competition-calendar.md` for anything flagged CONFIRM last week.

## 1. The research sweep (60 to 90 minutes)

Rerun these searches every week and note changes in the calendar with the new access date:

- **Deadlines**: for every OPEN or CONFIRM calendar entry, search "[programme name] 2026 deadline" and confirm on the official site. Promote confirmed items, demote expired ones to CLOSED with the date.
- **New money**: "new fund SMME South Africa launched [month year]", "DSBD announcement [month]", "grant programme South Africa opens applications [month]". Check gov.za speeches for DSBD and dtic.
- **Procurement week**: "tender awarded [month year] South Africa billion", plus the eTenders awarded list (etenders.gov.za, Awarded opportunities) and any amaBhungane/Daily Maverick/News24 procurement reporting. One notable award or scandal feeds The Ledger.
- **Winners**: "[competition from calendar] winner announced [month year]". A fresh, named, multi-source winner feeds the Winners section.
- **Watchlist standing searches**: SAB Foundation Tholoana opening; Anzisha opening (from September); SAB Foundation awards opening (from January); Pitch and Polish entries (from February); final Public Procurement Act regulations (until gazetted); Treasury 30-day payment reports (annually mid-year, quarterlies in between).

Verification bar: two independent sources for any winner story or rand figure that will lead an article; the official source for any deadline published as fact. Anything single-sourced from an aggregator runs with an explicit "confirm on official channels" caveat or waits.

## 2. Slate the issue (15 minutes)

A normal weekly issue is 3 to 5 pieces:

- 1 Wire (always, built from the calendar: 6 to 10 briefs, deadlines within 30 days first, one stat of the week)
- 1 or 2 features (Capital or Ledger, from the research sweep)
- 1 Winners profile when a verified winner exists (never force one)
- 1 Playbook piece (evergreen, can be pre-written in fat weeks and banked)

Add rows to `article-tracker.md` under a new issue heading, status planned. If research fails on a slated piece, kill it, log it in `killed-articles.md` with the reason, and run a shorter issue. A thin true issue beats a fat invented one.

## 3. Write (90 to 120 minutes)

For each article, create `src/content/articles/[slug].md` with the full frontmatter:

```
---
title: ""
dek: ""
section: "ledger | capital | winners | playbook | wire"
date: 2026-MM-DD
readingTime: "X min read"
verified: true
featured: false        # true on exactly one article per issue (the lead)
sources:
  - "https://..."
heroSvg: "/heroes/[slug].svg"
moneyLineStat: ""
moneyLineCaption: ""
---
```

House rules per article: Money Line first (one verified figure, or the key date if no figure defines the story), 700 to 1,100 words for features, 250 to 400 per Wire, sources listed in frontmatter (they render automatically with the verification note), no em-dashes, rand written R2,5 million in copy and R2,5m in data labels. Set `featured: true` on the new lead and remove it from last week's lead.

Hero SVG: create `public/heroes/[slug].svg` in house style: 1200x500 viewBox, ink `#141414` or paper `#FAFAF6` ground, Taxi Yellow `#F2B705` as the only loud accent, Signal Red `#B3352C` sparingly for warnings, bold Arial-family type, charts only from verified numbers with the source named in small print.

## 4. Verify the build (10 minutes)

```
npm run build
```

Must complete with no errors (schema violations in frontmatter fail loudly here: that is the system working). Then `npm run preview` and check the homepage and each new article at phone width (browser dev tools, 360px).

## 5. Update the working files (10 minutes)

- `data/competition-calendar.md`: new access dates on everything checked, new entries for anything discovered, status changes.
- `article-tracker.md`: statuses to written.
- `killed-articles.md`: any kills, with reasons.

## 6. Ship (10 minutes)

```
git add -A
git commit -m "Issue 0XX: [one line on contents]"
git push
```

Vercel redeploys automatically within about a minute of the push. Confirm the live URL shows the new issue number and lead story.

## 7. The newsletter (15 minutes)

Once the Beehiiv embed is live (paste the embed code over the placeholder in `src/components/Footer.astro` and `src/pages/subscribe.astro`): compose the weekly email in Beehiiv from the issue: the lead's Money Line and dek, one paragraph per section, links back to the site. Subject line pattern: the lead stat plus the promise ("R710 million just moved toward township businesses").

## Standing cautions

- Never publish a deadline sourced only from an aggregator site as fact.
- Never name a winner without at least two sources or one unimpeachable official source.
- Recheck agency names before writing: this ecosystem renames constantly (SEFA/SEDA became SEDFA; Engen Pitch and Polish became Nedbank; the Intervarsity became the InnoVarsity). Last year's name in this year's article is the fastest way to lose reader trust.
- Applications to every government programme are free. Repeat the scam warning whenever a programme is covered in depth.
