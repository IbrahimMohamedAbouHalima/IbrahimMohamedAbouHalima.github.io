import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Glance from '@/components/Glance';
import WorkTrack from '@/components/WorkTrack';
import Services from '@/components/Services';
import About from '@/components/About';
import Contact from '@/components/Contact';
import { site } from '@/content/site';

// WorkTrack is deliberately NOT nested inside the max-w-[1200px] wrapper
// below: its own CSS (work.module.css) centers its content via
// `max(24px, calc((100% - 1200px) / 2 + 24px))` padding, which assumes its
// containing block is the full viewport width, exactly like #work sat
// outside the old page's `max-width: 1200px` wrapper divs (index.html:93,
// 119, 173). Nesting it here would double-constrain that calc.
export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <main>
        <div className="mx-auto w-full max-w-[1200px] px-6">
          <Glance />
        </div>
        <WorkTrack />
        <div className="mx-auto w-full max-w-[1200px] px-6">
          <Services />
          <About />
        </div>
      </main>
      <Contact />
      <footer
        className="mx-auto w-full max-w-[1200px] px-6 py-14 text-[13px] leading-[26px]"
        style={{ color: 'color-mix(in srgb, var(--color-text) 70%, transparent)' }}
      >
        {site.footer}
      </footer>
    </>
  );
}
