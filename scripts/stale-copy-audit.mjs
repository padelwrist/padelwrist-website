import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const stalePatterns = [
  /coming soon/i,
  /first release/i,
  /first version/i,
  /being built/i,
  /being designed/i,
  /we are building/i,
];

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html') || entry.name === 'llms.txt') files.push(full);
  }
}

walk(root);

const findings = [];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const pattern of stalePatterns) {
      if (pattern.test(line)) {
        findings.push(`${path.relative(root, file)}:${index + 1}: ${pattern}`);
      }
    }
  });
}

if (findings.length) {
  console.error('Stale pre-launch wording found:');
  findings.forEach((finding) => console.error(`- ${finding}`));
  process.exit(1);
}

console.log(`Stale-copy audit passed across ${files.length} public text files.`);
