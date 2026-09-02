import type { Project } from '@/content/projects';
import styles from './work.module.css';

// Ported from index.html:127-166. The old "closed" content (body, tags,
// thumbnail) was always visible; only the case study (product/built/stack)
// was JS-toggled. That toggle is now native <details>/<summary>.
export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const num = String(index + 1).padStart(2, '0');

  return (
    <article className={styles.card}>
      <div className={styles.titleRow}>
        <p className={styles.num}>{num}</p>
        <h2 className={styles.title}>{project.title}</h2>
      </div>

      <p className={styles.body}>{project.body}</p>

      <ul className={styles.tags}>
        {project.tags.map((tag) => (
          <li key={tag} className={styles.tag}>
            {tag}
          </li>
        ))}
      </ul>

      <figure className={styles.figure}>
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={styles.image}
            src={project.image}
            alt={`${project.title} screenshot`}
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className={styles.placeholder}>{project.domain}</div>
        )}
      </figure>

      <div className={styles.actions}>
        <details>
          <summary className={styles.summary}>Case study</summary>
          <div className={styles.caseStudy}>
            <div>
              <p className={styles.caseLabel}>The product</p>
              <p className={styles.caseText}>{project.product}</p>
            </div>
            <div>
              <p className={styles.caseLabel}>What I built</p>
              <p className={styles.caseText}>{project.built}</p>
            </div>
            <div>
              <p className={styles.caseLabel}>Stack</p>
              <p className={styles.caseText}>{project.stack}</p>
            </div>
          </div>
        </details>

        {/* Old site: sibling .btn.btn-ghost buttons beside each other
           (index.html:163-166). Kept as a sibling of <details>, not nested in
           <summary>, so this stays a single interactive control per element —
           nesting an <a> inside <summary> would double as a toggle too. */}
        <a className={styles.link} href={project.url} target="_blank" rel="noopener noreferrer">
          {project.domain}
        </a>
      </div>
    </article>
  );
}
