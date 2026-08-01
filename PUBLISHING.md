# Publishing articles without Claude Code

The site has a no-code publishing pipeline. You write in a clean editor in your
browser; everything else (artwork, layout, deployment) is automatic.

## One-time setup (5 minutes)

1. Go to **app.pagescms.org** in your browser.
2. Click **Sign in with GitHub** and log in as Khulani0.
3. Authorise Pages CMS when GitHub asks (it needs access to your repositories).
4. You will see your repositories. Click **Phanda-Mag**.
5. That's it. The editing screens are already configured by the `.pages.yml`
   file in the repository: you will see **Articles** and **Issue settings**
   in the sidebar.

Pages CMS is free and stores nothing itself: every save is a commit to your
GitHub repository, which triggers Vercel to rebuild the live site within a
minute or two.

## Publishing a new article (the weekly routine)

1. In Pages CMS, open **Articles** and click **Add entry**.
2. Fill in the fields:
   - **Headline** and **Dek** (one sentence under the headline).
   - **Section**: The Ledger, Capital, Winners, The Playbook or The Wire.
   - **Publication date** and **Reading time** (roughly one minute per 200 words).
   - **Verified**: tick only when every figure has been checked against a source.
   - **Featured**: tick on exactly one article per issue (the homepage lead).
     Untick last week's lead when you tick the new one.
   - **Money Line stat and caption**: the one big verified figure that opens
     the article, e.g. "R710 million" plus a one-line explanation.
   - **Hero image path: leave empty.** The build generates on-brand cover art
     automatically from the headline, section and Money Line. If you ever want
     custom art, upload an SVG to `public/heroes/` and put its path here
     (e.g. `/heroes/my-article.svg`).
   - **Sources**: one URL per row. These render automatically at the bottom
     of the article with the verification note.
   - **Body**: the article itself. Headings, lists and tables all work.
3. Click **Save**. Done. Vercel rebuilds and the article is live in about a
   minute, with artwork, on the homepage, in its section, everywhere.

## Starting a new weekly issue

1. In Pages CMS, open **Issue settings**.
2. Change **Issue number** (e.g. 002) and **Issue date line** (e.g. Week of
   13 July 2026), then Save. The header of every page updates.
3. Publish the week's articles as above, moving the **Featured** tick to the
   new lead story.

The editorial process itself (which searches to run, verification rules, the
Kill Rule) lives in `WEEKLY-SOP.md`.

## Analytics: seeing your visitor numbers

The site already carries the Vercel Web Analytics script. To switch it on:

1. Go to **vercel.com**, log in, and open your **straatpreneur** project.
2. Click the **Analytics** tab.
3. Click **Enable**. Free plan is fine.

From then on the Analytics tab shows visitors, page views, top pages, countries
and devices, with no cookies and no consent banner needed. If you ever outgrow
the free tier's monthly events, say the word and we can add GoatCounter
(free, unlimited) alongside it.

## How the automatic artwork works

Every build runs `scripts/generate-heroes.mjs` first. For any article whose
hero image does not exist, it generates a cover in the house style: section
colours (dark covers for The Ledger, Winners and The Wire; paper covers for
Capital and The Playbook), the Money Line stat or headline as the typography,
a geometric motif that varies per article, and the yellow rule. Hand-made
artwork is never overwritten; the generator only fills gaps. This is also the
copyright answer: every image on the site is generated in-house, so there is
nothing to license and nothing to take down.
