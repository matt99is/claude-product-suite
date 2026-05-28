import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MockAutoLayoutFrame, MockStaticFrame, MockNode } from './figma-mocks.js';
import { readFileSync } from 'node:fs';

// Helpers are not modular ES exports (they are pasted as a preamble in use_figma).
// To unit-test, we wrap the helper source into a Function constructor and pull
// the desired function reference out. This avoids restructuring the production
// file purely for tests.
const src = readFileSync(
  new URL('../skills/figma-writing/helpers/figma-helpers.js', import.meta.url),
  'utf8'
);
const harness = new Function(`${src}\nreturn { insertChildSafe };`);
const { insertChildSafe } = harness();

test('insertChildSafe: explicit index inserts at that position on auto-layout', () => {
  const parent = new MockAutoLayoutFrame();
  const a = new MockNode({ name: 'a' });
  const b = new MockNode({ name: 'b' });
  insertChildSafe(parent, 0, a);
  insertChildSafe(parent, 1, b);
  assert.deepEqual(parent.children.map(c => c.name), ['a', 'b']);
  assert.deepEqual(parent._inserts.map(i => i.index), [0, 1]);
});

test('insertChildSafe: omitted index on auto-layout falls back to end with a warning', () => {
  const parent = new MockAutoLayoutFrame();
  const a = new MockNode({ name: 'a' });
  const result = insertChildSafe(parent, undefined, a);
  assert.equal(result.ok, true);
  assert.equal(result.warnings.length, 1);
  assert.match(result.warnings[0], /no index provided for auto-layout/);
  assert.equal(parent.children[0].name, 'a');
});

test('insertChildSafe: omitted index on static frame uses appendChild silently', () => {
  const parent = new MockStaticFrame();
  const a = new MockNode({ name: 'a' });
  const result = insertChildSafe(parent, undefined, a);
  assert.equal(result.ok, true);
  assert.equal(result.warnings.length, 0);
  assert.equal(parent._inserts[0].index, 'append');
});
