import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const skipDirs = new Set(['.git', 'node_modules']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function match(html, pattern) {
  return html.match(pattern)?.[1]?.trim() || '';
}

function duplicates(records, key) {
  const map = new Map();
  for (const record of records) {
    const value = record[key];
    if (!value) continue;
    if (!map.has(value)) map.set(value, []);
    map.get(value).push(record.file);
  }
  return [...map.entries()].filter(([, files]) => files.length > 1);
}

function collectJsonLd(html, rel) {
  const parsed = [];
  for (const block of html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { parsed.push(JSON.parse(block[1])); }
    catch (error) { throw new Error(`INVALID JSON-LD: ${rel} -> ${error.message}`); }
  }
  return parsed;
}

function flattenTypes(value, found = []) {
  if (!value || typeof value !== 'object') return found;
  if (Array.isArray(value)) {
    value.forEach((item) => flattenTypes(item, found));
    return found;
  }
  if (value['@type']) found.push(value);
  Object.values(value).forEach((item) => flattenTypes(item, found));
  return found;
}

const files = await walk(root);
const records = [];
let failures = 0;
let warnings = 0;

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const rel = path.relative(root, file);
  const record = {
    file: rel,
    title: match(html, /<title>([\s\S]*?)<\/title>/i),
    description: match(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i),
    canonical: match(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i),
    h1: match(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    ogTitle: match(html, /<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i),
    ogDescription: match(html, /<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i),
    ogImage: match(html, /<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i),
    robots: match(html, /<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i)
  };
  records.push(record);

  const required = rel === '404.html'
    ? ['title', 'description', 'h1', 'ogTitle', 'ogDescription', 'ogImage', 'robots']
    : ['title', 'description', 'canonical', 'h1', 'ogTitle', 'ogDescription', 'ogImage'];

  for (const key of required) {
    if (!record[key]) {
      console.error(`MISSING ${key}: ${rel}`);
      failures++;
    }
  }

  if (record.title.length > 65) {
    console.warn(`WARN long title (${record.title.length}): ${rel}`);
    warnings++;
  }
  if (record.description.length > 165) {
    console.warn(`WARN long description (${record.description.length}): ${rel}`);
    warnings++;
  }

  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((result) => result[0]);
  for (const tag of images) {
    if (!/\balt=["'][^"']*["']/i.test(tag)) {
      console.error(`MISSING alt text: ${rel} -> ${tag.slice(0, 120)}`);
      failures++;
    }
  }

  let jsonLd = [];
  try { jsonLd = collectJsonLd(html, rel); }
  catch (error) {
    console.error(error.message);
    failures++;
  }

  const entities = jsonLd.flatMap((block) => flattenTypes(block));
  const article = entities.find((entity) => entity['@type'] === 'Article');
  if (article) {
    if (!article.dateModified) {
      console.warn(`WARN Article missing dateModified: ${rel}`);
      warnings++;
    }
    if (!article.author) {
      console.warn(`WARN Article missing author: ${rel}`);
      warnings++;
    }
  }

  const ruleLike = /(rules|scoring|tie-break|golden-point|americano|mexicano|fixed-points)/.test(rel);
  if (ruleLike && rel !== '404.html' && !/padelfip\.com|International Padel Federation/i.test(html)) {
    console.warn(`WARN rules/scoring page has no visible FIP source reference: ${rel}`);
    warnings++;
  }
}

for (const key of ['title', 'description', 'canonical']) {
  for (const [value, dupFiles] of duplicates(records.filter((r) => r.file !== '404.html'), key)) {
    console.error(`DUPLICATE ${key}: ${JSON.stringify(value)} -> ${dupFiles.join(', ')}`);
    failures++;
  }
}

console.log(`Checked ${records.length} HTML files: ${failures} failure(s), ${warnings} warning(s).`);
if (failures) {
  console.error(`SEO audit failed with ${failures} issue(s).`);
  process.exitCode = 1;
} else {
  console.log('SEO audit passed. Warnings are editorial follow-up items, not build blockers.');
}
