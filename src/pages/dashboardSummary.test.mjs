import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveDashboardSummary } from './dashboardSummary.ts';

test('deriveDashboardSummary reads counts from cached config', () => {
  const summary = deriveDashboardSummary({
    apiKeys: ['a', 'b'],
    geminiApiKeys: [{ apiKey: 'g-1' }],
    codexApiKeys: [{ apiKey: 'c-1' }, { apiKey: 'c-2' }],
    claudeApiKeys: [],
    openaiCompatibility: [{ name: 'openai-1', baseUrl: 'https://example.com', apiKeyEntries: [] }],
  });

  assert.equal(summary.apiKeys, 2);
  assert.deepEqual(summary.providerStats, {
    gemini: 1,
    codex: 2,
    claude: 0,
    openai: 1,
  });
  assert.equal(summary.providerStatsReady, true);
  assert.equal(summary.hasProviderStats, true);
  assert.equal(summary.totalProviderKeys, 4);
});

test('deriveDashboardSummary keeps partial state when config is missing', () => {
  const summary = deriveDashboardSummary(null);

  assert.equal(summary.apiKeys, null);
  assert.deepEqual(summary.providerStats, {
    gemini: null,
    codex: null,
    claude: null,
    openai: null,
  });
  assert.equal(summary.providerStatsReady, false);
  assert.equal(summary.hasProviderStats, false);
  assert.equal(summary.totalProviderKeys, 0);
});
