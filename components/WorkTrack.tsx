import { projects } from '@/content/projects';
import ProjectCard from './ProjectCard';
import styles from './work.module.css';

// Ported from index.html:119-135. Old behaviour: a 500vh section pinned via
// `position: sticky` and translated horizontally by a scroll handler.
// Approved deviation: a natively scrollable, scroll-snapping track — shorter
// page, keyboard- and touch-operable, zero scroll listeners.
export default function WorkTrack() {
  return (
    <section id="work">
      <div className={styles.header}>
        <span className={styles.kicker}>Selected work</span>
        <span className={styles.counter}>{`01 / ${String(projects.length).padStart(2, '0')}`}</span>
      </div>

      <div className={styles.track} tabIndex={0}>
        {projects.map((project, index) => (
          <ProjectCard key={project.domain} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
