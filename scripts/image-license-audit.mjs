import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(await readFile(path.join(root, 'image-licenses.json'), 'utf8'));
const approved = manifest.externalAssets.map((asset) => asset.assetPrefix);
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

const externalImageHosts = new Set(['images.unsplash.com', 'images.pexels.com']);
let failures = 0;
let checked = 0;

for (const file of await walk(root)) {
  const html = await readFile(file, 'utf8');
  const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);

  for (const tag of imageTags) {
    const urls = [];
    for (const attr of tag.matchAll(/\b(?:src|srcset)=["']([^"']+)["']/gi)) {
      const value = attr[1].replace(/&amp;/g, '&');
      if (/\bsrcset=/i.test(attr[0])) {
        urls.push(...value.split(',').map((candidate) => candidate.trim().split(/\s+/)[0]).filter(Boolean));
      } else {
        urls.push(value);
      }
    }

    for (const value of urls) {
      let url;
      try { url = new URL(value); } catch { continue; }
      if (!externalImageHosts.has(url.hostname)) continue;

      checked++;
      const base = `${url.origin}${url.pathname}`;
      if (!approved.some((prefix) => base.startsWith(prefix))) {
        console.error(`UNREVIEWED EXTERNAL IMAGE: ${path.relative(root, file)} -> ${base}`);
        failures++;
      }
    }
  }
}

for (const asset of manifest.externalAssets) {
  if (!asset.assetPrefix || !asset.sourcePage || !asset.provider || !asset.status) {
    console.error(`INCOMPLETE IMAGE LICENCE ENTRY: ${JSON.stringify(asset)}`);
    failures++;
  }
}

console.log(`Checked ${checked} external stock-image references against ${manifest.externalAssets.length} approved assets.`);
if (failures) {
  console.error(`Image licence audit failed with ${failures} issue(s).`);
  process.exitCode = 1;
} else {
  console.log('Image licence audit passed.');
}
