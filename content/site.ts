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
    // Grouped rather than one flat run of tags, so a reader can see the shape
    // of the stack instead of scanning 19 chips. Mobile is its own group:
    // React Native and Flutter are a third of the "3 platforms" claim in the
    // at-a-glance stats, and folding them into Front end would misrepresent
    // them. Shopify items are drawn from the work already described elsewhere
    // on the page — the Hamoo case study and the Shopify service card.
    // Grouped rather than one flat run of tags, so a reader can see the shape
    // of the stack. app/resume/page.tsx derives its own Skills section from
    // this array, so the portfolio and the résumé cannot drift apart.
    // Shopify items are drawn from work already described elsewhere on the
    // page — the Hamoo case study and the Shopify service card.
    skills: [
      {
        title: "Front end",
        items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind", "Bootstrap"],
      },
      {
        title: "Back end",
        items: [
          "Node.js",
          "Express",
          ".NET",
          "C#",
          "C++",
          "Java",
          "Spring Boot",
          "PHP",
          "Laravel",
          "MongoDB",
          "PostgreSQL",
          "SQL",
          "REST APIs",
        ],
      },
      {
        title: "Mobile",
        items: ["React Native", "Flutter"],
      },
      {
        title: "DevOps",
        items: ["AWS", "EC2", "S3", "SES", "Route 53", "GoDaddy", "InMotion Hosting", "CI/CD", "Deployment"],
      },
      {
        title: "Shopify",
        items: [
          "Theme editing",
          "Liquid",
          "Payment integration",
          "Checkout configuration",
          "Catalogue structure",
          "App integration",
        ],
      },
    ] as { title: string; items: string[] }[],
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
