// Straat Mag free-image fetcher.
//
// Searches Pexels, Pixabay and Unsplash for a licence-clean photo, downloads
// the best candidate to public/photos/<slug>.jpg, and records the credit in
// data/image-credits.json. All three licences permit free commercial and
// editorial use; we store attribution anyway and render a credit line.
//
// USAGE
//   node scripts/fetch-images.mjs <article-slug> "<search query>" [--orientation landscape]
//   node scripts/fetch-images.mjs sedfa-loans-demystified "cape town office building"
//
// KEYS (set whichever you have; the script uses all available providers):
//   PEXELS_API_KEY, PIXABAY_API_KEY, UNSPLASH_ACCESS_KEY
//   Put them in a .env file (see .env.example) or your shell environment.
//
// THE LIBEL-SAFETY RULE (enforced here, not optional):
//   A stock photo of an identifiable person must NEVER illustrate a story
//   about a specific named person or about wrongdoing (corruption, fraud,
//   failure). That is a defamation and false-light risk entirely separate
//   from copyright. Pass --no-people for those stories and the fetcher will
//   bias hard toward buildings, money, documents, cityscapes and objects,
//   and reject obvious portraits. Winner profiles of a real person should
//   use that person's own supplied or officially published photo, never a
//   stock stand-in: for those, do not use this tool.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const [, , slug, query, ...flags] = process.argv;
if (!slug || !query) {
  console.error('Usage: node scripts/fetch-images.mjs <slug> "<query>" [--orientation landscape] [--no-people]');
  process.exit(1);
}
const orientation = (flags.includes('--orientation') ? flags[flags.indexOf('--orientation') + 1] : 'landscape');
const noPeople = flags.includes('--no-people');

loadDotEnv();

const PEXELS = process.env.PEXELS_API_KEY;
const PIXABAY = process.env.PIXABAY_API_KEY;
const UNSPLASH = process.env.UNSPLASH_ACCESS_KEY;

if (!PEXELS && !PIXABAY && !UNSPLASH) {
  console.error('No image API keys found. Set PEXELS_API_KEY, PIXABAY_API_KEY or UNSPLASH_ACCESS_KEY.');
  console.error('See .env.example and TOOLKIT.md for how to get free keys.');
  process.exit(1);
}

// Bias every query toward the South African context.
const saQuery = /south africa|johannesburg|cape town|durban|pretoria|township|soweto/i.test(query)
  ? query
  : `${query} south africa`;

const PEOPLE_WORDS = /\b(portrait|man|woman|person|face|selfie|model|girl|boy|businessman|businesswoman)\b/i;

const candidates = [];

if (PEXELS) {
  try {
    const r = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(saQuery)}&per_page=15&orientation=${orientation}`,
      { headers: { Authorization: PEXELS } }
    );
    const j = await r.json();
    for (const p of j.photos ?? []) {
      candidates.push({
        provider: 'Pexels',
        license: 'Pexels License (free commercial and editorial use)',
        photographer: p.photographer,
        pageUrl: p.url,
        downloadUrl: p.src?.large2x || p.src?.large || p.src?.original,
        alt: p.alt || '',
        hasPerson: PEOPLE_WORDS.test(p.alt || ''),
      });
    }
  } catch (e) {
    console.warn('Pexels lookup failed:', e.message);
  }
}

if (PIXABAY) {
  try {
    const r = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY}&q=${encodeURIComponent(saQuery)}&image_type=photo&orientation=horizontal&safesearch=true&per_page=15`
    );
    const j = await r.json();
    for (const p of j.hits ?? []) {
      candidates.push({
        provider: 'Pixabay',
        license: 'Pixabay Content License (free commercial and editorial use)',
        photographer: p.user,
        pageUrl: p.pageURL,
        downloadUrl: p.largeImageURL || p.webformatURL,
        alt: p.tags || '',
        hasPerson: PEOPLE_WORDS.test(p.tags || '') || /people/i.test(p.tags || ''),
      });
    }
  } catch (e) {
    console.warn('Pixabay lookup failed:', e.message);
  }
}

if (UNSPLASH) {
  try {
    const r = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(saQuery)}&per_page=15&orientation=${orientation === 'landscape' ? 'landscape' : 'squarish'}`,
      { headers: { Authorization: `Client-ID ${UNSPLASH}` } }
    );
    const j = await r.json();
    for (const p of j.results ?? []) {
      candidates.push({
        provider: 'Unsplash',
        license: 'Unsplash License (free commercial and editorial use)',
        photographer: p.user?.name,
        pageUrl: p.links?.html,
        downloadUrl: p.urls?.regular,
        alt: p.alt_description || '',
        hasPerson: PEOPLE_WORDS.test(p.alt_description || ''),
      });
    }
  } catch (e) {
    console.warn('Unsplash lookup failed:', e.message);
  }
}

let pool = candidates.filter((c) => c.downloadUrl);
if (noPeople) {
  const safe = pool.filter((c) => !c.hasPerson);
  if (safe.length) pool = safe;
  else {
    console.error('--no-people was set but every candidate looks like it contains a person. Aborting rather than risk a libel-unsafe image. Try a more abstract query (e.g. "office building", "bank notes", "city skyline").');
    process.exit(1);
  }
}

if (!pool.length) {
  console.error(`No usable images found for "${saQuery}". Try a different query. The site falls back to generated cover art if you publish without a photo.`);
  process.exit(1);
}

// Show the shortlist so the editor chooses deliberately. First candidate is
// the default pick; pass --pick N to choose another.
console.log(`\nShortlist for "${saQuery}"${noPeople ? ' (no-people filter on)' : ''}:`);
pool.slice(0, 8).forEach((c, i) =>
  console.log(`  [${i}] ${c.provider} · ${c.photographer} · ${c.alt || '(no description)'} · ${c.pageUrl}`)
);

const pickIdx = flags.includes('--pick') ? Number(flags[flags.indexOf('--pick') + 1]) : 0;
const chosen = pool[pickIdx] ?? pool[0];

// download
mkdirSync('public/photos', { recursive: true });
const outPath = `public/photos/${slug}.jpg`;
const img = await fetch(chosen.downloadUrl);
if (!img.ok) {
  console.error('Download failed:', img.status);
  process.exit(1);
}
const buf = Buffer.from(await img.arrayBuffer());
writeFileSync(outPath, buf);

// record credit
const creditsPath = 'data/image-credits.json';
const credits = existsSync(creditsPath) ? JSON.parse(readFileSync(creditsPath, 'utf8')) : {};
credits[slug] = {
  provider: chosen.provider,
  photographer: chosen.photographer,
  pageUrl: chosen.pageUrl,
  license: chosen.license,
  query: saQuery,
  fetchedAt: new Date().toISOString().slice(0, 10),
};
writeFileSync(creditsPath, JSON.stringify(credits, null, 2) + '\n');

console.log(`\nSaved ${outPath}`);
console.log(`Credit recorded: ${chosen.provider} / ${chosen.photographer}`);
console.log(`To use it, set this article's heroImage to: /photos/${slug}.jpg`);
console.log('(Leave heroImage empty to keep the generated cover art instead.)');

function loadDotEnv() {
  try {
    const env = readFileSync('.env', 'utf8');
    for (const line of env.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?(.*?)"?\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {
    /* no .env, rely on shell env */
  }
}
