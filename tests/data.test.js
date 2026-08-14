import test from 'node:test';
import assert from 'node:assert/strict';
import { builders, sources } from '../src/data.js';

test('builder research contains a broad prioritized target set', () => {
  assert.ok(builders.length >= 14);
  assert.equal(builders.filter((builder) => builder.tier === 'priority').length, 5);
  assert.ok(builders.every((builder) => builder.source.startsWith('https://')));
  assert.ok(builders.every((builder) => builder.score >= 0 && builder.score <= 100));
});

test('primary source ledger includes compliance and industry sources', () => {
  const urls = sources.map(([, url]) => url);
  assert.ok(urls.some((url) => url.includes('consumerfinance.gov')));
  assert.ok(urls.some((url) => url.includes('northstatebia.org')));
  assert.ok(urls.some((url) => url.includes('dre.ca.gov')));
  assert.ok(urls.some((url) => url.includes('newamericanfunding.com')));
});
