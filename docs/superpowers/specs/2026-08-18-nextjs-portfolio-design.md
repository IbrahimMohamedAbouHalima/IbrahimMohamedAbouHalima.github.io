# Next.js Portfolio Rebuild — Design

Date: 2026-08-18
Status: Approved, pending implementation plan

## Context

The portfolio currently runs on a custom `x-dc` client-side runtime: `index.html`
declares markup with `<sc-if>` / `<sc-for>` / `ref="{{ }}"` bindings, and
`support.js` (69KB) parses and renders it at load. Images live in a
`.image-slots.state.json` sidecar as inline data URIs, written by `image-slot.js`
(65KB) only when `window.omelette.writeFile` is present — that is, only inside
the authoring tool that generated the site.

The site is committed and GitHub Pages ready (`index.html`, `resume.html`,
`.nojekyll`), but has not been pushed yet.

## Problem

Two costs, in order of what actually matters:

1. **The maintainer writes Next.js, not `x-dc`.** Three of the six projects on
   this very site are Next.js builds. Every edit to the portfolio currently
   means relearning a bespoke runtime with no documentation outside its own
   source.
2. **Images require the authoring tool.** Outside it, slots are read-only
   (`image-slot.js:1086`), so adding a project screenshot means returning to the
   editor rather than adding a file.

Note: problem 2 alone did not justify a rebuild — swapping `<image-slot>` for
plain `<img>` in the existing HTML would have solved it. Problem 1 is the reason.

## Goals

- Same site: same sections, copy, type, grid, and motion character.
- Maintainable by a Next.js developer with no bespoke-runtime knowledge.
- Adding a project = edit one typed file + drop an image in a folder.
- Deploys to GitHub Pages on push.

## Non-goals

- No CMS, no admin UI, no database. GitHub Pages serves static files only;
  an upload UI would require a server and different hosting.
- No redesign. Visual parity is the success criterion, not improvement.
- No blog, no analytics, no i18n.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Hosting | GitHub Pages | Free, already set up. Constrains Next.js to static export. |
| Fidelity | Full port, motion rebuilt declaratively | Keeps the signed-off design; drops ~200 lines of imperative scroll code. |
| Styling | Tailwind v4, tokens ported into `@theme` | User's choice. Token sharing is the mitigation against visual drift. |
| Content | Typed `content/projects.ts` | Right size for 5 projects; compile-time safety. |
| Deploy | GitHub Actions | No build output committed; push-to-deploy. |

## Architecture

```
app/
  layout.tsx           root layout, font loading, globals.css import
  page.tsx             portfolio — composes the five sections
  resume/page.tsx      the resume, ported from resume.html
  globals.css          @import "tailwindcss" + @theme token block
components/
  Nav.tsx              fixed bar, revealed past the hero
  Hero.tsx             sticky stage + monitor mockup
  WorkTrack.tsx        horizontal scroll-snap track
  ProjectCard.tsx      card + case-study disclosure
  Services.tsx
  About.tsx
  Contact.tsx
content/
  projects.ts          Project[] — ported verbatim from index.html
  site.ts              hero / about / contact copy
public/
  images/              screenshots and portrait
  .nojekyll
.github/workflows/deploy.yml
next.config.ts
```

Each component owns one section, takes its content as props from `content/`,
and holds no cross-section state. `ProjectCard` is the only one with
interactivity, and that is delegated to native `<details>`.

`resume/page.tsx` is a single-column document page — the current `resume.html`
is driven by `doc-page.js` purely for layout, with no interactivity — so it
ports to plain JSX using the same tokens, and `doc-page.js` is dropped with the
rest of the runtime.

### Versions

`create-next-app@latest` pins the Next.js and Tailwind versions at scaffold
time; they are recorded in `package.json` and not asserted here. The `@theme`
approach above assumes Tailwind v4's CSS-first configuration. If the scaffold
installs a version that configures differently, the token port adapts to that
version's mechanism — sharing the token values with the design system is the
requirement, `@theme` is only the current means.

## Content model

```ts
// content/projects.ts
export type Project = {
  title: string;
  url: string;
  domain: string;
  body: string;        // one-line summary on the card
  tags: string[];
  product: string;     // case study: what it is
  built: string;       // case study: what I built
  stack: string;
  image: string | null;  // path under /images, or null for the placeholder state
};
```

The six existing records (Masarra, Givitude, Mubaader, Mubaader Realtor, Theqa Invest,
Hamoo) port verbatim from the `data` array in `index.html`. The derived fields
computed at render time in the current code — `num` (zero-padded index), `open`,
`closed`, `toggle`, `toggleLabel`, `slotId`, `slotHint` — are not stored. `num`
derives from array index; the rest are replaced by `<details>`.

## Design tokens

The `:root` block in `_ds/modernist-*/styles.css` moves into a Tailwind v4
`@theme` block in `globals.css`. The existing names already match Tailwind's
convention, so the port is near-verbatim and utilities generate automatically:

| Token | Generated utility |
|---|---|
| `--color-accent-500` | `bg-accent-500`, `text-accent-500`, `border-accent-500` |
| `--color-neutral-700` | `bg-neutral-700`, `text-neutral-700` |
| `--font-heading` | `font-heading` |
| `--radius-md: 0px` | `rounded-md` resolves to 0 |
| `--shadow-md` | `shadow-md` |

