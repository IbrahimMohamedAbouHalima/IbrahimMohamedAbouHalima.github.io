// Asserts on the built `out/` directory. Run after `npm run build`.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'out';
const read = (p) => readFileSync(join(OUT, p), 'utf8');

const CHECKS = [
  ['index.html exists', () => existsSync(join(OUT, 'index.html'))],
  ['_next assets emitted', () => existsSync(join(OUT, '_next'))],
  ['.nojekyll survives the build', () => existsSync(join(OUT, '.nojekyll'))],
  ['no unresolved Next asset paths', () => {
    const html = read('index.html');
    return [...html.matchAll(/(?:src|href)="\/([^"]+)"/g)]
      // Next emits cache-busting query strings on metadata routes (e.g. favicon.ico?<hash>);
      // strip query/hash before checking the filesystem path.
      .map((m) => m[1].split(/[?#]/)[0])
      .filter((p) => !p.startsWith('http'))
      .every((p) => existsSync(join(OUT, p)));
  }],
  ['accent token reaches the built CSS', () => {
    const html = read('index.html');
    // Next 16 with Turbopack emits the stylesheet under _next/static/chunks/,
    // not _next/static/css/ (the older webpack convention) — match by extension.
    const css = [...html.matchAll(/href="\/(_next\/static\/[^"]+\.css)"/g)].map((m) => m[1]);
    return css.length > 0 && css.some((p) => read(p).includes('#ec3013'));
  }],
];

let failed = 0;
for (const [name, fn] of CHECKS) {
  let ok = false;
  try { ok = fn(); } catch (e) { ok = false; }
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
  if (!ok) failed++;
}
process.exit(failed === 0 ? 0 : 1);
