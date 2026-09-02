import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  variable: '--font-heading',
  display: 'swap',
});

const TITLE = 'Ibrahim Abou Halima — Full-stack + DevOps';
const DESCRIPTION =
  'Full-stack developer building products end to end — MERN and Next.js on the web, Flutter and React Native on mobile. Based in Kuwait.';

// Open Graph needs ABSOLUTE urls, so Next has to know where the site lives.
// Inferred from the GitHub handle on the résumé; override with
// NEXT_PUBLIC_SITE_URL if the repo is named differently or a custom domain
// gets pointed at it. Wrong value here does not break the page — it only
// means share previews fetch the image from the wrong host.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ibrahimmohamedabouhalima.github.io';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  // Without these a shared link renders as a bare url — no title, no image.
  // app/opengraph-image.png is picked up by filename; Next emits the og:image
  // tags and its dimensions for it, and reuses it for Twitter.
  openGraph: {
    type: 'website',
    siteName: 'Ibrahim Abou Halima',
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
