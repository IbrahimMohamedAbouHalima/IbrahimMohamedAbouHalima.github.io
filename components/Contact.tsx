import { site } from '@/content/site';

// Ported from index.html:261-272. Full-bleed accent field: the section
// itself carries the accent background/text colour (bg-accent text-bg) with
// no max-width, and only the inner wrapper centers the content at 1200px —
// same split the old inline styles used (section vs. inner div).
export default function Contact() {
  const { contact } = site;

  const links = [
    { label: contact.email, href: `mailto:${contact.email}`, external: false },
    { label: contact.phone.label, href: contact.phone.href, external: false },
    { label: contact.github.label, href: contact.github.href, external: true },
  ];

  return (
    <section id="contact" className="bg-accent text-bg">
      <div className="mx-auto max-w-[1200px] px-6 py-[84px]">
        <h3 className="-ml-[0.058em] text-[clamp(34px,4.2vw,56px)] leading-[1.06] tracking-[-0.015em]">
          {contact.heading}
        </h3>
        <div className="mt-10 flex flex-wrap gap-3">
          {links.map((link) => (
            <a
              key={link.href}
              className="inline-flex items-center justify-center gap-1.5 border px-1 py-2 font-heading font-extrabold text-sm leading-[1.2]"
              style={{ color: 'var(--color-bg)', borderColor: 'var(--color-bg)' }}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener' : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
