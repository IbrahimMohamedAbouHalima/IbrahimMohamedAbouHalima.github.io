import type { Metadata } from 'next';
import Link from 'next/link';

// Next's stock 404 is unstyled black-on-white with no way back. This one uses
// the design system and gives the visitor somewhere to go.
export const metadata: Metadata = { title: 'Not found — Ibrahim Abou Halima' };

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[1200px] flex-col justify-center gap-6 px-6">
      <p className="m-0 text-[13px] tracking-[0.08em] uppercase text-accent-700">404</p>
      <h1 className="m-0 max-w-[16ch] text-[clamp(40px,8vw,72px)] leading-[1.04] tracking-[-0.02em]">
        That page doesn&rsquo;t exist.
      </h1>
      <p className="m-0 max-w-[46ch] text-[15.5px] leading-[26px]" style={{ color: 'color-mix(in srgb, var(--color-text) 78%, transparent)' }}>
        The link may be out of date, or the address mistyped.
      </p>
      <div className="mt-2 flex flex-wrap gap-3">
        <Link
          className="inline-flex items-center border border-accent bg-accent px-4 py-3 font-heading text-[14px] leading-[1.2] text-bg"
          href="/"
        >
          Back to the portfolio
        </Link>
        <a
          className="inline-flex items-center border border-accent px-4 py-3 font-heading text-[14px] leading-[1.2] text-accent hover:bg-[color-mix(in_srgb,var(--color-accent)_10%,transparent)]"
          href="/resume.pdf"
        >
          Résumé
        </a>
      </div>
    </main>
  );
}
