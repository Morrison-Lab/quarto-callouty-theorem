// Checks the HTML of tests/cases.qmd.
// usage: NODE_PATH=$(npm root -g) node tests/check-cases.js <path to cases.html>
// A title that cites an element nested in its own body ("Proof (see @lem-inner)") keeps
// that citation as a link and gets no "§" anchor, since the target is not the element itself.
const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  const file = process.argv[2];
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
  const page = await browser.newPage();
  await page.goto('file://' + file);
  await page.waitForTimeout(500);
  const rows = await page.$$eval('.callout-title-container', (els) => els.map((el) => ({
    text: el.textContent.trim(),
    anchors: el.querySelectorAll('a.callouty-anchor').length,
    xrefs: el.querySelectorAll('a.quarto-xref').length,
  })));
  const proof = rows.filter((r) => /^(Note|Tip)?Proof/.test(r.text));
  assert(proof.length >= 1, 'proof title not found');
  proof.forEach((r) => {
    assert.strictEqual(r.anchors, 0, 'a nested target must not get an anchor: ' + r.text);
    assert(r.xrefs >= 1, 'the citation stays a link: ' + r.text);
  });
  const own = rows.filter((r) => /(Theorem|Definition)[\s ]\d/.test(r.text));
  own.forEach((r) => assert.strictEqual(r.anchors, 1, 'own label needs one anchor: ' + r.text));
  console.log('ok', rows.length, 'titles checked');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
