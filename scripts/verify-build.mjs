// Asserts on the built `out/` directory. Run after `npm run build`.
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { resumeText } from './resume-text.mjs';

const OUT = 'out';
const read = (p) => readFileSync(join(OUT, p), 'utf8');

// A root-relative path resolves as a file directly (assets: _next/static/*,
// images/*, favicon.ico) or, for an extensionless route link, as a directory
// carrying its own index.html (trailingSlash: true in next.config.ts, e.g.
// /resume -> out/resume/index.html). Next leaves a directory with internal
// RSC-artifact files (__next._full.txt etc.) at that path even when the real
// page is missing, so a bare existsSync on the directory itself isn't enough
// evidence — check for the index.html specifically once it's a directory.
const resolves = (p) => {
  const full = join(OUT, p);
  if (!existsSync(full)) return false;
  return statSync(full).isDirectory() ? existsSync(join(full, 'index.html')) : true;
};

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

// Named exceptions for the asset-path check below, by exact path (post
// query-strip). Empty today — nothing in the current build needs one — but
// this is where a genuine one-off exception gets named precisely, instead of
// the blanket extension filter this replaced, which silently skipped every
// route link (including the not-yet-existing /resume) along with it.
const ASSET_SKIP = new Set();

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
      .filter((p) => !ASSET_SKIP.has(p))
      .every(resolves);
  }],
  ['accent token reaches the built CSS', () => {
    const html = read('index.html');
    // Next 16 with Turbopack emits the stylesheet under _next/static/chunks/,
    // not _next/static/css/ (the older webpack convention) — match by extension.
    const css = [...html.matchAll(/href="\/(_next\/static\/[^"]+\.css)"/g)].map((m) => m[1]);
    return css.length > 0 && css.some((p) => read(p).includes('#ec3013'));
  }],
  // Was `existsSync('images/hero-portrait.webp')`, which broke the moment the
  // portrait was swapped for a .jpg. Assert what the page actually asks for
  // resolves, so this survives format and filename changes — and covers every
  // project screenshot too, not just the portrait.
  ['every referenced image ships', () => {
    const srcs = [...read('index.html').matchAll(/src="(\/images\/[^"]+)"/g)].map((m) => m[1]);
    return srcs.length >= 7 && srcs.every((s) => existsSync(join(OUT, s.slice(1))));
  }],
  ['scroll-driven hero motion and its designed fallback both ship', () => {
    const html = read('index.html');
    const css = [...html.matchAll(/href="\/(_next\/static\/[^"]+\.css)"/g)].map((m) => m[1]);
    // Match the timeline NAME (--hero), not just the property — the fallback
    // block right below also declares `view-timeline: none`, so a bare
    // `.includes('view-timeline')` would still pass with the real animation
    // deleted entirely.
    return css.length > 0
      && css.some((p) => read(p).includes('animation-timeline:--hero'))
      && css.some((p) => read(p).includes('view-timeline:--hero'))
      && css.some((p) => read(p).includes('@supports not'));
  }],
  ['work track is scroll-jacked, with its scroll-snap fallback intact', () => {
    const html = read('index.html');
    const css = [...html.matchAll(/href="\/(_next\/static\/[^"]+\.css)"/g)].map((m) => m[1]);
    const all = css.map((p) => read(p)).join('');
    // Same lesson as the hero check above: match the timeline NAME. `--work`
    // must never collide with `--hero` — a duplicate `--hero` declaration
    // makes that name ambiguous and silently kills the hero zoom.
    return css.length > 0
      && all.includes('view-timeline:--work')
      && all.includes('animation-timeline:--work')
      && (all.match(/view-timeline:--hero/g) || []).length === 1
      // the base layer everyone without scroll-driven animations falls back to
      && all.includes('scroll-snap-type:x mandatory')
      && all.includes('prefers-reduced-motion:no-preference');
  }],
  ['every project renders into the static HTML', () => {
    const html = read('index.html');
    return ['Masarra', 'Givitude', 'Mubaader', 'Mubaader Realtor', 'Theqa Invest', 'Hamoo']
      .every((t) => html.includes(t));
  }],
  ['case studies are in the markup, not injected by JS', () =>
    read('index.html').includes('<details')],
  ['work counter renders every project number and the total', () => {
    const html = read('index.html');
    // The current number used to be a static "01 / 06" string. It is now a
    // column of every number, scrolled by a stepped animation, so assert the
    // column is complete and the total still matches the project count —
    // a short column would silently stop counting partway through the track.
    const at = html.indexOf('counterList');
    if (at < 0) return false;
    // Six two-digit spans are ~120 chars; 400 is slack without reaching the
    // card kickers further down, which use the same numbers in <p> tags.
    const nums = [...html.slice(at, at + 400).matchAll(/<span>(\d\d)<\/span>/g)].map((m) => m[1]);
    return nums.join(',') === '01,02,03,04,05,06' && html.includes('/ 06');
  }],
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
  ['monitor click-to-skip anchor and its target both exist', () => {
    const html = read('index.html');
    // A plain <a>, so the skip works with no JavaScript — if it ever becomes a
    // JS handler it stops working before hydration.
    const anchor = /<a[^>]*href="#hero-end"[^>]*>/.test(html);
    // ...and the id it points at has to exist, or the click silently does
    // nothing. This half is why the check is worth having: an earlier version
    // asserted only the href, and went stale when the target changed from
    // #work to #hero-end without anyone noticing for two commits.
    const target = /id="hero-end"/.test(html);
    return anchor && target;
  }],
  ['favicon and touch icon ship and are linked', () => {
    // create-next-app's stock Next.js logo shipped as this site's favicon for
    // several commits before anyone noticed, so assert both that the files
    // exist and that the document actually points at them.
    const html = read('index.html');
    return existsSync(join(OUT, 'favicon.ico'))
      && existsSync(join(OUT, 'apple-icon.png'))
      && /<link[^>]+rel="icon"[^>]+href="\/favicon\.ico/.test(html)
      && /<link[^>]+rel="apple-touch-icon"/.test(html);
  }],
  ['header height is one shared token, and the mobile rules ship', () => {
    const html = read('index.html');
    const css = [...html.matchAll(/href="\/(_next\/static\/[^"]+\.css)"/g)]
      .map((p) => read(p[1])).join('');
    // The nav's height was a 76px literal in three places while the real
    // mobile nav was 107px, so the work section's kicker and counter sat
    // underneath it. One token now, consumed rather than restated.
    return css.includes('--nav-h')
      && css.includes('var(--nav-h)')
      // brand collapses to initials so the row cannot wrap and grow
      && css.includes('white-space:nowrap')
      && /@media[^{]*max-width:\s*640px/.test(css)
      // the work header offsets by the token instead of a magic number
      && /padding:\s*calc\(var\(--nav-h\)/.test(css);
  }],
  ['share preview card is complete', () => {
    // A missing og:image degrades silently — the page looks fine and only the
    // link previews people receive are broken, which the owner never sees.
    const html = read('index.html');
    const og = (p) => new RegExp(`<meta property="og:${p}" content="[^"]+"`).test(html);
    const imgSrc = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
    return og('title') && og('description') && og('image') && og('url')
      && /<meta name="twitter:card" content="summary_large_image"/.test(html)
      // absolute url, or scrapers cannot fetch it
      && !!imgSrc?.startsWith('http')
      // and the file it points at actually shipped
      && existsSync(join(OUT, new URL(imgSrc).pathname.split('/').pop().split('?')[0]));
  }],
  ['below-fold images are lazy, hero is not', () => {
    const html = read('index.html');
    const imgs = [...html.matchAll(/<img[^>]+>/g)].map((m) => m[0]);
    const lazy = imgs.filter((t) => t.includes('loading="lazy"'));
    // the portrait is above the fold and must stay eager; the six screenshots
    // below it should not compete with it for the first paint
    return imgs.length === 7 && lazy.length === 6
      && !imgs.find((t) => t.includes('hero-portrait'))?.includes('loading="lazy"');
  }],
  ['404 is styled and offers a way back', () =>
    existsSync(join(OUT, '404.html')) && read('404.html').includes('href="/"')],
  ['resume print styles ship', () => {
    // These rules ARE the downloaded PDF's design — the button opens the
    // browser print dialog rather than serving a generated file, so losing
    // them silently degrades the PDF rather than breaking a visible page.
    const html = read('resume/index.html');
    const css = [...html.matchAll(/href="\/(_next\/static\/[^"]+\.css)"/g)].map((m) => m[1]);
    const all = css.map((p) => read(p)).join('');
    return all.includes('@page')
      && all.includes('@media print')
      && all.includes('break-inside:avoid')
      && /@media print[\s\S]{0,400}?\.no-print/.test(all);
  }],
  ['resume PDF ships and is not stale', () => {
    // The PDF is a committed artifact regenerated by hand, so the failure mode
    // is editing the résumé and forgetting to rerun the script — shipping a
    // PDF that silently disagrees with the page. This compares a hash of the
    // rendered résumé text against the one stamped when the PDF was made.
    if (!existsSync(join(OUT, 'resume.pdf'))) return false;
    const stamped = readFileSync(join(OUT, 'resume.pdf.sha256'), 'utf8').trim();
    const actual = createHash('sha256').update(resumeText(OUT)).digest('hex');
    if (stamped !== actual) {
      console.log('      resume content changed since the PDF was generated.');
      console.log('      Fix: node scripts/make-resume-pdf.mjs');
    }
    return stamped === actual;
  }],
  ['resume route is exported', () => existsSync(join(OUT, 'resume/index.html'))],
];

let failed = 0;
for (const [name, fn] of CHECKS) {
  let ok = false;
  try { ok = fn(); } catch (e) { ok = false; }
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
  if (!ok) failed++;
}
process.exit(failed === 0 ? 0 : 1);
