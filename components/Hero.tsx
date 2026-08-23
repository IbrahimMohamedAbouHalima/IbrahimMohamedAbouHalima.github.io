import { site } from '@/content/site';
import styles from './hero.module.css';

// Ported from index.html:36-91. The monitor's internals are sized in `em` on
// purpose — see the header of hero.module.css before touching any of them.
export default function Hero() {
  const { hero } = site;

  return (
    <section className={styles.stage}>
      <div className={styles.pane}>
        <div className={styles.backdrop} />

        <div className={styles.column}>
          <div className={styles.monitor}>
            <div className={styles.frame} />
            <div className={styles.screen}>
              <div className={styles.screenNav}>
                <span className={styles.screenBrand}>{hero.name}</span>
                <span className={styles.screenLinks}>
                  <span>Work</span>
                  <span>Services</span>
                  <span>About</span>
                  <span className={styles.screenCta}>Résumé</span>
                </span>
              </div>

              <div className={styles.screenBody}>
                <div>
                  <h1 className={styles.headline}>{hero.headline}</h1>
                  <p className={styles.lede}>{hero.body}</p>
                  <div className={styles.actions}>
                    <a className={styles.actionPrimary} href={hero.ctaPrimary.href}>
                      {hero.ctaPrimary.label}
                    </a>
                    <a className={styles.actionSecondary} href={`mailto:${hero.email}`}>
                      {hero.email}
                    </a>
                  </div>
                </div>

                <figure className={`grayscale ${styles.portrait}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/hero-portrait.webp"
                    width={486}
                    height={486}
                    alt={hero.name}
                  />
                </figure>
              </div>
            </div>
          </div>

          <div className={styles.stand}>
            <div className={styles.standNeck} />
            <div className={styles.standBase} />
          </div>
        </div>

        {/* UI chrome, not content — index.html:89 */}
        <p className={styles.hint}>Scroll to zoom in</p>
      </div>
    </section>
  );
}
