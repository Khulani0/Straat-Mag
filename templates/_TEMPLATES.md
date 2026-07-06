# Phanda Mag issue template: fixed shape, every week

The rigid weekly issue. Same five sections, same lengths, every week. This is
what keeps production inside one half-day and stops scope creep from blowing
the deadline. Copy the relevant block below into a new file in
`src/content/articles/` (or paste into Pages CMS), fill it from your research
dossier, fact-check, then set `verified: true`.

The standard weekly issue is SEVEN pieces:

| Slot | Section | Length | Notes |
| --- | --- | --- | --- |
| 1 | Capital | 700 to 1,100 words | The week's main funding story. Usually the lead. |
| 2 | The Ledger | 700 to 1,100 words | A procurement money-flow or awards story. |
| 3 | Winners | 400 to 700 words | One verified, named winner. Skip only if none verifies. |
| 4 | The Playbook | 700 to 1,100 words | Evergreen strategy. Can be drafted ahead and banked. |
| 5 | Capital or Ledger | 400 to 700 words | A shorter second money story. |
| 6 | The Wire | 250 to 400 words | 6 to 10 briefs, deadlines within 30 days first, one stat. |
| 7 | Any | data or explainer | Optional chart-led piece when a dataset lands. |

Rules that never change:
- Every article opens with a Money Line (one verified figure, or the key date).
- Every factual claim is sourced. No unsourced number ships (the build blocks it).
- No em-dashes (the build blocks them).
- Winners are real, named, publicly reported people with a source link. No stock
  photo of an identifiable person on a Winners or wrongdoing story.
- If a planned piece fails verification, kill it, log it in killed-articles.md,
  and run a shorter issue. Six true pieces beat seven with one invented number.

---

## Capital template

```
---
title: ""
dek: ""
section: "capital"
date: 2026-MM-DD
readingTime: "X min read"
verified: false
featured: false
moneyLineStat: ""
moneyLineCaption: ""
heroImage: ""
sources:
  - ""
---

Opening: the change or the stakes for a founder, in two or three sentences.

## The programme / the money

What it is, who runs it, the verified amounts and terms. Every figure sourced.

## Who qualifies

The hard eligibility gates, in a list.

## How to actually use it

The practical move. Contracts, deadlines, the realistic route in.

Close with the honest trade-off and the free-to-apply warning where relevant.
```

## The Ledger template

```
---
title: ""
dek: ""
section: "ledger"
date: 2026-MM-DD
readingTime: "X min read"
verified: false
featured: false
moneyLineStat: ""
moneyLineCaption: ""
heroImage: ""
sources:
  - ""
  - ""
---

Opening: what the numbers say about where government money moved.

## What moved (or what the data shows)

The verified awards, values, or dataset. Two independent sources on award claims.

## What it signals for SMMEs

The cascading work, the subcontracting play, or the risk to price in.

Close with the strategic read: chase clean awards, price the risk, keep compliant.
```

## Winners template

```
---
title: ""
dek: ""
section: "winners"
date: 2026-MM-DD
readingTime: "X min read"
verified: false
featured: false
moneyLineStat: ""
moneyLineCaption: ""
heroImage: ""
sources:
  - ""
  - ""
---

Opening: the competition or funding won, and the named winner.

## The business

What they actually do, in verified detail. Real quotes only, sourced.

## The award

What they won, the amount, the programme, the date.

## Why it matters

The transferable lesson for other founders. No invented uplift or survival claim.
```

## The Playbook template

```
---
title: ""
dek: ""
section: "playbook"
date: 2026-MM-DD
readingTime: "X min read"
verified: false
featured: false
moneyLineStat: ""
moneyLineCaption: ""
heroImage: ""
sources:
  - ""
---

Opening: the mistake most founders make, or the choice they face.

## The mechanism

How it actually works, grounded in published programme rules, not anecdote.

## The moves

The practical, ordered steps.

Close with the discipline or rule that separates the founders who win.
```

## The Wire template

```
---
title: "The Wire: deadlines and money moves, [edition]"
dek: ""
section: "wire"
date: 2026-MM-DD
readingTime: "3 min read"
verified: false
moneyLineStat: ""
moneyLineCaption: ""
heroImage: ""
sources:
  - ""
---

**[Deadline brief].** One paragraph. Nearest hard deadline first, in Signal Red framing.

**[Money move].** One paragraph.

...6 to 10 briefs total...

**Stat of the week: [figure].** One paragraph, one sourced procurement or funding number.
```
