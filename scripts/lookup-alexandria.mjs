// Operator-only refresh. Only company-linked Instagram URLs; no personal-contact projection.
import Firecrawl from '@mendable/firecrawl-js';
import {readFile, writeFile} from 'node:fs/promises';
const metadataUrl = new URL('../lib/alexandria-coverage.json', import.meta.url);
const observed = JSON.parse(await readFile(new URL('../lib/visual-evidence.json', import.meta.url), 'utf8'));
const ids = process.argv.slice(2);
if (!process.env.FIRECRAWL_API_KEY || !ids.length || ids.length > 3) {
  console.error('Set FIRECRAWL_API_KEY in .env.local and supply 1–3 seed IDs. Basic projection can cost 35 Firecrawl credits per nonempty lookup.');
  process.exit(1);
}
const targets = ids.map(id => {
  const url = observed[Number(id)]?.socialLinks.find(url => /(^|\.)instagram\.com$/.test(new URL(url).hostname));
  if (!url || !/^\d+$/.test(id)) throw new Error(`Seed ${id} has no reviewed company Instagram link.`);
  return {id, url};
});
const client = new Firecrawl({apiKey: process.env.FIRECRAWL_API_KEY});
const coverage = JSON.parse(await readFile(metadataUrl, 'utf8'));
for (const {id, url} of targets) {
  const result = await client.scrape({alexandria: {provider: 'oriane', capability: 'instagram/profile-lookup', options: {url, projection: 'basic'}}});
  const entry = result.alexandria?.[0];
  if (!entry || entry.upstreamStatus !== 200 || entry.error) throw new Error('Provider did not return a successful lookup. Existing coverage preserved.');
  // Publish coverage only. Do not copy raw provider records or identity joins into the demo.
  coverage.profiles[id] = {url, provider: 'Oriane via Firecrawl Alexandria', checkedAt: new Date().toISOString(), records: entry.records, creditsCost: entry.creditsCost, status: entry.records > 0 ? 'Indexed record returned; identity review pending' : 'Not found in provider index'};
  await writeFile(metadataUrl, JSON.stringify(coverage, null, 2) + '\n');
  console.log(`Seed ${id}: ${coverage.profiles[id].status}; ${entry.creditsCost} credits. No raw profile data published.`);
}
