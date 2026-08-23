import { site } from '@/content/site';

// Ported from index.html:177-202. Card typography (.card-kicker/.card-title/
// .card-body) reconstructed from the old design system's
// _ds/modernist-*/styles.css since it wasn't inline in the source markup.
//
// Grid breakpoints carried over from the old page's inline <style>
// (index.html:20-21): >=1000px -> 4 columns, <=520px -> 1 column (the second
// approximated by the 640px cutoff below, per task-6-brief.md). Both
// variants use the arbitrary min-[Npx] form rather than mixing in the named
// `sm:` breakpoint: Tailwind v4 emits named breakpoints after arbitrary ones
// regardless of pixel value, so `sm:grid-cols-2 min-[1000px]:grid-cols-4`
// compiles with the sm rule LAST — it then wins the cascade at every width
// above 640px and grid-cols-4 never applies. Two arbitrary min-[Npx]
// variants sort numerically against each other and don't hit this.
export default function Services() {
  return (
    <section id="services" className="py-14">
      <span className="mb-10 block text-[13px] tracking-[0.08em] uppercase text-accent-700">
        Services
      </span>

      <div className="grid grid-cols-1 gap-[2px] min-[640px]:grid-cols-2 min-[1000px]:grid-cols-4">
        {site.services.items.map((item, i) => (
          <div
            key={item.title}
            className="flex flex-col gap-2 bg-surface p-7 [border:2px_solid_var(--color-divider)]"
          >
            <p className="text-[10px] tracking-[0.1em] uppercase text-accent">
              {String(i + 1).padStart(2, '0')}
            </p>
            <p className="font-heading font-extrabold text-[17px] leading-[1.2]">{item.title}</p>
            <p className="flex-1 text-[13px] opacity-80">{item.body}</p>
          </div>
        ))}
      </div>

      <p
        className="mt-8 max-w-[52ch] text-[15px] leading-[26px]"
        style={{ color: 'color-mix(in srgb, var(--color-text) 78%, transparent)' }}
      >
        {site.services.note}
      </p>
    </section>
  );
}
