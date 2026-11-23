import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const base = 'http://127.0.0.1:4173';
const outDir = path.join(root, 'layout-sweep');
await fs.mkdir(outDir, { recursive: true });

const sitemap = await fs.readFile(path.join(root, 'sitemap.xml'), 'utf8');
const routes = [...new Set(
  [...sitemap.matchAll(/<loc>(https:\/\/padelwrist\.com\/[^<]*)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
)];
if (routes.length < 25 || !routes.includes('/whats-new/') || !routes.includes('/')) {
  throw new Error('Sitemap page inventory is incomplete');
}
const viewports = [
  { name: 'compact', width: 390, height: 844, expectedColumns: 4 },
  { name: 'medium', width: 768, height: 1024, expectedColumns: 8 },
  { name: 'expanded', width: 1440, height: 1000, expectedColumns: 12 }
];
const failures = [];
const results = [];
const browser = await chromium.launch({ headless: true });

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce'
    });
    await context.addInitScript(() => {
      localStorage.setItem('padelwrist-analytics-consent', 'rejected');
    });
    await context.route('**/*', (route) => {
      const url = route.request().url();
      if (url.startsWith(base) || url.startsWith('data:')) return route.continue();
      if (/^https:\/\/fonts\.(?:googleapis|gstatic)\.com/.test(url)) return route.abort();
      if (/^https:\/\/images\.(?:pexels|unsplash)\.com/.test(url)) return route.abort();
      return route.abort();
    });

    const page = await context.newPage();
    for (const pathname of routes) {
      const issues = [];
      try {
        const response = await page.goto(base + pathname, { waitUntil: 'domcontentloaded', timeout: 20000 });
        if (!response?.ok()) issues.push('HTTP ' + (response?.status() ?? 'unknown'));
        const data = await page.evaluate(() => {
          const rect = (el) => {
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
          };
          const items = [...document.querySelectorAll('.check-list.plain li')];
          const badBullets = items
            .filter((li) => getComputedStyle(li).display !== 'block')
            .slice(0, 4).map((li) => li.textContent.trim().slice(0, 70));
          const cardEls = [...document.querySelectorAll('.product-showcase .product-shot')];
          const cards = cardEls.map((el) => ({
            box: rect(el),
            frame: rect(el.querySelector('.product-shot-frame')),
            image: rect(el.querySelector('img')),
            fit: getComputedStyle(el.querySelector('img')).objectFit
          }));
          const releaseEls = [...document.querySelectorAll('.release-entry')];
          const release = releaseEls.map((el) => ({
            id: el.id,
            width: rect(el)?.width,
            summary: !!el.querySelector(':scope > .release-summary'),
            list: !!el.querySelector(':scope > .check-list.plain'),
            links: !!el.querySelector(':scope > .release-links'),
            bg: getComputedStyle(el).backgroundColor,
            borderRadius: getComputedStyle(el).borderRadius,
            paddingLeft: getComputedStyle(el).paddingLeft
          }));
          const jumpIds = [...document.querySelectorAll('.release-index a')].map((a) => a.hash.slice(1));
          const productGrid = document.querySelector('.product-showcase');
          return {
            overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) > innerWidth + 1,
            main: rect(document.querySelector('main')),
            badBullets,
            cards,
            release,
            jumpIds,
            productGridColumns: productGrid ? getComputedStyle(productGrid).gridTemplateColumns.split(/\s+/).length : null,
            heading: !!document.querySelector('main h1')
          };
        });

        if (data.overflow) issues.push('Horizontal overflow');
        if (!data.heading) issues.push('Missing main H1');
        if (data.badBullets.length) issues.push('Split flex-layout bullet(s): ' + data.badBullets.join(' | '));
        if (pathname === '/whats-new/') {
          if (data.release.length !== 14) issues.push('Expected 14 release entries, found ' + data.release.length);
          if (data.release.some((r) => !r.summary || !r.list || !r.links)) issues.push('Inconsistent release article structure');
          if (JSON.stringify(data.jumpIds) !== JSON.stringify(data.release.map((r) => r.id))) issues.push('Release navigation mismatch');
          const widths = data.release.map((r) => r.width).filter(Number.isFinite);
          if (widths.length && Math.max(...widths) - Math.min(...widths) > 2) issues.push('Release cards have inconsistent widths');
          if (new Set(data.release.map((r) => r.borderRadius)).size !== 1) issues.push('Release cards have inconsistent corner radius');
        }
        if (pathname === '/') {
          if (data.cards.length !== 3) issues.push('Product gallery needs three media cards');
          if (data.productGridColumns !== viewport.expectedColumns) issues.push('Wrong product grid: ' + data.productGridColumns);
          if (data.cards.some((card) => card.fit !== 'contain')) issues.push('Product screenshot cropped rather than contained');
          if (data.cards.some((card) => card.box.width < 120 || card.frame.width > card.box.width + 1)) {
            issues.push('Product frame width escapes card bounds');
          }
          if (data.cards.length === 3) {
            const [first, second, third] = data.cards.map((card) => card.box);
            if (viewport.width >= 840) {
              if (Math.max(first.top, second.top, third.top) - Math.min(first.top, second.top, third.top) > 3) issues.push('Desktop product cards do not share the same grid row');
              if (!(first.left < second.left && second.left < third.left)) issues.push('Desktop product cards not ordered left to right');
              if (Math.max(first.height, second.height, third.height) - Math.min(first.height, second.height, third.height) > 3) issues.push('Desktop product card heights do not align');
            } else if (viewport.width >= 600) {
              if (Math.abs(first.top - second.top) > 3 || third.top <= first.bottom) issues.push('Tablet product flow not two cards then full-width detail');
            } else if (!(first.bottom <= second.top && second.bottom <= third.top)) {
              issues.push('Compact product cards do not stack in order');
            }
          }
        }

        results.push({ viewport: viewport.name, pathname, ...data, issues });
        if (issues.length) failures.push({ viewport: viewport.name, pathname, issues });

        if (pathname === '/' || pathname === '/whats-new/' ||
            pathname === '/players/' || pathname === '/clubs/' || pathname === '/events/') {
          const slug = pathname === '/' ? 'home' : pathname.slice(1, -1);
          await page.screenshot({ path: path.join(outDir, viewport.name + '-' + slug + '.png'), fullPage: true });
        }
      } catch (err) {
        failures.push({ viewport: viewport.name, pathname, issues: [String(err.message ?? err)] });
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}

const summary = { routes: routes.length, viewportCount: viewports.length, inspections: results.length, failures };
await fs.writeFile(path.join(outDir, 'report.json'), JSON.stringify({ summary, results }, null, 2));
console.log(JSON.stringify(summary, null, 2));
if (failures.length) process.exitCode = 1;
