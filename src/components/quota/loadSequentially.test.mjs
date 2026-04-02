import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSequentially } from './loadSequentially.ts';

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

test('loadSequentially runs work one item at a time in order', async () => {
  const starts = [];
  const releases = [];
  let active = 0;
  let maxActive = 0;

  const runPromise = loadSequentially([1, 2, 3], async (item) => {
    starts.push(item);
    active += 1;
    maxActive = Math.max(maxActive, active);

    await new Promise((resolve) => {
      releases.push(() => {
        active -= 1;
        resolve();
      });
    });

    return item * 10;
  });

  await flush();
  assert.deepEqual(starts, [1]);
  assert.equal(maxActive, 1);

  releases.shift()?.();
  await flush();
  assert.deepEqual(starts, [1, 2]);
  assert.equal(maxActive, 1);

  releases.shift()?.();
  await flush();
  assert.deepEqual(starts, [1, 2, 3]);
  assert.equal(maxActive, 1);

  releases.shift()?.();
  const results = await runPromise;
  assert.deepEqual(results, [10, 20, 30]);
  assert.equal(maxActive, 1);
});
