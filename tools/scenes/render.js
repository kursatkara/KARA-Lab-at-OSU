// Render scenes to PNG: node render.js out_dir scene1 scene2 ...
const { chromium } = require('playwright');
(async () => {
  const [out, ...names] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const n of names) {
    const p = await b.newPage({ viewport: { width: 1200, height: 900 } });
    const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await p.goto(`http://localhost:8820/index.html?s=${n}`);
    try { await p.waitForFunction(() => window.__done === true, null, { timeout: 120000 }); }
    catch (e) { console.log(n, 'TIMEOUT', errs); await p.close(); continue; }
    await p.waitForTimeout(300);
    await p.locator('#stage').screenshot({ path: `${out}/${n}.png` });
    console.log(n, 'ok', errs.length ? errs : '');
    await p.close();
  }
  await b.close();
})();
