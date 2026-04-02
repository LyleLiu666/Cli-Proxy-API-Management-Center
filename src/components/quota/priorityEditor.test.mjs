import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPriorityPatch, readPriorityValue } from './priorityEditor.ts';

test('readPriorityValue returns parsed integer priorities only', () => {
  assert.equal(readPriorityValue({ priority: 8 }), 8);
  assert.equal(readPriorityValue({ priority: '-3' }), -3);
  assert.equal(readPriorityValue({ priority: ' 12 ' }), 12);
  assert.equal(readPriorityValue({ priority: '1.5' }), undefined);
  assert.equal(readPriorityValue({ priority: 'hello' }), undefined);
  assert.equal(readPriorityValue({}), undefined);
});

test('buildPriorityPatch clears priority when input is blank', () => {
  assert.deepEqual(buildPriorityPatch(''), { priority: 0 });
  assert.deepEqual(buildPriorityPatch('   '), { priority: 0 });
});

test('buildPriorityPatch keeps valid integers and rejects invalid input', () => {
  assert.deepEqual(buildPriorityPatch('10'), { priority: 10 });
  assert.deepEqual(buildPriorityPatch(' -1 '), { priority: -1 });
  assert.equal(buildPriorityPatch('2.5'), null);
  assert.equal(buildPriorityPatch('abc'), null);
});
