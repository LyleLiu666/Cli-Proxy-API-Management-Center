import test from 'node:test';
import assert from 'node:assert/strict';
import { buildParsedLogEntries, filterParsedLogEntries } from './logSearch.ts';

test('buildParsedLogEntries caches lowercase text and parsed output', () => {
  const [entry] = buildParsedLogEntries([
    '[2026-04-21 10:00:00] INFO GET /v1/chat/completions 200 hello world',
  ]);

  assert.equal(
    entry.raw,
    '[2026-04-21 10:00:00] INFO GET /v1/chat/completions 200 hello world'
  );
  assert.equal(
    entry.rawLower,
    '[2026-04-21 10:00:00] info get /v1/chat/completions 200 hello world'
  );
  assert.equal(entry.parsed.method, 'GET');
  assert.equal(entry.parsed.statusCode, 200);
});

test('filterParsedLogEntries applies management-prefix and search filtering together', () => {
  const entries = buildParsedLogEntries([
    'INFO GET /v1/chat/completions 200 ok',
    'INFO GET /v0/management/config 200 ignored',
    'ERROR POST /v1/messages 500 broken',
  ]);

  const filtered = filterParsedLogEntries(entries, {
    hideManagementLogs: true,
    managementPrefix: '/v0/management',
    searchQuery: 'broken',
  });

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.parsed.path, '/v1/messages');
});
