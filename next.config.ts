import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // Next walks up looking for a workspace root and finds a stray
  // package.json / package-lock.json in the user's home directory, well
  // outside this repo. Pinning the root stops it inferring one and silences
  // the warning. __dirname is available because package.json declares no
  // "type", so this config is evaluated as CommonJS.
  turbopack: { root: __dirname },
  // Without this, `output: 'export'` names nested routes as flat sibling
  // files (out/resume.html) instead of out/resume/index.html. Plain <a
  // href="/resume"> tags (this project uses no next/link) request the
  // extensionless path; a bare static host serves that reliably only when
  // it resolves to a directory index, not a same-named .html sibling.
  trailingSlash: true,
};

export default nextConfig;
