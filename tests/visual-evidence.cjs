const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {companies} = require('../.test-build/radar.js');
const observed = require('../lib/visual-evidence.json');
const context = require('../lib/context-captures.json');
test('all 12 companies have real PNG assets and attributed website evidence', () => {
  assert.equal(observed.length, companies.length);
  for (const company of companies) {
    const image = readFileSync(`public/captures/${company.id}.png`);
    assert.equal(image.subarray(0,8).toString('hex'), '89504e470d0a1a0a');
    assert.ok(image.length > 10000);
    assert.ok(observed[Number(company.id)].cta.length > 2);
    for (const url of observed[Number(company.id)].socialLinks) assert.equal(new URL(url).protocol, 'https:');
  }
  for (const [id, capture] of Object.entries(context)) {
    assert.equal(new URL(capture.url).hostname.replace(/^www\./,''), companies.find(c => c.id === id).domain);
    assert.equal(capture.provider, 'Context.dev');
    assert.equal(capture.screenshot, true);
    assert.ok(capture.ctas.length > 0);
  }
});
