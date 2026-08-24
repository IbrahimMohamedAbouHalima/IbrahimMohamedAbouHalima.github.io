import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // Without this, `output: 'export'` names nested routes as flat sibling
  // files (out/resume.html) instead of out/resume/index.html. Plain <a
  // href="/resume"> tags (this project uses no next/link) request the
  // extensionless path; a bare static host serves that reliably only when
  // it resolves to a directory index, not a same-named .html sibling.
  trailingSlash: true,
};

export default nextConfig;
