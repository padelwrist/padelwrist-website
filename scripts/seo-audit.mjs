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

const files = await walk(root);
const records = [];
let failures = 0;

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

  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  for (const tag of images) {
    if (!/\balt=["'][^"']*["']/i.test(tag)) {
      console.error(`MISSING alt text: ${rel} -> ${tag.slice(0, 120)}`);
      failures++;
    }
  }

  const jsonLd = [...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const block of jsonLd) {
    try { JSON.parse(block[1]); }
    catch (error) {
      console.error(`INVALID JSON-LD: ${rel} -> ${error.message}`);
      failures++;
    }
  }
}

for (const key of ['title', 'description', 'canonical']) {
  for (const [value, dupFiles] of duplicates(records.filter((r) => r.file !== '404.html'), key)) {
    console.error(`DUPLICATE ${key}: ${JSON.stringify(value)} -> ${dupFiles.join(', ')}`);
    failures++;
  }
}

console.log(`Checked ${records.length} HTML files.`);
if (failures) {
  console.error(`SEO audit failed with ${failures} issue(s).`);
  process.exitCode = 1;
} else {
  console.log('SEO audit passed.');
}
