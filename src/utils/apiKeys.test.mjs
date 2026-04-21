import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeApiKeyList } from './apiKeys.ts';

test('normalizeApiKeyList trims, preserves order, and supports legacy object shapes', () => {
  assert.deepEqual(
    normalizeApiKeyList([
      ' key-1 ',
      { 'api-key': 'key-2' },
      { apiKey: 'key-3' },
      { key: 'key-4' },
      { Key: 'key-5' },
      'key-1',
      '',
      null,
    ]),
    ['key-1', 'key-2', 'key-3', 'key-4', 'key-5', 'key-1']
  );
});
