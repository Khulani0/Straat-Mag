// Phanda Mag weekly source gatherer.
//
// Pulls every source in data/source-registry.json into a dated dossier under
// research/<date>/, saving the readable text of each page with its URL and
// access date. Claude drafts each issue FROM these files, so every sentence
// traces back to fetched primary text rather than model memory. Sources that
// block automated fetches (many government sites do) are listed in
// _fetch-manually.md so the editor knows to open them by hand or via Claude's
// web tools.
//
// USAGE
//   node scripts/gather-sources.mjs                (all sources)
//   node scripts/gather-sources.mjs ledger capital (only sources feeding those sections)

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const wantSections = process.argv.slice(2);
const { sources } = JSON.parse(readFileSync('data/source-registry.json', 'utf8'));

const today = new Date().toISOString().slice(0, 10);
const dir = `research/${today}`;
mkdirSync(dir, { recursive: true });

const selected = wantSections.length
  ? sources.filter((s) => s.feeds.some((f) => wantSections.includes(f)))
  : sources;

const manual = [];
const index = [`# Research dossier: ${today}`, '', `Sources gathered: ${selected.length}. Draft only from text captured here, and cite the source URL and this access date in every article.`, ''];

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

for (const s of selected) {
  const name = `${slugify(s.name)}.md`;
  try {
    const r = await fetch(s.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (PhandaMag research gatherer)' },
      redirect: 'follow',
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const html = await r.text();
    const text = stripHtml(html).slice(0, 12000);
    writeFileSync(
      `${dir}/${name}`,
      `# ${s.name}\n\nURL: ${s.url}\nAccessed: ${today}\nTier: ${s.tier}\nFeeds: ${s.feeds.join(', ')}\nNotes: ${s.notes}\n\n---\n\n${text}\n`
    );
    index.push(`- ${s.name} (${s.tier}, feeds: ${s.feeds.join(', ')}): captured to ${name}`);
  } catch (e) {
    manual.push(`- ${s.name}: ${s.url}  (${e.message}) [feeds: ${s.feeds.join(', ')}]`);
    index.push(`- ${s.name} (${s.tier}): FETCH FAILED, see _fetch-manually.md`);
  }
}

if (manual.length) {
  writeFileSync(
    `${dir}/_fetch-manually.md`,
    `# Fetch manually (${today})\n\nThese sources blocked the automated gatherer. Open them in a browser, or use Claude's web search and web fetch tools, and paste the relevant text into a note in this folder before drafting.\n\n${manual.join('\n')}\n`
  );
}

writeFileSync(`${dir}/_index.md`, index.join('\n') + '\n');
console.log(`[gather-sources] dossier written to ${dir}/ (${selected.length} sources, ${manual.length} need manual fetch)`);
