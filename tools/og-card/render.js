// Render the link-preview image: node tools/og-card/render.js  (needs Playwright; run from the repository root)
// Writes assets/og-card.jpg (1200×630). Optional: FONT_DIR=<folder with the .woff2 files> to render without network fonts.
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const root = path.resolve(__dirname, '..', '..');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto('file://' + path.join(__dirname, 'og-card.html'));
  if (process.env.FONT_DIR) {
    const f = n => 'file://' + path.join(process.env.FONT_DIR, n);
    await p.addStyleTag({ content: `
      @font-face { font-family: "Source Serif 4"; font-weight: 600; src: url(${f('source-serif-4-latin-600-normal.woff2')}); }
      @font-face { font-family: "IBM Plex Sans"; font-weight: 400; src: url(${f('ibm-plex-sans-latin-400-normal.woff2')}); }
      @font-face { font-family: "IBM Plex Sans"; font-weight: 500; src: url(${f('ibm-plex-sans-latin-500-normal.woff2')}); }
      @font-face { font-family: "IBM Plex Mono"; font-weight: 500; src: url(${f('ibm-plex-mono-latin-500-normal.woff2')}); }` });
  }
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  const png = path.join(root, 'assets', 'og-card.png');
  await p.screenshot({ path: png });
  await b.close();
  console.log('wrote', png, '(convert to assets/og-card.jpg, quality ~85)');
})();
