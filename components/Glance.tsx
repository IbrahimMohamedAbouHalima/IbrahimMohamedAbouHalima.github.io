import { site } from '@/content/site';
import styles from './glance.module.css';

// Ported from index.html:97-114 (the at-a-glance stat grid).
//
// Each numeral sits inside a mask so it can rise into view as the section
// enters, staggered across the four. See glance.module.css — the wrapper is a
// <div> rather than a <span> because a <p> cannot be nested inside phrasing
// content.
export default function Glance() {
  return (
    <section
      aria-label="At a glance"
      className={`${styles.section} grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-8 py-12`}
    >
      {site.glance.map((stat) => (
        <div key={stat.label} className={styles.item}>
          <div className={styles.numberMask}>
            <p
              className={`${styles.number} font-heading font-extrabold text-[44px] leading-[52px] text-accent`}
              style={{ marginLeft: '-0.045em', fontFeatureSettings: "'tnum' 1" }}
            >
              {stat.value}
            </p>
          </div>
          <p
            className={`${styles.label} mt-2 text-[13px] tracking-[0.08em] uppercase`}
            style={{ color: 'color-mix(in srgb, var(--color-text) 70%, transparent)' }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </section>
  );
}
