# Next.js Portfolio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the custom `x-dc` runtime portfolio with a Next.js static-export app of identical appearance, deployed to GitHub Pages by Actions.

**Architecture:** One Next.js App Router project at the repo root. Content lives in typed files under `content/`; each page section is a presentational component that receives content as props and holds no cross-section state. All scroll motion is CSS — `animation-timeline: scroll()` with a designed `@supports` fallback — so there are no scroll listeners. Design tokens are copied from the existing design system into a Tailwind v4 `@theme` block so both systems resolve to the same values.

**Tech Stack:** Next.js (App Router, `output: 'export'`), TypeScript, Tailwind CSS v4, `next/font/google` (Archivo), GitHub Actions + `actions/deploy-pages`.

**Spec:** `docs/superpowers/specs/2026-08-18-nextjs-portfolio-design.md`

## Global Constraints

- Static export only. No API routes, no server components requiring a runtime, no middleware, no ISR. `output: 'export'` and `images: { unoptimized: true }` in `next.config.ts`.
- No `basePath` / `assetPrefix`. The repo is a GitHub user site served from the domain root.
- `public/.nojekyll` must exist. Next.js emits `_next/`, and an underscore-prefixed directory is dropped by Jekyll.
- Zero scroll event listeners, zero `ResizeObserver`, zero `requestAnimationFrame`. Motion is CSS only.
- Design token *values* are copied verbatim from `_ds/modernist-03d3a301-43a4-490d-a0b2-73fafd720b85/styles.css`. Never retype a hex code by hand from a screenshot or memory.
- Corner radius is 0 everywhere. `--radius-sm/md/lg` are all `0px` on purpose.
- Do not delete any file from the existing site until Task 9. The old site is the reference for visual comparison.
- Commit after every task.

---

### Task 1: Scaffold the app and get a static build out of it

**Files:**
- Create: `next.config.ts`, `public/.nojekyll`, `scripts/verify-build.mjs`, `.gitignore` (from scaffold)
- Create (from scaffold): `package.json`, `tsconfig.json`, `postcss.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

**Interfaces:**
- Consumes: nothing.
- Produces: `npm run build` emitting `out/`; `node scripts/verify-build.mjs` as the check every later task re-runs.

- [ ] **Step 1: Scaffold into a temp directory**

The repo root already holds the old site, so scaffold elsewhere and move the result in. This avoids `create-next-app`'s non-empty-directory refusal entirely.

```bash
cd /tmp && npx --yes create-next-app@latest portfolio-scaffold --typescript --tailwind --app --eslint --no-src-dir --import-alias "@/*" --use-npm --no-turbopack
```

- [ ] **Step 2: Move the scaffold into the repo root**

```bash
cd /tmp/portfolio-scaffold && rm -rf .git README.md && cp -r . "C:/Users/Pc/Documents/MyProjects/Ibrahim's Portfolio Website/"
```

Confirm `app/`, `package.json`, `tsconfig.json` and `.gitignore` now exist at the repo root and that `index.html`, `resume.html`, `_ds/`, `uploads/` are untouched.

- [ ] **Step 3: Record the installed versions**

```bash
node -p "const p=require('./package.json'); JSON.stringify({next:p.dependencies.next, react:p.dependencies.react, tw:p.devDependencies.tailwindcss||p.dependencies.tailwindcss}, null, 2)"
```

Write the three versions into the plan's Task 1 checkbox as a comment when you tick it. If `tailwindcss` is not v4.x, stop and report — the `@theme` approach in Task 2 assumes v4's CSS-first configuration.

- [ ] **Step 4: Write `next.config.ts`**

Replace the scaffolded config entirely:

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 5: Create the Jekyll opt-out**

```bash
touch public/.nojekyll
```

- [ ] **Step 6: Write the build check**

Create `scripts/verify-build.mjs`. Later tasks extend `CHECKS`; the runner stays as-is.

```js
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
      .map((m) => m[1])
      .filter((p) => !p.startsWith('http'))
      .every((p) => existsSync(join(OUT, p)));
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
```

- [ ] **Step 7: Run the check against no build, to verify it fails**

```bash
node scripts/verify-build.mjs
```

Expected: every check FAILs, exit code 1. A check that cannot fail is not a check.

- [ ] **Step 8: Build and run the check**

```bash
npm run build && node scripts/verify-build.mjs
```

Expected: build succeeds, all four checks PASS, exit code 0.

- [ ] **Step 9: Ignore build output**

Confirm `.gitignore` from the scaffold contains `/node_modules`, `/.next/` and `/out/`. Add `/out/` if absent.

- [ ] **Step 10: Commit**

```bash
git add -A && git commit -m "Scaffold Next.js app with static export to out/"
```

---

### Task 2: Port the design tokens and fonts

**Files:**
- Modify: `app/globals.css` (replace entirely)
- Modify: `app/layout.tsx`
- Read for values: `_ds/modernist-03d3a301-43a4-490d-a0b2-73fafd720b85/styles.css:4-64`

**Interfaces:**
- Consumes: Task 1's build pipeline.
- Produces: Tailwind utilities `bg-accent-500`, `text-neutral-700`, `font-heading`, `shadow-md`, `rounded-md` (= 0), plus raw custom properties `--color-bg`, `--color-text`, `--color-divider`, `--font-heading-weight` for use in arbitrary values.

- [ ] **Step 1: Write `app/globals.css`**

Copy every value from `styles.css:4-64` unchanged. Tailwind v4 generates a utility per `--color-*` / `--font-*` / `--radius-*` / `--shadow-*` token, so the names carry over as-is.

```css
@import "tailwindcss";

