// The résumé's visible text, derived from the built page. Shared so that the
// hash make-resume-pdf.mjs stamps and the hash verify-build.mjs checks are
// produced by identical code — two separate implementations would drift and
// the freshness check would cry wolf.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export function resumeText(outDir) {
  const html = readFileSync(join(outDir, 'resume', 'index.html'), 'utf8');
  const body = html.slice(html.indexOf('<body'), html.indexOf('</body>'));
  return (
    body
      // Next's RSC payload is inline script data, not visible copy, and its
      // chunk ids change between builds — hashing it would flag every build.
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<style[\s\S]*?<\/style>/g, '')
      // The download button is chrome, not résumé content.
      .replace(/<a[^>]*class="[^"]*no-print[\s\S]*?<\/a>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&#x27;|&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}
