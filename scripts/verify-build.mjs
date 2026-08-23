// Asserts on the built `out/` directory. Run after `npm run build`.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'out';
const read = (p) => readFileSync(join(OUT, p), 'utf8');

// Verbatim from index.html:97-114, 177-202, 206 (first sentence of the first
// about paragraph). The services title has a literal "&" in the source
// (index.html:197 `DevOps &amp; hosting`) which React re-escapes the same
// way when it serializes the built HTML, so the check string carries the
// entity too — a plain "&" would never match the built markup.
const GLANCE_LABELS = [
  'Products shipped live',
  'Platforms — web, iOS, Android',
  'Mobile stacks — Flutter, React Native',
  'Developer, front to back',
];
const SERVICE_TITLES = ['Full-stack web application', 'Mobile app', 'Shopify store', 'DevOps &amp; hosting'];
const ABOUT_FIRST_SENTENCE = 'Full-stack, DevOps, mobile and Shopify developer in Kuwait.';

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
      // Assets only. Extensionless roots are page routes, not assets, and some
      // are forward references to routes a later task adds (e.g. /resume);
      // those get their own existence checks when they land.
      .filter((p) => /\.[a-z0-9]+$/i.test(p))
      .every((p) => existsSync(join(OUT, p)));
  }],
  ['accent token reaches the built CSS', () => {
    const html = read('index.html');
    // Next 16 with Turbopack emits the stylesheet under _next/static/chunks/,
    // not _next/static/css/ (the older webpack convention) — match by extension.
    const css = [...html.matchAll(/href="\/(_next\/static\/[^"]+\.css)"/g)].map((m) => m[1]);
    return css.length > 0 && css.some((p) => read(p).includes('#ec3013'));
  }],
  ['hero portrait ships', () => existsSync(join(OUT, 'images/hero-portrait.webp'))],
  ['scroll-driven hero motion and its designed fallback both ship', () => {
    const html = read('index.html');
    const css = [...html.matchAll(/href="\/(_next\/static\/[^"]+\.css)"/g)].map((m) => m[1]);
    return css.length > 0
      && css.some((p) => read(p).includes('animation-timeline'))
      && css.some((p) => read(p).includes('view-timeline'))
      && css.some((p) => read(p).includes('@supports not'));
  }],
  ['every project renders into the static HTML', () => {
    const html = read('index.html');
    return ['Masarra', 'Givitude', 'Mubaader', 'Mubaader Realtor', 'Theqa Invest', 'Hamoo']
      .every((t) => html.includes(t));
  }],
  ['case studies are in the markup, not injected by JS', () =>
    read('index.html').includes('<details')],
  ['work counter reads 01 / 06', () => read('index.html').includes('01 / 06')],
  ['nav anchor targets exist', () => {
    const html = read('index.html');
    return ['work', 'services', 'about', 'contact'].every((id) => html.includes(`id="${id}"`));
  }],
  ['at-a-glance stats rendered', () =>
    GLANCE_LABELS.every((l) => read('index.html').includes(l))],
  ['every service rendered', () =>
    SERVICE_TITLES.every((t) => read('index.html').includes(t))],
  ['about copy rendered', () =>
    read('index.html').includes(ABOUT_FIRST_SENTENCE)],
  ['contact email rendered', () =>
    read('index.html').includes('ibrahim.ihab@hotmail.com')],
];

let failed = 0;
for (const [name, fn] of CHECKS) {
  let ok = false;
  try { ok = fn(); } catch (e) { ok = false; }
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
  if (!ok) failed++;
}
process.exit(failed === 0 ? 0 : 1);
