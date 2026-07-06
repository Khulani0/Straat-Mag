// Straat Mag accuracy gate. Runs before every build (prebuild).
//
// This is the brand's insurance policy: "one invented statistic in a
// procurement briefing ends the brand." It cannot detect a fabricated number
// on its own, but it enforces the structural rules that make fabrication hard
// and sourcing mandatory, and it blocks the two house-style breaches that
// look most amateur. A FAIL stops the build, so nothing broken ships.
//
// Rules (FAIL = build stops, WARN = printed but allowed):
//   FAIL  em-dash or en-dash-as-dash anywhere in an article
//   FAIL  verified: true with zero sources
//   FAIL  a rand amount or percentage in the body but no sources listed
//   FAIL  moneyLineStat without moneyLineCaption
//   FAIL  more than one featured: true across the whole issue
//   WARN  verified: false (draft) still present at build time
//   WARN  fewer than two sources on a Ledger or Winners piece
//   WARN  a Money Line stat that does not textually appear in the body

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const DIR = 'src/content/articles';
const files = readdirSync(DIR).filter((f) => f.endsWith('.md'));

const fails = [];
const warns = [];
let featuredCount = 0;

function splitFrontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { fm: '', body: src };
  return { fm: m[1], body: m[2] };
}

function fmValue(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, 'm'));
  return m ? m[1] : undefined;
}

function fmList(fm, key) {
  // captures a simple YAML list under key: (one "- item" per line)
  const re = new RegExp(`^${key}:\\s*\\n((?:\\s*-\\s*.*\\n?)*)`, 'm');
  const m = fm.match(re);
  if (!m) return [];
  return m[1]
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*-\s*"?/, '').replace(/"?\s*$/, ''))
    .filter(Boolean);
}

for (const file of files) {
  const src = readFileSync(path.join(DIR, file), 'utf8');
  const { fm, body } = splitFrontmatter(src);
  const id = file.replace(/\.md$/, '');

  // em-dash / en-dash used as a dash (surrounded by spaces or word chars)
  const whole = src;
  if (whole.includes('—')) fails.push(`${id}: contains an em-dash (—). House style forbids it.`);
  if (/\w\s*–\s*\w/.test(whole))
    fails.push(`${id}: contains an en-dash used as punctuation (–). Use a comma, colon or full stop.`);

  const verified = fmValue(fm, 'verified') === 'true';
  const featured = fmValue(fm, 'featured') === 'true';
  const section = fmValue(fm, 'section');
  const stat = fmValue(fm, 'moneyLineStat');
  const caption = fmValue(fm, 'moneyLineCaption');
  const sources = fmList(fm, 'sources');

  if (featured) featuredCount++;

  if (verified && sources.length === 0)
    fails.push(`${id}: verified is true but no sources are listed. Every verified article must cite its sources.`);

  const hasNumbers = /R\s?\d|\d\s?(?:million|billion|m\b|bn\b)|\d+(?:[.,]\d+)?\s?%/.test(body);
  if (hasNumbers && sources.length === 0)
    fails.push(`${id}: body contains rand amounts or percentages but lists no sources. No unsourced numbers.`);

  if (stat && !caption)
    fails.push(`${id}: has a Money Line stat but no caption. Every Money Line needs its one-line explanation.`);

  if (!verified) warns.push(`${id}: verified is false. This is a draft and should not ship in a finished issue.`);

  if ((section === 'ledger' || section === 'winners') && sources.length < 2 && sources.length > 0)
    warns.push(`${id}: only ${sources.length} source on a ${section} piece. Aim for two independent sources.`);

  if (stat) {
    // Does the numeric core of the stat appear in the body? Skip date-style
    // stats (they read differently in prose) and stats with no digits.
    const isDate = /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(stat);
    const numToken = (stat.match(/\d[\d.,]*/) || [])[0];
    if (!isDate && numToken && numToken.length >= 2) {
      const bodyDigits = body.replace(/[^\d.,]/g, ' ');
      if (!bodyDigits.includes(numToken))
        warns.push(`${id}: Money Line stat "${stat}" does not appear in the body. Confirm the figure is discussed and sourced in the text.`);
    }
  }
}

if (featuredCount > 1)
  fails.push(`Issue has ${featuredCount} featured articles. Exactly one article may be featured (the homepage lead).`);

// report
if (warns.length) {
  console.warn('\n[check-articles] WARNINGS:');
  for (const w of warns) console.warn('  ! ' + w);
}
if (fails.length) {
  console.error('\n[check-articles] FAILED. The build is blocked until these are fixed:');
  for (const f of fails) console.error('  x ' + f);
  console.error(`\n${fails.length} blocking issue(s).\n`);
  process.exit(1);
}
console.log(`[check-articles] ${files.length} articles passed the accuracy gate.`);
