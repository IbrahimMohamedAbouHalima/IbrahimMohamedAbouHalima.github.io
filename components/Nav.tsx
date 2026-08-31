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
      <span className={styles.navBrand}>{site.hero.name}</span>
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
