# Phanda Mag: start here

Everything you need, in order. Do the three setups once. Then run the weekly
loop forever.

## How the pieces fit together (read once)

- **GitHub** stores the site and every article. It is the single source of truth.
- **Pages CMS** (app.pagescms.org) is your editing screen. It reads and writes
  the articles in GitHub. This is where you review drafts and click Publish.
- **Vercel** watches GitHub. Every change rebuilds the live site in about a
  minute, runs the accuracy gate, and attaches photos.
- **Pexels** supplies the photos, fetched automatically at build time.
- **Claude Code** writes the drafts each week from one prompt.

The files you saw in GitHub each have a job, and you never run them by hand:
`scripts/check-*` is the accuracy gate (runs at every build),
`data/source-registry.json` is the list of trusted sources the research step
reads, `templates/_TEMPLATES.md` is the fixed article shape,
`templates/CLAUDE-PROMPT.md` is your weekly prompt, and
`data/photo-manifest.json` maps articles to photo searches. They all fire
automatically inside the build and the weekly prompt. You only ever touch two
things: the weekly prompt (paste once) and the CMS Publish button.

## Setup 1: Pexels key so photos attach automatically (about 3 minutes)

1. Go to **pexels.com/api** and click **Get Started**. Sign up (free).
2. It shows you an **API key**: a long string. Copy it.
3. Go to **vercel.com**, open your **straat-mag** project.
4. Click **Settings**, then **Environment Variables** in the left menu.
5. Add a variable: Name = `PEXELS_API_KEY`, Value = paste your key. Leave all
   three environments ticked. Click **Save**.
6. Go to the **Deployments** tab, open the newest deployment, click the **...**
   menu and **Redeploy**. On that build, photos appear on the site.

That is the whole photo system. From now on, every published scene article gets
a real South African photo with a credit, images differ week to week, and any
article with no good photo falls back to the in-house illustration. No copyright
risk: Pexels photos are licence-clean and you keep the credit line.

## Setup 2: Pages CMS so you review and publish (about 2 minutes)

1. Go to **app.pagescms.org**.
2. Click **Sign in with GitHub** and log in as Khulani0.
3. Approve Pages CMS when GitHub asks (it needs access to your repositories).
4. Pick **Straat-Mag** from your repositories.
5. Done. You now see **Articles** and **Issue settings** in the sidebar. The
   editing forms are already configured by the `.pages.yml` file in the repo.

In Articles you will see every piece with a **Status** of Draft or Published.
Draft pieces are not on the live site. To publish: open the article, read it,
change **Status** to **Published**, and **Save**. That Save is a commit; Vercel
rebuilds and the article goes live with its photo in about a minute.

## Setup 3: one clean web address (optional, recommended)

So your public link always shows the finished site, make this branch your
production branch (or merge it to main). Tell me "merge to main" and I will do
it and confirm. Then connect your Afrihost domain by the steps in HOSTING.md.

## The weekly loop (about a half-day)

1. Open Claude Code in the repository. Paste the block from
   **templates/CLAUDE-PROMPT.md**, changing only the date. Send it.
2. Claude researches, drafts 5 to 7 verified pieces as **drafts**, runs the
   accuracy gate, and pushes to GitHub. It reports the slate and any pieces it
   killed for not verifying.
3. Open **Pages CMS**. Read each draft. This is your fact-check: check the
   Money Line and the sources. Fix anything, or ask Claude to.
4. For each piece you approve, set **Status: Published** and Save.
5. Update **Issue settings** (issue number and date) for the new week.
6. That is it. The site rebuilds, photos attach, the issue is live.

## The rules that protect the brand (built in, not optional)

- No number is published without a source. The build blocks unsourced figures.
- No invented people, quotes, or statistics. Ever.
- No em-dashes. The build blocks them.
- Winners are real, named, sourced people. No stock photo of a real person.
- If it will not verify, it does not run. A shorter true issue always wins.

More detail lives in TOOLKIT.md, PUBLISHING.md and WEEKLY-SOP.md, but this page
is all you need to operate.
