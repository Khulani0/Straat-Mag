// Straat Mag automatic hero art generator.
//
// Runs before every build (see "prebuild" in package.json). For every article
// in src/content/articles/, if its hero SVG does not exist yet in public/,
// this script generates one in the house style from the article's own
// frontmatter: section, title and Money Line stat. Hand-drawn heroes are
// never overwritten: the generator only fills gaps. This is what lets new
// articles posted through the CMS appear on the site with on-brand artwork
// and no design work.

import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const ARTICLES_DIR = 'src/content/articles';
const PUBLIC_DIR = 'public';

const INK = '#141414';
const PAPER = '#FAFAF6';
const YELLOW = '#F2B705';
const RED = '#B3352C';
const SLATE = '#5C6670';

const SECTION_LABELS = {
  ledger: 'THE LEDGER',
  capital: 'CAPITAL',
  winners: 'WINNERS',
  playbook: 'THE PLAYBOOK',
  wire: 'THE WIRE',
};

// Dark covers for Ledger, Winners and Wire; light for Capital and Playbook.
const DARK_SECTIONS = new Set(['ledger', 'winners', 'wire']);

function parseFrontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*"?(.*?)"?\s*$/);
    if (kv) fm[kv[1]] = kv[2];
  }
  return fm;
}

function esc(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function hashOf(s) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 100000;
  return h;
}

function wrapWords(text, maxChars, maxLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > maxChars && line) {
      lines.push(line);
      line = w;
      if (lines.length === maxLines) return lines;
    } else {
      line = (line + ' ' + w).trim();
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  return lines;
}

// Decorative motifs, chosen deterministically per article so covers vary
// but never change between builds.
function motif(kind, fg, accent) {
  switch (kind) {
    case 0: {
      // diagonal stripes, top right
      let out = '';
      for (let i = 0; i < 7; i++) {
        out += `<line x1="${820 + i * 55}" y1="0" x2="${1020 + i * 55}" y2="200" stroke="${i === 3 ? accent : fg}" stroke-width="10" opacity="${i === 3 ? 1 : 0.18}"/>`;
      }
      return out;
    }
    case 1: {
      // dot grid, right side
      let out = '';
      for (let r = 0; r < 5; r++)
        for (let c = 0; c < 6; c++)
          out += `<circle cx="${880 + c * 52}" cy="${70 + r * 52}" r="7" fill="${r === 2 && c === 3 ? accent : fg}" opacity="${r === 2 && c === 3 ? 1 : 0.2}"/>`;
      return out;
    }
    case 2: {
      // concentric arcs, top right corner
      let out = '';
      for (let i = 1; i <= 5; i++) {
        out += `<circle cx="1200" cy="0" r="${i * 60}" fill="none" stroke="${i === 3 ? accent : fg}" stroke-width="8" opacity="${i === 3 ? 0.9 : 0.16}"/>`;
      }
      return out;
    }
    default: {
      // stacked blocks, right side
      let out = '';
      const heights = [46, 84, 62, 108];
      let y = 60;
      for (let i = 0; i < heights.length; i++) {
        out += `<rect x="960" y="${y}" width="${150 - i * 18}" height="${heights[i]}" fill="${i === 1 ? accent : fg}" opacity="${i === 1 ? 0.95 : 0.16}"/>`;
        y += heights[i] + 16;
      }
      return out;
    }
  }
}

function generateHero({ slug, title, section, stat }) {
  const dark = DARK_SECTIONS.has(section);
  const bg = dark ? INK : PAPER;
  const fg = dark ? PAPER : INK;
  const label = SECTION_LABELS[section] ?? 'STRAAT MAG';
  const h = hashOf(slug);
  const deco = motif(h % 4, fg, h % 3 === 0 ? RED : YELLOW);

  let centrepiece = '';
  if (stat && stat.length <= 18) {
    // Big stat cover: the Money Line as the artwork.
    const size = Math.max(70, Math.min(170, Math.floor(1000 / stat.length) * 1.55));
    const titleLines = wrapWords(title.toUpperCase(), 34, 2);
    const titleSpans = titleLines
      .map((l, i) => `<text x="70" y="${368 + i * 34}" font-size="24" font-weight="bold" fill="${fg}" opacity="0.85">${esc(l)}</text>`)
      .join('');
    centrepiece = `
    <text x="66" y="${190 + size * 0.35}" font-size="${size}" font-weight="bold" fill="${dark ? YELLOW : INK}" letter-spacing="-3">${esc(stat)}</text>
    <rect x="70" y="${210 + size * 0.35}" width="420" height="12" fill="${YELLOW}"/>
    ${titleSpans}`;
  } else {
    // Typographic cover: the headline as the artwork.
    const lines = wrapWords(title.toUpperCase(), 18, 3);
    const size = lines.some((l) => l.length > 15) ? 62 : 74;
    const spans = lines
      .map(
        (l, i) =>
          `<text x="66" y="${205 + i * (size + 12)}" font-size="${size}" font-weight="bold" fill="${i === lines.length - 1 ? (dark ? YELLOW : INK) : fg}" letter-spacing="-2">${esc(l)}</text>`
      )
      .join('');
    centrepiece = `${spans}
    <rect x="70" y="${215 + lines.length * (size + 12)}" width="420" height="12" fill="${YELLOW}"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 500" role="img" aria-label="${esc(title)}">
  <rect width="1200" height="500" fill="${bg}"/>
  ${deco}
  <g font-family="Arial, Helvetica, sans-serif">
    <text x="66" y="80" font-size="19" font-weight="bold" fill="${dark ? YELLOW : SLATE}" letter-spacing="4">${esc(label)}</text>
    ${centrepiece}
    <text x="66" y="462" font-size="15" font-weight="bold" fill="${SLATE}" letter-spacing="2">STRAAT MAG · EVERY FIGURE SOURCED</text>
  </g>
</svg>
`;
}

let generated = 0;
for (const file of readdirSync(ARTICLES_DIR)) {
  if (!file.endsWith('.md')) continue;
  const slug = file.replace(/\.md$/, '');
  const fm = parseFrontmatter(readFileSync(path.join(ARTICLES_DIR, file), 'utf8'));
  // If the article uses a fetched photo hero, no generated art is needed.
  if (fm.heroImage && fm.heroImage.trim()) continue;
  const heroPath = fm.heroSvg && fm.heroSvg.trim() ? fm.heroSvg.trim() : `/heroes/${slug}.svg`;
  const target = path.join(PUBLIC_DIR, heroPath.replace(/^\//, ''));
  if (existsSync(target)) continue;
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(
    target,
    generateHero({
      slug,
      title: fm.title ?? slug,
      section: fm.section ?? 'capital',
      stat: fm.moneyLineStat,
    })
  );
  generated++;
  console.log(`[heroes] generated ${target}`);
}
console.log(`[heroes] done, ${generated} generated`);
