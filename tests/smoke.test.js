import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MockTextNode } from './figma-mocks.js';

test('smoke: mocks instantiate', () => {
  const n = new MockTextNode({ characters: 'hi' });
  assert.equal(n.type, 'TEXT');
  assert.equal(n.characters, 'hi');
});
