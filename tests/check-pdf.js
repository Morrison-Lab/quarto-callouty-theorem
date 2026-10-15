// Checks the PDF of tests/cases.qmd: no bar titled only "Note" or "Tip" and no heading printed twice.
// usage: node tests/check-pdf.js <path to cases.pdf>   (needs pdftotext)
const { execFileSync } = require('child_process');
const assert = require('assert');
const path = require('path');

assert(process.argv[2], 'usage: node tests/check-pdf.js <path to cases.pdf>');
const text = execFileSync('pdftotext', ['-layout', path.resolve(process.argv[2]), '-'], { encoding: 'utf8' });
const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
assert(lines.some((l) => /^Theorem 0\.\d/.test(l)), 'theorem headings not found in the PDF text');
lines.forEach((l) => assert(!/^(Note|Tip|Important|Warning|Caution)$/.test(l), 'a bar titled only by its type: "' + l + '"'));
['Explicit appearance', 'Override off', 'Per-div appearance', 'Remark with override off'].forEach((name) => {
  const n = lines.filter((l) => l.includes(name)).length;
  assert.strictEqual(n, 1, '"' + name + '" is printed ' + n + ' times');
});
console.log('ok', lines.length, 'lines checked');
