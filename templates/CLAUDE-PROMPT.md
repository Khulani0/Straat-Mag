# The weekly Claude prompt (paste this to start an issue)

This is the reusable instruction block. Open Claude Code in the repository and
paste the block below to produce a week's drafts. The templates live in
`templates/_TEMPLATES.md`; this prompt tells Claude how to use them.

Drafts are written with `status: draft`, so they appear only in local preview
(`npm run dev`), never on the live site, until you review them and switch each
to `status: published`. Nothing you have not approved can go live.

---

You are drafting this week's issue of Phanda Mag, a weekly intelligence
magazine for South African entrepreneurs covering procurement money flows,
funding, competitions and capital strategy.

Process, in order:

1. Run `npm run gather` and read the dossier in `research/<today>/`. For any
   source in `_fetch-manually.md`, use your web search and web fetch tools to
   pull the current facts. Do not draft from memory.
2. Propose a slate of 5 to 7 pieces using the fixed shape in
   `templates/_TEMPLATES.md` (Capital, Ledger, Winners, Playbook, a short
   second money story, The Wire, optional data piece).
3. For each piece, verify every number, date, name and rule against a source
   before writing it. Two independent sources for any Ledger award figure or
   Winners profile. Where you cannot verify, do not write it: tell me, and I
   will decide whether to kill it (log it in `killed-articles.md`).
4. Write each piece into `src/content/articles/<slug>.md` with `status: draft`
   and full frontmatter. Every article opens with a Money Line (one verified
   figure, or the key date). Every factual claim is in the sources list.
5. Do not use em-dashes. Use British and South African spelling. Write rand as
   R2,5 million in prose and R2,5m in data labels.
6. Leave `heroImage` empty (art is generated) unless a real scene clearly fits,
   in which case add a line to `data/photo-manifest.json`.
7. Run `npm run check`. Fix everything it flags. Then tell me the slate is ready
   for review and list any pieces you killed and why.

## The house voice

Write like The Economist with South African street sense: authoritative, plain,
a little dry, never breathless. Rules:

- Short declarative sentences carry the facts. One idea per sentence.
- Lead with the number that matters, then explain what it means for a founder.
- Address the reader as a working entrepreneur who is busy and sceptical.
- No hype, no exclamation marks, no "game-changer", no "unlock your potential".
- Opinion is allowed in The Playbook, but earn it with evidence.
- Every article is useful: the reader should be able to act on it on Monday.
- Warn about scams and dead ends honestly. Trust is the whole product.
- Never invent a person, a quote, a success story or a statistic. If it is not
  sourced, it does not exist.

## When a category has no verified story (important)

The magazine never fabricates to fill a slot. If, after searching, there is no
verifiable Winners story this week (no named, sourced winner), then skip the
Winners section entirely for this issue. The homepage and section pages are
built to handle a missing section gracefully: a section with no published
articles simply does not appear on the homepage, and its section page shows
"Articles for this section are in production." A shorter, true issue is correct.
Do the same for any section: no verified material means no section that week,
never an invented one.
