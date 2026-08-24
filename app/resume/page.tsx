import type { Metadata } from 'next';
import { site } from '@/content/site';

// Ported verbatim from resume.html (130 lines, entire file). The source is a
// standalone print-style document — doc-page.js there provides layout only,
// no interactivity, no site nav/footer — so this route stays just as bare:
// résumé content only, single column, tokens from globals.css.
export const metadata: Metadata = { title: 'Ibrahim Abou Halima — Résumé' };

// resume.html:28-31 — plain <span>s in the source, not links. Kept that way.
const CONTACT = [
  'ibrahim.ihab@hotmail.com',
  '+965 60450463',
  'Kuwait',
  'github.com/IbrahimMohamedAbouHalima',
];

// resume.html:37
const SUMMARY =
  "Full-stack developer building products end to end — MERN and Next.js on the web, Flutter and React Native on mobile, Shopify for retail, and the AWS infrastructure underneath. Six live products shipped, front end, backend and deployment handled solo.";

// resume.html:43-50
const EXPERIENCE = {
  role: 'Full Stack Developer — Mubaader Services',
  period: 'Mar 2025 — Present',
  bullets: [
    "Built and shipped the group's web properties — the Mubaader landing page, Mubaader Realtor for real estate, and Theqa Invest for the investment arm.",
    'Work across the whole stack: MongoDB, Express, React and Next.js front ends, plus AWS hosting and deployment.',
    'Deliver mobile apps alongside the web products in React Native and Flutter.',
  ],
};

// resume.html:59-82
const PROJECTS = [
  { title: 'Masarra — masarrakw.com', body: 'Event booking platform, website and mobile app. MERN, React Native.' },
  {
    title: 'Givitude — givitudekw.com',
    body: 'Gift buying service. Next.js website, Flutter apps for iOS and Android.',
  },
  {
    title: 'Mubaader Realtor — mubaaderealtor.com',
    body: 'Real estate listings and enquiries. MERN with Next.js.',
  },
  { title: 'Theqa Invest — theqainvest.com', body: 'Landing page for the investment sector. MERN stack.' },
  { title: 'Mubaader — mubaader.com', body: 'Company landing page. MERN stack.' },
  {
    title: 'Hamoo — hamookw.com',
    body: 'Shopify store for baby products — theme, catalogue and checkout.',
  },
];

// resume.html:91-103. Titles carry a literal "&" — JSX re-escapes it to
// "&amp;" when serialized, same as the source markup (resume.html:96, 100).
const SKILLS = [
  { title: 'Front end', body: 'React, Next.js, JavaScript, HTML, CSS' },
  { title: 'Back end & DevOps', body: 'Node.js, Express, MongoDB, REST APIs, AWS, deployment' },
  { title: 'Mobile & commerce', body: 'Flutter, React Native, Shopify, Liquid' },
];

// resume.html:111-122. Only the first row's date is numeric — only it carries
// the tabular-number feature setting in the source (resume.html:113); the
// other two rows show a bare "—" and never set it (resume.html:117, 121).
const EDUCATION = [
  { school: 'BSc Information Technology — Arab Open University', period: '2022 — 2025', tnum: true },
  { school: 'Diploma, Aircraft Maintenance Engineering — College of Aviation Technology', period: '—' },
  { school: 'IGCSE — English School Fahaheel', period: '—' },
];

const dim70 = { color: 'color-mix(in srgb, var(--color-text) 70%, transparent)' };
const dim78 = { color: 'color-mix(in srgb, var(--color-text) 78%, transparent)' };
const tnum = { fontFeatureSettings: "'tnum' 1" };

// A 2px divider bar (resume.html uses <hr style="height:2px;background:...">
// four times). Reconstructed as a border-top on the <hr> itself, matching the
// [border-top:2px_solid_var(--color-divider)] pattern About.tsx already uses
// for the same token — same visual result, no extra utility to fight preflight.
function Divider() {
  return <hr className="m-0 [border-top:2px_solid_var(--color-divider)]" />;
}

export default function ResumePage() {
  return (
    // resume.html:22 sets `padding: 0.6in 0.7in` on the document body — the
    // "paper" margins doc-page.js used to draw a rounded/shadowed card
    // around. That chrome doesn't come back (design system: no rounded
    // corners, ever), just the margins. 0.7in each side leaves ~240px of
    // content below Tailwind's `sm` (640px) breakpoint, which clips the
    // "Selected projects" two-column grid's longer titles — px-6 there
    // matches the pre-fix padding this page already shipped with.
    <main className="mx-auto flex w-full max-w-[820px] flex-col gap-[20px] px-6 py-[0.6in] sm:px-[0.7in]">
      <header>
        <h1 className="-ml-[0.058em] text-[40px] leading-[1.06] tracking-[-0.02em]">{site.hero.name}</h1>
        <p className="mt-[10px] text-[12.5px] leading-[20px] tracking-[0.06em] uppercase text-accent-700">
          Full-stack · DevOps · Mobile · Shopify developer
        </p>
        <div className="mt-[12px] flex flex-wrap gap-x-[20px] gap-y-[4px] text-[11.5px] leading-[18px]" style={dim78}>
          {CONTACT.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      </header>

      <Divider />

      <p className="m-0 max-w-[82ch] text-[12.5px] leading-[20px]">{SUMMARY}</p>

      <section>
        <h2 className="mb-[12px] text-[12px] tracking-[0.08em] uppercase">Experience</h2>
        <div>
          <div className="flex items-baseline justify-between gap-[16px]">
            <p className="m-0 font-heading font-extrabold text-[14px] leading-[20px]">{EXPERIENCE.role}</p>
            <p className="m-0 whitespace-nowrap text-[11.5px] leading-[20px]" style={{ ...dim70, ...tnum }}>
              {EXPERIENCE.period}
            </p>
          </div>
          <ul className="mt-[6px] list-disc pl-4 text-[12px] leading-[19px]">
            {EXPERIENCE.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      </section>

      <Divider />

      <section>
        <h2 className="mb-[12px] text-[12px] tracking-[0.08em] uppercase">Selected projects</h2>
        <div className="grid grid-cols-2 gap-x-[32px] gap-y-[12px]">
          {PROJECTS.map((project) => (
            <div key={project.title}>
              <p className="m-0 font-heading font-extrabold text-[13px] leading-[18px]">{project.title}</p>
              <p className="mt-[3px] text-[11.5px] leading-[18px]" style={dim78}>
                {project.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      <section>
        <h2 className="mb-[12px] text-[12px] tracking-[0.08em] uppercase">Skills</h2>
        <div className="grid grid-cols-3 gap-x-[32px] gap-y-[12px] text-[11.5px] leading-[18px]">
          {SKILLS.map((group) => (
            <div key={group.title}>
              <p className="m-0 font-bold">{group.title}</p>
              <p className="mt-[2px]" style={dim78}>
                {group.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      <section>
        <h2 className="mb-[12px] text-[12px] tracking-[0.08em] uppercase">Education</h2>
        <div className="grid gap-[6px]">
          {EDUCATION.map((entry) => (
            <div key={entry.school} className="flex items-baseline justify-between gap-[16px]">
              <p className="m-0 text-[12.5px] leading-[20px]">{entry.school}</p>
              <p
                className="m-0 whitespace-nowrap text-[11.5px] leading-[20px]"
                style={entry.tnum ? { ...dim70, ...tnum } : dim70}
              >
                {entry.period}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
