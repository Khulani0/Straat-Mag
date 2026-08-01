// Straatpreneur build-time photo fetcher.
//
// Runs in prebuild, before the art generator. For every article listed in
// data/photo-manifest.json that does not already have a photo, it searches the
// free image services for a licence-clean South African photo and downloads it
// to public/photos/<slug>.jpg, recording the credit in data/image-credits.json.
//
// It only runs when an API key is present (PEXELS_API_KEY / PIXABAY_API_KEY /
// UNSPLASH_ACCESS_KEY). On Vercel, add one as an Environment Variable and every
// build auto-illustrates. With no key, or when the network is blocked (as in
// the CI sandbox), it exits quietly and articles keep their generated cover
// art. Any single failure is caught and skipped, so a bad query never breaks
// the build and never leaves a broken image: worst case is the SVG fallback.
//
// After downloading, it stamps the article's frontmatter with
// heroImage: /photos/<slug>.jpg so the templates pick up the photo.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

loadDotEnv();
const PEXELS = process.env.PEXELS_API_KEY;
const PIXABAY = process.env.PIXABAY_API_KEY;
const UNSPLASH = process.env.UNSPLASH_ACCESS_KEY;

if (!PEXELS && !PIXABAY && !UNSPLASH) {
  console.log('[fetch-photos] no image API key set, keeping generated cover art. (Add PEXELS_API_KEY to enable real photos.)');
  process.exit(0);
}

const manifest = JSON.parse(readFileSync('data/photo-manifest.json', 'utf8'));
const noPeopleDefault = manifest.noPeopleDefault !== false;
const PEOPLE_WORDS = /\b(portrait|selfie|model|face|man|woman|girl|boy)\b/i;

const creditsPath = 'data/image-credits.json';
const credits = existsSync(creditsPath) ? JSON.parse(readFileSync(creditsPath, 'utf8')) : {};

mkdirSync('public/photos', { recursive: true });
let added = 0;

for (const [slug, query] of Object.entries(manifest.photos)) {
  const out = `public/photos/${slug}.jpg`;
  if (existsSync(out)) continue;
  try {
    const saQuery = /south africa|johannesburg|cape town|durban|pretoria|township|sandton/i.test(query)
      ? query
      : `${query} south africa`;
    const pick = await search(saQuery, slug);
    if (!pick) {
      console.log(`[fetch-photos] no image for "${saQuery}" (${slug}), keeping cover art`);
      continue;
    }
    const img = await fetch(pick.downloadUrl);
    if (!img.ok) throw new Error(`download ${img.status}`);
    writeFileSync(out, Buffer.from(await img.arrayBuffer()));
    credits[slug] = {
      provider: pick.provider,
      photographer: pick.photographer,
      pageUrl: pick.pageUrl,
      license: pick.license,
      query: saQuery,
      fetchedAt: new Date().toISOString().slice(0, 10),
    };
    stampHero(slug);
    added++;
    console.log(`[fetch-photos] ${slug}: ${pick.provider} / ${pick.photographer}`);
  } catch (e) {
    console.log(`[fetch-photos] skipped ${slug}: ${e.message} (keeping cover art)`);
  }
}

if (added) writeFileSync(creditsPath, JSON.stringify(credits, null, 2) + '\n');
console.log(`[fetch-photos] done, ${added} photo(s) fetched.`);

async function search(q, slug = '') {
  const pool = [];
  if (PEXELS) {
    try {
      const r = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=12&orientation=landscape`, {
        headers: { Authorization: PEXELS },
      });
      const j = await r.json();
      for (const p of j.photos ?? [])
        pool.push({ provider: 'Pexels', license: 'Pexels License', photographer: p.photographer, pageUrl: p.url, downloadUrl: p.src?.large2x || p.src?.large, alt: p.alt || '' });
    } catch {}
  }
  if (PIXABAY) {
    try {
      const r = await fetch(`https://pixabay.com/api/?key=${PIXABAY}&q=${encodeURIComponent(q)}&image_type=photo&orientation=horizontal&safesearch=true&per_page=12`);
      const j = await r.json();
      for (const p of j.hits ?? [])
        pool.push({ provider: 'Pixabay', license: 'Pixabay Content License', photographer: p.user, pageUrl: p.pageURL, downloadUrl: p.largeImageURL, alt: p.tags || '' });
    } catch {}
  }
  if (UNSPLASH) {
    try {
      const r = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=12&orientation=landscape`, {
        headers: { Authorization: `Client-ID ${UNSPLASH}` },
      });
      const j = await r.json();
      for (const p of j.results ?? [])
        pool.push({ provider: 'Unsplash', license: 'Unsplash License', photographer: p.user?.name, pageUrl: p.links?.html, downloadUrl: p.urls?.regular, alt: p.alt_description || '' });
    } catch {}
  }
  const usable = pool.filter((c) => c.downloadUrl);
  const safe = noPeopleDefault ? usable.filter((c) => !PEOPLE_WORDS.test(c.alt)) : usable;
  const list = safe.length ? safe : usable;
  if (!list.length) return undefined;
  // Pick a varied result, not always the first, so different articles (and
  // each week's new articles) get different images from the same kind of query.
  // Seeded by slug + ISO week so a given article stays stable across rebuilds.
  const week = Math.floor(Date.now() / (7 * 864e5));
  let seed = week;
  for (const ch of slug) seed = (seed * 31 + ch.charCodeAt(0)) % 100000;
  return list[seed % list.length];
}

// Add heroImage to the article's frontmatter if it is not already set.
function stampHero(slug) {
  const file = `src/content/articles/${slug}.md`;
  if (!existsSync(file)) return;
  let src = readFileSync(file, 'utf8');
  if (/^heroImage:/m.test(src)) return;
  src = src.replace(/^(heroSvg:.*)$/m, `$1\nheroImage: "/photos/${slug}.jpg"`);
  if (!/^heroImage:/m.test(src)) {
    // no heroSvg line to anchor to; add after the section line
    src = src.replace(/^(section:.*)$/m, `$1\nheroImage: "/photos/${slug}.jpg"`);
  }
  writeFileSync(file, src);
}

function loadDotEnv() {
  try {
    for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?(.*?)"?\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {}
}
