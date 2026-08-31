'use client';

import styles from './print-button.module.css';

// The only client component on the site. A static export has no server to
// render a PDF, and committing a generated one would go stale the moment the
// résumé copy changed — so this opens the browser's own print dialog, where
// "Save as PDF" is the default destination on every major platform. The PDF
// is therefore always exactly what the page says.
//
// Hidden from the printed output itself via .no-print (app/globals.css).
export default function PrintButton() {
  return (
    <button type="button" className={`no-print ${styles.button}`} onClick={() => window.print()}>
      Download PDF
    </button>
  );
}
