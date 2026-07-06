# The one weekly prompt

Every week, open Claude Code in this repository and paste the single block
between the lines below. Nothing else. It triggers the whole pipeline: research,
drafting, the accuracy gate, and a push to GitHub as DRAFTS. The drafts appear
in your CMS for review. When you flip one to Published, the site rebuilds and
attaches a fresh Pexels photo (or an in-house illustration if none fits). You
never paste the rules again; they live here and Claude reads them.

Change only the date on the first line if you want. Everything else stays.

------------------------------------------------------------------------
Produce this week's issue of Phanda Mag for the week of {DATE}.

Follow the full process and rules in templates/CLAUDE-PROMPT.md and
templates/_TEMPLATES.md exactly. In short:

1. Run `npm run gather`, read research/<today>/, and use your web search and
   web fetch tools for anything in _fetch-manually.md. Draft only from real
   fetched facts, never from memory.
2. Write 5 to 7 pieces across the five sections in the fixed template shape.
   Verify every number, date, name and rule against a source before writing it.
   Two independent sources for any Ledger award figure or Winners profile. If a
   piece will not verify, do not write it: tell me and log it in
   killed-articles.md. If a whole section has no verified story this week, skip
   that section (never invent one).
3. Save each piece to src/content/articles/<slug>.md with status: draft and
   full frontmatter and a Money Line. No em-dashes. British and SA English.
4. For each scene-setting Capital, Ledger or Playbook piece, add one line to
   data/photo-manifest.json mapping its slug to a short South African photo
   query (for example "cape town harbour" or "rand banknotes"). Do NOT add
   Winners or data/chart pieces: those keep illustration.
5. Run `npm run check` and fix everything it flags.
6. Commit and push to the working branch. Then tell me the slate, list any
   pieces killed and why, and stop.
------------------------------------------------------------------------

## The full process (Claude reads this; you do not need to)

- The gate `npm run check` blocks the build on em-dashes, unsourced numbers, a
  Money Line without a caption, verified-without-sources, or more than one
  featured article. Green gate is required before pushing.
- Drafts (status: draft) are invisible on the live site and appear in the CMS
  and in local preview (`npm run dev`) only. Publishing is a human act.
- On publish, the build runs `scripts/fetch-photos.mjs`: if a Pexels key is set
  in the environment, it fetches a real, licence-clean South African photo for
  each manifest slug that has no photo yet, rotates the choice by slug and week
  so images differ, records the credit, and stamps heroImage. With no key, or if
  a query finds nothing, the article keeps its in-house generated cover art.
  Data pieces keep charts; Winners keep illustration (never a stock face).

## The house voice

Write like The Economist with South African street sense: authoritative, plain,
a little dry, never breathless. Short declarative sentences. Lead with the
number that matters, then what it means for a founder. No hype, no exclamation
marks, no "game-changer". Opinion only in The Playbook, earned with evidence.
Every article useful enough to act on by Monday. Never invent a person, quote,
success story or statistic: if it is not sourced, it does not exist.

## When a category has no verified story

Skip the section entirely for that issue. The homepage and section pages handle
a missing section gracefully: it simply does not appear, and its section page
reads "Articles for this section are in production." A shorter true issue is
correct. Never fabricate to fill a slot.
