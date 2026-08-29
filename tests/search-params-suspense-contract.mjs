import fs from 'node:fs';
import path from 'node:path';

const appDir = new URL('../src/app/', import.meta.url);
const base = appDir.pathname;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const offenders = walk(base)
  .filter((file) => file.endsWith('page.tsx'))
  .filter((file) => fs.readFileSync(file, 'utf8').includes('useSearchParams'))
  .filter((file) => {
    const source = fs.readFileSync(file, 'utf8');
    return !source.includes('<Suspense');
  });

if (offenders.length) {
  throw new Error(`Pages using useSearchParams without Suspense: ${offenders.map((f) => path.relative(base, f)).join(', ')}`);
}

console.log('all useSearchParams pages are wrapped in Suspense');
