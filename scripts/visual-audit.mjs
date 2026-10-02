import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const base = 'http://127.0.0.1:4173';
const outDir = path.resolve('visual-audit');
await fs.mkdir(outDir, { recursive: true });

const pages = [
  ['home', '/'],
  ['guides', '/guides/'],
  ['typical-guide', '/how-padel-scoring-works/'],
  ['insights', '/padel-player-statistics/'],
  ['support', '/support/'],
  ['privacy', '/privacy/'],
  ['not-found', '/404.html'],
];

const viewports = [
  ['compact', 390, 844],
  ['medium', 768, 1024],
  ['expanded', 1440, 1000],
];

const browser = await chromium.launch({ headless: true });
const report = [];

for (const [viewportName, width, height] of viewports) {
  for (const [pageName, pathname] of pages) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.goto(`${base}${pathname}`, { waitUntil: 'networkidle' });
    await page.emulateMedia({ reducedMotion: 'reduce' });

    const diagnostics = await page.evaluate(() => {
      const rect = (selector) => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), width: +r.width.toFixed(1), height: +r.height.toFixed(1), right: +r.right.toFixed(1), bottom: +r.bottom.toFixed(1) };
      };
      const css = (selector, prop) => {
        const el = document.querySelector(selector);
        return el ? getComputedStyle(el).getPropertyValue(prop).trim() : null;
      };
      const allRects = [...document.querySelectorAll('main section, main article, main aside, .page-heading, .story-card, .role-v2, .editorial-card, .product-shot')].map((el) => {
        const r = el.getBoundingClientRect();
        return { tag: el.tagName, cls: el.className, x: r.x, y: r.y, width: r.width, height: r.height };
      });
      const overlaps = [];
      for (let i = 0; i < allRects.length; i++) {
        for (let j = i + 1; j < allRects.length; j++) {
          const a = allRects[i], b = allRects[j];
          const overlapX = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
          const overlapY = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
          if (overlapX > 2 && overlapY > 2) {
            const contains = (a.x <= b.x && a.y <= b.y && a.x + a.width >= b.x + b.width && a.y + a.height >= b.y + b.height) ||
              (b.x <= a.x && b.y <= a.y && b.x + b.width >= a.x + a.width && b.y + b.height >= a.y + a.height);
            if (!contains) overlaps.push([a.cls || a.tag, b.cls || b.tag]);
          }
        }
      }
      return {
        bodyWidth: document.body.scrollWidth,
        viewportWidth: innerWidth,
        horizontalOverflow: document.body.scrollWidth > innerWidth + 1,
        shell: rect('.shell'),
        header: rect('.site-header .nav-wrap'),
        pageHeading: rect('.page-heading'),
        guideCopy: rect('.guide-copy'),
        storyHeading: rect('.story-v2-head'),
        storyGrid: rect('.story-grid-v2'),
        productHeading: rect('.product-v2-copy'),
        productGrid: rect('.product-showcase'),
        rolesHeading: rect('.roles-v2-head'),
        rolesGrid: rect('.role-grid-v2'),
        guidesHeading: rect('.guides-v2-head'),
        guidesGrid: rect('.editorial-grid'),
        footer: rect('.site-footer .footer-grid'),
        bodyFontSize: css('body', 'font-size'),
        h1FontSize: css('h1', 'font-size'),
        h1LineHeight: css('h1', 'line-height'),
        mainColumnGap: css('.content-page, .story-v2-head', 'column-gap'),
        overlaps: overlaps.slice(0, 20),
      };
    });

    report.push({ viewport: viewportName, width, page: pageName, pathname, diagnostics });
    await page.screenshot({ path: path.join(outDir, `${viewportName}-${pageName}.png`), fullPage: true });
    await page.close();
  }
}

await browser.close();
await fs.writeFile(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));

const failures = report.filter((entry) => entry.diagnostics.horizontalOverflow || entry.diagnostics.overlaps.length);
console.log(JSON.stringify({ pages: report.length, failures: failures.length, failureDetails: failures }, null, 2));
