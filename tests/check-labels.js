// Checks the "§" anchors of a rendered example page.
// usage: NODE_PATH=$(npm root -g) node tests/check-labels.js <path to example.html>
// A numbered element's title holds one "§" anchor, and a cross-reference in a name
// (the unnumbered solution) stays a link with no anchor.
const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  const file = process.argv[2];
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage();
  await page.goto('file://' + file);
  await page.waitForTimeout(500);
  const rows = await page.$$eval('.callout-title-container', (els) => els.map((el) => ({
    text: el.textContent.trim(),
    anchors: el.querySelectorAll('a.callouty-anchor').length,
    labels: el.querySelectorAll('.callouty-label').length,
    xrefs: el.querySelectorAll('a.quarto-xref').length,
  })));
  const numbered = rows.filter((r) => /^(Note|Tip)?(Theorem|Solution|Exercise|Proposition|Corollary|Definition)[\s\u00a0]\d/.test(r.text));
  assert(numbered.length > 0, 'no numbered titles found');
  numbered.forEach((r) => assert.strictEqual(r.anchors, 1, 'numbered title needs one anchor: ' + r.text));
  const named = rows.filter((r) => /Solution to/.test(r.text) && r.xrefs > 0 && r.anchors === 0);
  assert(named.length >= 1, 'the unnumbered solution must keep its cross-reference link and get no anchor');
  const withNameXref = rows.filter((r) => r.anchors === 1 && r.xrefs >= 1 && /Solution[\s\u00a0]\d/.test(r.text));
  assert(withNameXref.length >= 1, 'the numbered solution keeps the link in its name');
  console.log('ok', rows.length, 'titles checked');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
