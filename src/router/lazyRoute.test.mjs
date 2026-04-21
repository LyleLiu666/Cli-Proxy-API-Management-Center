import test from 'node:test';
import assert from 'node:assert/strict';
import { loadNamedRouteExport } from './lazyRoute.ts';

function DemoPage() {
  return null;
}

test('loadNamedRouteExport maps a named export into a lazy default export', async () => {
  const lazyModule = await loadNamedRouteExport(async () => ({ DemoPage }), 'DemoPage');
  assert.equal(lazyModule.default, DemoPage);
});

test('loadNamedRouteExport throws when the named export is missing', async () => {
  await assert.rejects(
    () => loadNamedRouteExport(async () => ({ DemoPage }), 'MissingPage'),
    /Missing route export: MissingPage/
  );
});
