import { site } from '@/content/site';

// Ported from index.html:206-257. Tag typography (.tag/.tag-neutral) and
// ghost-button typography (.btn/.btn-ghost) reconstructed from the old
// design system's _ds/modernist-*/styles.css since only layout, not type,
// was inline in the source markup.
//
// The source has no responsive override for the 5fr/7fr column split (only
// #services-grid gets a breakpoint in index.html's inline <style>) — but
// unlike the source's static prototype, this renders on real phones, and the
// 5fr column comes out ~140px wide there, wrapping single words per line.
// Deviation: stack to one column below the same 1000px cutoff Services uses,
// so the two sections switch to their wide layout at the same breakpoint.
export default function About() {
  const { about } = site;

  return (
    <section
      id="about"
      className="grid grid-cols-1 gap-x-14 gap-y-10 py-14 min-[1000px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
    >
      <div>
        <span className="mb-6 block text-[13px] tracking-[0.08em] uppercase text-accent-700">
          About
        </span>
        <h2 className="text-[32px] leading-[40px] tracking-[-0.015em]">{about.heading}</h2>
        {about.paragraphs.map((paragraph, i) => (
          <p
            key={i}
            className="mt-5 max-w-[46ch] text-[15.5px] leading-[26px]"
            style={{ color: 'color-mix(in srgb, var(--color-text) 82%, transparent)' }}
          >
            {paragraph}
          </p>
        ))}
        <div className="mt-7 flex flex-wrap gap-3">
          {about.links.map((link) => {
            const external = link.href.startsWith('http');
            return (
              <a
                key={link.href}
                className="inline-flex items-center justify-center gap-1.5 border border-transparent px-1 py-2 font-heading font-extrabold text-sm leading-[1.2] text-accent"
                href={link.href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener' : undefined}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>

      <div className="grid gap-8">
        <div>
          <p
            className="mb-4 text-[13px] tracking-[0.08em] uppercase"
            style={{ color: 'color-mix(in srgb, var(--color-text) 70%, transparent)' }}
          >
            Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {about.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center bg-neutral-100 px-[10px] py-[3px] text-[11px] tracking-[0.02em] text-neutral-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p
            className="mb-4 text-[13px] tracking-[0.08em] uppercase"
            style={{ color: 'color-mix(in srgb, var(--color-text) 70%, transparent)' }}
          >
            Experience &amp; education
          </p>
          <div className="grid">
            {about.timeline.map((entry) => (
              <div
                key={entry.role}
                className="flex items-baseline justify-between gap-6 py-[14px] [border-top:2px_solid_var(--color-divider)]"
              >
                <p className="text-[15px] leading-[24px]">{entry.role}</p>
                <p
                  className="whitespace-nowrap text-[13px] leading-[24px]"
                  style={{
                    color: 'color-mix(in srgb, var(--color-text) 70%, transparent)',
                    fontFeatureSettings: "'tnum' 1",
                  }}
                >
                  {entry.period}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
