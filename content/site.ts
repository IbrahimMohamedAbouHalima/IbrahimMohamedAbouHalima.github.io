// Ported verbatim from index.html (the old x-dc runtime). Source ranges:
//   hero:     index.html:36-91   (the animated hero "monitor" mockup)
//   glance:   index.html:97-114  (at-a-glance stat grid)
//   services: index.html:177-202
//   about:    index.html:206-257
//   contact:  index.html:261-272
//   footer:   index.html:275
//
// The shapes below adapt the plan's skeleton where the real content didn't
// fit it (see task-3-report.md for the reasoning):
//   - services: the section has a closing note after the four cards, so it's
//     `{ items, note }` rather than a bare array.
//   - about: the section also holds a skills tag list, an experience /
//     education timeline, and GitHub + résumé links, none of which the
//     `{ heading, paragraphs }` skeleton had room for.
//   - contact: there is no body paragraph in the source, but there is a
//     phone number alongside the email, so it's `{ heading, email, phone,
//     github }` rather than `{ heading, body, email }`.

export const site = {
  hero: {
    name: "Ibrahim Abou Halima",
    headline: "Full-stack + DevOps.",
    body: "I build products end to end — MERN and Next.js on the web, Flutter and React Native on mobile, Shopify for retail, and the AWS infrastructure underneath. Based in Kuwait, currently full-stack developer at Mubaader Services.",
    email: "ibrahim.ihab@hotmail.com",
    ctaPrimary: { label: "See the work", href: "#work" },
  },

  glance: [
    { label: "Products shipped live", value: "14" },
    { label: "Platforms — web, iOS, Android", value: "3" },
    { label: "Mobile stacks — Flutter, React Native", value: "2" },
    { label: "Developer, front to back", value: "1" },
  ] as { label: string; value: string }[],

  services: {
    items: [
      {
        title: "Full-stack web application",
        body: "API, database, dashboard and front end built together — MERN or Next.js, deployed and monitored.",
      },
      {
        title: "Mobile app",
        body: "Flutter or React Native for iOS and Android, sharing one backend with the web product.",
      },
      {
        title: "Shopify store",
        body: "Theme setup and customisation, product structure, apps and checkout for retail brands.",
      },
      {
        title: "DevOps & hosting",
        body: "AWS setup, deployment pipelines, domains and email, and keeping it running after launch.",
      },
    ] as { title: string; body: string }[],
    note: "Scope and price depend on the project. Send me what you have in mind and I'll come back with a quote.",
  },

  about: {
    heading: "Ibrahim Abou Halima",
    paragraphs: [
      "Full-stack, DevOps, mobile and Shopify developer in Kuwait. I've built and shipped fourteen live products — among them an event booking platform, a gifting app, real estate and investment sites, and a retail store — handling the web, the mobile apps and the infrastructure myself.",
      "Full-stack developer at Mubaader Services since March 2025, with a BSc in IT from Arab Open University.",
    ] as string[],
    links: [
      { label: "GitHub", href: "https://github.com/IbrahimMohamedAbouHalima" },
      { label: "Download résumé", href: "/resume.pdf" },
    ] as { label: string; href: string }[],
    skills: [
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "MongoDB",
      "React Native",
      "Flutter",
      "AWS",
      "DevOps",
      "Shopify",
      "JavaScript",
      "REST APIs",
    ] as string[],
    timeline: [
      {
        role: "Full Stack Developer — Mubaader Services",
        period: "Mar 2025 — Present",
      },
      {
        role: "BSc Information Technology — Arab Open University",
        period: "2022 — 2025",
      },
      {
        role: "Diploma, Aircraft Maintenance Engineering — College of Aviation Technology",
        period: "—",
      },
      { role: "IGCSE — English School Fahaheel", period: "—" },
    ] as { role: string; period: string }[],
  },

  contact: {
    heading: "Have something to build?",
    email: "ibrahim.ihab@hotmail.com",
    phone: { label: "+965 60450463", href: "tel:+96560450463" },
    github: {
      label: "GitHub",
      href: "https://github.com/IbrahimMohamedAbouHalima",
    },
  },

  footer: "© 2026 Ibrahim Abou Halima — Kuwait",
};