@theme {
  --color-bg: #f3f2f2;
  --color-surface: #eae9e9;
  --color-text: #201e1d;
  --color-accent: #ec3013;
  --color-accent-2: #e15b47;

  --color-neutral-100: #f8f4f4;
  --color-neutral-200: #eae7e7;
  --color-neutral-300: #d7d3d3;
  --color-neutral-400: #bab6b6;
  --color-neutral-500: #9b9797;
  --color-neutral-600: #7d7979;
  --color-neutral-700: #605d5d;
  --color-neutral-800: #444141;
  --color-neutral-900: #2d2b2b;

  --color-accent-100: #fff2ef;
  --color-accent-200: #ffe0d9;
  --color-accent-300: #ffc4b8;
  --color-accent-400: #ff9783;
  --color-accent-500: #ff563c;
  --color-accent-600: #dd2b0f;
  --color-accent-700: #ae1800;
  --color-accent-800: #7c1405;
  --color-accent-900: #4d170e;

  --color-accent-2-100: #fff2ef;
  --color-accent-2-200: #ffe0da;
  --color-accent-2-300: #ffc4b9;
  --color-accent-2-400: #ff9784;
  --color-accent-2-500: #ef6853;
  --color-accent-2-600: #c94b39;
  --color-accent-2-700: #9e3526;
  --color-accent-2-800: #71261b;
  --color-accent-2-900: #471d16;

  --radius-sm: 0px;
  --radius-md: 0px;
  --radius-lg: 0px;

  --shadow-sm: 0 1px 2px color-mix(in srgb, #2d2b2b 14%, transparent);
  --shadow-md: 0 3px 10px color-mix(in srgb, #2d2b2b 16%, transparent);
  --shadow-lg: 0 12px 32px color-mix(in srgb, #2d2b2b 22%, transparent);
}

/* Not Tailwind token types — plain custom properties, same values as the
   design system. --color-divider is referenced directly in arbitrary values. */
:root {
  --color-divider: color-mix(in srgb, #201e1d 40%, transparent);
  --font-heading-weight: 800;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
}

html { scroll-behavior: smooth; }

body {
  background: var(--color-bg);
  color: var(--color-text);
  text-wrap: pretty;
}

h1, h2, h3, h4 {
  font-family: var(--font-heading);
  font-weight: var(--font-heading-weight);
}

a { color: var(--color-accent-700); text-decoration: none; }
a:hover { color: var(--color-accent); text-decoration: underline; }

section[id] { scroll-margin-top: 76px; }

.grayscale { filter: grayscale(1) contrast(1.08); }
```

Note: `.grayscale` is retained because the hero portrait and backdrop still use it. Project images do **not** get it — that was decided earlier in this project's history and is why the class is applied per-element rather than globally.

- [ ] **Step 2: Wire Archivo through `next/font/google` in `app/layout.tsx`**

The design system loads Archivo from a Google Fonts `@import`. Self-hosting removes the third-party request and the layout shift.

```tsx
import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ibrahim Abou Halima — Full-stack + DevOps',
  description:
    'Full-stack developer building products end to end — MERN and Next.js on the web, Flutter and React Native on mobile. Based in Kuwait.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Alias the body font to the same family**

Append to `app/globals.css` — `--font-heading` is supplied by the `next/font` variable above, and body text uses the same family in this design system:

```css
@theme inline {
  --font-body: var(--font-heading);
}
```

- [ ] **Step 4: Extend the build check**

Add to `CHECKS` in `scripts/verify-build.mjs`, before the closing `];`:

```js
  ['accent token reaches the built CSS', () => {
    const html = read('index.html');
    const css = [...html.matchAll(/href="\/(_next\/static\/css\/[^"]+)"/g)].map((m) => m[1]);
    return css.length > 0 && css.some((p) => read(p).includes('#ec3013'));
  }],
```

- [ ] **Step 5: Build and check**

```bash
npm run build && node scripts/verify-build.mjs
```

Expected: all five checks PASS. If the accent check fails, the `@theme` block is not being consumed — confirm `postcss.config.mjs` lists `@tailwindcss/postcss` and that `globals.css` is imported by `layout.tsx`.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "Port design tokens into Tailwind @theme, self-host Archivo"
```

---

### Task 3: Content model

**Files:**
- Create: `content/projects.ts`, `content/site.ts`, `content/content.test.mjs`
- Read for values: `index.html:388-443` (the `data` array), `index.html:97-114` (at-a-glance), `index.html:177-202` (services), `index.html:206-257` (about), `index.html:261-272` (contact)

**Interfaces:**
- Consumes: nothing.
- Produces: `Project` type and `projects: Project[]` from `@/content/projects`; `site` object from `@/content/site` with keys `hero`, `glance`, `services`, `about`, `contact`, `footer`.

- [ ] **Step 1: Write `content/projects.ts`**

Copy all five records verbatim from the `data` array at `index.html:388-443`. Do not reword, retitle, or "improve" any copy. `image` is `null` for every project — no screenshots exist yet.

```ts
export type Project = {
  title: string;
  url: string;
  domain: string;
  body: string;
  tags: string[];
  product: string;
  built: string;
  stack: string;
  image: string | null;
};

export const projects: Project[] = [
  // ... five records copied from index.html:388-443, each with image: null
];
```

The derived fields in the old code (`num`, `open`, `closed`, `toggle`, `toggleLabel`, `slotId`, `slotHint`) are **not** stored. `num` is computed at render from the array index; the rest are replaced by `<details>`.

- [ ] **Step 2: Write `content/site.ts`**

Copy the prose verbatim from the line ranges listed under **Files**. Shape:

```ts
export const site = {
  hero: {
    name: 'Ibrahim Abou Halima',
    headline: 'Full-stack + DevOps.',
    body: '...',            // from index.html hero
    email: 'ibrahim.ihab@hotmail.com',
    ctaPrimary: { label: 'See the work', href: '#work' },
  },
  glance: [] as { label: string; value: string }[],   // index.html:97-114
  services: [] as { title: string; body: string }[],  // index.html:177-202
  about: { heading: '', paragraphs: [] as string[] }, // index.html:206-257
  contact: { heading: '', body: '', email: '' },      // index.html:261-272
  footer: '© 2026 Ibrahim Abou Halima — Kuwait',
};
```

Fill every array and string from the source. An empty array left in place is a plan failure, not a valid state.

- [ ] **Step 3: Assert on content through the built output**

Do not add a test runner or import `.ts` from Node — type stripping is version-gated and would rot. `verify-build.mjs` already runs on plain Node against the built HTML, which is a stronger check anyway: it proves the content survived static export rather than merely existing in a module.

TypeScript itself covers the shape of `Project` at build time. What it cannot catch is a section left unfilled, so check the rendered copy. Add to `CHECKS`:

```js
  ['at-a-glance stats rendered', () => {
    const html = read('index.html');
    // labels copied from index.html:97-114 — update here if the copy changes
    return GLANCE_LABELS.every((l) => html.includes(l));
  }],
  ['every service rendered', () => {
    const html = read('index.html');
    return SERVICE_TITLES.every((t) => html.includes(t));
  }],
  ['about paragraphs rendered', () =>
    read('index.html').includes(ABOUT_FIRST_SENTENCE)],
  ['contact email rendered', () =>
    read('index.html').includes('ibrahim.ihab@hotmail.com')],
```

Declare the three constants at the top of `verify-build.mjs` with the actual strings taken from `index.html`:

```js
const GLANCE_LABELS = [/* labels from index.html:97-114 */];
const SERVICE_TITLES = [/* titles from index.html:177-202 */];
const ABOUT_FIRST_SENTENCE = '';  // first sentence from index.html:206-257
```

- [ ] **Step 4: Run the check to verify it fails**

```bash
npm run build && node scripts/verify-build.mjs
```

Expected: the four new checks FAIL — Task 3 has only written content files, and no component renders them yet. They stay red until Task 6 wires the sections in, which is correct: they are the acceptance test for the port being complete.

Note this as expected-red when ticking the box. If they pass here, something is wrong — nothing renders this content yet.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Add typed content model with the five projects and site copy"
```

---

### Task 4: Hero, nav, and the scroll motion

**Files:**
- Create: `components/Hero.tsx`, `components/Nav.tsx`, `components/hero.module.css`
- Modify: `app/page.tsx`
- Read for markup: `index.html:27-114`

**Interfaces:**
- Consumes: `site` from `@/content/site`.
- Produces: `<Hero />` and `<Nav />`, both taking no props.

**Motion background — read before writing CSS.**

The old JS computed a base monitor width, then a zoom *ratio* against the viewport:

```js
w      = max(280, min(640, innerWidth * 0.86, (innerHeight - 210) * 1.6))
target = min(4, max(innerWidth * 1.02 / w, innerHeight * 1.02 / (w / 1.6)))
width  = w * (1 + (target - 1) * smoothstep(p))
```

That ratio **cannot** be expressed in CSS — `calc()` cannot divide a length by a length. Multiply it through instead. The end width is:

```
w * min(4, max(1.02vw / w, 1.02vh / (w/1.6)))  ==  min(4 * w, max(102vw, 102vh * 1.6))
```

All lengths, all legal. And interpolating `width` linearly between `w` and that end value is mathematically identical to scaling by an interpolated ratio, so no registered custom property is needed — plain `@keyframes` on `width` and `font-size` suffice.

`svh` is used rather than `vh` so mobile URL-bar collapse does not resize the stage mid-scroll.

- [ ] **Step 1: Write `components/hero.module.css`**

```css
.stage {
  --base-w: clamp(280px, min(86vw, (100svh - 210px) * 1.6), 640px);
  --end-w: min(calc(var(--base-w) * 4), max(102vw, calc(102svh * 1.6)));

  position: relative;
  height: 300svh;
  animation-timeline: scroll();
  animation-range: 0 100%;
}

.pane {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
}

.monitor {
  position: relative;
  width: var(--base-w);
  font-size: calc(var(--base-w) / 64);
  animation: monitor-zoom linear both;
  animation-timeline: scroll();
  animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); /* ≈ smoothstep */
}

/* frame, stand and backdrop fade out as the monitor fills the viewport */
.frame, .stand, .backdrop {
  animation: chrome-fade linear both;
  animation-timeline: scroll();
}

.hint { animation: hint-fade linear both; animation-timeline: scroll(); }

@keyframes monitor-zoom {
  from { width: var(--base-w); font-size: calc(var(--base-w) / 64); }
  to   { width: var(--end-w);  font-size: calc(var(--end-w) / 64); }
}

/* original: fade = clamp01((0.9 - p) / 0.4) — flat until 50%, gone by 90% */
@keyframes chrome-fade {
  0%, 50% { opacity: 1; }
  90%, 100% { opacity: 0; }
}

/* original: 1 - p * 4 — gone by 25% */
@keyframes hint-fade {
  0% { opacity: 1; }
  25%, 100% { opacity: 0; }
}

/* Designed fallback, not an absence: a normal hero with the monitor at its
   final size. Firefox has no scroll-driven animations in stable as of 152. */
@supports not (animation-timeline: scroll()) {
  .stage { height: 100svh; }
  .monitor { width: var(--end-w); font-size: calc(var(--end-w) / 64); animation: none; }
  .frame, .stand, .backdrop { opacity: 0; animation: none; }
  .hint { opacity: 0; animation: none; }
}

@media (prefers-reduced-motion: reduce) {
  .stage { height: 100svh; }
  .monitor { width: var(--end-w); font-size: calc(var(--end-w) / 64); animation: none; }
  .frame, .stand, .backdrop { opacity: 0; animation: none; }
  .hint { opacity: 0; animation: none; }
}
```

- [ ] **Step 2: Write `components/Hero.tsx`**

Port the markup from `index.html:36-91`. Keep the em-based internal sizing of the monitor screen exactly — every child of `.monitor` sizes in `em`, which is what makes one animated `font-size` scale the whole mockup.

Drop the `heroBackdrop` variants. Only "Ruled grid" was ever used; render that one backdrop directly:

```tsx
<div className={styles.backdrop} style={{
  background: 'repeating-linear-gradient(to right, color-mix(in srgb, var(--color-text) 14%, transparent) 0 2px, transparent 2px 12.5%)',
}} />
```

The portrait keeps `className="grayscale"` and uses `<img src="/images/hero-portrait.webp" width={486} height={486} alt="Ibrahim Abou Halima" />`.

- [ ] **Step 3: Write `components/Nav.tsx`**

Port from `index.html:27-34`. The old nav faded in via JS at `p > 0.93`; that becomes a keyframe in `hero.module.css`:

```css
.nav {
  opacity: 0;
  animation: nav-in linear both;
  animation-timeline: scroll();
}
@keyframes nav-in {
  0%, 93% { opacity: 0; pointer-events: none; }
  98%, 100% { opacity: 1; pointer-events: auto; }
}
@supports not (animation-timeline: scroll()) {
  .nav { opacity: 1; pointer-events: auto; animation: none; }
}
```

Links: Work, Services, About, Contact, and Résumé → `/resume`.

- [ ] **Step 4: Extract the hero portrait from the old sidecar**

The sidecar holds two filled slots, `hero-portrait` and `hero-backdrop`. Only the portrait is needed: `hero-backdrop` was the photograph variant of the hero background, and Step 2 drops every backdrop variant except the ruled grid, which is a CSS gradient. Extracting it would ship a 300KB image nothing references.

The portrait exists only as a base64 data URI. Decode it to a file:

```bash
node -e "const d=require('./.image-slots.state.json'); const u=d['hero-portrait'].u; require('fs').mkdirSync('public/images',{recursive:true}); require('fs').writeFileSync('public/images/hero-portrait.webp', Buffer.from(u.split(',')[1],'base64'));"
```

Confirm the file is a valid WebP and roughly 486×486.

- [ ] **Step 5: Render the hero from `app/page.tsx`**

```tsx
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
    </>
  );
}
```

- [ ] **Step 6: Extend the build check**

```js
  ['hero portrait ships', () => existsSync(join(OUT, 'images/hero-portrait.webp'))],
  ['scroll-driven fallback is present', () => {
    const html = read('index.html');
    const css = [...html.matchAll(/href="\/(_next\/static\/css\/[^"]+)"/g)].map((m) => m[1]);
    return css.some((p) => read(p).includes('animation-timeline'))
        && css.some((p) => read(p).includes('@supports not'));
  }],
```

- [ ] **Step 7: Build, check, and look at it**

```bash
npm run build && node scripts/verify-build.mjs && npx --yes serve out -l 8766
```

Open `http://localhost:8766`, scroll the hero, and confirm the monitor zooms to fill the viewport while the frame and stand fade. Then confirm the fallback by loading the same page in a browser without scroll-driven animation support — the stage should be one screen tall with the monitor already full-bleed, never three screens of nothing.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "Port hero and nav with CSS scroll-driven motion"
```

---

### Task 5: Work track and project cards

**Files:**
- Create: `components/WorkTrack.tsx`, `components/ProjectCard.tsx`, `components/work.module.css`
- Modify: `app/page.tsx`
- Read for markup: `index.html:119-171`

**Interfaces:**
- Consumes: `projects` and `Project` from `@/content/projects`.
- Produces: `<WorkTrack />` (no props); `<ProjectCard project={p} index={i} />`.

**Two intentional deviations from the old behaviour — both approved in the spec:**

1. The 500vh section that translated a track horizontally as you scrolled *vertically* is replaced by a natively scrollable track with `scroll-snap`. The page gets much shorter and the track becomes keyboard- and touch-operable.
2. The old counter rendered `01 / 06` for five projects — `Math.min(6, ...)` and a hardcoded `"/ 06"` against a five-item array. That is a bug. The new counter derives from `projects.length`, so it reads `/ 05`.

- [ ] **Step 1: Write `components/work.module.css`**

```css
.track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min(80vw, 520px);
  gap: 32px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  padding-bottom: 24px;
}

.card { scroll-snap-align: start; }

/* the track is the scroll container, so it drives its own progress bar */
.progress {
  height: 2px;
  background: var(--color-divider);
}
```

- [ ] **Step 2: Write `components/ProjectCard.tsx`**

The case study was a JS `state.open` toggle. It becomes native `<details>`, which brings keyboard support, screen-reader semantics, and find-in-page for collapsed text at no cost.

```tsx
import type { Project } from '@/content/projects';

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const num = String(index + 1).padStart(2, '0');
  return (
    <article className="flex flex-col">
      <span className="font-heading text-sm text-neutral-600">{num}</span>
      <h3 className="font-heading text-2xl">{project.title}</h3>
      <a href={project.url} target="_blank" rel="noopener noreferrer">{project.domain}</a>
      <p>{project.body}</p>
      <ul className="flex flex-wrap gap-2">
        {project.tags.map((t) => <li key={t}>{t}</li>)}
      </ul>

      <figure className="mt-6 flex-1 min-h-0">
        {project.image ? (
          <img src={project.image} alt={`${project.title} screenshot`} width={1200} height={750} />
        ) : (
          <div
            className="grid h-full w-full place-items-center bg-surface text-neutral-600"
            style={{ aspectRatio: '1200 / 750' }}
          >
            {project.domain}
          </div>
        )}
      </figure>

      <details>
        <summary>Case study</summary>
        <p>{project.product}</p>
        <p>{project.built}</p>
        <p>{project.stack}</p>
      </details>
    </article>
  );
}
```

The placeholder is a real state with the same aspect ratio as a screenshot, so adding an image later does not shift layout.

- [ ] **Step 3: Write `components/WorkTrack.tsx`**

Port headings and the counter from `index.html:119-135`. Counter text is `` `01 / ${String(projects.length).padStart(2, '0')}` ``.

- [ ] **Step 4: Extend the build check**

```js
  ['every project renders into the static HTML', () => {
    const html = read('index.html');
    return ['Givitude', 'Mubaader', 'Mubaader Realtor', 'Theqa Invest', 'Hamoo']
      .every((t) => html.includes(t));
  }],
  ['case studies are in the markup, not injected by JS', () =>
    read('index.html').includes('<details')],
```

- [ ] **Step 5: Build and check**

```bash
npm run build && node scripts/verify-build.mjs
```

Expected: all checks PASS. The project-title check is what proves static export actually rendered the content rather than deferring it to the client.

- [ ] **Step 6: Verify the track by keyboard**

Serve `out/`, Tab through the cards, and confirm the track scrolls to follow focus and that `<details>` opens on Enter.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "Port work track to scroll-snap and case studies to <details>"
```

---

### Task 6: Services, about, contact, footer

**Files:**
- Create: `components/Glance.tsx`, `components/Services.tsx`, `components/About.tsx`, `components/Contact.tsx`
- Modify: `app/page.tsx`
- Read for markup: `index.html:97-114`, `177-202`, `206-257`, `261-275`

**Interfaces:**
- Consumes: `site` from `@/content/site`.
- Produces: four components, each taking no props.

- [ ] **Step 1: Write the four components**

Port each section's markup and copy verbatim from the line ranges above. Carry over the two responsive rules that live in the old page's inline `<style>` (`index.html:20-21`) onto the services grid:

```
@media (min-width: 1000px) → grid-template-columns: repeat(4, minmax(0, 1fr))
@media (max-width: 520px)  → grid-template-columns: minmax(0, 1fr)
```

In Tailwind: `grid-cols-1 sm:grid-cols-2 min-[1000px]:grid-cols-4`.

The contact section keeps its full-bleed accent field: `bg-accent text-bg`.

- [ ] **Step 2: Compose the full page in `app/page.tsx`**

```tsx
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Glance from '@/components/Glance';
import WorkTrack from '@/components/WorkTrack';
import Services from '@/components/Services';
import About from '@/components/About';
import Contact from '@/components/Contact';
import { site } from '@/content/site';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <main className="mx-auto w-full max-w-[1200px] px-6">
        <Glance />
        <WorkTrack />
        <Services />
        <About />
      </main>
      <Contact />
      <footer className="mx-auto w-full max-w-[1200px] px-6 py-14 text-[13px] leading-[26px]"
              style={{ color: 'color-mix(in srgb, var(--color-text) 70%, transparent)' }}>
        {site.footer}
      </footer>
    </>
  );
}
```

Note `#work`, `#services`, `#about`, `#contact` ids must survive onto the sections — the nav links depend on them.

- [ ] **Step 3: Extend the build check**

```js
  ['nav anchor targets exist', () => {
    const html = read('index.html');
    return ['work', 'services', 'about', 'contact'].every((id) => html.includes(`id="${id}"`));
  }],
```

- [ ] **Step 4: Build and check**

```bash
npm run build && node scripts/verify-build.mjs
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Port glance, services, about, contact and footer"
```

---

### Task 7: Résumé page

**Files:**
- Create: `app/resume/page.tsx`
- Read for markup: `resume.html` (130 lines, entire file)

**Interfaces:**
- Consumes: tokens from `globals.css`.
- Produces: the route `/resume`, emitted as `out/resume/index.html`.

`resume.html` uses `doc-page.js` purely for document layout and has no interactivity, so it ports to plain JSX.

- [ ] **Step 1: Write `app/resume/page.tsx`**

Port the résumé content verbatim — heading, contact line, summary, experience entries, skills. Single column, max width ~820px, same tokens.

Add page metadata:

```tsx
export const metadata = { title: 'Ibrahim Abou Halima — Résumé' };
```

- [ ] **Step 2: Fix the inbound link**

`Nav.tsx` and the hero's "Download résumé" button both point at `/resume`.

- [ ] **Step 3: Extend the build check**

```js
  ['resume route is exported', () => existsSync(join(OUT, 'resume/index.html'))],
```

- [ ] **Step 4: Build and check**

```bash
npm run build && node scripts/verify-build.mjs
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Port the resume page to /resume"
```

---

### Task 8: Deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: `npm run build` producing `out/`.
- Produces: a Pages deployment on every push to `main`.

- [ ] **Step 1: Write the workflow**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: node scripts/verify-build.mjs
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

CI runs exactly what a developer runs locally. `verify-build.mjs` is in the build job rather than trusting `next build` alone, because `next build` succeeding proves the code compiles, not that the content rendered.

- [ ] **Step 2: Validate the YAML parses**

```bash
node -e "const y=require('fs').readFileSync('.github/workflows/deploy.yml','utf8'); if(!/actions\/deploy-pages/.test(y)) throw new Error('deploy step missing'); console.log('workflow looks structurally sane');"
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "Add GitHub Pages deploy workflow"
```

---

### Task 9: Side-by-side verification and cutover

**Files:**
- Delete: `index.html`, `resume.html`, `support.js`, `image-slot.js`, `doc-page.js`, `.image-slots.state.json`, `.thumbnail`, `_ds/`
- Keep: `uploads/` unless the user says otherwise — those are original source images, not runtime files.

**Interfaces:**
- Consumes: everything above.
- Produces: a repo containing only the Next.js app.

**This task requires user sign-off between Step 3 and Step 4. Do not delete anything before it.**

- [ ] **Step 1: Serve both sites**

```bash
git stash list >/dev/null; npx --yes serve out -l 8766
```

and in a second shell, the old site from the repo root:

```bash
python -m http.server 8765 --bind 127.0.0.1
```

- [ ] **Step 2: Compare at both widths**

Screenshot old (`:8765`) and new (`:8766`) at 1280×800 and 375×812, for `/` and the résumé.

Blocking differences: section order, layout or grid structure, spacing that reads as different, type size or weight, colour, and the monitor's proportions at the start and end of the scroll.

Acceptable differences: font antialiasing, sub-pixel text metrics from self-hosted Archivo, scrollbar rendering, the shorter page from the work-track change, and the `/ 05` counter.

- [ ] **Step 3: Report to the user and wait**

Present the comparison, list every difference found, and ask for sign-off. Do not proceed on your own judgement.

- [ ] **Step 4: Remove the old runtime**

```bash
git rm -r --cached _ds && rm -rf _ds
rm -f index.html resume.html support.js image-slot.js doc-page.js .image-slots.state.json .thumbnail
```

The root `.nojekyll` can go too — `public/.nojekyll` replaces it and ships in the build output.

- [ ] **Step 5: Final build and check**

```bash
npm ci && npm run build && node scripts/verify-build.mjs
```

Expected: everything PASSes with the old files gone. If anything fails here, the new app was depending on a file it should not have been.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "Remove the x-dc runtime and the old static site"
```

- [ ] **Step 7: Tell the user what to do on GitHub**

The repo still has to be created and pushed, and Pages source must be set to **GitHub Actions** (not "Deploy from a branch") — the workflow deploys an artifact, not a branch.

---

## Notes for the implementer

- The old site is the specification for appearance. When markup and this plan disagree about a value, the markup wins — read it rather than inventing.
- `image-slot.js`, `support.js` and `doc-page.js` are vendored third-party runtime. Never edit them; they are being deleted in Task 9.
- If `create-next-app` installs Tailwind v3 rather than v4, stop at Task 1 Step 3 and report. Task 2 assumes CSS-first `@theme` configuration and would need rewriting against `tailwind.config.js`.
