import { site } from '@/content/site';

// Ported from index.html:97-114 (the at-a-glance stat grid).
export default function Glance() {
  return (
    <section
      aria-label="At a glance"
      className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-8 py-12"
    >
      {site.glance.map((stat) => (
        <div key={stat.label}>
          <p
            className="font-heading font-extrabold text-[44px] leading-[52px] text-accent"
            style={{ marginLeft: '-0.045em', fontFeatureSettings: "'tnum' 1" }}
          >
            {stat.value}
          </p>
          <p
            className="mt-2 text-[13px] tracking-[0.08em] uppercase"
            style={{ color: 'color-mix(in srgb, var(--color-text) 70%, transparent)' }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </section>
  );
}
