// Ported verbatim from the `data` array in index.html (the old x-dc runtime).
// `num` (zero-padded index), `open`, `closed`, `toggle`, `toggleLabel`, `slotId`
// and `slotHint` were derived at render time in the old code and are not
// stored here — see docs/superpowers/specs/2026-08-18-nextjs-portfolio-design.md.

export type Project = {
  title: string;
  url: string;
  domain: string;
  body: string;
  tags: string[];
  product: string;
  built: string;
  stack: string;
  image: string | null;
};

export const projects: Project[] = [
  {
    title: "Masarra",
    url: "https://masarrakw.com",
    domain: "masarrakw.com",
    body: "An event booking platform in Kuwait — browse events, book and pay on the web or in the app.",
    tags: ["MERN", "React Native", "iOS + Android"],
    product:
      "Masarra lets people find and book events. It runs as a website and as a mobile app on both stores, sharing one backend.",
    built: "The whole product: API and database, the booking flow, the web front end and the React Native mobile app.",
    stack: "MongoDB, Express, React, Node.js, React Native, AWS",
    image: null,
  },
  {
    title: "Givitude",
    url: "https://givitudekw.com",
    domain: "givitudekw.com",
    body: "A gifting service — buying and sending gifts, with a Flutter app alongside the Next.js site.",
    tags: ["Next.js", "Flutter", "iOS + Android"],
    product:
      "Givitude is built around buying gifts. The website handles browsing and ordering; the mobile apps carry the same flow to iOS and Android.",
    built: "The Next.js website and the Flutter mobile apps, plus the backend and hosting behind both.",
    stack: "Next.js, Node.js, MongoDB, Flutter, AWS",
    image: null,
  },
  {
    title: "Mubaader",
    url: "https://mubaader.com",
    domain: "mubaader.com",
    body: "The company site for Mubaader Services — a landing page introducing the group and its divisions.",
    tags: ["MERN", "Landing page"],
    product:
      "Mubaader's main landing page: what the company does and how to reach it, as the entry point to the group's other sites.",
    built: "Built and deployed the site end to end, including content structure and hosting.",
    stack: "MongoDB, Express, React, Node.js",
    image: null,
  },
  {
    title: "Mubaader Realtor",
    url: "https://mubaaderealtor.com",
    domain: "mubaaderealtor.com",
    body: "The real estate arm — property listings and enquiries, built on Next.js.",
    tags: ["MERN", "Next.js", "Real estate"],
    product:
      "The real estate side of Mubaader: properties presented for sale and rent, with enquiries coming through the site.",
    built: "Front end, backend and listing management, plus deployment.",
    stack: "Next.js, MongoDB, Express, Node.js",
    image: null,
  },
  {
    title: "Theqa Invest",
    url: "https://theqainvest.com",
    domain: "theqainvest.com",
    body: "A landing page for Mubaader's investment sector.",
    tags: ["MERN", "Landing page"],
    product: "Theqa Invest presents the group's investment arm to prospective investors and partners.",
    built: "Designed the page structure, built it, and shipped it.",
    stack: "MongoDB, Express, React, Node.js",
    image: null,
  },
  {
    title: "Hamoo",
    url: "https://hamookw.com/",
    domain: "hamookw.com",
    body: "A Shopify store selling baby products — theme, catalogue and checkout.",
    tags: ["Shopify", "E-commerce", "Retail"],
    product: "Hamoo is a retail store for baby products, running on Shopify with a customised theme.",
    built: "Set up the store, customised the theme, structured the catalogue and configured checkout.",
    stack: "Shopify, Liquid",
    image: null,
  },
];
