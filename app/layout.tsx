import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ibrahim Abou Halima — Full-stack + DevOps',
  description:
    'Full-stack developer building products end to end — MERN and Next.js on the web, Flutter and React Native on mobile. Based in Kuwait.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