Values are copied unchanged, including the `color-mix()` expressions for
`--color-divider` and the shadow ramp. `--font-heading-weight: 800` has no
Tailwind token type and stays a plain custom property.

The Archivo font currently loads via a Google Fonts `@import` in the
stylesheet. It moves to `next/font/google`, which self-hosts it — removing a
third-party request and the layout shift that comes with it.

## Motion

Two effects, both currently driven by rAF loops with manual measurement.

**Hero zoom.** A 300vh stage with a sticky pane; a monitor mockup scales up as
the stage scrolls past. Rebuilt with `animation-timeline: scroll()` on the
stage. CSS scroll-driven animations are not Baseline — supported in Chrome/Edge
115+ and Safari 18+/26, but still behind a flag in Firefox stable as of
Firefox 152 (June 2026), roughly 84% global support.

Because the hero's entire purpose is the scroll animation, absence is not
graceful degradation — it would be three screens of nothing. The fallback is a
designed state:

```css
@supports not (animation-timeline: scroll()) {
  .stage { height: 100vh; }   /* normal hero, monitor at final size */
}
```

The same collapse applies under `prefers-reduced-motion: reduce`, which the
current implementation already honours.

**Work track.** Horizontal scrolling rebuilt with native overflow plus
`scroll-snap-type: x mandatory`. Universally supported, keyboard accessible,
and correct with touch — an improvement on the current JS version on mobile.

Net effect: zero scroll event listeners, no `ResizeObserver`, no rAF.

## Images

Slots become files under `public/images/`, referenced by path in
`projects.ts`. The two filled slots in the existing sidecar (`hero-backdrop`,
`hero-portrait`) are decoded from their base64 data URIs and written out as
`.webp` files during implementation — they are already WebP at 1200px max, so
this is a decode-and-save, not a re-encode.

The six project slots are currently empty. Their placeholder is an explicit
component state, not a missing image: a `--color-surface` block with the
project's domain in `--color-neutral-600`, sized to the same aspect ratio as a
real screenshot, so layout does not shift when one is added. A project with
`image: null` renders this; the type is `string | null` for that reason.

`next/image` requires `images: { unoptimized: true }` under static export, so it
provides no optimisation here. Plain `<img>` with explicit `width`/`height` is
used instead — same result, no import.

This deletes `support.js` (69KB), `image-slot.js` (65KB), `doc-page.js` (37KB)
and the 317KB sidecar: about 171KB of runtime JavaScript and 488KB in total.

## Deployment

`next.config.ts`:

```ts
export default {
  output: 'export',
  images: { unoptimized: true },
};
```

`.github/workflows/deploy.yml` — checkout, setup-node with npm cache,
`npm ci`, `npm run build`, `actions/upload-pages-artifact` on `out/`, then
`actions/deploy-pages`. Triggers on push to `main` plus `workflow_dispatch`.

Two Pages settings changes:

- Source switches from "Deploy from a branch" to "GitHub Actions".
- `public/.nojekyll` ships in the build output. Next.js emits `_next/`, which
  is the same underscore-prefix problem that would otherwise eat `_ds/`.

No `basePath` or `assetPrefix` is needed: the repo is a user site served from
the domain root.

## Verification

1. `npm run build` produces `out/` with no errors and no type errors.
2. Serve the current site and the built `out/` on two local ports. Screenshot
   both pages at 1280px and 375px and compare section by section.

   Blocking differences: section order, layout or grid structure, spacing that
   reads as different, type size or weight, colour, and the monitor mockup's
   proportions at the start and end of the scroll.

   Acceptable differences: font antialiasing, sub-pixel text metrics from the
   switch to self-hosted Archivo, and scrollbar rendering.
3. Confirm the hero fallback renders as a normal 100vh hero with the monitor at
   final size, by testing with scroll-driven animations unavailable. Confirm the
   same state under `prefers-reduced-motion: reduce`.
4. Confirm the work track scrolls by keyboard (Tab through cards, arrow keys)
   and under touch emulation.
5. Confirm no 404s in the built output and that `_next/` assets load — this is
   the check that catches a missing `.nojekyll` before it reaches production.

## Cutover

The old files (`index.html`, `resume.html`, `support.js`, `image-slot.js`,
`doc-page.js`, `_ds/`, `.image-slots.state.json`, `uploads/`) stay in place
until step 2 of verification passes and the user signs off. They are then
removed in a single commit, and remain recoverable from git history.

The site has not been pushed yet, so there is no live-site regression risk
during the rebuild.

## Risks

| Risk | Mitigation |
|---|---|
| Tailwind port drifts visually from the original | Tokens shared rather than values retyped; side-by-side diff before cutover |
| Scroll-driven animation unsupported in Firefox | Designed static fallback, not absence |
| Monitor mockup uses em-based internal scaling tied to a JS-computed root font size | Port the ratio to CSS custom properties driven by the same scroll timeline; verify at both widths |
| Build step is a new failure mode vs. opening an HTML file | CI runs the same `npm ci && npm run build` the developer runs locally |
