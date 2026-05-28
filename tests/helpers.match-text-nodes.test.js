import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MockNode, MockTextNode } from './figma-mocks.js';
import { readFileSync } from 'node:fs';

const src = readFileSync(
  new URL('../skills/figma-writing/helpers/figma-helpers.js', import.meta.url),
  'utf8'
);
const harness = new Function(`${src}\nreturn { matchTextNodesByIndex };`);
const { matchTextNodesByIndex } = harness();

function makeButton(label) {
  return new MockNode({
    name: `Button-${label}`,
    children: [new MockTextNode({ characters: label })],
  });
}

test('matchTextNodesByIndex: pairs text nodes by pre-order traversal', () => {
  const sourceA = makeButton('Save');
  const sourceB = makeButton('Cancel');
  const targetA = makeButton('Save');
  const targetB = makeButton('Cancel');
  const sourceFrame = new MockNode({ children: [sourceA, sourceB] });
  const targetFrame = new MockNode({ children: [targetA, targetB] });

  const pairs = matchTextNodesByIndex(sourceFrame, targetFrame);
  assert.equal(pairs.length, 2);
  assert.equal(pairs[0][0].characters, 'Save');
  assert.equal(pairs[0][1], targetA.children[0]);
  assert.equal(pairs[1][0].characters, 'Cancel');
  assert.equal(pairs[1][1], targetB.children[0]);
});

test('matchTextNodesByIndex: throws on structural drift (different text counts)', () => {
  const source = new MockNode({ children: [new MockTextNode(), new MockTextNode()] });
  const target = new MockNode({ children: [new MockTextNode()] });
  assert.throws(() => matchTextNodesByIndex(source, target), /count mismatch/);
});

test('matchTextNodesByIndex: returns empty array when no text nodes', () => {
  const source = new MockNode({ children: [new MockNode({ name: 'x' })] });
  const target = new MockNode({ children: [new MockNode({ name: 'x' })] });
  const pairs = matchTextNodesByIndex(source, target);
  assert.deepEqual(pairs, []);
});

test('matchTextNodesByIndex: nested text nodes are matched in pre-order', () => {
  const sourceNested = new MockNode({
    children: [
      new MockNode({ children: [new MockTextNode({ characters: 'inner' })] }),
      new MockTextNode({ characters: 'outer' }),
    ],
  });
  const targetNested = new MockNode({
    children: [
      new MockNode({ children: [new MockTextNode({ characters: 'inner' })] }),
      new MockTextNode({ characters: 'outer' }),
    ],
  });
  const pairs = matchTextNodesByIndex(sourceNested, targetNested);
  assert.equal(pairs[0][0].characters, 'inner');
  assert.equal(pairs[1][0].characters, 'outer');
});
