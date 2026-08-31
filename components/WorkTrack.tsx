import type { CSSProperties } from 'react';
import { projects } from '@/content/projects';
import ProjectCard from './ProjectCard';
import styles from './work.module.css';

// Ported from index.html:119-135. The old site pinned a 500vh section with
// `position: sticky` and translated the track horizontally from a scroll
// handler, so vertical scrolling drove horizontal movement and normal
// scrolling resumed once the cards ran out.
//
// That behaviour is restored here, but declaratively: a named view-timeline
// on the stage drives a translate keyframe, so there is still no scroll
// listener, no ResizeObserver and no rAF. See work.module.css for the
// geometry and the two fallback paths.
//
// `--count` has to come from here because the travel distance depends on how
// many cards there are, and CSS cannot count DOM children.
export default function WorkTrack() {
  return (
    <section
      id="work"
      className={styles.stage}
      style={{ '--count': projects.length } as CSSProperties}
    >
      <div className={styles.pane}>
        <div className={styles.header}>
          <span className={styles.kicker}>Selected work</span>

          {/* The current number was static. The old site rewrote it from the
              scroll handler; here the whole column of numbers is rendered and
              a one-line window slides over it on the same timeline that drives
              the track, stepped so it lands on whole numbers. No JavaScript,
              and it stays in sync with the track by construction rather than
              by a second calculation. aria-live is deliberately absent — this
              is decorative chrome, not an announcement. */}
          <span className={styles.counter}>
            <span className={styles.counterWindow}>
              <span className={styles.counterList}>
                {projects.map((project, index) => (
                  <span key={project.domain}>{String(index + 1).padStart(2, '0')}</span>
                ))}
              </span>
            </span>
            {` / ${String(projects.length).padStart(2, '0')}`}
          </span>
        </div>

        <div className={styles.track} tabIndex={0} aria-label="Selected work">
          {projects.map((project, index) => (
            <ProjectCard key={project.domain} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
