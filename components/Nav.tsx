import { site } from '@/content/site';
import styles from './hero.module.css';

// Ported from index.html:27-34. Fades in near the end of the hero scroll via
// the `--hero` view timeline (hero.module.css), not a scroll handler.
const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Nav() {
  return (
    <nav className={styles.nav}>
      {/* Full name on desktop, initials on phones — see .brandShort in
          hero.module.css. Both are rendered and CSS picks one, so the swap
          needs no JavaScript and no layout measurement. */}
      <span className={styles.navBrand}>
        <span className={styles.brandFull}>{site.hero.name}</span>
        <span className={styles.brandShort}>I.A.</span>
      </span>
      {LINKS.map(({ label, href }) => (
        <a key={href} className={styles.navLink} href={href}>
          {label}
        </a>
      ))}
      <a className={styles.navCta} href="/resume.pdf">
        Résumé
      </a>
    </nav>
  );
}
